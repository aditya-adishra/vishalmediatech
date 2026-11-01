"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAgencyContext } from "@/lib/agency-context";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAgencyContext();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) {
      setError("Please enter your admin password.");
      return;
    }
    const success = login(passcode);
    if (success) {
      router.push("/admin");
    } else {
      setError("Incorrect password! Please enter the valid admin password.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Glow Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Row */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between z-10 py-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Website</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>VMT Secure Portal</span>
        </div>
      </div>

      {/* Centered Login Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10 py-6">
        <div className="bg-gray-900/90 border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-xl relative">
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto mb-4 font-bold text-2xl shadow-lg shadow-brand-600/30">
              <Lock className="w-7 h-7" />
            </div>

            <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-brand-400 bg-brand-500/15 border border-brand-500/30 px-3 py-1 rounded-full mb-2">
              Admin Portal
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Vishal Media Tech
            </h1>
            <p className="text-xs text-gray-400 mt-1">Enter authorized password to access portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Admin Password *
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setError("");
                  }}
                  className={`w-full px-4 py-3.5 rounded-2xl bg-gray-950 border text-white placeholder-gray-500 text-sm font-medium focus:outline-none transition-all pr-12 ${
                    error
                      ? "border-red-500"
                      : "border-gray-800 focus:border-brand-500"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="text-xs text-red-400 font-bold mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-brand-600 text-white font-extrabold text-sm shadow-xl shadow-brand-600/30 hover:bg-brand-500 transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center z-10 text-[11px] text-gray-500 py-2">
        © 2026 Vishal Media Tech Agency. All rights reserved.
      </div>

    </div>
  );
}
