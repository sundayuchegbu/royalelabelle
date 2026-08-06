"use client";

import SectionHeading from "../ui/SectionHeading";
import { Check, Video, Ruler, Scissors, Sparkles, Clock } from "lucide-react";

export default function Pricing() {
  const pricingData = [
    {
      title: "Micro Locs Twist",
      price: "Starter - $600",
      deposit: "$200",
      features: [
        "Professional twist installation",
        "Longer than 6 inches +$100",
        "Higher density +$100",
        "Customized for your hair type",
        "Post-installation care guide",
      ],
      popular: false,
    },
    {
      title: "Braids Method",
      price: "Starter - $700",
      deposit: "$200",
      features: [
        "Professional braid installation",
        "Longer than 6 inches +$100",
        "Higher density +$100",
        "Customized for your hair type",
        "Post-installation care guide",
      ],
      popular: true,
    },
    {
      title: "Micro Locs Interlocking",
      price: "Starter - $1,000",
      deposit: "$300",
      features: [
        "Professional interlocking installation",
        "Longer than 6 inches +$200",
        "Higher density +$200",
        "Customized for your hair type",
        "Post-installation care guide",
        "Premium interlocking method",
      ],
      popular: false,
    },
    {
      title: "Retie Maintenance",
      price: "Starter - $150",
      deposit: "$50",
      features: [
        "Professional retie maintenance",
        "Longer than 6 inches +$50",
        "Higher density +$50",
        "Customized for your hair type",
        "Post-maintenance care guide",
      ],
      popular: false,
    },
  ];

  const consultationFeatures = [
    "Virtual consultation via Zoom or FaceTime",
    "Hair must be at least 4 inches (have measuring tape ready)",
    "Hair must be free of product, styles, and in its natural state",
    "Comprehensive hair assessment: measurement, pricing, method of install",
    "Density, texture, and type check",
    "Maintenance guidance & product recommendations",
    "Address any questions or concerns",
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Pricing"
          title="Investment in Your Beauty"
          description="Prices vary based on length, density, texture, and method. A virtual consultation is required for exact pricing."
        />

        {/* Consultation Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-linear-to-r from-[#fdf8f6] to-[#f6ede8] rounded-2xl p-8 shadow-luxury border border-gold/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                <Video className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-[#4a2b1d]">
                  Starter Micro Locs Consultation
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-gold font-bold text-lg">$52.00</span>
                  <span className="text-[#7f482f] text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    30 mins
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[#7f482f] mb-4 italic">
              Virtual consultation held via Zoom or FaceTime
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {consultationFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span className="text-sm text-[#4a2b1d]">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-gold/10 rounded-lg border border-gold/20">
              <p className="text-sm text-[#4a2b1d] font-medium">
                💡 Consultation includes: Hair measurement, pricing, method of
                installation, density, texture and type check, maintenance,
                products & any other questions or concerns.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {pricingData.map((plan) => (
            <div
              key={plan.title}
              className={`relative bg-[#fdf8f6] rounded-2xl p-6 transition-all duration-300 ${
                plan.popular
                  ? "shadow-2xl border-2 border-gold transform -translate-y-2"
                  : "shadow-luxury hover:shadow-2xl"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-gold text-white px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <h3 className="font-serif text-xl text-[#4a2b1d] mb-2">
                {plan.title}
              </h3>
              <div className="mb-3">
                <span className="text-2xl font-bold text-gold">
                  {plan.price}
                </span>
                <p className="text-xs text-[#7f482f]">
                  Deposit: {plan.deposit}
                </p>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-[#4a2b1d] text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2.5 rounded-lg font-semibold transition-all text-sm ${
                  plan.popular
                    ? "bg-gradient-gold text-white hover:opacity-90 shadow-gold"
                    : "border-2 border-[#7f482f] text-[#7f482f] hover:bg-[#7f482f] hover:text-white"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#7f482f] text-sm">
            💳 Payment accepted via Interac or Cash. Full balance due on the
            first day of service.
          </p>
        </div>
      </div>
    </section>
  );
}
