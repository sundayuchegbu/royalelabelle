"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Clock, Mail, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import api from "@/lib/api";

export default function ZelleSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;
  const [countdown, setCountdown] = useState(24);

  useEffect(() => {
    // Countdown timer for verification time
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 3600000); // Update every hour

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf8f6] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-luxury p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="font-serif text-3xl text-[#4a2b1d] mb-2">
          Payment Verification Submitted! ✅
        </h1>
        <p className="text-[#7f482f] mb-6">
          Thank you for submitting your Zelle payment verification.
        </p>

        <div className="bg-[#fdf8f6] p-6 rounded-lg mb-6">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Clock className="w-5 h-5 text-[#c48d2c]" />
            <span className="font-semibold">Verification in Progress</span>
          </div>
          <p className="text-sm text-[#7f482f]">
            We will verify your payment within <strong>24 hours</strong>. You'll
            receive a confirmation email once verified.
          </p>
        </div>

        <div className="bg-[#fff5e6] p-4 rounded-lg mb-6 text-left">
          <h3 className="font-semibold text-[#4a2b1d] mb-2 flex items-center">
            <Mail className="w-4 h-4 text-[#c48d2c] mr-2" />
            What's Next?
          </h3>
          <ul className="space-y-2 text-sm text-[#7f482f]">
            <li>• We'll check for your payment in our Zelle account</li>
            <li>• You'll receive a confirmation email within 24 hours</li>
            <li>• Your appointment will be confirmed once verified</li>
            <li>• Check your email for the official confirmation</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="gold"
            size="md"
            className="flex-1"
            onClick={() => router.push(`/appointments/${appointmentId}`)}
          >
            View Appointment
          </Button>
          <Button
            variant="outline"
            size="md"
            className="flex-1"
            onClick={() => router.push("/")}
          >
            Return Home
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-[#f6ede8]">
          <p className="text-xs text-[#7f482f]">
            Need help? Call or text us at{" "}
            <a href="tel:6464007132" className="text-[#c48d2c] font-medium">
              (646) 400-7132
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
