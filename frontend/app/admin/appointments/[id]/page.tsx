"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  CreditCard,
  Send,
  Building2,
  Wallet,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Edit2,
  Save,
  X,
  Printer,
  Download,
  MessageCircle,
  Mail as MailIcon,
  RefreshCw,
  Trash2,
  Shield,
  AlertTriangle,
  Eye,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatDate, formatPrice } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Appointment {
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
    profileImage?: string;
    location?: string;
    bio?: string;
    createdAt?: string; // Add this
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

export default function AdminAppointmentDetails() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState({
    status: "",
    appointmentDate: "",
    notes: "",
    lateFee: 0,
  });

  const statusOptions = [
    {
      value: "pending",
      label: "⏳ Pending",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      value: "confirmed",
      label: "✅ Confirmed",
      color: "bg-green-100 text-green-700",
    },
    {
      value: "completed",
      label: "✅ Completed",
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "cancelled",
      label: "❌ Cancelled",
      color: "bg-red-100 text-red-700",
    },
    {
      value: "payment_pending",
      label: "💳 Payment Pending",
      color: "bg-orange-100 text-orange-700",
    },
    {
      value: "payment_verified",
      label: "✅ Payment Verified",
      color: "bg-purple-100 text-purple-700",
    },
  ];

  const serviceLabels: Record<string, string> = {
    twist: "Micro Locs - Twist Method",
    braids: "Micro Locs - Braids Method",
    interlocking: "Micro Locs - Interlocking Method",
    retie: "Retie Maintenance",
    repair: "Loc Repair Service",
  };

  const paymentLabels: Record<string, string> = {
    stripe: "💳 Credit/Debit Card",
    zelle: "🏦 Zelle",
    interac: "🏦 Interac e-Transfer",
    cash: "💵 Cash",
  };

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/admin/appointments/${appointmentId}`);
      setAppointment(response.data.appointment);
      setEditData({
        status: response.data.appointment.status,
        appointmentDate:
          response.data.appointment.appointmentDate?.split("T")[0] || "",
        notes: response.data.appointment.notes || "",
        lateFee: response.data.appointment.lateFee || 0,
      });
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching appointment:", error);
      toast.error(
        error.response?.data?.message || "Failed to load appointment",
      );
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await api.put(`/admin/appointments/${appointmentId}`, editData);
      toast.success("Appointment updated successfully");
      setIsEditing(false);
      fetchAppointment();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update appointment",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this appointment? This action cannot be undone.",
      )
    )
      return;

    setIsDeleting(true);
    try {
      await api.delete(`/admin/appointments/${appointmentId}`);
      toast.success("Appointment deleted successfully");
      router.push("/admin/appointments");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete appointment",
      );
      setIsDeleting(false);
    }
  };

  const handleSendEmail = () => {
    if (appointment?.userId?.email) {
      window.location.href = `mailto:${appointment.userId.email}`;
    }
  };

  const handleWhatsApp = () => {
    if (appointment?.userId?.phone) {
      const phone = appointment.userId.phone.replace(/\D/g, "");
      window.open(`https://wa.me/${phone}`, "_blank");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      completed: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      payment_pending: "bg-orange-100 text-orange-700 border-orange-200",
      payment_verified: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-[#7f482f]">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">Appointment not found</p>
        <Link href="/admin/appointments">
          <Button variant="primary" size="sm" className="mt-4">
            Back to Appointments
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/appointments"
            className="p-2 rounded-lg hover:bg-[#f6ede8] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#7f482f]" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl text-[#4a2b1d]">
              Appointment #{appointment._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-[#7f482f]">
              {serviceLabels[appointment.serviceType] ||
                appointment.serviceType}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          <button
            onClick={handlePrint}
            className="p-2 rounded-lg border border-[#f6ede8] hover:bg-[#fdf8f6] transition-colors"
          >
            <Printer className="w-4 h-4 text-[#7f482f]" />
          </button>
          <button
            onClick={handleWhatsApp}
            className="p-2 rounded-lg border border-[#f6ede8] hover:bg-[#25D366]/10 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
          </button>
          <button
            onClick={handleSendEmail}
            className="p-2 rounded-lg border border-[#f6ede8] hover:bg-[#f6ede8] transition-colors"
          >
            <MailIcon className="w-4 h-4 text-[#7f482f]" />
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          <Button variant="gold" size="sm" onClick={fetchAppointment}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <div
        className={`rounded-xl p-4 mb-6 border ${getStatusColor(appointment.status)}`}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-lg">
              {getStatusLabel(appointment.status)}
            </span>
            <span className="text-sm opacity-75">
              Updated: {formatDate(appointment.updatedAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Payment:{" "}
              {paymentLabels[appointment.paymentMethod] ||
                appointment.paymentMethod}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Details */}
          <div className="bg-white rounded-xl shadow-luxury p-6">
            <h2 className="font-semibold text-[#4a2b1d] mb-4">
              Appointment Details
            </h2>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Status
                  </label>
                  <select
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({ ...editData, status: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={editData.appointmentDate}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        appointmentDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Late Fee ($)
                  </label>
                  <input
                    type="number"
                    value={editData.lateFee}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        lateFee: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    min="0"
                    step="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Notes
                  </label>
                  <textarea
                    value={editData.notes}
                    onChange={(e) =>
                      setEditData({ ...editData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="gold"
                    size="md"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#7f482f]">Service</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {serviceLabels[appointment.serviceType] ||
                      appointment.serviceType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7f482f]">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                  >
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[#7f482f]">Date & Time</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {formatDate(appointment.appointmentDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7f482f]">Payment Method</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {paymentLabels[appointment.paymentMethod] ||
                      appointment.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7f482f]">Total Price</p>
                  <p className="font-bold text-gold">
                    {formatPrice(appointment.fullPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7f482f]">Deposit Paid</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {formatPrice(appointment.depositAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7f482f]">Late Fee</p>
                  <p className="font-medium text-red-600">
                    {formatPrice(appointment.lateFee || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7f482f]">Reschedule Count</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {appointment.rescheduleCount || 0}
                  </p>
                </div>
                {appointment.stripePaymentId && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-[#7f482f]">Stripe Payment ID</p>
                    <p className="font-mono text-sm text-[#4a2b1d]">
                      {appointment.stripePaymentId}
                    </p>
                  </div>
                )}
                {appointment.notes && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-[#7f482f]">Notes</p>
                    <p className="text-sm text-[#4a2b1d]">
                      {appointment.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Consultation Details */}
          <div className="bg-white rounded-xl shadow-luxury p-6">
            <h2 className="font-semibold text-[#4a2b1d] mb-4">
              💇‍♀️ Consultation Summary
            </h2>
            {appointment.consultationId ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#7f482f]">Hair Type</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {appointment.consultationId.hairType || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7f482f]">Hair Length</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {appointment.consultationId.hairLength || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7f482f]">Hair Density</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {appointment.consultationId.hairDensity || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7f482f]">Hair Condition</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {appointment.consultationId.hairCondition || "N/A"}
                  </p>
                </div>
                {appointment.consultationId.goals && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-[#7f482f]">Hair Goals</p>
                    <p className="font-medium text-[#4a2b1d]">
                      {appointment.consultationId.goals}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[#7f482f]">No consultation data available</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-luxury p-6">
            <h2 className="font-semibold text-[#4a2b1d] mb-4">👤 Customer</h2>
            {appointment.userId ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-white font-bold text-lg">
                    {appointment.userId.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-[#4a2b1d]">
                      {appointment.userId.name || "Unknown"}
                    </p>
                    <p className="text-xs text-[#7f482f]">
                      Customer since{" "}
                      {appointment.userId.createdAt
                        ? formatDate(appointment.userId.createdAt)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#f6ede8] pt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-[#7f482f]" />
                    <a
                      href={`mailto:${appointment.userId.email}`}
                      className="text-[#4a2b1d] hover:text-gold"
                    >
                      {appointment.userId.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-[#7f482f]" />
                    <a
                      href={`tel:${appointment.userId.phone}`}
                      className="text-[#4a2b1d] hover:text-gold"
                    >
                      {appointment.userId.phone || "N/A"}
                    </a>
                  </div>
                  {appointment.userId.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-[#7f482f]" />
                      <span className="text-[#4a2b1d]">
                        {appointment.userId.location}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      router.push(`/admin/clients/${appointment.userId._id}`)
                    }
                  >
                    <User className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      router.push(
                        `/admin/appointments?search=${appointment.userId.email}`,
                      )
                    }
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-[#7f482f]">
                No customer information available
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-luxury p-6">
            <h2 className="font-semibold text-[#4a2b1d] mb-4">
              ⚡ Quick Actions
            </h2>
            <div className="space-y-2">
              <Button
                variant="gold"
                size="sm"
                className="w-full justify-center"
                onClick={() =>
                  window.open(`/appointments/${appointment._id}`, "_blank")
                }
              >
                <Eye className="w-4 h-4 mr-2" />
                View Public Page
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                onClick={handleSendEmail}
              >
                <MailIcon className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="w-4 h-4 mr-2 text-[#25D366]" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  const date = new Date(appointment.appointmentDate);
                  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    serviceLabels[appointment.serviceType] ||
                      appointment.serviceType,
                  )}&dates=${date.toISOString().replace(/-|:|\.\d+/g, "")}/${new Date(
                    date.getTime() + 2 * 60 * 60 * 1000,
                  )
                    .toISOString()
                    .replace(/-|:|\.\d+/g, "")}&details=${encodeURIComponent(
                    `Appointment with ${appointment.userId?.name || "Customer"} - ${appointment.notes || ""}`,
                  )}&location=${encodeURIComponent("735 Liberty Avenue, Brooklyn, NY 11208")}`;
                  window.open(googleCalendarUrl, "_blank");
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Add to Calendar
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-luxury p-6 border border-red-200">
            <h2 className="font-semibold text-red-600 mb-4 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Danger Zone
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center border-red-300 text-red-600 hover:bg-red-50"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete Appointment"}
            </Button>
            <p className="text-xs text-[#7f482f] mt-2 text-center">
              This action cannot be undone. All data will be permanently
              removed.
            </p>
          </div>

          {/* Meta Information */}
          <div className="bg-white rounded-xl shadow-luxury p-6">
            <h2 className="font-semibold text-[#4a2b1d] mb-4">📋 Meta</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Created</span>
                <span className="text-[#4a2b1d]">
                  {formatDate(appointment.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Last Updated</span>
                <span className="text-[#4a2b1d]">
                  {formatDate(appointment.updatedAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Appointment ID</span>
                <span className="font-mono text-xs text-[#4a2b1d]">
                  {appointment._id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Consultation ID</span>
                <span className="font-mono text-xs text-[#4a2b1d]">
                  {appointment.consultationId?._id || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
