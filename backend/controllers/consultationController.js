import Consultation from "../models/Consultation.js";
import Appointment from "../models/Appointment.js"; // Add this import

// @desc    Create consultation
// @route   POST /api/consultations
export const createConsultation = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      hairType,
      hairCondition,
      hairLength,
      hairDensity,
      preferredStyle,
      preferredDate,
      preferredTime,
      goals,
      notes,
    } = req.body;

    const userId = req.user.id;

    // Check if user has active consultation
    const existingConsultation = await Consultation.findOne({
      userId,
      status: "active",
    });

    if (existingConsultation) {
      // Check if the consultation is expired (even if status is still 'active')
      if (new Date(existingConsultation.expiresAt) < new Date()) {
        // Update status to expired
        existingConsultation.status = "expired";
        await existingConsultation.save();
        console.log(
          `⏰ Consultation ${existingConsultation._id} marked as expired`,
        );
        // Allow them to create a new one
      } else {
        // Check if there's an active appointment associated with this consultation
        const activeAppointment = await Appointment.findOne({
          consultationId: existingConsultation._id,
          status: {
            $in: [
              "pending",
              "confirmed",
              "payment_pending",
              "payment_verified",
            ],
          },
        });

        // If there's no active appointment, the consultation should be considered inactive
        if (!activeAppointment) {
          // No active appointment found, set consultation to 'expired' so user can create a new one
          existingConsultation.status = "expired";
          await existingConsultation.save();
          console.log(
            `⏰ Consultation ${existingConsultation._id} marked as expired (no active appointment)`,
          );
          // Allow them to create a new one
        } else {
          // Still active and has an active appointment
          return res.status(400).json({
            success: false,
            message:
              "You already have an active consultation with a pending or confirmed appointment. Please complete or cancel your existing appointment before creating a new consultation.",
            consultation: existingConsultation,
            expiresAt: existingConsultation.expiresAt,
            activeAppointment: activeAppointment,
          });
        }
      }
    }

    // Create new consultation
    const consultation = await Consultation.create({
      userId,
      name,
      email,
      phone,
      hairType,
      hairCondition,
      hairLength,
      hairDensity,
      preferredStyle,
      preferredDate,
      preferredTime,
      goals: goals || "",
      notes: notes || "",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    console.log(`✅ New consultation created for user ${userId}`);

    res.status(201).json({
      success: true,
      consultation,
      message:
        "Consultation created successfully. You can now book an appointment.",
    });
  } catch (error) {
    console.error("Consultation creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's consultation
// @route   GET /api/consultations/me
export const getMyConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      userId: req.user.id,
      status: "active",
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "No active consultation found",
      });
    }

    res.status(200).json({
      success: true,
      consultation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update consultation
// @route   PUT /api/consultations/:id
export const updateConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    const updated = await Consultation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      consultation: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete consultation (admin only)
// @route   DELETE /api/consultations/:id
export const deleteConsultation = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    // Check if there's an active appointment associated with this consultation
    const activeAppointment = await Appointment.findOne({
      consultationId: consultation._id,
      status: {
        $in: ["pending", "confirmed", "payment_pending", "payment_verified"],
      },
    });

    if (activeAppointment) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete consultation with active appointment. Please cancel or complete the appointment first.",
        appointment: activeAppointment,
      });
    }

    await consultation.remove();

    res.status(200).json({
      success: true,
      message: "Consultation deleted successfully",
    });
  } catch (error) {
    console.error("Delete consultation error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Clean up expired consultations (cron job)
// @route   POST /api/consultations/cleanup
export const cleanupExpiredConsultations = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const result = await Consultation.updateMany(
      {
        status: "active",
        expiresAt: { $lt: new Date() },
      },
      {
        status: "expired",
      },
    );

    console.log(`✅ Cleaned up ${result.modifiedCount} expired consultations`);

    res.status(200).json({
      success: true,
      message: `Cleaned up ${result.modifiedCount} expired consultations`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Cleanup consultations error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
