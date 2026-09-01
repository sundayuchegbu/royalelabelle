import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";
import {
  passwordResetTemplate,
  passwordResetConfirmationTemplate,
} from "../utils/emailTemplates.js";

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email address",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email address",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save to database (expires in 1 hour)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email
    const htmlContent = passwordResetTemplate(user, resetLink);

    const emailResult = await sendEmail(
      user.email,
      "🔐 Reset Your Password - Royale la'belle",
      htmlContent,
    );

    if (!emailResult.success) {
      console.error("Failed to send reset email:", emailResult.error);
      // Still return success to prevent email enumeration
    }

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email address",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process request",
    });
  }
};

// @desc    Verify reset token
// @route   GET /api/auth/verify-reset-token
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }

    // Hash the token
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with token and valid expiration
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      email: user.email,
    });
  } catch (error) {
    console.error("Verify reset token error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify token",
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Hash the token
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with token and valid expiration
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Send confirmation email
    const htmlContent = passwordResetConfirmationTemplate(user);
    sendEmail(
      user.email,
      "✅ Password Reset Confirmation - Royale la'belle",
      htmlContent,
    ).catch((error) => {
      console.error("Failed to send reset confirmation email:", error);
    });

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reset password",
    });
  }
};
