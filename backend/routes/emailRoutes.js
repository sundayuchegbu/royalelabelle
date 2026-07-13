import express from "express";
import {
  sendWelcomeEmail,
  sendBookingConfirmationEmail,
  sendAdminBookingNotification,
  testEmailConnection,
  sendAppointmentConfirmedEmail,
} from "../services/emailService.js";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// Test welcome email
router.post("/test-welcome", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const result = await sendWelcomeEmail(user);
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Test booking confirmation email
router.post("/test-booking", async (req, res) => {
  try {
    const { email, appointmentId } = req.body;
    const user = await User.findOne({ email });
    const appointment = await Appointment.findById(appointmentId);

    if (!user || !appointment) {
      return res.status(404).json({
        success: false,
        message: "User or appointment not found",
      });
    }

    const result = await sendBookingConfirmationEmail(user, appointment);
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Test admin notification
router.post("/test-admin-notification", async (req, res) => {
  try {
    const { email, appointmentId } = req.body;
    const user = await User.findOne({ email });
    const appointment = await Appointment.findById(appointmentId);

    if (!user || !appointment) {
      return res.status(404).json({
        success: false,
        message: "User or appointment not found",
      });
    }

    const result = await sendAdminBookingNotification(appointment, user);
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get admin users
router.get("/admins", async (req, res) => {
  try {
    const admins = await User.find({
      role: { $in: ["admin", "super_admin"] },
      isActive: true,
    }).select("name email");

    res.status(200).json({
      success: true,
      admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Test appointment confirmed email
router.post("/test-appointment-confirmed", async (req, res) => {
  try {
    const { email, appointmentId } = req.body;
    const user = await User.findOne({ email });
    const appointment = await Appointment.findById(appointmentId);

    if (!user || !appointment) {
      return res.status(404).json({
        success: false,
        message: "User or appointment not found",
      });
    }

    const result = await sendAppointmentConfirmedEmail(user, appointment);
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Test email connection
router.get("/test-connection", async (req, res) => {
  const result = await testEmailConnection();
  res.status(result.success ? 200 : 500).json(result);
});

// Test welcome email
router.post("/test-welcome", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const result = await sendWelcomeEmail(user);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
