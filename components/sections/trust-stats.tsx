"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, ShieldCheck, Users, Headphones, Trophy } from "lucide-react";

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

function Counter({ end, suffix = "", duration = 2 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const statsData = [
  {
    icon: Trophy,
    number: 100,
    suffix: "+",
    label: "Projects Delivered",
    subtext: "High Converting Websites & Ad Campaigns"
  },
  {
    icon: Users,
    number: 50,
    suffix: "+",
    label: "Happy Clients",
    subtext: "Across India & Global Markets"
  },
  {
    icon: ShieldCheck,
    number: 95,
    suffix: "%",
    label: "Client Satisfaction",
    subtext: "Based on Verified Client Feedback"
  },
  {
    icon: Headphones,
    number: 24,
    suffix: "/7",
    label: "Dedicated Support",
    subtext: "Always Here for Business Queries"
  }
];

export function TrustStatsSection() {
  return (
    <section className="py-16 bg-brand-dark text-white relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs uppercase font-extrabold tracking-widest text-brand-500 bg-brand-600/20 px-3.5 py-1.5 rounded-full border border-brand-600/30">
              Proven Track Record
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Trusted By Growing Businesses
            </h2>
            <p className="text-gray-400 text-base mt-2">
              We focus on metrics that matter most to your business bottom line: leads, sales, and long-term scalable growth.
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden group hover:border-brand-600/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-600/20 border border-brand-600/40 text-brand-500 flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
                  <Counter end={stat.number} suffix={stat.suffix} />
                </div>
                <h3 className="text-lg font-bold text-gray-200">
                  {stat.label}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {stat.subtext}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
