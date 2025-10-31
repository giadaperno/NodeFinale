import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  createEvent,
  listEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getUserCreatedEvents,
  getUserRegisteredEvents
} from "../controllers/event.controller.js";

const router = express.Router();

// Crea un evento (solo utenti autenticati)
router.post("/", verifyToken, createEvent);

// Lista tutti gli eventi approvati (pubblico)
router.get("/", listEvents);

// Dettaglio di un singolo evento
router.get("/:id", getEventById);

// Modifica un evento (solo creatore o admin)
router.put("/:id", verifyToken, updateEvent);

// Cancella un evento (solo creatore o admin)
router.delete("/:id", verifyToken, deleteEvent);

// Eventi creati dall'utente autenticato
router.get("/my-created", verifyToken, getUserCreatedEvents);

//Eventi a cui l'utente autenticato si è registrato
router.get("/my-registered", verifyToken, getUserRegisteredEvents);
export default router;
