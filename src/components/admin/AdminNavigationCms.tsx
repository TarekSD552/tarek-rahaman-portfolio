"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ExternalLink,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { useCms } from "@/context/CmsContext";
import { CmsNavItem } from "@/types/portfolio";

interface AdminNavigationCmsProps {
  showToast: (text: string, type?: "success" | "error" | "info") => void;
}

export default function AdminNavigationCms({ showToast }: AdminNavigationCmsProps) {
  const { cmsData, updateCms } = useCms();

  const defaultNavItems: CmsNavItem[] = [
    { name: "Home", href: "/", order: 1, enabled: true },
    { name: "About", href: "/about", order: 2, enabled: true },
    { name: "Services", href: "/services", order: 3, enabled: true },
    { name: "Skills", href: "/skills", order: 4, enabled: true },
    { name: "Portfolio", href: "/portfolio", order: 5, enabled: true },
    { name: "Contact", href: "/contact", order: 6, enabled: true }
  ];

  const [navItems, setNavItems] = useState<CmsNavItem[]>(
    cmsData.navigation?.length ? cmsData.navigation : defaultNavItems
  );

  // Nav Item Modal
  const [navModal, setNavModal] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    index: number;
    data: Partial<CmsNavItem>;
  }>({
    isOpen: false,
    mode: "add",
    index: -1,
    data: {}
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Live Page Preview Button */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#070d1e] via-[#0b1633] to-[#070d1e] border border-[#00d2ff]/25 shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/30 uppercase tracking-widest">
              Global Header CMS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-mono">Navbar &amp; Mobile Drawer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Navigation Menu Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Control the desktop navigation links, show/hide items, reorder routes, and update the mobile slide-out drawer menu.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#00d2ff] bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 hover:border-[#00d2ff]/60 transition-all shadow-[0_0_15px_rgba(0,210,255,0.15)] group"
          >
            <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>View Live Navbar</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </Link>
        </div>
      </div>

      {/* Main Navigation Card */}
      <div className="rounded-2xl bg-[#070d1e]/90 border border-[#00d2ff]/20 p-6 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#00d2ff]" />
              <span>Navbar Menu Items ({navItems.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Reorder items up/down or toggle visibility. Changes appear immediately across all page headers.
            </p>
          </div>

          <button
            onClick={() => {
              setNavModal({
                isOpen: true,
                mode: "add",
                index: -1,
                data: {
                  name: "",
                  href: "/",
                  order: navItems.length + 1,
                  enabled: true
                }
              });
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#00d2ff] to-[#0072ff] shadow-md cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Menu Item</span>
          </button>
        </div>

        {/* Live Navbar Mini-Preview */}
        <div className="p-4 rounded-xl bg-[#03060f] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Desktop Header Preview</span>
            <span className="text-[#00d2ff]">Live Preview</span>
          </div>
          <div className="h-12 px-4 rounded-lg bg-[#050811] border border-white/10 flex items-center justify-between">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#00d2ff] text-[#050811] font-black text-xs flex items-center justify-center">TR</span>
              <span>Tarek Rahaman</span>
            </span>
            <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
              {navItems
                .filter((item) => item.enabled)
                .map((item, idx) => (
                  <span
                    key={idx}
                    className={idx === 0 ? "text-[#00d2ff]" : "text-slate-300 hover:text-white"}
                  >
                    {item.name}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Nav Items List */}
        <div className="space-y-3">
          {navItems.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                item.enabled
                  ? "bg-[#050811] border-white/10 hover:border-[#00d2ff]/40"
                  : "bg-white/[0.01] border-white/5 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#00d2ff] font-bold">0{index + 1}</span>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{item.name}</span>
                    {!item.enabled && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{item.href}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Visibility Toggle */}
                <button
                  onClick={async () => {
                    const copy = [...navItems];
                    copy[index] = { ...copy[index], enabled: !copy[index].enabled };
                    setNavItems(copy);
                    await updateCms({ navigation: copy });
                    showToast(copy[index].enabled ? `"${item.name}" enabled in navbar` : `"${item.name}" hidden from navbar`);
                  }}
                  className={`p-2 rounded-lg border cursor-pointer ${
                    item.enabled
                      ? "bg-[#00d2ff]/10 text-[#00d2ff] border-[#00d2ff]/30"
                      : "bg-white/5 text-slate-500 border-white/10"
                  }`}
                  title={item.enabled ? "Enabled (Click to Hide)" : "Hidden (Click to Show)"}
                >
                  {item.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                {/* Move Up */}
                <button
                  disabled={index === 0}
                  onClick={async () => {
                    const copy = [...navItems];
                    const temp = copy[index - 1];
                    copy[index - 1] = copy[index];
                    copy[index] = temp;
                    setNavItems(copy);
                    await updateCms({ navigation: copy });
                    showToast("Menu order updated.");
                  }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-20 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                {/* Move Down */}
                <button
                  disabled={index === navItems.length - 1}
                  onClick={async () => {
                    const copy = [...navItems];
                    const temp = copy[index + 1];
                    copy[index + 1] = copy[index];
                    copy[index] = temp;
                    setNavItems(copy);
                    await updateCms({ navigation: copy });
                    showToast("Menu order updated.");
                  }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-20 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                {/* Edit */}
                <button
                  onClick={() => setNavModal({ isOpen: true, mode: "edit", index, data: item })}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#818cf8] cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  onClick={async () => {
                    if (confirm(`Delete menu item "${item.name}"?`)) {
                      const updated = navItems.filter((_, i) => i !== index);
                      setNavItems(updated);
                      await updateCms({ navigation: updated });
                      showToast("Menu item deleted.");
                    }
                  }}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NAV MODAL */}
      <AnimatePresence>
        {navModal.isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-[#090f1f] border border-[#00d2ff]/40 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-base font-bold text-white">
                  {navModal.mode === "add" ? "Add Navigation Item" : "Edit Navigation Item"}
                </h3>
                <button
                  onClick={() => setNavModal({ ...navModal, isOpen: false })}
                  className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Menu Label Name</label>
                  <input
                    type="text"
                    required
                    value={navModal.data.name || ""}
                    onChange={(e) => setNavModal({ ...navModal, data: { ...navModal.data, name: e.target.value } })}
                    placeholder="e.g. Blog, Testimonials, Case Studies"
                    className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Target URL / Route</label>
                  <input
                    type="text"
                    required
                    value={navModal.data.href || ""}
                    onChange={(e) => setNavModal({ ...navModal, data: { ...navModal.data, href: e.target.value } })}
                    placeholder="e.g. /about, /#services, https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setNavModal({ ...navModal, isOpen: false })}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const copy = [...navItems];
                    if (navModal.mode === "add") {
                      copy.push({
                        name: navModal.data.name || "New Link",
                        href: navModal.data.href || "/",
                        order: copy.length + 1,
                        enabled: true
                      });
                    } else {
                      copy[navModal.index] = {
                        ...copy[navModal.index],
                        name: navModal.data.name || copy[navModal.index].name,
                        href: navModal.data.href || copy[navModal.index].href
                      };
                    }
                    setNavItems(copy);
                    await updateCms({ navigation: copy });
                    setNavModal({ ...navModal, isOpen: false });
                    showToast("Navigation saved successfully!");
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#0072ff] font-bold text-white shadow-md cursor-pointer"
                >
                  Save Menu Item
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

