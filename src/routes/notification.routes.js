import express from "express";
import { 
  getAllNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  deleteReadNotifications 
} from "../controllers/notification.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

// Tutte le route richiedono autenticazione admin
router.get("/", verifyToken, verifyAdmin, getAllNotifications);
router.put("/:id/read", verifyToken, verifyAdmin, markAsRead);
router.put("/read-all", verifyToken, verifyAdmin, markAllAsRead);
router.delete("/:id", verifyToken, verifyAdmin, deleteNotification);
router.delete("/read/all", verifyToken, verifyAdmin, deleteReadNotifications);

export default router;
