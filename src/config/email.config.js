import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Crea il trasportatore per l'invio delle email
export const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error("Configurazione email mancante: impostare EMAIL_USER e EMAIL_PASS nel .env");
  }

  // Configurazione SMTP esplicita (Gmail)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : true, // 465 => secure true
    auth: { user, pass },
  });
};

// Funzione per inviare email di reset password
export const sendPasswordResetEmail = async (to, token, userName) => {
  try {
    const transporter = createTransporter();

    // Verifica connessione SMTP per messaggi di errore più chiari
    try {
      await transporter.verify();
      console.log("SMTP verificato correttamente per", process.env.EMAIL_USER);
    } catch (verifyErr) {
      console.error("SMTP verify fallito:", verifyErr.message);
      throw new Error("Configurazione SMTP non valida: " + verifyErr.message);
    }

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
    console.log(`Email di reset inviata a ${to} (messageId: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error('Errore nell\'invio dell\'email di reset password:', error);
    throw new Error('Errore nell\'invio dell\'email di reset password. Riprova più tardi.');
  }
};
