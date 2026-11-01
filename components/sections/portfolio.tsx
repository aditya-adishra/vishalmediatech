"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Sparkles, ArrowRight } from "lucide-react";
import { PortfolioItem } from "@/types";
import { useAgencyContext } from "@/lib/agency-context";

export function PortfolioSection() {
  const { portfolio } = useAgencyContext();
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  return (
    <section id="portfolio" className="py-24 bg-gray-50 relative overflow-hidden">
      
      {/* Glow Backdrop */}
      <div className="red-glow-orb top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-brand-600/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs uppercase font-extrabold tracking-widest text-brand-600 bg-red-100 px-3.5 py-1.5 rounded-full border border-brand-200">
              Our Proven Case Studies
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mt-4 tracking-tight">
              Recent <span className="red-gradient-text">Projects</span>
            </h2>
            <p className="text-gray-600 text-lg mt-3 font-normal">
              Take a look at how we helped startups, local businesses, and doctors dominate their market.
            </p>
          </motion.div>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolio.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200/90 shadow-md hover:shadow-2xl hover:shadow-brand-600/20 hover:border-brand-600/60 transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Project Image Header with Zoom Effect */}
              <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />
                
                {/* Category Badge Floating top */}
                <span className="absolute top-4 left-4 text-xs font-bold text-white bg-brand-600/90 backdrop-blur-md px-3 py-1 rounded-full shadow-md">
                  {project.category}
                </span>

                {/* Key Result Banner floating bottom */}
                <div className="absolute bottom-3 left-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/40 shadow-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="text-xs font-extrabold text-gray-900 truncate">
                    {project.results}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tech Stack Badges */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Live Preview Button */}
                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full py-3 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-600/30 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>View Case Study Details</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Case Study Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                  {selectedProject.title}
                </h3>
                <p className="text-sm font-semibold text-gray-500">Client: {selectedProject.client}</p>
              </div>

              <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <h4 className="font-extrabold text-sm uppercase tracking-wide text-emerald-800">Verified Result Highlight</h4>
                  <p className="text-base font-bold mt-1">{selectedProject.results}</p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-base mb-1">Project Strategy & Scope</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedProject.description}</p>
                </div>

                {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 text-base mb-2">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((t) => (
                        <span key={t} className="px-3 py-1 bg-gray-100 font-semibold text-xs text-gray-800 rounded-lg">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <a
                  href="#contact"
                  onClick={() => setSelectedProject(null)}
                  className="w-full py-3.5 rounded-2xl bg-brand-600 text-white font-bold text-center text-sm shadow-md hover:bg-brand-700 flex items-center justify-center gap-2"
                >
                  <span>Request Similar Results For Your Business</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
