import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Crea il trasportatore per l'invio delle email
export const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",  // Usa il servizio predefinito per Gmail
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false  // Accetta certificati non validi (solo per sviluppo)
    },
    debug: true,  // Attiva il debug
  });
};

// Funzione per inviare email di reset password
export const sendPasswordResetEmail = async (to, token, userName) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password.html?token=${token}`;

    const mailOptions = {
      from: `"EventHub" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Reset Password EventHub',
      html: `
        <h1>Reset Password EventHub</h1>
        <h3>Ciao ${userName},</h3>
        <p>Hai richiesto di reimpostare la tua password. Clicca il link qui sotto:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #6B46C1; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>Il link scadrà tra 1 ora.</p>
        <p>Se non hai richiesto il reset della password, ignora questa email.</p>
      `
    };

    // Invia l'email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email di reset inviata a ${to}`);
    return info;
  } catch (error) {
    console.error('Errore nell\'invio dell\'email di reset password:', error);
    throw new Error('Errore nell\'invio dell\'email di reset password. Riprova più tardi.');
  }
};
