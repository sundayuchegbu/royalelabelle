import "./config/env.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDatabase } from "./config/dbConnect.js";
import { handleWebhook } from "./controllers/webhookController.js";
import authRoutes from "./routes/authRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";

// --------------------------------------------------
// Create Express app
// --------------------------------------------------

const app = express();

// --------------------------------------------------
// Debug
// --------------------------------------------------

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("DB_URI:", process.env.DB_URI ? "✅ Loaded" : "❌ Missing");
console.log(
  "STRIPE_SECRET_KEY:",
  process.env.STRIPE_SECRET_KEY ? "✅ Loaded" : "❌ Missing",
);
console.log(
  "STRIPE_WEBHOOK_SECRET:",
  process.env.STRIPE_WEBHOOK_SECRET ? "✅ Loaded" : "❌ Missing",
);

// --------------------------------------------------
// CORS
// --------------------------------------------------

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// --------------------------------------------------
// Stripe Webhook
// --------------------------------------------------

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook,
);

// --------------------------------------------------
// Body Parser
// --------------------------------------------------

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// --------------------------------------------------
// Routes
// --------------------------------------------------

app.use("/api/auth", authRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/email", emailRoutes);

// --------------------------------------------------
// Connect Database
// --------------------------------------------------

connectDatabase();

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API running",
    timestamp: new Date().toISOString(),
  });
});

// --------------------------------------------------
// Error Handler
// --------------------------------------------------

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// --------------------------------------------------
// Graceful Shutdown
// --------------------------------------------------

process.on("uncaughtException", (err) => {
  console.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error(err);

  server.close(() => {
    process.exit(1);
  });
});
