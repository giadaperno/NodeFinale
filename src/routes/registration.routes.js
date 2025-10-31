import express from "express";
import { registerToEvent, cancelRegistration } from "../controllers/registration.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Iscrizione a un evento
router.post("/", verifyToken, registerToEvent);

// Annulla iscrizione a un evento (ora con params)
router.delete("/:eventId", verifyToken, cancelRegistration);

export default router;
