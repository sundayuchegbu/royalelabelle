"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
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
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Link from "next/link";

interface DashboardStats {
  stats: {
    users: { total: number; newToday: number };
    appointments: {
      total: number;
      today: number;
      pending: number;
      confirmed: number;
      completed: number;
      cancelled: number;
    };
    revenue: { total: number; monthly: number };
    consultations: { active: number };
    gallery: { total: number };
    breakdowns: {
      paymentMethods: Array<{ _id: string; count: number }>;
      serviceTypes: Array<{ _id: string; count: number }>;
    };
    recentAppointments: Array<any>;
  };
}

const COLORS = ["#c48d2c", "#7f482f", "#d4a691", "#4a2b1d"];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<
    "today" | "week" | "month" | "year"
  >("month");

  // Debug logs
  console.log("🔍 AdminDashboard Debug:");
  console.log("  - authLoading:", authLoading);
  console.log("  - isAuthenticated:", isAuthenticated);
  console.log("  - isAdmin:", isAdmin);
  console.log("  - user:", user);
  console.log("  - user?.role:", user?.role);

  // Check authentication and admin role
  useEffect(() => {
    console.log("🔄 Auth check effect running...");
    if (!authLoading) {
      console.log("  - Auth check: isAuthenticated =", isAuthenticated);
      console.log("  - Auth check: isAdmin =", isAdmin);

      if (!isAuthenticated) {
        console.log("❌ Not authenticated, redirecting to /auth");
        router.push("/auth");
        return;
      }

      if (!isAdmin) {
        console.log("❌ Not admin, redirecting to /");
        toast.error("Access denied. Admin privileges required.");
        router.push("/");
        return;
      }

      console.log("✅ Admin access granted!");
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  // Fetch stats when authenticated and timeframe changes
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      console.log("📊 Fetching stats...");
      fetchStats();
    }
  }, [isAuthenticated, isAdmin, timeframe]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      console.log("📡 Making API call to /admin/stats");
      const response = await api.get("/admin/stats");
      console.log("✅ Stats response:", response.data);
      setStats(response.data);
    } catch (error: any) {
      console.error("❌ Error fetching stats:", error);
      console.error("  - Status:", error.response?.status);
      console.error("  - Message:", error.response?.data?.message);

      if (error.response?.status === 403) {
        toast.error("Access denied. You do not have admin privileges.");
        router.push("/");
      } else if (error.response?.status === 401) {
        toast.error("Please login again.");
        router.push("/auth");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to load dashboard stats",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-[#7f482f]">
            {!isAuthenticated
              ? "Redirecting to login..."
              : "Verifying access..."}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-[#7f482f]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">Failed to load dashboard data</p>
        <Button
          variant="primary"
          size="sm"
          className="mt-4"
          onClick={fetchStats}
        >
          Retry
        </Button>
      </div>
    );
  }

  const { stats: data } = stats;

  const statCards = [
    {
      title: "Total Clients",
      value: data.users.total,
      subtitle: `${data.users.newToday} new today`,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Appointments",
      value: data.appointments.total,
      subtitle: `${data.appointments.today} today`,
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      title: "Revenue",
      value: formatPrice(data.revenue.total),
      subtitle: `${formatPrice(data.revenue.monthly)} this month`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Gallery",
      value: data.gallery.total,
      subtitle: "Images uploaded",
      icon: ImageIcon,
      color: "bg-pink-500",
    },
  ];

  const appointmentStatuses = [
    {
      label: "Pending",
      value: data.appointments.pending,
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Confirmed",
      value: data.appointments.confirmed,
      icon: CheckCircle,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Completed",
      value: data.appointments.completed,
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Cancelled",
      value: data.appointments.cancelled,
      icon: XCircle,
      color: "text-red-600 bg-red-50",
    },
  ];

  const paymentData = data.breakdowns.paymentMethods.map((item) => ({
    name: item._id || "Unknown",
    value: item.count,
  }));

  const serviceData = data.breakdowns.serviceTypes.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#4a2b1d]">Dashboard</h1>
          <p className="text-[#7f482f] mt-1 flex items-center">
            <Shield className="w-4 h-4 text-gold mr-2" />
            Welcome back, {user?.name}! Here's what's happening with your
            business today.
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          {["today", "week", "month", "year"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === t
                  ? "bg-gold text-white"
                  : "bg-white text-[#7f482f] hover:bg-[#f6ede8]"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-luxury p-6 hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#7f482f]">{card.title}</p>
                  <p className="text-3xl font-bold text-[#4a2b1d] mt-2">
                    {card.value}
                  </p>
                  <p className="text-xs text-[#7f482f] mt-1">{card.subtitle}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-luxury p-6">
          <h3 className="font-semibold text-[#4a2b1d] mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-gold mr-2" />
            Revenue Overview
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { month: "Jan", revenue: 1200 },
                  { month: "Feb", revenue: 1800 },
                  { month: "Mar", revenue: 2400 },
                  { month: "Apr", revenue: 1600 },
                  { month: "May", revenue: 2800 },
                  { month: "Jun", revenue: 3200 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#c48d2c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-luxury p-6">
          <h3 className="font-semibold text-[#4a2b1d] mb-4">Payment Methods</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {paymentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Appointment Status & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Cards */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-luxury p-6">
          <h3 className="font-semibold text-[#4a2b1d] mb-4">
            Appointment Status
          </h3>
          <div className="space-y-3">
            {appointmentStatuses.map((status) => {
              const Icon = status.icon;
              return (
                <div
                  key={status.label}
                  className={`flex items-center justify-between p-3 rounded-lg ${status.color}`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{status.label}</span>
                  </div>
                  <span className="font-bold">{status.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-luxury p-6">
          <h3 className="font-semibold text-[#4a2b1d] mb-4">
            Recent Appointments
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f6ede8]">
                  <th className="text-left py-3 text-[#7f482f] font-medium">
                    Client
                  </th>
                  <th className="text-left py-3 text-[#7f482f] font-medium">
                    Service
                  </th>
                  <th className="text-left py-3 text-[#7f482f] font-medium">
                    Date
                  </th>
                  <th className="text-left py-3 text-[#7f482f] font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentAppointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="border-b border-[#f6ede8] hover:bg-[#fdf8f6]"
                  >
                    <td className="py-3 text-[#4a2b1d]">
                      {appointment.userId?.name || "Unknown"}
                    </td>
                    <td className="py-3 text-[#7f482f] capitalize">
                      {appointment.serviceType}
                    </td>
                    <td className="py-3 text-[#7f482f]">
                      {formatDate(appointment.appointmentDate)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : appointment.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : appointment.status === "completed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/admin/appointments"
              className="text-gold hover:text-[#d6a545] text-sm font-medium"
            >
              View All Appointments →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
