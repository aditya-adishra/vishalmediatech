"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Code,
  Briefcase,
  Star,
  Camera,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Home,
  PieChart,
  RefreshCw,
  Cloud,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Target
} from "lucide-react";
import { useAgencyContext } from "@/lib/agency-context";
import { BackupModal } from "@/components/admin/backup-modal";

const navItems = [
  { name: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
  { name: "LEAD System", href: "https://vishallms.vercel.app", icon: Target, isExternal: true },
  { name: "Customer & Wallet Manager", href: "/admin/customers", icon: Wallet, badge: "Wallet" },
  { name: "Earnings & Expenses", href: "/admin/finance", icon: PieChart, badge: "P&L" },
  { name: "Services Catalog", href: "/admin/services", icon: Code },
  { name: "Portfolio Projects", href: "/admin/portfolio", icon: Briefcase },
  { name: "Client Testimonials", href: "/admin/testimonials", icon: Star },
  { name: "Photo & Video Media", href: "/admin/media", icon: Camera },
  { name: "FAQ Accordions", href: "/admin/faq", icon: HelpCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, customers, syncStatus, lastSyncedAt, syncNow } = useAgencyContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  const totalAgencyWallet = customers.reduce((sum, c) => sum + c.walletBalance, 0);

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    await syncNow();
    setTimeout(() => setIsManualSyncing(false), 600);
  };

  const NavContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
              V
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-white">
                VISHAL <span className="text-brand-500">ADMIN</span>
              </h2>
              <p className="text-[11px] text-gray-400 font-medium">Media Tech Portal</p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="mt-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.isExternal) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all text-blue-400 hover:text-white hover:bg-blue-600/20 border border-blue-500/20 group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold">{item.name}</span>
                  </div>

                  <span className="flex items-center gap-1 text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                    <span>LMS</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </a>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-colors duration-150 active:scale-[0.98] ${
                  isActive
                    ? "bg-brand-600 text-white font-bold shadow-md shadow-brand-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>{item.name}</span>
                </div>

                {item.badge === "Wallet" && (
                  <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    ₹{totalAgencyWallet.toLocaleString("en-IN")}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls & Live Cloud Sync Status */}
      <div className="pt-4 border-t border-gray-800 space-y-2.5">
        
        {/* Dedicated Data Backup & Export Button */}
        <button
          onClick={() => {
            setMobileOpen(false);
            setShowBackupModal(true);
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-brand-600/15 border border-brand-500/30 text-brand-300 hover:bg-brand-600 hover:text-white transition-all text-xs font-bold flex items-center justify-between group shadow"
        >
          <span className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-brand-400 group-hover:text-white" />
            <span>Data Backup & Restore</span>
          </span>
          <span className="text-[10px] font-extrabold bg-brand-500/20 text-brand-300 group-hover:bg-white/20 group-hover:text-white px-2 py-0.5 rounded-full">
            Backup
          </span>
        </button>

        {/* Multi-Device Cloud Sync Card */}
        <div className="p-3 rounded-xl bg-gray-950/80 border border-gray-800/80">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {syncStatus === "syncing" || isManualSyncing ? (
                <RefreshCw className="w-4 h-4 text-brand-400 animate-spin" />
              ) : syncStatus === "error" ? (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">
                  {syncStatus === "syncing" || isManualSyncing
                    ? "Cloud Syncing..."
                    : syncStatus === "error"
                    ? "Offline (Local Cache)"
                    : "Cloud Synced"}
                </p>
                <p className="text-[10px] text-gray-400">
                  {lastSyncedAt ? `Updated ${lastSyncedAt}` : "All devices connected"}
                </p>
              </div>
            </div>

            <button
              onClick={handleManualSync}
              disabled={isManualSyncing}
              title="Sync now across all devices"
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-brand-600 text-gray-300 hover:text-white transition-all text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isManualSyncing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center justify-between text-xs font-bold text-gray-400 hover:text-white transition-colors px-1"
        >
          <span className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span>View Live Site</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={logout}
          className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs hover:bg-brand-600 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navbar Bar with Sync and Backup Indicators */}
      <div className="md:hidden bg-gray-900 border-b border-gray-800 p-3.5 flex items-center justify-between text-white sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 text-white font-extrabold text-sm flex items-center justify-center">
            V
          </div>
          <div>
            <span className="font-extrabold text-sm block leading-none">VMT Admin</span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Synced
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBackupModal(true)}
            className="p-2 rounded-xl bg-gray-800 text-brand-400 hover:text-white text-xs flex items-center gap-1"
            title="Backup Data"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold hidden xs:inline">Backup</span>
          </button>

          <button
            onClick={handleManualSync}
            disabled={isManualSyncing}
            className="p-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-xs flex items-center gap-1.5"
            title="Sync Now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isManualSyncing ? "animate-spin" : ""}`} />
            <span className="text-[11px] font-semibold hidden xs:inline">Sync</span>
          </button>

          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-gray-900 text-white p-6 h-full shadow-2xl z-10">
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex w-64 bg-gray-900 text-white min-h-screen p-6 flex-col justify-between border-r border-gray-800 shrink-0">
        <NavContent />
      </aside>

      {/* Data Backup & Restore Modal */}
      <BackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
      />
    </>
  );
}
