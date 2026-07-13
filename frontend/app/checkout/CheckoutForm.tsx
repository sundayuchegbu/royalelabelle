"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { paymentService } from "@/lib/services";
import PaymentSelection from "@/components/PaymentSelection";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import AuthModal from "@/components/AuthModal";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

// Stripe Payment Form Component
function StripePaymentForm({
  clientSecret,
  depositAmount,
  appointmentId,
  onSuccess,
  onError,
}: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/my-appointments/${appointmentId}`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        onError?.(error);
      } else if (paymentIntent?.status === "succeeded") {
        toast.success("Payment successful! Your appointment is confirmed.");
        onSuccess?.(paymentIntent);
      }
    } catch (error: any) {
      toast.error(error.message || "Payment processing failed");
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Card Payment</h3>
        <p className="text-sm text-gray-600 mb-4">
          Deposit Amount:{" "}
          <span className="font-bold text-gold">${depositAmount}</span>
        </p>
        <PaymentElement />
      </div>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? "Processing..." : `Pay $${depositAmount} Deposit`}
      </Button>
    </form>
  );
}

// Main Checkout Page
export default function checkoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const appointmentId = searchParams.get("appointmentId");
  const [paymentMethod, setPaymentMethod] = useState<
    "stripe" | "zelle" | "interac" | "cash" | null
  >(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [fullPrice, setFullPrice] = useState<number>(0);
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const [showPaymentSelection, setShowPaymentSelection] = useState(true);

  // Check authentication
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
  }, [isLoading, isAuthenticated]);

  // Fetch appointment details
  useEffect(() => {
    if (!isAuthenticated || !appointmentId) {
      if (!appointmentId) {
        toast.error("No appointment selected");
        router.push("/");
      }
      return;
    }

    const fetchAppointmentDetails = async () => {
      try {
        const response = await api.get(`/user/appointments/${appointmentId}`);
        const appointment = response.data.appointment;
        setDepositAmount(appointment.depositAmount || 200);
        setFullPrice(appointment.fullPrice || 1200);
        setIsLoadingPayment(false);
      } catch (error) {
        toast.error("Failed to load appointment details");
        router.push("/");
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId, isAuthenticated, router]);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Refresh the page to load appointment details
    window.location.reload();
  };

  const handlePaymentSelect = async (
    method: "stripe" | "zelle" | "interac" | "cash",
  ) => {
    setPaymentMethod(method);
    setShowPaymentSelection(false);

    if (method === "stripe") {
      try {
        setIsLoadingPayment(true);
        const response = await paymentService.createPaymentIntent(
          appointmentId!,
          depositAmount,
        );
        setClientSecret(response.data.clientSecret);
        setIsLoadingPayment(false);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to initialize payment",
        );
        setShowPaymentSelection(true);
        setIsLoadingPayment(false);
      }
    } else if (method === "zelle") {
      try {
        setIsLoadingPayment(true);
        const response = await api.post("/payments/zelle/create", {
          appointmentId,
        });

        if (response.data.success) {
          toast.success("Zelle instructions sent to your email");
          router.push(`/zelle/verify/${appointmentId}`);
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to initiate Zelle payment",
        );
        setShowPaymentSelection(true);
        setIsLoadingPayment(false);
      }
    } else if (method === "interac") {
      try {
        setIsLoadingPayment(true);
        const response = await api.post("/payments/interac/create", {
          appointmentId,
        });

        if (response.data.success) {
          toast.success("Interac instructions sent to your email");
          router.push(`/interac/verify/${appointmentId}`);
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to initiate Interac payment",
        );
        setShowPaymentSelection(true);
        setIsLoadingPayment(false);
      }
    } else if (method === "cash") {
      try {
        setIsLoadingPayment(true);
        const response = await api.post("/payments/cash/create", {
          appointmentId,
        });

        if (response.data.success) {
          toast.success(
            "Cash payment selected! Your appointment is confirmed.",
          );
          router.push(`/appointments/${appointmentId}`);
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to confirm cash payment",
        );
        setShowPaymentSelection(true);
        setIsLoadingPayment(false);
      }
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("Appointment confirmed! Check your email for details.");
    router.push(`/my-appointments/${appointmentId}`);
  };

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error);
    setShowPaymentSelection(true);
  };

  if (isLoading || isLoadingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c48d2c] mx-auto"></div>
          <p className="mt-4 text-[#7f482f]">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c48d2c] mx-auto"></div>
          <p className="mt-4 text-[#7f482f]">Redirecting to login...</p>
        </div>
        {showAuthModal && (
          <AuthModal
            onClose={() => {
              setShowAuthModal(false);
              router.push("/");
            }}
            onSuccess={handleAuthSuccess}
            mode="login"
          />
        )}
      </div>
    );
  }

  if (!appointmentId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f6]">
        <div className="text-center">
          <p className="text-red-600">No appointment selected</p>
          <Button
            variant="gold"
            size="md"
            className="mt-4"
            onClick={() => router.push("/#booking")}
          >
            Book an Appointment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f6] py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-luxury p-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-[#4a2b1d]">
              Complete Your Booking
            </h1>
            <p className="text-[#7f482f] mt-2">
              Secure your appointment with a deposit
            </p>
          </div>

          {showPaymentSelection ? (
            <PaymentSelection
              appointmentId={appointmentId}
              depositAmount={depositAmount}
              fullPrice={fullPrice}
              onPaymentSelect={handlePaymentSelect}
            />
          ) : paymentMethod === "stripe" && clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripePaymentForm
                clientSecret={clientSecret}
                depositAmount={depositAmount}
                appointmentId={appointmentId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          ) : paymentMethod === "zelle" ||
            paymentMethod === "interac" ||
            paymentMethod === "cash" ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c48d2c] mx-auto"></div>
              <p className="mt-4 text-[#7f482f]">
                {paymentMethod === "cash"
                  ? "Confirming appointment..."
                  : "Redirecting to payment verification..."}
              </p>
            </div>
          ) : null}

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Your payment is secure and encrypted.</p>
            <p className="mt-1">
              By proceeding, you agree to our booking policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
