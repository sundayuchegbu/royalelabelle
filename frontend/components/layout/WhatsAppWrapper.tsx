"use client";

import { useState, useEffect } from "react";
import WhatsAppChat from "../WhatsAppChat";

export default function WhatsAppWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <WhatsAppChat
      phoneNumber="15485573218"
      welcomeMessage="Hi there! 👋 Welcome to Royale la'belle! How can I help you with your loc journey today?"
      position="bottom-right"
    />
  );
}
