"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { TestimonialItem } from "@/types";

const testimonialsData: TestimonialItem[] = [
  {
    id: "test-1",
    name: "Vikramaditya Singh",
    business: "Apex Realty Group",
    role: "Managing Director",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    review: "Vishal Media Tech completely revamped our online lead generation. Within 30 days of launching our Meta Ads and new website, we received over 400 verified luxury buyer inquiries. Their transparency and speed are second to none!",
    growthMetric: "+420 High Intent Leads"
  },
  {
    id: "test-2",
    name: "Dr. Ananya Sharma",
    business: "Sharma Dental Clinics",
    role: "Founder & Chief Surgeon",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    review: "As a doctor, I didn't have time to manage marketing. Vishal Media Tech built our Google Local SEO and WhatsApp automated booking. Our appointment calendar is consistently full 3 weeks in advance!",
    growthMetric: "180+ Appointments / Mo"
  },
  {
    id: "test-3",
    name: "Rajesh Khandelwal",
    business: "Zenith Interior Studios",
    role: "Principal Architect",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    review: "Our Instagram ROAS jumped to 5.4x after hiring Vishal Media Tech. Their creative team scripting video ads for high-ticket homeowners made all the difference. Worth every single rupee!",
    growthMetric: "5.4x Verified ROAS"
  },
  {
    id: "test-4",
    name: "Pooja Malhotra",
    business: "EduPulse Coaching",
    role: "Co-Founder",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    review: "The custom landing page built in Next.js loads in under 1 second. We registered over 1,200 students for our coaching batch via Google Ads with zero technical glitches. Super professional team!",
    growthMetric: "1,200+ Student Reg."
  },
  {
    id: "test-5",
    name: "Amitabh Verma",
    business: "UrbanCraft Kitchens",
    role: "Head of Marketing",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    review: "We tried 3 different agencies before discovering Vishal Media Tech. Their Meta dynamic product ads generated ₹38 Lakh in revenue in just 60 days. They are true growth partners.",
    growthMetric: "₹38L New Sales"
  },
  {
    id: "test-6",
    name: "Siddharth Mehta",
    business: "TechPro SaaS",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    review: "Their AI business automation and LinkedIn ad strategies brought in top-tier B2B clients for our software enterprise. Communication is 10/10 with dedicated WhatsApp support.",
    growthMetric: "65+ SaaS Enterprise Demos"
  }
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  return (
    <section className="py-24 bg-brand-dark text-white relative overflow-hidden">
      
      {/* Glow Orbs */}
      <div className="absolute top-0 left-1/3 w-[30rem] h-[30rem] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs uppercase font-extrabold tracking-widest text-brand-500 bg-brand-600/20 px-3.5 py-1.5 rounded-full border border-brand-600/30">
              Verified Client Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 tracking-tight">
              What Our <span className="text-brand-500">Clients Say</span>
            </h2>
            <p className="text-gray-400 text-lg mt-3 font-normal">
              Real feedback from business owners, doctors, startups, and service providers we work with daily.
            </p>
          </motion.div>
        </div>

        {/* 6 Cards Grid for Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md flex flex-col justify-between hover:border-brand-600/60 transition-all duration-300 relative group"
            >
              <div>
                {/* Header: Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-brand-600/40 group-hover:text-brand-500 transition-colors" />
                </div>

                {/* Review Copy */}
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                  "{item.review}"
                </p>
              </div>

              {/* Client Info & Metric */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-brand-600"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-400">{item.business}</p>
                  </div>
                </div>
                
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full shrink-0">
                  {item.growthMetric}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
