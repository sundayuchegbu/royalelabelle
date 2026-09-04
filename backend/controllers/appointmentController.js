import Appointment from "../models/Appointment.js";
import Consultation from "../models/Consultation.js";
import User from "../models/User.js";
import {
  sendBookingConfirmationEmail,
  sendAdminBookingNotification,
  sendAppointmentConfirmedEmail,
} from "../services/emailService.js";

// Helper function to check if date is within 7 days
const isWithinSevenDays = (date1, date2) => {
  const diffTime = Math.abs(new Date(date2) - new Date(date1));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

// Calculate dynamic pricing based on consultation data
// Calculate dynamic pricing based on consultation data
const calculatePricing = (serviceType, consultation) => {
  // Base pricing
  const basePricing = {
    twist: { deposit: 200, full: 600 },
    braids: { deposit: 200, full: 700 },
    interlocking: { deposit: 300, full: 1000 },
    retie: { deposit: 30, full: 150 },
  };

  let price = basePricing[serviceType];
  if (!price) return null;

  let fullPrice = price.full;
  let depositAmount = price.deposit;

  // Retie has fixed pricing - NO conditions apply
  if (serviceType === "retie") {
    // Fixed price - no conditions
    // Hair length does NOT affect retie pricing
    // Hair density does NOT affect retie pricing
    // Hair condition does NOT affect retie pricing
    // Everything is included in the base price

    return { deposit: depositAmount, full: fullPrice };
  }

  // For installation services (twist, braids, interlocking)
  // Check hair length - longer than 6 inches adds cost
  if (consultation.hairLength === "6+ inches") {
    if (serviceType === "twist" || serviceType === "braids") {
      fullPrice += 100;
    } else if (serviceType === "interlocking") {
      fullPrice += 200;
    }
  }

  // Check hair density - higher density adds cost
  if (consultation.hairDensity === "Thick") {
    if (serviceType === "twist" || serviceType === "braids") {
      fullPrice += 100;
    } else if (serviceType === "interlocking") {
      fullPrice += 200;
    }
  } else if (consultation.hairDensity === "Very Thick") {
    if (serviceType === "twist" || serviceType === "braids") {
      fullPrice += 150;
    } else if (serviceType === "interlocking") {
      fullPrice += 250;
    }
  }

  // Check hair condition - damaged hair may require extra care
  if (consultation.hairCondition?.toLowerCase().includes("damaged")) {
    fullPrice += 50;
  }

  return { deposit: depositAmount, full: fullPrice };
};
// @desc Create appointment
// @route POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const { serviceType, appointmentDate, consultationId, notes } = req.body;
    const userId = req.user.id;

    // Check if consultation exists and belongs to user
    const consultation = await Consultation.findOne({
      _id: consultationId,
      userId,
      status: "active",
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Active consultation not found or expired",
      });
    }

    // Check if consultation is expired
    if (new Date(consultation.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Your consultation has expired. Please book a new one.",
      });
    }

    // Calculate dynamic pricing
    const servicePricing = calculatePricing(serviceType, consultation);

    if (!servicePricing) {
      return res.status(400).json({
        success: false,
        message: "Invalid service type",
      });
    }

    // Create appointment with payment tracking
    const appointment = await Appointment.create({
      userId,
      serviceType,
      appointmentDate:
        appointmentDate || consultation.preferredDate || new Date(),
      depositAmount: servicePricing.deposit,
      fullPrice: servicePricing.full,
      consultationId,
      notes: notes || consultation.notes,
      status: "pending", // Pending payment
      paymentStatus: "pending", // Track payment specifically
    });

    const user = await User.findById(userId);

    // Send booking confirmation email
    if (user) {
      sendBookingConfirmationEmail(user, appointment).catch((error) => {
        console.error("Failed to send booking confirmation:", error);
      });

      sendAdminBookingNotification(appointment, user).catch((error) => {
        console.error("Failed to send admin notification:", error);
      });
    }

    res.status(201).json({
      success: true,
      appointment,
      requiresPayment: true,
      depositAmount: servicePricing.deposit,
      message: "Booking created. Please complete payment to confirm.",
    });
  } catch (error) {
    console.error("Appointment creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Continue payment for pending appointment
// @route GET /api/appointments/:id/continue-payment
export const continuePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log(`💰 Continue payment request for appointment: ${id}`);
    console.log(`  - User: ${userId}`);

    const appointment = await Appointment.findOne({
      _id: id,
      userId: userId,
    });

    if (!appointment) {
      console.log(`❌ Appointment not found: ${id}`);
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    console.log(`  - Appointment status: ${appointment.status}`);
    console.log(`  - Payment status: ${appointment.paymentStatus}`);

    // Check if appointment can be paid for
    if (
      appointment.status === "confirmed" ||
      appointment.status === "completed"
    ) {
      return res.status(400).json({
        success: false,
        message: "This appointment has already been confirmed",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This appointment has been cancelled",
      });
    }

    // Check if payment is already paid
    if (appointment.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment has already been completed",
      });
    }

    // Update payment attempt
    appointment.paymentAttempts = (appointment.paymentAttempts || 0) + 1;
    appointment.lastPaymentAttempt = new Date();
    await appointment.save();

    console.log(`✅ Continue payment successful for appointment: ${id}`);

    res.status(200).json({
      success: true,
      appointment,
      canContinuePayment: true,
      redirectUrl: `/checkout?appointmentId=${appointment._id}`,
      message: "Continue to payment",
    });
  } catch (error) {
    console.error("Continue payment error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Confirm appointment (after payment)
// @route PUT /api/appointments/:id/confirm
export const confirmAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, paymentId } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Update appointment status
    appointment.status = "confirmed";
    if (paymentMethod) appointment.paymentMethod = paymentMethod;
    if (paymentId) appointment.stripePaymentId = paymentId;
    await appointment.save();

    // Update consultation status to 'completed'
    await Consultation.findByIdAndUpdate(appointment.consultationId, {
      status: "completed",
    });

    // Get user and send confirmation email
    const user = await User.findById(appointment.userId);
    if (user) {
      sendAppointmentConfirmedEmail(user, appointment).catch((error) => {
        console.error("Failed to send appointment confirmed email:", error);
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment confirmed successfully",
      appointment,
    });
  } catch (error) {
    console.error("Confirm appointment error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get user's appointments
// @route GET /api/user/appointments
export const getUserAppointments = async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    const userId = req.user.id;

    const query = { userId };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate("consultationId")
        .sort({ appointmentDate: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Appointment.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      appointments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get user appointments error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get single appointment
// @route GET /api/user/appointments/:id
export const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("consultationId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error("Get appointment error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Cancel appointment (by customer)
// @route PUT /api/user/appointments/:id/cancel
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      appointment.status === "completed" ||
      appointment.status === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "This appointment cannot be cancelled",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    // Set consultation back to active so they can rebook
    if (appointment.consultationId) {
      await Consultation.findByIdAndUpdate(appointment.consultationId, {
        status: "active",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      console.log(
        `✅ Consultation ${appointment.consultationId} set to active`,
      );
    }

    res.status(200).json({
      success: true,
      message:
        "Appointment cancelled successfully. You can book a new appointment.",
      appointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Reschedule appointment
// @route PUT /api/user/appointments/:id/reschedule
export const rescheduleAppointment = async (req, res) => {
  try {
    const { newDate } = req.body;
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      appointment.status === "cancelled" ||
      appointment.status === "completed"
    ) {
      return res.status(400).json({
        success: false,
        message: "This appointment cannot be rescheduled",
      });
    }

    // Check if within 7 days
    const diffTime = Math.abs(
      new Date(newDate) - new Date(appointment.appointmentDate),
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isWithin7Days = diffDays <= 7;

    if (!isWithin7Days) {
      return res.status(400).json({
        success: false,
        message:
          "Rescheduling must be within 7 days of original appointment date",
        depositForfeited: true,
      });
    }

    // Check reschedule count (max 1)
    if (appointment.rescheduleCount >= 1) {
      return res.status(400).json({
        success: false,
        message: "You can only reschedule once per month",
      });
    }

    appointment.appointmentDate = newDate;
    appointment.rescheduleCount = (appointment.rescheduleCount || 0) + 1;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully",
      appointment,
      depositTransferable: true,
    });
  } catch (error) {
    console.error("Reschedule appointment error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
