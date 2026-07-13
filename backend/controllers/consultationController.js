import Consultation from "../models/Consultation.js";

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
      return res.status(400).json({
        success: false,
        message: "You already have an active consultation",
        consultation: existingConsultation,
      });
    }

    // Create consultation with all fields
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
      goals,
      notes,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      success: true,
      consultation,
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
