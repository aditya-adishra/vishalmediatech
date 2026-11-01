"use client";

import React, { useState, useMemo } from "react";
import { useAgencyContext, CustomerItem, WalletTransactionItem } from "@/lib/agency-context";
import {
  Wallet,
  Users,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Trash2,
  FileText,
  X,
  Building,
  MapPin,
  Phone,
  Mail,
  Download,
  DollarSign,
  TrendingUp,
  CreditCard,
  BarChart3,
  Pencil,
  CheckCircle2,
  Tag,
  Filter,
  ArrowUpDown,
  Calendar
} from "lucide-react";
import { WalletAnalyticsCharts } from "@/components/admin/wallet-analytics-charts";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

const DEFAULT_CLIENT_CATEGORIES = [
  "Real Estate & Builders",
  "Healthcare & Doctors",
  "Coaching & Education",
  "E-Commerce & D2C",
  "Interior Design & Architecture",
  "Restaurants & Cafes",
  "Retail & Showrooms",
  "Salons & Beauty Care",
  "Tours & Travels",
  "Legal & Financial",
  "IT & Digital Services",
  "Automobiles & Motors",
  "Other / Custom"
];

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

export default function AdminCustomersPage() {
  const {
    customers,
    transactions,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addWalletTransaction,
    updateWalletTransaction,
    deleteWalletTransaction,
    restoreFromSafetyVault,
    vaultStats
  } = useAgencyContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "category_asc" | "business_asc" | "balance_desc" | "balance_asc" | "spent_desc"
  >("newest");

  const [showAddCustModal, setShowAddCustModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [selectedCustForTx, setSelectedCustForTx] = useState<CustomerItem | null>(null);
  const [txType, setTxType] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [txDate, setTxDate] = useState<string>(() => new Date().toLocaleDateString("en-IN"));
  const [selectedCustForStatement, setSelectedCustForStatement] = useState<CustomerItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomerItem | null>(null);
  const [deleteTxTarget, setDeleteTxTarget] = useState<WalletTransactionItem | null>(null);

  // Edit Transaction Form State
  const [editingTx, setEditingTx] = useState<WalletTransactionItem | null>(null);
  const [editTxAmount, setEditTxAmount] = useState<number>(0);
  const [editTxDesc, setEditTxDesc] = useState("");
  const [editTxDate, setEditTxDate] = useState("");
  const [editTxType, setEditTxType] = useState<"CREDIT" | "DEBIT">("CREDIT");

  // Edit Customer Form State
  const [editingCust, setEditingCust] = useState<CustomerItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editBusiness, setEditBusiness] = useState("");
  const [editCategory, setEditCategory] = useState("Real Estate & Builders");
  const [customEditCategory, setCustomEditCategory] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCity, setEditCity] = useState("Gorakhpur");
  const [editCampaigns, setEditCampaigns] = useState<number>(1);
  const [editWalletBalance, setEditWalletBalance] = useState<number>(0);

  // New Customer Form State
  const [custName, setCustName] = useState("");
  const [custBusiness, setCustBusiness] = useState("");
  const [custCategory, setCustCategory] = useState("Real Estate & Builders");
  const [customCustCategory, setCustomCustCategory] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custCity, setCustCity] = useState("Gorakhpur");
  const [initialDeposit, setInitialDeposit] = useState<number>(10000);

  // Transaction Form State
  const [txAmount, setTxAmount] = useState<number>(5000);
  const [txDesc, setTxDesc] = useState("");

  // Category counts and distinct list
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    customers.forEach((c) => {
      const cat = c.category?.trim() || "General";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [customers]);

  const existingCategories = useMemo(() => {
    return Object.keys(categoryCounts).sort();
  }, [categoryCounts]);

  // Filtered and Sorted Customers
  const filteredCustomers = useMemo(() => {
    let list = customers.filter((c) => {
      const q = searchTerm.toLowerCase().trim();
      const clientCat = (c.category || "General").toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.business.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        clientCat.includes(q);

      const matchesCategory =
        selectedCategory === "ALL" || (c.category || "General") === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return list.sort((a, b) => {
      if (sortBy === "category_asc") {
        const catA = (a.category || "General").toLowerCase();
        const catB = (b.category || "General").toLowerCase();
        const comp = catA.localeCompare(catB);
        return comp !== 0 ? comp : a.business.localeCompare(b.business);
      }
      if (sortBy === "business_asc") {
        return a.business.localeCompare(b.business);
      }
      if (sortBy === "balance_desc") {
        return b.walletBalance - a.walletBalance;
      }
      if (sortBy === "balance_asc") {
        return a.walletBalance - b.walletBalance;
      }
      if (sortBy === "spent_desc") {
        return b.totalSpent - a.totalSpent;
      }
      if (sortBy === "oldest") {
        return a.id.localeCompare(b.id);
      }
      // "newest" default
      return b.id.localeCompare(a.id);
    });
  }, [customers, searchTerm, selectedCategory, sortBy]);

  // Aggregated Wallet Stats
  const totalAgencyWallet = customers.reduce((sum, c) => sum + c.walletBalance, 0);
  const totalFundsDeposited = customers.reduce((sum, c) => sum + c.totalFunded, 0);
  const totalAdSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custBusiness) return;

    const finalCategory =
      custCategory === "Other / Custom"
        ? customCustCategory.trim() || "General"
        : custCategory;

    addCustomer(
      {
        name: custName,
        business: custBusiness,
        category: finalCategory,
        phone: custPhone || "+91 8655957779",
        email: custEmail || "client@vishalmediatech.com",
        city: custCity,
        activeCampaigns: 1
      },
      Number(initialDeposit) || 0
    );

    setCustName("");
    setCustBusiness("");
    setCustCategory("Real Estate & Builders");
    setCustomCustCategory("");
    setCustPhone("");
    setCustEmail("");
    setCustCity("Gorakhpur");
    setInitialDeposit(10000);
    setShowAddCustModal(false);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustForTx || !txAmount || !txDesc) return;

    addWalletTransaction(
      selectedCustForTx.id,
      txType,
      Number(txAmount),
      txDesc.trim(),
      txDate.trim() || new Date().toLocaleDateString("en-IN")
    );

    setTxAmount(5000);
    setTxDesc("");
    setTxDate(new Date().toLocaleDateString("en-IN"));
    setShowTxModal(false);
    setSelectedCustForTx(null);
  };

  const openTxModalForCust = (cust: CustomerItem, type: "CREDIT" | "DEBIT") => {
    setSelectedCustForTx(cust);
    setTxType(type);
    setTxDate(new Date().toLocaleDateString("en-IN"));
    setTxDesc(type === "CREDIT" ? "Ad Budget Wallet Deposit via UPI/Bank" : "Meta Ads Spend - Gorakhpur Campaign");
    setShowTxModal(true);
  };

  const openEditTxModal = (tx: WalletTransactionItem) => {
    setEditingTx(tx);
    setEditTxAmount(tx.amount);
    setEditTxDesc(tx.description);
    setEditTxDate(tx.date || new Date().toLocaleDateString("en-IN"));
    setEditTxType(tx.type);
  };

  const handleSaveTxEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx || !editTxAmount || !editTxDesc.trim()) return;

    updateWalletTransaction(editingTx.id, {
      amount: Number(editTxAmount),
      description: editTxDesc.trim(),
      date: editTxDate.trim() || editingTx.date,
      type: editTxType
    });

    setEditingTx(null);
  };

  const openEditModal = (cust: CustomerItem) => {
    setEditingCust(cust);
    setEditName(cust.name);
    setEditBusiness(cust.business);
    setEditPhone(cust.phone);
    setEditEmail(cust.email);
    setEditCity(cust.city);
    setEditCampaigns(cust.activeCampaigns || 1);
    setEditWalletBalance(cust.walletBalance || 0);

    const clientCat = cust.category?.trim();
    if (clientCat && DEFAULT_CLIENT_CATEGORIES.includes(clientCat) && clientCat !== "Other / Custom") {
      setEditCategory(clientCat);
      setCustomEditCategory("");
    } else if (clientCat) {
      setEditCategory("Other / Custom");
      setCustomEditCategory(clientCat);
    } else {
      setEditCategory("Real Estate & Builders");
      setCustomEditCategory("");
    }
  };

  const handleSaveCustomerEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCust || !editName.trim() || !editBusiness.trim()) return;

    const finalEditCategory =
      editCategory === "Other / Custom"
        ? customEditCategory.trim() || "General"
        : editCategory;

    updateCustomer(editingCust.id, {
      name: editName.trim(),
      business: editBusiness.trim(),
      category: finalEditCategory,
      phone: editPhone.trim() || editingCust.phone,
      email: editEmail.trim() || editingCust.email,
      city: editCity.trim() || editingCust.city,
      activeCampaigns: Number(editCampaigns) || 1,
      walletBalance: Number(editWalletBalance) >= 0 ? Number(editWalletBalance) : editingCust.walletBalance
    });

    setEditingCust(null);
  };

  const exportCustomersCSV = () => {
    const headers = [
      "Client ID,Business Name,Category,Client Name,City,Phone,Wallet Balance (INR),Total Funded (INR),Total Spent (INR)"
    ];
    const rows = customers.map(
      (c) =>
        `"${c.id}","${c.business}","${c.category || "General"}","${c.name}","${c.city}","${c.phone}","${c.walletBalance}","${c.totalFunded}","${c.totalSpent}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vmt_wallet_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-brand-400 bg-brand-500/20 px-3 py-1 rounded-full border border-brand-500/30">
            Ad Budget Management System
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Customer & Wallet Manager
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">Track client ad deposits, Meta/Google ad spend, and wallet balances</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowAddCustModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>

          <button
            onClick={exportCustomersCSV}
            className="px-4 py-2.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 font-bold text-xs transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 4 Executive Wallet Stat Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Agency Wallet Balance */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black p-5 sm:p-6 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Active Wallet
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">
            ₹{totalAgencyWallet.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-gray-400 font-medium">Total Client Wallet Balance</span>
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
          <span className="text-xs text-gray-400 font-medium">Total Funds Deposited (Credits)</span>
        </div>

        {/* Total Ad Spend Deducted */}
        <div className="bg-gray-900/90 p-5 sm:p-6 rounded-3xl border border-gray-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-400">Meta/Google Ads</span>
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
          <span className="text-xs text-gray-400 font-medium">Active Agency Clients</span>
        </div>

      </div>
      
      {/* Dynamic Ad Budget & Expense Charts Engine (Daily, Weekly, Monthly) */}
      <WalletAnalyticsCharts
        customers={customers}
        transactions={transactions}
      />

      {/* Main Client Wallet Table Container */}
      <div className="bg-gray-900/90 rounded-3xl border border-gray-800 p-5 sm:p-8 shadow-xl space-y-6">
        
        {/* Controls Bar */}
        <div className="space-y-4 pb-6 border-b border-gray-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-white">Client Accounts & Wallet Balances</h3>
              <p className="text-xs text-gray-400">Manage client budget deposits, categories, and track campaign ad spend</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search by client, business, category, city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                />
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Category Filter Select */}
              <div className="relative shrink-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-auto pl-8 pr-8 py-2.5 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white focus:outline-none focus:border-brand-500 appearance-none cursor-pointer font-medium"
                >
                  <option value="ALL">All Categories ({customers.length})</option>
                  {existingCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} ({categoryCounts[cat] || 0})
                    </option>
                  ))}
                  {DEFAULT_CLIENT_CATEGORIES.filter(
                    (c) => c !== "Other / Custom" && !existingCategories.includes(c)
                  ).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} (0)
                    </option>
                  ))}
                </select>
                <Filter className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort Select */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto pl-8 pr-8 py-2.5 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white focus:outline-none focus:border-brand-500 appearance-none cursor-pointer font-medium"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="category_asc">Sort: Category (A → Z)</option>
                  <option value="business_asc">Sort: Business Name (A → Z)</option>
                  <option value="balance_desc">Sort: Highest Wallet</option>
                  <option value="balance_asc">Sort: Lowest Wallet</option>
                  <option value="spent_desc">Sort: Highest Ad Spend</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <span>Category:</span>
            </span>

            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 flex items-center gap-1.5 ${
                selectedCategory === "ALL"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "bg-gray-950 text-gray-400 hover:text-white border border-gray-800"
              }`}
            >
              <span>All</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  selectedCategory === "ALL" ? "bg-white/20 text-white" : "bg-gray-800 text-gray-400"
                }`}
              >
                {customers.length}
              </span>
            </button>

            {existingCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? "ALL" : cat)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                    : "bg-gray-950 text-gray-400 hover:text-white border border-gray-800"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    selectedCategory === cat ? "bg-white/20 text-white" : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {categoryCounts[cat] || 0}
                </span>
                {selectedCategory === cat && <X className="w-3 h-3 text-white ml-0.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Client Wallet Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-[11px] font-extrabold uppercase text-gray-400">
                <th className="py-3 px-4">Business & Client</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Current Wallet Balance</th>
                <th className="py-3 px-4">Total Funded</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4 text-center">Wallet Actions</th>
                <th className="py-3 px-4 text-right">Ledger & Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-xs sm:text-sm">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 text-sm">
                    {vaultStats.customers > 0 ? (
                      <div className="space-y-3 max-w-md mx-auto p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                        <p className="text-emerald-300 font-bold text-xs sm:text-sm">
                          🛡️ Safety Vault: {vaultStats.customers} client record(s) are guarded in your local vault!
                        </p>
                        <p className="text-gray-400 text-xs">
                          Click below to immediately restore them back to your active screen.
                        </p>
                        <button
                          onClick={() => restoreFromSafetyVault()}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
                        >
                          Restore {vaultStats.customers} Clients from Safety Vault
                        </button>
                      </div>
                    ) : (
                      "No client accounts found matching criteria. Click '+ Add New Client' above."
                    )}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-white/5 transition-colors">
                    
                    {/* Business & Client Name */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-extrabold text-white text-sm flex items-center gap-2">
                        <Building className="w-4 h-4 text-brand-500 shrink-0" />
                        <span>{cust.business}</span>
                      </div>
                      <div className="text-xs text-gray-400 font-medium pl-6">
                        {cust.name} • {cust.phone}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                        <Tag className="w-3 h-3 text-brand-400 shrink-0" />
                        <span>{cust.category || "General"}</span>
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-gray-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        {cust.city}
                      </span>
                    </td>

                    {/* Current Wallet Balance */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gray-950 border border-gray-800">
                        <Wallet className={`w-4 h-4 ${cust.walletBalance > 5000 ? "text-emerald-400" : "text-red-400"}`} />
                        <span className={`text-sm font-black ${cust.walletBalance > 5000 ? "text-emerald-400" : "text-red-400"}`}>
                          ₹{cust.walletBalance.toLocaleString("en-IN")}
                        </span>
                      </div>
                      {cust.walletBalance < 5000 && (
                        <span className="block text-[10px] font-bold text-red-400 mt-1">⚠️ Low Budget Alert</span>
                      )}
                    </td>

                    {/* Total Funded */}
                    <td className="py-4 px-4 text-xs font-bold text-gray-300 whitespace-nowrap">
                      ₹{cust.totalFunded.toLocaleString("en-IN")}
                    </td>

                    {/* Total Spent */}
                    <td className="py-4 px-4 text-xs font-bold text-amber-400 whitespace-nowrap">
                      ₹{cust.totalSpent.toLocaleString("en-IN")}
                    </td>

                    {/* Quick Wallet Actions */}
                    <td className="py-4 px-4 text-center whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openTxModalForCust(cust, "CREDIT")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 font-bold text-xs transition-all inline-flex items-center gap-1"
                        title="Add Money to Wallet"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Funds</span>
                      </button>

                      <button
                        onClick={() => openTxModalForCust(cust, "DEBIT")}
                        className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 font-bold text-xs transition-all inline-flex items-center gap-1"
                        title="Deduct Ad Spend"
                      >
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        <span>Deduct Spend</span>
                      </button>
                    </td>

                    {/* Ledger, Edit & Delete */}
                    <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => setSelectedCustForStatement(cust)}
                        className="p-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        title="View Full Wallet Ledger"
                      >
                        <FileText className="w-4 h-4 text-brand-400" />
                      </button>

                      <button
                        onClick={() => openEditModal(cust)}
                        className="p-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-600 hover:text-white transition-colors"
                        title="Edit Client Details"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(cust)}
                        className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete Client Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* CREATE NEW CLIENT MODAL */}
      {showAddCustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-3xl max-w-lg w-full text-white relative shadow-2xl space-y-5">
            <button
              onClick={() => setShowAddCustModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs uppercase font-extrabold text-brand-400 bg-brand-500/20 px-3 py-1 rounded-full border border-brand-500/30">
                New Client Registration
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-2">Add Client Account</h3>
              <p className="text-xs text-gray-400">Register new business for ad budget wallet tracking</p>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Business Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Realty Gorakhpur"
                  value={custBusiness}
                  onChange={(e) => setCustBusiness(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  Business Category / Industry *
                </label>
                <div className="relative">
                  <select
                    value={custCategory}
                    onChange={(e) => setCustCategory(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-white text-xs sm:text-sm focus:outline-none focus:border-brand-500 appearance-none cursor-pointer"
                  >
                    {DEFAULT_CLIENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-gray-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <Tag className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {custCategory === "Other / Custom" && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      placeholder="Enter custom business category (e.g. Solar Energy, Gym & Fitness)"
                      value={customCustCategory}
                      onChange={(e) => setCustomCustCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-gray-950 border border-brand-500/40 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-brand-500"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Client Contact Person *</label>
                  <input
                    type="text"
                    placeholder="e.g. Vikramaditya Singh"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Gorakhpur"
                    value={custCity}
                    onChange={(e) => setCustCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Initial Wallet Deposit (₹)</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-brand-600 text-white font-extrabold text-sm shadow-xl shadow-brand-600/30 hover:bg-brand-500 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Client & Wallet</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* WALLET CREDIT / DEBIT TRANSACTION MODAL */}
      {showTxModal && selectedCustForTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-3xl max-w-lg w-full text-white relative shadow-2xl space-y-5">
            <button
              onClick={() => setShowTxModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full border ${
                txType === "CREDIT"
                  ? "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
                  : "text-red-400 bg-red-500/20 border-red-500/30"
              }`}>
                {txType === "CREDIT" ? "🟢 Add Funds (Credit)" : "🔴 Deduct Ad Spend (Debit)"}
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-2">{selectedCustForTx.business}</h3>
              <p className="text-xs text-gray-400">Current Balance: <strong className="text-white">₹{selectedCustForTx.walletBalance.toLocaleString("en-IN")}</strong></p>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                  {txType === "CREDIT" ? "Deposit Amount (₹) *" : "Ad Spend Deducted (₹) *"}
                </label>
                <input
                  type="number"
                  placeholder="5000"
                  value={txAmount}
                  onChange={(e) => setTxAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-white text-lg font-extrabold focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              {/* Transaction Date Picker (Past or Current Date) */}
              <div className="p-3.5 bg-gray-950 border border-gray-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-400" />
                    <span>Transaction Date (Pick Any Past Date) *</span>
                  </label>
                  <span className="text-[11px] font-extrabold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                    {txDate}
                  </span>
                </div>

                {/* Quick Date Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Quick:</span>
                  <button
                    type="button"
                    onClick={() => setTxDate(getPresetDate(0))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      txDate === getPresetDate(0)
                        ? "bg-brand-600 text-white border-brand-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxDate(getPresetDate(1))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      txDate === getPresetDate(1)
                        ? "bg-brand-600 text-white border-brand-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    Yesterday
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxDate(getPresetDate(2))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      txDate === getPresetDate(2)
                        ? "bg-brand-600 text-white border-brand-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    2 Days Ago
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxDate(getPresetDate(7))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      txDate === getPresetDate(7)
                        ? "bg-brand-600 text-white border-brand-500 shadow-sm"
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
                    value={toDateInputValue(txDate)}
                    onChange={(e) => setTxDate(toDisplayDate(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-900 border border-gray-700 hover:border-gray-600 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 cursor-pointer [color-scheme:dark]"
                  />
                </div>
                <p className="text-[10px] text-gray-400">
                  Tap calendar to select any previous month or date.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Transaction Description *</label>
                <input
                  type="text"
                  placeholder={txType === "CREDIT" ? "e.g. Deposit via Bank Transfer / UPI" : "e.g. Meta Ads Spend - Gorakhpur Villa Leads"}
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full py-4 rounded-2xl font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                  txType === "CREDIT"
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                    : "bg-red-600 hover:bg-red-500 text-white shadow-red-600/30"
                }`}
              >
                <span>{txType === "CREDIT" ? "Confirm Add Funds" : "Confirm Deduct Spend"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CLIENT STATEMENT & LEDGER MODAL */}
      {selectedCustForStatement && (() => {
        const liveCust = customers.find((c) => c.id === selectedCustForStatement.id) || selectedCustForStatement;
        const custTxList = transactions.filter((t) => t.customerId === liveCust.id);

        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-3xl max-w-2xl w-full text-white relative shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustForStatement(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-extrabold text-brand-400 bg-brand-500/20 px-3 py-1 rounded-full border border-brand-500/30">
                  Official Wallet Ledger Statement
                </span>
                <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  🏷️ {liveCust.category || "General"}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-white mt-2">{liveCust.business}</h3>
              <p className="text-xs text-gray-400">Client: {liveCust.name} • City: {liveCust.city}</p>
            </div>

            {/* Wallet Quick Summary Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-gray-950 border border-gray-800 text-center">
              <div>
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Remaining Wallet</span>
                <span className="text-lg font-black text-emerald-400">₹{liveCust.walletBalance.toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Total Funded</span>
                <span className="text-lg font-black text-white">₹{liveCust.totalFunded.toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Total Spent</span>
                <span className="text-lg font-black text-amber-400">₹{liveCust.totalSpent.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Transaction History List */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400">Transaction History ({custTxList.length})</h4>
              
              <div className="space-y-2">
                {custTxList.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">No transactions recorded for this client yet.</p>
                ) : (
                  custTxList.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-2xl bg-gray-950 border border-gray-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          tx.type === "CREDIT" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                        }`}>
                          {tx.type === "CREDIT" ? "+" : "-"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{tx.description}</p>
                          <p className="text-[10px] text-gray-400">{tx.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-sm font-extrabold ${tx.type === "CREDIT" ? "text-emerald-400" : "text-red-400"}`}>
                          {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                        </span>

                        <button
                          onClick={() => openEditTxModal(tx)}
                          className="p-1.5 rounded-xl bg-gray-900 hover:bg-amber-600 text-gray-400 hover:text-white transition-colors"
                          title="Edit Transaction (Date, Amount, Description)"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteTxTarget(tx)}
                          className="p-1.5 rounded-xl bg-gray-900 hover:bg-red-600 text-gray-400 hover:text-white transition-colors"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustForStatement(null)}
                className="px-6 py-2.5 rounded-2xl bg-gray-800 text-white font-bold text-xs hover:bg-gray-700"
              >
                Close Statement
              </button>
            </div>

          </div>
        </div>
        );
      })()}

      {/* EDIT CLIENT DETAILS MODAL */}
      {editingCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-3xl max-w-lg w-full text-white relative shadow-2xl space-y-5 my-8">
            <button
              onClick={() => setEditingCust(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Update Client Profile
              </span>
              <h3 className="text-xl font-extrabold text-white mt-2">
                Edit Client Details
              </h3>
              <p className="text-xs text-gray-400">
                Update business name, contact info, territory, or adjust wallet balance
              </p>
            </div>

            <form onSubmit={handleSaveCustomerEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Business / Company Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editBusiness}
                    onChange={(e) => setEditBusiness(e.target.value)}
                    placeholder="e.g. Apex Realty Gorakhpur"
                    className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                  <Building className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Business Category / Industry *
                </label>
                <div className="relative">
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
                  >
                    {DEFAULT_CLIENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-gray-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <Tag className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {editCategory === "Other / Custom" && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={customEditCategory}
                      onChange={(e) => setCustomEditCategory(e.target.value)}
                      placeholder="Enter custom business category (e.g. Solar Energy, Gym & Fitness)"
                      className="w-full px-4 py-2.5 bg-gray-950 border border-amber-500/40 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Client / Contact Person Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Vikramaditya Singh"
                    className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                  <Users className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    />
                    <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="client@gmail.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    />
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    City / Territory
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      placeholder="e.g. Gorakhpur, Lucknow"
                      className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    />
                    <MapPin className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Active Campaigns
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editCampaigns}
                    onChange={(e) => setEditCampaigns(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Wallet Balance (₹)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={editWalletBalance}
                    onChange={(e) => setEditWalletBalance(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 font-extrabold"
                  />
                  <Wallet className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  You can adjust the wallet funds here, or use "Add Funds / Deduct Spend" for automatic ledger entries.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCust(null)}
                  className="px-5 py-2.5 rounded-2xl bg-gray-800 text-gray-300 hover:text-white font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Client Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TRANSACTION MODAL */}
      {editingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-3xl max-w-lg w-full text-white relative shadow-2xl space-y-5 my-8">
            <button
              onClick={() => setEditingTx(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Update Ledger Record
              </span>
              <h3 className="text-xl font-extrabold text-white mt-2">
                Edit Wallet Transaction
              </h3>
              <p className="text-xs text-gray-400">
                Update transaction date, description, type, or amount. Client wallet balance will automatically recalculate.
              </p>
            </div>

            <form onSubmit={handleSaveTxEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Transaction Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditTxType("CREDIT")}
                    className={`py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      editTxType === "CREDIT"
                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10"
                        : "bg-gray-950 border-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    <span>Credit / Deposit (+₹)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditTxType("DEBIT")}
                    className={`py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      editTxType === "DEBIT"
                        ? "bg-red-600/20 border-red-500 text-red-400 shadow-lg shadow-red-500/10"
                        : "bg-gray-950 border-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Debit / Spend (-₹)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Amount (₹) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    value={editTxAmount}
                    onChange={(e) => setEditTxAmount(Number(e.target.value))}
                    placeholder="5000"
                    className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 font-extrabold"
                  />
                  <DollarSign className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Edit Transaction Date Picker (Past, Previous or Current Date) */}
              <div className="p-3.5 bg-gray-950 border border-gray-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Transaction Date (Pick Any Past Date) *</span>
                  </label>
                  <span className="text-[11px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    {editTxDate}
                  </span>
                </div>

                {/* Quick Date Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Quick:</span>
                  <button
                    type="button"
                    onClick={() => setEditTxDate(getPresetDate(0))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      editTxDate === getPresetDate(0)
                        ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditTxDate(getPresetDate(1))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      editTxDate === getPresetDate(1)
                        ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    Yesterday
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditTxDate(getPresetDate(2))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      editTxDate === getPresetDate(2)
                        ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                        : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
                    }`}
                  >
                    2 Days Ago
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditTxDate(getPresetDate(7))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      editTxDate === getPresetDate(7)
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
                    value={toDateInputValue(editTxDate)}
                    onChange={(e) => setEditTxDate(toDisplayDate(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-900 border border-gray-700 hover:border-gray-600 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer [color-scheme:dark]"
                  />
                </div>
                <p className="text-[10px] text-gray-400">
                  Tap calendar to select any previous month or date.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Description / Reason *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={editTxDesc}
                    onChange={(e) => setEditTxDesc(e.target.value)}
                    placeholder="e.g. Meta Ads Spend - Gorakhpur Villa Leads"
                    className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                  <FileText className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="px-5 py-2.5 rounded-2xl bg-gray-800 text-gray-300 hover:text-white font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Transaction</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE CLIENT MODAL */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Client Account?"
        message="Are you sure you want to permanently delete this client? Their entire ad wallet balance and historical records will be removed."
        itemName={deleteTarget ? `${deleteTarget.business} (${deleteTarget.name})` : undefined}
        onConfirm={() => {
          if (deleteTarget) {
            deleteCustomer(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* CONFIRM DELETE TRANSACTION MODAL */}
      <ConfirmDeleteModal
        isOpen={!!deleteTxTarget}
        title="Delete Transaction Record?"
        message="Are you sure you want to delete this transaction record? The client's wallet balance, total funded, or total spent will be automatically restored."
        itemName={deleteTxTarget ? `${deleteTxTarget.type === "CREDIT" ? "Credit / Deposit" : "Debit / Spend"}: ₹${deleteTxTarget.amount.toLocaleString("en-IN")} (${deleteTxTarget.description})` : undefined}
        onConfirm={() => {
          if (deleteTxTarget) {
            deleteWalletTransaction(deleteTxTarget.id);
            setDeleteTxTarget(null);
          }
        }}
        onCancel={() => setDeleteTxTarget(null)}
      />

    </div>
  );
}
