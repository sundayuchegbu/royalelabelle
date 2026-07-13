"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fdf8f6] flex items-center justify-center p-4">
      <AuthModal onClose={() => router.push("/")} mode="login" />
    </div>
  );
}
