"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  Printer,
  Filter,
  ChevronDown,
  Users,
  ShoppingBag,
  CreditCard,
  Send,
  Building2,
  Wallet,
  PieChart as PieChartIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface ReportData {
  revenue: {
    total: number;
    monthly: number;
    weekly: number;
    daily: number;
  };
  appointments: {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    confirmed: number;
  };
  clients: {
    total: number;
    newThisMonth: number;
    newThisWeek: number;
    active: number;
  };
  payments: {
    stripe: number;
    zelle: number;
    interac: number;
    cash: number;
    total: number;
  };
  serviceBreakdown: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    appointments: number;
  }>;
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    appointments: number;
  }>;
  paymentMethodBreakdown: Array<{
    name: string;
    value: number;
  }>;
  statusBreakdown: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ["#c48d2c", "#7f482f", "#d4a691", "#4a2b1d", "#e8c9a0"];
const STATUS_COLORS = {
  completed: "#10B981",
  confirmed: "#3B82F6",
  pending: "#F59E0B",
  cancelled: "#EF4444",
};

export default function AdminReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<
    "week" | "month" | "quarter" | "year" | "all"
  >("month");
  const [reportType, setReportType] = useState<
    "revenue" | "appointments" | "clients" | "payments"
  >("revenue");
  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("monthly");

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      // Fetch all appointments for reporting
      const response = await api.get("/admin/appointments", {
        params: { limit: 1000 },
      });

      const appointments = response.data.appointments;

      // Process data for reports
      const processedData = processReportData(appointments);
      setReportData(processedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch report data:", error);
      toast.error("Failed to load report data");
      setIsLoading(false);
    }
  };

  const processReportData = (appointments: any[]): ReportData => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    // Calculate revenue
    const totalRevenue = appointments
      .filter((a) => a.status === "completed" || a.status === "confirmed")
      .reduce((sum, a) => sum + (a.fullPrice || 0), 0);

    const monthlyRevenue = appointments
      .filter((a) => {
        const date = new Date(a.appointmentDate);
        return (
          (a.status === "completed" || a.status === "confirmed") &&
          date >= startOfMonth
        );
      })
      .reduce((sum, a) => sum + (a.fullPrice || 0), 0);

    const weeklyRevenue = appointments
      .filter((a) => {
        const date = new Date(a.appointmentDate);
        return (
          (a.status === "completed" || a.status === "confirmed") &&
          date >= startOfWeek
        );
      })
      .reduce((sum, a) => sum + (a.fullPrice || 0), 0);

    const dailyRevenue = appointments
      .filter((a) => {
        const date = new Date(a.appointmentDate);
        return (
          (a.status === "completed" || a.status === "confirmed") &&
          date.toDateString() === now.toDateString()
        );
      })
      .reduce((sum, a) => sum + (a.fullPrice || 0), 0);

    // Appointment stats
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(
      (a) => a.status === "completed",
    ).length;
    const pendingAppointments = appointments.filter(
      (a) => a.status === "pending",
    ).length;
    const cancelledAppointments = appointments.filter(
      (a) => a.status === "cancelled",
    ).length;
    const confirmedAppointments = appointments.filter(
      (a) => a.status === "confirmed",
    ).length;

    // Client stats
    const uniqueClients = new Set(appointments.map((a) => a.userId?._id)).size;
    const newThisMonth = appointments
      .filter((a) => new Date(a.createdAt) >= startOfMonth)
      .filter(
        (a, i, arr) =>
          arr.findIndex((b) => b.userId?._id === a.userId?._id) === i,
      ).length;
    const newThisWeek = appointments
      .filter((a) => new Date(a.createdAt) >= startOfWeek)
      .filter(
        (a, i, arr) =>
          arr.findIndex((b) => b.userId?._id === a.userId?._id) === i,
      ).length;

    // Payment method breakdown
    const stripeCount = appointments.filter(
      (a) => a.paymentMethod === "stripe",
    ).length;
    const zelleCount = appointments.filter(
      (a) => a.paymentMethod === "zelle",
    ).length;
    const interacCount = appointments.filter(
      (a) => a.paymentMethod === "interac",
    ).length;
    const cashCount = appointments.filter(
      (a) => a.paymentMethod === "cash",
    ).length;

    // Service breakdown
    const serviceMap = new Map();
    appointments.forEach((a) => {
      if (a.status === "completed" || a.status === "confirmed") {
        const key = a.serviceType;
        if (!serviceMap.has(key)) {
          serviceMap.set(key, { count: 0, revenue: 0 });
        }
        const current = serviceMap.get(key);
        current.count += 1;
        current.revenue += a.fullPrice || 0;
      }
    });

    const serviceBreakdown = Array.from(serviceMap.entries()).map(
      ([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        count: data.count,
        revenue: data.revenue,
      }),
    );

    // Monthly revenue data (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString("default", { month: "short" });
      const monthAppointments = appointments.filter((a) => {
        const aDate = new Date(a.appointmentDate);
        return (
          aDate.getMonth() === date.getMonth() &&
          aDate.getFullYear() === date.getFullYear() &&
          (a.status === "completed" || a.status === "confirmed")
        );
      });
      monthlyData.push({
        month: monthName,
        revenue: monthAppointments.reduce(
          (sum, a) => sum + (a.fullPrice || 0),
          0,
        ),
        appointments: monthAppointments.length,
      });
    }

    // Daily revenue data (last 30 days)
    const dailyData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("default", {
        month: "short",
        day: "numeric",
      });
      const dayAppointments = appointments.filter((a) => {
        const aDate = new Date(a.appointmentDate);
        return (
          aDate.toDateString() === date.toDateString() &&
          (a.status === "completed" || a.status === "confirmed")
        );
      });
      dailyData.push({
        date: dateStr,
        revenue: dayAppointments.reduce(
          (sum, a) => sum + (a.fullPrice || 0),
          0,
        ),
        appointments: dayAppointments.length,
      });
    }

    // Payment method breakdown for chart
    const paymentBreakdown = [
      { name: "Stripe", value: stripeCount },
      { name: "Zelle", value: zelleCount },
      { name: "Interac", value: interacCount },
      { name: "Cash", value: cashCount },
    ].filter((p) => p.value > 0);

    // Status breakdown for chart
    const statusBreakdown = [
      { name: "Completed", value: completedAppointments },
      { name: "Confirmed", value: confirmedAppointments },
      { name: "Pending", value: pendingAppointments },
      { name: "Cancelled", value: cancelledAppointments },
    ].filter((s) => s.value > 0);

    return {
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
        weekly: weeklyRevenue,
        daily: dailyRevenue,
      },
      appointments: {
        total: totalAppointments,
        completed: completedAppointments,
        pending: pendingAppointments,
        cancelled: cancelledAppointments,
        confirmed: confirmedAppointments,
      },
      clients: {
        total: uniqueClients,
        newThisMonth: newThisMonth,
        newThisWeek: newThisWeek,
        active: uniqueClients,
      },
      payments: {
        stripe: stripeCount,
        zelle: zelleCount,
        interac: interacCount,
        cash: cashCount,
        total: stripeCount + zelleCount + interacCount + cashCount,
      },
      serviceBreakdown,
      monthlyRevenue: monthlyData,
      dailyRevenue: dailyData,
      paymentMethodBreakdown: paymentBreakdown,
      statusBreakdown,
    };
  };

  const handleExport = () => {
    if (!reportData) return;

    // Create CSV data
    const headers = ["Metric", "Value"];
    const rows = [
      ["Total Revenue", formatPrice(reportData.revenue.total)],
      ["Monthly Revenue", formatPrice(reportData.revenue.monthly)],
      ["Weekly Revenue", formatPrice(reportData.revenue.weekly)],
      ["Daily Revenue", formatPrice(reportData.revenue.daily)],
      ["Total Appointments", reportData.appointments.total],
      ["Completed", reportData.appointments.completed],
      ["Confirmed", reportData.appointments.confirmed],
      ["Pending", reportData.appointments.pending],
      ["Cancelled", reportData.appointments.cancelled],
      ["Total Clients", reportData.clients.total],
      ["New This Month", reportData.clients.newThisMonth],
      ["Stripe Payments", reportData.payments.stripe],
      ["Zelle Payments", reportData.payments.zelle],
      ["Interac Payments", reportData.payments.interac],
      ["Cash Payments", reportData.payments.cash],
    ];

    // Add service breakdown
    reportData.serviceBreakdown.forEach((service) => {
      rows.push([`${service.name} - Count`, service.count]);
      rows.push([`${service.name} - Revenue`, formatPrice(service.revenue)]);
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Report exported successfully!");
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !reportData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#c48d2c] animate-spin mx-auto" />
          <p className="mt-4 text-[#7f482f]">Loading reports...</p>
        </div>
      </div>
    );
  }

  const {
    revenue,
    appointments,
    clients,
    payments,
    serviceBreakdown,
    monthlyRevenue,
    dailyRevenue,
    paymentMethodBreakdown,
    statusBreakdown,
  } = reportData;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#4a2b1d]">Reports</h1>
          <p className="text-[#7f482f] mt-1">
            View business analytics and insights
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="bg-white rounded-xl shadow-luxury p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {["week", "month", "quarter", "year", "all"].map((period) => (
            <button
              key={period}
              onClick={() => setDateRange(period as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === period
                  ? "bg-[#c48d2c] text-white"
                  : "bg-[#fdf8f6] text-[#7f482f] hover:bg-[#f6ede8]"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-luxury p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7f482f]">Total Revenue</p>
              <p className="text-2xl font-bold text-[#c48d2c]">
                {formatPrice(revenue.total)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
            <span className="text-green-500">+12%</span>
            <span className="text-[#7f482f] ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-luxury p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7f482f]">Appointments</p>
              <p className="text-2xl font-bold text-[#4a2b1d]">
                {appointments.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <TrendingUp className="w-3 h-3 text-blue-500 mr-1" />
            <span className="text-blue-500">
              {appointments.completed} completed
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-luxury p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7f482f]">Total Clients</p>
              <p className="text-2xl font-bold text-[#4a2b1d]">
                {clients.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <TrendingUp className="w-3 h-3 text-purple-500 mr-1" />
            <span className="text-purple-500">
              {clients.newThisMonth} new this month
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-luxury p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7f482f]">Conversion Rate</p>
              <p className="text-2xl font-bold text-[#4a2b1d]">
                {appointments.total > 0
                  ? Math.round(
                      (appointments.completed / appointments.total) * 100,
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <TrendingUp className="w-3 h-3 text-orange-500 mr-1" />
            <span className="text-orange-500">
              {appointments.completed} completed
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-xl shadow-luxury p-6">
          <h3 className="font-semibold text-[#4a2b1d] mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-[#c48d2c] mr-2" />
            Revenue Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatPrice(value as number)} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#c48d2c"
                  fill="#c48d2c"
                  fillOpacity={0.3}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#4a2b1d"
                  name="Appointments"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Pie Chart */}
        <div className="bg-white rounded-xl shadow-luxury p-6">
          <h3 className="font-semibold text-[#4a2b1d] mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 text-[#c48d2c] mr-2" />
            Payment Methods
          </h3>
          <div className="h-72">
            {paymentMethodBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  // Update the label function to handle undefined percent
                  <Pie
                    data={paymentMethodBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => {
                      const percentage = percent
                        ? (percent * 100).toFixed(0)
                        : "0";
                      return `${name} ${percentage}%`;
                    }}
                  >
                    {paymentMethodBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-[#7f482f]">No payment data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Service Breakdown */}
        <div className="bg-white rounded-xl shadow-luxury p-6">
          <h3 className="font-semibold text-[#4a2b1d] mb-4 flex items-center">
            <ShoppingBag className="w-5 h-5 text-[#c48d2c] mr-2" />
            Service Breakdown
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => formatPrice(value as number)} />
                <Bar dataKey="revenue" fill="#c48d2c" name="Revenue" />
                <Bar dataKey="count" fill="#4a2b1d" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-xl shadow-luxury p-6">
          <h3 className="font-semibold text-[#4a2b1d] mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-[#c48d2c] mr-2" />
            Appointment Status
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => {
                    const percentage = percent
                      ? (percent * 100).toFixed(0)
                      : "0";
                    return `${name} ${percentage}%`;
                  }}
                >
                  {statusBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        Object.values(STATUS_COLORS)[
                          index % Object.values(STATUS_COLORS).length
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="bg-white rounded-xl shadow-luxury p-6 mb-6">
        <h3 className="font-semibold text-[#4a2b1d] mb-4">
          Detailed Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium text-[#7f482f] mb-2">Revenue</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Total</span>
                <span className="font-medium text-[#4a2b1d]">
                  {formatPrice(revenue.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Monthly</span>
                <span className="font-medium text-[#4a2b1d]">
                  {formatPrice(revenue.monthly)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Weekly</span>
                <span className="font-medium text-[#4a2b1d]">
                  {formatPrice(revenue.weekly)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Daily</span>
                <span className="font-medium text-[#4a2b1d]">
                  {formatPrice(revenue.daily)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-[#7f482f] mb-2">
              Appointments
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Total</span>
                <span className="font-medium text-[#4a2b1d]">
                  {appointments.total}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Completed</span>
                <span className="font-medium text-green-600">
                  {appointments.completed}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Confirmed</span>
                <span className="font-medium text-blue-600">
                  {appointments.confirmed}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Pending</span>
                <span className="font-medium text-yellow-600">
                  {appointments.pending}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Cancelled</span>
                <span className="font-medium text-red-600">
                  {appointments.cancelled}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-[#7f482f] mb-2">
              Clients & Payments
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Total Clients</span>
                <span className="font-medium text-[#4a2b1d]">
                  {clients.total}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f482f]">New This Month</span>
                <span className="font-medium text-[#4a2b1d]">
                  {clients.newThisMonth}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Stripe</span>
                <span className="font-medium text-[#4a2b1d]">
                  {payments.stripe}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Zelle</span>
                <span className="font-medium text-[#4a2b1d]">
                  {payments.zelle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Interac</span>
                <span className="font-medium text-[#4a2b1d]">
                  {payments.interac}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7f482f]">Cash</span>
                <span className="font-medium text-[#4a2b1d]">
                  {payments.cash}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Revenue Chart */}
      <div className="bg-white rounded-xl shadow-luxury p-6">
        <h3 className="font-semibold text-[#4a2b1d] mb-4 flex items-center">
          <Calendar className="w-5 h-5 text-[#c48d2c] mr-2" />
          Daily Revenue (Last 30 Days)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "revenue") return formatPrice(value as number);
                  return value;
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                fill="#c48d2c"
                name="Revenue"
              />
              <Bar
                yAxisId="right"
                dataKey="appointments"
                fill="#4a2b1d"
                name="Appointments"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
