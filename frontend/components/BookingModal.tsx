"use client";

import { useState, useEffect, useRef } from "react";
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
  ChevronRight,
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
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",

    // Hair Information
    hairType: "Straight",
    hairCondition: "",
    hairLength: "",
    hairDensity: "",

    // Style Preferences
    preferredStyle: "",
    preferredDate: "",
    preferredTime: "09:00",

    // Additional
    goals: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceTypes = [
    {
      value: "twist",
      label: "Micro Locs - Twist Method ",
      price: "TBD",
      deposit: "$200",
    },
    {
      value: "braids",
      label: "Micro Locs - Braids Method",
      price: "TBD",
      deposit: "$200",
    },
    {
      value: "interlocking",
      label: "Micro Locs - Interlocking Method",
      price: "TBD",
      deposit: "$300",
    },
    {
      value: "retie",
      label: "Retie Maintenance",
      price: "TBD",
      deposit: "$30",
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
    { value: "4-6 inches", label: "4-6 inches" },
    { value: "6+ inches", label: "6+ inches" },
  ];

  const hairDensities = [
    { value: "Thin", label: "Thin" },
    { value: "Medium", label: "Medium" },
    { value: "Thick", label: "Thick" },
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

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        if (!showAuthModal) {
          onClose();
        }
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !showAuthModal) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [onClose, showAuthModal]);

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

    // Log current form data for debugging
    console.log("Form Data before validation:", formData);

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
      // Prepare consultation data
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

      console.log("Sending consultation data:", consultationData);

      // Step 1: Create consultation
      const consultationResponse = await api.post(
        "/consultations",
        consultationData,
      );

      console.log("Consultation response:", consultationResponse.data);

      if (!consultationResponse.data.success) {
        throw new Error(
          consultationResponse.data.message || "Failed to create consultation",
        );
      }

      const consultationId = consultationResponse.data.consultation._id;

      // Step 2: Create appointment using the consultation data
      const appointmentData = {
        serviceType: formData.preferredStyle,
        appointmentDate: formData.preferredDate,
        consultationId: consultationId,
        notes: formData.notes.trim(),
      };

      console.log("Sending appointment data:", appointmentData);

      const appointmentResponse = await api.post(
        "/appointments",
        appointmentData,
      );

      console.log("Appointment response:", appointmentResponse.data);

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
      console.error("Error response:", error.response?.data);

      // Handle validation errors from the backend
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle mongoose validation errors
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

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <div
          ref={modalRef}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl text-[#4a2b1d]">
                Book Your Appointment
              </h2>
              {!isAuthenticated && (
                <p className="text-xs text-gold flex items-center mt-1">
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
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-[#f6ede8] transition-colors"
              aria-label="Close modal"
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
                <User className="w-4 h-4 text-gold mr-2" />
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
                      className="w-full pl-9 pr-3 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm bg-white"
                      required
                      readOnly={isAuthenticated && !!user?.name}
                    />
                  </div>
                  {isAuthenticated && user?.name && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Auto-filled from your account
                    </p>
                  )}
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
                      className="w-full pl-9 pr-3 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm bg-white"
                      required
                      readOnly={isAuthenticated && !!user?.email}
                    />
                  </div>
                  {isAuthenticated && user?.email && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Auto-filled from your account
                    </p>
                  )}
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
                    className="w-full pl-9 pr-3 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm bg-white"
                    required
                    readOnly={isAuthenticated && !!user?.phone}
                  />
                </div>
                {isAuthenticated && user?.phone && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Auto-filled from your account
                  </p>
                )}
              </div>
            </div>

            {/* Hair Information */}
            <div className="border-b border-[#f6ede8] pb-4">
              <h4 className="font-semibold text-[#4a2b1d] mb-3 flex items-center text-sm">
                <Scissors className="w-4 h-4 text-gold mr-2" />
                Hair Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Hair Length *
                  </label>
                  <select
                    name="hairLength"
                    value={formData.hairLength}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white text-sm"
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
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white text-sm"
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
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Style Preferences */}
            <div className="border-b border-[#f6ede8] pb-4">
              <h4 className="font-semibold text-[#4a2b1d] mb-3 flex items-center text-sm">
                <Calendar className="w-4 h-4 text-gold mr-2" />
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
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white text-sm"
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
                      className="w-full pl-9 pr-3 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm bg-white"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Time *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="time"
                      name="preferredTime"
                      value="09:00"
                      readOnly
                      className="w-full pl-9 pr-3 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h4 className="font-semibold text-[#4a2b1d] mb-3 flex items-center text-sm">
                <MessageCircle className="w-4 h-4 text-gold mr-2" />
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
                  placeholder="What are your hair goals? (e.g., length, style, maintenance)"
                  rows={2}
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none text-sm bg-white"
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
                  placeholder="Any special requests or information..."
                  rows={2}
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none text-sm bg-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={isSubmitting || !isAuthenticated}
              className="w-full"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : !isAuthenticated ? (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Sign In to Book
                </>
              ) : (
                <>
                  Book Your Appointment
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <div className="bg-[#fff5e6] p-3 rounded-lg border-l-4 border-gold">
              <p className="text-xs text-[#7f482f] flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  By submitting, you agree to our booking policy and terms of
                  service. A deposit is required to confirm your appointment.
                  You'll be redirected to the checkout page after booking.
                </span>
              </p>
            </div>
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
