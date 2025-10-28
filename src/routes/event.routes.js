import express from "express";
import { createEvent, listEvents } from "../controllers/event.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Crea evento (solo utenti autenticati)
router.post("/", verifyToken, createEvent);

// Lista eventi pubblici
router.get("/", listEvents);

export default router;
