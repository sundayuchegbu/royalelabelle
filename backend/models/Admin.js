import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  role: {
    type: String,
    enum: ["super_admin", "admin", "staff"],
    default: "admin",
  },

  permissions: {
    manageAppointments: {
      type: Boolean,
      default: true,
    },

    manageGallery: {
      type: Boolean,
      default: true,
    },

    manageClients: {
      type: Boolean,
      default: true,
    },

    managePayments: {
      type: Boolean,
      default: true,
    },

    manageStaff: {
      type: Boolean,
      default: false,
    },

    viewReports: {
      type: Boolean,
      default: true,
    },
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  lastLogin: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Admin", AdminSchema);
