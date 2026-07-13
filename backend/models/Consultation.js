import mongoose from "mongoose";

const ConsultationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Personal Information
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number"],
      trim: true,
    },

    // Hair Information
    hairType: {
      type: String,
      required: [true, "Please select your hair type"],
      enum: ["Straight", "Wavy", "Curly", "Coily", "Kinky"],
    },
    hairCondition: {
      type: String,
      required: [true, "Please describe your hair condition"],
      trim: true,
    },
    hairLength: {
      type: String,
      required: [true, "Please provide hair length"],
      enum: ["0-2 inches", "2-4 inches", "4-6 inches", "6+ inches"],
    },
    hairDensity: {
      type: String,
      required: [true, "Please provide hair density"],
      enum: ["Thin", "Medium", "Thick", "Very Thick"],
    },

    // Style Preferences
    preferredStyle: {
      type: String,
      required: [true, "Please select preferred style"],
      enum: ["twist", "braids", "interlocking", "retie", "repair"],
    },
    preferredDate: {
      type: Date,
      required: [true, "Please provide a preferred date"],
    },
    preferredTime: {
      type: String,
      required: [true, "Please provide a preferred time"],
    },

    // Additional Information
    goals: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },

    // Status
    status: {
      type: String,
      enum: ["active", "expired", "completed"],
      default: "active",
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
  {
    timestamps: true,
  },
);

const Consultation =
  mongoose.models.Consultation ||
  mongoose.model("Consultation", ConsultationSchema);

export default Consultation;
