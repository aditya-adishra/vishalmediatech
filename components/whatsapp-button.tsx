"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const whatsappNumber = "918655957779";
  const defaultMessage = encodeURIComponent(
    "Hello Vishal Jaiswal! I visited your website and would like a free consultation & Meta Ads quote for my business."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:p-4 rounded-full shadow-2xl shadow-emerald-600/40 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-2 group border-2 border-white/20"
      aria-label="Chat with Vishal Jaiswal on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
      <span className="hidden sm:inline-block text-xs font-extrabold pr-1">
        WhatsApp Vishal Jaiswal
      </span>

      {/* Online Notification Pulse Badge */}
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-white"></span>
      </span>
    </a>
  );
}
