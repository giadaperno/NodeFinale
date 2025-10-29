import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js"; 
import { forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

// /api/auth/register
router.post("/register", register);

// /api/auth/login
router.post("/login", login);


// /api/auth/logout (protetto)
router.post("/logout", verifyToken, logout); 

// /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;