"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles, Rocket } from "lucide-react";

export function CTABannerSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-brand-600 via-red-600 to-brand-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          
          {/* Background Decorative Blur Spheres */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text Block */}
          <div className="relative z-10 max-w-2xl text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Limited Availability - Accept 5 New Clients This Month</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready To Scale Your Business Online?
            </h2>

            <p className="text-red-100 text-base sm:text-lg font-normal leading-relaxed">
              Stop losing customers to competitors. Partner with Vishal Media Tech to build high-converting websites and scalable ad campaigns.
            </p>
          </div>

          {/* Right Button Group */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-brand-700 font-extrabold text-base shadow-xl hover:bg-red-50 hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 text-center"
            >
              <Rocket className="w-5 h-5 text-brand-600" />
              <span>Get Started Today</span>
            </a>

            <a
              href="https://wa.me/919876543210?text=Hi%20Vishal%20Media%20Tech,%20I%20want%20to%20grow%20my%20business%20online!"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 text-white font-extrabold text-base shadow-xl hover:bg-emerald-600 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 text-center"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>WhatsApp Us</span>
            </a>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
