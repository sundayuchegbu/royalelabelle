import Appointment from "../models/Appointment.js";
import Consultation from "../models/Consultation.js";

// @desc    Get user's appointments
// @route   GET /api/user/appointments
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/user/appointments/:id
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/user/appointments/:id/cancel
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

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/user/appointments/:id/reschedule
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
