"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  CreditCard,
  Send,
  Building2,
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Printer,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface Payment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  serviceType: string;
  appointmentDate: string;
  status: string;
  depositAmount: number;
  fullPrice: number;
  paymentMethod: "stripe" | "zelle" | "interac" | "cash";
  stripePaymentId?: string;
  zelleTransactionId?: string;
  interacTransactionId?: string;
  zelleVerifiedBy?: { name: string };
  interacVerifiedBy?: { name: string };
  cashReceivedBy?: { name: string };
  createdAt: string;
  updatedAt: string;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalDeposits: 0,
    pendingVerifications: 0,
    completedPayments: 0,
    stripeCount: 0,
    zelleCount: 0,
    interacCount: 0,
    cashCount: 0,
  });

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
    fetchPayments();
    fetchPaymentStats();
  }, [currentPage, statusFilter, methodFilter, search]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/appointments", {
        params: {
          page: currentPage,
          limit: 20,
          status: statusFilter || undefined,
          paymentMethod: methodFilter || undefined,
          search: search || undefined,
        },
      });
      setPayments(response.data.appointments);
      setTotalPages(response.data.pagination.pages);
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to load payments");
      setIsLoading(false);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      // Get all appointments for stats
      const response = await api.get("/admin/appointments", {
        params: { limit: 1000 },
      });

      const allPayments = response.data.appointments;

      const totalRevenue = allPayments
        .filter((p: any) => p.status === "completed")
        .reduce((sum: number, p: any) => sum + (p.fullPrice || 0), 0);

      const totalDeposits = allPayments
        .filter(
          (p: any) => p.status === "confirmed" || p.status === "completed",
        )
        .reduce((sum: number, p: any) => sum + (p.depositAmount || 0), 0);

      const pendingVerifications = allPayments.filter(
        (p: any) =>
          p.status === "payment_pending" || p.status === "payment_verified",
      ).length;

      const completedPayments = allPayments.filter(
        (p: any) => p.status === "completed" || p.status === "confirmed",
      ).length;

      const stripeCount = allPayments.filter(
        (p: any) => p.paymentMethod === "stripe",
      ).length;
      const zelleCount = allPayments.filter(
        (p: any) => p.paymentMethod === "zelle",
      ).length;
      const interacCount = allPayments.filter(
        (p: any) => p.paymentMethod === "interac",
      ).length;
      const cashCount = allPayments.filter(
        (p: any) => p.paymentMethod === "cash",
      ).length;

      setStats({
        totalRevenue,
        totalDeposits,
        pendingVerifications,
        completedPayments,
        stripeCount,
        zelleCount,
        interacCount,
        cashCount,
      });
    } catch (error) {
      console.error("Failed to fetch payment stats:", error);
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
      pending: "⏳ Pending",
      completed: "✅ Completed",
      cancelled: "❌ Cancelled",
      payment_pending: "💳 Pending Verification",
      payment_verified: "✅ Payment Verified",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPaymentLabel = (method: string) => {
    const labels = {
      stripe: "💳 Credit Card",
      zelle: "🏦 Zelle",
      interac: "🏦 Interac",
      cash: "💵 Cash",
    };
    return labels[method as keyof typeof labels] || method;
  };

  const getPaymentIcon = (method: string) => {
    const icons = {
      stripe: <CreditCard className="w-4 h-4" />,
      zelle: <Send className="w-4 h-4" />,
      interac: <Building2 className="w-4 h-4" />,
      cash: <Wallet className="w-4 h-4" />,
    };
    return (
      icons[method as keyof typeof icons] || <DollarSign className="w-4 h-4" />
    );
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

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/admin/appointments/${id}`, { status });
      toast.success("Payment status updated successfully");
      fetchPayments();
      fetchPaymentStats();
    } catch (error) {
      toast.error("Failed to update payment status");
    }
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const handleExport = () => {
    toast.success("Exporting payment data...");
    // In production, this would generate a CSV or PDF report
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-[#7f482f]">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#4a2b1d]">Payments</h1>
          <p className="text-[#7f482f] mt-1">Manage and track all payments</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-luxury p-4">
          <p className="text-xs text-[#7f482f]">Total Revenue</p>
          <p className="text-2xl font-bold text-gold">
            {formatPrice(stats.totalRevenue)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-luxury p-4">
          <p className="text-xs text-[#7f482f]">Total Deposits</p>
          <p className="text-2xl font-bold text-[#4a2b1d]">
            {formatPrice(stats.totalDeposits)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-luxury p-4">
          <p className="text-xs text-[#7f482f]">Pending Verifications</p>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.pendingVerifications}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-luxury p-4">
          <p className="text-xs text-[#7f482f]">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.completedPayments}
          </p>
        </div>
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
              placeholder="Search by client name, email, or payment ID..."
              className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
            >
              <option value="">All Methods</option>
              {paymentOptions.map((method) => (
                <option key={method} value={method}>
                  {method.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payment Methods Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-[#7f482f]">Stripe</p>
            <p className="font-bold text-[#4a2b1d]">{stats.stripeCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Send className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-[#7f482f]">Zelle</p>
            <p className="font-bold text-[#4a2b1d]">{stats.zelleCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-[#7f482f]">Interac</p>
            <p className="font-bold text-[#4a2b1d]">{stats.interacCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-[#7f482f]">Cash</p>
            <p className="font-bold text-[#4a2b1d]">{stats.cashCount}</p>
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
                  Method
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Deposit
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
              {payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-[#7f482f]"
                  >
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-[#fdf8f6] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[#4a2b1d]">
                          {payment.userId?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-[#7f482f]">
                          {payment.userId?.email || ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-sm">
                        {getServiceLabel(payment.serviceType)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getPaymentIcon(payment.paymentMethod)}
                        <span className="text-sm">
                          {getPaymentLabel(payment.paymentMethod)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#4a2b1d]">
                      {formatPrice(payment.fullPrice)}
                    </td>
                    <td className="px-6 py-4 text-gold font-medium">
                      {formatPrice(payment.depositAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={payment.status}
                        onChange={(e) =>
                          handleStatusUpdate(payment._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(payment.status)}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.replace("_", " ").toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className="p-2 rounded-lg hover:bg-[#f6ede8] transition-colors"
                      >
                        <Eye className="w-4 h-4 text-[#7f482f]" />
                      </button>
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

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-[#4a2b1d]">
                Payment Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 rounded-lg hover:bg-[#f6ede8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Client Info */}
              <div className="border-b border-[#f6ede8] pb-4">
                <h3 className="font-semibold text-[#4a2b1d] mb-2">
                  Client Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#7f482f]">Name</p>
                    <p className="font-medium text-[#4a2b1d]">
                      {selectedPayment.userId?.name || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7f482f]">Email</p>
                    <p className="font-medium text-[#4a2b1d]">
                      {selectedPayment.userId?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7f482f]">Phone</p>
                    <p className="font-medium text-[#4a2b1d]">
                      {selectedPayment.userId?.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7f482f]">Payment ID</p>
                    <p className="font-mono text-sm text-[#4a2b1d]">
                      #{selectedPayment._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-b border-[#f6ede8] pb-4">
                <h3 className="font-semibold text-[#4a2b1d] mb-2">
                  Payment Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#7f482f]">Service</p>
                    <p className="font-medium text-[#4a2b1d]">
                      {getServiceLabel(selectedPayment.serviceType)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7f482f]">Date</p>
                    <p className="font-medium text-[#4a2b1d]">
                      {formatDate(selectedPayment.appointmentDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7f482f]">Payment Method</p>
                    <p className="font-medium text-[#4a2b1d]">
                      {getPaymentLabel(selectedPayment.paymentMethod)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7f482f]">Status</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}
                    >
                      {getStatusLabel(selectedPayment.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-[#7f482f]">Total Amount</p>
                    <p className="font-bold text-gold">
                      {formatPrice(selectedPayment.fullPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7f482f]">Deposit Paid</p>
                    <p className="font-bold text-[#4a2b1d]">
                      {formatPrice(selectedPayment.depositAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="border-b border-[#f6ede8] pb-4">
                <h3 className="font-semibold text-[#4a2b1d] mb-2">
                  Transaction Details
                </h3>
                {selectedPayment.paymentMethod === "stripe" &&
                  selectedPayment.stripePaymentId && (
                    <div className="text-sm">
                      <p className="text-[#7f482f]">Stripe Payment ID</p>
                      <p className="font-mono text-[#4a2b1d]">
                        {selectedPayment.stripePaymentId}
                      </p>
                    </div>
                  )}
                {selectedPayment.paymentMethod === "zelle" &&
                  selectedPayment.zelleTransactionId && (
                    <div className="text-sm space-y-1">
                      <p className="text-[#7f482f]">Transaction ID</p>
                      <p className="font-mono text-[#4a2b1d]">
                        {selectedPayment.zelleTransactionId}
                      </p>
                      {selectedPayment.zelleVerifiedBy && (
                        <p className="text-[#7f482f]">
                          Verified by: {selectedPayment.zelleVerifiedBy.name}
                        </p>
                      )}
                    </div>
                  )}
                {selectedPayment.paymentMethod === "interac" &&
                  selectedPayment.interacTransactionId && (
                    <div className="text-sm space-y-1">
                      <p className="text-[#7f482f]">Transaction ID</p>
                      <p className="font-mono text-[#4a2b1d]">
                        {selectedPayment.interacTransactionId}
                      </p>
                      {selectedPayment.interacVerifiedBy && (
                        <p className="text-[#7f482f]">
                          Verified by: {selectedPayment.interacVerifiedBy.name}
                        </p>
                      )}
                    </div>
                  )}
                {selectedPayment.paymentMethod === "cash" &&
                  selectedPayment.cashReceivedBy && (
                    <div className="text-sm">
                      <p className="text-[#7f482f]">Received by</p>
                      <p className="font-medium text-[#4a2b1d]">
                        {selectedPayment.cashReceivedBy.name}
                      </p>
                    </div>
                  )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setStatusFilter(selectedPayment.status);
                  }}
                >
                  Filter Similar
                </Button>
                <Button
                  variant="gold"
                  size="md"
                  onClick={() => {
                    toast.success("Payment receipt sent to client");
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Receipt
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
