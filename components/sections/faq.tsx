"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { FAQItem } from "@/types";

const faqsList: FAQItem[] = [
  {
    question: "What digital marketing services does Vishal Media Tech offer?",
    answer: "We offer full-suite digital growth solutions including Custom Website Development, Landing Page Design, Meta Ads (Facebook & Instagram), Google Ads (PPC), Search Engine Optimization (SEO), Social Media Management, Branding, WhatsApp Business API Automation, and AI Customer Chatbots.",
    category: "Services"
  },
  {
    question: "How long does it take to design and launch a new business website?",
    answer: "Our typical delivery timeline for a custom, high-converting business website or landing page is 7 to 14 days. We work in sprints so your business can start capturing leads as quickly as possible.",
    category: "Website Dev"
  },
  {
    question: "How soon can we expect results from Meta Ads or Google Ads campaigns?",
    answer: "With Meta & Google Ads, qualified lead flow usually begins within 24 to 48 hours of campaign launch. During the first 7-10 days, we optimize audience targeting and ad creatives to aggressively lower your Cost Per Lead (CPL).",
    category: "Advertising"
  },
  {
    question: "What ad budget do I need to start advertising on Facebook & Google?",
    answer: "We recommend starting with a minimum daily ad spend of ₹500 to ₹1,000 per platform for local businesses, and ₹2,000+ per day for national or e-commerce brands. We ensure every rupee spent is tracked against actual lead conversions.",
    category: "Advertising"
  },
  {
    question: "Do you guarantee #1 ranking on Google for Search Engine Optimization (SEO)?",
    answer: "We follow strict Google Search guidelines (white-hat SEO, technical schema markup, high-authority link building). Most of our clients see substantial keyword ranking improvements within 60 to 90 days, leading to consistent organic inbound calls.",
    category: "SEO"
  },
  {
    question: "Will I have full ownership of my website, domain, and ad accounts?",
    answer: "Yes, 100%! Unlike agency traps that lock you in, you retain complete administrative ownership of your website source code, domain name, hosting, Meta Ad accounts, and Google Analytics dashboards.",
    category: "Ownership"
  },
  {
    question: "What industries or business types do you specialize in?",
    answer: "We specialize in high-intent lead generation for Real Estate, Doctors & Healthcare Clinics, Coaching Institutes & EdTech, Interior Designers, Local Shops, Startups, and Professional Service Providers across India & international markets.",
    category: "Industries"
  },
  {
    question: "How does the WhatsApp Marketing & AI Automation service work?",
    answer: "We set up official Meta WhatsApp Business API accounts with Green Tick verification, automated drip broadcasts, and AI-powered auto-responders that qualify incoming leads 24/7 without requiring manual intervention.",
    category: "Automation"
  },
  {
    question: "How do we track campaign performance and stay updated?",
    answer: "You receive a live 24/7 transparent analytics dashboard, weekly executive summary reports, and direct 1-on-1 access to your dedicated growth account manager via WhatsApp and weekly video strategy calls.",
    category: "Reporting"
  },
  {
    question: "How do we get started with Vishal Media Tech?",
    answer: "Getting started is simple! Simply click 'Book Free Consultation' or fill out our contact form below. Our growth team will conduct a free digital audit of your business and deliver a custom strategy roadmap within 24 hours.",
    category: "Getting Started"
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-red-50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-widest text-brand-600 bg-red-100 px-3.5 py-1.5 rounded-full border border-brand-200">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-4 tracking-tight">
              Got <span className="red-gradient-text">Questions?</span> We Have Answers
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mt-3 font-normal">
              Everything you need to know about our digital marketing services, timelines, pricing, and process.
            </p>
          </motion.div>
        </div>

        {/* 10 Accordion Items */}
        <div className="space-y-4">
          {faqsList.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-red-50/40 border-brand-600/60 shadow-md"
                    : "bg-white border-gray-200/90 hover:border-gray-300 shadow-xs"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-gray-900 text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "bg-brand-600 text-white rotate-180"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0 text-gray-600 text-sm leading-relaxed border-t border-red-100/60 mt-1">
                        <p className="pt-4">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
