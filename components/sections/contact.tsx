"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Clock,
  MessageSquare
} from "lucide-react";
import { useAgencyContext } from "@/lib/agency-context";

const contactSchema = z.object({
  name: z.string().min(2, "Full Name must be at least 2 characters."),
  phone: z.string().regex(/^[0-9+\s-]{10,15}$/, "Please enter a valid 10-digit phone number."),
  email: z.string().email("Please enter a valid email address."),
  service: z.string().min(1, "Please select a service interested in."),
  message: z.string().min(10, "Project message must be at least 10 characters long.")
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addLead } = useAgencyContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      service: "Meta Ads Management",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    addLead(data);
    setLoading(false);
    setSubmitted(true);
    reset();
  };

  return (
    <section id="contact" className="py-24 bg-gray-50 relative overflow-hidden">
      
      {/* Background Red Orbs */}
      <div className="red-glow-orb top-0 right-0 w-96 h-96 bg-brand-600/10 pointer-events-none" />
      <div className="red-glow-orb bottom-0 left-0 w-96 h-96 bg-brand-600/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-widest text-brand-600 bg-red-100 px-3.5 py-1.5 rounded-full border border-brand-200">
              <Sparkles className="w-3.5 h-3.5" />
              Gorakhpur & Purvanchal Area Support
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-4 tracking-tight">
              Get In Touch With <span className="red-gradient-text">Vishal Jaiswal</span>
            </h2>
            <p className="text-gray-600 text-lg mt-3 font-normal">
              Book a free ad audit or website consultation. Speak directly with our founder (4+ years Meta Ads experience).
            </p>
          </motion.div>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact Info & Office Address */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-white p-8 rounded-3xl border border-gray-200/90 shadow-md space-y-6">
              <h3 className="text-2xl font-extrabold text-gray-900">
                Official Agency Contact
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Connect directly with Vishal Media Tech HQ in Khalilabad for Meta Ads management, web development, and SEO.
              </p>

              <div className="space-y-4 pt-2">
                <a
                  href="tel:+918655957779"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-600/40 hover:bg-red-50/40 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-600/30 group-hover:scale-105 transition-transform shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Call / WhatsApp Support</p>
                    <p className="text-base font-extrabold text-gray-900">+91 8655957779</p>
                  </div>
                </a>

                <a
                  href="mailto:vishalmediatech@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-600/40 hover:bg-red-50/40 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-600/30 group-hover:scale-105 transition-transform shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Official Email Inquiry</p>
                    <p className="text-sm font-extrabold text-gray-900 break-all">vishalmediatech@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-600/30 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">HQ Office Location</p>
                    <p className="text-sm font-extrabold text-gray-900">Khalilabad, Sant Kabir Nagar (Near Gorakhpur, UP)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Guarantees Pill Box */}
            <div className="bg-gradient-to-r from-brand-600 to-red-700 text-white p-6 rounded-3xl shadow-xl space-y-3">
              <div className="flex items-center gap-2 font-extrabold text-base">
                <ShieldCheck className="w-5 h-5" />
                <span>Gorakhpur Area Client Commitment</span>
              </div>
              <ul className="space-y-2 text-xs font-medium opacity-95">
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Direct phone response within 30 minutes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Free Meta Ads Audit & Competitor Review</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Speak directly with Vishal Jaiswal (4+ yrs Meta Ads exp)</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right Column: Form Container */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200/90 shadow-xl relative"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-gray-900">
                      Inquiry Received!
                    </h3>
                    <p className="text-gray-600 text-base max-w-md mx-auto mt-2 leading-relaxed">
                      Thank you! Vishal Jaiswal will contact you on WhatsApp/Phone (+91 8655957779) within 30 minutes.
                    </p>
                  </div>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-3.5 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-md hover:bg-brand-700 transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  
                  <div className="border-b border-gray-100 pb-4 mb-2">
                    <h3 className="text-2xl font-extrabold text-gray-900">
                      Book Strategy Consultation
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">Fill in your business details for a custom ad & web roadmap</p>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Amit Singh"
                        {...register("name")}
                        className={`w-full px-4 py-3.5 rounded-2xl border bg-gray-50 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
                          errors.name
                            ? "border-red-500 focus:ring-2 focus:ring-red-200"
                            : "border-gray-200 focus:border-brand-600 focus:ring-2 focus:ring-red-100"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 font-medium mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        {...register("phone")}
                        className={`w-full px-4 py-3.5 rounded-2xl border bg-gray-50 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
                          errors.phone
                            ? "border-red-500 focus:ring-2 focus:ring-red-200"
                            : "border-gray-200 focus:border-brand-600 focus:ring-2 focus:ring-red-100"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500 font-medium mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email & Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. amit@business.com"
                        {...register("email")}
                        className={`w-full px-4 py-3.5 rounded-2xl border bg-gray-50 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
                          errors.email
                            ? "border-red-500 focus:ring-2 focus:ring-red-200"
                            : "border-gray-200 focus:border-brand-600 focus:ring-2 focus:ring-red-100"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 font-medium mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Service Required *
                      </label>
                      <select
                        {...register("service")}
                        className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-red-100 focus:bg-white transition-all"
                      >
                        <option value="Meta Ads Management">Meta Ads (FB/IG) Lead Gen</option>
                        <option value="Website Development">Custom Website Development</option>
                        <option value="Landing Page Design">High Converting Landing Page</option>
                        <option value="Google Ads (PPC)">Google Ads (PPC)</option>
                        <option value="Search Engine Optimization">Google Local SEO (Gorakhpur)</option>
                        <option value="Full Digital Marketing Package">Complete Business Growth Package</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Your Business & Goal Details *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Share details about your business (e.g. Real Estate in Gorakhpur, Doctor Clinic in Khalilabad, Coaching in Basti)..."
                      {...register("message")}
                      className={`w-full px-4 py-3.5 rounded-2xl border bg-gray-50 text-sm font-medium focus:outline-none focus:bg-white transition-all ${
                        errors.message
                          ? "border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-gray-200 focus:border-brand-600 focus:ring-2 focus:ring-red-100"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 font-medium mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-brand-600 text-white font-bold text-base shadow-xl shadow-brand-600/30 hover:bg-brand-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Submitting Consultation Request...
                      </span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Get Strategy Call with Vishal Jaiswal</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-gray-400 text-center font-medium">
                    🔒 Direct assistance from Vishal Jaiswal (+91 8655957779). 100% Confidential.
                  </p>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
