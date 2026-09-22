import express from "express";
import authMiddleware from "../middleware/auth.js";
import { validateAppointment } from "../middleware/validation.js";
import {
  createAppointment,
  rescheduleAppointment,
  confirmAppointment,
  updateAppointment,
  continuePayment,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Protected routes
router.use(authMiddleware);

// Create appointment - POST /api/appointments
router.post("/", createAppointment);

// Confirm appointment (after payment)
router.put("/:id/confirm", confirmAppointment);

// Update appointment
router.put("/:id", updateAppointment);

// Reschedule appointment
router.put("/:id/reschedule", rescheduleAppointment);

// Continue payment
router.get("/:id/continue-payment", continuePayment);

export default router;
