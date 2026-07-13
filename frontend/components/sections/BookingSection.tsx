"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageCircle,
  ChevronRight,
  Shield,
  Lock,
  Scissors,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
import AuthModal from "../AuthModal";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function BookingSection() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
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

      // Step 3: Redirect to checkout with appointment ID
      toast.success("Booking created! Proceed to payment.");
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

  if (isLoading) {
    return (
      <section id="booking" className="py-20 bg-[#fdf8f6] scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="mt-4 text-[#7f482f]">Loading booking form...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="booking" className="py-20 bg-[#fdf8f6] scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Book Your Appointment"
            title="Start Your Locs Journey Today"
            description="Fill out the form below to book your appointment. You'll need to sign in to complete your booking."
          />

          {/* Auth Status Banner */}
          {!isAuthenticated ? (
            <div className="max-w-3xl mx-auto mb-6">
              <div className="bg-[#fff5e6] border-2 border-gold rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-gold" />
                  <div>
                    <p className="font-medium text-[#4a2b1d]">
                      Sign in required to book
                    </p>
                    <p className="text-sm text-[#7f482f]">
                      Please sign in or create an account to book your
                      appointment
                    </p>
                  </div>
                </div>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Sign In / Register
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto mb-6">
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">
                    Signed in as {user?.name}
                  </p>
                  <p className="text-sm text-green-700">
                    Your details will be auto-filled. Complete the form to book.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-luxury p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="border-b border-[#f6ede8] pb-6">
                  <h3 className="font-semibold text-[#4a2b1d] mb-4 flex items-center">
                    <User className="w-5 h-5 text-gold mr-2" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
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
                        <Mail className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
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
                      <Phone className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 555-5555"
                        className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
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
                <div className="border-b border-[#f6ede8] pb-6">
                  <h3 className="font-semibold text-[#4a2b1d] mb-4 flex items-center">
                    <Scissors className="w-5 h-5 text-gold mr-2" />
                    Hair Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                        Hair Type *
                      </label>
                      <select
                        name="hairType"
                        value={formData.hairType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
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
                        className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                        Hair Density *
                      </label>
                      <select
                        name="hairDensity"
                        value={formData.hairDensity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
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
                        placeholder="e.g., Healthy, Damaged, Color-treated..."
                        className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Style Preferences */}
                <div className="border-b border-[#f6ede8] pb-6">
                  <h3 className="font-semibold text-[#4a2b1d] mb-4 flex items-center">
                    <Calendar className="w-5 h-5 text-gold mr-2" />
                    Style & Schedule
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                      Preferred Style *
                    </label>
                    <select
                      name="preferredStyle"
                      value={formData.preferredStyle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                        Preferred Date *
                      </label>
                      <div className="relative">
                        <Calendar className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
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
                        <Clock className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="time"
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="font-semibold text-[#4a2b1d] mb-4 flex items-center">
                    <MessageCircle className="w-5 h-5 text-gold mr-2" />
                    Additional Information
                  </h3>

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
                      className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none bg-white"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any special requests or information..."
                      rows={2}
                      className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none bg-white"
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
                      By submitting, you agree to our booking policy and terms
                      of service. A deposit is required to confirm your
                      appointment. You'll be redirected to the checkout page
                      after booking.
                    </span>
                  </p>
                </div>
              </form>
            </div>

            {/* Quick Contact Info */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl text-center shadow-luxury">
                <Phone className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="text-sm font-medium text-[#4a2b1d]">Call Us</p>
                <a
                  href="tel:6464007132"
                  className="text-sm text-[#7f482f] hover:text-gold"
                >
                  (548) 557-3218
                </a>
              </div>
              <div className="bg-white p-4 rounded-xl text-center shadow-luxury">
                <Mail className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="text-sm font-medium text-[#4a2b1d]">Email Us</p>
                <a
                  href="mailto:info@royallabelle.com"
                  className="text-sm text-[#7f482f] hover:text-gold"
                >
                  info@royallabelle.com
                </a>
              </div>
              <div className="bg-white p-4 rounded-xl text-center shadow-luxury">
                <Clock className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="text-sm font-medium text-[#4a2b1d]">Hours</p>
                <p className="text-sm text-[#7f482f]">Mon-Sat: 9AM - 7PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
