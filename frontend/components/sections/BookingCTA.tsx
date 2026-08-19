"use client";

import Button from "../ui/Button";
import { Calendar, Mail } from "lucide-react";

export default function BookingCTA() {
  return (
    <section className="py-20 bg-gradient-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern.png')] bg-repeat" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">
            Ready to Start Your Locs Journey?
          </h2>
          <p className="text-xl text-[#d4a691] mb-8">
            Book your consultation today and let's create beautiful, healthy
            locs together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="gold"
              size="lg"
              onClick={() => (window.location.href = "#booking")}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Your Appointment
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
              onClick={() =>
                (window.location.href = "mailto:royale.labelle@gmail.com")
              }
            >
              <Mail className="w-5 h-5 mr-2" />
              royale.labelle@gmail.com
            </Button>
          </div>
          <p className="mt-6 text-[#d4a691] text-sm">
            Virtual consultations available • Serving Kitchener, Ontario
          </p>
        </div>
      </div>
    </section>
  );
}
