import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getUserAppointments,
  getAppointment,
  cancelAppointment,
  rescheduleAppointment,
  continuePayment,
} from "../controllers/appointmentController.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all user appointments
router.get("/appointments", getUserAppointments);

// Get single appointment
router.get("/appointments/:id", getAppointment);

// Cancel appointment
router.put("/appointments/:id/cancel", cancelAppointment);

// Reschedule appointment
router.put("/appointments/:id/reschedule", rescheduleAppointment);

// Continue payment for pending appointment
router.get("/appointments/:id/continue-payment", continuePayment);

export default router;
