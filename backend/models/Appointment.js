import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: ["twist", "braids", "interlocking", "retie", "repair"],
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "payment_pending",
        "payment_verified",
      ],
      default: "pending",
    },
    depositAmount: {
      type: Number,
      required: true,
    },
    fullPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "zelle", "interac", "cash"],
      default: "stripe",
    },
    stripePaymentId: {
      type: String,
      default: null,
    },
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      required: true,
    },
    notes: String,
    lateFee: {
      type: Number,
      default: 0,
    },
    rescheduleCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Appointment", AppointmentSchema);
