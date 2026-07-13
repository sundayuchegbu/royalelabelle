import api from "./api";
import { Consultation, Appointment, GalleryImage } from "@/types";

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
};

// Consultation Services
export const consultationService = {
  create: (data: Partial<Consultation>) => api.post("/consultations", data),

  getMyConsultation: () => api.get("/consultations/me"),
};

// Appointment Services
export const appointmentService = {
  create: (data: Partial<Appointment>) => api.post("/appointments", data),

  reschedule: (id: string, newDate: string) =>
    api.put(`/appointments/${id}/reschedule`, { newDate }),
};

// Payment Services
export const paymentService = {
  createPaymentIntent: (appointmentId: string, amount: number) =>
    api.post("/payments/create-payment-intent", { appointmentId, amount }),
};

// Gallery Services
export const galleryService = {
  getAll: (category?: string) => api.get("/gallery", { params: { category } }),

  create: (data: Partial<GalleryImage>) => api.post("/gallery", data),
};
