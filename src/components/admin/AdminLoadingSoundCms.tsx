"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Upload,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Music,
  Check,
  AlertTriangle,
  FileAudio,
  Radio
} from "lucide-react";
import { CmsData, LoadingSoundSettings } from "@/types/portfolio";
import { defaultLoadingSoundSettings } from "@/lib/cms-default-data";

interface AdminLoadingSoundCmsProps {
  cmsData: CmsData;
  updateCms: (partial: Partial<CmsData>) => Promise<boolean | any>;
  showToast: (text: string, type?: "success" | "error" | "info") => void;
}

export default function AdminLoadingSoundCms({
  cmsData,
  updateCms,
  showToast,
}: AdminLoadingSoundCmsProps) {
  // Current settings from CMS or defaults
  const currentSettings: LoadingSoundSettings =
    cmsData.loadingSoundSettings || defaultLoadingSoundSettings;

  const [enabled, setEnabled] = useState<boolean>(currentSettings.enabled ?? true);
  const [soundUrl, setSoundUrl] = useState<string>(
    currentSettings.soundUrl || "/sounds/whoosh-transition.wav"
  );
  const [soundFileName, setSoundFileName] = useState<string>(
    currentSettings.soundFileName || "whoosh-transition.wav (Default Futuristic Whoosh)"
  );
  const [volume, setVolume] = useState<number>(
    typeof currentSettings.volume === "number" ? currentSettings.volume : 45
  );
  const [isCustom, setIsCustom] = useState<boolean>(Boolean(currentSettings.isCustom));

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync when cmsData changes
  useEffect(() => {
    if (cmsData.loadingSoundSettings) {
      setEnabled(cmsData.loadingSoundSettings.enabled ?? true);
      setSoundUrl(cmsData.loadingSoundSettings.soundUrl || "/sounds/whoosh-transition.wav");
      setSoundFileName(
        cmsData.loadingSoundSettings.soundFileName ||
          "whoosh-transition.wav (Default Futuristic Whoosh)"
      );
      setVolume(
        typeof cmsData.loadingSoundSettings.volume === "number"
          ? cmsData.loadingSoundSettings.volume
          : 45
      );
      setIsCustom(Boolean(cmsData.loadingSoundSettings.isCustom));
    }
  }, [cmsData.loadingSoundSettings]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume live if playing
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume / 100));
    }
  }, [volume]);

  // Preview Sound Handler
  const handlePlayPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      const audio = new Audio(soundUrl);
      audio.volume = Math.max(0, Math.min(1, volume / 100));
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        showToast("Audio playback failed. Please check the file URL.", "error");
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            setIsPlaying(false);
            showToast("Playback blocked by browser or format not supported.", "error");
          });
      }
    } catch {
      setIsPlaying(false);
      showToast("Unable to initialize audio player.", "error");
    }
  };

  const handleStopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  // Upload Custom Sound File
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format
    const lowerName = file.name.toLowerCase();
    const validExts = [".mp3", ".wav", ".ogg"];
    const isValid = validExts.some((ext) => lowerName.endsWith(ext));

    if (!isValid) {
      showToast("Invalid audio format! Please upload an MP3, WAV, or OGG file.", "error");
      return;
    }

    // Stop existing preview if any
    handleStopPreview();

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/cms/media", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (json.success && json.file) {
        setSoundUrl(json.file.url);
        setSoundFileName(file.name);
        setIsCustom(true);
        showToast(`Sound uploaded successfully: ${file.name}`, "success");
      } else {
        showToast(json.error || "Failed to upload audio file", "error");
      }
    } catch {
      showToast("Network error uploading audio file", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Reset to Default Sound
  const handleResetToDefault = () => {
    handleStopPreview();
    setEnabled(true);
    setSoundUrl(defaultLoadingSoundSettings.soundUrl);
    setSoundFileName(
      defaultLoadingSoundSettings.soundFileName ||
        "whoosh-transition.wav (Default Futuristic Whoosh)"
    );
    setVolume(defaultLoadingSoundSettings.volume);
    setIsCustom(false);
    setResetConfirmOpen(false);
    showToast("Restored to Default Futuristic Whoosh sound.", "info");
  };

  // Save Settings
  const handleSave = async () => {
    setIsSaving(true);
    handleStopPreview();

    const newSettings: LoadingSoundSettings = {
      enabled,
      soundUrl,
      soundFileName,
      volume,
      isCustom,
    };

    try {
      const ok = await updateCms({ loadingSoundSettings: newSettings });
      if (ok) {
        showToast("Loading Sound Settings saved successfully!", "success");
      } else {
        showToast("Failed to save settings. Please try again.", "error");
      }
    } catch {
      showToast("Error saving settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav,.ogg,audio/mpeg,audio/wav,audio/ogg"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* ======================================================== */}
      {/* 1. HEADER HERO BANNER                                    */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#070e24] via-[#091536] to-[#050b1a] border border-[#00d2ff]/30 shadow-[0_0_40px_rgba(0,210,255,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[10px] font-mono font-bold uppercase text-[#00d2ff] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span>Cinematic FX Audio Controller</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Volume2 className="w-6 h-6 text-[#00d2ff]" />
            <span>Loading Sound Settings</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Configure the futuristic transition whoosh sound that plays when the loading screen splits open to reveal your portfolio.
          </p>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#0072ff] hover:from-[#00e1ff] hover:to-[#0088ff] text-[#050811] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,210,255,0.4)] disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
            <span>{isSaving ? "Saving..." : "Save Loading Sound Settings"}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN SETTINGS GRID                                    */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sound Status & Configuration (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Enable / Disable Toggle */}
          <div className="p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/20 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {enabled ? (
                    <Volume2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-rose-400" />
                  )}
                  <span>Transition Sound Status</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enable or disable the audio swipe when the screen splits left &amp; right.
                </p>
              </div>

              {/* Status Toggle Switch */}
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                  enabled
                    ? "bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    : "bg-slate-800 border-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    enabled ? "translate-x-8" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Visual Indicator Banner */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                enabled
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    enabled ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
                  }`}
                />
                <span>
                  {enabled ? "🟢 Loading Sound Enabled" : "🔴 Loading Sound Disabled"}
                </span>
              </div>
              <span className="text-[11px] font-mono opacity-80">
                {enabled
                  ? "Sound will play on split transition"
                  : "Silent transition (No audio)"}
              </span>
            </div>
          </div>

          {/* Card 2: Audio File Selection & Custom Upload */}
          <div className="p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/20 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileAudio className="w-5 h-5 text-[#00d2ff]" />
                  <span>Audio Source &amp; Custom Upload</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Use the default futuristic whoosh or upload your own custom sound effect.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20">
                {isCustom ? "Custom Audio File" : "Default Project Sound"}
              </span>
            </div>

            {/* Currently Selected Sound Display Card */}
            <div className="p-4 rounded-2xl bg-[#040815] border border-white/10 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Active Sound Track
              </span>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] shrink-0">
                    <Music className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <span className="text-sm font-bold text-white block truncate">
                      {soundFileName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 block truncate">
                      URL: {soundUrl}
                    </span>
                  </div>
                </div>

                {/* Upload & Replace Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <Upload className={`w-3.5 h-3.5 ${isUploading ? "animate-bounce" : ""}`} />
                  <span>{isUploading ? "Uploading..." : "Replace Sound"}</span>
                </button>
              </div>

              {/* Supported formats tag */}
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 pt-1">
                <span>Supported Formats:</span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                  .MP3
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                  .WAV
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                  .OGG
                </span>
              </div>
            </div>

            {/* Manual URL Input (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-slate-400">
                Direct Sound File Path or URL
              </label>
              <input
                type="text"
                value={soundUrl}
                onChange={(e) => {
                  setSoundUrl(e.target.value);
                  setIsCustom(e.target.value !== defaultLoadingSoundSettings.soundUrl);
                  setSoundFileName(e.target.value.split("/").pop() || "custom-sound.mp3");
                }}
                placeholder="/sounds/whoosh-transition.wav"
                className="w-full px-3.5 py-2 rounded-xl bg-[#040815] border border-white/10 text-white font-mono text-xs focus:border-[#00d2ff] outline-none"
              />
            </div>
          </div>

          {/* Card 3: Volume Controller */}
          <div className="p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/20 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-[#00d2ff]" />
                  <span>Volume Control</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust playback loudness (Recommended: 40%–50%).
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] font-mono font-bold text-sm">
                <span>🔈 Volume:</span>
                <span>{volume}%</span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2 pt-2">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 bg-[#040815] rounded-lg appearance-none cursor-pointer accent-[#00d2ff]"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0% (Muted)</span>
                <span>25%</span>
                <span>50% (Recommended)</span>
                <span>75%</span>
                <span>100% (Maximum)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Audio Preview & Reset (1 Col) */}
        <div className="space-y-6">
          {/* Card 4: Audio Preview Studio */}
          <div className="p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/20 shadow-lg space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <Radio className="w-4 h-4 text-[#00d2ff]" />
              <span>Audio Preview Studio</span>
            </h3>

            {/* Animated Waveform Visualizer Simulation */}
            <div className="h-28 rounded-2xl bg-[#040815] border border-white/5 flex items-center justify-center gap-1.5 p-4 overflow-hidden relative">
              {[40, 65, 85, 45, 95, 30, 75, 55, 90, 60, 40, 80, 50, 70].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isPlaying ? [`${h * 0.3}%`, `${h}%`, `${h * 0.2}%`] : "12%",
                  }}
                  transition={{
                    repeat: isPlaying ? Infinity : 0,
                    duration: 0.4 + (i % 3) * 0.15,
                    ease: "easeInOut",
                  }}
                  className={`w-1.5 rounded-full ${
                    isPlaying
                      ? "bg-gradient-to-t from-[#00d2ff] to-[#818cf8] shadow-[0_0_8px_#00d2ff]"
                      : "bg-white/10"
                  }`}
                />
              ))}

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-500">
                {isPlaying ? "Playing transition audio..." : "Sound paused / Idle"}
              </div>
            </div>

            {/* Preview Action Buttons */}
            <div className="space-y-2.5">
              {!isPlaying ? (
                <button
                  type="button"
                  onClick={handlePlayPreview}
                  className="w-full py-3 rounded-2xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/40 text-[#00d2ff] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.15)] group"
                >
                  <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                  <span>▶ Preview Sound</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopPreview}
                  className="w-full py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>⏹ Stop Preview</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Test how the whoosh sounds at the current volume setting before saving.
            </p>
          </div>

          {/* Card 5: Reset to Default Sound Option */}
          <div className="p-6 rounded-3xl bg-[#070e24] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Reset Configuration</span>
            </h3>
            <p className="text-xs text-slate-400">
              Discard any custom sound upload and restore the project&apos;s built-in futuristic whoosh.
            </p>

            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-slate-300 hover:text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>↻ Reset to Default Sound</span>
            </button>
          </div>

          {/* Card 6: Save Footer CTA */}
          <div className="p-5 rounded-3xl bg-gradient-to-b from-[#070e24] to-[#040815] border border-[#00d2ff]/30 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#00d2ff] block">
              Permanent Sync
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Clicking save immediately stores these audio settings to the CMS and applies them to all website visitors.
            </p>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00d2ff] to-[#0072ff] hover:opacity-90 text-[#050811] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,210,255,0.4)] disabled:opacity-50 transition-all cursor-pointer"
            >
              <Save className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
              <span>{isSaving ? "Saving..." : "💾 Save Loading Sound Settings"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. RESET CONFIRMATION MODAL                              */}
      {/* ======================================================== */}
      <AnimatePresence>
        {resetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-[#0b1329] border border-[#00d2ff]/30 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-amber-400 border-b border-white/10 pb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Reset to Default Sound?</h3>
                  <p className="text-[10px] font-mono text-amber-300">Confirmation Required</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                This will remove the current custom sound selection and restore the default
                futuristic whoosh transition audio (volume 45%).
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setResetConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
                >
                  Yes, Restore Default
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
