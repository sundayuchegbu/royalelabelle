"use client";

import { useState, useEffect } from "react";
import SectionHeading from "../ui/SectionHeading";
import { Camera, Sparkles, Loader2 } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface GalleryImage {
  _id: string;
  title: string;
  image: string;
  category: string;
  isFeatured: boolean;
  order: number;
  createdAt: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "micro-locs", "retwist", "interlocking", "braids"];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/gallery");
      setImages(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch gallery images:", error);
      toast.error("Failed to load gallery images");
      setIsLoading(false);
    }
  };

  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  // Get featured images for the hero section
  const featuredImages = images.filter((img) => img.isFeatured).slice(0, 3);

  if (isLoading) {
    return (
      <section id="gallery" className="py-20 bg-[#fdf8f6]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Portfolio"
            title="Gallery of Excellence"
            description="Explore my work and see the transformation of beautiful locs."
          />
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#c48d2c] animate-spin mx-auto" />
              <p className="mt-4 text-[#7f482f]">Loading gallery...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 bg-[#fdf8f6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Portfolio"
          title="Gallery of Excellence"
          description="Explore my work and see the transformation of beautiful locs."
        />

        {/* Category Filter */}
        {images.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[#c48d2c] text-white"
                    : "bg-white text-[#7f482f] hover:bg-[#f6ede8]"
                }`}
              >
                {category === "all"
                  ? "All"
                  : category.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* Featured Images Banner */}
        {featuredImages.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredImages.map((image) => (
              <div
                key={image._id}
                className="relative aspect-video rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {image.title}
                    </p>
                    <p className="text-[#d4a691] text-xs">⭐ Featured</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image._id}
                className="group relative aspect-square bg-[#f6ede8] rounded-2xl overflow-hidden cursor-pointer hover:shadow-luxury transition-shadow"
              >
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4a2b1d] to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <p className="text-white font-semibold">{image.title}</p>
                    <p className="text-[#d4a691] text-sm capitalize">
                      {image.category.replace("-", " ")}
                    </p>
                    {image.isFeatured && (
                      <span className="inline-block mt-1 bg-[#c48d2c] text-white text-xs px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-[#d4a691] mx-auto mb-4" />
            <p className="text-[#7f482f]">
              {selectedCategory === "all"
                ? "No images in gallery yet. Check back soon!"
                : `No images found in "${selectedCategory}" category.`}
            </p>
          </div>
        )}

        {/* View All Button - Only show if there are more images */}
        {images.length > 6 && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                const gallerySection = document.getElementById("gallery");
                if (gallerySection) {
                  gallerySection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="text-[#c48d2c] font-semibold hover:text-[#d6a545] transition-colors"
            >
              View Full Gallery →
            </button>
          </div>
        )}

        {/* Image Count */}
        {images.length > 0 && (
          <p className="text-center text-sm text-[#7f482f] mt-6">
            Showing {filteredImages.length} of {images.length} images
          </p>
        )}
      </div>
    </section>
  );
}
