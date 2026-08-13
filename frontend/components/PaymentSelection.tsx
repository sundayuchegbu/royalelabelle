"use client";

import { useState, useEffect } from "react";
import {
  // CreditCard,
  // Send,
  Building2,
  DollarSign,
  Check,
  ChevronRight,
  AlertCircle,
  Clock,
} from "lucide-react";
import Button from "./ui/Button";
import api from "@/lib/api";

interface PaymentInfo {
  methods: {
    // stripe: {
    //   available: boolean;
    //   description: string;
    //   processingTime: string;
    // };
    // zelle: {
    //   available: boolean;
    //   email: string;
    //   phone: string;
    //   name: string;
    //   description: string;
    //   processingTime: string;
    // };
    interac: {
      available: boolean;
      email: string;
      phone: string;
      name: string;
      description: string;
      processingTime: string;
    };
    cash: {
      available: boolean;
      description: string;
      notes: string;
      processingTime: string;
    };
  };
}

interface PaymentSelectionProps {
  appointmentId: string;
  depositAmount: number;
  fullPrice: number;
  onPaymentSelect: (method: "interac" | "cash") => void;
  onBack?: () => void;
}

export default function PaymentSelection({
  appointmentId,
  depositAmount,
  fullPrice,
  onPaymentSelect,
  onBack,
}: PaymentSelectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<
    "interac" | "cash" | null
  >(null);

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const response = await api.get("/payments/info");
        setPaymentInfo(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch payment info:", error);
        setIsLoading(false);
      }
    };

    fetchPaymentInfo();
  }, []);

  const paymentMethods = [
    // =========================================================
    // STRIPE - COMMENTED OUT
    // =========================================================
    // {
    //   id: "stripe" as const,
    //   icon: <CreditCard className="w-6 h-6" />,
    //   title: "Credit/Debit Card",
    //   description: "Pay instantly with any credit or debit card",
    //   features: [
    //     "Instant confirmation",
    //     "Secure payment",
    //     "Worldwide accepted",
    //   ],
    //   color: "border-blue-500 bg-blue-50",
    //   iconColor: "bg-blue-500",
    //   available: paymentInfo?.methods.stripe.available,
    //   processingTime: paymentInfo?.methods.stripe.processingTime,
    // },

    // =========================================================
    // ZELLE - COMMENTED OUT
    // =========================================================
    // {
    //   id: "zelle" as const,
    //   icon: <Send className="w-6 h-6" />,
    //   title: "Zelle",
    //   description: "Pay directly from your US bank account",
    //   features: [
    //     "No fees",
    //     "Direct bank transfer",
    //     "Manual verification required",
    //   ],
    //   color: "border-purple-500 bg-purple-50",
    //   iconColor: "bg-purple-500",
    //   available: paymentInfo?.methods.zelle.available,
    //   processingTime: paymentInfo?.methods.zelle.processingTime,
    // },

    // =========================================================
    // INTERAC - ACTIVE
    // =========================================================
    {
      id: "interac" as const,
      icon: <Building2 className="w-6 h-6" />,
      title: "Interac e-Transfer",
      description: "Pay from your Canadian bank account",
      features: [
        "No fees",
        "Secure e-Transfer",
        "Manual verification required",
      ],
      color: "border-green-500 bg-green-50",
      iconColor: "bg-green-500",
      available: paymentInfo?.methods.interac.available,
      processingTime: paymentInfo?.methods.interac.processingTime,
    },

    // =========================================================
    // CASH - ACTIVE
    // =========================================================
    {
      id: "cash" as const,
      icon: <DollarSign className="w-6 h-6" />,
      title: "Cash",
      description: "Pay in person on the day of service",
      features: [
        "No fees",
        "Pay at appointment",
        "No deposit required upfront",
      ],
      color: "border-green-600 bg-green-50",
      iconColor: "bg-green-600",
      available: paymentInfo?.methods.cash.available,
      processingTime: paymentInfo?.methods.cash.processingTime,
    },
  ];

  const handleContinue = () => {
    if (selectedMethod) {
      onPaymentSelect(selectedMethod);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>

        <p className="mt-4 text-[#7f482f]">Loading payment options...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Header */}
      <div className="text-center">
        <h3 className="font-serif text-2xl text-[#4a2b1d]">
          Choose Payment Method
        </h3>

        <div className="mt-2 flex justify-center gap-8 text-sm text-[#7f482f]">
          <span>
            Deposit: <strong className="text-gold">${depositAmount}</strong>
          </span>

          <span>
            Total: <strong>${fullPrice}</strong>
          </span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          const isAvailable = method.available !== false;

          return (
            <button
              key={method.id}
              onClick={() => isAvailable && setSelectedMethod(method.id)}
              disabled={!isAvailable}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-gold bg-[#fdf8f6] shadow-lg"
                  : isAvailable
                    ? "border-[#f6ede8] hover:border-[#d4a691] hover:shadow-md"
                    : "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 ${
                    isSelected ? "bg-gold" : method.iconColor
                  }`}
                >
                  {method.icon}
                </div>

                <div className="flex-1">
                  {/* Title */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[#4a2b1d]">
                      {method.title}
                    </h4>

                    {isSelected && <Check className="w-5 h-5 text-gold" />}

                    {!isAvailable && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        Unavailable
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#7f482f]">{method.description}</p>

                  {/* Processing Time */}
                  {method.processingTime && isAvailable && (
                    <div className="flex items-center mt-2 text-xs text-[#7f482f]">
                      <Clock className="w-3 h-3 mr-1" />
                      {method.processingTime}
                    </div>
                  )}

                  {/* Features */}
                  <ul className="mt-2 space-y-1">
                    {method.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-xs text-[#7f482f] flex items-center"
                      >
                        <span className="w-1 h-1 bg-gold rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Cash Notice */}
                  {method.id === "cash" && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                      <AlertCircle className="w-3 h-3 inline mr-1" />

                      {paymentInfo?.methods.cash.notes ||
                        "Bring exact cash amount"}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {onBack && (
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
        )}

        <Button
          variant="gold"
          size="lg"
          disabled={!selectedMethod}
          onClick={handleContinue}
          className={onBack ? "flex-1" : "w-full"}
        >
          Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Terms */}
      <div className="text-center">
        <p className="text-xs text-[#7f482f]">
          By proceeding, you agree to our booking policy and terms of service.
        </p>

        <p className="text-xs text-[#7f482f] mt-1">
          💳 All payments are secure and encrypted
        </p>
      </div>
    </div>
  );
}
