import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createCashPayment,
  adminReceiveCashPayment,
} from "../controllers/cashController.js";

const router = express.Router();

// User route
router.post("/create", authMiddleware, createCashPayment);

// Admin route
router.put(
  "/admin/receive/:appointmentId",
  authMiddleware,
  adminReceiveCashPayment,
);

export default router;
