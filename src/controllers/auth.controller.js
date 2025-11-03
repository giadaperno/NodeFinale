import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import { Op } from "sequelize";
import { sendPasswordResetEmail } from "../config/email.config.js";

dotenv.config();

// Registrazione
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email già registrata" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res
      .status(201)
      .json({ message: "Utente registrato con successo", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Email o password non validi" });

    if (!user.isActive)
      return res.status(403).json({ message: "Account bloccato" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Email o password non validi" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
  message: "Login effettuato",
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

// Logout (con token obbligatorio)
export const logout = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log(`Logout richiesto da utente ID: ${userId}`);
    res.status(200).json({ message: "Logout effettuato con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore durante il logout", error });
  }
};

// Richiesta reset password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000; // 1 ora

    user.resetToken = resetToken;
    user.resetTokenExpiry = expiry;
    await user.save();

    try {
      // Utilizzo della nuova funzione sendPasswordResetEmail
      await sendPasswordResetEmail(user.email, resetToken, user.name);
      
      res.json({ message: "Email di reset inviata" });
    } catch (emailError) {
      console.error("Errore nell'invio dell'email:", emailError);
      res.status(500).json({ 
        message: "Errore nell'invio dell'email di reset",
        error: emailError.message
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: Date.now() },
      },
    });

    if (!user)
      return res.status(400).json({ message: "Token non valido o scaduto" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Password aggiornata con successo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};
