"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Youtube, X, Eye, ThumbsUp, Sparkles } from "lucide-react";

interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  client: string;
  thumbnail: string;
  views: string;
  duration: string;
  category: string;
}

const videosList: VideoItem[] = [
  {
    id: "vid-1",
    youtubeId: "dQw4w9WgXcQ", // Demo video ID
    title: "How Apex Realty Scaled to ₹4.5 Cr Sales via Meta Ads",
    client: "Apex Luxury Real Estate",
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    views: "18.4K views",
    duration: "4:25",
    category: "Real Estate Case Study"
  },
  {
    id: "vid-2",
    youtubeId: "L_LUpnjgPso",
    title: "Dental Clinic Marketing: 180+ Appointments / Mo System",
    client: "Dr. Sharma Dental Clinics",
    thumbnail: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    views: "24.1K views",
    duration: "5:10",
    category: "Doctor Growth Guide"
  },
  {
    id: "vid-3",
    youtubeId: "kJQP7kiw5Fk",
    title: "5.4x ROAS Interior Design Campaign Breakdown",
    client: "Zenith Interior Studios",
    thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    views: "12.8K views",
    duration: "6:40",
    category: "Meta Ads Strategy"
  },
  {
    id: "vid-4",
    youtubeId: "fJ9rUzIMcZQ",
    title: "1,200+ Coaching Student Webinar Lead Funnel",
    client: "EduPulse Coaching",
    thumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    views: "31.5K views",
    duration: "7:15",
    category: "EdTech Webinar Funnel"
  },
  {
    id: "vid-5",
    youtubeId: "3JZ_D3ELwOQ",
    title: "₹38 Lakh E-Commerce Modular Kitchen Sales System",
    client: "UrbanCraft Retail",
    thumbnail: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    views: "15.9K views",
    duration: "4:50",
    category: "E-Commerce Growth"
  }
];

const marqueeVideoItems = [...videosList, ...videosList];

export function VideoShowcaseSection() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <section className="py-20 bg-brand-dark text-white relative overflow-hidden">
      
      {/* Background Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-widest text-brand-500 bg-brand-600/20 px-3.5 py-1.5 rounded-full border border-brand-600/30">
            <Youtube className="w-4 h-4 text-red-500" />
            YouTube Video Case Studies
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 tracking-tight">
            Watch Our <span className="text-brand-500">Video Masterclasses</span> & Client Proof
          </h2>
          <p className="text-gray-400 text-lg mt-3 font-normal">
            Real client interviews, ad campaign walkthroughs, and step-by-step digital scaling breakdowns.
          </p>
        </motion.div>
      </div>

      {/* Infinite Right-To-Left Scrolling Video Marquee Track */}
      <div className="relative w-full overflow-hidden flex py-4">
        {/* Edge Shadows */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-dark to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-dark to-transparent z-20 pointer-events-none" />

        <motion.div
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          }}
          className="flex gap-6 shrink-0"
        >
          {marqueeVideoItems.map((video, idx) => (
            <div
              key={`${video.id}-${idx}`}
              onClick={() => setActiveVideoId(video.youtubeId)}
              className="relative w-80 sm:w-96 rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-xl group cursor-pointer shrink-0 hover:border-brand-500 transition-all duration-300"
            >
              {/* Thumbnail Container */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-900">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  loading="lazy"
                />
                
                {/* Center YouTube Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-115 group-hover:bg-red-600 transition-all duration-300">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-3 right-3 text-[11px] font-bold text-white bg-black/80 px-2.5 py-0.5 rounded-md">
                  {video.duration}
                </span>

                {/* Category Badge */}
                <span className="absolute top-3 left-3 text-[11px] font-bold text-white bg-brand-600/90 backdrop-blur-md px-3 py-1 rounded-full">
                  {video.category}
                </span>
              </div>

              {/* Video Info */}
              <div className="p-5">
                <h4 className="text-base font-extrabold text-white group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
                  {video.title}
                </h4>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                  <span className="font-semibold text-gray-300">{video.client}</span>
                  <span className="flex items-center gap-1 font-medium text-emerald-400">
                    <Eye className="w-3.5 h-3.5" />
                    {video.views}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* YouTube Video Player Modal */}
      <AnimatePresence>
        {activeVideoId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 rounded-3xl max-w-4xl w-full p-4 relative shadow-2xl border border-white/20 overflow-hidden"
            >
              <button
                onClick={() => setActiveVideoId(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-brand-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1`}
                  title="YouTube Video Player"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
