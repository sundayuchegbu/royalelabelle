"use client";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center" | "right";
}

export default function SectionHeading({
  subtitle,
  title,
  description,
  className,
  align = "center",
}: SectionHeadingProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={cn("mb-12", alignClasses[align], className)}>
      {subtitle && (
        <p className="text-[#c48d2c] font-semibold tracking-wider uppercase text-sm mb-2">
          {subtitle}
        </p>
      )}
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#4a2b1d] mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-[#7f482f] text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
      <div className="w-24 h-1 bg-gradient-gold rounded-full mx-auto mt-4" />
    </div>
  );
}
