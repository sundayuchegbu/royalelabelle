import express from "express";
import authMiddleware from "../middleware/auth.js";
import { adminAuth, checkPermission } from "../middleware/adminAuth.js";
import { validateConsultation } from "../middleware/validation.js";
import {
  createConsultation,
  getMyConsultation,
  updateConsultation,
  deleteConsultation,
  cleanupExpiredConsultations,
} from "../controllers/consultationController.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create consultation with validation
router.post("/", validateConsultation, createConsultation);

// Get user's consultation
router.get("/me", getMyConsultation);

// Update consultation
router.put("/:id", updateConsultation);

// Admin routes
router.delete(
  "/:id",
  adminAuth,
  checkPermission("manageClients"),
  deleteConsultation,
);
router.post(
  "/cleanup",
  adminAuth,
  checkPermission("manageClients"),
  cleanupExpiredConsultations,
);

export default router;
