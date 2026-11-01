"use client";

import React, { useState } from "react";
import { useAgencyContext } from "@/lib/agency-context";
import { Plus, Trash2, Star, Quote } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

export default function AdminTestimonialsPage() {
  const { testimonials, addTestimonial, deleteTestimonial } = useAgencyContext();

  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState("");
  const [review, setReview] = useState("");
  const [metric, setMetric] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !business || !review) return;

    addTestimonial({
      name,
      business,
      role: role || "Founder",
      image: image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      review,
      growthMetric: metric || "Verified Growth"
    });

    setName("");
    setBusiness("");
    setRole("");
    setImage("");
    setReview("");
    setMetric("");
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase font-extrabold tracking-widest text-brand-400 bg-brand-500/20 px-3 py-1 rounded-full border border-brand-500/30">
          Client Reviews Manager
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-2">
          Manage Testimonials
        </h1>
        <p className="text-sm text-gray-400">Add or remove client reviews rendered on the homepage</p>
      </div>

      {/* Add Review Form */}
      <div className="bg-gray-900/90 rounded-3xl border border-gray-800 p-6 sm:p-8 shadow-xl">
        <h3 className="text-xl font-extrabold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-500" />
          Add Client Testimonial
        </h3>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Client Name *</label>
              <input
                type="text"
                placeholder="e.g. Vikramaditya Singh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Business Name *</label>
              <input
                type="text"
                placeholder="e.g. Apex Realty Group"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Growth Metric Badge</label>
              <input
                type="text"
                placeholder="e.g. +420 Leads"
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Client Review Copy *</label>
            <textarea
              rows={3}
              placeholder="Enter client testimonial review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-md hover:bg-brand-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Testimonial</span>
          </button>
        </form>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((test) => (
          <div
            key={test.id}
            className="bg-gray-900/90 rounded-3xl p-6 border border-gray-800 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-brand-500/40" />
              </div>

              <p className="text-xs text-gray-300 italic mb-4 leading-relaxed">"{test.review}"</p>
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-xs">{test.name}</h4>
                <p className="text-[11px] text-gray-400">{test.business}</p>
              </div>

              <button
                onClick={() => setDeleteTarget({ id: test.id, name: `${test.name} (${test.business})` })}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                title="Delete Testimonial"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Testimonial?"
        message="Are you sure you want to permanently delete this client review?"
        itemName={deleteTarget?.name}
        onConfirm={() => {
          if (deleteTarget) {
            deleteTestimonial(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
