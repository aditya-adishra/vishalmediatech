"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAgencyContext } from "@/lib/agency-context";
import {
  Wallet,
  Users,
  Code,
  Briefcase,
  Star,
  Camera,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  CreditCard,
  Building,
  Sparkles,
  ExternalLink,
  BarChart3,
  PieChart,
  HardDrive,
  Target
} from "lucide-react";
import { WalletAnalyticsCharts } from "@/components/admin/wallet-analytics-charts";
import { BackupModal } from "@/components/admin/backup-modal";

export default function AdminDashboardPage() {
  const {
    customers,
    transactions,
    services,
    portfolio,
    testimonials,
    photos,
    videos
  } = useAgencyContext();

  const [showBackupModal, setShowBackupModal] = useState(false);

  const totalAgencyWallet = customers.reduce((sum, c) => sum + c.walletBalance, 0);
  const totalFundsDeposited = customers.reduce((sum, c) => sum + c.totalFunded, 0);
  const totalAdSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto text-white">
      
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-brand-400 bg-brand-500/20 px-3 py-1 rounded-full border border-brand-500/30">
            Executive Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Agency Overview Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Real-time status of ad budget wallets, client accounts, and live website content
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="https://vishallms.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            title="Open Vishal LMS (vishallms.vercel.app)"
          >
            <Target className="w-4 h-4" />
            <span>LEAD System</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setShowBackupModal(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-brand-300 border border-brand-500/30 font-bold text-xs shadow transition-all flex items-center gap-2"
            title="Download database backup or restore data"
          >
            <HardDrive className="w-4 h-4 text-brand-400" />
            <span>Backup Data</span>
          </button>

          <Link
            href="/admin/finance"
            prefetch={true}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] flex items-center gap-2"
          >
            <PieChart className="w-4 h-4" />
            <span>Earnings & Expenses (Circle Graph)</span>
          </Link>

          <Link
            href="/admin/customers"
            prefetch={true}
            className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all active:scale-[0.98] flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            <span>Customer Wallets</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Wallet Stat Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Agency Wallet Balance */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black p-5 sm:p-6 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Live Balance
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">
            ₹{totalAgencyWallet.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-gray-400 font-medium">Total Client Wallet Funds</span>
        </div>

        {/* Total Funded Ad Budget */}
        <div className="bg-gray-900/90 p-5 sm:p-6 rounded-3xl border border-gray-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600/20 text-brand-400 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-brand-400">All-Time</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white block">
            ₹{totalFundsDeposited.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-gray-400 font-medium">Total Budget Funded (Credits)</span>
        </div>

        {/* Total Ad Spend Deducted */}
        <div className="bg-gray-900/90 p-5 sm:p-6 rounded-3xl border border-gray-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-400">Meta/Google</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white block">
            ₹{totalAdSpent.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-gray-400 font-medium">Total Ad Spend Deducted (Debits)</span>
        </div>

        {/* Total Active Clients */}
        <div className="bg-gray-900/90 p-5 sm:p-6 rounded-3xl border border-gray-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-indigo-400">Purvanchal</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white block">{customers.length}</span>
          <span className="text-xs text-gray-400 font-medium">Active Client Accounts</span>
        </div>

      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        
        <a
          href="https://vishallms.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-gradient-to-b from-blue-950/40 via-gray-900 to-gray-950 border border-blue-500/30 hover:border-blue-400 hover:bg-gray-800/80 transition-all text-center group relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 text-blue-400">
            <ExternalLink className="w-3 h-3" />
          </div>
          <Target className="w-6 h-6 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-bold text-white">LEAD System</h4>
          <p className="text-[10px] text-blue-400 mt-0.5 font-semibold">vishallms.vercel.app</p>
        </a>

        <Link
          href="/admin/finance"
          prefetch={true}
          className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-emerald-500 hover:bg-gray-800/80 transition-all active:scale-[0.98] text-center group"
        >
          <PieChart className="w-6 h-6 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-bold text-white">Earnings & P&L</h4>
          <p className="text-[10px] text-gray-400 mt-0.5">Circle Graph</p>
        </Link>

        <Link
          href="/admin/customers"
          prefetch={true}
          className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-brand-500 hover:bg-gray-800/80 transition-all active:scale-[0.98] text-center group"
        >
          <Wallet className="w-6 h-6 text-brand-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-bold text-white">Client Wallets</h4>
          <p className="text-[10px] text-gray-400 mt-0.5">{customers.length} Clients</p>
        </Link>

        <Link
          href="/admin/services"
          prefetch={true}
          className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-brand-500 hover:bg-gray-800/80 transition-all active:scale-[0.98] text-center group"
        >
          <Code className="w-6 h-6 text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-bold text-white">Services</h4>
          <p className="text-[10px] text-gray-400 mt-0.5">{services.length} Live</p>
        </Link>

        <Link
          href="/admin/portfolio"
          prefetch={true}
          className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-brand-500 hover:bg-gray-800/80 transition-all active:scale-[0.98] text-center group"
        >
          <Briefcase className="w-6 h-6 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-bold text-white">Portfolio</h4>
          <p className="text-[10px] text-gray-400 mt-0.5">{portfolio.length} Projects</p>
        </Link>

        <Link
          href="/admin/testimonials"
          prefetch={true}
          className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-brand-500 hover:bg-gray-800/80 transition-all active:scale-[0.98] text-center group"
        >
          <Star className="w-6 h-6 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-bold text-white">Testimonials</h4>
          <p className="text-[10px] text-gray-400 mt-0.5">{testimonials.length} Reviews</p>
        </Link>

        <Link
          href="/admin/media"
          prefetch={true}
          className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-brand-500 hover:bg-gray-800/80 transition-all active:scale-[0.98] text-center group"
        >
          <Camera className="w-6 h-6 text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-bold text-white">Media Marquee</h4>
          <p className="text-[10px] text-gray-400 mt-0.5">{photos.length + videos.length} Items</p>
        </Link>

        <Link
          href="/admin/faq"
          prefetch={true}
          className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-brand-500 hover:bg-gray-800/80 transition-all active:scale-[0.98] text-center group"
        >
          <HelpCircle className="w-6 h-6 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-bold text-white">FAQ Accordion</h4>
          <p className="text-[10px] text-gray-400 mt-0.5">Manage FAQs</p>
        </Link>

      </div>

      {/* Dynamic Ad Budget & Expense Analytics (Daily, Weekly, Monthly) */}
      <WalletAnalyticsCharts
        customers={customers}
        transactions={transactions}
      />

      {/* Recent Wallet Transactions Ledger */}
      <div className="bg-gray-900/90 rounded-3xl border border-gray-800 p-5 sm:p-8 shadow-xl space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Recent Ad Budget Transactions
            </h3>
            <p className="text-xs text-gray-400">
              Latest deposits and ad spend recorded across all clients
            </p>
          </div>

          <Link
            href="/admin/customers"
            className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
          >
            <span>View All in Wallet Manager</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-[11px] font-extrabold uppercase text-gray-400">
                <th className="py-3 px-4">Client / Business</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-xs sm:text-sm">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
                    No transactions recorded yet. Go to Customer & Wallet Manager to add deposits.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2 whitespace-nowrap">
                      <Building className="w-3.5 h-3.5 text-brand-500" />
                      <span>{tx.customerName}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                        tx.type === "CREDIT"
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          : "text-red-400 bg-red-500/10 border-red-500/20"
                      }`}>
                        {tx.type === "CREDIT" ? "🟢 Deposit" : "🔴 Ad Spend"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-gray-300">
                      {tx.description}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-gray-400 whitespace-nowrap">
                      {tx.date}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className={`font-black text-sm ${
                        tx.type === "CREDIT" ? "text-emerald-400" : "text-red-400"
                      }`}>
                        {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Data Backup & Restore Modal */}
      <BackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
      />

    </div>
  );
}
