import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Verifica token (DEPRECATO - Usare verifyToken.js invece)
// Questo file è mantenuto solo per retrocompatibilità
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Accesso negato" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token non valido" });
    req.user = user;
    next();
  });
};
