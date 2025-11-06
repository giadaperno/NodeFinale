import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  deleteMyAccount,
  getUserProfile,
  promoteToAdmin
} from "../controllers/user.controller.js";

const router = express.Router();

// Profilo utente corrente
router.get("/me", verifyToken, getMyProfile);

// Modifica profilo utente corrente
router.put("/me", verifyToken, updateMyProfile);

// Cambia password
router.put("/me/password", verifyToken, changePassword);

// Elimina account
router.delete("/me", verifyToken, deleteMyAccount);

// TEMPORANEO: Promuovi utente ad admin (solo per sviluppo - da rimuovere in produzione)
router.patch("/promote-to-admin/:id", promoteToAdmin);

// Profilo pubblico di un utente (opzionale, può essere usato per mostrare chi ha creato un evento)
router.get("/:id", getUserProfile);

export default router;
