import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verify admin token (uses the same User model as regular auth)
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    console.log("🔐 Admin Auth Check:");
    console.log("  - Token present:", !!token);

    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("  - Decoded token:", decoded);

    const user = await User.findById(decoded.id);
    console.log("  - User found:", !!user);
    console.log("  - User role:", user?.role);
    console.log("  - User isActive:", user?.isActive);

    if (!user || !user.isActive) {
      console.log("❌ User not found or inactive");
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    // Check if user has admin or super_admin role
    if (user.role !== "admin" && user.role !== "super_admin") {
      console.log("❌ User is not admin. Role:", user.role);
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    console.log("✅ Admin access granted for user:", user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Admin auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Check specific permissions (for super_admin vs admin)
const checkPermission = (permission) => {
  return (req, res, next) => {
    // Super admin has all permissions
    if (req.user.role === "super_admin") {
      return next();
    }

    // Check specific permission for regular admin
    if (permission === "manageStaff" && req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to manage staff",
      });
    }

    next();
  };
};

export { adminAuth, checkPermission };
