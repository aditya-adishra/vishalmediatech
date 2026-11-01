"use client";

import React, { useState } from "react";
import { useAgencyContext } from "@/lib/agency-context";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

export default function AdminFAQPage() {
  const { faqs, addFAQ, deleteFAQ } = useAgencyContext();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

    addFAQ({ question, answer, category });
    setQuestion("");
    setAnswer("");
    setCategory("General");
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase font-extrabold tracking-widest text-brand-400 bg-brand-500/20 px-3 py-1 rounded-full border border-brand-500/30">
          FAQ Accordion Manager
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-2">
          Manage FAQ Accordions
        </h1>
        <p className="text-sm text-gray-400">Add or remove frequently asked questions rendered on the website</p>
      </div>

      {/* Add FAQ Form */}
      <div className="bg-gray-900/90 rounded-3xl border border-gray-800 p-6 sm:p-8 shadow-xl">
        <h3 className="text-xl font-extrabold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-500" />
          Add New FAQ Accordion
        </h3>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Question *</label>
              <input
                type="text"
                placeholder="e.g. Do you offer custom Next.js web application development?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Category</label>
              <input
                type="text"
                placeholder="e.g. Development"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Answer *</label>
            <textarea
              rows={3}
              placeholder="Enter comprehensive answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-md hover:bg-brand-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Publish FAQ Accordion</span>
          </button>
        </form>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="bg-gray-900/90 rounded-3xl p-6 border border-gray-800 shadow-xl flex items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                  {faq.category || "General"}
                </span>
                <h4 className="text-base font-extrabold text-white">{faq.question}</h4>
              </div>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">{faq.answer}</p>
            </div>

            <button
              onClick={() => setDeleteTarget(faq.question)}
              className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-colors shrink-0"
              title="Delete FAQ"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete FAQ Accordion?"
        message="Are you sure you want to permanently remove this FAQ from the website?"
        itemName={deleteTarget || undefined}
        onConfirm={() => {
          if (deleteTarget) {
            deleteFAQ(deleteTarget);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
