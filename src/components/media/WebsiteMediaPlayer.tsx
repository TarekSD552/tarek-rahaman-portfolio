"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";
import { Play, Pause } from "lucide-react";

const STORAGE_DISABLED_KEY = "tarek_portfolio_audio_user_disabled";

// Robust YouTube Video ID extractor
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

// Convert web sharing links (like Google Drive) to direct streamable URLs
export function resolveAudioUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  const trimmed = rawUrl.trim();

  // If already a local asset in public directory
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // Handle Google Drive links
  if (trimmed.includes("drive.google.com")) {
    const idMatch =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const fileId = idMatch ? idMatch[1] : null;
    if (fileId) {
      if (fileId === "1t4UzEvy_uQ4tq-wKcNb3tXCxp8vYSu-9") {
        return "/uploads/deep-focus-trading-theme.mp3";
      }
      return `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
    }
  }

  return trimmed;
}

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
    __tarekYouTubePlayer?: any;
    __tarekAudioElement?: HTMLAudioElement;
    __tarekAudioInteractionHandler?: (e: Event) => void;
  }
}

export default function WebsiteMediaPlayer() {
  const pathname = usePathname();
  const { cmsData } = useCms();
  const { language } = useLanguage();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytContainerRef = useRef<HTMLDivElement | null>(null);

  const mediaManager = cmsData?.mediaManager;
  const settings = mediaManager?.settings;

  const isAdmin = Boolean(pathname?.startsWith("/admin"));
  const isEnabled = (settings?.enabled ?? true) && (settings?.audioEnabled ?? true);

  // Active Music Source from CMS: "youtube" or "audio"
  const musicSource: "youtube" | "audio" =
    settings?.musicSource === "youtube" ? "youtube" : "audio";

  // YouTube source resolution
  const activeYtItem =
    settings?.activeYouTubeAudioId
      ? mediaManager?.youtubeAudios?.find((y) => y.id === settings.activeYouTubeAudioId)
      : mediaManager?.youtubeAudios?.[0];

  const youtubeVideoId =
    activeYtItem?.youtubeId ||
    (activeYtItem?.url ? extractYouTubeId(activeYtItem.url) : null);

  // Uploaded audio source resolution
  const activeAudioItem =
    settings?.activeAudioId
      ? mediaManager?.audios?.find((a) => a.id === settings.activeAudioId)
      : mediaManager?.audios?.[0];

  const rawAudioUrl = activeAudioItem?.url || "";
  const resolvedAudioUrl = resolveAudioUrl(rawAudioUrl);

  // Active track title for tooltip/accessibility
  const activeTitle =
    musicSource === "youtube"
      ? activeYtItem?.title || `YouTube Track (${youtubeVideoId || "None"})`
      : activeAudioItem?.title || "Uploaded Audio Track";

  const targetVolume = settings?.muted ? 0 : (settings?.volume ?? 60);
  const targetLoop = settings?.loop ?? true;

  // Helper to test if user manually disabled audio in this session
  const isSessionDisabled = useCallback(() => {
    try {
      return (
        sessionStorage.getItem(STORAGE_DISABLED_KEY) === "true" ||
        localStorage.getItem("tarek_portfolio_user_paused") === "true"
      );
    } catch {
      return false;
    }
  }, []);

  // Cleanup interaction fallback
  const cleanupInteractionFallback = useCallback(() => {
    if (typeof window === "undefined") return;
    const handler = window.__tarekAudioInteractionHandler;
    if (handler) {
      const events = ["pointerdown", "click", "keydown", "touchstart", "wheel"];
      events.forEach((evt) => {
        document.removeEventListener(evt, handler, true);
        window.removeEventListener(evt, handler, true);
      });
      window.__tarekAudioInteractionHandler = undefined;
    }
  }, []);

  // Arm interaction fallback listener: triggers playback on the very first user interaction
  const armInteractionFallback = useCallback(
    (triggerFn: () => void) => {
      if (typeof window === "undefined") return;
      if (isSessionDisabled()) return;

      cleanupInteractionFallback();

      const handler = (e: Event) => {
        const target = e.target as HTMLElement | null;
        // Don't intercept clicks directly on the toggle button
        if (target && target.closest && target.closest('[data-audio-toggle="true"]')) {
          return;
        }

        if (isSessionDisabled()) {
          cleanupInteractionFallback();
          return;
        }

        console.info("[WebsiteMediaPlayer] User interaction detected. Starting audio playback...");
        try {
          triggerFn();
        } catch (err) {
          console.warn("[WebsiteMediaPlayer] Interaction trigger error:", err);
        }
        cleanupInteractionFallback();
      };

      window.__tarekAudioInteractionHandler = handler;
      const events = ["pointerdown", "click", "keydown", "touchstart", "wheel"];
      events.forEach((evt) => {
        document.addEventListener(evt, handler, { passive: true, capture: true });
        window.addEventListener(evt, handler, { passive: true, capture: true });
      });
    },
    [isSessionDisabled, cleanupInteractionFallback]
  );

  // Diagnostic logging
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[WebsiteMediaPlayer] Current Configuration:", {
        musicSource,
        isEnabled,
        activeTitle,
        youtubeVideoId,
        resolvedAudioUrl,
        volume: targetVolume,
        loop: targetLoop,
        muted: settings?.muted ?? false,
      });
    }
  }, [musicSource, isEnabled, activeTitle, youtubeVideoId, resolvedAudioUrl, targetVolume, targetLoop, settings?.muted]);

  // Keep window global reference synced for audio element
  useEffect(() => {
    if (audioRef.current) {
      window.__tarekAudioElement = audioRef.current;
    }
  }, []);

  // =========================================================================
  // 1. YOUTUBE BACKGROUND PLAYER CONTROLLER
  // =========================================================================
  useEffect(() => {
    if (isAdmin || !isEnabled || musicSource !== "youtube" || !youtubeVideoId) {
      // Pause YouTube player if active
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.pauseVideo();
        } catch {}
      }
      return;
    }

    // Stop HTML5 audio element immediately when switching to YouTube
    if (audioRef.current && !audioRef.current.paused) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {}
    }

    let isSubscribed = true;

    const playYouTubeSafely = (player: any) => {
      if (!player) return;
      try {
        try {
          player.unMute();
        } catch {}
        player.setVolume(targetVolume);
        if (targetLoop) {
          try {
            player.setLoop(true);
          } catch {}
        }
        player.playVideo();
      } catch (err) {
        console.warn("[WebsiteMediaPlayer] YouTube playVideo call:", err);
      }
    };

    const createOrUpdateYtPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      const hostEl = document.getElementById("tarek-yt-bg-player-host");
      if (!hostEl) return;

      // Update existing player
      if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === "function") {
        try {
          try {
            ytPlayerRef.current.unMute();
          } catch {}
          ytPlayerRef.current.setVolume(targetVolume);
          const currentId = ytPlayerRef.current.getVideoData?.()?.video_id;
          if (currentId !== youtubeVideoId) {
            ytPlayerRef.current.loadVideoById({
              videoId: youtubeVideoId,
              startSeconds: 0,
            });
            if (isSessionDisabled()) {
              ytPlayerRef.current.pauseVideo();
            } else {
              playYouTubeSafely(ytPlayerRef.current);
            }
          }
          return;
        } catch (e) {
          console.warn("[WebsiteMediaPlayer] Existing YouTube player update failed:", e);
        }
      }

      // Initialize new YouTube Player
      try {
        const player = new window.YT.Player("tarek-yt-bg-player-host", {
          videoId: youtubeVideoId,
          playerVars: {
            autoplay: isSessionDisabled() ? 0 : 1,
            loop: targetLoop ? 1 : 0,
            playlist: youtubeVideoId,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event: any) => {
              if (!isSubscribed) return;
              ytPlayerRef.current = event.target;
              window.__tarekYouTubePlayer = event.target;

              try {
                event.target.unMute();
                event.target.setVolume(targetVolume);
              } catch {}

              if (!isSessionDisabled()) {
                playYouTubeSafely(event.target);
                // Arm user interaction fallback in case browser blocked autoplay
                armInteractionFallback(() => {
                  playYouTubeSafely(event.target);
                });
              } else {
                setIsPlaying(false);
              }
            },
            onStateChange: (event: any) => {
              if (!isSubscribed) return;
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING
              if (event.data === 1) {
                setIsPlaying(true);
                cleanupInteractionFallback();
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                if (targetLoop) {
                  try {
                    event.target.playVideo();
                  } catch {}
                } else {
                  setIsPlaying(false);
                }
              }
            },
            onError: (err: any) => {
              console.error("[WebsiteMediaPlayer] YouTube Player error event:", err);
            },
          },
        });

        ytPlayerRef.current = player;
        window.__tarekYouTubePlayer = player;
      } catch (err) {
        console.error("[WebsiteMediaPlayer] Failed to initialize YouTube player:", err);
      }
    };

    // Load YouTube IFrame API script if not present
    if (!window.YT) {
      const existingTag = document.getElementById("tarek-yt-api-script");
      if (!existingTag) {
        const tag = document.createElement("script");
        tag.id = "tarek-yt-api-script";
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScript = document.getElementsByTagName("script")[0];
        firstScript.parentNode?.insertBefore(tag, firstScript);
      }

      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevReady) prevReady();
        createOrUpdateYtPlayer();
      };
    } else {
      createOrUpdateYtPlayer();
    }

    return () => {
      isSubscribed = false;
    };
  }, [isAdmin, isEnabled, musicSource, youtubeVideoId, targetVolume, targetLoop, isSessionDisabled, armInteractionFallback, cleanupInteractionFallback]);

  // =========================================================================
  // 2. UPLOADED AUDIO PLAYER CONTROLLER (DOM <audio> Element)
  // =========================================================================
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isAdmin || !isEnabled || musicSource !== "audio" || !resolvedAudioUrl) {
      if (!audio.paused) {
        audio.pause();
      }
      return;
    }

    // Stop YouTube player immediately when playing HTML5 audio
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.pauseVideo();
      } catch {}
    }

    audio.loop = targetLoop;
    audio.volume = targetVolume / 100;
    audio.muted = Boolean(settings?.muted);

    const onPlay = () => setIsPlaying(true);
    const onPlaying = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      if (!targetLoop) setIsPlaying(false);
    };
    const onError = (e: Event) => {
      console.warn("[WebsiteMediaPlayer] Audio element error:", audio?.error || e);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    if (isSessionDisabled()) {
      if (!audio.paused) audio.pause();
      setIsPlaying(false);
    } else {
      // Always prepare interaction fallback for browser autoplay policy
      armInteractionFallback(() => {
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.muted = Boolean(settings?.muted);
          audioRef.current.volume = targetVolume / 100;
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              console.log("[WebsiteMediaPlayer] Audio playback started via user interaction.");
            })
            .catch((err) => {
              console.warn("[WebsiteMediaPlayer] Audio play failed after interaction:", err);
            });
        }
      });

      // Attempt automatic playback
      if (audio.paused) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              cleanupInteractionFallback();
              console.log("[WebsiteMediaPlayer] Audio autoplay succeeded immediately.");
            })
            .catch(() => {
              console.info("[WebsiteMediaPlayer] Autoplay restricted by browser policy. Interaction fallback active.");
            });
        }
      }
    }

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [isAdmin, isEnabled, musicSource, resolvedAudioUrl, targetVolume, targetLoop, settings?.muted, isSessionDisabled, armInteractionFallback, cleanupInteractionFallback]);

  // =========================================================================
  // 3. MASTER PLAY / PAUSE BUTTON TOGGLE
  // =========================================================================
  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      cleanupInteractionFallback();

      if (musicSource === "youtube") {
        const player = ytPlayerRef.current || window.__tarekYouTubePlayer;
        if (!player) return;

        try {
          const state = player.getPlayerState?.();
          // State 1 is PLAYING
          if (state === 1 || isPlaying) {
            player.pauseVideo();
            setIsPlaying(false);
            try {
              sessionStorage.setItem(STORAGE_DISABLED_KEY, "true");
              localStorage.setItem("tarek_portfolio_user_paused", "true");
            } catch {}
          } else {
            try {
              sessionStorage.removeItem(STORAGE_DISABLED_KEY);
              localStorage.removeItem("tarek_portfolio_user_paused");
            } catch {}
            try {
              player.unMute();
            } catch {}
            player.setVolume(targetVolume);
            player.playVideo();
            setIsPlaying(true);
          }
        } catch (err) {
          console.error("[WebsiteMediaPlayer] Error toggling YouTube player:", err);
        }
      } else {
        // Uploaded Audio
        const audio = audioRef.current || window.__tarekAudioElement;
        if (!audio) return;

        if (!audio.paused) {
          audio.pause();
          setIsPlaying(false);
          try {
            sessionStorage.setItem(STORAGE_DISABLED_KEY, "true");
            localStorage.setItem("tarek_portfolio_user_paused", "true");
          } catch {}
        } else {
          try {
            sessionStorage.removeItem(STORAGE_DISABLED_KEY);
            localStorage.removeItem("tarek_portfolio_user_paused");
          } catch {}
          audio.volume = targetVolume / 100;
          audio.muted = false;
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.warn("[WebsiteMediaPlayer] Toggle play failed:", err);
            });
        }
      }
    },
    [musicSource, isPlaying, targetVolume, cleanupInteractionFallback]
  );

  // If on Admin page or media is disabled or no valid track exists, render nothing
  if (isAdmin || !isEnabled) {
    return null;
  }

  const hasValidTrack =
    (musicSource === "youtube" && Boolean(youtubeVideoId)) ||
    (musicSource === "audio" && Boolean(resolvedAudioUrl));

  if (!hasValidTrack) {
    return null;
  }

  return (
    <>
      {/* HTML5 Audio Element for Uploaded Audio tracks */}
      {musicSource === "audio" && resolvedAudioUrl && (
        <audio
          ref={audioRef}
          id="tarek-global-audio-element"
          src={resolvedAudioUrl}
          preload="auto"
          playsInline
          loop={targetLoop}
          className="hidden"
          aria-hidden="true"
        />
      )}

      {/* Invisible YouTube Player Host Container (1x1 px, no clip-path to prevent Chrome video suspension) */}
      {musicSource === "youtube" && (
        <div
          ref={ytContainerRef}
          aria-hidden="true"
          className="fixed -bottom-10 -right-10 w-2 h-2 pointer-events-none select-none overflow-hidden"
          style={{
            zIndex: -1,
            opacity: 0.01,
            pointerEvents: "none",
          }}
        >
          <div id="tarek-yt-bg-player-host" />
        </div>
      )}

      {/* Floating Modern Audio Toggle Button (Preserved in GlobalSocialSidebar) */}
      <button
        type="button"
        data-audio-toggle="true"
        onClick={handleToggle}
        aria-label={
          isPlaying
            ? language === "bn"
              ? "ব্যাকগ্রাউন্ড মিউজিক থামান"
              : "Pause Background Music"
            : language === "bn"
            ? "ব্যাকগ্রাউন্ড মিউজিক চালু করুন"
            : "Play Background Music"
        }
        title={
          isPlaying
            ? language === "bn"
              ? `ব্যাকগ্রাউন্ড মিউজিক বন্ধ করুন (${activeTitle})`
              : `Pause Background Music (${activeTitle})`
            : language === "bn"
            ? `ব্যাকগ্রাউন্ড মিউজিক চালু করুন (${activeTitle})`
            : `Play Background Music (${activeTitle})`
        }
        className="group relative w-[32px] h-[32px] sm:w-[34px] sm:h-[34px] flex items-center justify-center bg-transparent border-0 outline-none transition-all duration-300 hover:scale-125 active:scale-95 cursor-pointer select-none shrink-0"
      >
        <span className="block text-[#00d2ff] [html.light_&]:text-[#0284c7] transition-all duration-300 drop-shadow-[0_0_8px_rgba(0,210,255,0.7)] group-hover:drop-shadow-[0_0_14px_rgba(0,210,255,0.95)] group-hover:text-white [html.light_&]:group-hover:text-[#0369a1] [html.light_&]:drop-shadow-[0_0_8px_rgba(2,132,199,0.5)]">
          {isPlaying ? (
            <Pause className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
          ) : (
            <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2] fill-[#00d2ff]/20 [html.light_&]:fill-[#0284c7]/20 translate-x-[1px]" />
          )}
        </span>
      </button>
    </>
  );
}
