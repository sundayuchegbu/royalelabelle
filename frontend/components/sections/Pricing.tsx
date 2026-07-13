"use client";

import SectionHeading from "../ui/SectionHeading";
import { Check } from "lucide-react";

export default function Pricing() {
  const pricingData = [
    {
      title: "Micro Locs Twist",
      price: "$1,000",
      deposit: "$200",
      features: [
        "Professional twist installation",
        "AMP certified technique",
        "Customized for your hair type",
        "Post-installation care guide",
      ],
      popular: false,
    },
    {
      title: "Micro Locs Braids",
      price: "$1,200",
      deposit: "$200",
      features: [
        "Professional braid installation",
        "AMP certified technique",
        "Customized for your hair type",
        "Post-installation care guide",
        "Bonus: Maintenance tips",
      ],
      popular: true,
    },
    {
      title: "Micro Locs Interlocking",
      price: "$1,600",
      deposit: "$300",
      features: [
        "Professional interlocking installation",
        "AMP certified technique",
        "Customized for your hair type",
        "Post-installation care guide",
        "Bonus: Maintenance tips",
        "Premium interlocking method",
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Pricing"
          title="Investment in Your Beauty"
          description="Prices vary based on length, density, texture, and method. A virtual consultation is required for exact pricing."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingData.map((plan) => (
            <div
              key={plan.title}
              className={`relative bg-[#fdf8f6] rounded-2xl p-8 transition-all duration-300 ${
                plan.popular
                  ? "shadow-2xl border-2 border-[#c48d2c] transform -translate-y-4"
                  : "shadow-luxury hover:shadow-2xl"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-gold text-white px-6 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="font-serif text-2xl text-[#4a2b1d] mb-2">
                {plan.title}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-[#c48d2c]">
                  {plan.price}
                </span>
                <p className="text-sm text-[#7f482f]">
                  Deposit: {plan.deposit}
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-[#c48d2c] flex-shrink-0 mt-0.5" />
                    <span className="text-[#4a2b1d] text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
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
            💳 Payment accepted via Zelle or Cash. Full balance due on the first
            day of service.
          </p>
        </div>
      </div>
    </section>
  );
}
