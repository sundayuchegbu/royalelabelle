import mongoose from "mongoose";

const AdminPreferenceSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notifications: {
      newBooking: {
        type: Boolean,
        default: true,
      },
      paymentReceived: {
        type: Boolean,
        default: true,
      },
      appointmentReminder: {
        type: Boolean,
        default: true,
      },
      weeklyReport: {
        type: Boolean,
        default: false,
      },
    },
    emailDigest: {
      enabled: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        default: "daily",
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("AdminPreference", AdminPreferenceSchema);
