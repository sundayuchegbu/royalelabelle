import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Consultation from "../models/Consultation.js";
import Gallery from "../models/Gallery.js";
import mongoose from "mongoose";
import cloudinary, { extractPublicId } from "../config/cloudinary.js";

// @desc    Get dashboard stats (uses the same auth token from User)
// @route   GET /api/admin/stats
export const getDashboardStats = async (req, res) => {
  try {
    const adminUser = req.user;

    if (adminUser.role !== "admin" && adminUser.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalUsers,
      newUsersToday,
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      totalRevenue,
      monthlyRevenue,
      activeConsultations,
      totalGalleryImages,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfDay } }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ appointmentDate: { $gte: startOfDay } }),
      Appointment.countDocuments({ status: "pending" }),
      Appointment.countDocuments({ status: "confirmed" }),
      Appointment.countDocuments({ status: "completed" }),
      Appointment.countDocuments({ status: "cancelled" }),
      Appointment.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$fullPrice" } } },
      ]),
      Appointment.aggregate([
        {
          $match: {
            status: "completed",
            appointmentDate: { $gte: startOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$fullPrice" } } },
      ]),
      Consultation.countDocuments({ status: "active" }),
      Gallery.countDocuments(),
    ]);

    const paymentMethods = await Appointment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
    ]);

    const serviceTypes = await Appointment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$serviceType", count: { $sum: 1 } } },
    ]);

    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email phone");

    return res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          newToday: newUsersToday,
        },
        appointments: {
          total: totalAppointments,
          today: todayAppointments,
          pending: pendingAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments,
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          monthly: monthlyRevenue[0]?.total || 0,
        },
        consultations: {
          active: activeConsultations,
        },
        gallery: {
          total: totalGalleryImages,
        },
        breakdowns: {
          paymentMethods,
          serviceTypes,
        },
        recentAppointments,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all appointments (with filters)
// @route   GET /api/admin/appointments
export const getAppointments = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const {
      status,
      paymentMethod,
      serviceType,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      search,
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (serviceType) query.serviceType = serviceType;

    if (startDate && endDate) {
      query.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (search) {
      query.$or = [
        { "userId.name": { $regex: search, $options: "i" } },
        { "userId.email": { $regex: search, $options: "i" } },
        { _id: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate("userId", "name email phone")
        .populate("consultationId")
        .sort({ appointmentDate: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Appointment.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      appointments,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/admin/appointments/:id
export const getAppointment = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("consultationId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/admin/appointments/:id
export const updateAppointment = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const { status, appointmentDate, notes, lateFee } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Store old status for email comparison
    const oldStatus = appointment.status;

    // Check if status is changing
    const isBeingConfirmed =
      status === "confirmed" && appointment.status !== "confirmed";
    const isBeingCompleted =
      status === "completed" && appointment.status !== "completed";
    const isBeingCancelled =
      status === "cancelled" && appointment.status !== "cancelled";

    // Update fields
    if (status) {
      appointment.status = status;

      // Update consultation status based on appointment status
      if (status === "confirmed" || status === "completed") {
        await Consultation.findByIdAndUpdate(appointment.consultationId, {
          status: "completed",
        });
      }

      if (status === "cancelled") {
        await Consultation.findByIdAndUpdate(appointment.consultationId, {
          status: "active",
        });
      }
    }

    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (notes) appointment.notes = notes;
    if (lateFee !== undefined) appointment.lateFee = lateFee;

    await appointment.save();

    // Get user for email
    const user = await User.findById(appointment.userId);

    // Send emails based on status change
    if (user) {
      if (isBeingConfirmed) {
        // Send appointment confirmed email
        sendAppointmentConfirmedEmail(user, appointment).catch((error) => {
          console.error("Failed to send appointment confirmed email:", error);
        });
      } else if (isBeingCompleted) {
        // Send appointment completed email
        sendAppointmentCompletedEmail(user, appointment).catch((error) => {
          console.error("Failed to send appointment completed email:", error);
        });
      } else if (isBeingCancelled) {
        // Send status change notification for cancellation
        sendStatusChangeNotification(
          user,
          appointment,
          oldStatus,
          "cancelled",
        ).catch((error) => {
          console.error("Failed to send status change email:", error);
        });
      } else if (status && status !== oldStatus) {
        // Send general status change notification for any other status change
        sendStatusChangeNotification(
          user,
          appointment,
          oldStatus,
          status,
        ).catch((error) => {
          console.error("Failed to send status change email:", error);
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("Update appointment error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// @desc    Delete appointment
// @route   DELETE /api/admin/appointments/:id
export const deleteAppointment = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const appointmentId = req.params.id;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    console.log(`🗑️ Deleting appointment: ${appointmentId}`);
    console.log(`  - Service: ${appointment.serviceType}`);
    console.log(`  - Client: ${appointment.userId}`);

    // 🔑 CRITICAL FIX: Update the associated consultation status back to 'active'
    if (appointment.consultationId) {
      await Consultation.findByIdAndUpdate(appointment.consultationId, {
        status: "active",
        // Optionally reset the expiration date to give them more time
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      console.log(
        `  ✅ Consultation ${appointment.consultationId} set to active`,
      );
    }

    // Delete the appointment
    await Appointment.findByIdAndDelete(appointmentId);

    console.log(`✅ Appointment deleted successfully: ${appointmentId}`);

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully. Customer can now book again.",
    });
  } catch (error) {
    console.error("❌ Delete appointment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete appointment",
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const { page = 1, limit = 20, search } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const appointmentCount = await Appointment.countDocuments({
          userId: user._id,
        });
        return {
          ...user.toObject(),
          appointmentCount,
        };
      }),
    );

    res.status(200).json({
      success: true,
      users: usersWithStats,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get gallery images
// @route   GET /api/admin/gallery
export const getGallery = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upload image to Cloudinary (unsigned approach)
// @route   POST /api/admin/gallery/upload
export const uploadImage = async (req, res) => {
  try {
    console.log("📤 Upload request received");
    console.log("  - User:", req.user?.email);
    console.log("  - User role:", req.user?.role);
    console.log("  - Body keys:", Object.keys(req.body));
    console.log("  - Body size:", JSON.stringify(req.body).length);

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      console.log("❌ Access denied. User role:", req.user.role);
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const { image } = req.body;

    if (!image) {
      console.log("❌ No image provided");
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    // Check if image is a valid base64 string
    if (!image.startsWith("data:image")) {
      console.log("❌ Invalid image format - not a data URL");
      return res.status(400).json({
        success: false,
        message: "Invalid image format. Please provide a valid image data URL.",
      });
    }

    console.log("📤 Uploading to Cloudinary...");

    // Upload to Cloudinary using base64
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "gallery",
      transformation: [
        { width: 800, height: 800, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    console.log("✅ File uploaded successfully to Cloudinary");
    console.log("  - File URL:", uploadResult.secure_url);
    console.log("  - Public ID:", uploadResult.public_id);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    console.error("  - Message:", error.message);
    console.error("  - HTTP Code:", error.http_code);
    console.error("  - Stack:", error.stack);

    // Check for specific errors
    if (error.message?.includes("File size too large")) {
      return res.status(400).json({
        success: false,
        message: "Image file is too large. Please upload a smaller image.",
      });
    }

    if (error.message?.includes("Invalid image")) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid image file. Please upload a valid image (JPEG, PNG, etc.).",
      });
    }

    if (error.http_code === 403) {
      return res.status(400).json({
        success: false,
        message:
          "Cloudinary authentication failed. Please check your Cloudinary credentials.",
      });
    }

    if (error.message?.includes("Cloudinary") || error.http_code) {
      return res.status(500).json({
        success: false,
        message: `Cloudinary error: ${error.message}`,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image",
    });
  }
};
// @desc    Add gallery image (with Cloudinary URL)
// @route   POST /api/admin/gallery
export const addGalleryImage = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const { title, imageUrl, category, isFeatured, order, publicId } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    const image = await Gallery.create({
      title,
      imageUrl,
      publicId: publicId || null,
      category: category || "micro-locs",
      isFeatured: isFeatured || false,
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      message: "Image added successfully",
      image,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update gallery image
// @route   PUT /api/admin/gallery/:id
export const updateGalleryImage = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const { title, imageUrl, category, isFeatured, order } = req.body;

    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    if (title) image.title = title;
    if (imageUrl) image.imageUrl = imageUrl;
    if (category) image.category = category;
    if (isFeatured !== undefined) image.isFeatured = isFeatured;
    if (order !== undefined) image.order = order;

    await image.save();

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      image,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete gallery image (also remove from Cloudinary)
// @route   DELETE /api/admin/gallery/:id
export const deleteGalleryImage = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Delete from Cloudinary if publicId exists
    if (image.publicId) {
      try {
        const result = await cloudinary.uploader.destroy(image.publicId);
        if (result.result !== "ok") {
          console.warn(
            "Failed to delete image from Cloudinary:",
            image.publicId,
          );
        }
      } catch (cloudinaryError) {
        console.warn("Cloudinary deletion error:", cloudinaryError);
      }
    }

    await image.remove();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get revenue reports
// @route   GET /api/admin/reports/revenue
export const getRevenueReport = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const { period = "monthly" } = req.query;

    let groupBy;

    switch (period) {
      case "daily":
        groupBy = {
          year: { $year: "$appointmentDate" },
          month: { $month: "$appointmentDate" },
          day: { $dayOfMonth: "$appointmentDate" },
        };
        break;
      case "monthly":
        groupBy = {
          year: { $year: "$appointmentDate" },
          month: { $month: "$appointmentDate" },
        };
        break;
      case "yearly":
        groupBy = {
          year: { $year: "$appointmentDate" },
        };
        break;
      default:
        groupBy = {
          year: { $year: "$appointmentDate" },
          month: { $month: "$appointmentDate" },
        };
    }

    const revenue = await Appointment.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: "$fullPrice" },
          totalDeposits: { $sum: "$depositAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    res.status(200).json({
      success: true,
      period,
      data: revenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
