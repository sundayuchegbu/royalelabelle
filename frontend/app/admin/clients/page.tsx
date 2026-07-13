"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  User,
  UserPlus,
  MessageCircle,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Printer,
  Sparkles,
  Activity,
  TrendingUp,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  createdAt: string;
  lastLogin?: string;
  appointmentCount: number;
  totalSpent?: number;
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
  };
}

interface ClientStats {
  totalClients: number;
  activeClients: number;
  newClientsThisMonth: number;
  returningClients: number;
  totalRevenue: number;
  averageSpent: number;
}

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [stats, setStats] = useState<ClientStats>({
    totalClients: 0,
    activeClients: 0,
    newClientsThisMonth: 0,
    returningClients: 0,
    totalRevenue: 0,
    averageSpent: 0,
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    role: "user",
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      marketingEmails: false,
    },
  });

  useEffect(() => {
    fetchClients();
    fetchClientStats();
  }, [currentPage, sortBy, sortOrder, roleFilter, search]);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/users", {
        params: {
          page: currentPage,
          limit: 20,
          search: search || undefined,
          sortBy,
          sortOrder,
          role: roleFilter || undefined,
        },
      });
      setClients(response.data.users);
      setTotalPages(response.data.pagination.pages);
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to load clients");
      setIsLoading(false);
    }
  };

  const fetchClientStats = async () => {
    try {
      // Get all users for stats
      const response = await api.get("/admin/users", {
        params: { limit: 1000 },
      });

      const allUsers = response.data.users;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());

      const totalClients = allUsers.length;
      const activeClients = allUsers.filter(
        (u: any) => u.appointmentCount > 0,
      ).length;
      const newClientsThisMonth = allUsers.filter(
        (u: any) => new Date(u.createdAt) >= startOfMonth,
      ).length;
      const returningClients = allUsers.filter(
        (u: any) => u.appointmentCount > 1,
      ).length;

      // Calculate revenue from appointments (would need separate API call)
      // For now using mock data
      const totalRevenue = 0;
      const averageSpent = totalClients > 0 ? totalRevenue / totalClients : 0;

      setStats({
        totalClients,
        activeClients,
        newClientsThisMonth,
        returningClients,
        totalRevenue,
        averageSpent,
      });
    } catch (error) {
      console.error("Failed to fetch client stats:", error);
    }
  };

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      await api.put(`/admin/users/${selectedClient._id}`, editFormData);
      toast.success("Client updated successfully");
      setShowEditModal(false);
      setSelectedClient(null);
      fetchClients();
    } catch (error) {
      toast.error("Failed to update client");
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this client? This action cannot be undone.",
      )
    )
      return;

    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("Client deleted successfully");
      fetchClients();
    } catch (error) {
      toast.error("Failed to delete client");
    }
  };

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleWhatsApp = (phone: string) => {
    const formattedPhone = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${formattedPhone}`, "_blank");
  };

  const getRoleBadge = (role: string) => {
    const roles = {
      admin: "bg-purple-100 text-purple-700",
      super_admin: "bg-red-100 text-red-700",
      user: "bg-blue-100 text-blue-700",
    };
    return roles[role as keyof typeof roles] || "bg-gray-100 text-gray-700";
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: "👑 Admin",
      super_admin: "⭐ Super Admin",
      user: "👤 User",
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getStatus = (client: Client) => {
    if (!client.lastLogin) return "inactive";
    const lastLogin = new Date(client.lastLogin);
    const now = new Date();
    const daysSinceLogin =
      (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceLogin < 7) return "active";
    if (daysSinceLogin < 30) return "recent";
    return "inactive";
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: "bg-green-100 text-green-700",
      recent: "bg-yellow-100 text-yellow-700",
      inactive: "bg-gray-100 text-gray-700",
    };
    return badges[status as keyof typeof badges] || badges.inactive;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: "🟢 Active",
      recent: "🟡 Recent",
      inactive: "⚪ Inactive",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c48d2c] mx-auto"></div>
          <p className="mt-4 text-[#7f482f]">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#4a2b1d]">Clients</h1>
          <p className="text-[#7f482f] mt-1">
            Manage your customer relationships
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Exporting client data...")}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="gold" size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-luxury p-4">
          <p className="text-xs text-[#7f482f]">Total Clients</p>
          <p className="text-2xl font-bold text-[#4a2b1d]">
            {stats.totalClients}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-luxury p-4">
          <p className="text-xs text-[#7f482f]">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.activeClients}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-luxury p-4">
          <p className="text-xs text-[#7f482f]">New This Month</p>
          <p className="text-2xl font-bold text-blue-600">
            {stats.newClientsThisMonth}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-luxury p-4">
          <p className="text-xs text-[#7f482f]">Returning</p>
          <p className="text-2xl font-bold text-purple-600">
            {stats.returningClients}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-luxury p-4">
          <p className="text-xs text-[#7f482f]">Total Revenue</p>
          <p className="text-2xl font-bold text-[#c48d2c]">
            {formatPrice(stats.totalRevenue)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-luxury p-4">
          <p className="text-xs text-[#7f482f]">Avg. Spend</p>
          <p className="text-2xl font-bold text-[#4a2b1d]">
            {formatPrice(stats.averageSpent)}
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
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white"
            >
              <option value="createdAt">Date Joined</option>
              <option value="name">Name</option>
              <option value="appointmentCount">Appointments</option>
              <option value="lastLogin">Last Active</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#fdf8f6]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Appointments
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#4a2b1d]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f6ede8]">
              {clients.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-[#7f482f]"
                  >
                    No clients found
                  </td>
                </tr>
              ) : (
                clients.map((client) => {
                  const status = getStatus(client);
                  return (
                    <tr
                      key={client._id}
                      className="hover:bg-[#fdf8f6] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-white font-semibold">
                            {client.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-medium text-[#4a2b1d]">
                              {client.name}
                            </p>
                            <p className="text-xs text-[#7f482f]">
                              {client.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-[#7f482f]">
                            <Phone className="w-3 h-3" />
                            <span>{client.phone || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#7f482f]">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">
                              {client.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(client.role)}`}
                        >
                          {getRoleLabel(client.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(status)}`}
                        >
                          {getStatusLabel(status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-medium text-[#4a2b1d]">
                          {client.appointmentCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#7f482f]">
                        {formatDate(client.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedClient(client);
                              setEditFormData({
                                name: client.name,
                                email: client.email,
                                phone: client.phone || "",
                                location: client.location || "",
                                bio: client.bio || "",
                                role: client.role,
                                preferences: client.preferences || {
                                  emailNotifications: true,
                                  smsNotifications: true,
                                  marketingEmails: false,
                                },
                              });
                              setShowEditModal(true);
                            }}
                            className="p-2 rounded-lg hover:bg-[#f6ede8] transition-colors"
                            title="Edit Client"
                          >
                            <Edit className="w-4 h-4 text-[#7f482f]" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedClient(client);
                              setShowDetailsModal(true);
                            }}
                            className="p-2 rounded-lg hover:bg-[#f6ede8] transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-[#7f482f]" />
                          </button>
                          <button
                            onClick={() => handleWhatsApp(client.phone)}
                            className="p-2 rounded-lg hover:bg-[#25D366]/10 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 text-[#25D366]" />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client._id)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete Client"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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

      {/* Client Details Modal */}
      {showDetailsModal && selectedClient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-[#4a2b1d]">
                Client Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 rounded-lg hover:bg-[#f6ede8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-[#f6ede8]">
                <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center text-white text-2xl font-bold">
                  {selectedClient.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#4a2b1d]">
                    {selectedClient.name}
                  </h3>
                  <p className="text-[#7f482f]">{selectedClient.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(selectedClient.role)}`}
                    >
                      {getRoleLabel(selectedClient.role)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(getStatus(selectedClient))}`}
                    >
                      {getStatusLabel(getStatus(selectedClient))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#7f482f]">Phone</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {selectedClient.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7f482f]">Location</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {selectedClient.location || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7f482f]">Joined</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {formatDate(selectedClient.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7f482f]">Last Active</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {selectedClient.lastLogin
                      ? formatDate(selectedClient.lastLogin)
                      : "Never"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7f482f]">Total Appointments</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {selectedClient.appointmentCount || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#7f482f]">Bio</p>
                  <p className="font-medium text-[#4a2b1d]">
                    {selectedClient.bio || "No bio provided"}
                  </p>
                </div>
              </div>

              {/* Preferences */}
              <div className="pt-4 border-t border-[#f6ede8]">
                <h4 className="font-semibold text-[#4a2b1d] mb-2">
                  Notification Preferences
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    {selectedClient.preferences?.emailNotifications ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-[#7f482f]">Email Notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedClient.preferences?.smsNotifications ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-[#7f482f]">SMS Notifications</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    {selectedClient.preferences?.marketingEmails ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-[#7f482f]">Marketing Emails</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#f6ede8]">
                <Button
                  variant="gold"
                  size="md"
                  className="flex-1"
                  onClick={() => handleSendEmail(selectedClient.email)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  className="flex-1"
                  onClick={() => handleWhatsApp(selectedClient.phone)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditModal && selectedClient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-[#4a2b1d]">
                Edit Client
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedClient(null);
                }}
                className="p-2 rounded-lg hover:bg-[#f6ede8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Bio
                </label>
                <textarea
                  value={editFormData.bio}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, bio: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Role
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-[#4a2b1d]">
                  Notification Preferences
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editFormData.preferences.emailNotifications}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        preferences: {
                          ...editFormData.preferences,
                          emailNotifications: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-[#c48d2c] rounded focus:ring-[#c48d2c]"
                  />
                  <label className="text-sm text-[#7f482f]">
                    Email Notifications
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editFormData.preferences.smsNotifications}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        preferences: {
                          ...editFormData.preferences,
                          smsNotifications: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-[#c48d2c] rounded focus:ring-[#c48d2c]"
                  />
                  <label className="text-sm text-[#7f482f]">
                    SMS Notifications
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editFormData.preferences.marketingEmails}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        preferences: {
                          ...editFormData.preferences,
                          marketingEmails: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-[#c48d2c] rounded focus:ring-[#c48d2c]"
                  />
                  <label className="text-sm text-[#7f482f]">
                    Marketing Emails
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#f6ede8]">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedClient(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="flex-1"
                >
                  Update Client
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
