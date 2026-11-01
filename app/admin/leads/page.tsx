"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Target,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Maximize2,
  CheckCircle2
} from "lucide-react";

export default function AdminLeadsPage() {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin"
              className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-xs font-bold text-blue-400">LEAD System</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Target className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                LEAD Management System
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Connected External Portal: <strong className="text-blue-400">https://vishallms.vercel.app</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="https://vishallms.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 group"
          >
            <span>Open LEAD System in New Window</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Portal Highlight Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-gray-900 to-black border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
              Vishal LMS Cloud
            </span>
            <span className="text-xs text-gray-400">· Real-time Leads Pipeline</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Dedicated Inquiries, WhatsApp Leads & CRM Management
          </h3>
          <p className="text-xs text-gray-400 max-w-2xl">
            All prospective client inquiries, campaign leads, and CRM workflows are managed through the dedicated Vishal LMS engine at <strong className="text-blue-300">vishallms.vercel.app</strong>.
          </p>
        </div>

        <a
          href="https://vishallms.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-white border border-gray-700 transition-all flex items-center gap-2 shrink-0"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Launch Fullscreen</span>
        </a>
      </div>

      {/* Live Preview Container / Embedded Frame */}
      <div className="rounded-3xl border border-gray-800 bg-gray-950 overflow-hidden shadow-2xl relative min-h-[650px] flex flex-col">
        
        {/* Browser Mockup Top Bar */}
        <div className="bg-gray-900/90 border-b border-gray-800 px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
            <span className="text-xs text-gray-400 font-mono ml-2 truncate max-w-xs sm:max-w-md">
              https://vishallms.vercel.app
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://vishallms.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Direct Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Embedded Iframe */}
        <div className="relative flex-1 w-full min-h-[600px] bg-black">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 z-10 text-center p-6 space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
              <p className="text-sm font-bold text-gray-300">Connecting to Vishal LMS (vishallms.vercel.app)...</p>
              <a
                href="https://vishallms.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 underline font-semibold mt-2 inline-block"
              >
                Click here if it doesn't load within a few seconds
              </a>
            </div>
          )}

          <iframe
            src="https://vishallms.vercel.app"
            title="Vishal LMS"
            className="w-full h-full min-h-[650px] border-0"
            onLoad={() => setIframeLoaded(true)}
            allow="clipboard-read; clipboard-write; camera; microphone"
          />
        </div>

      </div>

    </div>
  );
}
