"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Clock,
  DollarSign,
  ChevronRight,
  XCircle,
  Calendar as CalendarIcon,
  CreditCard,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatDate, formatPrice } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Appointment {
  _id: string;
  serviceType: string;
  appointmentDate: string;
  status: string;
  depositAmount: number;
  fullPrice: number;
  paymentMethod: string;
  paymentStatus?: string;
  notes?: string;
  consultationId?: {
    hairLength: string;
    hairTexture: string;
  };
}

export default function MyAppointmentsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isLoading, isAuthenticated, router, filter, page]);

  const fetchAppointments = async () => {
    setIsLoadingAppointments(true);
    try {
      const response = await api.get("/user/appointments", {
        params: {
          status: filter === "all" ? undefined : filter,
          page,
          limit: 10,
        },
      });
      setAppointments(response.data.appointments);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const handleContinuePayment = async (appointmentId: string) => {
    try {
      toast.loading("Checking appointment status...");
      const response = await api.get(
        `/user/appointments/${appointmentId}/continue-payment`,
      );

      if (response.data.success) {
        toast.dismiss();
        toast.success("Redirecting to payment...");
        router.push(`/checkout?appointmentId=${appointmentId}`);
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Unable to continue payment",
      );
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await api.put(`/user/appointments/${id}/cancel`);
      toast.success("Appointment cancelled successfully");
      fetchAppointments();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment",
      );
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      completed: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
      payment_pending: "bg-orange-100 text-orange-700",
      payment_verified: "bg-purple-100 text-purple-700",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      confirmed: "✅ Confirmed",
      pending: "⏳ Pending Payment",
      completed: "✅ Completed",
      cancelled: "❌ Cancelled",
      payment_pending: "💳 Payment Pending",
      payment_verified: "✅ Payment Verified",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getServiceLabel = (service: string) => {
    const labels = {
      twist: "Micro Locs - Twist",
      braids: "Micro Locs - Braids",
      interlocking: "Micro Locs - Interlocking",
      retie: "Retie Maintenance",
      repair: "Loc Repair",
    };
    return labels[service as keyof typeof labels] || service;
  };

  const getPaymentLabel = (method: string) => {
    const labels = {
      stripe: "💳 Card",
      zelle: "🏦 Zelle",
      interac: "🏦 Interac",
      cash: "💵 Cash",
    };
    return labels[method as keyof typeof labels] || method;
  };

  // Check if payment can be continued
  const canContinuePayment = (appointment: Appointment) => {
    return (
      appointment.status === "pending" ||
      appointment.status === "payment_pending"
    );
  };

  if (isLoading || isLoadingAppointments) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-[#7f482f]">Loading appointments...</p>
        </div>
      </div>
    );
  }

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending Payment" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen bg-[#fdf8f6] pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-[#4a2b1d]">
              My Appointments
            </h1>
            <p className="text-[#7f482f] mt-1">
              View and manage all your bookings
            </p>
          </div>
          <Button
            variant="gold"
            size="sm"
            onClick={() => router.push("/#booking")}
            className="mt-4 sm:mt-0"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book New
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === option.value
                  ? "bg-gold text-white"
                  : "bg-white text-[#7f482f] hover:bg-[#f6ede8]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-luxury p-8 text-center">
            <Calendar className="w-16 h-16 text-[#d4a691] mx-auto mb-4" />
            <h3 className="font-serif text-xl text-[#4a2b1d]">
              No Appointments Found
            </h3>
            <p className="text-[#7f482f] mt-2">
              {filter === "all"
                ? "You haven't booked any appointments yet."
                : `No ${filter} appointments found.`}
            </p>
            <Button
              variant="gold"
              size="md"
              onClick={() => router.push("/#booking")}
              className="mt-4"
            >
              Book Your First Appointment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const needsPayment = canContinuePayment(appointment);

              return (
                <div
                  key={appointment._id}
                  className={`bg-white rounded-xl shadow-luxury p-6 hover:shadow-2xl transition-shadow ${
                    needsPayment ? "border-2 border-yellow-400" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                        >
                          {getStatusLabel(appointment.status)}
                        </span>
                        {needsPayment && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Payment Required
                          </span>
                        )}
                        <span className="text-sm text-[#7f482f]">
                          {getPaymentLabel(appointment.paymentMethod)}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl text-[#4a2b1d]">
                        {getServiceLabel(appointment.serviceType)}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                        <div className="flex items-center space-x-2 text-sm text-[#7f482f]">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{formatDate(appointment.appointmentDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-[#7f482f]">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatPrice(appointment.fullPrice)}</span>
                          <span className="text-xs text-[#7f482f]">
                            (Deposit: {formatPrice(appointment.depositAmount)})
                          </span>
                        </div>
                      </div>

                      {appointment.notes && (
                        <p className="text-sm text-[#7f482f] mt-2 italic">
                          "{appointment.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
                      {needsPayment && (
                        <Button
                          variant="gold"
                          size="sm"
                          onClick={() => handleContinuePayment(appointment._id)}
                          className="whitespace-nowrap"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Complete Payment
                        </Button>
                      )}

                      {appointment.status !== "cancelled" &&
                        appointment.status !== "completed" && (
                          <button
                            onClick={() => handleCancel(appointment._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel Appointment"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}

                      <button
                        onClick={() =>
                          router.push(`/my-appointments/${appointment._id}`)
                        }
                        className="p-2 text-gold hover:bg-[#fdf8f6] rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Payment reminder for pending appointments */}
                  {needsPayment && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Payment pending</p>
                        <p className="text-yellow-700">
                          Complete your payment to confirm this appointment.
                          Click the "Complete Payment" button above.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-[#7f482f]">
              Page {page} of {totalPages}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-[#f6ede8] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#fdf8f6]"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-[#f6ede8] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#fdf8f6]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
