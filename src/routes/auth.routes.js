import express from "express";
<<<<<<< HEAD
import { register, login, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js"; 
=======
import { register, login } from "../controllers/auth.controller.js";
>>>>>>> 1552c31 (parte funzionante)

const router = express.Router();

// /api/auth/register
router.post("/register", register);

// /api/auth/login
router.post("/login", login);

<<<<<<< HEAD
// /api/auth/logout (protetto)
router.post("/logout", verifyToken, logout); 

=======
>>>>>>> 1552c31 (parte funzionante)
export default router;
