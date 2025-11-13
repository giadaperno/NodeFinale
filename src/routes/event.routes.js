import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createEvent,
  listEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getUserCreatedEvents,
  reportEvent,
  getEventParticipants,
  getPopularEvents,
  getUpcomingEvents
} from "../controllers/event.controller.js";

const router = express.Router();

// Crea un evento (solo utenti autenticati)
router.post("/", verifyToken, createEvent);

// Lista tutti gli eventi approvati (pubblico)
router.get("/", listEvents);

// Eventi più popolari (pubblico)
router.get("/popular", getPopularEvents);

// Eventi futuri (pubblico)
router.get("/upcoming", getUpcomingEvents);

// Eventi creati dall'utente autenticato
router.get("/my-created", verifyToken, getUserCreatedEvents);

// Lista partecipanti di un evento (pubblico o protetto, a tua scelta)
router.get("/:id/participants", getEventParticipants);

// Segnala un evento (notifica agli admin)
router.post("/:id/report", verifyToken, reportEvent);

// Dettaglio di un singolo evento (DOPO le route specifiche!)
router.get("/:id", getEventById);

// Modifica un evento (solo creatore o admin)
router.put("/:id", verifyToken, updateEvent);

// Cancella un evento (solo creatore o admin)
router.delete("/:id", verifyToken, deleteEvent);

export default router;
