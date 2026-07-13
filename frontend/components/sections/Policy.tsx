"use client";

import { useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import {
  ChevronDown,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";

export default function Policy() {
  const [openSection, setOpenSection] = useState<number | null>(0);

  const policies = [
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Consultation & Booking",
      content: [
        "A virtual consultation is required to book micro locs services.",
        "Consultation lasts for 30 days.",
        "Your hair must be at least 4 inches all over your head to book.",
      ],
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Deposit & Payment",
      content: [
        "$200 deposit required to secure installation date.",
        "$300 deposit for Interlocking services.",
        "Deposit is non-refundable but transferable if rescheduled within 7 days.",
        "Deposit goes towards your final balance.",
        "Full balance is due on the first day of service.",
        "Payments are not refundable after service has been rendered.",
      ],
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Rescheduling & Cancellation",
      content: [
        "New installation can be rescheduled once within the same month.",
        "Reschedule must be made at least 7 days prior to appointment.",
        "Failure to reschedule within 7 days results in deposit forfeiture.",
        "Retie or Repair appointments require new deposit for rescheduling.",
      ],
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Lateness Policy",
      content: [
        "Call or text when running late.",
        "$20 late fee charged if 15 minutes late.",
        "20 minutes delay results in reschedule for next available opening.",
        "Any deposits made will be forfeited for excessive lateness.",
      ],
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Location & Guests",
      content: [
        "Located at 735 Liberty Avenue, Brooklyn, NY 11208.",
        "Between Liberty and Linwood in East New York.",
        "No extra guests allowed due to limited space.",
        "Please come alone to your appointment.",
      ],
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Squeeze-In Appointments",
      content: [
        "Call or text (646) 400-7132 for squeeze-in appointments.",
        "A $50 extra fee is required for squeeze-in services.",
      ],
    },
  ];

  return (
    <section id="policy" className="py-20 bg-[#fdf8f6]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <SectionHeading
          subtitle="Booking Policy"
          title="Important Information"
          description="Before booking your appointment, please read the full booking policy carefully."
        />

        <div className="bg-white rounded-2xl shadow-luxury overflow-hidden">
          {policies.map((policy, index) => (
            <div
              key={index}
              className="border-b border-[#f6ede8] last:border-b-0"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#fdf8f6] transition-colors"
                onClick={() =>
                  setOpenSection(openSection === index ? null : index)
                }
              >
                <div className="flex items-center space-x-3">
                  <span className="text-[#c48d2c]">{policy.icon}</span>
                  <span className="font-semibold text-[#4a2b1d]">
                    {policy.title}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[#7f482f] transition-transform duration-300 ${
                    openSection === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === index && (
                <div className="px-6 pb-4 animate-slideDown">
                  <ul className="space-y-2">
                    {policy.content.map((item, i) => (
                      <li
                        key={i}
                        className="text-[#7f482f] text-sm flex items-start space-x-2"
                      >
                        <span className="text-[#c48d2c]">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#7f482f] italic">
            Proceeding to book an appointment means you've read and agreed to
            all terms and conditions in the booking policy.
          </p>
        </div>
      </div>
    </section>
  );
}
