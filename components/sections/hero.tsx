"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  TrendingUp,
  Star,
  CheckCircle2,
  Phone,
  MapPin
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-50 via-red-50/30 to-slate-50">
      
      {/* Background Red Glow Orbs */}
      <div className="red-glow-orb top-0 right-1/4 w-[32rem] h-[32rem] bg-brand-600/10 pointer-events-none" />
      <div className="red-glow-orb bottom-0 left-1/4 w-[28rem] h-[28rem] bg-brand-600/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Top Local Trust Pill */}
            <div className="inline-flex items-center gap-2 bg-red-100/90 border border-brand-200 px-4 py-2 rounded-full shadow-sm text-brand-700 text-xs font-extrabold uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-brand-600 animate-pulse" />
              <span>Gorakhpur & Purvanchal's #1 Meta Ads Agency</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
              Grow Your Business With <span className="red-gradient-text">High-ROAS Meta Ads</span> & Custom Websites
            </h1>

            {/* Sub-headline with Founder Credibility */}
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Founded by <strong>Vishal Jaiswal</strong> (4+ years Meta Ads specialist in <strong>Khalilabad, Sant Kabir Nagar</strong>). We turn ad budget into verified phone calls, WhatsApp leads, and high-margin sales for businesses in Gorakhpur and surrounding regions.
            </p>

            {/* 3 Value Pillars Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-gray-200/90 text-xs font-bold text-gray-800 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>4+ Yrs Meta Ads Exp</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-gray-200/90 text-xs font-bold text-gray-800 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Gorakhpur Local Support</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-gray-200/90 text-xs font-bold text-gray-800 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Guaranteed Qualified Leads</span>
              </div>
            </div>

            {/* Call To Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="tel:+918655957779"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-600 text-white font-extrabold text-sm shadow-xl shadow-brand-600/30 hover:bg-brand-700 hover:shadow-2xl hover:shadow-brand-600/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Vishal Jaiswal: 8655957779</span>
              </a>

              <a
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-gray-900 border-2 border-gray-200 font-extrabold text-sm shadow-md hover:border-brand-600 hover:text-brand-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Book Free Strategy Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Social Trust Line */}
            <div className="pt-6 border-t border-gray-200/80 flex items-center justify-center lg:justify-start gap-4 text-xs text-gray-500 font-medium">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Client" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Client" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80" alt="Client" />
              </div>
              <div>
                <span className="font-bold text-gray-900">50+ Local Businesses Trusted</span>
                <span className="block text-[11px] text-gray-500">Gorakhpur • Khalilabad • Basti • Deoria</span>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Interactive Local Performance Metric Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Glowing Backdrop behind Glass Card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/30 to-red-500/20 rounded-3xl blur-2xl pointer-events-none" />

            <div className="relative bg-white/95 backdrop-blur-xl border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              
              {/* Header Box */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md">
                    VJ
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base">Vishal Jaiswal</h3>
                    <p className="text-xs text-brand-600 font-bold">HQ: Khalilabad (Gorakhpur Region)</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full">
                  ● Live Ad Results
                </span>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-red-50/80 border border-red-100">
                  <span className="text-xs font-bold text-gray-500 block uppercase tracking-wider">Meta Ads Experience</span>
                  <span className="text-2xl font-black text-brand-600 block mt-1">4+ Years</span>
                  <span className="text-[10px] font-bold text-gray-600">Facebook & IG Ads</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100">
                  <span className="text-xs font-bold text-gray-500 block uppercase tracking-wider">Client ROAS Avg</span>
                  <span className="text-2xl font-black text-emerald-600 block mt-1">4.8x</span>
                  <span className="text-[10px] font-bold text-gray-600">Verified Revenue</span>
                </div>
              </div>

              {/* Direct Founder Contact Box */}
              <div className="p-4 rounded-2xl bg-gray-950 text-white space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Direct Support
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Sant Kabir Nagar, UP</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-medium">
                  "Call me directly on <strong>8655957779</strong> to discuss your ad strategy for Gorakhpur & Purvanchal market dominance."
                </p>
                <div className="pt-1 border-t border-gray-800 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Email: vishalmediatech@gmail.com</span>
                  <span className="text-emerald-400 font-bold">Online</span>
                </div>
              </div>

            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
