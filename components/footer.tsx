"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUp, ShieldCheck, Heart, Sparkles } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-950 text-white pt-20 pb-10 border-t border-gray-800 relative overflow-hidden">
      
      {/* Glow Backdrop */}
      <div className="red-glow-orb bottom-0 right-0 w-[30rem] h-[30rem] bg-brand-600/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-gray-800">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-red-500 flex items-center justify-center font-black text-xl text-white shadow-md">
                V
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight block leading-none">
                  VISHAL <span className="text-brand-500">MEDIA TECH</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-400 block mt-1">
                  Gorakhpur & Purvanchal Growth Agency
                </span>
              </div>
            </Link>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Founded by <strong>Vishal Jaiswal</strong> (4+ years Meta Ads experience), we help businesses in <strong>Gorakhpur, Khalilabad, Basti, Deoria & Purvanchal</strong> scale revenue through high-ROAS Meta Ads and high-converting website engineering.
            </p>

            <div className="space-y-2 pt-2 text-xs font-medium text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Office: Khalilabad, Sant Kabir Nagar (Gorakhpur Region, UP)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                <a href="tel:+918655957779" className="hover:text-brand-400 font-bold">+91 8655957779</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <a href="mailto:vishalmediatech@gmail.com" className="hover:text-brand-400">vishalmediatech@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Our Services</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#services" className="hover:text-brand-400 transition-colors">Meta Ads (FB/IG) Lead Gen</a></li>
              <li><a href="#services" className="hover:text-brand-400 transition-colors">Custom Website Development</a></li>
              <li><a href="#services" className="hover:text-brand-400 transition-colors">High-Converting Landing Pages</a></li>
              <li><a href="#services" className="hover:text-brand-400 transition-colors">Google Ads (PPC)</a></li>
              <li><a href="#services" className="hover:text-brand-400 transition-colors">Google Local SEO (Gorakhpur)</a></li>
              <li><a href="#services" className="hover:text-brand-400 transition-colors">WhatsApp Automation & Chatbots</a></li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#why-choose-us" className="hover:text-brand-400 transition-colors">Why Choose Us</a></li>
              <li><a href="#portfolio" className="hover:text-brand-400 transition-colors">Portfolio & Case Studies</a></li>
              <li><a href="#photo-gallery" className="hover:text-brand-400 transition-colors">Photo Marquee</a></li>
              <li><a href="#video-showcase" className="hover:text-brand-400 transition-colors">YouTube Videos</a></li>
              <li><a href="#testimonials" className="hover:text-brand-400 transition-colors">Client Reviews</a></li>
              <li><a href="#about" className="hover:text-brand-400 transition-colors">About Vishal Jaiswal</a></li>
              <li><a href="/admin/login" className="text-brand-400 font-bold hover:underline">Admin Login Portal</a></li>
            </ul>
          </div>

          {/* Col 4: Service Areas */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">Local Service Areas</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>• Khalilabad & Sant Kabir Nagar</li>
              <li>• Gorakhpur City & Region</li>
              <li>• Basti & Harraiya</li>
              <li>• Deoria & Kushinagar</li>
              <li>• Siddharthnagar & Azamgarh</li>
              <li>• Entire Purvanchal Business Belt</li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <p>© 2026 Vishal Media Tech. All rights reserved. Managed by Vishal Jaiswal.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-brand-600 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
