"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Send,
} from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function InteracVerifyPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;

  const [interacInfo, setInteracInfo] = useState({
    email: "",
    phone: "",
    name: "",
    amount: 0,
  });
  const [transactionId, setTransactionId] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get appointment and Interac info
        const response = await api.get("/payments/info");
        const info = response.data.methods.interac;
        setInteracInfo({
          email: info.email || "zainab@locsbyhairarena.com",
          phone: info.phone || "(646) 400-7132",
          name: info.name || "Zainab - Locs by HairArena",
          amount: 200, // This would come from the appointment
        });
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load payment information");
        router.push("/");
      }
    };

    fetchData();
  }, [appointmentId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transactionId.trim()) {
      toast.error("Please enter your transaction ID");
      return;
    }

    if (!referenceNumber.trim()) {
      toast.error("Please enter the reference number");
      return;
    }

    if (!paymentDate) {
      toast.error("Please select the payment date");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/payments/interac/verify", {
        appointmentId,
        transactionId: transactionId.trim(),
        referenceNumber: referenceNumber.trim(),
        paymentDate,
        notes: notes.trim(),
      });

      if (response.data.success) {
        toast.success("Payment verification submitted!");
        router.push(`/interac/success/${appointmentId}`);
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

  return (
    <div className="min-h-screen bg-[#fdf8f6] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-luxury overflow-hidden">
          {/* Header */}
          <div className="bg-[#4a2b1d] p-8 text-center">
            <Building2 className="w-16 h-16 text-[#c48d2c] mx-auto mb-4" />
            <h1 className="text-3xl font-serif text-white">
              Verify Interac Payment
            </h1>
            <p className="text-[#d4a691] mt-2">
              Confirm your e-Transfer to secure your appointment
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Interac Instructions */}
            <div className="bg-[#e8f5e9] p-6 rounded-lg border-2 border-dashed border-green-500">
              <h3 className="font-semibold text-[#4a2b1d] flex items-center">
                <Send className="w-5 h-5 text-green-600 mr-2" />
                Send Interac e-Transfer
              </h3>
              <div className="mt-3 space-y-2 text-sm">
                <p>
                  <strong>Recipient:</strong> {interacInfo.name}
                </p>
                <p>
                  <strong>Email:</strong> {interacInfo.email}
                </p>
                <p>
                  <strong>Phone:</strong> {interacInfo.phone}
                </p>
                <p>
                  <strong>Amount:</strong>{" "}
                  <span className="text-green-600 font-bold">
                    ${interacInfo.amount}
                  </span>
                </p>
                <p>
                  <strong>Security Question:</strong> What is my business name?
                </p>
                <p>
                  <strong>Answer:</strong> HairArena
                </p>
              </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Transaction ID *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter the transaction ID from your bank"
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                  required
                />
                <p className="text-xs text-[#7f482f] mt-1">
                  This is the confirmation number from your bank
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Reference Number *
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Enter the reference number you used"
                  className="w-full px-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                  required
                />
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
                Interac e-Transfer.
              </p>
              <p className="mt-1">
                We will verify your payment within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
