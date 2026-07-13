import express from "express";
import { adminAuth, checkPermission } from "../middleware/adminAuth.js";
import {
  getDashboardStats,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getUsers,
  getRevenueReport,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(adminAuth);

// Dashboard
router.get("/stats", getDashboardStats);

// Appointments
router.get(
  "/appointments",
  checkPermission("manageAppointments"),
  getAppointments,
);
router.get(
  "/appointments/:id",
  checkPermission("manageAppointments"),
  getAppointment,
);
router.put(
  "/appointments/:id",
  checkPermission("manageAppointments"),
  updateAppointment,
);
router.delete(
  "/appointments/:id",
  checkPermission("manageAppointments"),
  deleteAppointment,
);

// Users
router.get("/users", checkPermission("manageClients"), getUsers);

// Reports
router.get(
  "/reports/revenue",
  checkPermission("viewReports"),
  getRevenueReport,
);

export default router;
