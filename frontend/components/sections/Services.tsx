"use client";

import SectionHeading from "../ui/SectionHeading";
import { Scissors, Sparkles, RefreshCw, Wrench } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Scissors className="w-8 h-8" />,
      title: "Micro Locs Installation",
      description:
        "Start your loc journey with professional installation using your preferred method - Twist, Braids, or Interlocking.",
      methods: ["Twist Method", "Braids Method", "Interlocking Method"],
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Reties & Maintenance",
      description:
        "Keep your locs looking fresh with regular reties and professional maintenance services.",
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Repairs & Restoration",
      description:
        "Expert repair services for damaged locs, thinning areas, and loc restoration.",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Natural Hair Care",
      description:
        "Comprehensive natural hair care services including deep conditioning and scalp treatments.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-[#fdf8f6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="What I Offer"
          title="Premium Locs Services"
          description="Professional loc services tailored to your unique hair needs and goals."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="bg-white p-8 rounded-2xl shadow-luxury hover:shadow-2xl transition-shadow duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="font-serif text-2xl text-[#4a2b1d] mb-3">
                {service.title}
              </h3>
              <p className="text-[#7f482f] leading-relaxed mb-4">
                {service.description}
              </p>
              {service.methods && (
                <div className="flex flex-wrap gap-2">
                  {service.methods.map((method) => (
                    <span
                      key={method}
                      className="bg-[#fdf8f6] text-[#7f482f] px-3 py-1 rounded-full text-sm"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
