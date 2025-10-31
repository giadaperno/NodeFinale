import express from "express";
import { registerToEvent, cancelRegistration, getUserRegisteredEvents } from "../controllers/registration.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Ottieni gli eventi a cui l'utente è iscritto
router.get("/user-events", verifyToken, getUserRegisteredEvents);

// Iscrizione a un evento
router.post("/", verifyToken, registerToEvent);

// Annulla iscrizione a un evento (ora con body)
router.delete("/:eventId", verifyToken, cancelRegistration);

export default router;
