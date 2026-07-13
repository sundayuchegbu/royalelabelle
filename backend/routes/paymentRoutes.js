import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createStripePayment } from "../controllers/paymentController.js";
import { handleWebhook } from "../controllers/webhookController.js";

const router = express.Router();

// Payment intent creation - authenticated
router.post("/create-payment-intent", authMiddleware, createStripePayment);
export default router;
