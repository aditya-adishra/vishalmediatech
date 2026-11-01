"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X, ArrowRight, ShieldCheck, MapPin } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Why Choose Us", href: "#why-choose-us" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Photo Gallery", href: "#photo-gallery" },
    { name: "Video Showcase", href: "#video-showcase" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "About Founder", href: "#about" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <>
      {/* Top Banner Bar for Local Trust & Direct Support */}
      <div className="bg-gray-950 text-white text-xs py-2 px-4 border-b border-gray-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-gray-300">
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              <span>Office: Khalilabad, Sant Kabir Nagar (Near Gorakhpur, UP)</span>
            </span>
            <span className="text-gray-600">|</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Gorakhpur & Purvanchal's #1 Meta Ads Agency
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+918655957779"
              className="hover:text-brand-400 transition-colors font-bold text-white flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 text-brand-500" />
              <span>+91 8655957779</span>
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="mailto:vishalmediatech@gmail.com"
              className="hover:text-brand-400 transition-colors text-gray-300"
            >
              vishalmediatech@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-effect shadow-lg py-3 bg-white/90 border-b border-gray-200/80"
            : "bg-white py-4 border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-red-500 flex items-center justify-center font-black text-xl text-white shadow-md shadow-brand-600/30 group-hover:scale-105 transition-transform">
              V
            </div>
            <div>
              <span className="text-xl font-black text-gray-900 tracking-tight block leading-none">
                VISHAL <span className="red-gradient-text">MEDIA TECH</span>
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-brand-600 block mt-0.5">
                Khalilabad • Gorakhpur Region
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-bold text-gray-700 hover:text-brand-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="tel:+918655957779"
              className="px-4 py-2.5 rounded-2xl bg-red-50 border border-brand-200 text-brand-600 font-bold text-xs hover:bg-brand-600 hover:text-white transition-all flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>8655957779</span>
            </a>

            <a
              href="#contact"
              className="px-5 py-2.5 rounded-2xl bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-600/20 hover:bg-brand-700 hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <span>Book Strategy Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-2xl bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-brand-600 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-4 pb-6 space-y-3 shadow-2xl">
            <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-xs font-bold text-brand-700 mb-2">
              📍 Office: Khalilabad, Sant Kabir Nagar (Gorakhpur)
              <br />
              📞 Call: +91 8655957779
            </div>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-gray-800 hover:text-brand-600 py-2 border-b border-gray-100"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="tel:+918655957779"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-2xl bg-brand-600 text-white font-bold text-xs text-center shadow-md flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call +91 8655957779</span>
              </a>
              <a
                href="https://wa.me/918655957779"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs text-center shadow-md flex items-center justify-center gap-2"
              >
                <span>WhatsApp Vishal Jaiswal</span>
              </a>
            </div>
          </div>
        )}

      </header>
    </>
  );
}
