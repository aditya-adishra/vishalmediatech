"use client";

import React, { useState } from "react";
import { useAgencyContext } from "@/lib/agency-context";
import { Plus, Trash2, Code, Sparkles, CheckCircle2 } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

export default function AdminServicesPage() {
  const { services, addService, deleteService } = useAgencyContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("High ROI");
  const [features, setFeatures] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const featsList = features ? features.split(",").map((f) => f.trim()) : ["Custom Architecture", "Lead Generation Focus"];
    addService({
      title,
      description,
      iconName: "Code",
      badge,
      features: featsList
    });

    setTitle("");
    setDescription("");
    setBadge("High ROI");
    setFeatures("");
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase font-extrabold tracking-widest text-brand-400 bg-brand-500/20 px-3 py-1 rounded-full border border-brand-500/30">
          Services Manager
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-2">
          Manage Agency Services
        </h1>
        <p className="text-sm text-gray-400">Add, edit or remove services rendered on the live website</p>
      </div>

      {/* Add Service Form Card */}
      <div className="bg-gray-900/90 rounded-3xl border border-gray-800 p-6 sm:p-8 shadow-xl">
        <h3 className="text-xl font-extrabold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-500" />
          Add New Agency Service
        </h3>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                Service Title *
              </label>
              <input
                type="text"
                placeholder="e.g. AI Business Automation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                Badge Tag
              </label>
              <input
                type="text"
                placeholder="e.g. 98% Retention"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              placeholder="Describe the service offerings & conversion benefits..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
              Bullet Features (Comma Separated)
            </label>
            <input
              type="text"
              placeholder="e.g. 24/7 Support, WhatsApp Bot, CRM Auto-Sync"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-md hover:bg-brand-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Service</span>
          </button>
        </form>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-gray-900/90 rounded-3xl p-6 border border-gray-800 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-500 flex items-center justify-center font-bold">
                  <Code className="w-5 h-5" />
                </div>
                {service.badge && (
                  <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                    {service.badge}
                  </span>
                )}
              </div>

              <h4 className="text-lg font-bold text-white mb-2">{service.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{service.description}</p>
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-500">ID: {service.id}</span>
              <button
                onClick={() => setDeleteTarget({ id: service.id, title: service.title })}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                title="Delete Service"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Service?"
        message="Are you sure you want to remove this service from the live website?"
        itemName={deleteTarget?.title}
        onConfirm={() => {
          if (deleteTarget) {
            deleteService(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
