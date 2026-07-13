import express from "express";
import { adminAuth, checkPermission } from "../middleware/adminAuth.js";
import {
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getAllGalleryImages,
  getGalleryImage,
  getGalleryStats,
} from "../controllers/galleryController.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getAllGalleryImages);
router.get("/:id", getGalleryImage);

// Admin routes (authentication required)
router.get(
  "/admin/stats",
  adminAuth,
  checkPermission("manageGallery"),
  getGalleryStats,
);
router.post(
  "/admin/gallery",
  adminAuth,
  checkPermission("manageGallery"),
  addGalleryImage,
);
router.put(
  "/admin/gallery/:id",
  adminAuth,
  checkPermission("manageGallery"),
  updateGalleryImage,
);
router.delete(
  "/admin/gallery/:id",
  adminAuth,
  checkPermission("manageGallery"),
  deleteGalleryImage,
);

export default router;
