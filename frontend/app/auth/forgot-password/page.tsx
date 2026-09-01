"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/forgot-password", { email });

      if (response.data.success) {
        setIsSubmitted(true);
        toast.success("Password reset link sent to your email");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to send reset link");
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#fdf8f6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-luxury p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="font-serif text-2xl text-[#4a2b1d] mb-2">
            Check Your Email
          </h1>
          <p className="text-[#7f482f] mb-6">
            We've sent a password reset link to <strong>{email}</strong>. Please
            check your inbox and spam folder.
          </p>
          <div className="bg-[#fdf8f6] p-4 rounded-lg text-sm text-[#7f482f]">
            <p>🔑 The link will expire in 1 hour.</p>
            <p className="mt-1">
              📧 Didn't receive the email? Check your spam folder.
            </p>
          </div>
          <Link href="/auth">
            <Button variant="gold" size="md" className="w-full mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f6] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link
          href="/auth"
          className="inline-flex items-center text-[#7f482f] hover:text-gold transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>

        <div className="bg-white rounded-2xl shadow-luxury p-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl text-[#4a2b1d]">
              Forgot Password
            </h1>
            <p className="text-[#7f482f] text-sm mt-1">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <p className="text-xs text-center text-[#7f482f] mt-4">
            Remember your password?{" "}
            <Link
              href="/auth"
              className="text-gold hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
