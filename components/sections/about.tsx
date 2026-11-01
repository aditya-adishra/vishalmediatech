"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  TrendingUp,
  Target
} from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      
      {/* Red Ambient Glow */}
      <div className="red-glow-orb top-10 left-0 w-96 h-96 bg-brand-600/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Left Column: Founder Spotlight Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            {/* Card Glass Wrapper */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white p-6 sm:p-10 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
              
              {/* Top Badge */}
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-brand-400 bg-brand-500/20 px-3 py-1.5 rounded-full border border-brand-500/30 mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Founder & Chief Meta Ads Strategist
              </span>

              {/* Founder Avatar & Title */}
              <div className="flex items-center gap-4 sm:gap-5 mb-6">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-red-500 flex items-center justify-center text-white font-extrabold text-xl sm:text-2xl shadow-xl shadow-brand-600/40 border-2 border-white/20">
                    VJ
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 border-2 border-gray-900 flex items-center justify-center text-white text-[10px] font-bold">
                    ✓
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">Vishal Jaiswal</h3>
                  <p className="text-xs font-bold text-brand-400 mt-0.5">
                    Meta Ads & Growth Specialist
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>4+ Years Industry Experience</span>
                  </p>
                </div>
              </div>

              {/* Personal Mission Quote */}
              <blockquote className="text-gray-300 text-xs sm:text-sm italic leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10 mb-6">
                "My mission is simple: Help local businesses in Gorakhpur, Khalilabad, Basti & Purvanchal achieve predictable monthly revenue through targeted Meta Ads & high-converting websites."
              </blockquote>

              {/* Key Credentials Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-800 text-xs font-bold">
                <div className="p-3 rounded-xl bg-gray-800/80">
                  <span className="text-brand-400 block text-base sm:text-lg font-extrabold">4+ Years</span>
                  <span className="text-gray-400 text-[11px]">Meta Ads Mastery</span>
                </div>
                <div className="p-3 rounded-xl bg-gray-800/80">
                  <span className="text-emerald-400 block text-base sm:text-lg font-extrabold">₹1.5 Cr+</span>
                  <span className="text-gray-400 text-[11px]">Ad Spend Managed</span>
                </div>
              </div>

              {/* Office Location Badge */}
              <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Office: Khalilabad, Sant Kabir Nagar (Gorakhpur Region, UP)</span>
              </div>

            </div>
          </motion.div>

          {/* Right Column: Agency Story & Regional Trust */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 space-y-4 sm:space-y-6"
          >
            <div className="inline-block max-w-full">
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs uppercase font-extrabold tracking-wider sm:tracking-widest text-brand-600 bg-red-100 px-3 py-1.5 rounded-full border border-brand-200 leading-tight max-w-full text-center">
                Gorakhpur & Purvanchal's Premier Agency
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight sm:leading-tight">
              Driven by Real Results, Built for <span className="red-gradient-text">Local Business Growth</span>
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Founded by <strong>Vishal Jaiswal</strong> in <strong>Khalilabad (Sant Kabir Nagar)</strong>, Vishal Media Tech was established to give local businesses in Gorakhpur, Basti, Deoria, Azamgarh, and Siddharthnagar access to enterprise-grade digital marketing and high-converting website engineering.
            </p>

            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              We specialize in <strong>Meta Ads (Facebook & Instagram lead ads)</strong>, <strong>Google Search PPC</strong>, and <strong>custom Next.js website design</strong> tailored to convert local WhatsApp and phone leads.
            </p>

            {/* 4 Trust Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                  <Target className="w-4 h-4 text-brand-600" />
                  <span>Gorakhpur Area Expertise</span>
                </div>
                <p className="text-xs text-gray-600">Deep understanding of Purvanchal consumer behavior and local audience targeting.</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                  <span>High-ROAS Meta Ads</span>
                </div>
                <p className="text-xs text-gray-600">Tested ad creative strategies refined over 4+ years of running profitable ad campaigns.</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                  <Phone className="w-4 h-4 text-brand-600" />
                  <span>Direct Founder Access</span>
                </div>
                <p className="text-xs text-gray-600">Direct phone & WhatsApp contact with Vishal Jaiswal at +91 8655957779.</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span>Transparent Weekly Reports</span>
                </div>
                <p className="text-xs text-gray-600">Full visibility into cost-per-lead, ad spend, and campaign ROI.</p>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="tel:+918655957779"
                className="px-6 py-3.5 rounded-2xl bg-brand-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-brand-600/30 hover:bg-brand-700 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Vishal Jaiswal: 8655957779</span>
              </a>

              <a
                href="https://wa.me/918655957779"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                <span>WhatsApp Strategy Chat</span>
              </a>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
