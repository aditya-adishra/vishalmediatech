"use client";

import React, { useState, useRef } from "react";
import { useAgencyContext } from "@/lib/agency-context";
import {
  Download,
  Upload,
  Database,
  FileJson,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  HardDrive,
  ShieldCheck,
  Users,
  Wallet,
  TrendingUp,
  PieChart
} from "lucide-react";

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BackupModal({ isOpen, onClose }: BackupModalProps) {
  const {
    customers,
    transactions,
    earnings,
    expenses,
    earningCategories,
    expenseCategories,
    syncStatus,
    lastSyncedAt,
    syncNow,
    downloadFullBackupJSON,
    restoreBackupJSON,
    resetAllDataToZero,
    restoreFromSafetyVault,
    healCloudDatabase,
    vaultStats
  } = useAgencyContext();

  const [restoreStatus, setRestoreStatus] = useState<"idle" | "reading" | "confirming" | "restored" | "error">("idle");
  const [restoreMessage, setRestoreMessage] = useState("");
  const [parsedBackup, setParsedBackup] = useState<any>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [vaultSuccess, setVaultSuccess] = useState<string | null>(null);
  const [isHealing, setIsHealing] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleVaultRestore = () => {
    const ok = restoreFromSafetyVault();
    if (ok) {
      setVaultSuccess("Records successfully recovered from local safety vault!");
      setTimeout(() => setVaultSuccess(null), 4000);
    } else {
      setVaultSuccess("No previous records found in local vault.");
      setTimeout(() => setVaultSuccess(null), 4000);
    }
  };

  const handleHealCloud = async () => {
    setIsHealing(true);
    await healCloudDatabase();
    setIsHealing(false);
    setVaultSuccess("Cloud database refreshed with all local records!");
    setTimeout(() => setVaultSuccess(null), 4000);
  };

  const handleDownloadBackup = () => {
    downloadFullBackupJSON();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreStatus("reading");
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const json = JSON.parse(content);

        // Basic verification
        if (!json || typeof json !== "object") {
          throw new Error("Invalid JSON structure");
        }

        setParsedBackup(json);
        setRestoreStatus("confirming");
      } catch (err: any) {
        setRestoreStatus("error");
        setRestoreMessage("Selected file is not a valid Vishal Media Tech backup JSON.");
      }
    };

    reader.readAsText(file);
  };

  const handleConfirmRestore = async () => {
    if (!parsedBackup) return;
    setRestoreStatus("reading");
    const ok = await restoreBackupJSON(parsedBackup);
    if (ok) {
      setRestoreStatus("restored");
      setRestoreMessage("Backup successfully restored! All connected devices are now updated.");
      setTimeout(() => {
        setRestoreStatus("idle");
        setParsedBackup(null);
      }, 3500);
    } else {
      setRestoreStatus("error");
      setRestoreMessage("Failed to restore backup. Please verify backup file structure.");
    }
  };

  const exportCustomersCSV = () => {
    const headers = ["ID,Name,Phone,Email,Business,City,Wallet Balance,Total Funded,Total Spent,Created At"];
    const rows = customers.map(
      (c) =>
        `"${c.id}","${c.name}","${c.phone}","${c.email}","${c.business}","${c.city}","${c.walletBalance}","${c.totalFunded}","${c.totalSpent}","${c.createdAt}"`
    );
    downloadCSV(`vmt_customers_${Date.now()}.csv`, headers, rows);
  };

  const exportTransactionsCSV = () => {
    const headers = ["ID,Customer ID,Customer Name,Type,Amount (INR),Description,Date"];
    const rows = transactions.map(
      (t) =>
        `"${t.id}","${t.customerId}","${t.customerName}","${t.type}","${t.amount}","${t.description}","${t.date}"`
    );
    downloadCSV(`vmt_transactions_${Date.now()}.csv`, headers, rows);
  };

  const exportFinanceCSV = () => {
    const headers = ["Type,ID,Title,Client/Vendor,Category,Amount (INR),Date,Payment Method,Notes"];
    const earnRows = earnings.map(
      (e) =>
        `"EARNING","${e.id}","${e.title}","${e.client}","${e.category}","${e.amount}","${e.date}","${e.paymentMethod}","${e.notes || ""}"`
    );
    const expRows = expenses.map(
      (e) =>
        `"EXPENSE","${e.id}","${e.title}","${e.vendor}","${e.category}","${e.amount}","${e.date}","${e.paymentMethod}","${e.notes || ""}"`
    );
    downloadCSV(`vmt_finance_pnl_${Date.now()}.csv`, headers, [...earnRows, ...expRows]);
  };

  const downloadCSV = (filename: string, headers: string[], rows: string[]) => {
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white bg-gray-800/80 hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-gray-800">
          <div className="w-12 h-12 rounded-2xl bg-brand-600/20 text-brand-400 flex items-center justify-center font-bold">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Data Backup & Export Center
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Download your complete database snapshot or restore from a previous backup file
            </p>
          </div>
        </div>

        {/* Database Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gray-950 border border-gray-800">
            <span className="text-[10px] text-gray-400 font-bold block uppercase">Clients</span>
            <span className="text-lg font-black text-white">{customers.length} Accounts</span>
          </div>
          <div className="p-3 rounded-2xl bg-gray-950 border border-gray-800">
            <span className="text-[10px] text-gray-400 font-bold block uppercase">Transactions</span>
            <span className="text-lg font-black text-brand-400">{transactions.length} Logs</span>
          </div>
          <div className="p-3 rounded-2xl bg-gray-950 border border-gray-800">
            <span className="text-[10px] text-gray-400 font-bold block uppercase">Earnings</span>
            <span className="text-lg font-black text-emerald-400">{earnings.length} Entries</span>
          </div>
          <div className="p-3 rounded-2xl bg-gray-950 border border-gray-800">
            <span className="text-[10px] text-gray-400 font-bold block uppercase">Expenses</span>
            <span className="text-lg font-black text-rose-400">{expenses.length} Entries</span>
          </div>
        </div>

        {/* Cloud Sync Status & Anti-Wipe Vault Banner */}
        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <div>
                <span className="text-xs font-bold text-white block">Multi-Device Cloud Storage Active</span>
                <span className="text-[11px] text-gray-400">
                  {lastSyncedAt ? `Last cloud sync: ${lastSyncedAt}` : "All devices connected"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleHealCloud}
                disabled={isHealing}
                title="Force push all local records to heal cloud database"
                className="px-3 py-1.5 rounded-xl bg-brand-600/20 hover:bg-brand-600 text-xs font-bold text-brand-300 hover:text-white border border-brand-500/30 transition-all flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isHealing ? "animate-spin" : ""}`} />
                <span>Heal Cloud DB</span>
              </button>

              <button
                onClick={() => syncNow()}
                className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Now</span>
              </button>
            </div>
          </div>

          {/* Zero-Loss Safety Vault Card */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300">
                  Zero-Loss Safety Vault Active
                </span>
              </div>
              <p className="text-[11px] text-gray-300 mt-0.5">
                Guard snapshot: <strong>{vaultStats.customers} Clients, {vaultStats.transactions} Txs</strong> stored locally. Never wiped by server cold starts.
              </p>
            </div>

            <button
              onClick={handleVaultRestore}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restore from Vault</span>
            </button>
          </div>

          {vaultSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{vaultSuccess}</span>
            </div>
          )}
        </div>

        {/* Primary Action: Download Full JSON Backup */}
        <div className="space-y-4 mb-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-950/60 via-gray-950 to-gray-900 border border-brand-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-400 bg-brand-500/20 px-2.5 py-0.5 rounded-full mb-1.5">
                  <ShieldCheck className="w-3 h-3" />
                  Recommended
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Download Complete Full Backup (JSON)
                </h3>
                <p className="text-xs text-gray-400 mt-1 max-w-md">
                  Exports every single record (customers, balances, transactions, earnings, personal expenses, custom categories, media, and site content) into a single secure file.
                </p>
              </div>

              <button
                onClick={handleDownloadBackup}
                className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download Backup Now</span>
              </button>
            </div>

            {downloadSuccess && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Backup file successfully generated and downloaded to your device!</span>
              </div>
            )}
          </div>

          {/* CSV Quick Exports */}
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Excel / Spreadsheet CSV Exports
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={exportCustomersCSV}
                className="p-3 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-gray-200 block">Customers CSV</span>
                  <span className="text-[10px] text-gray-500">Balances & Details</span>
                </div>
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={exportTransactionsCSV}
                className="p-3 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-gray-200 block">Transactions CSV</span>
                  <span className="text-[10px] text-gray-500">Ad Spend Ledger</span>
                </div>
                <FileSpreadsheet className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={exportFinanceCSV}
                className="p-3 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-gray-200 block">Finance P&L CSV</span>
                  <span className="text-[10px] text-gray-500">Earnings & Expenses</span>
                </div>
                <FileSpreadsheet className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Restore / Import Section */}
        <div className="p-5 rounded-2xl bg-gray-950 border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Restore Database from Backup File
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Upload a previous .json backup to restore all your data across all devices
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Select File</span>
            </button>
          </div>

          {/* Confirm restore view */}
          {restoreStatus === "confirming" && parsedBackup && (
            <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
              <p className="font-bold text-amber-300 mb-1">
                Backup file loaded: {parsedBackup.meta?.exportDateFormatted || "Verified Backup"}
              </p>
              <p className="text-gray-300 text-[11px] mb-3">
                Contains {parsedBackup.customers?.length || 0} Clients, {parsedBackup.transactions?.length || 0} Transactions, {parsedBackup.earnings?.length || 0} Earnings, and {parsedBackup.expenses?.length || 0} Expenses.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleConfirmRestore}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all"
                >
                  Confirm & Restore to Cloud
                </button>
                <button
                  onClick={() => {
                    setRestoreStatus("idle");
                    setParsedBackup(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {restoreStatus === "restored" && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{restoreMessage}</span>
            </div>
          )}

          {restoreStatus === "error" && (
            <div className="mt-3 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{restoreMessage}</span>
            </div>
          )}
        </div>

        {/* Client Handover Preparation: Wipe Demo Records to 0 */}
        <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/20 mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full border border-red-500/30">
                  Client Handover Preparation
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mt-1">
                Wipe Demo Data & Reset to 0 Baseline
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5 max-w-md">
                Delete all test clients, wallet records, earnings, and expenses across all devices so the admin portal starts clean at 0.
              </p>
            </div>

            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all shrink-0"
              >
                Reset Everything to 0
              </button>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={async () => {
                    setIsResetting(true);
                    await resetAllDataToZero();
                    setIsResetting(false);
                    setShowResetConfirm(false);
                    setResetSuccess(true);
                    setTimeout(() => setResetSuccess(false), 4000);
                  }}
                  disabled={isResetting}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-md shadow-red-600/30 transition-all"
                >
                  {isResetting ? "Wiping..." : "Yes, Confirm 0 Reset"}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {resetSuccess && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>All test data wiped! Clean ₹0 baseline synced across all devices for handover.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
