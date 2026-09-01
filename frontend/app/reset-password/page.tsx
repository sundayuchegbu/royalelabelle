"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import toast from "react-hot-toast";

// Main component that uses useSearchParams
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setError("No reset token provided");
      setIsValidToken(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await api.get(
          `/auth/verify-reset-token?token=${token}`,
        );
        if (response.data.success) {
          setIsValidToken(true);
          setIsTokenVerified(true);
          setEmail(response.data.email);
        }
      } catch (error: any) {
        setError(
          error.response?.data?.message || "Invalid or expired reset token",
        );
        setIsValidToken(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password,
      });

      if (response.data.success) {
        setIsSubmitted(true);
        toast.success("Password reset successfully!");
        setTimeout(() => {
          router.push("/auth");
        }, 3000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to reset password");
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidToken === false) {
    return (
      <div className="min-h-screen bg-[#fdf8f6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-luxury p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="font-serif text-2xl text-[#4a2b1d] mb-2">
            Invalid Reset Link
          </h1>
          <p className="text-[#7f482f] mb-6">
            {error || "The password reset link is invalid or has expired."}
          </p>
          <div className="bg-[#fdf8f6] p-4 rounded-lg text-sm text-[#7f482f] mb-4">
            <p>🔑 Reset links expire after 1 hour.</p>
            <p className="mt-1">📧 Request a new reset link if needed.</p>
          </div>
          <Link href="/auth/forgot-password">
            <Button variant="gold" size="md" className="w-full">
              Request New Link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#fdf8f6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-luxury p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="font-serif text-2xl text-[#4a2b1d] mb-2">
            Password Reset Successful! 🎉
          </h1>
          <p className="text-[#7f482f] mb-6">
            Your password has been reset successfully. You can now sign in with
            your new password.
          </p>
          <Link href="/auth">
            <Button variant="gold" size="md" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isTokenVerified) {
    return (
      <div className="min-h-screen bg-[#fdf8f6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-luxury p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-[#7f482f]">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f6] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-luxury p-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl text-[#4a2b1d]">
              Reset Password
            </h1>
            <p className="text-[#7f482f] text-sm mt-1">
              {email && `Reset password for ${email}`}
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
                New Password *
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-10 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7f482f] hover:text-[#4a2b1d]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
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
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <p className="text-xs text-center text-[#7f482f] mt-4">
            <Link
              href="/auth"
              className="text-gold hover:underline font-medium"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fdf8f6] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-luxury p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="mt-4 text-[#7f482f]">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
