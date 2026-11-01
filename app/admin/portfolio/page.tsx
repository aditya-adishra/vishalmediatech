"use client";

import React, { useState } from "react";
import { useAgencyContext } from "@/lib/agency-context";
import { Plus, Trash2, Briefcase, Sparkles, ExternalLink } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

export default function AdminPortfolioPage() {
  const { portfolio, addPortfolio, deletePortfolio } = useAgencyContext();

  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [category, setCategory] = useState("Real Estate & Lead Gen");
  const [image, setImage] = useState("");
  const [results, setResults] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("Next.js 15, Meta Ads");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !client || !image || !results) return;

    addPortfolio({
      title,
      client,
      category,
      image,
      results,
      description,
      technologies: tech.split(",").map((t) => t.trim()),
      liveUrl: "#contact"
    });

    setTitle("");
    setClient("");
    setImage("");
    setResults("");
    setDescription("");
    setTech("Next.js 15, Meta Ads");
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase font-extrabold tracking-widest text-brand-400 bg-brand-500/20 px-3 py-1 rounded-full border border-brand-500/30">
          Portfolio Case Studies Manager
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-2">
          Manage Projects Showcase
        </h1>
        <p className="text-sm text-gray-400">Publish high-converting client case studies to the live site</p>
      </div>

      {/* Add Project Form */}
      <div className="bg-gray-900/90 rounded-3xl border border-gray-800 p-6 sm:p-8 shadow-xl">
        <h3 className="text-xl font-extrabold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-500" />
          Add New Portfolio Project
        </h3>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Realty Villa Campaign"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                Client Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Realty Ltd."
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
              >
                <option value="Real Estate & Lead Gen">Real Estate & Lead Gen</option>
                <option value="Doctors & Healthcare">Doctors & Healthcare</option>
                <option value="Interior Designers">Interior Designers</option>
                <option value="Coaching & Education">Coaching & Education</option>
                <option value="Shops & Retail">Shops & Retail</option>
                <option value="Startups & B2B Service">Startups & B2B Service</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                Image URL *
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                Verified Result Banner *
              </label>
              <input
                type="text"
                placeholder="e.g. +420 Inquiries in 30 Days"
                value={results}
                onChange={(e) => setResults(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
              Project Description *
            </label>
            <textarea
              rows={3}
              placeholder="Case study strategy and outcomes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
              Technologies (Comma Separated)
            </label>
            <input
              type="text"
              placeholder="Next.js 15, Meta Ads, Tailwind CSS"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-md hover:bg-brand-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Case Study</span>
          </button>
        </form>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((proj) => (
          <div
            key={proj.id}
            className="bg-gray-900/90 rounded-3xl overflow-hidden border border-gray-800 shadow-xl flex flex-col justify-between"
          >
            <div className="relative h-48 w-full bg-gray-800">
              <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 text-xs font-bold text-white bg-brand-600 px-2.5 py-1 rounded-full">
                {proj.category}
              </span>
            </div>

            <div className="p-6">
              <h4 className="text-lg font-bold text-white mb-1">{proj.title}</h4>
              <p className="text-xs text-gray-400 font-semibold mb-2">Client: {proj.client}</p>
              <p className="text-xs font-bold text-emerald-400 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 mb-3">
                {proj.results}
              </p>
              <p className="text-xs text-gray-400 line-clamp-2">{proj.description}</p>
            </div>

            <div className="p-6 pt-0 border-t border-gray-800 flex items-center justify-between mt-4">
              <span className="text-[11px] font-semibold text-gray-500">ID: {proj.id}</span>
              <button
                onClick={() => setDeleteTarget({ id: proj.id, title: `${proj.title} (${proj.client})` })}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                title="Delete Case Study"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Portfolio Case Study?"
        message="Are you sure you want to permanently remove this case study from the portfolio?"
        itemName={deleteTarget?.title}
        onConfirm={() => {
          if (deleteTarget) {
            deletePortfolio(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
