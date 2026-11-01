"use client";

import React, { useState, useMemo } from "react";
import { EarningItem, ExpenseItem } from "@/lib/agency-context";
import {
  PieChart as PieChartIcon,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Sparkles,
  Calendar,
  Layers,
  Percent,
  CheckCircle2,
  Info,
  GitCompare
} from "lucide-react";

type ChartScope = "earnings" | "expenses" | "profit_loss";
type TimeFilter = "daily" | "weekly" | "monthly" | "all";

interface CircleGraphAnalyticsProps {
  earnings: EarningItem[];
  expenses: ExpenseItem[];
}

// Vibrant theme palettes for categories
const EARNING_COLORS: Record<string, string> = {
  "Meta Ads Retainer": "#10b981", // emerald
  "Website Development": "#6366f1", // indigo
  "SEO & Content": "#06b6d4", // cyan
  "Brand Strategy": "#f59e0b", // amber
  "Consulting": "#8b5cf6", // purple
  "Personal Income / Freelancing": "#ec4899", // pink
  "Other": "#9ca3af" // gray
};

const EXPENSE_COLORS: Record<string, string> = {
  "Personal Expenses": "#ec4899", // vibrant pink for Personal Expenses!
  "Software & AI Tools": "#f43f5e", // rose
  "Freelancer & Team": "#ea580c", // orange
  "Office & Rent": "#eab308", // amber/yellow
  "Office & Internet": "#eab308",
  "Travel & Fuel": "#3b82f6", // blue
  "Food & Dining": "#14b8a6", // teal
  "Equipment & Gear": "#8b5cf6", // violet
  "Marketing & Ads": "#06b6d4", // cyan
  "Family & Household": "#a855f7", // purple
  "Other": "#6b7280" // gray
};

const DYNAMIC_PALETTE = [
  "#ec4899", "#3b82f6", "#14b8a6", "#f97316", "#8b5cf6",
  "#10b981", "#eab308", "#06b6d4", "#6366f1", "#f43f5e",
  "#d946ef", "#84cc16", "#0ea5e9", "#f43f5e", "#a855f7"
];

function getCategoryColor(category: string, isExpense: boolean): string {
  const map = isExpense ? EXPENSE_COLORS : EARNING_COLORS;
  if (map[category]) return map[category];
  
  // Deterministic color assignment based on category name string
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % DYNAMIC_PALETTE.length;
  return DYNAMIC_PALETTE[index];
}

export function CircleGraphAnalytics({
  earnings,
  expenses
}: CircleGraphAnalyticsProps) {
  const [scope, setScope] = useState<ChartScope>("earnings");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("monthly");
  const [compareMode, setCompareMode] = useState<boolean>(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Dynamic labels for current and comparative periods
  const currentPeriodLabel = useMemo(() => {
    if (timeFilter === "daily") return "Today";
    if (timeFilter === "weekly") return "This Week";
    if (timeFilter === "monthly") return "This Month";
    return "All-Time";
  }, [timeFilter]);

  const previousPeriodLabel = useMemo(() => {
    if (timeFilter === "daily") return "Yesterday";
    if (timeFilter === "weekly") return "Previous Week";
    if (timeFilter === "monthly") return "Previous Month";
    return "Prior Period";
  }, [timeFilter]);

  // Helper date filter
  const parseDate = (dStr: string): Date => {
    if (!dStr) return new Date();
    if (dStr.includes("/")) {
      const parts = dStr.split("/");
      if (parts.length === 3) {
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
    }
    const parsed = new Date(dStr);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  // Filter items by time range (Current vs Previous)
  const windowDays = timeFilter === "daily" ? 1 : timeFilter === "weekly" ? 7 : timeFilter === "monthly" ? 30 : 365;

  const currentEarnings = useMemo(() => {
    if (timeFilter === "all") return earnings;
    const now = new Date();
    return earnings.filter((item) => {
      const d = parseDate(item.date);
      const diff = Math.max(0, (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      return diff <= windowDays;
    });
  }, [earnings, timeFilter, windowDays]);

  const prevEarnings = useMemo(() => {
    if (timeFilter === "all") return [];
    const now = new Date();
    return earnings.filter((item) => {
      const d = parseDate(item.date);
      const diff = Math.max(0, (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      return diff > windowDays && diff <= windowDays * 2;
    });
  }, [earnings, timeFilter, windowDays]);

  const currentExpenses = useMemo(() => {
    if (timeFilter === "all") return expenses;
    const now = new Date();
    return expenses.filter((item) => {
      const d = parseDate(item.date);
      const diff = Math.max(0, (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      return diff <= windowDays;
    });
  }, [expenses, timeFilter, windowDays]);

  const prevExpenses = useMemo(() => {
    if (timeFilter === "all") return [];
    const now = new Date();
    return expenses.filter((item) => {
      const d = parseDate(item.date);
      const diff = Math.max(0, (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      return diff > windowDays && diff <= windowDays * 2;
    });
  }, [expenses, timeFilter, windowDays]);

  const filteredEarnings = currentEarnings;
  const filteredExpenses = currentExpenses;

  const totalEarnings = useMemo(
    () => filteredEarnings.reduce((sum, e) => sum + e.amount, 0),
    [filteredEarnings]
  );
  const totalExpenses = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses]
  );

  const prevTotalEarnings = useMemo(
    () => prevEarnings.reduce((sum, e) => sum + e.amount, 0),
    [prevEarnings]
  );
  const prevTotalExpenses = useMemo(
    () => prevExpenses.reduce((sum, e) => sum + e.amount, 0),
    [prevExpenses]
  );

  const netProfit = Math.max(0, totalEarnings - totalExpenses);
  const prevNetProfit = Math.max(0, prevTotalEarnings - prevTotalExpenses);
  const profitMargin = totalEarnings > 0 ? Math.round((netProfit / totalEarnings) * 100) : 0;
  const prevProfitMargin = prevTotalEarnings > 0 ? Math.round((prevNetProfit / prevTotalEarnings) * 100) : 0;

  // Comparison deltas
  const earningsDelta = prevTotalEarnings > 0 
    ? Math.round(((totalEarnings - prevTotalEarnings) / prevTotalEarnings) * 100) 
    : (totalEarnings > 0 ? 100 : 0);
  const expensesDelta = prevTotalExpenses > 0 
    ? Math.round(((totalExpenses - prevTotalExpenses) / prevTotalExpenses) * 100) 
    : (totalExpenses > 0 ? 100 : 0);
  const profitDelta = prevNetProfit > 0 
    ? Math.round(((netProfit - prevNetProfit) / prevNetProfit) * 100) 
    : (netProfit > 0 ? 100 : 0);

  // Aggregate category breakdowns for Earnings
  const earningsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    filteredEarnings.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });

    const entries = Object.entries(map).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalEarnings > 0 ? Math.round((amount / totalEarnings) * 100) : 0,
      color: getCategoryColor(category, false)
    }));

    return entries.sort((a, b) => b.amount - a.amount);
  }, [filteredEarnings, totalEarnings]);

  // Aggregate category breakdowns for Expenses
  const expensesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });

    const entries = Object.entries(map).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      color: getCategoryColor(category, true)
    }));

    return entries.sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses, totalExpenses]);

  // Profit/Loss Comparative Segments
  const profitLossSegments = useMemo(() => {
    if (totalEarnings === 0) return [];
    const expensePercent = Math.min(100, Math.round((totalExpenses / totalEarnings) * 100));
    const profitPercent = Math.max(0, 100 - expensePercent);

    return [
      {
        category: "Net Profit Retained",
        amount: netProfit,
        percentage: profitPercent,
        color: "#10b981" // emerald
      },
      {
        category: "Operating Expenses",
        amount: totalExpenses,
        percentage: expensePercent,
        color: "#f43f5e" // rose
      }
    ];
  }, [totalEarnings, totalExpenses, netProfit]);

  // Current active segments based on scope
  const activeSegments = useMemo(() => {
    if (scope === "earnings") return earningsByCategory;
    if (scope === "expenses") return expensesByCategory;
    return profitLossSegments;
  }, [scope, earningsByCategory, expensesByCategory, profitLossSegments]);

  const activeTotal = scope === "earnings" ? totalEarnings : scope === "expenses" ? totalExpenses : totalEarnings;

  // SVG Circle / Donut Math
  const size = 300;
  const strokeWidth = 38;
  const radius = (size - strokeWidth) / 2; // radius ~ 131
  const circumference = 2 * Math.PI * radius; // ~ 823

  // Calculate cumulative offsets for each segment arc
  const svgArcs = useMemo(() => {
    let accumulatedAngle = 0;
    return activeSegments.map((seg) => {
      const arcLength = (seg.percentage / 100) * circumference;
      const strokeDashoffset = -accumulatedAngle;
      accumulatedAngle += arcLength;
      return {
        ...seg,
        strokeDasharray: `${arcLength} ${circumference - arcLength}`,
        strokeDashoffset
      };
    });
  }, [activeSegments, circumference]);

  const highlightedSegment = useMemo(() => {
    if (!hoveredCategory) return null;
    return activeSegments.find((s) => s.category === hoveredCategory) || null;
  }, [hoveredCategory, activeSegments]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl border border-gray-800 shadow-2xl p-5 sm:p-7 space-y-6 text-white">
      
      {/* Header with Scope Switcher & Time Filter */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <PieChartIcon className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              Agency P&L Analytics Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Circle Graph Breakdown
          </h2>
          <p className="text-xs text-gray-400">
            Interactive radial distribution of earnings streams and operational cost categories
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          
          {/* Scope Selector (Earnings / Expenses / P&L) */}
          <div className="flex items-center bg-gray-950 p-1 rounded-2xl border border-gray-800 text-xs">
            <button
              onClick={() => {
                setScope("earnings");
                setHoveredCategory(null);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                scope === "earnings"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Earnings Circle
            </button>
            <button
              onClick={() => {
                setScope("expenses");
                setHoveredCategory(null);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                scope === "expenses"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Expenses Circle
            </button>
            <button
              onClick={() => {
                setScope("profit_loss");
                setHoveredCategory(null);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                scope === "profit_loss"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Net Margin (P&L)
            </button>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center bg-gray-950 p-1 rounded-2xl border border-gray-800 text-xs">
            {(
              [
                { id: "daily", label: "Daily" },
                { id: "weekly", label: "Weekly" },
                { id: "monthly", label: "Monthly" },
                { id: "all", label: "All-Time" }
              ] as const
            ).map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeFilter(tf.id)}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                  timeFilter === tf.id
                    ? "bg-gray-800 text-white shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Comparative Analytics Toggle */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              compareMode
                ? "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/20"
                : "bg-gray-950 text-gray-400 border-gray-800 hover:text-white"
            }`}
            title="Toggle comparative timeline"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare vs {previousPeriodLabel}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                compareMode ? "bg-purple-400 text-black" : "bg-gray-800 text-gray-400"
              }`}
            >
              {compareMode ? "ON" : "OFF"}
            </span>
          </button>

        </div>
      </div>

      {/* Comparative Timeline Metrics Bar */}
      {compareMode && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-gray-950/80 border border-purple-500/20 animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-2">
            <div>
              <p className="text-[11px] text-gray-400 font-semibold">
                {currentPeriodLabel} Earnings vs {previousPeriodLabel}
              </p>
              <p className="text-sm font-extrabold text-white">
                ₹{totalEarnings.toLocaleString("en-IN")}{" "}
                <span className="text-xs font-normal text-gray-500">
                  (prev: ₹{prevTotalEarnings.toLocaleString("en-IN")})
                </span>
              </p>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                earningsDelta >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {earningsDelta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {earningsDelta >= 0 ? `+${earningsDelta}%` : `${earningsDelta}%`}
            </span>
          </div>

          <div className="flex items-center justify-between px-2 sm:border-l sm:border-gray-800">
            <div>
              <p className="text-[11px] text-gray-400 font-semibold">
                {currentPeriodLabel} Expenses vs {previousPeriodLabel}
              </p>
              <p className="text-sm font-extrabold text-white">
                ₹{totalExpenses.toLocaleString("en-IN")}{" "}
                <span className="text-xs font-normal text-gray-500">
                  (prev: ₹{prevTotalExpenses.toLocaleString("en-IN")})
                </span>
              </p>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                expensesDelta <= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
              }`}
            >
              {expensesDelta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {expensesDelta >= 0 ? `+${expensesDelta}%` : `${expensesDelta}%`}
            </span>
          </div>

          <div className="flex items-center justify-between px-2 sm:border-l sm:border-gray-800">
            <div>
              <p className="text-[11px] text-gray-400 font-semibold">
                {currentPeriodLabel} Net Margin vs {previousPeriodLabel}
              </p>
              <p className="text-sm font-extrabold text-white">
                {profitMargin}%{" "}
                <span className="text-xs font-normal text-gray-500">
                  (prev: {prevProfitMargin}%)
                </span>
              </p>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                profitDelta >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {profitDelta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {profitDelta >= 0 ? `+${profitDelta}%` : `${profitDelta}%`}
            </span>
          </div>
        </div>
      )}

      {/* Main Content: Radial Chart + Category List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* CIRCLE GRAPH (SVG Donut) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative select-none">
          
          <div className="relative w-[280px] h-[280px] sm:w-[310px] sm:h-[310px] flex items-center justify-center">
            
            <svg
              className="w-full h-full -rotate-90 transform overflow-visible"
              viewBox={`0 0 ${size} ${size}`}
            >
              {/* Background Ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#1f2937"
                strokeWidth={strokeWidth}
                fill="transparent"
                opacity={0.3}
              />

              {/* Dynamic Slices */}
              {svgArcs.map((arc, idx) => {
                const isHovered = hoveredCategory === arc.category;
                return (
                  <circle
                    key={idx}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={arc.color}
                    strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                    strokeDasharray={arc.strokeDasharray}
                    strokeDashoffset={arc.strokeDashoffset}
                    strokeLinecap="butt"
                    fill="transparent"
                    className="transition-all duration-300 cursor-pointer"
                    style={{
                      filter: isHovered ? `drop-shadow(0 0 12px ${arc.color})` : "none"
                    }}
                    onMouseEnter={() => setHoveredCategory(arc.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                );
              })}
            </svg>

            {/* Donut Center Info */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6">
              {highlightedSegment ? (
                <div className="space-y-1 animate-in fade-in duration-200">
                  <span
                    className="text-[11px] font-extrabold uppercase tracking-wide block truncate max-w-[160px]"
                    style={{ color: highlightedSegment.color }}
                  >
                    {highlightedSegment.category}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-white block">
                    ₹{highlightedSegment.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs font-bold text-gray-400 bg-gray-800/80 px-2.5 py-0.5 rounded-full inline-block">
                    {highlightedSegment.percentage}% of total
                  </span>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">
                    {scope === "earnings" ? "Total Earnings" : scope === "expenses" ? "Total Expenses" : "Net Profit"}
                  </span>
                  <span
                    className={`text-2xl sm:text-3xl font-black block ${
                      scope === "earnings" ? "text-emerald-400" : scope === "expenses" ? "text-rose-400" : "text-brand-400"
                    }`}
                  >
                    ₹{(scope === "profit_loss" ? netProfit : activeTotal).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] text-gray-400 font-semibold block">
                    {scope === "profit_loss" ? `${profitMargin}% Profit Margin` : `${timeFilter.toUpperCase()} View`}
                  </span>
                </div>
              )}
            </div>

          </div>

          <p className="text-[11px] text-gray-500 mt-3 text-center italic">
            Hover over circle segments or legend items to inspect exact financial share
          </p>
        </div>

        {/* CATEGORY BREAKDOWN LIST (Right Column) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between pb-2 border-b border-gray-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {scope === "earnings" ? "Income Streams" : scope === "expenses" ? "Expense Categories" : "P&L Balance"}
            </h3>
            <span className="text-xs font-semibold text-gray-400">
              Amount (₹) · Share (%)
            </span>
          </div>

          {activeSegments.length === 0 ? (
            <div className="p-8 rounded-2xl bg-gray-950/60 border border-dashed border-gray-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto text-gray-500">
                <PieChartIcon className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-300">
                No {scope === "earnings" ? "Earnings" : scope === "expenses" ? "Expenses" : "P&L"} Recorded
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No financial records for {currentPeriodLabel.toLowerCase()}. Once you add income or expense entries above, your interactive breakdown will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {activeSegments.map((item, idx) => {
                const isHovered = hoveredCategory === item.category;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredCategory(item.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isHovered
                        ? "bg-gray-800/90 border-gray-600 shadow-lg scale-[1.01]"
                        : "bg-gray-950/70 border-gray-800/80 hover:border-gray-700 hover:bg-gray-900/60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        <span className="font-bold text-xs sm:text-sm text-white">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-xs sm:text-sm text-white">
                          ₹{item.amount.toLocaleString("en-IN")}
                        </span>
                        <span
                          className="text-[11px] font-black px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${item.color}20`,
                            color: item.color
                          }}
                        >
                          {item.percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Horizontal visual progress fill */}
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color
                        }}
                        className="h-full rounded-full transition-all duration-700"
                      ></div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Financial Health Insight */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-gray-900 to-black border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">
                  {totalEarnings > 0 ? (
                    <>Agency Net Margin: <strong className="text-emerald-400">{profitMargin}%</strong></>
                  ) : (
                    <>0 Baseline Active · Handover Ready</>
                  )}
                </p>
                <p className="text-[11px] text-gray-400">
                  {totalEarnings > 0 ? (
                    <>Total Profit: <strong className="text-white">₹{netProfit.toLocaleString("en-IN")}</strong> on ₹{totalEarnings.toLocaleString("en-IN")} revenue</>
                  ) : (
                    <>All dummy records wiped. Starting fresh at ₹0 for client handover.</>
                  )}
                </p>
              </div>
            </div>

            <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
              {totalEarnings > 0 ? "Profitable" : "Clean Slate"}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
