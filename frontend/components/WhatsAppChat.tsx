"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Phone, Mail, Clock } from "lucide-react";

interface WhatsAppChatProps {
  phoneNumber: string; // Format: 1234567890 (no +, no spaces)
  welcomeMessage?: string;
  position?: "bottom-right" | "bottom-left";
}

export default function WhatsAppChat({
  phoneNumber = "15485573218",
  welcomeMessage = "Hi there! 👋 How can I help you today?",
  position = "bottom-right",
}: WhatsAppChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  // Format phone number for WhatsApp
  const formattedPhone = phoneNumber.replace(/\D/g, ""); // Remove non-digits

  // Pre-defined quick replies
  const quickReplies = [
    { label: "Book Appointment", action: "I'd like to book an appointment" },
    { label: "Pricing", action: "Can you tell me about your pricing?" },
    { label: "Gallery", action: "Can I see more of your work?" },
    { label: "Location", action: "Where are you located?" },
    { label: "Hours", action: "What are your business hours?" },
  ];

  const handleSendMessage = () => {
    const text = message || welcomeMessage;
    const encodedMessage = encodeURIComponent(text);
    window.open(
      `https://wa.me/${formattedPhone}?text=${encodedMessage}`,
      "_blank",
    );
    setIsOpen(false);
    setMessage("");
  };

  const handleQuickReply = (action: string) => {
    const encodedMessage = encodeURIComponent(action);
    window.open(
      `https://wa.me/${formattedPhone}?text=${encodedMessage}`,
      "_blank",
    );
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && message.trim()) {
      handleSendMessage();
    }
  };

  // Auto-open after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      setTimeout(() => setIsOpen(false), 5000);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        position === "bottom-right" ? "bottom-6 right-6" : "bottom-6 left-6"
      }`}
    >
      {/* Chat Bubble */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-[#25D366] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  Chat with us
                </h3>
                <p className="text-white/80 text-xs">
                  Typically replies in minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {/* Welcome Message */}
            <div className="flex items-start gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center text-sm flex-shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3 max-w-[85%]">
                <p className="text-sm text-gray-800">{welcomeMessage}</p>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Quick Replies */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Quick replies:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply.action)}
                    className="text-xs bg-[#f0fdf4] border border-[#86efac] text-[#166534] px-3 py-1.5 rounded-full hover:bg-[#dcfce7] transition-colors"
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Business Info */}
            <div className="border-t border-gray-100 pt-3 mt-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Mon-Sat: 9AM - 7PM</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Phone className="w-3 h-3" />
                <a href="tel:+16464007132" className="hover:text-[#25D366]">
                  (646) 400-7132
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Mail className="w-3 h-3" />
                <a
                  href="mailto:info@royallabelle.com"
                  className="hover:text-[#25D366]"
                >
                  info@royallabelle.com
                </a>
              </div>
            </div>

            {/* Input */}
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-transparent outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  message.trim()
                    ? "bg-[#25D366] text-white hover:bg-[#1da851]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative group transition-all duration-300 ${
          isHovered ? "scale-110" : "scale-100"
        }`}
      >
        {/* Pulse Animation */}
        <div
          className={`absolute inset-0 bg-[#25D366] rounded-full opacity-75 animate-ping ${
            !isOpen ? "block" : "hidden"
          }`}
        />

        {/* Main Button */}
        <div
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors ${
            isOpen
              ? "bg-gray-700 hover:bg-gray-800"
              : "bg-[#25D366] hover:bg-[#1da851]"
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-7 h-7 text-white" />
          )}
        </div>

        {/* Tooltip */}
        {!isOpen && !isHovered && (
          <div className="absolute bottom-16 right-0 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
            Chat with us 💬
            <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-gray-800 transform rotate-45" />
          </div>
        )}
      </button>
    </div>
  );
}
