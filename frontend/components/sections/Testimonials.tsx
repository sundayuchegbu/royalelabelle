"use client";

import SectionHeading from "../ui/SectionHeading";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah M.",
      location: "Brooklyn, NY",
      text: "Zainab is absolutely amazing! She transformed my hair into beautiful locs. Her attention to detail and care for my hair health is unmatched. I'm so grateful for her expertise.",
      rating: 5,
    },
    {
      name: "Jessica R.",
      location: "Queens, NY",
      text: "I've been getting my locs maintained by Zainab for over 2 years now. She's professional, knowledgeable, and truly cares about her clients. Highly recommend!",
      rating: 5,
    },
    {
      name: "Michael T.",
      location: "Manhattan, NY",
      text: "As someone new to locs, Zainab made the process easy and enjoyable. She explained everything clearly and made sure I was comfortable throughout. Best decision ever!",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Testimonials"
          title="What My Clients Say"
          description="Real stories from real clients who trusted me with their loc journey."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#fdf8f6] p-8 rounded-2xl relative hover:shadow-luxury transition-shadow"
            >
              <Quote className="w-8 h-8 text-[#c48d2c] opacity-30 absolute top-4 right-4" />
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-[#c48d2c] fill-current"
                  />
                ))}
              </div>
              <p className="text-[#4a2b1d] leading-relaxed mb-4 italic">
                "{testimonial.text}"
              </p>
              <div>
                <p className="font-semibold text-[#4a2b1d]">
                  {testimonial.name}
                </p>
                <p className="text-sm text-[#7f482f]">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
