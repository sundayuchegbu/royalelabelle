"use client";

import Image from "next/image";
import SectionHeading from "../ui/Button"; // Fix: This should be SectionHeading
// Let's fix this import
import SectionHeadingComponent from "../ui/SectionHeading";
import { Award, Heart, Sparkles, Users } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Award className="w-6 h-6 text-gold" />,
      title: "AMP Certified",
      description:
        "Certified micro locs specialist with advanced training and expertise.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-gold" />,
      title: "Natural Hair Expert",
      description:
        "Specializing in natural hair care and healthy loc maintenance.",
    },
    {
      icon: <Heart className="w-6 h-6 text-gold" />,
      title: "Passionate Care",
      description:
        "Dedicated to helping you achieve your hair goals with love and care.",
    },
    {
      icon: <Users className="w-6 h-6 text-gold" />,
      title: "Client-Centered",
      description:
        "Every client receives personalized attention and customized solutions.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-luxury">
              <div className="absolute inset-0 bg-linear-to-tr from-[#4a2b1d] to-transparent opacity-20" />
              <div className="w-full h-full bg-[#f6ede8] flex items-center justify-center">
                {/* Replace with your actual image */}
                {/* {/* <div className="text-[#7f482f] text-center p-8"> */}
                {/* <Award className="w-24 h-24 mx-auto mb-4" /> */}
                {/* <p className="font-serif text-2xl">Zainab</p> */}
                {/* <p className="text-sm">Your Hair Specialist</p> */}
                {/* </div> */} */
                <Image
                  src="/pq.jpg"
                  alt="peaceQueen - Your Hair Specialist"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
            {/* Decorative Badge */}
            <div className="absolute -bottom-4 -right-4 bg-gradient-gold text-white px-6 py-3 rounded-lg shadow-lg">
              <p className="font-semibold">8+ Years</p>
              <p className="text-xs opacity-90">of Excellence</p>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <SectionHeadingComponent
              subtitle="About Me"
              title="Your Trusted Micro Locs Specialist"
              description="Hello beautiful! I'm Zainab, an AMP certified Micro Locs and natural hair specialist."
              align="left"
              className="mb-8"
            />

            <p className="text-[#7f482f] leading-relaxed mb-6">
              Whether you are just about to start or you are already on your
              locs journey, my goal is to help you start and maintain healthy
              and beautiful locs. I believe every client deserves personalized
              care and attention to detail.
            </p>

            <p className="text-[#7f482f] leading-relaxed mb-8">
              With over 8 years of experience and AMP certification, I bring
              expertise, passion, and precision to every appointment. Your hair
              health and satisfaction are my top priorities.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 bg-[#fdf8f6] rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    {feature.icon}
                    <h4 className="font-semibold text-[#4a2b1d]">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="text-sm text-[#7f482f]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
