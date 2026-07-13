"use client";

import { useEffect, useRef } from "react";
import Button from "../ui/Button";
import { Calendar, ChevronDown } from "lucide-react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { left, top, width, height } =
        heroRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;

      heroRef.current.style.setProperty("--mouse-x", `${x * 100}%`);
      heroRef.current.style.setProperty("--mouse-y", `${y * 100}%`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), #9a5a3e 0%, #4a2b1d 70%)",
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#c48d2c] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#c48d2c] rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
            {/* <p className="text-[#c48d2c] font-semibold text-sm tracking-widest">
              🌟 AMP Certified Micro Locs Specialist
            </p> */}
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold mb-6 leading-tight">
            Hello Beautiful,
            <br />
            <span className="text-gradient">Welcome to Royale la'belle</span>
          </h1>

          <p className="text-xl md:text-2xl text-[#f6ede8] mb-8 leading-relaxed max-w-2xl mx-auto">
            My name is{" "}
            <span className="text-[#c48d2c] font-semibold">PeaceQueen</span>,
            and I'm here to help you start and maintain healthy, beautiful locs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="gold"
              size="lg"
              className="group"
              onClick={() => (window.location.href = "#booking")}
            >
              <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform cursor-pointer" />
              Book Your Consultation
            </Button>
            <Button
              onClick={() => (window.location.href = "#about")}
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 cursor-pointer"
            >
              Learn More
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { label: "Happy Clients", value: "500+" },
              { label: "Years Experience", value: "8+" },
              { label: "Certified Specialist", value: "AMP" },
              { label: "Locs Installed", value: "1000+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-[#d4a691] text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/50" />
      </div>
    </section>
  );
}
