"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface Appointment {
  _id: string;
  userId: { name: string; email: string; phone: string };
  serviceType: string;
  appointmentDate: string;
  status: string;
  paymentMethod: string;
  depositAmount: number;
  fullPrice: number;
  notes: string;
  lateFee: number;
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const statusOptions = [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
    "payment_pending",
    "payment_verified",
  ];
  const paymentOptions = ["stripe", "zelle", "interac", "cash"];

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, statusFilter, paymentFilter, search]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/appointments", {
        params: {
          page: currentPage,
          limit: 20,
          status: statusFilter || undefined,
          paymentMethod: paymentFilter || undefined,
          search: search || undefined,
        },
      });
      setAppointments(response.data.appointments);
      setTotalPages(response.data.pagination.pages);
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to load appointments");
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await api.delete(`/admin/appointments/${id}`);
      toast.success("Appointment deleted successfully");
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to delete appointment");
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/admin/appointments/${id}`, { status });
      toast.success("Appointment updated successfully");
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update appointment");
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

  const getPaymentLabel = (method: string) => {
    const labels = {
      stripe: "💳 Card",
      zelle: "🏦 Zelle",
      interac: "🏦 Interac",
      cash: "💵 Cash",
    };
    return labels[method as keyof typeof labels] || method;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c48d2c] mx-auto"></div>
          <p className="mt-4 text-[#7f482f]">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#4a2b1d]">Appointments</h1>
          <p className="text-[#7f482f] mt-1">
            Manage all appointments and bookings
          </p>
        </div>
        <Button
          variant="gold"
          size="sm"
          className="mt-4 sm:mt-0"
          onClick={() => (window.location.href = "/admin/appointments/new")}
        >
          + New Appointment
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-luxury p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client name, email, or ID..."
              className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white"
            >
              <option value="">All Payments</option>
              {paymentOptions.map((method) => (
                <option key={method} value={method}>
                  {method.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fdf8f6]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f6ede8]">
              {appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-[#7f482f]"
                  >
                    No appointments found
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="hover:bg-[#fdf8f6] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[#4a2b1d]">
                          {appointment.userId?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-[#7f482f]">
                          {appointment.userId?.email || ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize">
                        {appointment.serviceType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#7f482f]">
                      {formatDate(appointment.appointmentDate)}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#4a2b1d]">
                      {formatPrice(appointment.fullPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">
                        {getPaymentLabel(appointment.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={appointment.status}
                        onChange={(e) =>
                          handleStatusUpdate(appointment._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(appointment.status)}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.replace("_", " ").toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            (window.location.href = `/admin/appointments/${appointment._id}`)
                          }
                          className="p-2 rounded-lg hover:bg-[#f6ede8] transition-colors"
                        >
                          <Eye className="w-4 h-4 text-[#7f482f]" />
                        </button>
                        <button
                          onClick={() => handleDelete(appointment._id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#f6ede8]">
            <p className="text-sm text-[#7f482f]">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-[#f6ede8] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#fdf8f6]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-[#f6ede8] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#fdf8f6]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
