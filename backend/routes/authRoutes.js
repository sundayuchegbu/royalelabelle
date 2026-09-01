import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  uploadProfileImage,
} from "../controllers/authController.js";
import {
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "../controllers/passwordController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);
router.put("/password", authMiddleware, updatePassword);
router.post("/profile-image", authMiddleware, uploadProfileImage);

export default router;
