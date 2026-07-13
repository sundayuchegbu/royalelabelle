"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Pricing from "@/components/sections/Pricing";
import Gallery from "@/components/sections/Gallery";
import Policy from "@/components/sections/Policy";
import Testimonials from "@/components/sections/Testimonials";
import BookingCTA from "@/components/sections/BookingCTA";
import BookingSection from "@/components/sections/BookingSection"; // Add this
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Hero />
        <About />
        <Services />
        <Pricing />
        <Gallery />
        {/* <Testimonials /> */}
        <Policy />
        <BookingSection /> {/* Add this */}
        <BookingCTA />
      </motion.div>

      <Footer />
    </main>
  );
}
