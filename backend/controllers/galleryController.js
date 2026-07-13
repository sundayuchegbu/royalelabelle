import dotenv from "dotenv";
import cloudinary, { extractPublicId } from "../config/cloudinary.js";
import Gallery from "../models/Gallery.js";

dotenv.config();

// @desc    Add gallery image
// @route   POST /api/gallery
export const addGalleryImage = async (req, res, next) => {
  try {
    const { title, image, category, isFeatured, order } = req.body;

    // Validate required fields
    if (!title || !image) {
      return res.status(400).json({
        success: false,
        message: "Title and image are required",
      });
    }

    let imageUrl = "";

    // Upload image to Cloudinary if provided as data URL
    if (image && typeof image === "string" && image.startsWith("data:image")) {
      try {
        const uploadResult = await cloudinary.uploader.upload(image, {
          folder: "gallery",
          transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        });
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({
          success: false,
          message: "Failed to upload image",
        });
      }
    } else if (image && typeof image === "string") {
      // If it's already a URL, use it directly
      imageUrl = image;
    } else {
      return res.status(400).json({
        success: false,
        message: "Valid image is required",
      });
    }

    const galleryImage = await Gallery.create({
      title,
      image: imageUrl,
      category: category || "micro-locs",
      isFeatured: isFeatured || false,
      order: order || 0,
      uploadedBy: req.user?._id,
    });

    // Populate user data in response
    await galleryImage.populate({
      path: "uploadedBy",
      select: ["name", "email"],
    });

    res.status(201).json({
      success: true,
      data: galleryImage,
      message: "Image added successfully",
    });
  } catch (error) {
    console.error("Add gallery image error:", error);
    next(error);
  }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
export const updateGalleryImage = async (req, res, next) => {
  try {
    const galleryId = req.params.id;
    const { title, image, category, isFeatured, order } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const galleryImage = await Gallery.findById(galleryId);
    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Check if user owns this image (if you want to restrict)
    // if (galleryImage.uploadedBy && galleryImage.uploadedBy.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Unauthorized",
    //   });
    // }

    // Update fields
    galleryImage.title = title;
    if (category) galleryImage.category = category;
    if (isFeatured !== undefined) galleryImage.isFeatured = isFeatured;
    if (order !== undefined) galleryImage.order = order;

    // Handle image update
    if (image && typeof image === "string") {
      if (image.startsWith("data:image")) {
        try {
          // Delete old image from Cloudinary if exists
          if (galleryImage.image) {
            const oldPublicId = extractPublicId(galleryImage.image);
            if (oldPublicId) {
              await cloudinary.uploader.destroy(`gallery/${oldPublicId}`);
            }
          }

          // Upload new image
          const uploadResult = await cloudinary.uploader.upload(image, {
            folder: "gallery",
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          });
          galleryImage.image = uploadResult.secure_url;
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
          return res.status(400).json({
            success: false,
            message: "Failed to upload image",
          });
        }
      } else if (image !== galleryImage.image) {
        // If it's a different URL, use it directly
        galleryImage.image = image;
      }
    } else if (image === null || image === "") {
      // If image is explicitly set to empty, remove it
      if (galleryImage.image) {
        const oldPublicId = extractPublicId(galleryImage.image);
        if (oldPublicId) {
          await cloudinary.uploader.destroy(`gallery/${oldPublicId}`);
        }
        galleryImage.image = "";
      }
    }

    await galleryImage.save();

    // Populate user data in response
    await galleryImage.populate({
      path: "uploadedBy",
      select: ["name", "email"],
    });

    res.status(200).json({
      success: true,
      data: galleryImage,
      message: "Image updated successfully",
    });
  } catch (error) {
    console.error("Update gallery image error:", error);
    next(error);
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
export const deleteGalleryImage = async (req, res, next) => {
  try {
    const galleryId = req.params.id;
    const galleryImage = await Gallery.findById(galleryId);

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Delete image from Cloudinary if exists
    if (galleryImage.image) {
      const publicId = extractPublicId(galleryImage.image);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(`gallery/${publicId}`);
        } catch (cloudinaryError) {
          console.warn("Failed to delete from Cloudinary:", cloudinaryError);
          // Continue with deletion from database even if Cloudinary fails
        }
      }
    }

    await Gallery.deleteOne({ _id: galleryId });

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete gallery image error:", error);
    next(error);
  }
};

// @desc    Get all gallery images
// @route   GET /api/gallery
export const getAllGalleryImages = async (req, res, next) => {
  try {
    const { category, featured } = req.query;

    const query = {};
    if (category) query.category = category;
    if (featured === "true") query.isFeatured = true;

    const images = await Gallery.find(query)
      .sort({ order: 1, createdAt: -1 })
      .populate({
        path: "uploadedBy",
        select: ["name", "email"],
      });

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Get all gallery images error:", error);
    next(error);
  }
};

// @desc    Get single gallery image
// @route   GET /api/gallery/:id
export const getGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.findById(req.params.id).populate({
      path: "uploadedBy",
      select: ["name", "email"],
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("Get gallery image error:", error);
    next(error);
  }
};
