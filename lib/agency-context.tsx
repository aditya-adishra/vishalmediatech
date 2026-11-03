"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  ServiceItem,
  PortfolioItem,
  TestimonialItem,
  FAQItem
} from "@/types";

export interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  date: string;
  status: "New" | "Contacted" | "Converted";
}

export interface PhotoItem {
  id: string;
  url: string;
  title: string;
  category: string;
}

export interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  client: string;
  thumbnail: string;
  views: string;
  duration: string;
  category: string;
}

export interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  business: string;
  category?: string;
  city: string;
  walletBalance: number;
  totalFunded: number;
  totalSpent: number;
  activeCampaigns: number;
  createdAt: string;
}

export interface WalletTransactionItem {
  id: string;
  customerId: string;
  customerName: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  description: string;
  date: string;
}

export interface EarningItem {
  id: string;
  title: string;
  category: string;
  amount: number;
  client: string;
  date: string;
  paymentMethod: "Bank Transfer" | "UPI" | "Cash" | "Stripe";
  notes?: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: string;
  amount: number;
  vendor: string;
  date: string;
  paymentMethod: "Credit Card" | "UPI" | "Net Banking" | "Cash";
  notes?: string;
}

export type SyncStatus = "synced" | "syncing" | "error" | "offline";

interface AgencyContextType {
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  testimonials: TestimonialItem[];
  faqs: FAQItem[];
  photos: PhotoItem[];
  videos: VideoItem[];
  leads: LeadItem[];
  customers: CustomerItem[];
  transactions: WalletTransactionItem[];
  earnings: EarningItem[];
  expenses: ExpenseItem[];
  earningCategories: string[];
  expenseCategories: string[];
  isLoggedIn: boolean;
  authLoading: boolean;
  login: (passcode: string) => boolean;
  logout: () => void;

  // Cloud Synchronization state & controls
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  syncNow: () => Promise<void>;

  // Zero-Loss Safety Vault & Cloud Recovery
  restoreFromSafetyVault: () => boolean;
  healCloudDatabase: () => Promise<void>;
  vaultStats: {
    customers: number;
    transactions: number;
    earnings: number;
    expenses: number;
    leads: number;
    lastSaved: string | null;
  };

  // Full Data Backup & Restore
  downloadFullBackupJSON: () => void;
  restoreBackupJSON: (backupData: any) => Promise<boolean>;
  resetAllDataToZero: () => Promise<void>;

  // CRUD Functions
  addService: (service: Omit<ServiceItem, "id">) => void;
  deleteService: (id: string) => void;

  addPortfolio: (item: Omit<PortfolioItem, "id">) => void;
  deletePortfolio: (id: string) => void;

  addTestimonial: (item: Omit<TestimonialItem, "id">) => void;
  deleteTestimonial: (id: string) => void;

  addFAQ: (item: FAQItem) => void;
  deleteFAQ: (question: string) => void;

  addPhoto: (item: Omit<PhotoItem, "id">) => void;
  deletePhoto: (id: string) => void;

  addVideo: (item: Omit<VideoItem, "id">) => void;
  deleteVideo: (id: string) => void;

  addLead: (lead: Omit<LeadItem, "id" | "date" | "status">) => void;
  updateLeadStatus: (id: string, status: LeadItem["status"]) => void;
  deleteLead: (id: string) => void;

  // Customer & Wallet Operations
  addCustomer: (customer: Omit<CustomerItem, "id" | "walletBalance" | "totalFunded" | "totalSpent" | "createdAt">, initialDeposit?: number) => void;
  updateCustomer: (id: string, updatedFields: Partial<Omit<CustomerItem, "id" | "createdAt">>) => void;
  deleteCustomer: (id: string) => void;
  addWalletTransaction: (customerId: string, type: "CREDIT" | "DEBIT", amount: number, description: string, date?: string) => void;
  updateWalletTransaction: (id: string, updatedFields: Partial<Omit<WalletTransactionItem, "id" | "customerId">>) => void;
  deleteWalletTransaction: (id: string) => void;

  // Earnings & Expenses Operations
  addEarning: (earning: Omit<EarningItem, "id" | "date"> & { date?: string }) => void;
  updateEarning: (id: string, updatedFields: Partial<Omit<EarningItem, "id">>) => void;
  deleteEarning: (id: string) => void;
  addExpense: (expense: Omit<ExpenseItem, "id" | "date"> & { date?: string }) => void;
  updateExpense: (id: string, updatedFields: Partial<Omit<ExpenseItem, "id">>) => void;
  deleteExpense: (id: string) => void;

  // Dynamic Categories Management
  addEarningCategory: (category: string) => void;
  deleteEarningCategory: (category: string) => void;
  addExpenseCategory: (category: string) => void;
  deleteExpenseCategory: (category: string) => void;
}

// Initial Default Seed Data
const initialServices: ServiceItem[] = [
  {
    id: "web-dev",
    title: "Website Development",
    description: "Custom, ultra-fast, mobile-optimized business websites and web applications built to turn visitors into paying customers.",
    iconName: "Code",
    badge: "High Converting",
    features: ["Custom React / Next.js Architecture", "100% Mobile & Tablet Responsive", "Fast Loading Speed (< 1.5s)", "Integrated Lead Forms & CRM"]
  },
  {
    id: "landing-page",
    title: "Landing Page Design",
    description: "High-impact, high-converting landing pages specifically designed for Google & Meta ad campaign conversion optimization.",
    iconName: "Layout",
    badge: "Top ROAS",
    features: ["Conversion-Focused UX Copywriting", "A/B Testing Ready", "Instant Load Time Optimization", "Lead Capture Integration"]
  },
  {
    id: "seo",
    title: "Search Engine Optimization",
    description: "Rank #1 on Google for high-intent keywords in your local market (Gorakhpur, Khalilabad, Basti) to drive predictable organic revenue.",
    iconName: "Search",
    badge: "Organic Growth",
    features: ["Technical SEO & Schema Audits", "On-Page Keyword Optimization", "High Authority Backlink Building", "Google Business Profile Local SEO"]
  },
  {
    id: "meta-ads",
    title: "Meta Ads Management",
    description: "Highly targeted Facebook & Instagram ad campaigns by Vishal Jaiswal (4+ yrs exp) that generate high-quality WhatsApp leads.",
    iconName: "Megaphone",
    badge: "4.8x Avg ROAS",
    features: ["Audience Targeting & Retargeting", "Ad Creative & Video Scripting", "Conversion API Setup", "Daily Budget & Bid Tuning"]
  },
  {
    id: "google-ads",
    title: "Google Ads (PPC)",
    description: "Capture high-intent buyers searching for your exact services on Google Search, Maps, and YouTube.",
    iconName: "MousePointerClick",
    badge: "Instant Traffic",
    features: ["Search & Display Campaigns", "Negative Keyword Filtering", "Quality Score Optimization", "Call & Lead Extension Tracking"]
  },
  {
    id: "smm",
    title: "Social Media Marketing",
    description: "Build an authoritative, recognizable brand presence across Instagram, Facebook, and LinkedIn with viral content.",
    iconName: "Share2",
    badge: "Brand Building",
    features: ["Custom Content Calendar Design", "Reels & Short Video Scripting", "Community Engagement", "Monthly Analytics Reporting"]
  }
];

const initialPortfolio: PortfolioItem[] = [
  {
    id: "proj-1",
    title: "Apex Realty Group Gorakhpur",
    client: "Apex Real Estate Ltd.",
    category: "Real Estate & Lead Gen",
    technologies: ["Next.js 15", "Meta Ads", "Google Ads", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    results: "+420 High-Intent Luxury Villa Enquiries in 30 Days",
    description: "Designed a high-end luxury property showcase platform coupled with targeted Facebook & Instagram lead ads for Gorakhpur market.",
    liveUrl: "#contact"
  },
  {
    id: "proj-2",
    title: "Dr. Sharma Dental SuperSpecialty",
    client: "Dr. Sharma Dental Clinics",
    category: "Doctors & Healthcare",
    technologies: ["React", "Local SEO", "WhatsApp API", "Meta Ads"],
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    results: "180+ Monthly New Patient Appointments Booked",
    description: "Complete digital transformation for a multi-specialty dental clinic.",
    liveUrl: "#contact"
  },
  {
    id: "proj-3",
    title: "Zenith Interior Studios Khalilabad",
    client: "Zenith Design & Infra",
    category: "Interior Designers",
    technologies: ["Next.js", "Instagram Ads", "Branding", "Framer Motion"],
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    results: "5.4x ROAS on Premium Interior Consultation Campaign",
    description: "Visual portfolio site showcasing 3D architectural renders paired with hyper-targeted Instagram Video Reels ads.",
    liveUrl: "#contact"
  }
];

const initialTestimonials: TestimonialItem[] = [
  {
    id: "test-1",
    name: "Vikramaditya Singh",
    business: "Apex Realty Gorakhpur",
    role: "Managing Director",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    review: "Vishal Jaiswal completely transformed our lead generation in Gorakhpur. Within 30 days of launching Meta Ads, we received over 400 verified inquiries!",
    growthMetric: "+420 High Intent Leads"
  },
  {
    id: "test-2",
    name: "Dr. Ananya Sharma",
    business: "Sharma Dental Clinics",
    role: "Founder & Chief Surgeon",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    review: "Vishal Media Tech keeps our patient appointment calendar booked 3 weeks in advance through Meta Ads and WhatsApp automation.",
    growthMetric: "180+ Appointments / Mo"
  }
];

const initialFAQs: FAQItem[] = [
  {
    question: "What digital marketing services does Vishal Media Tech offer?",
    answer: "We offer full-suite digital growth solutions including Custom Website Development, Landing Page Design, Meta Ads (Facebook & Instagram), Google Ads (PPC), Search Engine Optimization (SEO), Social Media Management, Branding, WhatsApp Business API Automation, and AI Customer Chatbots.",
    category: "Services"
  },
  {
    question: "How long does it take to design and launch a new business website?",
    answer: "Our typical delivery timeline for a custom, high-converting business website or landing page is 7 to 14 days. We work in sprints so your business can start capturing leads as quickly as possible.",
    category: "Website Dev"
  }
];

const initialPhotos: PhotoItem[] = [
  {
    id: "ph-1",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    title: "Strategy Sprint Session",
    category: "Team Culture"
  },
  {
    id: "ph-2",
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    title: "Client Campaign Review",
    category: "Meta Ads Planning"
  },
  {
    id: "ph-3",
    url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    title: "UX & Web Engineering",
    category: "Development HQ"
  }
];

const initialVideos: VideoItem[] = [
  {
    id: "vid-1",
    youtubeId: "dQw4w9WgXcQ",
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
  }
];

const initialLeads: LeadItem[] = [];

const initialCustomers: CustomerItem[] = [];
const initialTransactions: WalletTransactionItem[] = [];
const initialEarnings: EarningItem[] = [];
const initialExpenses: ExpenseItem[] = [];

const initialExpenseCategories: string[] = [
  "Personal Expenses",
  "Software & AI Tools",
  "Freelancer & Team",
  "Office & Rent",
  "Travel & Fuel",
  "Food & Dining",
  "Equipment & Gear",
  "Marketing & Ads",
  "Family & Household",
  "Other"
];

const initialEarningCategories: string[] = [
  "Meta Ads Retainer",
  "Website Development",
  "SEO & Content",
  "Brand Strategy",
  "Consulting",
  "Personal Income / Freelancing",
  "Other"
];

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

export function AgencyProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(initialPortfolio);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs);
  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [customers, setCustomers] = useState<CustomerItem[]>(initialCustomers);
  const [transactions, setTransactions] = useState<WalletTransactionItem[]>(initialTransactions);
  const [earnings, setEarnings] = useState<EarningItem[]>(initialEarnings);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [earningCategories, setEarningCategories] = useState<string[]>(initialEarningCategories);
  const [expenseCategories, setExpenseCategories] = useState<string[]>(initialExpenseCategories);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vmt_auth") === "true" || document.cookie.includes("vmt_auth=true");
    }
    return false;
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Cloud Sync state
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("synced");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Track the timestamp of recent local mutations to avoid race condition overwrites
  const lastLocalMutationTimeRef = useRef<number>(0);
  const isSyncingRef = useRef<boolean>(false);
  const lastCloudHashRef = useRef<string>("");

  // Live mutable refs to ensure asynchronous callbacks and background sync always see fresh data
  const customersRef = useRef<CustomerItem[]>(customers);
  const transactionsRef = useRef<WalletTransactionItem[]>(transactions);
  const earningsRef = useRef<EarningItem[]>(earnings);
  const expensesRef = useRef<ExpenseItem[]>(expenses);
  const leadsRef = useRef<LeadItem[]>(leads);

  useEffect(() => { customersRef.current = customers; }, [customers]);
  useEffect(() => { transactionsRef.current = transactions; }, [transactions]);
  useEffect(() => { earningsRef.current = earnings; }, [earnings]);
  useEffect(() => { expensesRef.current = expenses; }, [expenses]);
  useEffect(() => { leadsRef.current = leads; }, [leads]);

  const isLoggedInRef = useRef<boolean>(isLoggedIn);
  useEffect(() => { isLoggedInRef.current = isLoggedIn; }, [isLoggedIn]);
  const lastFetchTimeRef = useRef<number>(0);

  // Persistent Zero-Loss Safety Vault Keys
  const SAFETY_VAULT_KEY = "vmt_safety_vault_v2";
  const DELETED_KEYS_PREFIX = "vmt_deleted_";

  const getDeletedIds = (type: string): Set<string> => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem(`${DELETED_KEYS_PREFIX}${type}`);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (e) {
      return new Set();
    }
  };

  const recordDeletedId = (type: string, id: string) => {
    if (typeof window === "undefined") return;
    try {
      const ids = getDeletedIds(type);
      ids.add(id);
      localStorage.setItem(`${DELETED_KEYS_PREFIX}${type}`, JSON.stringify(Array.from(ids)));
    } catch (e) {}
  };

  const [vaultStats, setVaultStats] = useState<{
    customers: number;
    transactions: number;
    earnings: number;
    expenses: number;
    leads: number;
    lastSaved: string | null;
  }>({
    customers: 0,
    transactions: 0,
    earnings: 0,
    expenses: 0,
    leads: 0,
    lastSaved: null
  });

  // Helper: Write records into the permanent local safety vault (never touched by empty cloud fetches)
  const updateSafetyVault = useCallback((data: {
    customers?: CustomerItem[];
    transactions?: WalletTransactionItem[];
    earnings?: EarningItem[];
    expenses?: ExpenseItem[];
    leads?: LeadItem[];
  }) => {
    if (typeof window === "undefined") return;
    try {
      const existing = localStorage.getItem(SAFETY_VAULT_KEY);
      const prev = existing ? JSON.parse(existing) : {};
      const updatedVault = {
        customers: data.customers !== undefined ? data.customers : (prev.customers || customersRef.current),
        transactions: data.transactions !== undefined ? data.transactions : (prev.transactions || transactionsRef.current),
        earnings: data.earnings !== undefined ? data.earnings : (prev.earnings || earningsRef.current),
        expenses: data.expenses !== undefined ? data.expenses : (prev.expenses || expensesRef.current),
        leads: data.leads !== undefined ? data.leads : (prev.leads || leadsRef.current),
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(SAFETY_VAULT_KEY, JSON.stringify(updatedVault));
      setVaultStats({
        customers: updatedVault.customers.length,
        transactions: updatedVault.transactions.length,
        earnings: updatedVault.earnings.length,
        expenses: updatedVault.expenses.length,
        leads: updatedVault.leads.length,
        lastSaved: updatedVault.lastSaved
      });
    } catch (e) {
      console.warn("Safety vault update failed:", e);
    }
  }, []);

  // Helper: Persist all state collections to local storage and Safety Vault
  const saveToLocalStorage = useCallback((data: {
    services?: ServiceItem[];
    portfolio?: PortfolioItem[];
    testimonials?: TestimonialItem[];
    faqs?: FAQItem[];
    photos?: PhotoItem[];
    videos?: VideoItem[];
    leads?: LeadItem[];
    customers?: CustomerItem[];
    transactions?: WalletTransactionItem[];
    earnings?: EarningItem[];
    expenses?: ExpenseItem[];
    earningCategories?: string[];
    expenseCategories?: string[];
  }) => {
    try {
      if (data.services) localStorage.setItem("vmt_services", JSON.stringify(data.services));
      if (data.portfolio) localStorage.setItem("vmt_portfolio", JSON.stringify(data.portfolio));
      if (data.testimonials) localStorage.setItem("vmt_testimonials", JSON.stringify(data.testimonials));
      if (data.faqs) localStorage.setItem("vmt_faqs", JSON.stringify(data.faqs));
      if (data.photos) localStorage.setItem("vmt_photos", JSON.stringify(data.photos));
      if (data.videos) localStorage.setItem("vmt_videos", JSON.stringify(data.videos));
      if (data.leads) localStorage.setItem("vmt_leads", JSON.stringify(data.leads));
      if (data.customers) localStorage.setItem("vmt_customers", JSON.stringify(data.customers));
      if (data.transactions) localStorage.setItem("vmt_transactions", JSON.stringify(data.transactions));
      if (data.earnings) localStorage.setItem("vmt_earnings", JSON.stringify(data.earnings));
      if (data.expenses) localStorage.setItem("vmt_expenses", JSON.stringify(data.expenses));
      if (data.earningCategories) localStorage.setItem("vmt_earning_categories", JSON.stringify(data.earningCategories));
      if (data.expenseCategories) localStorage.setItem("vmt_expense_categories", JSON.stringify(data.expenseCategories));

      // Always snapshot to Safety Vault when records are present
      updateSafetyVault({
        customers: data.customers,
        transactions: data.transactions,
        earnings: data.earnings,
        expenses: data.expenses,
        leads: data.leads
      });
    } catch (e) {
      console.warn("localStorage save failed:", e);
    }
  }, [updateSafetyVault]);

  // Sync current complete state payload to the cloud API
  const pushStateToCloud = useCallback(async (customPayload?: any) => {
    try {
      setSyncStatus("syncing");
      isSyncingRef.current = true;

      const payload = customPayload || {
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads: leadsRef.current,
        customers: customersRef.current,
        transactions: transactionsRef.current,
        earnings: earningsRef.current,
        expenses: expensesRef.current,
        earningCategories,
        expenseCategories
      };

      const res = await fetch("/api/agency/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSyncStatus("synced");
        const now = new Date();
        setLastSyncedAt(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      } else {
        setSyncStatus("error");
      }
    } catch (err) {
      console.error("pushStateToCloud error:", err);
      setSyncStatus("error");
    } finally {
      isSyncingRef.current = false;
    }
  }, [
    services,
    portfolio,
    testimonials,
    faqs,
    photos,
    videos,
    earningCategories,
    expenseCategories
  ]);

  // Fetch the latest cloud data with Anti-Wipe Protection and Smart-Merge
  const fetchCloudData = useCallback(async (isBackground: boolean = false, isForce: boolean = false) => {
    // If a local mutation was made less than 4 seconds ago, skip background fetch to avoid racing
    if (Date.now() - lastLocalMutationTimeRef.current < 4000) {
      return;
    }

    // Rate-limiting throttle: skip repetitive fetches within 10 seconds unless explicitly forced
    const now = Date.now();
    if (!isForce && now - lastFetchTimeRef.current < 10000) {
      return;
    }
    lastFetchTimeRef.current = now;

    try {
      if (!isBackground) setSyncStatus("syncing");

      // For admin / forced refresh, bust cache; for normal visitors, use edge-cached endpoint
      const shouldBustCache = isForce || isLoggedInRef.current;
      const url = shouldBustCache ? `/api/agency/sync?force=true&t=${now}` : `/api/agency/sync`;

      const res = await fetch(url, {
        cache: shouldBustCache ? "no-store" : "default",
        headers: shouldBustCache ? { "Cache-Control": "no-cache, no-store, must-revalidate" } : undefined
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const cloud = json.data;

          const currentCust = customersRef.current;
          const currentTx = transactionsRef.current;
          const currentEarn = earningsRef.current;
          const currentExp = expensesRef.current;
          const currentLeads = leadsRef.current;

          const cloudCust: CustomerItem[] = Array.isArray(cloud.customers) ? cloud.customers : [];
          const cloudTx: WalletTransactionItem[] = Array.isArray(cloud.transactions) ? cloud.transactions : [];
          const cloudEarn: EarningItem[] = Array.isArray(cloud.earnings) ? cloud.earnings : [];
          const cloudExp: ExpenseItem[] = Array.isArray(cloud.expenses) ? cloud.expenses : [];
          const cloudLeads: LeadItem[] = Array.isArray(cloud.leads) ? cloud.leads : [];

          // ANTI-WIPE GUARD:
          // If cloud has 0 records, but local has records (e.g. serverless cold start):
          // NEVER wipe local records! Instead, heal the cloud by pushing local data!
          // Strictly restricted to authenticated admin sessions to prevent anonymous visitors from pushing
          const hasLocalRecords = currentCust.length > 0 || currentTx.length > 0 || currentEarn.length > 0 || currentExp.length > 0;
          const isCloudEmpty = cloudCust.length === 0 && cloudTx.length === 0 && cloudEarn.length === 0 && cloudExp.length === 0;

          if (isLoggedInRef.current && hasLocalRecords && (isCloudEmpty || json.isFreshBaseline)) {
            console.log("Anti-Wipe Guard: Preserving local records and healing cloud database!");
            await pushStateToCloud({
              ...cloud,
              customers: currentCust,
              transactions: currentTx,
              earnings: currentEarn,
              expenses: currentExp,
              leads: currentLeads
            });
            setSyncStatus("synced");
            return;
          }

          // SMART MERGE BY ID - No records ever vanish silently
          // 1. Customers:
          const deletedCustIds = getDeletedIds("customer");
          const custMap = new Map<string, CustomerItem>();
          cloudCust.forEach((c) => {
            if (!deletedCustIds.has(c.id)) custMap.set(c.id, c);
          });
          currentCust.forEach((c) => {
            if (!deletedCustIds.has(c.id)) {
              if (!custMap.has(c.id)) {
                custMap.set(c.id, c); // preserve local
              } else {
                const cloudC = custMap.get(c.id)!;
                if (c.totalSpent > cloudC.totalSpent || c.totalFunded > cloudC.totalFunded || c.walletBalance > cloudC.walletBalance) {
                  custMap.set(c.id, c);
                }
              }
            }
          });
          const mergedCustomers = Array.from(custMap.values());

          // 2. Transactions:
          const deletedTxIds = getDeletedIds("transaction");
          const txMap = new Map<string, WalletTransactionItem>();
          cloudTx.forEach((t) => {
            if (!deletedTxIds.has(t.id)) txMap.set(t.id, t);
          });
          currentTx.forEach((t) => {
            if (!deletedTxIds.has(t.id) && !txMap.has(t.id)) {
              txMap.set(t.id, t);
            }
          });
          const mergedTransactions = Array.from(txMap.values());

          // 3. Earnings:
          const deletedEarnIds = getDeletedIds("earning");
          const earnMap = new Map<string, EarningItem>();
          cloudEarn.forEach((e) => {
            if (!deletedEarnIds.has(e.id)) earnMap.set(e.id, e);
          });
          currentEarn.forEach((e) => {
            if (!deletedEarnIds.has(e.id) && !earnMap.has(e.id)) {
              earnMap.set(e.id, e);
            }
          });
          const mergedEarnings = Array.from(earnMap.values());

          // 4. Expenses:
          const deletedExpIds = getDeletedIds("expense");
          const expMap = new Map<string, ExpenseItem>();
          cloudExp.forEach((x) => {
            if (!deletedExpIds.has(x.id)) expMap.set(x.id, x);
          });
          currentExp.forEach((x) => {
            if (!deletedExpIds.has(x.id) && !expMap.has(x.id)) {
              expMap.set(x.id, x);
            }
          });
          const mergedExpenses = Array.from(expMap.values());

          // 5. Leads:
          const deletedLeadIds = getDeletedIds("lead");
          const leadMap = new Map<string, LeadItem>();
          cloudLeads.forEach((l) => {
            if (!deletedLeadIds.has(l.id)) leadMap.set(l.id, l);
          });
          currentLeads.forEach((l) => {
            if (!deletedLeadIds.has(l.id) && !leadMap.has(l.id)) {
              leadMap.set(l.id, l);
            }
          });
          const mergedLeads = Array.from(leadMap.values());

          // Static CMS items
          if (cloud.services && Array.isArray(cloud.services)) setServices(cloud.services);
          if (cloud.portfolio && Array.isArray(cloud.portfolio)) setPortfolio(cloud.portfolio);
          if (cloud.testimonials && Array.isArray(cloud.testimonials)) setTestimonials(cloud.testimonials);
          if (cloud.faqs && Array.isArray(cloud.faqs)) setFaqs(cloud.faqs);
          if (cloud.photos && Array.isArray(cloud.photos)) setPhotos(cloud.photos);
          if (cloud.videos && Array.isArray(cloud.videos)) setVideos(cloud.videos);
          if (cloud.earningCategories && Array.isArray(cloud.earningCategories)) setEarningCategories(cloud.earningCategories);
          if (cloud.expenseCategories && Array.isArray(cloud.expenseCategories)) setExpenseCategories(cloud.expenseCategories);

          // Update dynamic collections
          setCustomers(mergedCustomers);
          setTransactions(mergedTransactions);
          setEarnings(mergedEarnings);
          setExpenses(mergedExpenses);
          setLeads(mergedLeads);

          saveToLocalStorage({
            customers: mergedCustomers,
            transactions: mergedTransactions,
            earnings: mergedEarnings,
            expenses: mergedExpenses,
            leads: mergedLeads
          });

          setSyncStatus("synced");
          const now = new Date();
          setLastSyncedAt(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
          return;
        }
      }

      setSyncStatus("synced");
    } catch (err) {
      console.warn("fetchCloudData error:", err);
      if (!isBackground) setSyncStatus("error");
    }
  }, [pushStateToCloud, saveToLocalStorage]);

  // Initial mount: Hydrate from localStorage & Safety Vault, then fetch cloud data
  useEffect(() => {
    try {
      const storedServices = localStorage.getItem("vmt_services");
      if (storedServices) setServices(JSON.parse(storedServices));

      const storedPortfolio = localStorage.getItem("vmt_portfolio");
      if (storedPortfolio) setPortfolio(JSON.parse(storedPortfolio));

      const storedTestimonials = localStorage.getItem("vmt_testimonials");
      if (storedTestimonials) setTestimonials(JSON.parse(storedTestimonials));

      const storedFaqs = localStorage.getItem("vmt_faqs");
      if (storedFaqs) setFaqs(JSON.parse(storedFaqs));

      const storedPhotos = localStorage.getItem("vmt_photos");
      if (storedPhotos) setPhotos(JSON.parse(storedPhotos));

      const storedVideos = localStorage.getItem("vmt_videos");
      if (storedVideos) setVideos(JSON.parse(storedVideos));

      // Hydrate dynamic records with Safety Vault Auto-Recovery
      let localCust: CustomerItem[] = [];
      const storedCustomers = localStorage.getItem("vmt_customers");
      if (storedCustomers) {
        try { localCust = JSON.parse(storedCustomers); } catch (e) {}
      }

      let localTx: WalletTransactionItem[] = [];
      const storedTransactions = localStorage.getItem("vmt_transactions");
      if (storedTransactions) {
        try { localTx = JSON.parse(storedTransactions); } catch (e) {}
      }

      let localEarn: EarningItem[] = [];
      const storedEarnings = localStorage.getItem("vmt_earnings");
      if (storedEarnings) {
        try { localEarn = JSON.parse(storedEarnings); } catch (e) {}
      }

      let localExp: ExpenseItem[] = [];
      const storedExpenses = localStorage.getItem("vmt_expenses");
      if (storedExpenses) {
        try { localExp = JSON.parse(storedExpenses); } catch (e) {}
      }

      let localLeads: LeadItem[] = [];
      const storedLeads = localStorage.getItem("vmt_leads");
      if (storedLeads) {
        try { localLeads = JSON.parse(storedLeads); } catch (e) {}
      }

      // Check Safety Vault for any missing records
      const rawVault = localStorage.getItem(SAFETY_VAULT_KEY);
      if (rawVault) {
        try {
          const vault = JSON.parse(rawVault);
          if (localCust.length === 0 && Array.isArray(vault.customers) && vault.customers.length > 0) {
            console.log("Auto-recovered customers from Safety Vault!");
            localCust = vault.customers;
            localStorage.setItem("vmt_customers", JSON.stringify(localCust));
          }
          if (localTx.length === 0 && Array.isArray(vault.transactions) && vault.transactions.length > 0) {
            localTx = vault.transactions;
            localStorage.setItem("vmt_transactions", JSON.stringify(localTx));
          }
          if (localEarn.length === 0 && Array.isArray(vault.earnings) && vault.earnings.length > 0) {
            localEarn = vault.earnings;
            localStorage.setItem("vmt_earnings", JSON.stringify(localEarn));
          }
          if (localExp.length === 0 && Array.isArray(vault.expenses) && vault.expenses.length > 0) {
            localExp = vault.expenses;
            localStorage.setItem("vmt_expenses", JSON.stringify(localExp));
          }
          setVaultStats({
            customers: (vault.customers || []).length,
            transactions: (vault.transactions || []).length,
            earnings: (vault.earnings || []).length,
            expenses: (vault.expenses || []).length,
            leads: (vault.leads || []).length,
            lastSaved: vault.lastSaved || null
          });
        } catch (e) {}
      }

      setCustomers(localCust);
      setTransactions(localTx);
      setEarnings(localEarn);
      setExpenses(localExp);
      setLeads(localLeads);

      const storedEarnCats = localStorage.getItem("vmt_earning_categories");
      if (storedEarnCats) setEarningCategories(JSON.parse(storedEarnCats));

      const storedExpCats = localStorage.getItem("vmt_expense_categories");
      if (storedExpCats) setExpenseCategories(JSON.parse(storedExpCats));

      const storedAuth = localStorage.getItem("vmt_auth");
      const cookieAuth = typeof document !== "undefined" && document.cookie.includes("vmt_auth=true");
      if (storedAuth === "true" || cookieAuth) {
        setIsLoggedIn(true);
        try {
          localStorage.setItem("vmt_auth", "true");
        } catch (e) {}
      }
    } catch (e) {
      console.warn("Initial localStorage hydrate failed:", e);
    } finally {
      setAuthLoading(false);
    }

    // Fetch global cloud data once on initial mount
    fetchCloudData(false, false);
  }, [fetchCloudData]);

  // Multi-device real-time sync: Gentle polling ONLY for authenticated admin sessions
  useEffect(() => {
    if (!isLoggedIn) return;

    // Check every 90 seconds in background ONLY if tab is currently visible
    const pollInterval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchCloudData(true, false);
      }
    }, 90000);

    // Tab focus listener: When admin returns to tab, pull fresh data if >30s since last fetch
    const handleFocus = () => {
      if (Date.now() - lastFetchTimeRef.current > 30000) {
        fetchCloudData(false, false);
      }
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isLoggedIn, fetchCloudData]);

  // Zero-Loss Recovery Actions
  const restoreFromSafetyVault = (): boolean => {
    if (typeof window === "undefined") return false;
    try {
      const raw = localStorage.getItem(SAFETY_VAULT_KEY);
      if (!raw) return false;
      const vault = JSON.parse(raw);
      if (!vault) return false;

      let restoredAny = false;
      if (Array.isArray(vault.customers) && vault.customers.length > 0) {
        setCustomers(vault.customers);
        restoredAny = true;
      }
      if (Array.isArray(vault.transactions) && vault.transactions.length > 0) {
        setTransactions(vault.transactions);
        restoredAny = true;
      }
      if (Array.isArray(vault.earnings) && vault.earnings.length > 0) {
        setEarnings(vault.earnings);
        restoredAny = true;
      }
      if (Array.isArray(vault.expenses) && vault.expenses.length > 0) {
        setExpenses(vault.expenses);
        restoredAny = true;
      }
      if (Array.isArray(vault.leads) && vault.leads.length > 0) {
        setLeads(vault.leads);
        restoredAny = true;
      }

      if (restoredAny) {
        saveToLocalStorage(vault);
        pushStateToCloud(vault);
        return true;
      }
      return false;
    } catch (e) {
      console.error("restoreFromSafetyVault error:", e);
      return false;
    }
  };

  const healCloudDatabase = async () => {
    await pushStateToCloud({
      customers: customersRef.current,
      transactions: transactionsRef.current,
      earnings: earningsRef.current,
      expenses: expensesRef.current,
      leads: leadsRef.current,
      services,
      portfolio,
      testimonials,
      photos,
      videos,
      faqs,
      earningCategories,
      expenseCategories
    });
  };

  // Auth Operations - Only Vishal@7779 allowed
  const login = (passcode: string) => {
    if (passcode === "Vishal@7779") {
      setIsLoggedIn(true);
      try {
        localStorage.setItem("vmt_auth", "true");
        document.cookie = "vmt_auth=true; path=/; max-age=2592000; SameSite=Lax";
      } catch (e) {}
      // When admin logs in, pull absolute latest cloud data
      fetchCloudData(false, true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem("vmt_auth");
      document.cookie = "vmt_auth=; path=/; max-age=0; SameSite=Lax";
    } catch (e) {}
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  };

  // Full Data Backup JSON Exporter
  const downloadFullBackupJSON = () => {
    try {
      const backupPayload = {
        meta: {
          system: "Vishal Media Tech Portal",
          exportDate: new Date().toISOString(),
          exportDateFormatted: new Date().toLocaleString("en-IN"),
          totalClients: customers.length,
          totalTransactions: transactions.length,
          totalEarnings: earnings.length,
          totalExpenses: expenses.length,
          version: "2.0"
        },
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories,
        services,
        portfolio,
        testimonials,
        photos,
        videos,
        faqs,
        leads
      };

      const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
      const dateTag = new Date().toISOString().slice(0, 10);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonStr);
      downloadAnchor.setAttribute("download", `vishal_media_tech_backup_${dateTag}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
    } catch (err) {
      console.error("Backup download error:", err);
    }
  };

  // Full Data Restore from JSON Backup
  const restoreBackupJSON = async (backupData: any): Promise<boolean> => {
    if (!backupData || typeof backupData !== "object") {
      return false;
    }

    try {
      const newCustomers = Array.isArray(backupData.customers) ? backupData.customers : customers;
      const newTransactions = Array.isArray(backupData.transactions) ? backupData.transactions : transactions;
      const newEarnings = Array.isArray(backupData.earnings) ? backupData.earnings : earnings;
      const newExpenses = Array.isArray(backupData.expenses) ? backupData.expenses : expenses;
      const newEarnCats = Array.isArray(backupData.earningCategories) ? backupData.earningCategories : earningCategories;
      const newExpCats = Array.isArray(backupData.expenseCategories) ? backupData.expenseCategories : expenseCategories;
      const newServices = Array.isArray(backupData.services) ? backupData.services : services;
      const newPortfolio = Array.isArray(backupData.portfolio) ? backupData.portfolio : portfolio;
      const newTestimonials = Array.isArray(backupData.testimonials) ? backupData.testimonials : testimonials;
      const newPhotos = Array.isArray(backupData.photos) ? backupData.photos : photos;
      const newVideos = Array.isArray(backupData.videos) ? backupData.videos : videos;
      const newFaqs = Array.isArray(backupData.faqs) ? backupData.faqs : faqs;

      setCustomers(newCustomers);
      setTransactions(newTransactions);
      setEarnings(newEarnings);
      setExpenses(newExpenses);
      setEarningCategories(newEarnCats);
      setExpenseCategories(newExpCats);
      setServices(newServices);
      setPortfolio(newPortfolio);
      setTestimonials(newTestimonials);
      setPhotos(newPhotos);
      setVideos(newVideos);
      setFaqs(newFaqs);

      const fullPayload = {
        customers: newCustomers,
        transactions: newTransactions,
        earnings: newEarnings,
        expenses: newExpenses,
        earningCategories: newEarnCats,
        expenseCategories: newExpCats,
        services: newServices,
        portfolio: newPortfolio,
        testimonials: newTestimonials,
        photos: newPhotos,
        videos: newVideos,
        faqs: newFaqs,
        leads
      };

      saveToLocalStorage(fullPayload);
      await pushStateToCloud(fullPayload);
      return true;
    } catch (err) {
      console.error("restoreBackupJSON error:", err);
      return false;
    }
  };

  // Reset all client / financial test records to 0 for clean client handover
  const resetAllDataToZero = async () => {
    lastLocalMutationTimeRef.current = Date.now();
    setCustomers([]);
    setTransactions([]);
    setEarnings([]);
    setExpenses([]);
    setLeads([]);

    const cleanPayload = {
      customers: [],
      transactions: [],
      earnings: [],
      expenses: [],
      leads: [],
      earningCategories,
      expenseCategories,
      services,
      portfolio,
      testimonials,
      photos,
      videos,
      faqs
    };

    saveToLocalStorage(cleanPayload);
    await pushStateToCloud(cleanPayload);
  };

  // Manual Trigger for UI "Sync Now" button
  const syncNow = async () => {
    await fetchCloudData(false, true);
  };

  // Helper for applying mutations and broadcasting to Cloud
  const triggerMutation = (
    updateLocal: () => void,
    getPayloadForCloud: () => any
  ) => {
    lastLocalMutationTimeRef.current = Date.now();
    updateLocal();
    const payload = getPayloadForCloud();
    pushStateToCloud(payload);
  };

  // CRUD Operations
  const addService = (item: Omit<ServiceItem, "id">) => {
    const newItem = { ...item, id: `serv-${Date.now()}` };
    const updated = [newItem, ...services];
    triggerMutation(
      () => {
        setServices(updated);
        saveToLocalStorage({ services: updated });
      },
      () => ({
        services: updated,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const deleteService = (id: string) => {
    const updated = services.filter((s) => s.id !== id);
    triggerMutation(
      () => {
        setServices(updated);
        saveToLocalStorage({ services: updated });
      },
      () => ({
        services: updated,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const addPortfolio = (item: Omit<PortfolioItem, "id">) => {
    const newItem = { ...item, id: `port-${Date.now()}` };
    const updated = [newItem, ...portfolio];
    triggerMutation(
      () => {
        setPortfolio(updated);
        saveToLocalStorage({ portfolio: updated });
      },
      () => ({
        services,
        portfolio: updated,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const deletePortfolio = (id: string) => {
    const updated = portfolio.filter((p) => p.id !== id);
    triggerMutation(
      () => {
        setPortfolio(updated);
        saveToLocalStorage({ portfolio: updated });
      },
      () => ({
        services,
        portfolio: updated,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const addTestimonial = (item: Omit<TestimonialItem, "id">) => {
    const newItem = { ...item, id: `test-${Date.now()}` };
    const updated = [newItem, ...testimonials];
    triggerMutation(
      () => {
        setTestimonials(updated);
        saveToLocalStorage({ testimonials: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials: updated,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const deleteTestimonial = (id: string) => {
    const updated = testimonials.filter((t) => t.id !== id);
    triggerMutation(
      () => {
        setTestimonials(updated);
        saveToLocalStorage({ testimonials: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials: updated,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const addFAQ = (item: FAQItem) => {
    const updated = [item, ...faqs];
    triggerMutation(
      () => {
        setFaqs(updated);
        saveToLocalStorage({ faqs: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs: updated,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const deleteFAQ = (question: string) => {
    const updated = faqs.filter((f) => f.question !== question);
    triggerMutation(
      () => {
        setFaqs(updated);
        saveToLocalStorage({ faqs: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs: updated,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const addPhoto = (item: Omit<PhotoItem, "id">) => {
    const newItem = { ...item, id: `photo-${Date.now()}` };
    const updated = [newItem, ...photos];
    triggerMutation(
      () => {
        setPhotos(updated);
        saveToLocalStorage({ photos: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos: updated,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const deletePhoto = (id: string) => {
    const updated = photos.filter((p) => p.id !== id);
    triggerMutation(
      () => {
        setPhotos(updated);
        saveToLocalStorage({ photos: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos: updated,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const addVideo = (item: Omit<VideoItem, "id">) => {
    const newItem = { ...item, id: `vid-${Date.now()}` };
    const updated = [newItem, ...videos];
    triggerMutation(
      () => {
        setVideos(updated);
        saveToLocalStorage({ videos: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos: updated,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const deleteVideo = (id: string) => {
    const updated = videos.filter((v) => v.id !== id);
    triggerMutation(
      () => {
        setVideos(updated);
        saveToLocalStorage({ videos: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos: updated,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const addLead = (lead: Omit<LeadItem, "id" | "date" | "status">) => {
    const newLead: LeadItem = {
      ...lead,
      id: `lead-${Date.now()}`,
      date: new Date().toLocaleDateString("en-IN"),
      status: "New"
    };
    const updated = [newLead, ...leads];
    triggerMutation(
      () => {
        setLeads(updated);
        saveToLocalStorage({ leads: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads: updated,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const updateLeadStatus = (id: string, status: LeadItem["status"]) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status } : l));
    triggerMutation(
      () => {
        setLeads(updated);
        saveToLocalStorage({ leads: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads: updated,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const deleteLead = (id: string) => {
    recordDeletedId("lead", id);
    const updated = leads.filter((l) => l.id !== id);
    triggerMutation(
      () => {
        setLeads(updated);
        saveToLocalStorage({ leads: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads: updated,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  // Customer & Wallet Operations
  const addCustomer = (
    customer: Omit<CustomerItem, "id" | "walletBalance" | "totalFunded" | "totalSpent" | "createdAt">,
    initialDeposit: number = 0
  ) => {
    const custId = `cust-${Date.now()}`;
    const newCust: CustomerItem = {
      ...customer,
      id: custId,
      walletBalance: initialDeposit,
      totalFunded: initialDeposit,
      totalSpent: 0,
      activeCampaigns: 1,
      createdAt: new Date().toLocaleDateString("en-IN")
    };

    const updatedCustomers = [newCust, ...customers];

    let updatedTx = transactions;
    if (initialDeposit > 0) {
      const initTx: WalletTransactionItem = {
        id: `tx-${Date.now()}`,
        customerId: custId,
        customerName: customer.business,
        type: "CREDIT",
        amount: initialDeposit,
        description: "Initial Account Deposit",
        date: new Date().toLocaleDateString("en-IN")
      };
      updatedTx = [initTx, ...transactions];
    }

    triggerMutation(
      () => {
        setCustomers(updatedCustomers);
        setTransactions(updatedTx);
        saveToLocalStorage({ customers: updatedCustomers, transactions: updatedTx });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers: updatedCustomers,
        transactions: updatedTx,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const updateCustomer = (id: string, updatedFields: Partial<Omit<CustomerItem, "id" | "createdAt">>) => {
    let businessChanged = false;
    let newBusiness = "";

    const updatedCustomers = customers.map((c) => {
      if (c.id === id) {
        if (updatedFields.business && updatedFields.business !== c.business) {
          businessChanged = true;
          newBusiness = updatedFields.business;
        }
        return {
          ...c,
          ...updatedFields
        };
      }
      return c;
    });

    const updatedTx = businessChanged
      ? transactions.map((t) => (t.customerId === id ? { ...t, customerName: newBusiness } : t))
      : transactions;

    triggerMutation(
      () => {
        setCustomers(updatedCustomers);
        if (businessChanged) setTransactions(updatedTx);
        saveToLocalStorage({ customers: updatedCustomers, transactions: updatedTx });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers: updatedCustomers,
        transactions: updatedTx,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const deleteCustomer = (id: string) => {
    recordDeletedId("customer", id);
    const updatedCustomers = customers.filter((c) => c.id !== id);
    const updatedTx = transactions.filter((t) => t.customerId !== id);

    triggerMutation(
      () => {
        setCustomers(updatedCustomers);
        setTransactions(updatedTx);
        saveToLocalStorage({ customers: updatedCustomers, transactions: updatedTx });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers: updatedCustomers,
        transactions: updatedTx,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const addWalletTransaction = (
    customerId: string,
    type: "CREDIT" | "DEBIT",
    amount: number,
    description: string,
    date?: string
  ) => {
    const targetCust = customers.find((c) => c.id === customerId);
    if (!targetCust) return;

    const newTx: WalletTransactionItem = {
      id: `tx-${Date.now()}`,
      customerId,
      customerName: targetCust.business,
      type,
      amount,
      description,
      date: date || new Date().toLocaleDateString("en-IN")
    };

    const updatedTx = [newTx, ...transactions];

    // Update customer balances
    const updatedCustomers = customers.map((c) => {
      if (c.id === customerId) {
        if (type === "CREDIT") {
          return {
            ...c,
            walletBalance: c.walletBalance + amount,
            totalFunded: c.totalFunded + amount
          };
        } else {
          return {
            ...c,
            walletBalance: c.walletBalance - amount,
            totalSpent: c.totalSpent + amount
          };
        }
      }
      return c;
    });

    triggerMutation(
      () => {
        setTransactions(updatedTx);
        setCustomers(updatedCustomers);
        saveToLocalStorage({ transactions: updatedTx, customers: updatedCustomers });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers: updatedCustomers,
        transactions: updatedTx,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const updateWalletTransaction = (
    id: string,
    updatedFields: Partial<Omit<WalletTransactionItem, "id" | "customerId">>
  ) => {
    const existingTx = transactions.find((t) => t.id === id);
    if (!existingTx) return;

    const customerId = existingTx.customerId;
    const oldType = existingTx.type;
    const oldAmount = existingTx.amount;
    const newType = updatedFields.type !== undefined ? updatedFields.type : oldType;
    const newAmount = updatedFields.amount !== undefined ? updatedFields.amount : oldAmount;

    const updatedTx = transactions.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          ...updatedFields
        };
      }
      return t;
    });

    // Recalculate customer balance if type or amount changed
    const updatedCustomers = customers.map((c) => {
      if (c.id === customerId) {
        let balance = c.walletBalance;
        let funded = c.totalFunded;
        let spent = c.totalSpent;

        // Revert old transaction effect
        if (oldType === "CREDIT") {
          balance -= oldAmount;
          funded -= oldAmount;
        } else {
          balance += oldAmount;
          spent -= oldAmount;
        }

        // Apply new transaction effect
        if (newType === "CREDIT") {
          balance += newAmount;
          funded += newAmount;
        } else {
          balance -= newAmount;
          spent += newAmount;
        }

        return {
          ...c,
          walletBalance: Math.max(0, balance),
          totalFunded: Math.max(0, funded),
          totalSpent: Math.max(0, spent)
        };
      }
      return c;
    });

    triggerMutation(
      () => {
        setTransactions(updatedTx);
        setCustomers(updatedCustomers);
        saveToLocalStorage({ transactions: updatedTx, customers: updatedCustomers });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers: updatedCustomers,
        transactions: updatedTx,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const deleteWalletTransaction = (id: string) => {
    recordDeletedId("transaction", id);
    const existingTx = transactions.find((t) => t.id === id);
    if (!existingTx) return;

    const customerId = existingTx.customerId;
    const oldType = existingTx.type;
    const oldAmount = existingTx.amount;

    const updatedTx = transactions.filter((t) => t.id !== id);

    // Revert customer balance
    const updatedCustomers = customers.map((c) => {
      if (c.id === customerId) {
        let balance = c.walletBalance;
        let funded = c.totalFunded;
        let spent = c.totalSpent;

        if (oldType === "CREDIT") {
          balance = Math.max(0, balance - oldAmount);
          funded = Math.max(0, funded - oldAmount);
        } else {
          balance = balance + oldAmount;
          spent = Math.max(0, spent - oldAmount);
        }

        return {
          ...c,
          walletBalance: balance,
          totalFunded: funded,
          totalSpent: spent
        };
      }
      return c;
    });

    triggerMutation(
      () => {
        setTransactions(updatedTx);
        setCustomers(updatedCustomers);
        saveToLocalStorage({ transactions: updatedTx, customers: updatedCustomers });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers: updatedCustomers,
        transactions: updatedTx,
        earnings,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  // Earnings & Expenses CRUD Operations
  const addEarning = (earning: Omit<EarningItem, "id" | "date"> & { date?: string }) => {
    const newEarning: EarningItem = {
      ...earning,
      id: `earn-${Date.now()}`,
      date: earning.date || new Date().toLocaleDateString("en-IN")
    };
    const updated = [newEarning, ...earnings];

    triggerMutation(
      () => {
        setEarnings(updated);
        saveToLocalStorage({ earnings: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings: updated,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const updateEarning = (id: string, updatedFields: Partial<Omit<EarningItem, "id">>) => {
    const updated = earnings.map((e) => {
      if (e.id === id) {
        return {
          ...e,
          ...updatedFields
        };
      }
      return e;
    });

    triggerMutation(
      () => {
        setEarnings(updated);
        saveToLocalStorage({ earnings: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings: updated,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const deleteEarning = (id: string) => {
    recordDeletedId("earning", id);
    const updated = earnings.filter((e) => e.id !== id);
    triggerMutation(
      () => {
        setEarnings(updated);
        saveToLocalStorage({ earnings: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings: updated,
        expenses,
        earningCategories,
        expenseCategories
      })
    );
  };

  const addExpense = (expense: Omit<ExpenseItem, "id" | "date"> & { date?: string }) => {
    const newExpense: ExpenseItem = {
      ...expense,
      id: `exp-${Date.now()}`,
      date: expense.date || new Date().toLocaleDateString("en-IN")
    };
    const updated = [newExpense, ...expenses];

    triggerMutation(
      () => {
        setExpenses(updated);
        saveToLocalStorage({ expenses: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses: updated,
        earningCategories,
        expenseCategories
      })
    );
  };

  const updateExpense = (id: string, updatedFields: Partial<Omit<ExpenseItem, "id">>) => {
    const updated = expenses.map((e) => {
      if (e.id === id) {
        return {
          ...e,
          ...updatedFields
        };
      }
      return e;
    });

    triggerMutation(
      () => {
        setExpenses(updated);
        saveToLocalStorage({ expenses: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses: updated,
        earningCategories,
        expenseCategories
      })
    );
  };

  const deleteExpense = (id: string) => {
    recordDeletedId("expense", id);
    const updated = expenses.filter((e) => e.id !== id);
    triggerMutation(
      () => {
        setExpenses(updated);
        saveToLocalStorage({ expenses: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses: updated,
        earningCategories,
        expenseCategories
      })
    );
  };

  // Dynamic Category Operations
  const addExpenseCategory = (cat: string) => {
    const trimmed = cat.trim();
    if (!trimmed || expenseCategories.includes(trimmed)) return;
    const updated = [...expenseCategories, trimmed];

    triggerMutation(
      () => {
        setExpenseCategories(updated);
        saveToLocalStorage({ expenseCategories: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories: updated
      })
    );
  };

  const deleteExpenseCategory = (cat: string) => {
    const updated = expenseCategories.filter((c) => c !== cat);
    triggerMutation(
      () => {
        setExpenseCategories(updated);
        saveToLocalStorage({ expenseCategories: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories: updated
      })
    );
  };

  const addEarningCategory = (cat: string) => {
    const trimmed = cat.trim();
    if (!trimmed || earningCategories.includes(trimmed)) return;
    const updated = [...earningCategories, trimmed];

    triggerMutation(
      () => {
        setEarningCategories(updated);
        saveToLocalStorage({ earningCategories: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories: updated,
        expenseCategories
      })
    );
  };

  const deleteEarningCategory = (cat: string) => {
    const updated = earningCategories.filter((c) => c !== cat);
    triggerMutation(
      () => {
        setEarningCategories(updated);
        saveToLocalStorage({ earningCategories: updated });
      },
      () => ({
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories: updated,
        expenseCategories
      })
    );
  };

  return (
    <AgencyContext.Provider
      value={{
        services,
        portfolio,
        testimonials,
        faqs,
        photos,
        videos,
        leads,
        customers,
        transactions,
        earnings,
        expenses,
        earningCategories,
        expenseCategories,
        isLoggedIn,
        authLoading,
        login,
        logout,
        syncStatus,
        lastSyncedAt,
        syncNow,
        restoreFromSafetyVault,
        healCloudDatabase,
        vaultStats,
        downloadFullBackupJSON,
        restoreBackupJSON,
        resetAllDataToZero,
        addService,
        deleteService,
        addPortfolio,
        deletePortfolio,
        addTestimonial,
        deleteTestimonial,
        addFAQ,
        deleteFAQ,
        addPhoto,
        deletePhoto,
        addVideo,
        deleteVideo,
        addLead,
        updateLeadStatus,
        deleteLead,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addWalletTransaction,
        updateWalletTransaction,
        deleteWalletTransaction,
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
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
}

export function useAgencyContext() {
  const context = useContext(AgencyContext);
  if (!context) {
    throw new Error("useAgencyContext must be used within an AgencyProvider");
  }
  return context;
}
