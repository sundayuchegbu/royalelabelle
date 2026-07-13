import api from "./api";
import {
  Consultation,
  Appointment,
  GalleryImage,
  User,
  Payment,
  DashboardStats,
} from "@/types";

// Auth Services
export const authService = {
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  getMe: () => api.get("/auth/me"),

  updateProfile: (data: Partial<User>) => api.put("/auth/profile", data),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/auth/password", data),

  uploadProfileImage: (imageUrl: string) =>
    api.post("/auth/profile-image", { imageUrl }),
};

// Consultation Services
export const consultationService = {
  create: (data: Partial<Consultation>) => api.post("/consultations", data),

  getMyConsultation: () => api.get("/consultations/me"),

  update: (id: string, data: Partial<Consultation>) =>
    api.put(`/consultations/${id}`, data),
};

// Appointment Services
export const appointmentService = {
  create: (data: Partial<Appointment>) => api.post("/appointments", data),

  getMyAppointments: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get("/user/appointments", { params }),

  getAppointment: (id: string) => api.get(`/user/appointments/${id}`),

  reschedule: (id: string, newDate: string) =>
    api.put(`/user/appointments/${id}/reschedule`, { newDate }),

  cancel: (id: string) => api.put(`/user/appointments/${id}/cancel`),
};

// Payment Services
export const paymentService = {
  createPaymentIntent: (appointmentId: string, amount: number) =>
    api.post("/payments/create-payment-intent", { appointmentId, amount }),

  createZellePayment: (appointmentId: string) =>
    api.post("/payments/zelle/create", { appointmentId }),

  verifyZellePayment: (data: {
    appointmentId: string;
    transactionId: string;
    paymentDate: string;
    notes?: string;
  }) => api.post("/payments/zelle/verify", data),

  createInteracPayment: (appointmentId: string) =>
    api.post("/payments/interac/create", { appointmentId }),

  verifyInteracPayment: (data: {
    appointmentId: string;
    transactionId: string;
    referenceNumber: string;
    paymentDate: string;
    notes?: string;
  }) => api.post("/payments/interac/verify", data),

  createCashPayment: (appointmentId: string) =>
    api.post("/payments/cash/create", { appointmentId }),
};

// Gallery Services
export const galleryService = {
  // Public routes
  getAll: (category?: string) =>
    api.get("/gallery", { params: category ? { category } : {} }),

  getOne: (id: string) => api.get(`/gallery/${id}`),

  // Admin routes
  getAdminGallery: () => api.get("/admin/gallery"),

  upload: (imageData: string) =>
    api.post("/admin/gallery/upload", { image: imageData }),

  create: (data: Partial<GalleryImage>) => api.post("/admin/gallery", data),

  update: (id: string, data: Partial<GalleryImage>) =>
    api.put(`/admin/gallery/${id}`, data),

  delete: (id: string) => api.delete(`/admin/gallery/${id}`),

  deleteFromCloudinary: (publicId: string) =>
    api.delete(`/admin/gallery/cloudinary/${publicId}`),
};

// Admin Services
export const adminService = {
  getStats: () => api.get("/admin/stats"),

  getAppointments: (params?: {
    status?: string;
    paymentMethod?: string;
    serviceType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) => api.get("/admin/appointments", { params }),

  getAppointment: (id: string) => api.get(`/admin/appointments/${id}`),

  updateAppointment: (id: string, data: Partial<Appointment>) =>
    api.put(`/admin/appointments/${id}`, data),

  deleteAppointment: (id: string) => api.delete(`/admin/appointments/${id}`),

  getUsers: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get("/admin/users", { params }),

  getRevenueReport: (period?: string) =>
    api.get("/admin/reports/revenue", { params: { period } }),
};

// User Services (for authenticated user)
export const userService = {
  getAppointments: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get("/user/appointments", { params }),

  getAppointment: (id: string) => api.get(`/user/appointments/${id}`),

  cancelAppointment: (id: string) => api.put(`/user/appointments/${id}/cancel`),

  rescheduleAppointment: (id: string, newDate: string) =>
    api.put(`/user/appointments/${id}/reschedule`, { newDate }),
};
