"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Compass,
  FileSpreadsheet,
  Cpu,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { ProcessStep } from "@/types";

const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Strategy & Discovery",
    subtitle: "Understanding Your Business & Target Market",
    description: "We perform an in-depth audit of your existing online presence, analyze competitor strategy, define high-converting target personas, and establish revenue benchmarks.",
    deliverables: ["Competitor Audit Report", "Target Audience Blueprint", "Conversion Goal Matrix"]
  },
  {
    number: "02",
    title: "Planning & Architecture",
    subtitle: "Designing High Conversion Wireframes & Funnels",
    description: "We craft custom website UI wireframes, copy scripts, Google/Meta ad funnels, and tracking metrics before writing a single line of code or spending ad rupees.",
    deliverables: ["UX High-Fidelity Wireframes", "Ad Creative & Video Scripts", "Tracking & Conversion API Plan"]
  },
  {
    number: "03",
    title: "Execution & Launch",
    subtitle: "Building Websites & Launching Ad Campaigns",
    description: "Our engineering and ad teams build ultra-fast Next.js websites, configure Meta Pixel tracking, set up Google Ads campaigns, and go live within days.",
    deliverables: ["Live Responsive Web Platform", "Meta & Google Ad Campaigns Live", "WhatsApp & CRM Auto-Integration"]
  },
  {
    number: "04",
    title: "Optimization & A/B Testing",
    subtitle: "Maximizing ROAS & Lowering Lead Acquisition Cost",
    description: "We continuously test ad headlines, visual creatives, landing page CTAs, and bidding strategies to maximize conversion rate and eliminate wasted ad spend.",
    deliverables: ["Creative Split-Testing", "Negative Keyword Exclusions", "Page Speed & CPL Reduction"]
  },
  {
    number: "05",
    title: "Scale & Revenue Growth",
    subtitle: "Doubling Down On Winning Channels",
    description: "Once winning ad creatives and SEO pathways demonstrate high profitability, we scale budgets predictably to generate non-stop qualified leads for your business.",
    deliverables: ["Weekly Executive Performance Reports", "Monthly Budget Expansion Roadmap", "Dedicated Account Scaling"]
  }
];

export function ProcessSection() {
  return (
    <section id="process" className="py-24 bg-white relative overflow-hidden">
      
      {/* Background Subtle Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs uppercase font-extrabold tracking-widest text-brand-600 bg-red-100 px-3.5 py-1.5 rounded-full border border-brand-200">
              Clear 5-Step Roadmap
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-4 tracking-tight">
              How We <span className="red-gradient-text">Work</span>
            </h2>
            <p className="text-gray-600 text-lg mt-3 font-normal">
              A transparent, predictable engineering and marketing process designed for rapid scaling.
            </p>
          </motion.div>
        </div>

        {/* Timeline Layout */}
        <div className="relative">
          
          {/* Animated Connecting Vertical Line (Desktop & Mobile) */}
          <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-600 via-brand-400 to-brand-700 rounded-full lg:-translate-x-1/2 opacity-30" />

          <div className="space-y-12 lg:space-y-16 relative">
            {processSteps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col lg:flex-row items-start lg:items-center ${
                    isEven ? "lg:flex-row-reverse" : ""
                  } gap-8 lg:gap-16`}
                >
                  
                  {/* Timeline Badge Node Center */}
                  <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-brand-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-brand-600/40 border-4 border-white z-20">
                    {step.number}
                  </div>

                  {/* Content Box */}
                  <div className={`w-full lg:w-[calc(50%-3rem)] pl-16 lg:pl-0 ${isEven ? "lg:text-right" : "lg:text-left"}`}>
                    <div className="bg-gray-50 p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-md hover:shadow-xl hover:border-brand-600/50 transition-all duration-300 group">
                      
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-red-100/90 px-3 py-1 rounded-full">
                        Step {step.number}
                      </span>
                      
                      <h3 className="text-2xl font-extrabold text-gray-900 mt-3 group-hover:text-brand-600 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs font-bold text-gray-500 mb-3">{step.subtitle}</p>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        {step.description}
                      </p>

                      {/* Deliverables Checklist */}
                      <div className={`space-y-2 border-t border-gray-200/80 pt-4 flex flex-col ${isEven ? "lg:items-end" : "lg:items-start"}`}>
                        {step.deliverables.map((item) => (
                          <div key={item} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                            <CheckCircle className="w-4 h-4 text-brand-600 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>

                  {/* Empty Spacer for 2-column alternating layout */}
                  <div className="hidden lg:block lg:w-[calc(50%-3rem)]" />

                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
