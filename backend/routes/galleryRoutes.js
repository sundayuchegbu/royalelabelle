import express from "express";
import {
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getAllGalleryImages,
  getGalleryImage,
} from "../controllers/galleryController.js";
import { adminAuth, checkPermission } from "../middleware/adminAuth.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getAllGalleryImages);
router.get("/:id", getGalleryImage);

// Admin routes (authentication required)
router.post("/", adminAuth, checkPermission("manageGallery"), addGalleryImage);
router.put(
  "/:id",
  adminAuth,
  checkPermission("manageGallery"),
  updateGalleryImage,
);
router.delete(
  "/:id",
  adminAuth,
  checkPermission("manageGallery"),
  deleteGalleryImage,
);

export default router;
