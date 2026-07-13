import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createZellePayment,
  verifyZellePayment,
  adminConfirmZellePayment,
} from "../controllers/zelleController.js";

const router = express.Router();
// User routes - require authentication
router.post("/create", authMiddleware, createZellePayment);
router.post("/verify", authMiddleware, verifyZellePayment);

// Admin route - require admin authentication
router.put(
  "/admin/confirm/:appointmentId",
  authMiddleware,
  adminConfirmZellePayment,
);

export default router;
