"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface GalleryImage {
  _id: string;
  title: string;
  image: string;
  category: string;
  isFeatured: boolean;
  order: number;
  uploadedBy?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

// Image compression function
const compressImage = (
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        try {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            try {
              let width = img.width;
              let height = img.height;

              if (width > maxWidth) {
                height = (maxWidth / width) * height;
                width = maxWidth;
              }
              if (height > maxHeight) {
                width = (maxHeight / height) * width;
                height = maxHeight;
              }

              const canvas = document.createElement("canvas");
              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext("2d");
              if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
              }

              ctx.drawImage(img, 0, 0, width, height);
              const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
              resolve(compressedBase64);
            } catch (error) {
              reject(error);
            }
          };
          img.onerror = () => reject(new Error("Failed to load image"));
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
    } catch (error) {
      reject(error);
    }
  });
};

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    category: "micro-locs",
    isFeatured: false,
    order: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["micro-locs", "retwist", "interlocking", "braids"];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await api.get("/gallery");
      setImages(response.data.data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to load gallery");
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, GIF, and WEBP images are allowed");
      return;
    }

    setIsUploading(true);

    try {
      const compressedBase64 = await compressImage(file, 800, 800, 0.7);

      const response = await api.post("/gallery", {
        title: formData.title || "Untitled",
        image: compressedBase64,
        category: formData.category,
        isFeatured: formData.isFeatured,
        order: formData.order,
      });

      if (response.data.success) {
        toast.success("Image added successfully!");
        setShowAddModal(false);
        setFormData({
          title: "",
          image: "",
          category: "micro-locs",
          isFeatured: false,
          order: 0,
        });
        fetchImages();
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      await api.post("/gallery", {
        title: formData.title.trim(),
        image: formData.image,
        category: formData.category,
        isFeatured: formData.isFeatured,
        order: formData.order,
      });

      toast.success("Image added successfully");
      setShowAddModal(false);
      setFormData({
        title: "",
        image: "",
        category: "micro-locs",
        isFeatured: false,
        order: 0,
      });
      fetchImages();
    } catch (error) {
      toast.error("Failed to add image");
    }
  };

  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    try {
      await api.put(`/gallery/${selectedImage._id}`, {
        title: formData.title.trim(),
        category: formData.category,
        isFeatured: formData.isFeatured,
        order: formData.order,
      });

      toast.success("Image updated successfully");
      setShowEditModal(false);
      setSelectedImage(null);
      fetchImages();
    } catch (error) {
      toast.error("Failed to update image");
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await api.delete(`/gallery/${id}`);
      toast.success("Image deleted successfully");
      fetchImages();
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-[#7f482f]">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#4a2b1d]">Gallery</h1>
          <p className="text-[#7f482f] mt-1">Manage your portfolio images</p>
        </div>
        <Button
          variant="gold"
          size="sm"
          className="mt-4 sm:mt-0"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <div
            key={image._id}
            className="group bg-white rounded-xl shadow-luxury overflow-hidden hover:shadow-2xl transition-shadow"
          >
            <div className="relative aspect-square bg-[#f6ede8]">
              {image.image ? (
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-[#d4a691]" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button
                  onClick={() => {
                    setSelectedImage(image);
                    setFormData({
                      title: image.title,
                      image: image.image,
                      category: image.category,
                      isFeatured: image.isFeatured,
                      order: image.order,
                    });
                    setShowEditModal(true);
                  }}
                  className="p-2 bg-white rounded-lg hover:bg-[#f6ede8] transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-[#4a2b1d]" />
                </button>
                <button
                  onClick={() => handleDeleteImage(image._id)}
                  className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
              {image.isFeatured && (
                <div className="absolute top-3 right-3 bg-gold text-white text-xs px-3 py-1 rounded-full">
                  Featured
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-[#4a2b1d] truncate">
                {image.title}
              </h3>
              <p className="text-sm text-[#7f482f] capitalize">
                {image.category}
              </p>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-luxury">
          <ImageIcon className="w-16 h-16 text-[#d4a691] mx-auto mb-4" />
          <p className="text-[#7f482f]">No images in gallery yet</p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Image
          </Button>
        </div>
      )}

      {/* Add Image Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-[#4a2b1d]">Add Image</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    title: "",
                    image: "",
                    category: "micro-locs",
                    isFeatured: false,
                    order: 0,
                  });
                }}
                className="p-2 rounded-lg hover:bg-[#f6ede8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddImage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Upload Image *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="Or enter image URL"
                    className="flex-1 px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isUploading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#f6ede8] hover:bg-[#e1c0b0]"
                      }`}
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </div>
                </div>
                {isUploading && (
                  <p className="text-xs text-gold mt-1">
                    Compressing & uploading...
                  </p>
                )}
                {formData.image && !isUploading && (
                  <p className="text-xs text-green-600 mt-1">✓ Image ready</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace("-", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="w-4 h-4 text-gold rounded focus:ring-gold"
                />
                <label className="text-sm text-[#4a2b1d]">
                  Feature this image
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  min="0"
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full"
                disabled={isUploading || !formData.image}
              >
                {isUploading ? "Processing..." : "Add Image"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Image Modal */}
      {showEditModal && selectedImage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-[#4a2b1d]">Edit Image</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedImage(null);
                }}
                className="p-2 rounded-lg hover:bg-[#f6ede8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateImage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace("-", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="w-4 h-4 text-gold rounded focus:ring-gold"
                />
                <label className="text-sm text-[#4a2b1d]">
                  Feature this image
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  min="0"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedImage(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="flex-1"
                >
                  Update Image
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
