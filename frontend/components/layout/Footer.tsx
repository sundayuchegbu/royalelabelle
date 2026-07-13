"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#4a2b1d] text-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl mb-4">
              Locs by Royale la'belle
            </h3>

            <p className="text-sm leading-relaxed text-[#d4a691]">
              AMP Certified Micro Locs and Natural Hair Specialist dedicated to
              helping you start and maintain healthy, beautiful locs.
            </p>

            <div className="mt-4 flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#d4a691] transition-colors hover:text-[#c48d2c]"
              >
                <FaInstagram className="h-5 w-5" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#d4a691] transition-colors hover:text-[#c48d2c]"
              >
                <FaFacebook className="h-5 w-5" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-[#d4a691] transition-colors hover:text-[#c48d2c]"
              >
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>

            <ul className="space-y-2">
              <li>
                <Link
                  href="#about"
                  className="text-sm text-[#d4a691] transition-colors hover:text-[#c48d2c]"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="#services"
                  className="text-sm text-[#d4a691] transition-colors hover:text-[#c48d2c]"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  href="#pricing"
                  className="text-sm text-[#d4a691] transition-colors hover:text-[#c48d2c]"
                >
                  Pricing
                </Link>
              </li>

              <li>
                <Link
                  href="#gallery"
                  className="text-sm text-[#d4a691] transition-colors hover:text-[#c48d2c]"
                >
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Contact</h4>

            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#c48d2c]" />

                <span className="text-sm text-[#d4a691]">
                  735 Liberty Avenue
                  <br />
                  Brooklyn, NY 11208
                </span>
              </li>

              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-[#c48d2c]" />

                <a
                  href="tel:6464007132"
                  className="text-sm text-[#d4a691] transition-colors hover:text-[#c48d2c]"
                >
                  (646) 400-7132
                </a>
              </li>

              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-[#c48d2c]" />

                <a
                  href="mailto:info@locsbyhairarena.com"
                  className="text-sm text-[#d4a691] transition-colors hover:text-[#c48d2c]"
                >
                  info@royalelabelle.com
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Business Hours</h4>

            <ul className="space-y-2 text-sm text-[#d4a691]">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 7:00 PM</span>
              </li>

              <li className="flex justify-between">
                <span>Saturday</span>
                <span>9:00 AM - 5:00 PM</span>
              </li>

              <li className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#7f482f] pt-8 text-center">
          <p className="text-sm text-[#d4a691]">
            © {currentYear} Royale la'belle. All rights reserved. | AMP
            Certified
          </p>
        </div>
      </div>
    </footer>
  );
}
