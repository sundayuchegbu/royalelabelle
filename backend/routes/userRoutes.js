import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getUserAppointments,
  getAppointment,
  cancelAppointment,
  rescheduleAppointment,
} from "../controllers/userAppointmentController.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/appointments", getUserAppointments);
router.get("/appointments/:id", getAppointment);
router.put("/appointments/:id/cancel", cancelAppointment);
router.put("/appointments/:id/reschedule", rescheduleAppointment);

export default router;
