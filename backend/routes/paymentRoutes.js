import express from "express";
import authMiddleware from "../middleware/auth.js";

import {
  createStripePayment,
  getPaymentInfo,
} from "../controllers/paymentController.js";

import {
  createInteracPayment,
  verifyInteracPayment,
  adminConfirmInteracPayment,
} from "../controllers/interacController.js";

const router = express.Router();

// Stripe
router.post("/create-payment-intent", authMiddleware, createStripePayment);

// Payment info
router.get("/info", authMiddleware, getPaymentInfo);

// Interac
router.post("/interac/create", authMiddleware, createInteracPayment);

router.post("/interac/verify", authMiddleware, verifyInteracPayment);

router.put(
  "/interac/admin/confirm/:appointmentId",
  authMiddleware,
  adminConfirmInteracPayment,
);

export default router;
