"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Zap,
  Headphones,
  TrendingUp,
  Sliders,
  Target,
  CheckCircle2,
  ShieldAlert
} from "lucide-react";

const whyUsCards = [
  {
    title: "Affordable & Transparent Pricing",
    description: "No hidden charges, surprise fees, or long-term lock-in contracts. Get maximum ROI for your investment.",
    icon: DollarSign,
    stat: "Zero Hidden Fees"
  },
  {
    title: "Lightning Fast Delivery",
    description: "We launch custom high-converting websites and ad campaigns in days, not months, so you start getting leads fast.",
    icon: Zap,
    stat: "7-14 Days Turnaround"
  },
  {
    title: "Dedicated Account Manager",
    description: "Direct WhatsApp and phone support with a dedicated growth manager. No dealing with automated bots or slow tickets.",
    icon: Headphones,
    stat: "1-on-1 Assistance"
  },
  {
    title: "Proven Data-Driven Results",
    description: "Every strategy is backed by live campaign data, continuous conversion tuning, and transparent weekly reporting.",
    icon: TrendingUp,
    stat: "4.8x Avg ROAS"
  },
  {
    title: "Custom Tailored Solutions",
    description: "We build bespoke strategies specifically tailored for your industry, budget, and local market competition.",
    icon: Sliders,
    stat: "100% Customized"
  },
  {
    title: "100% Business Growth Focused",
    description: "We prioritize revenue, phone calls, store visits, and qualified leads over vanity metrics like impressions.",
    icon: Target,
    stat: "High Intent Leads"
  }
];

export function WhyChooseUsSection() {
  return (
    <section id="why-choose-us" className="py-24 bg-white relative overflow-hidden">
      
      {/* Background Subtle Gradient Shape */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-50/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs uppercase font-extrabold tracking-widest text-brand-600 bg-red-100 px-3.5 py-1.5 rounded-full border border-brand-200">
              The Vishal Media Tech Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-4 tracking-tight">
              Why Businesses Choose <span className="red-gradient-text">Vishal Media Tech</span>
            </h2>
            <p className="text-gray-600 text-lg mt-3 font-normal">
              We combine cutting-edge technology, creative storytelling, and aggressive growth marketing to scale your enterprise.
            </p>
          </motion.div>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyUsCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-white p-8 rounded-3xl border border-gray-200/90 shadow-md hover:shadow-xl hover:border-brand-600/60 transition-all duration-300 relative group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/25 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-red-50 group-hover:text-brand-600 transition-colors">
                    {card.stat}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.description}
                </p>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Guaranteed Quality & Satisfaction</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
