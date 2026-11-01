"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Code,
  Layout,
  Search,
  Share2,
  Megaphone,
  Palette,
  MessageSquare,
  Bot,
  MousePointerClick,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { useAgencyContext } from "@/lib/agency-context";

const iconMap: Record<string, any> = {
  Code,
  Layout,
  Search,
  Share2,
  Megaphone,
  Palette,
  MessageSquare,
  Bot,
  MousePointerClick
};

export function ServicesSection() {
  const { services } = useAgencyContext();

  return (
    <section id="services" className="py-24 bg-gray-50 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="red-glow-orb top-1/3 left-0 w-80 h-80 bg-brand-600/10 pointer-events-none" />
      <div className="red-glow-orb bottom-10 right-0 w-96 h-96 bg-brand-600/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-widest text-brand-600 bg-red-100/80 border border-brand-200 px-4 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Comprehensive Digital Growth
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-4 tracking-tight">
              Our <span className="red-gradient-text">Services</span>
            </h2>
            <p className="text-gray-600 text-lg mt-3 font-normal">
              Everything your business needs to establish dominance, capture leads, and grow revenue online.
            </p>
          </motion.div>
        </div>

        {/* Services 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.iconName] || Code;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-md hover:shadow-xl hover:border-brand-600/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Subtle Red Gradient Hover Border Highlight */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Badge & Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Icon className="w-7 h-7" />
                    </div>
                    {service.badge && (
                      <span className="text-xs font-bold text-brand-700 bg-red-100/90 border border-brand-200 px-3 py-1 rounded-full">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors flex items-center justify-between">
                    <span>{service.title}</span>
                    <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-600 shrink-0" />
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Features List */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2 border-t border-gray-100 pt-4">
                      {service.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action Link */}
                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href="#contact"
                    className="text-xs font-bold text-brand-600 group-hover:text-brand-700 flex items-center gap-1 hover:underline"
                  >
                    Get Custom Quote & Strategy →
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
