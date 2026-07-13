"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageCircle,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  Award,
  Sparkles,
  MapPin,
  DollarSign,
  CreditCard,
  Send,
  Building2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    notes: "",
    hairLength: "",
    hairDensity: "",
    hairTexture: "",
    goals: "",
    paymentMethod: "",
  });

  const services = [
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
      price: "Varies",
      deposit: "$200",
    },
    {
      value: "repair",
      label: "Loc Repair Service",
      price: "Varies",
      deposit: "$200",
    },
  ];

  const hairLengths = ["0-2 inches", "2-4 inches", "4-6 inches", "6+ inches"];
  const hairDensities = ["Thin", "Medium", "Thick", "Very Thick"];
  const hairTextures = ["Straight", "Wavy", "Curly", "Coily", "Kinky"];
  const paymentMethods = [
    { id: "stripe", label: "Credit/Debit Card", icon: CreditCard },
    { id: "zelle", label: "Zelle", icon: Send },
    { id: "interac", label: "Interac e-Transfer", icon: Building2 },
    { id: "cash", label: "Cash", icon: DollarSign },
  ];

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

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.service
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    if (step === 2) {
      if (
        !formData.hairLength ||
        !formData.hairDensity ||
        !formData.hairTexture ||
        !formData.goals
      ) {
        toast.error("Please complete all consultation questions");
        return;
      }
    }
    if (step === 3) {
      if (!formData.date) {
        toast.error("Please select a date");
        return;
      }
    }
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would call your API to create the appointment
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Booking created! Proceed to payment.");
      router.push(
        `/checkout?appointmentId=demo123&method=${formData.paymentMethod || "stripe"}`,
      );
    } catch (error) {
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedService = () => {
    return services.find((s) => s.value === formData.service);
  };

  const selectedService = getSelectedService();

  return (
    <div className="min-h-screen bg-[#fdf8f6] py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-[#7f482f] hover:text-[#c48d2c] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#4a2b1d]">
            Book Your Appointment
          </h1>
          <p className="text-[#7f482f] mt-2">
            Complete the steps below to schedule your loc service
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s === step
                    ? "bg-[#c48d2c] text-white"
                    : s < step
                      ? "bg-green-500 text-white"
                      : "bg-[#f6ede8] text-[#7f482f]"
                }`}
              >
                {s < step ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`w-12 h-1 ${s < step ? "bg-green-500" : "bg-[#f6ede8]"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between text-xs text-[#7f482f] mb-8 px-2">
          <span>Personal Info</span>
          <span>Hair Consultation</span>
          <span>Schedule</span>
          <span>Payment</span>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-luxury p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-[#4a2b1d]">
                  Personal Information
                </h2>
                <p className="text-[#7f482f] text-sm">
                  Tell us about yourself so we can reach you.
                </p>

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
                        className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                        required
                      />
                    </div>
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
                        className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                        required
                      />
                    </div>
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
                      className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Service Type *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select a service...</option>
                    {services.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label} - {service.price}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedService && (
                  <div className="bg-[#fdf8f6] p-4 rounded-lg">
                    <p className="text-sm text-[#7f482f]">
                      <span className="font-medium">Deposit Required:</span>{" "}
                      {selectedService.deposit}
                    </p>
                    <p className="text-sm text-[#7f482f]">
                      <span className="font-medium">Total Price:</span>{" "}
                      {selectedService.price}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Hair Consultation */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-[#4a2b1d]">
                  Hair Consultation
                </h2>
                <p className="text-[#7f482f] text-sm">
                  Help me understand your hair so I can provide the best
                  service.
                </p>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Hair Length *
                  </label>
                  <select
                    name="hairLength"
                    value={formData.hairLength}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select hair length...</option>
                    {hairLengths.map((length) => (
                      <option key={length} value={length}>
                        {length}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Hair Density *
                  </label>
                  <select
                    name="hairDensity"
                    value={formData.hairDensity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select hair density...</option>
                    {hairDensities.map((density) => (
                      <option key={density} value={density}>
                        {density}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Hair Texture *
                  </label>
                  <select
                    name="hairTexture"
                    value={formData.hairTexture}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select hair texture...</option>
                    {hairTextures.map((texture) => (
                      <option key={texture} value={texture}>
                        {texture}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Your Hair Goals *
                  </label>
                  <div className="relative">
                    <MessageCircle className="w-5 h-5 text-[#7f482f] absolute left-3 top-3" />
                    <textarea
                      name="goals"
                      value={formData.goals}
                      onChange={handleChange}
                      placeholder="What are your hair goals? (e.g., length, style, maintenance)"
                      rows={4}
                      className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="bg-[#fff5e6] p-4 rounded-lg border-l-4 border-[#c48d2c]">
                  <p className="text-sm text-[#7f482f]">
                    <span className="font-medium">💡 Tip:</span> Be as detailed
                    as possible about your hair goals. This helps me prepare the
                    best service for you.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-[#4a2b1d]">
                  Choose Your Schedule
                </h2>
                <p className="text-[#7f482f] text-sm">
                  Select your preferred date and time for the appointment.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                      Preferred Time
                    </label>
                    <div className="relative">
                      <Clock className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#fdf8f6] p-4 rounded-lg">
                  <p className="text-sm text-[#7f482f] flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-[#c48d2c]" />
                    Available hours: Monday - Saturday, 9:00 AM - 7:00 PM
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special requests or information..."
                    rows={3}
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Payment Method */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-[#4a2b1d]">
                  Payment Method
                </h2>
                <p className="text-[#7f482f] text-sm">
                  Select how you'd like to pay your $
                  {selectedService?.deposit || "200"} deposit.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = formData.paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, paymentMethod: method.id })
                        }
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? "border-[#c48d2c] bg-[#fdf8f6] shadow-lg"
                            : "border-[#f6ede8] hover:border-[#d4a691]"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isSelected
                                ? "bg-[#c48d2c] text-white"
                                : "bg-[#f6ede8] text-[#7f482f]"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-[#4a2b1d]">
                              {method.label}
                            </p>
                            <p className="text-xs text-[#7f482f]">
                              {method.id === "stripe" && "Instant confirmation"}
                              {method.id === "zelle" && "US banks only"}
                              {method.id === "interac" && "Canadian banks"}
                              {method.id === "cash" && "Pay in person"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {formData.paymentMethod && (
                  <div className="bg-[#fff5e6] p-4 rounded-lg border-l-4 border-[#c48d2c]">
                    <p className="text-sm text-[#7f482f]">
                      {formData.paymentMethod === "stripe" &&
                        "💳 You will be redirected to Stripe to complete your secure payment."}
                      {formData.paymentMethod === "zelle" &&
                        "🏦 You will receive Zelle payment instructions via email after booking."}
                      {formData.paymentMethod === "interac" &&
                        "🏦 You will receive Interac e-Transfer instructions via email after booking."}
                      {formData.paymentMethod === "cash" &&
                        "💵 No deposit required upfront. Pay in full on the day of service."}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-[#f6ede8]">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleBack}
                  className="flex-1"
                >
                  Back
                </Button>
              )}

              {step < 4 ? (
                <Button
                  type="button"
                  variant="gold"
                  size="lg"
                  onClick={handleNext}
                  className="flex-1"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  disabled={isSubmitting || !formData.paymentMethod}
                  className="flex-1"
                >
                  {isSubmitting ? "Booking..." : "Complete Booking"}
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-[#7f482f]">
            <span>📍 735 Liberty Avenue, Brooklyn, NY 11208</span>
            <span>•</span>
            <span>📞 (646) 400-7132</span>
            <span>•</span>
            <span>⏰ Mon-Sat: 9AM - 7PM</span>
          </div>
          <p className="text-xs text-[#7f482f] mt-2">
            By booking, you agree to our booking policy and terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}
