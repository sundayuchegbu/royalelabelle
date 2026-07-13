"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { paymentService } from "@/lib/services";
import { Appointment } from "@/types";
import { formatDate, formatPrice } from "@/lib/utils";
import {
  Send,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  User,
} from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function ZelleVerifyPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [zelleInfo, setZelleInfo] = useState({
    email: "",
    phone: "",
    name: "",
    amount: 0,
  });
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        // Fetch appointment details
        // const response = await appointmentService.getById(appointmentId);
        // setAppointment(response.data.appointment);

        // For demo, using mock data
        setAppointment({
          id: appointmentId,
          serviceType: "braids",
          appointmentDate: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          status: "payment_pending",
          depositAmount: 200,
          fullPrice: 1200,
        } as Appointment);

        // Get Zelle info from API
        const zelleResponse = await api.get("/payments/zelle/info");
        setZelleInfo(zelleResponse.data);

        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load payment information");
        router.push("/");
      }
    };

    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transactionId.trim()) {
      toast.error("Please enter your transaction reference");
      return;
    }

    if (!paymentDate) {
      toast.error("Please select the payment date");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/payments/zelle/verify", {
        appointmentId,
        transactionId: transactionId.trim(),
        paymentDate,
        notes: notes.trim(),
      });

      if (response.data.success) {
        toast.success("Payment verification submitted!");
        router.push(`/zelle/success/${appointmentId}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c48d2c] mx-auto"></div>
          <p className="mt-4 text-[#7f482f]">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f6]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Appointment not found</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 text-[#c48d2c] hover:underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f6] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-luxury overflow-hidden">
          {/* Header */}
          <div className="bg-[#4a2b1d] p-8 text-center">
            <Send className="w-16 h-16 text-[#c48d2c] mx-auto mb-4" />
            <h1 className="text-3xl font-serif text-white">
              Verify Zelle Payment
            </h1>
            <p className="text-[#d4a691] mt-2">
              Confirm your payment to secure your appointment
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Zelle Instructions */}
            <div className="bg-[#fff5e6] p-6 rounded-lg border-2 border-dashed border-[#c48d2c]">
              <h3 className="font-semibold text-[#4a2b1d] flex items-center">
                <DollarSign className="w-5 h-5 text-[#c48d2c] mr-2" />
                Send Payment via Zelle
              </h3>
              <div className="mt-3 space-y-2 text-sm">
                <p>
                  <strong>Recipient:</strong>{" "}
                  {zelleInfo.name || "Zainab - Locs by HairArena"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {zelleInfo.email || process.env.NEXT_PUBLIC_ZELLE_EMAIL}
                </p>
                <p>
                  <strong>Phone:</strong> {zelleInfo.phone || "(646) 400-7132"}
                </p>
                <p>
                  <strong>Amount:</strong>{" "}
                  <span className="text-[#c48d2c] font-bold">
                    ${appointment.depositAmount}
                  </span>
                </p>
                <p>
                  <strong>Reference:</strong>{" "}
                  <span className="font-mono bg-white px-2 py-1 rounded">
                    APT-{appointment.id.slice(-6)}
                  </span>
                </p>
              </div>
            </div>

            {/* Appointment Summary */}
            <div className="bg-[#fdf8f6] p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-[#c48d2c]" />
                <span className="font-semibold">Appointment Details</span>
              </div>
              <p className="text-sm text-[#7f482f]">
                <span className="font-medium">Service:</span>{" "}
                {appointment.serviceType}
              </p>
              <p className="text-sm text-[#7f482f]">
                <span className="font-medium">Date:</span>{" "}
                {formatDate(appointment.appointmentDate)}
              </p>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Transaction Reference/ID *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter the reference number from your bank"
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                  required
                />
                <p className="text-xs text-[#7f482f] mt-1">
                  This is usually a confirmation number from your bank
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Payment Date *
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information about your payment..."
                  rows={3}
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Verify My Payment
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-xs text-gray-500">
              <p>
                By submitting, you confirm that you have sent the payment via
                Zelle.
              </p>
              <p className="mt-1">
                We will verify your payment within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
