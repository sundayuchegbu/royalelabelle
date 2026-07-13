"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Bell,
  BellOff,
  Mail,
  MessageCircle,
  Shield,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: false,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
    if (user?.preferences) {
      setFormData({
        emailNotifications: user.preferences.emailNotifications ?? true,
        smsNotifications: user.preferences.smsNotifications ?? true,
        marketingEmails: user.preferences.marketingEmails ?? false,
      });
    }
  }, [user, isLoading, isAuthenticated, router]);

  const handlePreferenceChange = async (key: string, value: boolean) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    setIsSubmitting(true);

    try {
      await updateUser({
        preferences: updated,
      });
    } catch (error) {
      // Revert on error
      setFormData(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.put("/auth/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c48d2c]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f6] pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-[#4a2b1d]">Settings</h1>
          <p className="text-[#7f482f] mt-1">Manage your account preferences</p>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl shadow-luxury p-6 mb-6">
          <h2 className="font-serif text-xl text-[#4a2b1d] mb-4 flex items-center">
            <Bell className="w-5 h-5 text-[#c48d2c] mr-2" />
            Notification Preferences
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#fdf8f6] transition-colors">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#7f482f]" />
                <div>
                  <p className="font-medium text-[#4a2b1d]">
                    Email Notifications
                  </p>
                  <p className="text-sm text-[#7f482f]">
                    Receive appointment confirmations and updates via email
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  handlePreferenceChange(
                    "emailNotifications",
                    !formData.emailNotifications,
                  )
                }
                disabled={isSubmitting}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  formData.emailNotifications ? "bg-[#c48d2c]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.emailNotifications ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#fdf8f6] transition-colors">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-[#7f482f]" />
                <div>
                  <p className="font-medium text-[#4a2b1d]">
                    SMS Notifications
                  </p>
                  <p className="text-sm text-[#7f482f]">
                    Receive text message updates about your appointments
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  handlePreferenceChange(
                    "smsNotifications",
                    !formData.smsNotifications,
                  )
                }
                disabled={isSubmitting}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  formData.smsNotifications ? "bg-[#c48d2c]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.smsNotifications ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#fdf8f6] transition-colors">
              <div className="flex items-center space-x-3">
                <BellOff className="w-5 h-5 text-[#7f482f]" />
                <div>
                  <p className="font-medium text-[#4a2b1d]">Marketing Emails</p>
                  <p className="text-sm text-[#7f482f]">
                    Receive promotions and special offers
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  handlePreferenceChange(
                    "marketingEmails",
                    !formData.marketingEmails,
                  )
                }
                disabled={isSubmitting}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  formData.marketingEmails ? "bg-[#c48d2c]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.marketingEmails ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-luxury p-6">
          <h2 className="font-serif text-xl text-[#4a2b1d] mb-4 flex items-center">
            <Shield className="w-5 h-5 text-[#c48d2c] mr-2" />
            Change Password
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7f482f] hover:text-[#4a2b1d]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                placeholder="Min 6 characters"
                className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                required
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="md"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>

        {/* Account Info */}
        <div className="mt-6 bg-white rounded-2xl shadow-luxury p-6">
          <h2 className="font-serif text-xl text-[#4a2b1d] mb-4">
            Account Information
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-[#f6ede8]">
              <span className="text-[#7f482f]">Email</span>
              <span className="text-[#4a2b1d]">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f6ede8]">
              <span className="text-[#7f482f]">Role</span>
              <span className="text-[#4a2b1d] capitalize">
                {user?.role || "User"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#7f482f]">Member Since</span>
              <span className="text-[#4a2b1d]">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
