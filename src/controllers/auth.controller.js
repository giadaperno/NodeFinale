import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Registrazione
export const register = async (req, res) => {
  const { name, email, password, role } = req.body; // aggiunto role

  try {
    // Controlla se email esiste
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email già registrata" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea utente
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // se non passato, default "user"
    });

    res.status(201).json({ message: "Utente registrato con successo", userId: user.id });
  } catch (error) {
    console.error(error); // per vedere l’errore reale nel terminale
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Email o password non validi" });

    // Verifica password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Email o password non validi" });

    // Genera JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login effettuato", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server", error: error.message });
  }
};
<<<<<<< HEAD

export const logout = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log(`Logout richiesto da utente ID: ${userId}`);
    res.status(200).json({ message: "Logout effettuato con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore durante il logout", error });
  }
};
=======
>>>>>>> 1552c31 (parte funzionante)
