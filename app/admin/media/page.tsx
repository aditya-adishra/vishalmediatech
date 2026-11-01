"use client";

import React, { useState } from "react";
import { useAgencyContext } from "@/lib/agency-context";
import { Plus, Trash2, Camera, Youtube, Play, Eye } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

export default function AdminMediaPage() {
  const { photos, videos, addPhoto, deletePhoto, addVideo, deleteVideo } = useAgencyContext();

  const [deleteTarget, setDeleteTarget] = useState<{ type: "photo" | "video"; id: string; title: string } | null>(null);

  // Photo state
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoCategory, setPhotoCategory] = useState("Team Culture");

  // Video state
  const [youtubeId, setYoutubeId] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoClient, setVideoClient] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [videoViews, setVideoViews] = useState("15.2K views");
  const [videoDuration, setVideoDuration] = useState("4:30");
  const [videoCategory, setVideoCategory] = useState("Video Case Study");

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl || !photoTitle) return;
    addPhoto({ url: photoUrl, title: photoTitle, category: photoCategory });
    setPhotoUrl("");
    setPhotoTitle("");
    setPhotoCategory("Team Culture");
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeId || !videoTitle || !videoClient) return;
    addVideo({
      youtubeId,
      title: videoTitle,
      client: videoClient,
      thumbnail: videoThumbnail || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      views: videoViews,
      duration: videoDuration,
      category: videoCategory
    });
    setYoutubeId("");
    setVideoTitle("");
    setVideoClient("");
    setVideoThumbnail("");
  };

  return (
    <div className="space-y-12">
      <div>
        <span className="text-xs uppercase font-extrabold tracking-widest text-brand-400 bg-brand-500/20 px-3 py-1 rounded-full border border-brand-500/30">
          Media Marquee Manager
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-2">
          Manage Photos & YouTube Video Marquee
        </h1>
        <p className="text-sm text-gray-400">Add or remove items in the scrolling marquee tracks</p>
      </div>

      {/* SECTION 1: PHOTO MARQUEE MANAGER */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2 border-b border-gray-800 pb-3">
          <Camera className="w-5 h-5 text-brand-500" />
          Scrolling Photo Gallery Marquee
        </h2>

        {/* Add Photo Form */}
        <div className="bg-gray-900/90 rounded-3xl border border-gray-800 p-6 shadow-xl">
          <form onSubmit={handleAddPhoto} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Photo Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Campaign Strategy Sprint"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Image URL *</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Team Culture"
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-md hover:bg-brand-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Photo To Marquee</span>
            </button>
          </form>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-gray-900/90 rounded-3xl overflow-hidden border border-gray-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={photo.url} alt={photo.title} className="w-14 h-14 rounded-2xl object-cover" />
                <div>
                  <h4 className="font-bold text-white text-sm">{photo.title}</h4>
                  <p className="text-xs text-gray-400">{photo.category}</p>
                </div>
              </div>

              <button
                onClick={() => setDeleteTarget({ type: "photo", id: photo.id, title: photo.title })}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: YOUTUBE VIDEO SHOWCASE MANAGER */}
      <div className="space-y-6 pt-6">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2 border-b border-gray-800 pb-3">
          <Youtube className="w-5 h-5 text-red-500" />
          Scrolling YouTube Video Showcase Marquee
        </h2>

        {/* Add Video Form */}
        <div className="bg-gray-900/90 rounded-3xl border border-gray-800 p-6 shadow-xl">
          <form onSubmit={handleAddVideo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">YouTube Video ID *</label>
                <input
                  type="text"
                  placeholder="e.g. dQw4w9WgXcQ"
                  value={youtubeId}
                  onChange={(e) => setYoutubeId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Video Title *</label>
                <input
                  type="text"
                  placeholder="e.g. How We Scaled Real Estate Leads"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Client / Brand Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Realty"
                  value={videoClient}
                  onChange={(e) => setVideoClient(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Thumbnail URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={videoThumbnail}
                  onChange={(e) => setVideoThumbnail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Views Badge</label>
                <input
                  type="text"
                  placeholder="e.g. 18.4K views"
                  value={videoViews}
                  onChange={(e) => setVideoViews(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Category Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Case Study"
                  value={videoCategory}
                  onChange={(e) => setVideoCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-md hover:bg-brand-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add YouTube Video To Showcase</span>
            </button>
          </form>
        </div>

        {/* Videos List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div key={vid.id} className="bg-gray-900/90 rounded-3xl overflow-hidden border border-gray-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                  <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                  <Play className="w-4 h-4 text-white absolute inset-0 m-auto fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs line-clamp-1">{vid.title}</h4>
                  <p className="text-[11px] text-gray-400">{vid.client}</p>
                </div>
              </div>

              <button
                onClick={() => setDeleteTarget({ type: "video", id: vid.id, title: `${vid.title} (${vid.client})` })}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.type === "photo" ? "Delete Photo?" : "Delete Video?"}
        message="Are you sure you want to permanently remove this media item?"
        itemName={deleteTarget?.title}
        onConfirm={() => {
          if (deleteTarget) {
            if (deleteTarget.type === "photo") deletePhoto(deleteTarget.id);
            else deleteVideo(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
