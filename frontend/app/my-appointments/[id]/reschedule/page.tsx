"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Clock,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
  Info,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatDate, formatPrice } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Appointment {
  _id: string;
  serviceType: "twist" | "braids" | "interlocking" | "retie" | "repair";
  appointmentDate: string;
  status: string;
  depositAmount: number;
  fullPrice: number;
  paymentMethod: string;
  notes?: string;
  rescheduleCount: number;
}

export default function ReschedulePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const appointmentId = params.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rescheduleInfo, setRescheduleInfo] = useState<{
    canReschedule: boolean;
    depositTransferable: boolean;
    maxReschedules: number;
    currentReschedules: number;
    message: string;
  } | null>(null);

  const serviceLabels: Record<string, string> = {
    twist: "Micro Locs - Twist Method",
    braids: "Micro Locs - Braids Method",
    interlocking: "Micro Locs - Interlocking Method",
    retie: "Retie Maintenance",
    repair: "Loc Repair Service",
  };

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
        const appointmentData = response.data.appointment;
        setAppointment(appointmentData);

        // Set default date and time from appointment
        const date = new Date(appointmentData.appointmentDate);
        setNewDate(date.toISOString().split("T")[0]);
        setNewTime(date.toTimeString().slice(0, 5));

        // Check reschedule eligibility
        const canReschedule =
          appointmentData.status !== "cancelled" &&
          appointmentData.status !== "completed" &&
          appointmentData.rescheduleCount < 1;

        setRescheduleInfo({
          canReschedule,
          depositTransferable: true,
          maxReschedules: 1,
          currentReschedules: appointmentData.rescheduleCount || 0,
          message:
            appointmentData.rescheduleCount >= 1
              ? "You have already rescheduled this appointment once. Further rescheduling is not allowed."
              : appointmentData.status === "cancelled"
                ? "This appointment has been cancelled and cannot be rescheduled."
                : appointmentData.status === "completed"
                  ? "This appointment has been completed and cannot be rescheduled."
                  : "You can reschedule this appointment. Please note that rescheduling must be within 7 days of the original date.",
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching appointment:", error);
      setError(error.response?.data?.message || "Failed to load appointment");
      setIsLoading(false);
    }
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDate || !newTime) {
      toast.error("Please select both date and time");
      return;
    }

    // Combine date and time
    const newDateTime = new Date(`${newDate}T${newTime}:00`).toISOString();

    // Check if new date is in the future
    if (new Date(newDateTime) <= new Date()) {
      toast.error("Appointment date must be in the future");
      return;
    }

    // Check if within 7 days
    const originalDate = new Date(appointment!.appointmentDate);
    const proposedDate = new Date(newDateTime);
    const diffDays = Math.ceil(
      Math.abs(proposedDate.getTime() - originalDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (diffDays > 7) {
      toast.error(
        "Rescheduling must be within 7 days of the original appointment date. Your deposit will be forfeited.",
      );
      if (
        !confirm(
          "Your deposit will be forfeited. Are you sure you want to proceed?",
        )
      ) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await api.put(
        `/user/appointments/${appointmentId}/reschedule`,
        {
          newDate: newDateTime,
        },
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Appointment rescheduled successfully",
        );

        // Show deposit transfer message if applicable
        if (response.data.depositTransferable) {
          toast.success(
            "Your deposit has been transferred to the new appointment",
          );
        } else {
          toast("Deposit forfeited. A new deposit will be required.");
        }

        // Redirect to appointment details
        setTimeout(() => {
          router.push(`/my-appointments/${appointmentId}`);
        }, 1500);
      }
    } catch (error: any) {
      console.error("Reschedule error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        if (error.response.data.depositForfeited) {
          toast("Deposit forfeited due to late reschedule");
        }
      } else {
        toast.error("Failed to reschedule appointment");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      completed: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
      payment_pending: "bg-orange-100 text-orange-700",
      payment_verified: "bg-purple-100 text-purple-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      confirmed: "✅ Confirmed",
      pending: "⏳ Pending",
      completed: "✅ Completed",
      cancelled: "❌ Cancelled",
      payment_pending: "💳 Payment Pending",
      payment_verified: "✅ Payment Verified",
    };
    return labels[status] || status;
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#fdf8f6] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#c48d2c] animate-spin mx-auto" />
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
            Unable to Reschedule
          </h2>
          <p className="text-[#7f482f] mb-6">
            {error ||
              "Appointment not found or you do not have permission to reschedule it."}
          </p>
          <Link href={`/my-appointments/${appointmentId}`}>
            <Button variant="primary" size="md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Appointment
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const canReschedule =
    rescheduleInfo?.canReschedule &&
    appointment.status !== "cancelled" &&
    appointment.status !== "completed";

  return (
    <div className="min-h-screen bg-[#fdf8f6] py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        {/* Back Button */}
        <Link
          href={`/my-appointments/${appointmentId}`}
          className="inline-flex items-center text-[#7f482f] hover:text-[#c48d2c] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Appointment
        </Link>

        <div className="bg-white rounded-2xl shadow-luxury overflow-hidden">
          {/* Header */}
          <div className="bg-[#4a2b1d] p-6 text-center">
            <Calendar className="w-12 h-12 text-[#c48d2c] mx-auto mb-3" />
            <h1 className="font-serif text-2xl text-white">
              Reschedule Appointment
            </h1>
            <p className="text-[#d4a691] text-sm mt-1">
              #{appointment._id.slice(-8).toUpperCase()}
            </p>
          </div>

          <div className="p-6">
            {/* Appointment Info */}
            <div className="bg-[#fdf8f6] rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-[#4a2b1d] mb-2">
                Current Appointment
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[#7f482f]">Service</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {serviceLabels[appointment.serviceType] ||
                      appointment.serviceType}
                  </p>
                </div>
                <div>
                  <p className="text-[#7f482f]">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                  >
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
                <div>
                  <p className="text-[#7f482f]">Date</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {formatDate(appointment.appointmentDate)}
                  </p>
                </div>
                <div>
                  <p className="text-[#7f482f]">Reschedule Count</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {appointment.rescheduleCount || 0} of{" "}
                    {rescheduleInfo?.maxReschedules || 1}
                  </p>
                </div>
              </div>
            </div>

            {/* Reschedule Info */}
            {rescheduleInfo && (
              <div
                className={`p-4 rounded-lg mb-6 ${
                  rescheduleInfo.canReschedule
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start gap-2">
                  {rescheduleInfo.canReschedule ? (
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="text-sm">
                    <p
                      className={
                        rescheduleInfo.canReschedule
                          ? "text-blue-800"
                          : "text-red-800"
                      }
                    >
                      {rescheduleInfo.message}
                    </p>
                    {rescheduleInfo.canReschedule && (
                      <p className="text-blue-700 mt-1">
                        ⚠️ Rescheduling must be within 7 days of the original
                        appointment date.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reschedule Form */}
            {canReschedule ? (
              <form onSubmit={handleReschedule} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    New Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    New Time *
                  </label>
                  <div className="relative">
                    <Clock className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="bg-[#fff5e6] p-3 rounded-lg border-l-4 border-[#c48d2c]">
                  <p className="text-xs text-[#7f482f] flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#c48d2c] flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Note:</strong> Rescheduling more than 7 days from
                      the original date will result in deposit forfeiture. You
                      can only reschedule once.
                    </span>
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Link
                    href={`/my-appointments/${appointmentId}`}
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Rescheduling...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm Reschedule
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-[#4a2b1d] font-medium">Cannot Reschedule</p>
                <p className="text-sm text-[#7f482f] mt-1">
                  {rescheduleInfo?.message ||
                    "This appointment cannot be rescheduled."}
                </p>
                <Link href={`/my-appointments/${appointmentId}`}>
                  <Button variant="primary" size="md" className="mt-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Appointment
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
