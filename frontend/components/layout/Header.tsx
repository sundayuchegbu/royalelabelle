"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  Calendar,
  User,
  LogOut,
  Settings,
  UserCircle,
  LayoutDashboard,
  Shield,
  CalendarDays,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "../ui/Button";
import BookingModal from "../BookingModal";

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBookNow = () => {
    setShowBookingModal(true);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#pricing", label: "Pricing" },
    { href: "#gallery", label: "Gallery" },
    { href: "#policy", label: "Policy" },
    { href: "#testimonials", label: "Testimonials" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center">
              <span className="text-white font-serif text-xl font-bold">
                RL
              </span>
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-[#c48d2c]">
                Royale la'belle
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#4a2b1d] text-[#c48d2c] transition-colors font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:+15485573218"
              className="flex items-center text-[#ffffff] hover:text-[#c48d2c] transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="font-medium">+1(548) 557-3218</span>
            </a>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[#f6ede8] transition-colors"
                >
                  <UserCircle className="w-6 h-6 text-[#c48d2c]" />
                  <span className="text-sm font-medium text-[#4a2b1d]">
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                  {isAdmin && (
                    <span className="text-xs bg-[#c48d2c] text-white px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border border-[#f6ede8]">
                    <div className="px-4 py-2 border-b border-[#f6ede8]">
                      <p className="text-sm font-medium text-[#4a2b1d]">
                        {user?.name}
                      </p>
                      <p className="text-xs text-[#7f482f]">{user?.email}</p>
                      {isAdmin && (
                        <p className="text-xs text-[#c48d2c] font-medium mt-1 flex items-center">
                          <Shield className="w-3 h-3 mr-1" />
                          Administrator
                        </p>
                      )}
                    </div>

                    {/* Admin Dashboard Link - Only for admins */}
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            router.push("/admin/dashboard");
                          }}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#c48d2c] hover:bg-[#fdf8f6] transition-colors border-b border-[#f6ede8]"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push("/profile");
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#4a2b1d] hover:bg-[#f6ede8] transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push("/my-appointments");
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#4a2b1d] hover:bg-[#f6ede8] transition-colors"
                    >
                      <CalendarDays className="w-4 h-4" />
                      <span>My Appointments</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push("/settings");
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#4a2b1d] hover:bg-[#f6ede8] transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-[#f6ede8] mt-2 pt-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push("/auth")}
                style={{ cursor: "pointer" }}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}

            <Button
              variant="gold"
              size="sm"
              onClick={handleBookNow}
              className="cursor-pointer"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-[#f6ede8] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-[#4a2b1d]" />
            ) : (
              <Menu className="w-6 h-6 text-[#4a2b1d]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#f6ede8]">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#4a2b1d] hover:text-[#c48d2c] transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-[#f6ede8] space-y-3">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#4a2b1d]">
                          {user?.name}
                        </p>
                        <p className="text-xs text-[#7f482f]">{user?.email}</p>
                        {isAdmin && (
                          <p className="text-xs text-[#c48d2c] font-medium flex items-center">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Logout
                      </button>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push("/admin/dashboard");
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 bg-[#fdf8f6] rounded-lg text-[#c48d2c] text-sm"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push("/profile");
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 bg-[#fdf8f6] rounded-lg text-[#4a2b1d] text-sm"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push("/my-appointments");
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 bg-[#fdf8f6] rounded-lg text-[#4a2b1d] text-sm"
                    >
                      <CalendarDays className="w-4 h-4" />
                      <span>My Appointments</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push("/settings");
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 bg-[#fdf8f6] rounded-lg text-[#4a2b1d] text-sm"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full"
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/auth");
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In / Register
                  </Button>
                )}
                <a
                  href="tel:+15485573218"
                  className="flex items-center text-[#4a2b1d] font-medium"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +1(548) 557-3218
                </a>
                <Button
                  variant="gold"
                  size="md"
                  className="w-full cursor-pointer"
                  onClick={() => {
                    handleBookNow();
                    setIsMenuOpen(false);
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
      {showBookingModal && (
        <BookingModal onClose={() => setShowBookingModal(false)} />
      )}
    </header>
  );
}
