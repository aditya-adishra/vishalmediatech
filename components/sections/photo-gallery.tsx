"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Camera, Image as ImageIcon } from "lucide-react";
import { useAgencyContext } from "@/lib/agency-context";

const marqueeRow1 = [
  {
    title: "Strategy Sprint - Vishal Jaiswal",
    category: "Meta Ads Planning",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Luxury Real Estate Villa Shoot",
    category: "Gorakhpur Client",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Dental SuperSpecialty Clinic Campaign",
    category: "Doctor Growth",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "UX & Next.js 15 Web Engineering",
    category: "Development HQ",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Interior Studio 3D Reel Production",
    category: "Meta Ad Creative",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Khalilabad HQ Client Onboarding",
    category: "Agency Studio",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
  }
];

const marqueeRow2 = [
  {
    title: "High-ROAS Meta Ads Analytics",
    category: "Ad Campaign Optimization",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Doctor Patient Booking Dashboard",
    category: "Healthcare Growth",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Client Video Reel Editing Set",
    category: "Instagram Creatives",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Gorakhpur Local SEO Strategy",
    category: "Search Dominance",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "High Converting Landing Page Build",
    category: "Lead Gen UX",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Purvanchal Business Growth Summit",
    category: "Client Results",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80"
  }
];

export function PhotoGallerySection() {
  return (
    <section id="photo-gallery" className="py-20 bg-gray-900 text-white relative overflow-hidden border-t border-b border-gray-800">
      
      {/* Glow Orbs */}
      <div className="red-glow-orb top-0 right-0 w-96 h-96 bg-brand-600/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-widest text-brand-400 bg-brand-500/20 px-3.5 py-1.5 rounded-full border border-brand-500/30">
          <Camera className="w-4 h-4 text-brand-500" />
          Infinite Visual Marquee
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">
          Behind The Scenes at <span className="red-gradient-text">Vishal Media Tech</span>
        </h2>
        <p className="text-gray-400 text-sm mt-2">Continuous live look at our ad shoots, web builds, and client campaigns</p>
      </div>

      {/* DUAL-ROW MARQUEE TRACKS */}
      <div className="space-y-6 overflow-hidden">
        
        {/* ROW 1: Right-to-Left Scroll */}
        <div className="flex gap-6 w-max animate-marquee">
          {[...marqueeRow1, ...marqueeRow1].map((item, index) => (
            <div
              key={`row1-${index}`}
              className="w-72 sm:w-80 h-52 rounded-3xl overflow-hidden relative shrink-0 border border-gray-800 shadow-xl group cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black/30 to-transparent opacity-85" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-extrabold uppercase text-brand-400 bg-brand-500/20 px-2.5 py-0.5 rounded-full border border-brand-500/30 mb-1 inline-block">
                  {item.category}
                </span>
                <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* ROW 2: Left-to-Right Scroll (Reverse Marquee) */}
        <div className="flex gap-6 w-max animate-marquee-reverse">
          {[...marqueeRow2, ...marqueeRow2].map((item, index) => (
            <div
              key={`row2-${index}`}
              className="w-72 sm:w-80 h-52 rounded-3xl overflow-hidden relative shrink-0 border border-gray-800 shadow-xl group cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black/30 to-transparent opacity-85" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 mb-1 inline-block">
                  {item.category}
                </span>
                <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
