import express from "express";
import { sendMessage, getEventMessages } from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Ottieni messaggi di un evento specifico
router.get("/:eventId", verifyToken, getEventMessages);

// Invia un nuovo messaggio
router.post("/", verifyToken, sendMessage);

export default router;