"use client";

import React, { useState, useMemo } from "react";
import { useAgencyContext, EarningItem, ExpenseItem } from "@/lib/agency-context";
import { CircleGraphAnalytics } from "@/components/admin/circle-graph-analytics";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Trash2,
  Search,
  Download,
  Calendar,
  CreditCard,
  Building,
  Briefcase,
  PieChart,
  X,
  FileText,
  CheckCircle2,
  Tag,
  Settings,
  Sparkles,
  Layers,
  FolderPlus,
  Pencil,
  ArrowUpDown
} from "lucide-react";

// Converts "DD/MM/YYYY" or ISO string to "YYYY-MM-DD" for native HTML5 <input type="date">
function toDateInputValue(dStr: string): string {
  if (!dStr) {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(dStr)) return dStr;
  if (dStr.includes("/")) {
    const parts = dStr.split("/");
    if (parts.length === 3) {
      const day = parts[0].padStart(2, "0");
      const month = parts[1].padStart(2, "0");
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
  }
  const d = new Date(dStr);
  if (!isNaN(d.getTime())) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

// Converts HTML5 "YYYY-MM-DD" to standard "DD/MM/YYYY"
function toDisplayDate(dStr: string): string {
  if (!dStr) return new Date().toLocaleDateString("en-IN");
  if (/^\d{4}-\d{2}-\d{2}$/.test(dStr)) {
    const [y, m, d] = dStr.split("-");
    return `${d}/${m}/${y}`;
  }
  return dStr;
}

// Returns a past or today date formatted as DD/MM/YYYY
function getPresetDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Parses DD/MM/YYYY or YYYY-MM-DD to timestamp for chronological sorting
function parseTimestamp(dStr: string): number {
  if (!dStr) return 0;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dStr)) {
    return new Date(dStr).getTime();
  }
  if (dStr.includes("/")) {
    const parts = dStr.split("/");
    if (parts.length === 3) {
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])).getTime();
    }
  }
  const t = new Date(dStr).getTime();
  return isNaN(t) ? 0 : t;
}

export default function AdminFinancePage() {
  const {
    earnings,
    expenses,
    earningCategories,
    expenseCategories,
    addEarning,
    updateEarning,
    deleteEarning,
    addExpense,
    updateExpense,
    deleteExpense,
    addEarningCategory,
    deleteEarningCategory,
    addExpenseCategory,
    deleteExpenseCategory
  } = useAgencyContext();

  const [activeTab, setActiveTab] = useState<"earnings" | "expenses">("expenses");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Modals state
  const [showAddEarningModal, setShowAddEarningModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showCategoryManagerModal, setShowCategoryManagerModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "earning" | "expense" | "expense_cat" | "earning_cat";
    idOrName: string;
    title: string;
  } | null>(null);

  // New Earning Form State
  const [earnTitle, setEarnTitle] = useState("");
  const [earnClient, setEarnClient] = useState("");
  const [earnCategory, setEarnCategory] = useState<string>(earningCategories[0] || "Meta Ads Retainer");
  const [customEarnCategory, setCustomEarnCategory] = useState("");
  const [isCustomEarnCat, setIsCustomEarnCat] = useState(false);
  const [earnAmount, setEarnAmount] = useState<number>(25000);
  const [earnDate, setEarnDate] = useState<string>(() => new Date().toLocaleDateString("en-IN"));
  const [earnPaymentMethod, setEarnPaymentMethod] = useState<EarningItem["paymentMethod"]>("UPI");
  const [earnNotes, setEarnNotes] = useState("");

  // New Expense Form State
  const [expTitle, setExpTitle] = useState("");
  const [expVendor, setExpVendor] = useState("");
  const [expCategory, setExpCategory] = useState<string>(expenseCategories[0] || "Personal Expenses");
  const [customExpCategory, setCustomExpCategory] = useState("");
  const [isCustomExpCat, setIsCustomExpCat] = useState(false);
  const [expAmount, setExpAmount] = useState<number>(3500);
  const [expDate, setExpDate] = useState<string>(() => new Date().toLocaleDateString("en-IN"));
  const [expPaymentMethod, setExpPaymentMethod] = useState<ExpenseItem["paymentMethod"]>("Credit Card");
  const [expNotes, setExpNotes] = useState("");

  // Edit Expense State
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [editExpTitle, setEditExpTitle] = useState("");
  const [editExpVendor, setEditExpVendor] = useState("");
  const [editExpCategory, setEditExpCategory] = useState("");
  const [customEditExpCat, setCustomEditExpCat] = useState("");
  const [isCustomEditExpCat, setIsCustomEditExpCat] = useState(false);
  const [editExpAmount, setEditExpAmount] = useState<number>(0);
  const [editExpDate, setEditExpDate] = useState("");
  const [editExpPaymentMethod, setEditExpPaymentMethod] = useState<ExpenseItem["paymentMethod"]>("Credit Card");
  const [editExpNotes, setEditExpNotes] = useState("");

  // Edit Earning State
  const [editingEarning, setEditingEarning] = useState<EarningItem | null>(null);
  const [editEarnTitle, setEditEarnTitle] = useState("");
  const [editEarnClient, setEditEarnClient] = useState("");
  const [editEarnCategory, setEditEarnCategory] = useState("");
  const [customEditEarnCat, setCustomEditEarnCat] = useState("");
  const [isCustomEditEarnCat, setIsCustomEditEarnCat] = useState(false);
  const [editEarnAmount, setEditEarnAmount] = useState<number>(0);
  const [editEarnDate, setEditEarnDate] = useState("");
  const [editEarnPaymentMethod, setEditEarnPaymentMethod] = useState<EarningItem["paymentMethod"]>("UPI");
  const [editEarnNotes, setEditEarnNotes] = useState("");

  // Category Manager Tab state
  const [categoryModalTab, setCategoryModalTab] = useState<"expenses" | "earnings">("expenses");
  const [newCatInput, setNewCatInput] = useState("");

  // Financial totals
  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = Math.max(0, totalEarnings - totalExpenses);
  const profitMargin = totalEarnings > 0 ? Math.round((netProfit / totalEarnings) * 100) : 0;

  // Filter & Sort State
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "amount_desc" | "amount_asc">("date_desc");

  // Filtered and Chronologically Sorted lists (supporting previous & past dates)
  const filteredEarnings = useMemo(() => {
    let list = earnings.filter((e) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.client.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.date && e.date.toLowerCase().includes(q));
      const matchesCat = filterCategory === "all" || e.category === filterCategory;
      return matchesSearch && matchesCat;
    });

    return list.sort((a, b) => {
      if (sortBy === "date_desc") return parseTimestamp(b.date) - parseTimestamp(a.date);
      if (sortBy === "date_asc") return parseTimestamp(a.date) - parseTimestamp(b.date);
      if (sortBy === "amount_desc") return b.amount - a.amount;
      if (sortBy === "amount_asc") return a.amount - b.amount;
      return 0;
    });
  }, [earnings, searchTerm, filterCategory, sortBy]);

  const filteredExpenses = useMemo(() => {
    let list = expenses.filter((e) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.vendor.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.date && e.date.toLowerCase().includes(q));
      const matchesCat = filterCategory === "all" || e.category === filterCategory;
      return matchesSearch && matchesCat;
    });

    return list.sort((a, b) => {
      if (sortBy === "date_desc") return parseTimestamp(b.date) - parseTimestamp(a.date);
      if (sortBy === "date_asc") return parseTimestamp(a.date) - parseTimestamp(b.date);
      if (sortBy === "amount_desc") return b.amount - a.amount;
      if (sortBy === "amount_asc") return a.amount - b.amount;
      return 0;
    });
  }, [expenses, searchTerm, filterCategory, sortBy]);

  const handleCreateEarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!earnTitle || !earnAmount) return;

    let finalCat = earnCategory;
    if (isCustomEarnCat && customEarnCategory.trim()) {
      finalCat = customEarnCategory.trim();
      addEarningCategory(finalCat);
    }

    addEarning({
      title: earnTitle.trim(),
      client: earnClient.trim() || "Direct Client",
      category: finalCat,
      amount: Number(earnAmount),
      date: earnDate.trim() || new Date().toLocaleDateString("en-IN"),
      paymentMethod: earnPaymentMethod,
      notes: earnNotes.trim()
    });

    setEarnTitle("");
    setEarnClient("");
    setEarnAmount(25000);
    setEarnNotes("");
    setEarnDate(new Date().toLocaleDateString("en-IN"));
    setIsCustomEarnCat(false);
    setCustomEarnCategory("");
    setShowAddEarningModal(false);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;

    let finalCat = expCategory;
    if (isCustomExpCat && customExpCategory.trim()) {
      finalCat = customExpCategory.trim();
      addExpenseCategory(finalCat);
    }

    addExpense({
      title: expTitle.trim(),
      vendor: expVendor.trim() || "Self / Vendor",
      category: finalCat,
      amount: Number(expAmount),
      date: expDate.trim() || new Date().toLocaleDateString("en-IN"),
      paymentMethod: expPaymentMethod,
      notes: expNotes.trim()
    });

    setExpTitle("");
    setExpVendor("");
    setExpAmount(3500);
    setExpNotes("");
    setExpDate(new Date().toLocaleDateString("en-IN"));
    setIsCustomExpCat(false);
    setCustomExpCategory("");
    setShowAddExpenseModal(false);
  };

  const openEditExpense = (item: ExpenseItem) => {
    setEditingExpense(item);
    setEditExpTitle(item.title);
    setEditExpVendor(item.vendor);
    setEditExpAmount(item.amount);
    setEditExpDate(item.date || new Date().toLocaleDateString("en-IN"));
    setEditExpPaymentMethod(item.paymentMethod);
    setEditExpNotes(item.notes || "");
    if (expenseCategories.includes(item.category)) {
      setEditExpCategory(item.category);
      setIsCustomEditExpCat(false);
      setCustomEditExpCat("");
    } else {
      setEditExpCategory("__NEW__");
      setIsCustomEditExpCat(true);
      setCustomEditExpCat(item.category);
    }
  };

  const handleSaveExpenseEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense || !editExpTitle.trim() || !editExpAmount) return;

    let finalCat = editExpCategory;
    if (isCustomEditExpCat && customEditExpCat.trim()) {
      finalCat = customEditExpCat.trim();
      addExpenseCategory(finalCat);
    }

    updateExpense(editingExpense.id, {
      title: editExpTitle.trim(),
      vendor: editExpVendor.trim() || "Self / Vendor",
      category: finalCat,
      amount: Number(editExpAmount),
      date: editExpDate.trim() || editingExpense.date,
      paymentMethod: editExpPaymentMethod,
      notes: editExpNotes.trim()
    });

    setEditingExpense(null);
  };

  const openEditEarning = (item: EarningItem) => {
    setEditingEarning(item);
    setEditEarnTitle(item.title);
    setEditEarnClient(item.client);
    setEditEarnAmount(item.amount);
    setEditEarnDate(item.date || new Date().toLocaleDateString("en-IN"));
    setEditEarnPaymentMethod(item.paymentMethod);
    setEditEarnNotes(item.notes || "");
    if (earningCategories.includes(item.category)) {
      setEditEarnCategory(item.category);
      setIsCustomEditEarnCat(false);
      setCustomEditEarnCat("");
    } else {
      setEditEarnCategory("__NEW__");
      setIsCustomEditEarnCat(true);
      setCustomEditEarnCat(item.category);
    }
  };

  const handleSaveEarningEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEarning || !editEarnTitle.trim() || !editEarnAmount) return;

    let finalCat = editEarnCategory;
    if (isCustomEditEarnCat && customEditEarnCat.trim()) {
      finalCat = customEditEarnCat.trim();
      addEarningCategory(finalCat);
    }

    updateEarning(editingEarning.id, {
      title: editEarnTitle.trim(),
      client: editEarnClient.trim() || "Direct Client",
      category: finalCat,
      amount: Number(editEarnAmount),
      date: editEarnDate.trim() || editingEarning.date,
      paymentMethod: editEarnPaymentMethod,
      notes: editEarnNotes.trim()
    });

    setEditingEarning(null);
  };

  const handleAddNewCategoryFromManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;

    if (categoryModalTab === "expenses") {
      addExpenseCategory(newCatInput.trim());
    } else {
      addEarningCategory(newCatInput.trim());
    }
    setNewCatInput("");
  };

  const exportFinancialCSV = () => {
    let headers: string[];
    let rows: string[];

    if (activeTab === "earnings") {
      headers = ["ID,Title,Client,Category,Amount (INR),Date,Payment Method,Notes"];
      rows = earnings.map(
        (e) =>
          `"${e.id}","${e.title}","${e.client}","${e.category}","${e.amount}","${e.date}","${e.paymentMethod}","${e.notes || ""}"`
      );
    } else {
      headers = ["ID,Title,Vendor,Category,Amount (INR),Date,Payment Method,Notes"];
      rows = expenses.map(
        (e) =>
          `"${e.id}","${e.title}","${e.vendor}","${e.category}","${e.amount}","${e.date}","${e.paymentMethod}","${e.notes || ""}"`
      );
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vmt_${activeTab}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto text-white">
      
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
            Agency & Personal Finance Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Earnings & Expenses Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Manage agency revenue, personal/business expenses, and create custom categories for circle graph analysis
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowCategoryManagerModal(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 font-bold text-xs transition-all flex items-center gap-2 shadow"
            title="Create and manage your own custom categories"
          >
            <Tag className="w-4 h-4 text-brand-400" />
            <span>Manage Categories</span>
          </button>

          <button
            onClick={() => {
              setIsCustomExpCat(false);
              setCustomExpCategory("");
              setShowAddExpenseModal(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Expense</span>
          </button>

          <button
            onClick={() => {
              setIsCustomEarnCat(false);
              setCustomEarnCategory("");
              setShowAddEarningModal(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Earning</span>
          </button>

          <button
            onClick={exportFinancialCSV}
            className="px-3.5 py-2.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-gray-400 border border-gray-800 font-bold text-xs transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black p-5 sm:p-6 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Revenue Inflow
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">
            ₹{totalEarnings.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-gray-400 font-medium">Total Gross Earnings ({earnings.length} entries)</span>
        </div>

        {/* Total Expenses */}
        <div className="bg-gray-900/90 p-5 sm:p-6 rounded-3xl border border-gray-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              Personal & Agency
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-rose-400 block">
            ₹{totalExpenses.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-gray-400 font-medium">Total Expenses ({expenses.length} bills)</span>
        </div>

        {/* Net Profit */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black p-5 sm:p-6 rounded-3xl border border-brand-500/30 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/30">
              Net Profit
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white block">
            ₹{netProfit.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-gray-400 font-medium">Earnings minus Expenses</span>
        </div>

        {/* Profit Margin */}
        <div className="bg-gray-900/90 p-5 sm:p-6 rounded-3xl border border-gray-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Savings Margin
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-400 block">{profitMargin}%</span>
          <span className="text-xs text-gray-400 font-medium">Retained Profit Efficiency</span>
        </div>

      </div>

      {/* Circle Graph Analytics Engine */}
      <CircleGraphAnalytics earnings={earnings} expenses={expenses} />

      {/* Financial Records Ledger (Tabs: Earnings vs Expenses) */}
      <div className="bg-gray-900/90 rounded-3xl border border-gray-800 p-5 sm:p-8 shadow-xl space-y-6">
        
        {/* Ledger Navigation, Category Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-6 border-b border-gray-800">
          
          {/* Tab Switcher */}
          <div className="flex items-center bg-gray-950 p-1.5 rounded-2xl border border-gray-800 w-fit">
            <button
              onClick={() => {
                setActiveTab("expenses");
                setFilterCategory("all");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "expenses"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Expenses Register ({expenses.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("earnings");
                setFilterCategory("all");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "earnings"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Earnings Register ({earnings.length})</span>
            </button>
          </div>

          {/* Category Filter, Sort & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Category Dropdown Filter */}
            <div className="flex items-center gap-1.5 bg-gray-950 px-3 py-2 rounded-2xl border border-gray-800 text-xs">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-transparent text-gray-200 font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="all" className="bg-gray-900 text-white">All Categories</option>
                {(activeTab === "expenses" ? expenseCategories : earningCategories).map((c) => (
                  <option key={c} value={c} className="bg-gray-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-gray-950 px-3 py-2 rounded-2xl border border-gray-800 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-gray-200 font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="date_desc" className="bg-gray-900 text-white">Date: Newest First</option>
                <option value="date_asc" className="bg-gray-900 text-white">Date: Oldest First</option>
                <option value="amount_desc" className="bg-gray-900 text-white">Amount: High to Low</option>
                <option value="amount_asc" className="bg-gray-900 text-white">Amount: Low to High</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search title, payee, date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

          </div>

        </div>

        {/* EXPENSES TABLE */}
        {activeTab === "expenses" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-950/80 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4 font-bold rounded-l-xl">Expense Title & Payee</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Amount</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Method</th>
                  <th className="py-3 px-4 font-bold text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredExpenses.map((item) => {
                  const isPersonal = item.category === "Personal Expenses";
                  return (
                    <tr key={item.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{item.title}</span>
                          {isPersonal && (
                            <span className="text-[10px] bg-pink-500/20 text-pink-400 border border-pink-500/30 px-2 py-0.5 rounded-full font-bold">
                              Personal
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <Tag className="w-3 h-3 text-rose-400" />
                          <span>{item.vendor}</span>
                          {item.notes && <span className="text-gray-500 italic">· {item.notes}</span>}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          isPersonal
                            ? "bg-pink-500/10 text-pink-400 border-pink-500/30"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-rose-400 text-sm">
                        -₹{item.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-gray-300 font-medium">
                        {item.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-gray-300 bg-gray-950 px-2 py-0.5 rounded-lg border border-gray-800">
                          {item.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => openEditExpense(item)}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors inline-block"
                          title="Edit Expense Details (Date, Name, Amount, etc.)"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: "expense", idOrName: item.id, title: `${item.title} (-₹${item.amount.toLocaleString("en-IN")})` })}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors inline-block"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* EARNINGS TABLE */}
        {activeTab === "earnings" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-950/80 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4 font-bold rounded-l-xl">Earning Stream & Client</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Amount</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Method</th>
                  <th className="py-3 px-4 font-bold text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredEarnings.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{item.title}</div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3 h-3 text-brand-400" />
                        <span>{item.client}</span>
                        {item.notes && <span className="text-gray-500 italic">· {item.notes}</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">
                      +₹{item.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-gray-300 font-medium">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-gray-300 bg-gray-950 px-2 py-0.5 rounded-lg border border-gray-800">
                        {item.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openEditEarning(item)}
                        className="p-1.5 rounded-xl text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors inline-block"
                        title="Edit Earning Details (Date, Name, Amount, etc.)"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: "earning", idOrName: item.id, title: `${item.title} (+₹${item.amount.toLocaleString("en-IN")})` })}
                        className="p-1.5 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors inline-block"
                        title="Delete Earning"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* MODAL: Add New Expense (with custom category support) */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ArrowDownRight className="w-5 h-5 text-rose-400" />
                  <span>Record Expense</span>
                </h3>
                <p className="text-xs text-gray-400">Log personal expenses or business operational costs</p>
              </div>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Expense Title / Purpose *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gym membership, Groceries, Canva Pro, Office rent..."
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Payee / Vendor</label>
                  <input
                    type="text"
                    placeholder="e.g. Self, Supermarket, Landlord, Tool..."
                    value={expVendor}
                    onChange={(e) => setExpVendor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-300">Category</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomExpCat(!isCustomExpCat)}
                      className="text-[11px] font-bold text-brand-400 hover:underline"
                    >
                      {isCustomExpCat ? "Choose Existing" : "+ New Category"}
                    </button>
                  </div>

                  {isCustomExpCat ? (
                    <input
                      type="text"
                      required
                      placeholder="Type custom category name..."
                      value={customExpCategory}
                      onChange={(e) => setCustomExpCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-950 border border-brand-500 rounded-xl text-xs text-white focus:outline-none"
                    />
                  ) : (
                    <select
                      value={expCategory}
                      onChange={(e) => {
                        if (e.target.value === "__NEW__") {
                          setIsCustomExpCat(true);
                        } else {
                          setExpCategory(e.target.value);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                    >
                      {expenseCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat} {cat === "Personal Expenses" ? "⭐" : ""}
                        </option>
                      ))}
                      <option value="__NEW__" className="text-brand-400 font-bold">
                        + Type New Custom Category...
                      </option>
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-rose-400 font-bold focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Payment Method</label>
                  <select
                    value={expPaymentMethod}
                    onChange={(e) => setExpPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Net Banking">Net Banking / Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              {/* Expense Date Picker (Past, Previous or Current Date) */}
              <div className="p-3.5 bg-gray-950 border border-gray-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <span>Expense Date (Pick Any Past Date) *</span>
                  </label>
                  <span className="text-[11px] font-extrabold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    {expDate}
                  </span>
                </div>

                {/* Quick Date Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Quick:</span>
                  <button
                    type="button"
                    onClick={() => setExpDate(getPresetDate(0))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      expDate === getPresetDate(0)
                        ? "bg-rose-600 text-white border-rose-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpDate(getPresetDate(1))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      expDate === getPresetDate(1)
                        ? "bg-rose-600 text-white border-rose-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    Yesterday
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpDate(getPresetDate(2))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      expDate === getPresetDate(2)
                        ? "bg-rose-600 text-white border-rose-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    2 Days Ago
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpDate(getPresetDate(7))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      expDate === getPresetDate(7)
                        ? "bg-rose-600 text-white border-rose-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    1 Week Ago
                  </button>
                </div>

                <div className="relative pt-0.5">
                  <input
                    type="date"
                    required
                    value={toDateInputValue(expDate)}
                    onChange={(e) => setExpDate(toDisplayDate(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-900 border border-gray-700 hover:border-gray-600 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 cursor-pointer [color-scheme:dark]"
                  />
                </div>
                <p className="text-[10px] text-gray-400">
                  Tap calendar to select any previous month or date.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Monthly bill, Personal grocery, Cash receipt"
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add New Earning (with custom category support) */}
      {showAddEarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                  <span>Record Earning</span>
                </h3>
                <p className="text-xs text-gray-400">Add client payment, freelance income, or project retainer</p>
              </div>
              <button
                onClick={() => setShowAddEarningModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEarning} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Earning Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Realty - Monthly Meta Ads Retainer"
                  value={earnTitle}
                  onChange={(e) => setEarnTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Client Name / Source *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Realty Group"
                    value={earnClient}
                    onChange={(e) => setEarnClient(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-300">Category</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomEarnCat(!isCustomEarnCat)}
                      className="text-[11px] font-bold text-brand-400 hover:underline"
                    >
                      {isCustomEarnCat ? "Choose Existing" : "+ New Category"}
                    </button>
                  </div>

                  {isCustomEarnCat ? (
                    <input
                      type="text"
                      required
                      placeholder="Type custom category name..."
                      value={customEarnCategory}
                      onChange={(e) => setCustomEarnCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-950 border border-brand-500 rounded-xl text-xs text-white focus:outline-none"
                    />
                  ) : (
                    <select
                      value={earnCategory}
                      onChange={(e) => {
                        if (e.target.value === "__NEW__") {
                          setIsCustomEarnCat(true);
                        } else {
                          setEarnCategory(e.target.value);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      {earningCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__NEW__" className="text-brand-400 font-bold">
                        + Type New Custom Category...
                      </option>
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={earnAmount}
                    onChange={(e) => setEarnAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Payment Method</label>
                  <select
                    value={earnPaymentMethod}
                    onChange={(e) => setEarnPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                    <option value="UPI">UPI (GooglePay / PhonePe)</option>
                    <option value="Cash">Cash</option>
                    <option value="Stripe">Stripe / Online</option>
                  </select>
                </div>
              </div>

              {/* Earning Date Picker (Past, Previous or Current Date) */}
              <div className="p-3.5 bg-gray-950 border border-gray-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Earning Date (Pick Any Past Date) *</span>
                  </label>
                  <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {earnDate}
                  </span>
                </div>

                {/* Quick Date Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Quick:</span>
                  <button
                    type="button"
                    onClick={() => setEarnDate(getPresetDate(0))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      earnDate === getPresetDate(0)
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setEarnDate(getPresetDate(1))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      earnDate === getPresetDate(1)
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    Yesterday
                  </button>
                  <button
                    type="button"
                    onClick={() => setEarnDate(getPresetDate(2))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      earnDate === getPresetDate(2)
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    2 Days Ago
                  </button>
                  <button
                    type="button"
                    onClick={() => setEarnDate(getPresetDate(7))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      earnDate === getPresetDate(7)
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    1 Week Ago
                  </button>
                </div>

                <div className="relative pt-0.5">
                  <input
                    type="date"
                    required
                    value={toDateInputValue(earnDate)}
                    onChange={(e) => setEarnDate(toDisplayDate(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-900 border border-gray-700 hover:border-gray-600 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer [color-scheme:dark]"
                  />
                </div>
                <p className="text-[10px] text-gray-400">
                  Tap calendar to select any previous month or date.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Campaign setup fee included"
                  value={earnNotes}
                  onChange={(e) => setEarnNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddEarningModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
                >
                  Save Earning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Expense Record */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-amber-400" />
                  <span>Edit Expense Record</span>
                </h3>
                <p className="text-xs text-gray-400">Update expense title, amount, payee, category or date</p>
              </div>
              <button
                onClick={() => setEditingExpense(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-white bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExpenseEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Expense Title / Purpose *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gym membership, Office rent..."
                  value={editExpTitle}
                  onChange={(e) => setEditExpTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Payee / Vendor</label>
                  <input
                    type="text"
                    placeholder="e.g. Self, Supermarket, Landlord..."
                    value={editExpVendor}
                    onChange={(e) => setEditExpVendor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-300">Category</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomEditExpCat(!isCustomEditExpCat)}
                      className="text-[11px] font-bold text-brand-400 hover:underline"
                    >
                      {isCustomEditExpCat ? "Choose Existing" : "+ New Category"}
                    </button>
                  </div>

                  {isCustomEditExpCat ? (
                    <input
                      type="text"
                      required
                      placeholder="Type custom category name..."
                      value={customEditExpCat}
                      onChange={(e) => setCustomEditExpCat(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-950 border border-amber-500 rounded-xl text-xs text-white focus:outline-none"
                    />
                  ) : (
                    <select
                      value={editExpCategory}
                      onChange={(e) => {
                        if (e.target.value === "__NEW__") {
                          setIsCustomEditExpCat(true);
                        } else {
                          setEditExpCategory(e.target.value);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {expenseCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat} {cat === "Personal Expenses" ? "⭐" : ""}
                        </option>
                      ))}
                      <option value="__NEW__" className="text-brand-400 font-bold">
                        + Type New Custom Category...
                      </option>
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editExpAmount}
                    onChange={(e) => setEditExpAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-rose-400 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Payment Method</label>
                  <select
                    value={editExpPaymentMethod}
                    onChange={(e) => setEditExpPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Net Banking">Net Banking / Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              {/* Edit Expense Date Picker (Past, Previous or Current Date) */}
              <div className="p-3.5 bg-gray-950 border border-gray-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Expense Date (Pick Any Past Date) *</span>
                  </label>
                  <span className="text-[11px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    {editExpDate}
                  </span>
                </div>

                {/* Quick Date Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Quick:</span>
                  <button
                    type="button"
                    onClick={() => setEditExpDate(getPresetDate(0))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      editExpDate === getPresetDate(0)
                        ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditExpDate(getPresetDate(1))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      editExpDate === getPresetDate(1)
                        ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    Yesterday
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditExpDate(getPresetDate(2))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      editExpDate === getPresetDate(2)
                        ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    2 Days Ago
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditExpDate(getPresetDate(7))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      editExpDate === getPresetDate(7)
                        ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    1 Week Ago
                  </button>
                </div>

                <div className="relative pt-0.5">
                  <input
                    type="date"
                    required
                    value={toDateInputValue(editExpDate)}
                    onChange={(e) => setEditExpDate(toDisplayDate(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-900 border border-gray-700 hover:border-gray-600 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer [color-scheme:dark]"
                  />
                </div>
                <p className="text-[10px] text-gray-400">
                  Tap calendar to select any previous month or date.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Monthly bill, Personal grocery..."
                  value={editExpNotes}
                  onChange={(e) => setEditExpNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Expense</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Earning Record */}
      {editingEarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-amber-400" />
                  <span>Edit Earning Record</span>
                </h3>
                <p className="text-xs text-gray-400">Update client payment, freelance income, amount, or date</p>
              </div>
              <button
                onClick={() => setEditingEarning(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-white bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEarningEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Earning Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Realty - Monthly Meta Ads Retainer"
                  value={editEarnTitle}
                  onChange={(e) => setEditEarnTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Client Name / Source *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Realty Group"
                    value={editEarnClient}
                    onChange={(e) => setEditEarnClient(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-300">Category</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomEditEarnCat(!isCustomEditEarnCat)}
                      className="text-[11px] font-bold text-brand-400 hover:underline"
                    >
                      {isCustomEditEarnCat ? "Choose Existing" : "+ New Category"}
                    </button>
                  </div>

                  {isCustomEditEarnCat ? (
                    <input
                      type="text"
                      required
                      placeholder="Type custom category name..."
                      value={customEditEarnCat}
                      onChange={(e) => setCustomEditEarnCat(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-950 border border-amber-500 rounded-xl text-xs text-white focus:outline-none"
                    />
                  ) : (
                    <select
                      value={editEarnCategory}
                      onChange={(e) => {
                        if (e.target.value === "__NEW__") {
                          setIsCustomEditEarnCat(true);
                        } else {
                          setEditEarnCategory(e.target.value);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {earningCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__NEW__" className="text-brand-400 font-bold">
                        + Type New Custom Category...
                      </option>
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editEarnAmount}
                    onChange={(e) => setEditEarnAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-emerald-400 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Payment Method</label>
                  <select
                    value={editEarnPaymentMethod}
                    onChange={(e) => setEditEarnPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                    <option value="UPI">UPI (GooglePay / PhonePe)</option>
                    <option value="Cash">Cash</option>
                    <option value="Stripe">Stripe / Online</option>
                  </select>
                </div>
              </div>

              {/* Edit Earning Date Picker (Past, Previous or Current Date) */}
              <div className="p-3.5 bg-gray-950 border border-gray-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Earning Date (Pick Any Past Date) *</span>
                  </label>
                  <span className="text-[11px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    {editEarnDate}
                  </span>
                </div>

                {/* Quick Date Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Quick:</span>
                  <button
                    type="button"
                    onClick={() => setEditEarnDate(getPresetDate(0))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      editEarnDate === getPresetDate(0)
                        ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditEarnDate(getPresetDate(1))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      editEarnDate === getPresetDate(1)
                        ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    Yesterday
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditEarnDate(getPresetDate(2))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      editEarnDate === getPresetDate(2)
                        ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    2 Days Ago
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditEarnDate(getPresetDate(7))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      editEarnDate === getPresetDate(7)
                        ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    1 Week Ago
                  </button>
                </div>

                <div className="relative pt-0.5">
                  <input
                    type="date"
                    required
                    value={toDateInputValue(editEarnDate)}
                    onChange={(e) => setEditEarnDate(toDisplayDate(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-900 border border-gray-700 hover:border-gray-600 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer [color-scheme:dark]"
                  />
                </div>
                <p className="text-[10px] text-gray-400">
                  Tap calendar to select any previous month or date.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Campaign setup fee included"
                  value={editEarnNotes}
                  onChange={(e) => setEditEarnNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingEarning(null)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Earning</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CATEGORY MANAGER (Create & Delete Custom Categories) */}
      {showCategoryManagerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-brand-400" />
                  <span>Custom Category Manager</span>
                </h3>
                <p className="text-xs text-gray-400">Add personal, business, or household expense & income categories</p>
              </div>
              <button
                onClick={() => setShowCategoryManagerModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Switch between Expenses and Earnings categories */}
            <div className="flex items-center bg-gray-950 p-1.5 rounded-2xl border border-gray-800">
              <button
                type="button"
                onClick={() => setCategoryModalTab("expenses")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  categoryModalTab === "expenses"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Expense Categories ({expenseCategories.length})
              </button>
              <button
                type="button"
                onClick={() => setCategoryModalTab("earnings")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  categoryModalTab === "earnings"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Earning Categories ({earningCategories.length})
              </button>
            </div>

            {/* Add New Category Input */}
            <form onSubmit={handleAddNewCategoryFromManager} className="flex items-center gap-2">
              <input
                type="text"
                required
                placeholder={`Type new ${categoryModalTab === "expenses" ? "expense" : "earning"} category name (e.g. Gym, Travel, House Rent)...`}
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-md shadow-brand-600/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            {/* List of Active Categories */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Active Categories (Click ✕ to remove)
              </span>

              <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto p-2 bg-gray-950 rounded-2xl border border-gray-800/80">
                {(categoryModalTab === "expenses" ? expenseCategories : earningCategories).map((cat) => (
                  <span
                    key={cat}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      cat === "Personal Expenses"
                        ? "bg-pink-500/20 text-pink-300 border-pink-500/40"
                        : "bg-gray-900 text-gray-200 border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteTarget({
                          type: categoryModalTab === "expenses" ? "expense_cat" : "earning_cat",
                          idOrName: cat,
                          title: `Category: "${cat}"`
                        });
                      }}
                      className="text-gray-400 hover:text-rose-400 transition-colors ml-1"
                      title={`Delete category: ${cat}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCategoryManagerModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-800 text-white text-xs font-bold hover:bg-gray-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title={
          deleteTarget?.type === "expense"
            ? "Delete Expense Record?"
            : deleteTarget?.type === "earning"
            ? "Delete Earning Record?"
            : "Delete Custom Category?"
        }
        message="Are you sure you want to permanently delete this? This action cannot be undone."
        itemName={deleteTarget?.title}
        onConfirm={() => {
          if (deleteTarget) {
            if (deleteTarget.type === "expense") deleteExpense(deleteTarget.idOrName);
            else if (deleteTarget.type === "earning") deleteEarning(deleteTarget.idOrName);
            else if (deleteTarget.type === "expense_cat") deleteExpenseCategory(deleteTarget.idOrName);
            else if (deleteTarget.type === "earning_cat") deleteEarningCategory(deleteTarget.idOrName);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
}
