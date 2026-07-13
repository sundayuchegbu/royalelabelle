"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Bell,
  BellOff,
  Shield,
  User,
  Lock,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  DollarSign,
  CreditCard,
  Send,
  Building2 as BuildingIcon,
  Wallet,
  Users,
  Calendar,
  Image as ImageIcon,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface BusinessSettings {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  depositAmounts: {
    twist: number;
    braids: number;
    interlocking: number;
    retie: number;
    repair: number;
  };
  pricing: {
    twist: number;
    braids: number;
    interlocking: number;
    retie: number;
    repair: number;
  };
  paymentMethods: {
    stripe: boolean;
    zelle: boolean;
    interac: boolean;
    cash: boolean;
  };
  notificationPreferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    appointmentReminders: boolean;
    paymentConfirmations: boolean;
    marketingEmails: boolean;
  };
  theme: "light" | "dark" | "system";
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<BusinessSettings>({
    businessName: "Royale la'belle",
    businessEmail: "info@royallabelle.com",
    businessPhone: "(646) 400-7132",
    businessAddress: "735 Liberty Avenue, Brooklyn, NY 11208",
    businessHours: {
      monday: { open: "09:00", close: "19:00" },
      tuesday: { open: "09:00", close: "19:00" },
      wednesday: { open: "09:00", close: "19:00" },
      thursday: { open: "09:00", close: "19:00" },
      friday: { open: "09:00", close: "19:00" },
      saturday: { open: "09:00", close: "17:00" },
      sunday: { open: "00:00", close: "00:00" },
    },
    depositAmounts: {
      twist: 200,
      braids: 200,
      interlocking: 300,
      retie: 200,
      repair: 200,
    },
    pricing: {
      twist: 1000,
      braids: 1200,
      interlocking: 1600,
      retie: 150,
      repair: 200,
    },
    paymentMethods: {
      stripe: true,
      zelle: true,
      interac: true,
      cash: true,
    },
    notificationPreferences: {
      emailNotifications: true,
      smsNotifications: true,
      appointmentReminders: true,
      paymentConfirmations: true,
      marketingEmails: false,
    },
    theme: "light",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "general"
    | "hours"
    | "pricing"
    | "payments"
    | "notifications"
    | "appearance"
  >("general");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      // In production, fetch from API
      // const response = await api.get('/admin/settings');
      // setSettings(response.data);

      // For now, using default settings
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to load settings");
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // In production, save to API
      // await api.put('/admin/settings', settings);

      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSaveSuccess(true);
      toast.success("Settings saved successfully!");
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBusinessHoursChange = (
    day: string,
    field: "open" | "close",
    value: string,
  ) => {
    setSettings({
      ...settings,
      businessHours: {
        ...settings.businessHours,
        [day]: {
          ...settings.businessHours[day as keyof typeof settings.businessHours],
          [field]: value,
        },
      },
    });
  };

  const handleDepositChange = (service: string, value: number) => {
    setSettings({
      ...settings,
      depositAmounts: {
        ...settings.depositAmounts,
        [service]: value,
      },
    });
  };

  const handlePricingChange = (service: string, value: number) => {
    setSettings({
      ...settings,
      pricing: {
        ...settings.pricing,
        [service]: value,
      },
    });
  };

  const handlePaymentMethodToggle = (method: string) => {
    setSettings({
      ...settings,
      paymentMethods: {
        ...settings.paymentMethods,
        [method]:
          !settings.paymentMethods[
            method as keyof typeof settings.paymentMethods
          ],
      },
    });
  };

  const handleNotificationToggle = (key: string) => {
    setSettings({
      ...settings,
      notificationPreferences: {
        ...settings.notificationPreferences,
        [key]:
          !settings.notificationPreferences[
            key as keyof typeof settings.notificationPreferences
          ],
      },
    });
  };

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setSettings({
      ...settings,
      theme,
    });
  };

  const tabs = [
    { id: "general", label: "General", icon: Building2 },
    { id: "hours", label: "Business Hours", icon: Clock },
    { id: "pricing", label: "Pricing & Deposits", icon: DollarSign },
    { id: "payments", label: "Payment Methods", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Monitor },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c48d2c] mx-auto"></div>
          <p className="mt-4 text-[#7f482f]">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#4a2b1d]">Settings</h1>
          <p className="text-[#7f482f] mt-1">
            Manage your business settings and preferences
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSettings}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Reset
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 mb-6 flex items-center gap-3 animate-fadeInUp">
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-800">Settings Saved!</p>
            <p className="text-sm text-green-700">
              All changes have been applied successfully.
            </p>
          </div>
        </div>
      )}
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-luxury overflow-hidden">
        <div className="flex overflow-x-auto border-b border-[#f6ede8]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-[#c48d2c] border-b-2 border-[#c48d2c]"
                    : "text-[#7f482f] hover:text-[#4a2b1d] hover:bg-[#fdf8f6]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-[#4a2b1d]">
                General Information
              </h2>
              <p className="text-sm text-[#7f482f]">
                Update your business information displayed across the site.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={settings.businessName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          businessName: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Business Email
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="email"
                      value={settings.businessEmail}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          businessEmail: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Business Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="tel"
                      value={settings.businessPhone}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          businessPhone: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="w-5 h-5 text-[#7f482f] absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="url"
                      value="https://royallabelle.com"
                      className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-gray-50"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a2b1d] mb-1">
                  Business Address
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-[#7f482f] absolute left-3 top-3" />
                  <textarea
                    value={settings.businessAddress}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        businessAddress: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full pl-10 pr-4 py-2 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Business Hours */}
          {activeTab === "hours" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-[#4a2b1d]">
                Business Hours
              </h2>
              <p className="text-sm text-[#7f482f]">
                Set your operating hours for each day of the week.
              </p>

              <div className="space-y-3">
                {[
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ].map((day) => {
                  const dayData =
                    settings.businessHours[
                      day as keyof typeof settings.businessHours
                    ];
                  const isClosed =
                    dayData.open === "00:00" && dayData.close === "00:00";
                  const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);

                  return (
                    <div
                      key={day}
                      className="flex items-center gap-4 p-3 bg-[#fdf8f6] rounded-lg"
                    >
                      <div className="w-24 font-medium text-[#4a2b1d]">
                        {dayLabel}
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        <input
                          type="time"
                          value={dayData.open}
                          onChange={(e) =>
                            handleBusinessHoursChange(
                              day,
                              "open",
                              e.target.value,
                            )
                          }
                          disabled={isClosed}
                          className="px-3 py-1 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white"
                        />
                        <span className="text-[#7f482f]">to</span>
                        <input
                          type="time"
                          value={dayData.close}
                          onChange={(e) =>
                            handleBusinessHoursChange(
                              day,
                              "close",
                              e.target.value,
                            )
                          }
                          disabled={isClosed}
                          className="px-3 py-1 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (isClosed) {
                            handleBusinessHoursChange(day, "open", "09:00");
                            handleBusinessHoursChange(day, "close", "17:00");
                          } else {
                            handleBusinessHoursChange(day, "open", "00:00");
                            handleBusinessHoursChange(day, "close", "00:00");
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          isClosed
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {isClosed ? "Open" : "Closed"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing & Deposits */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-[#4a2b1d]">
                Pricing & Deposits
              </h2>
              <p className="text-sm text-[#7f482f]">
                Configure service prices and deposit amounts.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["twist", "braids", "interlocking", "retie", "repair"].map(
                  (service) => {
                    const serviceLabel =
                      service.charAt(0).toUpperCase() + service.slice(1);
                    return (
                      <div
                        key={service}
                        className="bg-[#fdf8f6] rounded-lg p-4"
                      >
                        <p className="font-medium text-[#4a2b1d]">
                          {serviceLabel}
                        </p>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <div>
                            <label className="block text-xs text-[#7f482f]">
                              Price ($)
                            </label>
                            <input
                              type="number"
                              value={
                                settings.pricing[
                                  service as keyof typeof settings.pricing
                                ]
                              }
                              onChange={(e) =>
                                handlePricingChange(
                                  service,
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              min="0"
                              step="50"
                              className="w-full px-3 py-1 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#7f482f]">
                              Deposit ($)
                            </label>
                            <input
                              type="number"
                              value={
                                settings.depositAmounts[
                                  service as keyof typeof settings.depositAmounts
                                ]
                              }
                              onChange={(e) =>
                                handleDepositChange(
                                  service,
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              min="0"
                              step="50"
                              className="w-full px-3 py-1 border border-[#f6ede8] rounded-lg focus:ring-2 focus:ring-[#c48d2c] focus:border-transparent bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm text-blue-800">
                  💡 Prices and deposits are used for appointment calculations
                  and checkout. Changes will apply to new bookings only.
                </p>
              </div>
            </div>
          )}

          {/* Payment Methods */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-[#4a2b1d]">
                Payment Methods
              </h2>
              <p className="text-sm text-[#7f482f]">
                Enable or disable payment methods for your customers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    key: "stripe",
                    label: "Stripe",
                    icon: CreditCard,
                    description: "Credit/Debit Card payments",
                  },
                  {
                    key: "zelle",
                    label: "Zelle",
                    icon: Send,
                    description: "US bank transfers",
                  },
                  {
                    key: "interac",
                    label: "Interac",
                    icon: BuildingIcon,
                    description: "Canadian bank transfers",
                  },
                  {
                    key: "cash",
                    label: "Cash",
                    icon: Wallet,
                    description: "In-person payments",
                  },
                ].map((method) => {
                  const Icon = method.icon;
                  const isEnabled =
                    settings.paymentMethods[
                      method.key as keyof typeof settings.paymentMethods
                    ];
                  return (
                    <div
                      key={method.key}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isEnabled
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-gray-50 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isEnabled
                                ? "bg-green-500 text-white"
                                : "bg-gray-300 text-gray-500"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-[#4a2b1d]">
                              {method.label}
                            </p>
                            <p className="text-xs text-[#7f482f]">
                              {method.description}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePaymentMethodToggle(method.key)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            isEnabled ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              isEnabled ? "translate-x-6" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                <p className="text-sm text-yellow-800">
                  ⚠️ Disabling a payment method will hide it from the checkout
                  page. Existing bookings using disabled methods will not be
                  affected.
                </p>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-[#4a2b1d]">
                Admin Notifications
              </h2>
              <p className="text-sm text-[#7f482f]">
                Configure which admin users receive notifications and what they
                get notified about.
              </p>

              <div className="space-y-4">
                <div className="bg-[#fdf8f6] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#4a2b1d]">
                        New Booking Notifications
                      </p>
                      <p className="text-sm text-[#7f482f]">
                        Receive email when a customer books an appointment
                      </p>
                    </div>
                    <button className="relative w-12 h-6 rounded-full bg-green-500">
                      <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-6" />
                    </button>
                  </div>
                </div>

                <div className="bg-[#fdf8f6] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#4a2b1d]">
                        Payment Received Notifications
                      </p>
                      <p className="text-sm text-[#7f482f]">
                        Receive email when a payment is received
                      </p>
                    </div>
                    <button className="relative w-12 h-6 rounded-full bg-green-500">
                      <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-6" />
                    </button>
                  </div>
                </div>

                <div className="bg-[#fdf8f6] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#4a2b1d]">Admin Users</p>
                      <p className="text-sm text-[#7f482f]">
                        Users who will receive admin notifications
                      </p>
                    </div>
                    <button className="px-3 py-1 text-sm bg-[#c48d2c] text-white rounded-lg">
                      Manage Admins
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Appearance */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-[#4a2b1d]">Appearance</h2>
              <p className="text-sm text-[#7f482f]">
                Customize the look and feel of your admin dashboard.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    key: "light",
                    label: "Light",
                    icon: Sun,
                    description: "Light theme",
                  },
                  {
                    key: "dark",
                    label: "Dark",
                    icon: Moon,
                    description: "Dark theme",
                  },
                  {
                    key: "system",
                    label: "System",
                    icon: Monitor,
                    description: "Follow system theme",
                  },
                ].map((theme) => {
                  const Icon = theme.icon;
                  const isSelected = settings.theme === theme.key;
                  return (
                    <button
                      key={theme.key}
                      onClick={() => handleThemeChange(theme.key as any)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-[#c48d2c] bg-[#fdf8f6] shadow-lg"
                          : "border-[#f6ede8] hover:border-[#d4a691]"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isSelected
                              ? "bg-[#c48d2c] text-white"
                              : "bg-[#f6ede8] text-[#7f482f]"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                          <p
                            className={`font-medium ${isSelected ? "text-[#c48d2c]" : "text-[#4a2b1d]"}`}
                          >
                            {theme.label}
                          </p>
                          <p className="text-xs text-[#7f482f]">
                            {theme.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-sm text-purple-800">
                  🎨 Theme changes will be applied immediately to your admin
                  dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="bg-white rounded-xl shadow-luxury p-4 text-left hover:shadow-2xl transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-[#4a2b1d]">Security</p>
              <p className="text-xs text-[#7f482f]">Manage admin access</p>
            </div>
          </div>
        </button>

        <button className="bg-white rounded-xl shadow-luxury p-4 text-left hover:shadow-2xl transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-[#4a2b1d]">Staff</p>
              <p className="text-xs text-[#7f482f]">Manage team members</p>
            </div>
          </div>
        </button>

        <button className="bg-white rounded-xl shadow-luxury p-4 text-left hover:shadow-2xl transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-[#4a2b1d]">Branding</p>
              <p className="text-xs text-[#7f482f]">Update logo & colors</p>
            </div>
          </div>
        </button>

        <button className="bg-white rounded-xl shadow-luxury p-4 text-left hover:shadow-2xl transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-[#4a2b1d]">Backup</p>
              <p className="text-xs text-[#7f482f]">Backup & restore data</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
