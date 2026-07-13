export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin" | "super_admin";
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
