import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Configurazione più robusta per Nodemailer
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // Gmail richiede STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Aumenta il timeout per evitare errori ETIMEDOUT
  connectionTimeout: 10000, // 10 secondi
  // Opzioni aggiuntive per debug
  logger: true,
  debug: true, // Mostra log di debug
  tls: {
    // Non fallire su certificati non validi
    rejectUnauthorized: false
  }
});
