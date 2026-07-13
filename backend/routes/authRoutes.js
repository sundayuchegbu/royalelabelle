import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  uploadProfileImage,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);
router.put("/password", authMiddleware, updatePassword);
router.post("/profile-image", authMiddleware, uploadProfileImage);

export default router;
