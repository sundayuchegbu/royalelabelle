export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: "user" | "admin" | "super_admin";
  profileImage?: string;
  bio?: string;
  location?: string;
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
  };
  createdAt?: string;
  lastLogin?: string;
}

export interface Consultation {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  hairType?: string;
  hairCondition?: string;
  hairLength: string;
  hairDensity: string;
  hairTexture?: string;
  preferredStyle?: string;
  preferredDate?: string;
  preferredTime?: string;
  goals: string;
  consultationDate: string;
  expiresAt: string;
  status: "active" | "expired" | "completed";
  notes?: string;
}

export interface Appointment {
  id: string;
  userId: string;
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
  consultationId: string;
  notes?: string;
  lateFee: number;
  rescheduleCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  _id: string;
  title: string;
  image: string;
  imageUrl?: string; // For backward compatibility
  category: "micro-locs" | "retwist" | "interlocking" | "braids";
  isFeatured: boolean;
  order: number;
  publicId?: string | null;
  uploadedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
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

export interface DashboardStats {
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
