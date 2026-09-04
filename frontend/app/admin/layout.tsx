"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Image,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, isAdmin, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check authentication and admin role
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth");
        return;
      }

      if (!isAdmin) {
        router.push("/");
        return;
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/appointments", icon: Calendar, label: "Appointments" },
    { href: "/admin/clients", icon: Users, label: "Clients" },
    { href: "/admin/gallery", icon: Image, label: "Gallery" },
    { href: "/admin/payments", icon: DollarSign, label: "Payments" },
    { href: "/admin/reports", icon: BarChart3, label: "Reports" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  if (isLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-[#7f482f]">
            {!isAuthenticated
              ? "Redirecting to login..."
              : "Verifying access..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f6]">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">
                RL
              </span>
            </div>
            <span className="font-serif text-sm font-bold text-[#4a2b1d]">
              Admin Panel
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-[#f6ede8]"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#4a2b1d]" />
            ) : (
              <Menu className="w-5 h-5 text-[#4a2b1d]" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#4a2b1d] text-white transition-all duration-300 z-40 ${
          isSidebarOpen ? "w-64" : "w-20"
        } ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#7f482f]">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-serif text-lg font-bold">
                RL
              </span>
            </div>
            {isSidebarOpen && (
              <div>
                <span className="font-serif text-lg font-bold">Admin</span>
                <p className="text-xs text-[#d4a691] flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  {user?.role || "Admin"}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:block p-1 rounded hover:bg-[#7f482f]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-gold text-white"
                  : "text-[#d4a691] hover:bg-[#7f482f] hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#7f482f]">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-[#d4a691] hover:bg-[#7f482f] hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm">View Site</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#d4a691] hover:bg-red-600 hover:text-white transition-colors mt-1"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        } ${isMobileMenuOpen ? "blur-sm" : ""}`}
      >
        <div className="pt-16 lg:pt-0">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
