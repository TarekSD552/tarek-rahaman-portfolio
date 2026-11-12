"use client";

import { useState, useRef, useEffect } from "react";
import { resolveAudioUrl } from "@/components/media/WebsiteMediaPlayer";
import {
  Video,
  Music,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Save,
  Radio,
  Sliders,
  Check,
  X,
  Eye,
  Film,
  Plus,
  Headphones,
  Sparkles
} from "lucide-react";

function YouTubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

import {
  CmsData,
  WebsiteMediaManager,
  MediaVideoItem,
  MediaAudioItem,
  MediaYouTubeAudioItem,
  WebsiteMediaSettings
} from "@/types/portfolio";

interface WebsiteMediaManagerSectionProps {
  cmsData: CmsData;
  updateCms: (partial: Partial<CmsData>) => Promise<boolean | any>;
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  promptDelete: (title: string, desc: string, onConfirm: () => void) => void;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export default function WebsiteMediaManagerSection({
  cmsData,
  updateCms,
  showToast,
  promptDelete,
}: WebsiteMediaManagerSectionProps) {
  // Initialize state from CMS or defaults
  const currentMediaManager: WebsiteMediaManager = cmsData.mediaManager || {
    settings: {
      enabled: false,
      videoEnabled: false,
      audioEnabled: false,
      musicSource: "audio",
      activeVideoId: "",
      activeAudioId: "",
      activeYouTubeAudioId: "",
      autoplay: true,
      loop: true,
      volume: 80,
      muted: false,
    },
    videos: [],
    audios: [],
    youtubeAudios: [],
  };

  const [settings, setSettings] = useState<WebsiteMediaSettings>(
    currentMediaManager.settings
  );
  const [videos, setVideos] = useState<MediaVideoItem[]>(
    currentMediaManager.videos || []
  );
  const [audios, setAudios] = useState<MediaAudioItem[]>(
    currentMediaManager.audios || []
  );
  const [youtubeAudios, setYoutubeAudios] = useState<MediaYouTubeAudioItem[]>(
    currentMediaManager.youtubeAudios || []
  );

  // Sub-tabs: "settings" | "audios" | "yt-audios" | "videos"
  const [subTab, setSubTab] = useState<"settings" | "audios" | "yt-audios" | "videos">(
    "settings"
  );

  // Upload & status state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // YouTube Visual Video input state
  const [ytUrl, setYtUrl] = useState("");
  const [ytTitle, setYtTitle] = useState("");

  // YouTube Background Music input state
  const [ytAudioUrl, setYtAudioUrl] = useState("");
  const [ytAudioTitle, setYtAudioTitle] = useState("");

  // Uploaded Audio URL input state
  const [audioUrlInput, setAudioUrlInput] = useState("");
  const [audioTitleInput, setAudioTitleInput] = useState("");

  // Preview modal state
  const [previewMedia, setPreviewMedia] = useState<{
    type: "video" | "audio" | "youtube-audio";
    item: MediaVideoItem | MediaAudioItem | MediaYouTubeAudioItem;
  } | null>(null);

  // File inputs
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize state when CMS data loads or updates
  useEffect(() => {
    if (cmsData?.mediaManager) {
      if (cmsData.mediaManager.settings) {
        setSettings(cmsData.mediaManager.settings);
      }
      if (cmsData.mediaManager.videos) {
        setVideos(cmsData.mediaManager.videos);
      }
      if (cmsData.mediaManager.audios) {
        setAudios(cmsData.mediaManager.audios);
      }
      if (cmsData.mediaManager.youtubeAudios) {
        setYoutubeAudios(cmsData.mediaManager.youtubeAudios);
      }
    }
  }, [cmsData?.mediaManager]);

  // Save changes to CMS
  const handleSave = async (
    overrideSettings?: Partial<WebsiteMediaSettings>,
    overrideVideos?: MediaVideoItem[],
    overrideAudios?: MediaAudioItem[],
    overrideYouTubeAudios?: MediaYouTubeAudioItem[]
  ) => {
    setIsSaving(true);
    const newSettings = overrideSettings
      ? { ...settings, ...overrideSettings }
      : settings;
    const newVideos = overrideVideos !== undefined ? overrideVideos : videos;
    const newAudios = overrideAudios !== undefined ? overrideAudios : audios;
    const newYouTubeAudios = overrideYouTubeAudios !== undefined ? overrideYouTubeAudios : youtubeAudios;

    const updatedMediaManager: WebsiteMediaManager = {
      settings: newSettings,
      videos: newVideos,
      audios: newAudios,
      youtubeAudios: newYouTubeAudios,
    };

    try {
      const res = await updateCms({ mediaManager: updatedMediaManager });
      if (res) {
        setSettings(newSettings);
        if (overrideVideos) setVideos(newVideos);
        if (overrideAudios) setAudios(newAudios);
        if (overrideYouTubeAudios) setYoutubeAudios(newYouTubeAudios);
        showToast("Website Media settings saved successfully!");
      } else {
        showToast("Failed to save media settings", "error");
      }
    } catch (e: any) {
      showToast(e.message || "Failed to save", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Upload Video File (Visual Video Management)
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("uploading");
    setStatusMessage(`Uploading video "${file.name}"...`);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/cms/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      const newVideo: MediaVideoItem = {
        id: `vid-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        type: "upload",
        url: data.mediaItem.url,
        size: data.mediaItem.size,
        createdAt: new Date().toISOString().split("T")[0],
      };

      const updated = [newVideo, ...videos];
      setVideos(updated);
      setUploadStatus("success");
      setStatusMessage(`Video "${file.name}" uploaded successfully!`);
      showToast(`Video uploaded: ${file.name}`);

      await handleSave(undefined, updated, undefined, undefined);
    } catch (err: any) {
      setUploadStatus("error");
      setStatusMessage(err.message || "Video upload failed");
      showToast(err.message || "Video upload failed", "error");
    } finally {
      setIsUploading(false);
      if (videoFileInputRef.current) videoFileInputRef.current.value = "";
    }
  };

  // Add Visual YouTube Video (Visual Video Management)
  const handleAddYouTube = async (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractYouTubeId(ytUrl);
    if (!videoId) {
      showToast("Invalid YouTube URL. Please enter a valid YouTube link.", "error");
      return;
    }

    const title = ytTitle.trim() || `YouTube Video (${videoId})`;
    const newVideo: MediaVideoItem = {
      id: `yt-${Date.now()}`,
      title,
      type: "youtube",
      url: ytUrl,
      youtubeId: videoId,
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [newVideo, ...videos];
    setVideos(updated);
    setYtUrl("");
    setYtTitle("");
    showToast(`YouTube video "${title}" added!`);

    await handleSave(undefined, updated, undefined, undefined);
  };

  // Add YouTube Background Music (Dedicated Audio Only)
  const handleAddYouTubeAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractYouTubeId(ytAudioUrl);
    if (!videoId) {
      showToast("Invalid YouTube URL. Please enter a valid YouTube link.", "error");
      return;
    }

    const title = ytAudioTitle.trim() || `YouTube Background Music (${videoId})`;
    const newYtAudio: MediaYouTubeAudioItem = {
      id: `ytaud-${Date.now()}`,
      title,
      url: ytAudioUrl,
      youtubeId: videoId,
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [newYtAudio, ...youtubeAudios];
    setYoutubeAudios(updated);
    setYtAudioUrl("");
    setYtAudioTitle("");
    showToast(`YouTube Background Music "${title}" added!`);

    // If no active YouTube background track, activate this newly added track
    const newSettings: WebsiteMediaSettings = !settings.activeYouTubeAudioId
      ? {
          ...settings,
          musicSource: "youtube",
          activeYouTubeAudioId: newYtAudio.id,
          activeAudioId: "", // Deactivate uploaded audio for mutual exclusion
          audioEnabled: true,
          enabled: true,
          autoplay: true,
        }
      : settings;

    if (!settings.activeYouTubeAudioId) {
      setSettings(newSettings);
      try {
        localStorage.removeItem("tarek_portfolio_user_paused");
        sessionStorage.removeItem("tarek_portfolio_session_paused");
        sessionStorage.removeItem("tarek_portfolio_audio_user_disabled");
      } catch {}
    }

    await handleSave(newSettings, undefined, undefined, updated);
  };

  // Upload Audio File
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("uploading");
    setStatusMessage(`Uploading audio "${file.name}"...`);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/cms/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      const newAudio: MediaAudioItem = {
        id: `aud-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        type: "upload",
        url: data.mediaItem.url,
        size: data.mediaItem.size,
        createdAt: new Date().toISOString().split("T")[0],
      };

      const updated = [newAudio, ...audios];
      setAudios(updated);
      setUploadStatus("success");
      setStatusMessage(`Audio "${file.name}" uploaded successfully!`);
      showToast(`Audio uploaded: ${file.name}`);

      const newSettings = !settings.activeAudioId
        ? {
            ...settings,
            musicSource: "audio" as const,
            activeAudioId: newAudio.id,
            activeYouTubeAudioId: "",
            audioEnabled: true,
            enabled: true,
          }
        : undefined;
      if (newSettings) setSettings(newSettings);

      await handleSave(newSettings, undefined, updated, undefined);
    } catch (err: any) {
      setUploadStatus("error");
      setStatusMessage(err.message || "Audio upload failed");
      showToast(err.message || "Audio upload failed", "error");
    } finally {
      setIsUploading(false);
      if (audioFileInputRef.current) audioFileInputRef.current.value = "";
    }
  };

  // Add Direct Audio URL
  const handleAddAudioUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioUrlInput.trim()) return;

    const title = audioTitleInput.trim() || "Audio Stream / Track";
    const rawUrl = audioUrlInput.trim();
    const finalUrl = resolveAudioUrl(rawUrl);

    const newAudio: MediaAudioItem = {
      id: `aud-${Date.now()}`,
      title,
      type: "url",
      url: finalUrl,
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [newAudio, ...audios];
    setAudios(updated);
    setAudioUrlInput("");
    setAudioTitleInput("");
    showToast(`Audio track "${title}" added!`);

    const newSettings = !settings.activeAudioId
      ? {
          ...settings,
          musicSource: "audio" as const,
          activeAudioId: newAudio.id,
          activeYouTubeAudioId: "",
          audioEnabled: true,
          enabled: true,
        }
      : undefined;
    if (newSettings) setSettings(newSettings);

    await handleSave(newSettings, undefined, updated, undefined);
  };

  const activeVideo = videos.find((v) => v.id === settings.activeVideoId);
  const activeAudio = audios.find((a) => a.id === settings.activeAudioId);
  const activeYouTubeAudio = youtubeAudios.find((y) => y.id === settings.activeYouTubeAudioId);

  // Current active music source title
  const currentMusicSource = settings.musicSource ?? (settings.activeYouTubeAudioId ? "youtube" : "audio");
  const activeMusicTitle =
    currentMusicSource === "youtube"
      ? activeYouTubeAudio?.title || youtubeAudios[0]?.title || "None"
      : activeAudio?.title || audios[0]?.title || "None";

  return (
    <div className="space-y-6">
      {/* Hidden file inputs */}
      <input
        ref={videoFileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/quicktime"
        className="hidden"
        onChange={handleVideoUpload}
      />
      <input
        ref={audioFileInputRef}
        type="file"
        accept="audio/mp3,audio/mpeg,audio/wav,audio/wave,audio/ogg,audio/aac,audio/x-m4a,audio/flac"
        className="hidden"
        onChange={handleAudioUpload}
      />

      {/* ======================================================== */}
      {/* 1. TOP HEADER & STATUS BAR                               */}
      {/* ======================================================== */}
      <div className="rounded-2xl bg-[#070d1e]/90 border border-[#00d2ff]/20 p-5 sm:p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Film className="w-5 h-5 text-[#00d2ff]" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Website Media Manager
              </h2>
              {/* Media Live Status Pill */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  settings.enabled
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                    : "bg-slate-800/80 border border-slate-700 text-slate-400"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    settings.enabled ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                  }`}
                />
                {settings.enabled ? "Live on Website" : "Media Disabled"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Control background music (Uploaded or YouTube), ambient audio, autoplay, loop and playback settings across your entire portfolio.
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-3">
            {/* Master Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextState = !settings.enabled;
                const updates: Partial<WebsiteMediaSettings> = {
                  enabled: nextState,
                  audioEnabled: nextState,
                };
                if (nextState) {
                  updates.autoplay = true;
                  if (settings.musicSource === "youtube" && !settings.activeYouTubeAudioId && youtubeAudios.length > 0) {
                    updates.activeYouTubeAudioId = youtubeAudios[0].id;
                  } else if (!settings.activeAudioId && audios.length > 0) {
                    updates.activeAudioId = audios[0].id;
                  }
                  try {
                    localStorage.removeItem("tarek_portfolio_user_paused");
                    sessionStorage.removeItem("tarek_portfolio_session_paused");
                  } catch {}
                }
                setSettings((s) => ({ ...s, ...updates }));
                handleSave(updates);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                settings.enabled
                  ? "bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25"
                  : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{settings.enabled ? "Turn Media Off" : "Activate Website Media"}</span>
            </button>

            {/* Save Settings Button */}
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-white via-slate-100 to-slate-200 hover:from-white hover:to-white shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isSaving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </div>

        {/* Upload Status Banner */}
        {uploadStatus !== "idle" && (
          <div
            className={`mt-4 px-3.5 py-2 rounded-xl text-xs flex items-center justify-between gap-2 ${
              uploadStatus === "uploading"
                ? "bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff]"
                : uploadStatus === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {uploadStatus === "uploading" && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#00d2ff] animate-ping" />
              )}
              {uploadStatus === "success" && <CheckCircle2 className="w-4 h-4" />}
              {uploadStatus === "error" && <AlertCircle className="w-4 h-4" />}
              <span>{statusMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setUploadStatus("idle")}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Sub-Tabs Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={() => setSubTab("settings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              subTab === "settings"
                ? "bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/40 shadow-[0_0_15px_rgba(0,210,255,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Playback Controls & Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("audios")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              subTab === "audios"
                ? "bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/40 shadow-[0_0_15px_rgba(0,210,255,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Uploaded Audio ({audios.length})</span>
          </button>

          {/* Dedicated YouTube Background Music Tab */}
          <button
            type="button"
            onClick={() => setSubTab("yt-audios")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              subTab === "yt-audios"
                ? "bg-rose-500/15 text-rose-400 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <YouTubeIcon className="w-3.5 h-3.5 text-rose-500" />
            <span>YouTube Background Music ({youtubeAudios.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("videos")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              subTab === "videos"
                ? "bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/40 shadow-[0_0_15px_rgba(0,210,255,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Management ({videos.length})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TAB A: PLAYBACK CONTROLS & SETTINGS                   */}
      {/* ======================================================== */}
      {subTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: Active Selections & Toggles */}
          <div className="rounded-2xl bg-[#070d1e]/90 border border-[#00d2ff]/20 p-5 sm:p-6 shadow-lg space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
              <Sliders className="w-4 h-4 text-[#00d2ff]" />
              <span>Media Playback Preferences</span>
            </h3>

            {/* Master Enable Website Background Music */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#050811] border border-white/10">
              <div>
                <div className="text-xs font-bold text-white">Enable Background Music</div>
                <div className="text-[11px] text-slate-400">Play selected audio/YouTube music as background music on public website</div>
              </div>
              <input
                type="checkbox"
                checked={settings.enabled && settings.audioEnabled}
                onChange={(e) => {
                  const val = e.target.checked;
                  const newSettings = {
                    ...settings,
                    enabled: val,
                    audioEnabled: val,
                  };
                  setSettings(newSettings);
                  handleSave(newSettings);
                }}
                className="w-5 h-5 accent-[#00d2ff] cursor-pointer"
              />
            </div>

            {/* Background Music Source Selection (Mutual Exclusion) */}
            <div className="p-3.5 rounded-xl bg-[#050811] border border-white/10 space-y-3">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Active Background Music Source</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-[#00d2ff]">
                  {currentMusicSource.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const targetAudioId = settings.activeAudioId || (audios[0] ? audios[0].id : "");
                    const newSettings = {
                      ...settings,
                      musicSource: "audio" as const,
                      activeAudioId: targetAudioId,
                      audioEnabled: !!targetAudioId,
                      enabled: !!targetAudioId ? true : settings.enabled,
                    };
                    setSettings(newSettings);
                    handleSave(newSettings);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                    currentMusicSource === "audio"
                      ? "bg-[#00d2ff]/15 border-[#00d2ff]/50 text-[#00d2ff] shadow-[0_0_12px_rgba(0,210,255,0.2)]"
                      : "bg-[#090f1f] border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Uploaded Audio</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const targetYtId = settings.activeYouTubeAudioId || (youtubeAudios[0] ? youtubeAudios[0].id : "");
                    const newSettings = {
                      ...settings,
                      musicSource: "youtube" as const,
                      activeYouTubeAudioId: targetYtId,
                      audioEnabled: !!targetYtId,
                      enabled: !!targetYtId ? true : settings.enabled,
                    };
                    setSettings(newSettings);
                    handleSave(newSettings);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                    currentMusicSource === "youtube"
                      ? "bg-rose-500/15 border-rose-500/50 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                      : "bg-[#090f1f] border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <YouTubeIcon className="w-3.5 h-3.5 text-rose-500" />
                  <span>YouTube Music</span>
                </button>
              </div>
            </div>

            {/* Active Track Selector depending on Source */}
            {currentMusicSource === "audio" ? (
              <div className="p-3.5 rounded-xl bg-[#050811] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Active Uploaded Audio Track</div>
                    <div className="text-[11px] text-slate-400">Choose which uploaded audio track plays</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.audioEnabled && !!settings.activeAudioId}
                    onChange={(e) => {
                      const val = e.target.checked;
                      const newSettings = {
                        ...settings,
                        musicSource: "audio" as const,
                        audioEnabled: val,
                        enabled: val ? true : settings.enabled,
                      };
                      setSettings(newSettings);
                      handleSave(newSettings);
                    }}
                    className="w-5 h-5 accent-[#00d2ff] cursor-pointer"
                  />
                </div>

                <div>
                  <select
                    value={settings.activeAudioId || ""}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      if (nextId) {
                        try {
                          localStorage.removeItem("tarek_portfolio_user_paused");
                          sessionStorage.removeItem("tarek_portfolio_session_paused");
                        } catch {}
                      }
                      const newSettings = {
                        ...settings,
                        musicSource: "audio" as const,
                        activeAudioId: nextId,
                        activeYouTubeAudioId: "", // mutual exclusion
                        audioEnabled: !!nextId,
                        enabled: !!nextId ? true : settings.enabled,
                        autoplay: true,
                      };
                      setSettings(newSettings);
                      handleSave(newSettings);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#090f1f] border border-white/15 text-xs text-white"
                  >
                    <option value="">-- No Active Track (Silent) --</option>
                    {audios.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title} ({a.type.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#050811] border border-rose-500/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Active YouTube Music Track</div>
                    <div className="text-[11px] text-slate-400">Choose which YouTube track plays invisibly in the background</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.audioEnabled && !!settings.activeYouTubeAudioId}
                    onChange={(e) => {
                      const val = e.target.checked;
                      const newSettings = {
                        ...settings,
                        musicSource: "youtube" as const,
                        audioEnabled: val,
                        enabled: val ? true : settings.enabled,
                      };
                      setSettings(newSettings);
                      handleSave(newSettings);
                    }}
                    className="w-5 h-5 accent-rose-500 cursor-pointer"
                  />
                </div>

                <div>
                  <select
                    value={settings.activeYouTubeAudioId || ""}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      if (nextId) {
                        try {
                          localStorage.removeItem("tarek_portfolio_user_paused");
                          sessionStorage.removeItem("tarek_portfolio_session_paused");
                        } catch {}
                      }
                      const newSettings = {
                        ...settings,
                        musicSource: "youtube" as const,
                        activeYouTubeAudioId: nextId,
                        activeAudioId: "", // mutual exclusion
                        audioEnabled: !!nextId,
                        enabled: !!nextId ? true : settings.enabled,
                        autoplay: true,
                      };
                      setSettings(newSettings);
                      handleSave(newSettings);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#090f1f] border border-white/15 text-xs text-white"
                  >
                    <option value="">-- No Active Track (Silent) --</option>
                    {youtubeAudios.map((y) => (
                      <option key={y.id} value={y.id}>
                        {y.title} (YOUTUBE)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Public Display Policy Notice */}
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-slate-300 text-xs leading-relaxed space-y-1">
              <div className="font-bold text-[#00d2ff] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Invisible Background Audio System</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Whether you select an uploaded MP3 or a YouTube music link, the visual video/player is never displayed on the public portfolio. Visitors only hear the music streaming in the background, controlled by the sidebar icon.
              </p>
            </div>
          </div>

          {/* Right Panel: Playback Fine Tuning */}
          <div className="rounded-2xl bg-[#070d1e]/90 border border-[#00d2ff]/20 p-5 sm:p-6 shadow-lg space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
              <Volume2 className="w-4 h-4 text-[#00d2ff]" />
              <span>Volume & Playback Behavior</span>
            </h3>

            {/* Autoplay Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#050811] border border-white/10">
              <div>
                <div className="text-xs font-bold text-white">Autoplay on Load</div>
                <div className="text-[11px] text-slate-400">
                  Attempt playback on visit (compliant with browser policies)
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoplay}
                onChange={(e) => {
                  const val = e.target.checked;
                  const newSettings = { ...settings, autoplay: val };
                  setSettings(newSettings);
                  handleSave(newSettings);
                }}
                className="w-5 h-5 accent-[#00d2ff] cursor-pointer"
              />
            </div>

            {/* Loop Playback */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#050811] border border-white/10">
              <div>
                <div className="text-xs font-bold text-white">Loop Playback</div>
                <div className="text-[11px] text-slate-400">Automatically repeat music when finished</div>
              </div>
              <input
                type="checkbox"
                checked={settings.loop}
                onChange={(e) => {
                  const val = e.target.checked;
                  const newSettings = { ...settings, loop: val };
                  setSettings(newSettings);
                  handleSave(newSettings);
                }}
                className="w-5 h-5 accent-[#00d2ff] cursor-pointer"
              />
            </div>

            {/* Muted by Default */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#050811] border border-white/10">
              <div>
                <div className="text-xs font-bold text-white">Muted / Unmuted</div>
                <div className="text-[11px] text-slate-400">Start with sound muted or unmuted</div>
              </div>
              <input
                type="checkbox"
                checked={settings.muted}
                onChange={(e) => {
                  const val = e.target.checked;
                  const newSettings = { ...settings, muted: val };
                  setSettings(newSettings);
                  handleSave(newSettings);
                }}
                className="w-5 h-5 accent-[#00d2ff] cursor-pointer"
              />
            </div>

            {/* Volume Slider */}
            <div className="p-3.5 rounded-xl bg-[#050811] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Default Volume</span>
                <span className="text-xs font-mono font-bold text-[#00d2ff]">{settings.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.volume}
                onChange={(e) => setSettings((s) => ({ ...s, volume: Number(e.target.value) }))}
                onMouseUp={() => handleSave()}
                onTouchEnd={() => handleSave()}
                className="w-full h-1.5 accent-[#00d2ff] cursor-pointer"
              />
            </div>

            {/* Live Summary */}
            <div className="p-3 rounded-xl bg-[#00d2ff]/05 border border-[#00d2ff]/20 text-[11px] space-y-1">
              <div className="font-bold text-[#00d2ff]">Live Website Status:</div>
              <div className="text-slate-300">
                • Active Background Music: <span className="text-white font-bold">{activeMusicTitle}</span> ({currentMusicSource.toUpperCase()})
              </div>
              <div className="text-slate-300">
                • Visual Video: <span className="text-white">{activeVideo?.title || "None"}</span>
              </div>
              <div className="text-slate-300">
                • Playback State: <span className={settings.enabled && settings.audioEnabled ? "text-emerald-400" : "text-slate-400"}>
                  {settings.enabled && settings.audioEnabled ? "ENABLED & PLAYING" : "MUTED / STOPPED"}
                </span>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave()}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#00d2ff] to-[#38bdf8] shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>{isSaving ? "Saving Settings..." : "Save Playback Settings"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TAB B: UPLOADED AUDIO MANAGEMENT                      */}
      {/* ======================================================== */}
      {subTab === "audios" && (
        <div className="space-y-6">
          {/* Audio Add / Upload Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Direct Upload Card */}
            <div className="p-5 rounded-2xl bg-[#070d1e]/90 border border-[#00d2ff]/20 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <Upload className="w-4 h-4 text-[#00d2ff]" />
                <span>Upload Audio File</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Upload MP3, WAV, OGG, or AAC audio files from your computer (up to 100MB).
              </p>
              <button
                type="button"
                disabled={isUploading}
                onClick={() => audioFileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-white/[0.06] hover:bg-[#00d2ff]/15 border border-white/10 hover:border-[#00d2ff]/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5 text-[#00d2ff]" />
                <span>{isUploading ? "Uploading..." : "Select Audio from Computer"}</span>
              </button>
            </div>

            {/* Direct Audio URL Input Card */}
            <form
              onSubmit={handleAddAudioUrl}
              className="p-5 rounded-2xl bg-[#070d1e]/90 border border-[#00d2ff]/20 space-y-3"
            >
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <Music className="w-4 h-4 text-[#00d2ff]" />
                <span>Add Audio URL</span>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Direct Audio Stream URL (e.g. https://.../track.mp3)"
                  value={audioUrlInput}
                  onChange={(e) => setAudioUrlInput(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-white/15 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Audio Title (e.g. Ambient Cinematic Track)"
                  value={audioTitleInput}
                  onChange={(e) => setAudioTitleInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-white/15 text-xs text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#00d2ff] to-[#0072ff] hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Audio Track</span>
              </button>
            </form>
          </div>

          {/* Audios Grid */}
          <div className="rounded-2xl bg-[#070d1e]/90 border border-[#00d2ff]/20 p-5 sm:p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-[#00d2ff]" />
                <span>All Audio Tracks ({audios.length})</span>
              </h3>
              <span className="text-xs text-slate-400">Click &quot;Set as Active&quot; to play as background music</span>
            </div>

            {audios.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No audio tracks added yet. Upload an MP3 file or add a direct audio URL above.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {audios.map((aud) => {
                  const isActive = currentMusicSource === "audio" && settings.activeAudioId === aud.id;
                  return (
                    <div
                      key={aud.id}
                      className={`p-4 rounded-2xl bg-[#050811] border transition-all flex flex-col justify-between space-y-3 ${
                        isActive
                          ? "border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.3)]"
                          : "border-white/10 hover:border-white/25"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] shrink-0">
                            <Music className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate" title={aud.title}>
                              {aud.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                              <span>{aud.size || "Audio Stream"}</span>
                              <span>•</span>
                              <span>{aud.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        {isActive && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-[9px] font-extrabold text-slate-950 uppercase shadow-md flex items-center gap-1 shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                            ACTIVE
                          </span>
                        )}
                      </div>

                      {/* Built-in Preview Player */}
                      <div className="bg-[#090f1f] p-2 rounded-xl">
                        <audio src={resolveAudioUrl(aud.url)} controls preload="metadata" className="w-full h-8 accent-[#00d2ff]" />
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newActive = isActive ? "" : aud.id;
                            const newSettings: WebsiteMediaSettings = {
                              ...settings,
                              musicSource: "audio",
                              activeAudioId: newActive,
                              activeYouTubeAudioId: "", // Deactivate YouTube music
                              audioEnabled: !!newActive,
                              enabled: !!newActive ? true : settings.enabled,
                              autoplay: true,
                            };
                            if (newActive) {
                              try {
                                localStorage.removeItem("tarek_portfolio_user_paused");
                                sessionStorage.removeItem("tarek_portfolio_session_paused");
                                sessionStorage.removeItem("tarek_portfolio_audio_user_disabled");
                              } catch {}
                            }
                            setSettings(newSettings);
                            handleSave(newSettings);
                            showToast(
                              isActive
                                ? `Audio "${aud.title}" deactivated.`
                                : `Audio "${aud.title}" set as active on website!`
                            );
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            isActive
                              ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                              : "bg-[#00d2ff]/15 text-[#00d2ff] hover:bg-[#00d2ff]/25 border border-[#00d2ff]/40"
                          }`}
                        >
                          {isActive ? "Deactivate" : "Set as Active"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(aud.url);
                            showToast("Audio URL copied to clipboard!");
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                          title="Copy URL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            promptDelete(`Delete audio "${aud.title}"?`, "This cannot be undone.", () => {
                              const updated = audios.filter((a) => a.id !== aud.id);
                              const newActive =
                                settings.activeAudioId === aud.id ? "" : settings.activeAudioId;
                              const newSettings: WebsiteMediaSettings = {
                                ...settings,
                                activeAudioId: newActive,
                                audioEnabled: newActive ? settings.audioEnabled : (updated.length > 0 ? settings.audioEnabled : false),
                              };
                              setAudios(updated);
                              setSettings(newSettings);
                              handleSave(newSettings, undefined, updated, undefined);
                              showToast(`Audio "${aud.title}" deleted.`);
                            });
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                          title="Delete Audio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB C: YOUTUBE BACKGROUND MUSIC (AUDIO ONLY)          */}
      {/* ======================================================== */}
      {subTab === "yt-audios" && (
        <div className="space-y-6">
          {/* Add YouTube Background Music Form */}
          <form
            onSubmit={handleAddYouTubeAudio}
            className="p-5 rounded-2xl bg-[#070d1e]/90 border border-rose-500/30 space-y-4 shadow-lg"
          >
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
              <YouTubeIcon className="w-4 h-4 text-rose-500" />
              <span>Add YouTube Background Music</span>
              <span className="text-[10px] normal-case font-normal text-rose-300/80 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                Audio Only — Video is completely hidden on public website
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="YouTube URL (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)"
                value={ytAudioUrl}
                onChange={(e) => setYtAudioUrl(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-white/15 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Optional Title (e.g. Lofi Coding Beats / Ambient Synthwave)"
                value={ytAudioTitle}
                onChange={(e) => setYtAudioTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-white/15 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.25)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add YouTube Background Music</span>
            </button>
          </form>

          {/* YouTube Background Music Tracks Grid */}
          <div className="rounded-2xl bg-[#070d1e]/90 border border-[#00d2ff]/20 p-5 sm:p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <YouTubeIcon className="w-4 h-4 text-rose-500" />
                <span>Saved YouTube Background Tracks ({youtubeAudios.length})</span>
              </h3>
              <span className="text-xs text-slate-400">Click &quot;Set as Active&quot; to play on live portfolio</span>
            </div>

            {youtubeAudios.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No YouTube background music tracks added yet. Paste a YouTube video URL above to use its audio as background music.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {youtubeAudios.map((yta) => {
                  const isActive = currentMusicSource === "youtube" && settings.activeYouTubeAudioId === yta.id;
                  return (
                    <div
                      key={yta.id}
                      className={`p-3 rounded-2xl bg-[#050811] border transition-all flex flex-col justify-between space-y-3 ${
                        isActive
                          ? "border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                          : "border-white/10 hover:border-white/25"
                      }`}
                    >
                      {/* Video Thumbnail (Admin reference only) */}
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/60 flex items-center justify-center">
                        <img
                          src={`https://img.youtube.com/vi/${yta.youtubeId}/hqdefault.jpg`}
                          alt={yta.title}
                          className="w-full h-full object-cover"
                        />

                        {/* Audio-Only Badge */}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-[9px] font-bold text-rose-400 uppercase border border-rose-500/30 flex items-center gap-1">
                          <Headphones className="w-2.5 h-2.5" />
                          <span>AUDIO ONLY</span>
                        </span>

                        {/* Active Badge */}
                        {isActive && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-500 text-[9px] font-extrabold text-slate-950 uppercase shadow-md flex items-center gap-1">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                            ACTIVE
                          </span>
                        )}

                        {/* Play Preview overlay */}
                        <button
                          type="button"
                          onClick={() => setPreviewMedia({ type: "youtube-audio", item: yta })}
                          className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/75 hover:bg-rose-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                          title="Preview Audio"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>
                      </div>

                      {/* Info */}
                      <div>
                        <h4 className="text-xs font-bold text-white truncate" title={yta.title}>
                          {yta.title}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                          <span>ID: {yta.youtubeId}</span>
                          <span>{yta.createdAt}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newActive = isActive ? "" : yta.id;
                            const newSettings: WebsiteMediaSettings = {
                              ...settings,
                              musicSource: "youtube",
                              activeYouTubeAudioId: newActive,
                              activeAudioId: "", // Deactivate uploaded audio
                              audioEnabled: !!newActive,
                              enabled: !!newActive ? true : settings.enabled,
                              autoplay: true,
                            };
                            if (newActive) {
                              try {
                                localStorage.removeItem("tarek_portfolio_user_paused");
                                sessionStorage.removeItem("tarek_portfolio_session_paused");
                                sessionStorage.removeItem("tarek_portfolio_audio_user_disabled");
                              } catch {}
                            }
                            setSettings(newSettings);
                            handleSave(newSettings);
                            showToast(
                              isActive
                                ? `YouTube music "${yta.title}" deactivated.`
                                : `YouTube music "${yta.title}" set as active on website!`
                            );
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            isActive
                              ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                              : "bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/40"
                          }`}
                        >
                          {isActive ? "Deactivate" : "Set as Active"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(yta.url);
                            showToast("YouTube URL copied to clipboard!");
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                          title="Copy URL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            promptDelete(`Delete YouTube track "${yta.title}"?`, "This will remove it from saved tracks.", () => {
                              const updated = youtubeAudios.filter((y) => y.id !== yta.id);
                              const newActive =
                                settings.activeYouTubeAudioId === yta.id ? "" : settings.activeYouTubeAudioId;
                              const newSettings: WebsiteMediaSettings = {
                                ...settings,
                                activeYouTubeAudioId: newActive,
                                audioEnabled: newActive ? settings.audioEnabled : (updated.length > 0 ? settings.audioEnabled : false),
                              };
                              setYoutubeAudios(updated);
                              setSettings(newSettings);
                              handleSave(newSettings, undefined, undefined, updated);
                              showToast(`YouTube track "${yta.title}" deleted.`);
                            });
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                          title="Delete Track"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. TAB D: VISUAL VIDEO MANAGEMENT                        */}
      {/* ======================================================== */}
      {subTab === "videos" && (
        <div className="space-y-6">
          {/* Video Add / Upload Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Direct Upload Card */}
            <div className="p-5 rounded-2xl bg-[#070d1e]/90 border border-[#00d2ff]/20 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <Upload className="w-4 h-4 text-[#00d2ff]" />
                <span>Upload Video File</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Upload MP4, WebM, or OGG video files from your computer (up to 100MB).
              </p>
              <button
                type="button"
                disabled={isUploading}
                onClick={() => videoFileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-white/[0.06] hover:bg-[#00d2ff]/15 border border-white/10 hover:border-[#00d2ff]/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5 text-[#00d2ff]" />
                <span>{isUploading ? "Uploading..." : "Select Video from Computer"}</span>
              </button>
            </div>

            {/* Add YouTube Video Card */}
            <form
              onSubmit={handleAddYouTube}
              className="p-5 rounded-2xl bg-[#070d1e]/90 border border-[#00d2ff]/20 space-y-3"
            >
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <YouTubeIcon className="w-4 h-4 text-rose-500" />
                <span>Add YouTube Video</span>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
                  value={ytUrl}
                  onChange={(e) => setYtUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-white/15 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Optional Title (e.g. Project Demo Showreel)"
                  value={ytTitle}
                  onChange={(e) => setYtTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-white/15 text-xs text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add YouTube Video</span>
              </button>
            </form>
          </div>

          {/* Videos Grid */}
          <div className="rounded-2xl bg-[#070d1e]/90 border border-[#00d2ff]/20 p-5 sm:p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-[#00d2ff]" />
                <span>All Videos ({videos.length})</span>
              </h3>
              <span className="text-xs text-slate-400">Visual videos managed separately from background music</span>
            </div>

            {videos.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No videos added yet. Upload an MP4 video or add a YouTube link above.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((vid) => {
                  const isActive = settings.activeVideoId === vid.id;
                  return (
                    <div
                      key={vid.id}
                      className={`p-3 rounded-2xl bg-[#050811] border transition-all flex flex-col justify-between space-y-3 ${
                        isActive
                          ? "border-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.3)]"
                          : "border-white/10 hover:border-white/25"
                      }`}
                    >
                      {/* Thumbnail / Video Container */}
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/60 flex items-center justify-center">
                        {vid.type === "youtube" && vid.youtubeId ? (
                          <img
                            src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                            alt={vid.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={vid.url}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* Type Badge */}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-bold text-[#00d2ff] uppercase border border-white/10">
                          {vid.type}
                        </span>

                        {/* Active Badge */}
                        {isActive && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-500 text-[9px] font-extrabold text-slate-950 uppercase shadow-md flex items-center gap-1">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                            ACTIVE
                          </span>
                        )}

                        {/* Play Preview overlay */}
                        <button
                          type="button"
                          onClick={() => setPreviewMedia({ type: "video", item: vid })}
                          className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/70 hover:bg-[#00d2ff] text-white hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-lg"
                          title="Preview Video"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>
                      </div>

                      {/* Video Info */}
                      <div>
                        <h4 className="text-xs font-bold text-white truncate" title={vid.title}>
                          {vid.title}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                          <span>{vid.size || (vid.type === "youtube" ? "YouTube Embed" : "")}</span>
                          <span>{vid.createdAt}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newActive = isActive ? "" : vid.id;
                            const newSettings = {
                              ...settings,
                              activeVideoId: newActive,
                              videoEnabled: !!newActive,
                            };
                            setSettings(newSettings);
                            handleSave(newSettings);
                            showToast(
                              isActive
                                ? `Video "${vid.title}" deactivated.`
                                : `Video "${vid.title}" set as active!`
                            );
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            isActive
                              ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                              : "bg-[#00d2ff]/15 text-[#00d2ff] hover:bg-[#00d2ff]/25 border border-[#00d2ff]/40"
                          }`}
                        >
                          {isActive ? "Deactivate" : "Set as Active"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(vid.url);
                            showToast("Video URL copied to clipboard!");
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                          title="Copy URL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            promptDelete(`Delete video "${vid.title}"?`, "This cannot be undone.", () => {
                              const updated = videos.filter((v) => v.id !== vid.id);
                              const newActive =
                                settings.activeVideoId === vid.id ? "" : settings.activeVideoId;
                              const newSettings = {
                                ...settings,
                                activeVideoId: newActive,
                              };
                              setVideos(updated);
                              setSettings(newSettings);
                              handleSave(newSettings, updated, undefined, undefined);
                              showToast(`Video "${vid.title}" deleted.`);
                            });
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. PREVIEW MODAL                                         */}
      {/* ======================================================== */}
      {previewMedia && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#090f1f] border border-[#00d2ff]/40 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#00d2ff]" />
                <span>Preview: {previewMedia.item.title}</span>
              </h3>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-black flex items-center justify-center">
              {previewMedia.type === "video" ? (
                (previewMedia.item as MediaVideoItem).type === "youtube" &&
                (previewMedia.item as MediaVideoItem).youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${(previewMedia.item as MediaVideoItem).youtubeId}?autoplay=1`}
                    className="w-full aspect-video border-0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={previewMedia.item.url}
                    controls
                    autoPlay
                    className="w-full aspect-video"
                  />
                )
              ) : previewMedia.type === "youtube-audio" ? (
                <div className="p-4 w-full flex flex-col items-center justify-center space-y-3">
                  <div className="relative aspect-video w-full max-w-md rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${(previewMedia.item as MediaYouTubeAudioItem).youtubeId}?autoplay=1`}
                      className="w-full h-full border-0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-xs text-slate-400 text-center">
                    Previewing YouTube Audio Source (Note: This video is 100% invisible on the live portfolio).
                  </p>
                </div>
              ) : (
                <div className="p-8 w-full flex flex-col items-center justify-center space-y-3">
                  <Music className="w-10 h-10 text-[#00d2ff] animate-bounce" />
                  <audio src={resolveAudioUrl(previewMedia.item.url)} controls autoPlay className="w-full max-w-md" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
