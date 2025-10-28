import express from "express";
import { registerToEvent } from "../controllers/registration.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, registerToEvent);

export default router;
