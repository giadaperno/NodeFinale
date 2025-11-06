import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

import { 
  approveEvent, 
  rejectEvent, 
  blockUser, 
  unblockUser, 
  getAllUsers, 
  getPendingEvents, 
  getAllEvents,
  getStats
} from "../controllers/admin.controller.js";

const router = express.Router();

// Eventi
router.put("/events/:id/approve", verifyToken, verifyAdmin, approveEvent);
router.put("/events/:id/reject", verifyToken, verifyAdmin, rejectEvent);

// Utenti
router.put("/users/:id/block", verifyToken, verifyAdmin, blockUser);
router.put("/users/:id/unblock", verifyToken, verifyAdmin, unblockUser);
router.get("/users", verifyToken, verifyAdmin, getAllUsers);

// Eventi in attesa di approvazione e tutti gli eventi
router.get("/events/pending", verifyToken, verifyAdmin, getPendingEvents);
router.get("/events/all", verifyToken, verifyAdmin, getAllEvents);

// Statistiche generali
router.get("/stats", verifyToken, verifyAdmin, getStats);

export default router;
