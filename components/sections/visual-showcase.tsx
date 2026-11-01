"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Camera, Eye, X, ZoomIn, Layers } from "lucide-react";

interface ShowcasePhoto {
  id: string;
  title: string;
  category: "Client Ad Shoots" | "Meta Creatives" | "Web Designs" | "Studio Life";
  image: string;
  tag: string;
}

const photoGallery: ShowcasePhoto[] = [
  {
    id: "pic-1",
    title: "Real Estate Villa Ad Shoot - Gorakhpur",
    category: "Client Ad Shoots",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    tag: "+420 Meta Leads Generated"
  },
  {
    id: "pic-2",
    title: "Dental SuperSpecialty Clinic Campaign",
    category: "Client Ad Shoots",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80",
    tag: "180+ Appointments / Mo"
  },
  {
    id: "pic-3",
    title: "Next.js 15 Web Application Architecture",
    category: "Web Designs",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
    tag: "99/100 Google Speed Score"
  },
  {
    id: "pic-4",
    title: "Vishal Jaiswal Meta Ads Strategy Studio",
    category: "Studio Life",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
    tag: "4+ Years Ad Expertise"
  },
  {
    id: "pic-5",
    title: "Interior Studio 3D Reel Ad Production",
    category: "Meta Creatives",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    tag: "5.4x Proven ROAS"
  },
  {
    id: "pic-6",
    title: "Khalilabad HQ Client Onboarding & Review",
    category: "Studio Life",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
    tag: "100% Client Retention"
  }
];

export function VisualShowcaseSection() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedPhoto, setSelectedPhoto] = useState<ShowcasePhoto | null>(null);

  const filteredPhotos = photoGallery.filter((p) => {
    if (activeTab === "All") return true;
    return p.category === activeTab;
  });

  return (
    <section className="py-24 bg-gray-950 text-white relative overflow-hidden">
      
      {/* Background Red Glow */}
      <div className="red-glow-orb top-1/3 left-1/4 w-[35rem] h-[35rem] bg-brand-600/15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-widest text-brand-400 bg-brand-500/20 border border-brand-500/30 px-4 py-1.5 rounded-full">
              <Camera className="w-4 h-4 text-brand-500" />
              High-Impact Visual Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 tracking-tight">
              Our Agency <span className="red-gradient-text">In Action</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mt-3">
              Explore real ad shoot sets, client campaign creatives, and web design production at Vishal Media Tech.
            </p>
          </motion.div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {["All", "Client Ad Shoots", "Meta Creatives", "Web Designs", "Studio Life"].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 ${
                  isActive
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/40 border border-brand-500"
                    : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white hover:bg-gray-800"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Photo Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-gray-800 shadow-xl"
              >
                {/* Background Image */}
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4">
                  <span className="text-[11px] font-extrabold text-white bg-brand-600/90 backdrop-blur-md px-3 py-1 rounded-full shadow-md">
                    {photo.category}
                  </span>
                </div>

                {/* Zoom Icon Floating Top Right */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-5 h-5" />
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                    {photo.tag}
                  </span>
                  <h3 className="text-base font-extrabold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
                    {photo.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* High Res Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-brand-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative h-[65vh] w-full bg-black">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 bg-gray-900 flex items-center justify-between border-t border-gray-800">
                <div>
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
                    {selectedPhoto.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                    {selectedPhoto.title}
                  </h3>
                </div>

                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                  {selectedPhoto.tag}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
