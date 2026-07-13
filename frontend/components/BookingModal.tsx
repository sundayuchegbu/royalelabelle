"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MessageCircle,
  Shield,
  Scissors,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "./ui/Button";
import AuthModal from "./AuthModal";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface BookingModalProps {
  onClose: () => void;
}

export default function BookingModal({ onClose }: BookingModalProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",

    // Hair Information
    hairType: "",
    hairCondition: "",
    hairLength: "",
    hairDensity: "",

    // Style Preferences
    preferredStyle: "",
    preferredDate: "",
    preferredTime: "",

    // Additional
    goals: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceTypes = [
    {
      value: "twist",
      label: "Micro Locs - Twist Method",
      price: "$1,000",
      deposit: "$200",
    },
    {
      value: "braids",
      label: "Micro Locs - Braids Method",
      price: "$1,200",
      deposit: "$200",
    },
    {
      value: "interlocking",
      label: "Micro Locs - Interlocking Method",
      price: "$1,600",
      deposit: "$300",
    },
    {
      value: "retie",
      label: "Retie Maintenance",
      price: "$150",
      deposit: "$200",
    },
    {
      value: "repair",
      label: "Loc Repair Service",
      price: "$200",
      deposit: "$200",
    },
  ];

  const hairTypes = [
    { value: "Straight", label: "Straight" },
    { value: "Wavy", label: "Wavy" },
    { value: "Curly", label: "Curly" },
    { value: "Coily", label: "Coily" },
    { value: "Kinky", label: "Kinky" },
  ];

  const hairLengths = [
    { value: "0-2 inches", label: "0-2 inches" },
    { value: "2-4 inches", label: "2-4 inches" },
    { value: "4-6 inches", label: "4-6 inches" },
    { value: "6+ inches", label: "6+ inches" },
  ];

  const hairDensities = [
    { value: "Thin", label: "Thin" },
    { value: "Medium", label: "Medium" },
    { value: "Thick", label: "Thick" },
    { value: "Very Thick", label: "Very Thick" },
  ];

  // Auto-fill form with user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    toast.success("Signed in successfully! You can now book.");
  };

  const handleBooking = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // If authenticated, proceed with booking
    handleSubmit();
  };

  const handleSubmit = async () => {
    // If authenticated, auto-fill user data
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }

    setIsSubmitting(true);

    // Validate all required fields
    const requiredFields = [
      { field: "name", label: "Full Name" },
      { field: "email", label: "Email Address" },
      { field: "phone", label: "Phone Number" },
      { field: "hairType", label: "Hair Type" },
      { field: "hairCondition", label: "Hair Condition" },
      { field: "hairLength", label: "Hair Length" },
      { field: "hairDensity", label: "Hair Density" },
      { field: "preferredStyle", label: "Preferred Style" },
      { field: "preferredDate", label: "Preferred Date" },
      { field: "preferredTime", label: "Preferred Time" },
    ];

    const missingFields = requiredFields.filter(
      ({ field }) =>
        !formData[field as keyof typeof formData] ||
        formData[field as keyof typeof formData] === "",
    );

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map((f) => f.label).join(", ");
      toast.error(`Please fill in all required fields: ${fieldNames}`);
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Create consultation
      const consultationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        hairType: formData.hairType,
        hairCondition: formData.hairCondition.trim(),
        hairLength: formData.hairLength,
        hairDensity: formData.hairDensity,
        preferredStyle: formData.preferredStyle,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        goals: formData.goals.trim(),
        notes: formData.notes.trim(),
      };

      const consultationResponse = await api.post(
        "/consultations",
        consultationData,
      );

      if (!consultationResponse.data.success) {
        throw new Error(
          consultationResponse.data.message || "Failed to create consultation",
        );
      }

      const consultationId = consultationResponse.data.consultation._id;

      // Step 2: Create appointment
      const appointmentData = {
        serviceType: formData.preferredStyle,
        appointmentDate: formData.preferredDate,
        consultationId: consultationId,
        notes: formData.notes.trim(),
      };

      const appointmentResponse = await api.post(
        "/appointments",
        appointmentData,
      );

      if (!appointmentResponse.data.success) {
        throw new Error(
          appointmentResponse.data.message || "Failed to create appointment",
        );
      }

      const appointmentId = appointmentResponse.data.appointment._id;

      // Step 3: Close modal and redirect to checkout
      toast.success("Booking created! Proceed to payment.");
      onClose();
      router.push(`/checkout?appointmentId=${appointmentId}`);
    } catch (error: any) {
      console.error("Booking error:", error);

      // Handle validation errors from the backend
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .map((err: any) => err.message)
          .join(", ");
        toast.error(`Validation errors: ${errorMessages}`);
      } else {
        toast.error(
          error.message || "Failed to book appointment. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl text-[#4a2b1d]">
                Book Your Appointment
              </h2>
              {!isAuthenticated && (
                <p className="text-xs text-[#c48d2c] flex items-center mt-1">
                  <Shield className="w-3 h-3 mr-1" />
                  Please sign in or register to book
                </p>
              )}
              {isAuthenticated && (
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Shield className="w-3 h-3 mr-1" />✓ Signed in as {user?.name}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#f6ede8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleBooking();
            }}
            className="space-y-4"
          >
            {/* Personal Information */}
            <div className="border-b border-[#f6ede8] pb-4">
              <h4 className="font-semibold text-[#4a2b1d] mb-3 flex items-center text-sm">
                <User className="w-4 h-4 text-[#c48d2c] mr-2" />
                Personal Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full pl-9 pr-3 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent text-sm bg-white"
                      required
                      readOnly={isAuthenticated && !!user?.name}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full pl-9 pr-3 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent text-sm bg-white"
                      required
                      readOnly={isAuthenticated && !!user?.email}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 555-5555"
                    className="w-full pl-9 pr-3 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent text-sm bg-white"
                    required
                    readOnly={isAuthenticated && !!user?.phone}
                  />
                </div>
              </div>
            </div>

            {/* Hair Information */}
            <div className="border-b border-[#f6ede8] pb-4">
              <h4 className="font-semibold text-[#4a2b1d] mb-3 flex items-center text-sm">
                <Scissors className="w-4 h-4 text-[#c48d2c] mr-2" />
                Hair Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Hair Type *
                  </label>
                  <select
                    name="hairType"
                    value={formData.hairType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white text-sm"
                    required
                  >
                    <option value="">Select hair type...</option>
                    {hairTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Hair Length *
                  </label>
                  <select
                    name="hairLength"
                    value={formData.hairLength}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white text-sm"
                    required
                  >
                    <option value="">Select hair length...</option>
                    {hairLengths.map((length) => (
                      <option key={length.value} value={length.value}>
                        {length.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Hair Density *
                  </label>
                  <select
                    name="hairDensity"
                    value={formData.hairDensity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white text-sm"
                    required
                  >
                    <option value="">Select hair density...</option>
                    {hairDensities.map((density) => (
                      <option key={density.value} value={density.value}>
                        {density.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Hair Condition *
                  </label>
                  <input
                    type="text"
                    name="hairCondition"
                    value={formData.hairCondition}
                    onChange={handleChange}
                    placeholder="e.g., Healthy, Damaged..."
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent text-sm bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Style Preferences */}
            <div className="border-b border-[#f6ede8] pb-4">
              <h4 className="font-semibold text-[#4a2b1d] mb-3 flex items-center text-sm">
                <Calendar className="w-4 h-4 text-[#c48d2c] mr-2" />
                Style & Schedule
              </h4>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Preferred Style *
                </label>
                <select
                  name="preferredStyle"
                  value={formData.preferredStyle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white text-sm"
                  required
                >
                  <option value="">Select a style...</option>
                  {serviceTypes.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label} - {service.price} (Deposit:{" "}
                      {service.deposit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent text-sm bg-white"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Preferred Time *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="time"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent text-sm bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h4 className="font-semibold text-[#4a2b1d] mb-3 flex items-center text-sm">
                <MessageCircle className="w-4 h-4 text-[#c48d2c] mr-2" />
                Additional Information
              </h4>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Hair Goals
                </label>
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  placeholder="What are your hair goals?"
                  rows={2}
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent resize-none text-sm bg-white"
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special requests..."
                  rows={2}
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent resize-none text-sm bg-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={isSubmitting || !isAuthenticated}
              className="w-full"
            >
              {isSubmitting
                ? "Submitting..."
                : !isAuthenticated
                  ? "Sign In to Book"
                  : "Book Appointment"}
            </Button>

            {!isAuthenticated && (
              <div className="bg-[#fff5e6] p-3 rounded-lg border-l-4 border-[#c48d2c]">
                <p className="text-xs text-[#7f482f] flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-[#c48d2c] flex-shrink-0 mt-0.5" />
                  <span>
                    By clicking "Sign In to Book", you'll be prompted to log in
                    or create an account. All fields will be auto-filled after
                    sign in.
                  </span>
                </p>
              </div>
            )}

            {isAuthenticated && (
              <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                <p className="text-xs text-green-700 flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Signed in as <strong>{user?.name}</strong>. Your personal
                    details have been auto-filled. Complete the form to book.
                  </span>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          mode="login"
        />
      )}
    </>
  );
}
