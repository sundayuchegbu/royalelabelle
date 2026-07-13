"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, MapPin, Edit2, Camera } from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || "",
      });
    }
  }, [user, isLoading, isAuthenticated, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      // Error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For demo, convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await api.post("/auth/profile-image", { imageUrl: reader.result });
        toast.success("Profile image updated");
        // Refresh user data
        const response = await api.get("/auth/me");
        if (response.data.success) {
          const updatedUser = response.data.user;
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.location.reload();
        }
      } catch (error) {
        toast.error("Failed to upload image");
      }
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c48d2c]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fdf8f6] pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-luxury overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-gold"></div>

          {/* Profile Section */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-[#fdf8f6] overflow-hidden flex items-center justify-center">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-[#7f482f]" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-1.5 bg-[#c48d2c] rounded-full cursor-pointer hover:bg-[#d6a545] transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="sm:ml-4 mt-4 sm:mt-0 flex-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div>
                    <h1 className="font-serif text-2xl text-[#4a2b1d]">
                      {user?.name}
                    </h1>
                    <p className="text-sm text-[#7f482f]">
                      {user?.role === "admin" || user?.role === "super_admin"
                        ? "👑 Administrator"
                        : "💇‍♀️ Client"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="mt-2 sm:mt-0"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-[#c48d2c]" />
                    <div>
                      <p className="text-xs text-[#7f482f]">Full Name</p>
                      <p className="text-[#4a2b1d]">
                        {user?.name || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[#c48d2c]" />
                    <div>
                      <p className="text-xs text-[#7f482f]">Email</p>
                      <p className="text-[#4a2b1d]">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-[#c48d2c]" />
                    <div>
                      <p className="text-xs text-[#7f482f]">Phone</p>
                      <p className="text-[#4a2b1d]">
                        {user?.phone || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#c48d2c] mt-1" />
                    <div>
                      <p className="text-xs text-[#7f482f]">Location</p>
                      <p className="text-[#4a2b1d]">
                        {user?.location || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-[#c48d2c] mt-1" />
                    <div>
                      <p className="text-xs text-[#7f482f]">Bio</p>
                      <p className="text-[#4a2b1d]">
                        {user?.bio || "No bio yet"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Brooklyn, NY"
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tell us a bit about yourself..."
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl shadow-luxury p-4 text-center">
            <p className="text-2xl font-bold text-[#c48d2c]">12</p>
            <p className="text-sm text-[#7f482f]">Total Appointments</p>
          </div>
          <div className="bg-white rounded-xl shadow-luxury p-4 text-center">
            <p className="text-2xl font-bold text-[#c48d2c]">8</p>
            <p className="text-sm text-[#7f482f]">Completed</p>
          </div>
          <div className="bg-white rounded-xl shadow-luxury p-4 text-center">
            <p className="text-2xl font-bold text-[#c48d2c]">2</p>
            <p className="text-sm text-[#7f482f]">Upcoming</p>
          </div>
        </div>
      </div>
    </div>
  );
}
