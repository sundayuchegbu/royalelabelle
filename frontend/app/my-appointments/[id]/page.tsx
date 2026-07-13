"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  DollarSign,
  CreditCard,
  ArrowLeft,
  Home,
  Printer,
  Download,
  Share2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatDate, formatPrice } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface AppointmentDetails {
  _id: string;
  serviceType: "twist" | "braids" | "interlocking" | "retie" | "repair";
  appointmentDate: string;
  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "payment_pending"
    | "payment_verified";
  depositAmount: number;
  fullPrice: number;
  paymentMethod: "stripe" | "zelle" | "interac" | "cash";
  stripePaymentId?: string;
  notes?: string;
  lateFee: number;
  rescheduleCount: number;
  createdAt: string;
  updatedAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  consultationId: {
    _id: string;
    hairLength: string;
    hairDensity: string;
    hairType: string;
    hairCondition: string;
    preferredStyle: string;
    preferredDate: string;
    preferredTime: string;
    goals: string;
    notes: string;
  };
}

export default function AppointmentConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const appointmentId = params.id as string;

  const [appointment, setAppointment] = useState<AppointmentDetails | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId, isAuthenticated, authLoading]);

  const fetchAppointment = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/user/appointments/${appointmentId}`);

      if (response.data.success) {
        setAppointment(response.data.appointment);
      } else {
        setError("Failed to load appointment details");
      }
    } catch (error: any) {
      console.error("Error fetching appointment:", error);
      if (error.response?.status === 404) {
        setError("Appointment not found");
      } else {
        setError(
          error.response?.data?.message || "Failed to load appointment details",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "My Appointment - Royale la'belle",
        text: `Appointment confirmed for ${appointment?.serviceType} on ${formatDate(appointment?.appointmentDate || "")}`,
        url: window.location.href,
      });
    } catch (error) {
      if ((error as any).name !== "AbortError") {
        toast.error("Sharing failed");
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      completed: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      payment_pending: "bg-orange-100 text-orange-700 border-orange-200",
      payment_verified: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      confirmed: "✅ Confirmed",
      pending: "⏳ Pending",
      completed: "✅ Completed",
      cancelled: "❌ Cancelled",
      payment_pending: "💳 Payment Pending",
      payment_verified: "✅ Payment Verified",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getServiceLabel = (service: string) => {
    const labels = {
      twist: "Micro Locs - Twist Method",
      braids: "Micro Locs - Braids Method",
      interlocking: "Micro Locs - Interlocking Method",
      retie: "Retie Maintenance",
      repair: "Loc Repair Service",
    };
    return labels[service as keyof typeof labels] || service;
  };

  const getPaymentLabel = (method: string) => {
    const labels = {
      stripe: "💳 Credit/Debit Card",
      zelle: "🏦 Zelle",
      interac: "🏦 Interac e-Transfer",
      cash: "💵 Cash",
    };
    return labels[method as keyof typeof labels] || method;
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#fdf8f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c48d2c] mx-auto"></div>
          <p className="mt-4 text-[#7f482f]">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-[#fdf8f6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-luxury p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-[#4a2b1d] mb-2">
            Appointment Not Found
          </h2>
          <p className="text-[#7f482f] mb-6">
            {error ||
              "The appointment you're looking for doesn't exist or you don't have permission to view it."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/my-appointments">
              <Button variant="primary" size="md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                My Appointments
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="md">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isConfirmed =
    appointment.status === "confirmed" ||
    appointment.status === "payment_verified";
  const isCompleted = appointment.status === "completed";

  return (
    <div className="min-h-screen bg-[#fdf8f6] py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Success Banner - Only show if confirmed */}
        {isConfirmed && (
          <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-4 animate-fadeInUp">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">
                Payment Successful! 🎉
              </h3>
              <p className="text-sm text-green-700">
                Your appointment has been confirmed. We've sent a confirmation
                email to {appointment.userId.email}
              </p>
            </div>
          </div>
        )}

        {/* Back Button */}
        <Link
          href="/my-appointments"
          className="inline-flex items-center text-[#7f482f] hover:text-[#c48d2c] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Appointments
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-luxury overflow-hidden">
          {/* Header */}
          <div
            className={`p-6 sm:p-8 ${isConfirmed ? "bg-gradient-gold" : "bg-[#4a2b1d]"}`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  {isConfirmed ? (
                    <CheckCircle className="w-8 h-8 text-white" />
                  ) : (
                    <Sparkles className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl text-white font-bold">
                    {isConfirmed
                      ? "Appointment Confirmed! 🎉"
                      : "Appointment Details"}
                  </h1>
                  <p className="text-white/80 text-sm mt-1">
                    {isConfirmed
                      ? "Your appointment has been successfully confirmed"
                      : "Please complete payment to confirm your appointment"}
                  </p>
                </div>
              </div>
              <div
                className={`px-4 py-2 rounded-full border text-sm font-medium ${getStatusColor(appointment.status)}`}
              >
                {getStatusLabel(appointment.status)}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Appointment ID */}
            <div className="bg-[#fdf8f6] rounded-lg p-4 flex items-center justify-between">
              <span className="text-sm text-[#7f482f]">Appointment ID</span>
              <span className="font-mono text-sm text-[#4a2b1d] font-medium">
                #{appointment._id.slice(-8).toUpperCase()}
              </span>
            </div>

            {/* Service Details */}
            <div className="border-b border-[#f6ede8] pb-6">
              <h3 className="font-semibold text-[#4a2b1d] mb-4">
                Service Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-[#c48d2c] mt-0.5" />
                  <div>
                    <p className="text-sm text-[#7f482f]">Service</p>
                    <p className="font-medium text-[#4a2b1d]">
                      {getServiceLabel(appointment.serviceType)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-[#c48d2c] mt-0.5" />
                  <div>
                    <p className="text-sm text-[#7f482f]">Date & Time</p>
                    <p className="font-medium text-[#4a2b1d]">
                      {formatDate(appointment.appointmentDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-[#c48d2c] mt-0.5" />
                  <div>
                    <p className="text-sm text-[#7f482f]">Total Price</p>
                    <p className="font-medium text-[#4a2b1d]">
                      {formatPrice(appointment.fullPrice)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CreditCard className="w-5 h-5 text-[#c48d2c] mt-0.5" />
                  <div>
                    <p className="text-sm text-[#7f482f]">Payment Method</p>
                    <p className="font-medium text-[#4a2b1d]">
                      {getPaymentLabel(appointment.paymentMethod)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="border-b border-[#f6ede8] pb-6">
              <h3 className="font-semibold text-[#4a2b1d] mb-4">
                Payment Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#fdf8f6] rounded-lg p-4">
                  <p className="text-sm text-[#7f482f]">Deposit Paid</p>
                  <p className="text-xl font-bold text-[#c48d2c]">
                    {formatPrice(appointment.depositAmount)}
                  </p>
                </div>
                <div className="bg-[#fdf8f6] rounded-lg p-4">
                  <p className="text-sm text-[#7f482f]">Remaining Balance</p>
                  <p className="text-xl font-bold text-[#4a2b1d]">
                    {formatPrice(
                      appointment.fullPrice - appointment.depositAmount,
                    )}
                  </p>
                </div>
              </div>
              {appointment.stripePaymentId && (
                <p className="text-xs text-[#7f482f] mt-2">
                  Payment ID: {appointment.stripePaymentId}
                </p>
              )}
            </div>

            {/* Location Information */}
            <div className="border-b border-[#f6ede8] pb-6">
              <h3 className="font-semibold text-[#4a2b1d] mb-4">📍 Location</h3>
              <div className="bg-[#fdf8f6] rounded-lg p-4">
                <p className="font-medium text-[#4a2b1d]">Royale la'belle</p>
                <p className="text-[#7f482f] text-sm">735 Liberty Avenue</p>
                <p className="text-[#7f482f] text-sm">Brooklyn, NY 11208</p>
                <p className="text-[#7f482f] text-sm">
                  Between Liberty and Linwood, East New York
                </p>
                <div className="mt-3 flex items-center space-x-4">
                  <a
                    href="https://www.google.com/maps?q=735+Liberty+Avenue+Brooklyn+NY+11208"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#c48d2c] hover:underline"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="border-b border-[#f6ede8] pb-6">
              <h3 className="font-semibold text-[#4a2b1d] mb-4">
                📋 Important Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#c48d2c] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#4a2b1d]">Arrival Time</p>
                    <p className="text-sm text-[#7f482f]">
                      Please arrive 10 minutes before your appointment time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#c48d2c] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#4a2b1d]">Late Policy</p>
                    <p className="text-sm text-[#7f482f]">
                      $20 late fee if you arrive 15 minutes late. 20+ minutes
                      late will result in rescheduling and deposit forfeiture.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-[#c48d2c] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#4a2b1d]">
                      No Extra Guests
                    </p>
                    <p className="text-sm text-[#7f482f]">
                      Due to limited space, we cannot accommodate additional
                      guests.
                    </p>
                  </div>
                </div>
                {appointment.notes && (
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-[#c48d2c] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-[#4a2b1d]">Your Notes</p>
                      <p className="text-sm text-[#7f482f] italic">
                        "{appointment.notes}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              {isConfirmed && !isCompleted && (
                <Link href={`/my-appointments/${appointment._id}/reschedule`}>
                  <Button variant="outline" size="md">
                    <Calendar className="w-4 h-4 mr-2" />
                    Reschedule
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="md" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="md" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Link href="/">
                <Button variant="gold" size="md">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>

            {/* Contact Support */}
            <div className="bg-[#fff5e6] rounded-lg p-4 border-l-4 border-[#c48d2c]">
              <p className="text-sm text-[#7f482f]">
                <span className="font-medium">Need help?</span> Contact us at{" "}
                <a
                  href="tel:6464007132"
                  className="text-[#c48d2c] font-medium hover:underline"
                >
                  (646) 400-7132
                </a>{" "}
                or{" "}
                <a
                  href="mailto:info@royallabelle.com"
                  className="text-[#c48d2c] font-medium hover:underline"
                >
                  info@royallabelle.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Consultation Summary */}
        {appointment.consultationId && (
          <div className="mt-6 bg-white rounded-2xl shadow-luxury p-6">
            <h3 className="font-semibold text-[#4a2b1d] mb-4">
              💇‍♀️ Consultation Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#7f482f]">Hair Type</p>
                <p className="font-medium text-[#4a2b1d]">
                  {appointment.consultationId.hairType}
                </p>
              </div>
              <div>
                <p className="text-[#7f482f]">Hair Length</p>
                <p className="font-medium text-[#4a2b1d]">
                  {appointment.consultationId.hairLength}
                </p>
              </div>
              <div>
                <p className="text-[#7f482f]">Hair Density</p>
                <p className="font-medium text-[#4a2b1d]">
                  {appointment.consultationId.hairDensity}
                </p>
              </div>
              <div>
                <p className="text-[#7f482f]">Hair Condition</p>
                <p className="font-medium text-[#4a2b1d]">
                  {appointment.consultationId.hairCondition}
                </p>
              </div>
              {appointment.consultationId.goals && (
                <div className="sm:col-span-2">
                  <p className="text-[#7f482f]">Hair Goals</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {appointment.consultationId.goals}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add to Calendar */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <a
            href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
              getServiceLabel(appointment.serviceType),
            )}&dates=${new Date(appointment.appointmentDate).toISOString().replace(/-|:|\.\d+/g, "")}/${new Date(
              new Date(appointment.appointmentDate).getTime() +
                2 * 60 * 60 * 1000,
            )
              .toISOString()
              .replace(/-|:|\.\d+/g, "")}&details=${encodeURIComponent(
              `Appointment at Royale la'belle - ${appointment.notes || ""}`,
            )}&location=${encodeURIComponent("735 Liberty Avenue, Brooklyn, NY 11208")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-white border border-[#f6ede8] rounded-lg text-sm text-[#4a2b1d] hover:bg-[#fdf8f6] transition-colors"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Add to Google Calendar
          </a>
        </div>
      </div>
    </div>
  );
}
