import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
<<<<<<< HEAD
import { approveEvent, rejectEvent, blockUser, unblockUser, getAllUsers } from "../controllers/admin.controller.js";

const router = express.Router();

// Eventi
router.put("/events/:id/approve", verifyToken, verifyAdmin, approveEvent);
router.put("/events/:id/reject", verifyToken, verifyAdmin, rejectEvent);

// Utenti
router.put("/users/:id/block", verifyToken, verifyAdmin, blockUser);
router.put("/users/:id/unblock", verifyToken, verifyAdmin, unblockUser);
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
=======
import { approveEvent, rejectEvent, blockUser } from "../controllers/admin.controller.js";

const router = express.Router();

// Rotte admin
router.put("/events/:id/approve", verifyToken, verifyAdmin, approveEvent);
router.put("/events/:id/reject", verifyToken, verifyAdmin, rejectEvent);
router.put("/users/:id/block", verifyToken, verifyAdmin, blockUser);
>>>>>>> 1552c31 (parte funzionante)

export default router;
