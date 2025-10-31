import jwt from 'jsonwebtoken';

// Chiave segreta per la firma dei token JWT
import dotenv from 'dotenv';

dotenv.config();
// Usa la chiave dal file .env se presente, altrimenti fallback (solo per sviluppo)
export const jwtSecret = process.env.JWT_SECRET || "dev_fallback_jwt_secret_please_change";

// Funzione per generare un token JWT
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    jwtSecret,
    { expiresIn: "24h" }
  );
};