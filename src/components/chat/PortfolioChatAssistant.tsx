"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import {
  X,
  Minus,
  Send,
  Trash2,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  ChevronDown,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Plus,
  Image as ImageIcon,
  FileText,
  Globe,
  History,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  ArrowLeft,
} from "lucide-react";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";

interface DocAttachment {
  file: File;
  name: string;
  size: number;
  type: string;
  textContent?: string;
}

interface ImageAttachment {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
  name: string;
  size: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  imagePreview?: string;
  docAttachment?: {
    name: string;
    size: number;
    type: string;
  };
  detectedUrl?: string;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

const STORAGE_KEY_SESSIONS = "tarek_ai_chat_sessions_v2";
const STORAGE_KEY_ACTIVE = "tarek_ai_active_session_id_v2";

/**
 * Generates a clean, intelligent title for a conversation based on the first query.
 */
function generateSessionTitle(firstMessage: string): string {
  const clean = firstMessage.replace(/^\[.*?\]\s*/, "").trim();
  if (/price|cost|budget|টাকা|খরচ/i.test(clean)) return "Services & Pricing";
  if (/website|design|web|সাইট/i.test(clean)) return "Website Design Discussion";
  if (/skills?|tech|stack|যোগ্যতা/i.test(clean)) return "Technical Skills & Stack";
  if (/who is|about|tarek|তারেক/i.test(clean)) return "About Tarek";
  if (/contact|hire|whatsapp|যোগাযোগ/i.test(clean)) return "Project Inquiry & Contact";
  if (/mango|garden|বাগান|আম/i.test(clean)) return "Personal Interests & Garden";
  if (/company|dream|ভবিষ্যৎ|startup/i.test(clean)) return "Future Tech & Dreams";
  return clean.slice(0, 26) + (clean.length > 26 ? "..." : "");
}

/**
 * Formats timestamps into human-readable relative time badges.
 */
function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

/**
 * Groups sessions by relative calendar dates for the History panel.
 */
function groupSessionsByDate(sessions: ChatSession[]): { label: string; items: ChatSession[] }[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  const sevenDaysStart = todayStart - 6 * 86400000;

  const today: ChatSession[] = [];
  const yesterday: ChatSession[] = [];
  const previous7Days: ChatSession[] = [];
  const older: ChatSession[] = [];

  sessions.forEach((s) => {
    const time = s.updatedAt || s.createdAt;
    if (time >= todayStart) {
      today.push(s);
    } else if (time >= yesterdayStart) {
      yesterday.push(s);
    } else if (time >= sevenDaysStart) {
      previous7Days.push(s);
    } else {
      older.push(s);
    }
  });

  const groups: { label: string; items: ChatSession[] }[] = [];
  if (today.length > 0) groups.push({ label: "TODAY", items: today });
  if (yesterday.length > 0) groups.push({ label: "YESTERDAY", items: yesterday });
  if (previous7Days.length > 0) groups.push({ label: "PREVIOUS 7 DAYS", items: previous7Days });
  if (older.length > 0) groups.push({ label: "OLDER", items: older });

  return groups;
}

/**
 * Detects whether the primary/dominant language of the text is Bengali or English.
 */
function detectDominantLanguage(text: string): "bn" | "en" {
  const banglaMatches = text.match(/[\u0980-\u09FF]/g);
  const banglaCount = banglaMatches ? banglaMatches.length : 0;

  const englishMatches = text.match(/[a-zA-Z]/g);
  const englishCount = englishMatches ? englishMatches.length : 0;

  // If there are Bengali characters and they form a substantial part of the text
  if (banglaCount > 0 && banglaCount >= englishCount * 0.3) {
    return "bn";
  }
  return banglaCount > englishCount ? "bn" : "en";
}

/**
 * Finds the most suitable Bengali speech synthesis voice available in the browser/OS.
 * Checks in order: bn-BD -> bn-IN -> startsWith('bn') -> name contains bangla/bengali.
 */
function findBengaliVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // 1. First priority: bn-BD (Bangladesh locale)
  const bnBD = voices.find((v) => /^bn[-_]bd$/i.test(v.lang));
  if (bnBD) return bnBD;

  // 2. Second priority: bn-IN (India locale, e.g. Microsoft Bashkar / Tanishaa)
  const bnIN = voices.find((v) => /^bn[-_]in$/i.test(v.lang));
  if (bnIN) return bnIN;

  // 3. Third priority: Any voice whose lang code starts with 'bn'
  const bnAny = voices.find((v) => /^bn/i.test(v.lang));
  if (bnAny) return bnAny;

  // 4. Fourth priority: Name match containing bangla, bengali, or বাংলা
  const bnName = voices.find((v) => {
    const n = v.name.toLowerCase();
    return n.includes("bangla") || n.includes("bengali") || n.includes("বাংলা");
  });
  if (bnName) return bnName;

  return null;
}

/**
 * Finds a compatible fallback voice from available voices when no native Bengali voice is installed.
 */
function findCompatibleFallbackVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;
  return (
    voices.find((v) => v.default) ||
    voices.find((v) => /google|natural|online/i.test(v.name)) ||
    voices[0] ||
    null
  );
}

/**
 * Finds the most suitable English speech synthesis voice available.
 */
function findEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // Natural / Online / Google English voice
  const natural = voices.find(
    (v) =>
      (v.lang === "en-US" || v.lang === "en-GB") &&
      /natural|online|google/i.test(v.name)
  );
  if (natural) return natural;

  // en-US or en-GB
  const enStandard = voices.find((v) => v.lang === "en-US" || v.lang === "en-GB");
  if (enStandard) return enStandard;

  // Any English voice
  const anyEn = voices.find((v) => v.lang.startsWith("en"));
  return anyEn || null;
}

export default function PortfolioChatAssistant() {
  const pathname = usePathname();
  const { cmsData } = useCms();
  const { language, t } = useLanguage();
  const aiSettings = cmsData?.aiChatSettings;

  // Window & view states
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showClearCurrentConfirm, setShowClearCurrentConfirm] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);

  // Chat conversation & sessions state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Voice features state
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState<"en-US" | "bn-BD">("en-US");
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const fallbackAudioRef = useRef<HTMLAudioElement | null>(null);

  // Attachments state
  const [imageAttachment, setImageAttachment] = useState<ImageAttachment | null>(null);
  const [docAttachment, setDocAttachment] = useState<DocAttachment | null>(null);

  // Message feedback & copy state
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [messageFeedback, setMessageFeedback] = useState<Record<string, "up" | "down">>({});

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const plusMenuRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const recognitionRef = useRef<any>(null);

  const isAdmin = pathname?.startsWith("/admin");
  const botName = aiSettings?.botName || "Tarek AI Assistant";

  // Prevent hydration mismatch for portal mounting
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Load saved history from localStorage for the History panel,
  // but ensure the main chat window ALWAYS starts with a fresh, clean conversation on page reload.
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (savedSessions) {
        const parsed: ChatSession[] = JSON.parse(savedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
        }
      }
      // Start fresh on every page reload: clear active session & messages
      setActiveSessionId(null);
      setMessages([]);
      try {
        localStorage.removeItem(STORAGE_KEY_ACTIVE);
      } catch {}
    } catch (e) {
      console.warn("Failed to load chat history:", e);
    }
  }, []);

  // 2. Click outside plus menu listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(event.target as Node)) {
        setIsPlusMenuOpen(false);
      }
    };
    if (isPlusMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPlusMenuOpen]);

  // Stops any ongoing SpeechSynthesis or fallback audio playback
  const stopAllSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    if (fallbackAudioRef.current) {
      try {
        fallbackAudioRef.current.pause();
        fallbackAudioRef.current = null;
      } catch {}
    }
    setSpeakingMessageId(null);
  };

  // Preload and monitor available SpeechSynthesis voices with debug logging
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const loadVoices = () => {
      try {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) {
          setAvailableVoices(v);
          const bn = findBengaliVoice(v);
          console.groupCollapsed(
            `[Tarek AI TTS Debug] Available voices in Browser/OS (${v.length} voices loaded)`
          );
          v.forEach((voice, index) => {
            console.log(
              `${index + 1}. ${voice.name} | Lang: ${voice.lang} | Default: ${voice.default} | Local: ${voice.localService}`
            );
          });
          console.groupEnd();

          if (bn) {
            console.log(
              `%c[Tarek AI TTS Debug] ✅ Bengali Voice Detected: ${bn.name} [${bn.lang}]`,
              "color: #06b6d4; font-weight: bold;"
            );
          } else {
            console.warn(
              `[Tarek AI TTS Debug] ⚠️ No native Bengali voice found in this browser or Windows system.\n` +
                `Total ${v.length} other voice(s) available on this device:`,
              v.map((voice) => `${voice.name} [${voice.lang}]`)
            );
            console.log(
              `%c[Tarek AI TTS Debug] 🚀 Ultra-reliable Bengali TTS server fallback (/api/tts) will be used automatically.`,
              "color: #10b981; font-weight: bold;"
            );
          }
        }
      } catch (err) {
        console.warn("[Tarek AI TTS Debug] Failed to get voices:", err);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Retry after 300ms in case getVoices() was asynchronous on initial page load
    const timer = setTimeout(() => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        loadVoices();
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // 3. Cleanup speech synthesis and recognition on unmount
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {}
      stopAllSpeech();
    };
  }, []);

  // 4. Scroll tracking
  const handleScroll = () => {
    const el = chatBodyRef.current;
    if (!el) return;
    const threshold = 70;
    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    isNearBottomRef.current = isBottom;
  };

  // 5. Smart auto-scroll
  useEffect(() => {
    if (isOpen && !isMinimized && !showHistory && isNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen, isMinimized, showHistory]);

  // 6. Automatically focus input when chat opens or immediately after AI response finishes
  useEffect(() => {
    if (isOpen && !isMinimized && !showHistory && !isLoading) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized, showHistory, isLoading]);

  // If not mounted on client, or disabled by CMS settings, do not render
  if (!isMounted || isAdmin || aiSettings?.enabled === false) {
    return null;
  }

  // Helper to persist session changes to localStorage
  const persistSessions = (newSessions: ChatSession[]) => {
    setSessions(newSessions);
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(newSessions.slice(0, 30)));
    } catch (e) {
      console.warn("Failed to persist chat sessions:", e);
    }
  };

  // Switch to a chosen session from history
  const handleSelectSession = (session: ChatSession) => {
    stopAllSpeech();
    setActiveSessionId(session.id);
    setMessages(session.messages || []);
    setShowHistory(false);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE, session.id);
    } catch {}
    isNearBottomRef.current = true;
  };

  // Start a fresh, clean conversation session
  const handleStartNewChat = () => {
    stopAllSpeech();
    setImageAttachment(null);
    setDocAttachment(null);
    setMessages([]);
    setActiveSessionId(null);
    setShowHistory(false);
    setInputMessage("");
    try {
      localStorage.removeItem(STORAGE_KEY_ACTIVE);
    } catch {}
    setTimeout(() => textareaRef.current?.focus(), 150);
  };

  // Delete an individual chat session after confirmation
  const handleDeleteConfirmed = () => {
    if (!sessionToDelete) return;
    const sessionId = sessionToDelete.id;
    const updated = sessions.filter((s) => s.id !== sessionId);
    persistSessions(updated);

    if (activeSessionId === sessionId) {
      if (updated.length > 0) {
        handleSelectSession(updated[0]);
      } else {
        handleStartNewChat();
      }
    }
    setSessionToDelete(null);
  };

  // Clear all history with confirmation
  const handleClearAllHistory = () => {
    persistSessions([]);
    setMessages([]);
    setActiveSessionId(null);
    setShowClearConfirm(false);
    setShowHistory(false);
    try {
      localStorage.removeItem(STORAGE_KEY_ACTIVE);
    } catch {}
  };

  // Strips markdown and special characters for clean TTS
  const cleanTextForSpeech = (rawText: string) => {
    return rawText
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/[*_#`~]/g, "")
      .replace(/^[\s•\-]+/gm, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .trim();
  };

  // Fallback audio playback using reliable same-origin /api/tts endpoint
  const playAudioFallback = (text: string, msgId: string) => {
    try {
      if (typeof window === "undefined") return;
      console.log("[Tarek AI TTS Debug] 🚀 Playing via ultra-reliable Bengali TTS server fallback (/api/tts)...");

      const audioUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=bn`;
      const audio = new Audio(audioUrl);
      fallbackAudioRef.current = audio;
      setSpeakingMessageId(msgId);

      audio.onplay = () => {
        console.log("[Tarek AI TTS Debug] Bengali audio fallback started playing.");
      };

      audio.onended = () => {
        console.log("[Tarek AI TTS Debug] Bengali audio fallback completed successfully.");
        setSpeakingMessageId(null);
        fallbackAudioRef.current = null;
      };

      audio.onerror = (err) => {
        console.warn("[Tarek AI TTS Debug] Bengali audio fallback playback error:", err);
        setSpeakingMessageId(null);
        fallbackAudioRef.current = null;
        setSpeechNotice("অডিও প্লেব্যাকে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
        setTimeout(() => setSpeechNotice(null), 4000);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("[Tarek AI TTS Debug] Bengali audio playback initiated.");
          })
          .catch((err) => {
            console.warn("[Tarek AI TTS Debug] Audio fallback play rejected or blocked by browser:", err);
            setSpeakingMessageId(null);
            fallbackAudioRef.current = null;
          });
      }
    } catch (err) {
      console.warn("[Tarek AI TTS Debug] playAudioFallback exception:", err);
      setSpeakingMessageId(null);
      fallbackAudioRef.current = null;
    }
  };

  // Toggle Text-to-Speech playback for an AI response
  const handleToggleSpeech = (msgId: string, content: string) => {
    if (typeof window === "undefined") return;

    // 1. If currently speaking this message, stop it
    if (speakingMessageId === msgId) {
      console.log(`[Tarek AI TTS Debug] User stopped playback for message ${msgId}`);
      stopAllSpeech();
      return;
    }

    // 2. Stop any existing speech before starting a new one
    stopAllSpeech();

    const spokenText = cleanTextForSpeech(content);
    if (!spokenText) return;

    // 3. Detect dominant language: Bengali (bn) vs English (en)
    const dominantLang = detectDominantLanguage(content);

    // 4. Retrieve latest available voices
    let currentVoices =
      availableVoices.length > 0
        ? availableVoices
        : "speechSynthesis" in window
        ? window.speechSynthesis.getVoices()
        : [];

    if (currentVoices.length === 0 && "speechSynthesis" in window) {
      currentVoices = window.speechSynthesis.getVoices();
    }

    console.group(`[Tarek AI TTS Debug] Listen Triggered (Message: ${msgId})`);
    console.log(`[Tarek AI TTS Debug] Detected Language:`, dominantLang === "bn" ? "Bengali (bn)" : "English (en)");
    console.log(`[Tarek AI TTS Debug] Total Available Voices:`, currentVoices.length);
    console.log(`[Tarek AI TTS Debug] Spoken Text:`, spokenText.slice(0, 100) + (spokenText.length > 100 ? "..." : ""));

    if (dominantLang === "bn") {
      const bnVoice = findBengaliVoice(currentVoices);

      if (bnVoice && "speechSynthesis" in window) {
        console.log(`%c[Tarek AI TTS Debug] ✅ Native Bengali Voice Selected: ${bnVoice.name} [${bnVoice.lang}]`, "color: #06b6d4; font-weight: bold;");
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }

          const utterance = new SpeechSynthesisUtterance(spokenText);
          utterance.voice = bnVoice;
          utterance.lang = bnVoice.lang || "bn-BD";
          utterance.rate = 0.95;
          utterance.pitch = 1.0;

          utterance.onstart = () => {
            console.log(`[Tarek AI TTS Debug] Bengali native speech started.`);
          };

          utterance.onend = () => {
            console.log(`[Tarek AI TTS Debug] Bengali native speech finished.`);
            setSpeakingMessageId(null);
          };

          utterance.onerror = (event) => {
            console.warn(`[Tarek AI TTS Debug] Bengali native speech error, switching to /api/tts fallback:`, event);
            setSpeakingMessageId(null);
            playAudioFallback(spokenText, msgId);
          };

          setSpeakingMessageId(msgId);
          window.speechSynthesis.speak(utterance);
          console.groupEnd();
          return;
        } catch (err) {
          console.warn("[Tarek AI TTS Debug] Native speech exception, switching to fallback:", err);
        }
      } else {
        console.warn(
          `[Tarek AI TTS Debug] ⚠️ Bengali voice is NOT available in this browser/Windows.\n` +
            `Available voices on this system:`,
          currentVoices.map((voice) => `${voice.name} [${voice.lang}]`)
        );
        console.log(
          `%c[Tarek AI TTS Debug] 🚀 Using ultra-reliable Bengali TTS server fallback (/api/tts)...`,
          "color: #10b981; font-weight: bold;"
        );
      }

      console.groupEnd();
      playAudioFallback(spokenText, msgId);
    } else {
      // English voice
      if ("speechSynthesis" in window) {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }

          const enVoice = findEnglishVoice(currentVoices);
          console.log(
            `[Tarek AI TTS Debug] English Voice Selected:`,
            enVoice ? `${enVoice.name} [${enVoice.lang}]` : "System default"
          );

          const utterance = new SpeechSynthesisUtterance(spokenText);
          utterance.lang = "en-US";
          if (enVoice) utterance.voice = enVoice;
          utterance.rate = 1.0;
          utterance.pitch = 1.0;

          utterance.onstart = () => {
            console.log(`[Tarek AI TTS Debug] English speech started.`);
          };

          utterance.onend = () => {
            console.log(`[Tarek AI TTS Debug] English speech finished.`);
            setSpeakingMessageId(null);
          };

          utterance.onerror = (event) => {
            console.warn(`[Tarek AI TTS Debug] English speech error:`, event);
            setSpeakingMessageId(null);
          };

          setSpeakingMessageId(msgId);
          window.speechSynthesis.speak(utterance);
          console.groupEnd();
        } catch (err) {
          console.warn("[Tarek AI TTS Debug] SpeechSynthesis error:", err);
          console.groupEnd();
          setSpeechNotice("Text-to-speech is not supported in this browser.");
          setTimeout(() => setSpeechNotice(null), 3000);
        }
      } else {
        console.groupEnd();
        setSpeechNotice("Text-to-speech is not supported in this browser.");
        setTimeout(() => setSpeechNotice(null), 3000);
      }
    }
  };

  // Copy AI response to clipboard
  const handleCopyMessage = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(msgId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch {
      setSpeechNotice("Failed to copy to clipboard.");
      setTimeout(() => setSpeechNotice(null), 2500);
    }
  };

  // Handle helpful/not helpful feedback
  const handleFeedback = (msgId: string, type: "up" | "down") => {
    setMessageFeedback((prev) => ({
      ...prev,
      [msgId]: prev[msgId] === type ? undefined : (type as any),
    }));
  };

  // Toggle Web Speech Recognition
  const toggleVoiceInput = () => {
    if (typeof window === "undefined") return;

    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setSpeechNotice("Speech recognition is not supported in this browser.");
      setTimeout(() => setSpeechNotice(null), 3500);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      setSpeechNotice(null);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = speechLang;
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechNotice(
          speechLang === "bn-BD"
            ? "কথা বলুন (Listening in Bangla)..."
            : "Listening... Speak naturally"
        );
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputMessage((prev) => {
            const prefix = prev && !prev.endsWith(" ") ? `${prev} ` : prev;
            return `${prefix}${transcript}`.trim();
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition notice:", event.error);
        setIsListening(false);
        if (event.error !== "no-speech") {
          setSpeechNotice("Microphone unavailable or interrupted.");
          setTimeout(() => setSpeechNotice(null), 3000);
        } else {
          setSpeechNotice(null);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setTimeout(() => setSpeechNotice(null), 1500);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
      setSpeechNotice("Microphone permission denied.");
      setTimeout(() => setSpeechNotice(null), 3000);
    }
  };

  // Image Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setSpeechNotice("Please upload a JPG, PNG, or WebP image.");
      setTimeout(() => setSpeechNotice(null), 3500);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSpeechNotice("Image size must be under 5MB.");
      setTimeout(() => setSpeechNotice(null), 3500);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const commaIndex = result.indexOf(",");
      const base64Data = commaIndex !== -1 ? result.slice(commaIndex + 1) : result;

      setImageAttachment({
        file,
        previewUrl: result,
        base64: base64Data,
        mimeType: file.type || "image/jpeg",
        name: file.name,
        size: file.size,
      });
      setIsPlusMenuOpen(false);
      textareaRef.current?.focus();
    };
    reader.onerror = () => {
      setSpeechNotice("Failed to load image preview.");
      setTimeout(() => setSpeechNotice(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Document Upload handler
  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const ext = file.name.split(".").pop()?.toLowerCase();
    const validExts = ["pdf", "docx", "doc", "txt"];
    if (!ext || !validExts.includes(ext)) {
      setSpeechNotice("Please upload a PDF, DOCX, or TXT document.");
      setTimeout(() => setSpeechNotice(null), 3500);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSpeechNotice("Document must be under 5MB.");
      setTimeout(() => setSpeechNotice(null), 3500);
      return;
    }

    if (ext === "txt") {
      const textReader = new FileReader();
      textReader.onload = () => {
        setDocAttachment({
          file,
          name: file.name,
          size: file.size,
          type: ext,
          textContent: textReader.result as string,
        });
        setIsPlusMenuOpen(false);
        textareaRef.current?.focus();
      };
      textReader.readAsText(file);
    } else {
      setDocAttachment({
        file,
        name: file.name,
        size: file.size,
        type: ext,
      });
      setIsPlusMenuOpen(false);
      textareaRef.current?.focus();
    }
  };

  // Website link action
  const handleAnalyzeLinkAction = () => {
    setIsPlusMenuOpen(false);
    setInputMessage((prev) => {
      const starter = "Can you analyze this website: ";
      return prev.startsWith(starter) ? prev : `${starter}${prev}`.trimEnd() + " ";
    });
    textareaRef.current?.focus();
  };

  // Send message
  const handleSendMessage = async (customText?: string) => {
    stopAllSpeech();

    const activeImage = imageAttachment;
    const activeDoc = docAttachment;
    setImageAttachment(null);
    setDocAttachment(null);

    const rawText = (customText !== undefined ? customText : inputMessage).trim();
    let fallbackText = "";
    if (!rawText) {
      if (activeImage) {
        fallbackText =
          "Can you analyze this design and let me know if you can create a website like this, with estimated timeline and budget?";
      } else if (activeDoc) {
        fallbackText = `I have attached ${activeDoc.name} with project requirements. Can you review this scope?`;
      }
    }

    const finalContent = rawText || fallbackText;
    if (!finalContent && !activeImage && !activeDoc) return;
    if (isLoading) return;

    // Detect reference URL
    const urlMatch = finalContent.match(/https?:\/\/[^\s<>)\]"]+/i);
    const detectedUrl = urlMatch ? urlMatch[0].replace(/[.,;:!?)]+$/, "") : undefined;
    const isReferenceUrl =
      detectedUrl &&
      !detectedUrl.includes("wa.me") &&
      !detectedUrl.includes("whatsapp.com") &&
      !detectedUrl.includes("mailto:") &&
      !detectedUrl.includes("tel:");

    const userTimestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: finalContent,
      timestamp: userTimestamp,
      imagePreview: activeImage?.previewUrl,
      docAttachment: activeDoc
        ? {
            name: activeDoc.name,
            size: activeDoc.size,
            type: activeDoc.type,
          }
        : undefined,
      detectedUrl: isReferenceUrl ? detectedUrl : undefined,
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    isNearBottomRef.current = true;
    setIsLoading(true);

    // Update active session locally
    const now = Date.now();
    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      currentSessionId = `session-${now}`;
      setActiveSessionId(currentSessionId);
      try {
        localStorage.setItem(STORAGE_KEY_ACTIVE, currentSessionId);
      } catch {}
    }

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const payload: any = { messages: apiMessages };
      if (activeImage) {
        payload.image = {
          mimeType: activeImage.mimeType,
          data: activeImage.base64,
        };
      }
      if (activeDoc) {
        payload.document = {
          name: activeDoc.name,
          size: activeDoc.size,
          mimeType: activeDoc.type,
          textContent: activeDoc.textContent,
        };
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const replyText =
        data?.message ||
        "I'm sorry, I encountered a temporary network delay. You can contact Tarek directly at 01733119269 or 01840019449! 😊";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      // Persist to session history
      setSessions((prevSessions) => {
        const existingIdx = prevSessions.findIndex((s) => s.id === currentSessionId);
        let nextSessions: ChatSession[] = [];
        if (existingIdx >= 0) {
          const existing = prevSessions[existingIdx];
          const updated: ChatSession = {
            ...existing,
            messages: finalMessages,
            updatedAt: now,
            title:
              existing.title || generateSessionTitle(finalMessages[0]?.content || "Conversation"),
          };
          nextSessions = [updated, ...prevSessions.filter((_, idx) => idx !== existingIdx)];
        } else {
          const newSession: ChatSession = {
            id: currentSessionId!,
            title: generateSessionTitle(finalMessages[0]?.content || "Conversation"),
            createdAt: now,
            updatedAt: now,
            messages: finalMessages,
          };
          nextSessions = [newSession, ...prevSessions];
        }
        try {
          localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(nextSessions.slice(0, 30)));
        } catch {}
        return nextSessions;
      });
    } catch (err) {
      console.error("Chat communication error:", err);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content:
          "দুঃখিত! সার্ভারের সাথে সংযোগে সাময়িক বিলম্ব হচ্ছে। আপনি চাইলে সরাসরি তারেকের সাথে 01733119269 অথবা 01840019449 নাম্বারে যোগাযোগ করতে পারেন। 😊",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  };

  // Formats URLs for clean wrapping without overflow
  const formatCleanUrlLabel = (label: string, url: string): string => {
    const isUrlLike = /^https?:\/\//i.test(label.trim()) || /^www\./i.test(label.trim());
    if (!isUrlLike) return label;

    const clean = url.trim();
    if (/whatsapp\.com|wa\.me/i.test(clean)) {
      const phoneMatch = clean.match(/(?:phone=|wa\.me\/)(\+?\d+)/);
      if (phoneMatch && phoneMatch[1]) {
        return `wa.me/${phoneMatch[1].replace(/^\+/, "")}`;
      }
      return "Chat on WhatsApp";
    }

    if (/^mailto:/i.test(clean)) {
      return clean.replace(/^mailto:/i, "");
    }

    try {
      const parsed = new URL(clean.startsWith("http") ? clean : `https://${clean}`);
      const host = parsed.hostname.replace(/^www\./, "");
      const pathname = parsed.pathname === "/" ? "" : parsed.pathname;
      const baseClean = `${host}${pathname}`;

      if (baseClean.length > 28) {
        const segments = pathname.split("/").filter(Boolean);
        const lastSeg = segments[segments.length - 1] || "";
        if (lastSeg && lastSeg.length < 14) {
          return `${host}/.../${lastSeg}`;
        }
        return `${baseClean.slice(0, 25)}...`;
      }
      return baseClean;
    } catch {
      return label.length > 28 ? `${label.slice(0, 25)}...` : label;
    }
  };

  // Render markdown formatting
  const renderMessageContent = (content: string) => {
    const lines = content.split("\n");

    return lines.map((line, lineIdx) => {
      const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-");
      const cleanLine = isBullet ? line.replace(/^[\s•\-]+/, "") : line;

      const parts: React.ReactNode[] = [];
      let keyCounter = 0;
      const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|https?:\/\/[^\s<>)\]]+)/g;
      const tokens = cleanLine.split(tokenRegex);

      tokens.forEach((segment) => {
        if (!segment) return;

        // Markdown link [text](url)
        const linkMatch = segment.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const [, label, url] = linkMatch;
          const isInternal = url.startsWith("/");
          const displayText = formatCleanUrlLabel(label, url);
          parts.push(
            <a
              key={`link-${lineIdx}-${keyCounter++}`}
              href={url}
              target={isInternal ? "_self" : "_blank"}
              rel="noopener noreferrer"
              title={url}
              className="inline text-[#00d2ff] hover:text-[#00f0ff] underline decoration-[#00d2ff]/40 hover:decoration-[#00d2ff] underline-offset-2 font-medium transition-colors break-all [overflow-wrap:anywhere] [word-break:break-word] mx-0.5"
              style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
            >
              <span className="break-all [overflow-wrap:anywhere]">{displayText}</span>
              {!isInternal && (
                <ExternalLink className="w-2.5 h-2.5 inline ml-0.5 opacity-70 align-baseline shrink-0" />
              )}
            </a>
          );
          return;
        }

        // Raw URL
        if (/^https?:\/\//i.test(segment)) {
          const cleanUrl = segment.replace(/[.,;:!?)]+$/, "");
          const trailingPunctuation = segment.slice(cleanUrl.length);
          const displayText = formatCleanUrlLabel(cleanUrl, cleanUrl);
          parts.push(
            <a
              key={`rawlink-${lineIdx}-${keyCounter++}`}
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={cleanUrl}
              className="inline text-[#00d2ff] hover:text-[#00f0ff] underline decoration-[#00d2ff]/40 hover:decoration-[#00d2ff] underline-offset-2 font-medium transition-colors break-all [overflow-wrap:anywhere] [word-break:break-word] mx-0.5"
              style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
            >
              <span className="break-all [overflow-wrap:anywhere]">{displayText}</span>
              <ExternalLink className="w-2.5 h-2.5 inline ml-0.5 opacity-70 align-baseline shrink-0" />
            </a>
          );
          if (trailingPunctuation) parts.push(trailingPunctuation);
          return;
        }

        // Bold text **text**
        const boldMatch = segment.match(/^\*\*([^*]+)\*\*$/);
        if (boldMatch) {
          parts.push(
            <strong
              key={`bold-${lineIdx}-${keyCounter++}`}
              className="font-bold text-white tracking-wide break-words [overflow-wrap:anywhere]"
              style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
            >
              {boldMatch[1]}
            </strong>
          );
          return;
        }

        // Regular text
        parts.push(
          <span
            key={`text-${lineIdx}-${keyCounter++}`}
            className="break-words [overflow-wrap:anywhere]"
            style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
          >
            {segment}
          </span>
        );
      });

      return (
        <p
          key={`line-${lineIdx}`}
          className={`leading-relaxed break-words [overflow-wrap:anywhere] [word-break:break-word] ${
            isBullet
              ? "pl-3.5 relative before:content-['•'] before:absolute before:left-0 before:text-[#00d2ff] before:font-bold my-1"
              : line.trim() === ""
              ? "h-1.5"
              : "my-1"
          }`}
          style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
        >
          {parts}
        </p>
      );
    });
  };

  return createPortal(
    <>
      {/* =================================================================== */}
      {/* 1. UPGRADED FLOATING AI BUTTON (PREMIUM PILL + 'ASK TAREK AI') */}
      {/* =================================================================== */}
      <div
        id="tarek-ai-chat-trigger"
        style={{ position: "fixed", zIndex: 99990 }}
        className="ai-chat-trigger-fixed select-none pointer-events-auto"
      >
        <div className="relative">
          {/* Subtle Hover Tooltip */}
          {showTooltip && !isOpen && (
            <div className="absolute left-0 bottom-full mb-2.5 px-3.5 py-1.5 rounded-xl bg-[#091124]/95 backdrop-blur-md text-slate-100 text-xs font-medium whitespace-nowrap shadow-[0_4px_25px_rgba(0,0,0,0.85)] border border-[#00d2ff]/40 flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ask Tarek AI anything 👋</span>
              <div className="absolute left-6 top-full w-2 h-2 bg-[#091124] border-r border-b border-[#00d2ff]/40 rotate-45 -translate-y-1" />
            </div>
          )}

          {/* AI Assistant Floating Trigger Button (Compact on mobile, Full on desktop) */}
          <button
            type="button"
            onClick={() => {
              setIsOpen((prev) => !prev);
              setIsMinimized(false);
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-label={isOpen ? "Close AI Assistant" : "Ask Tarek AI anything"}
            className="group relative flex items-center justify-center gap-1.5 sm:gap-2.5 h-9 sm:h-12 px-2.5 sm:px-4 rounded-full bg-gradient-to-r from-[#060b18]/95 via-[#091638]/95 to-[#050c22]/95 backdrop-blur-md border border-[#00d2ff]/45 hover:border-[#00d2ff] shadow-[0_4px_20px_rgba(0,0,0,0.7),0_0_18px_rgba(0,210,255,0.28)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.85),0_0_36px_rgba(0,210,255,0.75),inset_0_0_12px_rgba(0,210,255,0.25)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.05] active:scale-95 cursor-pointer"
          >
            {/* Subtle Expanding Radar Attention Ring */}
            <span className="absolute -inset-1 sm:-inset-1.5 rounded-full border border-[#00d2ff]/40 ai-radar-wave pointer-events-none -z-10" />

            {/* Subtle Cyan Pulse Glow Ring */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#00d2ff]/25 via-[#0066ff]/20 to-[#00d2ff]/25 blur-sm group-hover:blur-md opacity-60 group-hover:opacity-100 transition-all duration-300 -z-10 animate-pulse" />

            {/* Shimmer light sweep on hover */}
            <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            </span>

            {/* Active Status Indicator Dot */}
            <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500 ring-2 ring-[#050811]" />
            </span>

            {/* Distinct AI Icon + Clear 'Ask Tarek AI' Label */}
            {isOpen ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="relative flex items-center justify-center w-5.5 h-5.5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-white/10 text-[#00d2ff] border border-[#00d2ff]/30 group-hover:border-[#00d2ff] transition-colors">
                  <X className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-[11.5px] sm:text-[13px] font-semibold text-slate-200 group-hover:text-white transition-colors">
                  Close
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <div className="relative flex items-center justify-center w-5.5 h-5.5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#00d2ff]/20 to-[#0066ff]/10 border border-[#00d2ff]/35 shadow-[0_0_8px_rgba(0,210,255,0.3)] group-hover:border-[#00d2ff] group-hover:shadow-[0_0_16px_rgba(0,210,255,0.6)] transition-all duration-300 shrink-0">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00d2ff] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 drop-shadow-[0_0_8px_rgba(0,210,255,0.9)]" />
                  <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-cyan-200 absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 group-hover:rotate-45 group-hover:scale-125 transition-transform duration-300 animate-pulse" />
                </div>
                <span className="text-[11.5px] sm:text-[13px] font-semibold tracking-wide flex items-center gap-1 whitespace-nowrap select-none">
                  <span className="text-slate-100 font-medium group-hover:text-white transition-colors">
                    {language === "bn" ? "জিজ্ঞেস করুন" : "Ask"}
                  </span>
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,210,255,0.4)] group-hover:drop-shadow-[0_0_14px_rgba(0,210,255,0.8)] transition-all duration-300">
                    {language === "bn" ? "তারেক এআই" : "Tarek AI"}
                  </span>
                </span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. COMPACT CLIENT-FACING CHAT PANEL WINDOW */}
      {/* =================================================================== */}
      <div
        id="tarek-ai-chat-window"
        data-lenis-prevent="true"
        aria-hidden={!isOpen}
        style={{ position: "fixed", zIndex: 99999 }}
        className={`ai-chat-window-fixed flex flex-col overflow-hidden max-w-[calc(100vw-24px)] transition-all duration-300 ease-out origin-bottom-left ${
          isMinimized
            ? "h-12 w-64 rounded-xl"
            : "w-[calc(100vw-28px)] sm:w-[360px] md:w-[380px] h-[490px] sm:h-[520px] max-h-[74vh] rounded-2xl"
        } bg-[#060b18]/95 backdrop-blur-2xl border border-[#00d2ff]/35 shadow-[0_10px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(0,210,255,0.18)] overscroll-contain ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto visible"
            : "opacity-0 translate-y-3 scale-[0.98] pointer-events-none invisible"
        }`}
      >
          {/* --------------------------------------------------------------- */}
          {/* A. CLEAN COMPACT HEADER */}
          {/* Layout: 🤖 Tarek AI Assistant | 🟢 Online | 🕘 History | 🗑️ Clear | ─ Minimize | ✕ Close */}
          {/* --------------------------------------------------------------- */}
          <div className="px-3.5 py-2.5 bg-gradient-to-r from-[#070e24] via-[#09193d] to-[#060d1f] border-b border-white/[0.08] flex items-center justify-between gap-2 shrink-0 select-none">
            <div
              className="flex items-center gap-2 min-w-0 cursor-default group/header"
              title="Tarek AI is ready to help"
            >
              {/* Bot Avatar with subtle cyan glow and pulse */}
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#00d2ff] to-[#0066ff] flex items-center justify-center text-[#050811] shadow-[0_0_14px_rgba(0,210,255,0.45)] shrink-0 transition-transform duration-300 group-hover/header:scale-105">
                <Bot className="w-4 h-4 text-[#050811] drop-shadow-[0_0_4px_rgba(0,210,255,0.7)]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#070e24] shadow-[0_0_6px_#10b981]" />
              </div>

              <div className="leading-tight min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-tight truncate">
                    {botName}
                  </h3>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-semibold flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons with Tooltips */}
            <div className="flex items-center gap-0.5 text-slate-400 shrink-0">
              {/* History Toggle */}
              <button
                type="button"
                onClick={() => setShowHistory((prev) => !prev)}
                title={showHistory ? "Back to conversation" : "Chat History"}
                aria-label={showHistory ? "Back to conversation" : "Chat History"}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  showHistory
                    ? "bg-[#00d2ff]/20 text-[#00f0ff] border border-[#00d2ff]/40"
                    : "hover:bg-white/10 hover:text-white"
                }`}
              >
                <History className="w-3.5 h-3.5" />
              </button>

              {/* Clear Current Chat */}
              <button
                type="button"
                onClick={() => {
                  if (messages.length > 0) {
                    setShowClearCurrentConfirm(true);
                  } else {
                    handleStartNewChat();
                  }
                }}
                title="New Chat / Clear Conversation"
                aria-label="New Chat / Clear Conversation"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Minimize / Expand */}
              <button
                type="button"
                onClick={() => setIsMinimized((prev) => !prev)}
                title={isMinimized ? "Expand Chat" : "Minimize Chat"}
                aria-label={isMinimized ? "Expand Chat" : "Minimize Chat"}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                {isMinimized ? (
                  <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                ) : (
                  <Minus className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => {
                  stopAllSpeech();
                  setIsOpen(false);
                }}
                title="Close Chat"
                aria-label="Close Chat"
                className="p-1.5 rounded-lg hover:bg-rose-500/20 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* B. CONFIRMATION MODALS */}
          {/* --------------------------------------------------------------- */}
          {/* 1. Clear All History Modal */}
          {showClearConfirm && (
            <div className="absolute inset-0 bg-[#050914]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
              <div className="bg-[#091530] border border-[#00d2ff]/40 rounded-2xl p-4 max-w-[280px] w-full text-center shadow-[0_10px_35px_rgba(0,0,0,0.85)] space-y-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Clear All History?</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Are you sure you want to clear all chat history? This cannot be undone.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-300 transition-colors cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllHistory}
                    className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Clear Current Chat Modal */}
          {showClearCurrentConfirm && (
            <div className="absolute inset-0 bg-[#050914]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
              <div className="bg-[#091530] border border-[#00d2ff]/40 rounded-2xl p-4 max-w-[280px] w-full text-center shadow-[0_10px_35px_rgba(0,0,0,0.85)] space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] flex items-center justify-center mx-auto border border-[#00d2ff]/30">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Clear Current Chat?</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Are you sure you want to clear this conversation? Previous messages are saved in Chat History.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowClearCurrentConfirm(false)}
                    className="flex-1 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-300 transition-colors cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleStartNewChat();
                      setShowClearCurrentConfirm(false);
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#0088ff] hover:from-[#00f0ff] hover:to-[#00a3ff] text-xs font-semibold text-[#050811] shadow-md transition-all cursor-pointer"
                  >
                    Clear Chat
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Delete Individual Conversation Modal */}
          {sessionToDelete && (
            <div className="absolute inset-0 bg-[#050914]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
              <div className="bg-[#091530] border border-[#00d2ff]/40 rounded-2xl p-4 max-w-[280px] w-full text-center shadow-[0_10px_35px_rgba(0,0,0,0.85)] space-y-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Delete Conversation?</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Are you sure you want to delete this conversation? This cannot be undone.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSessionToDelete(null)}
                    className="flex-1 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-300 transition-colors cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteConfirmed}
                    className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* C. CHAT HISTORY DRAWER VIEW (GROUPED BY DATE) */}
          {/* --------------------------------------------------------------- */}
          {!isMinimized && showHistory && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#050914] select-none animate-in fade-in slide-in-from-left-2 duration-200">
              {/* History Top Bar */}
              <div className="px-3 py-2 bg-[#081124] border-b border-white/[0.08] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => setShowHistory(false)}
                    title="Back to conversation"
                    aria-label="Back to conversation"
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <History className="w-3.5 h-3.5 text-[#00d2ff] shrink-0" />
                    <span className="text-xs font-bold text-white truncate">Chat History</span>
                    {sessions.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        ({sessions.length})
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartNewChat}
                  title="Start a new chat"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#00d2ff]/20 to-[#0066ff]/20 hover:from-[#00d2ff]/30 hover:to-[#0066ff]/30 border border-[#00d2ff]/40 text-[#00f0ff] text-[11px] font-semibold transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Chat</span>
                </button>
              </div>

              {/* History List - Clean Grouped Sections with Strict Truncation */}
              <div className="flex-1 overflow-y-auto chat-scrollbar p-2.5 space-y-3 overscroll-contain">
                {sessions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 opacity-70">
                    <History className="w-8 h-8 text-slate-500 mb-2 stroke-[1.5]" />
                    <p className="text-xs font-semibold text-slate-300">No saved history yet</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                      Previous conversations are preserved here automatically and can be reopened anytime.
                    </p>
                  </div>
                ) : (
                  groupSessionsByDate(sessions).map((group) => (
                    <div key={group.label} className="space-y-1">
                      <div className="px-1.5 pt-1 pb-0.5 text-[9.5px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#00d2ff]/70" />
                        <span>{group.label}</span>
                      </div>
                      <div className="space-y-1">
                        {group.items.map((sess) => {
                          const isActive = sess.id === activeSessionId;
                          const firstUserMsg =
                            sess.messages.find((m) => m.role === "user")?.content || sess.title;
                          const previewText = firstUserMsg.replace(/^\[.*?\]\s*/, "").trim();

                          return (
                            <div
                              key={sess.id}
                              onClick={() => handleSelectSession(sess)}
                              title={previewText}
                              className={`group relative flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl border transition-all cursor-pointer ${
                                isActive
                                  ? "bg-[#091530] border-[#00d2ff]/50 shadow-[0_0_12px_rgba(0,210,255,0.2)]"
                                  : "bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.06] hover:border-[#00d2ff]/30"
                              }`}
                            >
                              {/* Dot indicator */}
                              <div className="shrink-0 flex items-center">
                                {isActive ? (
                                  <span className="w-2 h-2 rounded-full bg-[#00d2ff] shadow-[0_0_8px_#00d2ff]" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-[#00d2ff] transition-colors" />
                                )}
                              </div>

                              {/* Strict One-line preview with ellipsis */}
                              <span
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                                className="history-preview flex-1 min-w-0 text-xs text-slate-200 group-hover:text-white font-medium truncate whitespace-nowrap overflow-hidden text-ellipsis"
                              >
                                {previewText}
                              </span>

                              {/* Time & Delete Button on hover */}
                              <div className="shrink-0 flex items-center gap-1.5">
                                <span className="text-[9px] font-mono text-slate-400 group-hover:hidden whitespace-nowrap">
                                  {formatRelativeTime(sess.updatedAt || sess.createdAt)}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSessionToDelete(sess);
                                  }}
                                  title="Delete conversation"
                                  aria-label="Delete conversation"
                                  className="hidden group-hover:inline-flex p-1 rounded-md hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* History Bottom Clear All Bar */}
              {sessions.length > 0 && (
                <div className="p-2.5 bg-[#060c1d] border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {sessions.length} saved {sessions.length === 1 ? "chat" : "chats"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All History</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* D. MAIN CHAT BODY (MESSAGES & EMPTY STATE) */}
          {/* --------------------------------------------------------------- */}
          {!isMinimized && !showHistory && (
            <div className="flex-1 flex flex-col overflow-hidden min-w-0 w-full bg-gradient-to-b from-[#050914] via-[#040711] to-[#02050c]">
              {/* Message List with Smooth Mouse Wheel Scrolling & Zero Horizontal Overflow */}
              <div
                ref={chatBodyRef}
                onScroll={handleScroll}
                onWheel={(e) => e.stopPropagation()}
                data-lenis-prevent="true"
                className="flex-1 overflow-y-auto overflow-x-hidden chat-scrollbar overscroll-contain p-3 sm:p-3.5 space-y-3 select-text flex flex-col w-full min-w-0"
                style={{ overflowX: "hidden" }}
              >
                {/* 1. Subtle Minimal Empty State */}
                {messages.length === 0 && (
                  <div className="my-auto flex flex-col items-center justify-center text-center p-4 select-none opacity-90 animate-in fade-in duration-300">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00d2ff]/20 to-[#0066ff]/20 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] mb-2 shadow-[0_0_15px_rgba(0,210,255,0.25)]">
                      <Bot className="w-5 h-5 text-[#00d2ff]" />
                    </div>
                    <h4 className="text-xs font-bold text-white tracking-wide">{botName}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 max-w-[240px] leading-relaxed italic">
                      Ask me anything about Tarek, his skills, projects, or services.
                    </p>

                    {/* Quick Action Suggestion Chips (Minimal, Subtle) */}
                    <div className="flex flex-col gap-1.5 mt-3.5 w-full max-w-[270px]">
                      <button
                        type="button"
                        onClick={() => handleSendMessage("What services does Tarek offer?")}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-[#00d2ff]/10 border border-white/[0.08] hover:border-[#00d2ff]/40 text-slate-300 hover:text-[#00f0ff] text-[11px] font-medium transition-all duration-200 active:scale-98 cursor-pointer shadow-sm text-left group"
                      >
                        <span className="text-xs shrink-0">💼</span>
                        <span className="truncate">What services does Tarek offer?</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendMessage("Tell me about Tarek")}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-[#00d2ff]/10 border border-white/[0.08] hover:border-[#00d2ff]/40 text-slate-300 hover:text-[#00f0ff] text-[11px] font-medium transition-all duration-200 active:scale-98 cursor-pointer shadow-sm text-left group"
                      >
                        <span className="text-xs shrink-0">👨‍💻</span>
                        <span className="truncate">Tell me about Tarek</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendMessage("Can I get a project estimate for a website?")}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-[#00d2ff]/10 border border-white/[0.08] hover:border-[#00d2ff]/40 text-slate-300 hover:text-[#00f0ff] text-[11px] font-medium transition-all duration-200 active:scale-98 cursor-pointer shadow-sm text-left group"
                      >
                        <span className="text-xs shrink-0">💰</span>
                        <span className="truncate">Get a project estimate</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Message History Stream */}
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-1.5 w-full min-w-0 max-w-full ${
                        isUser ? "justify-end" : "justify-start"
                      } animate-in fade-in duration-200`}
                    >
                      {/* Assistant Avatar */}
                      {!isUser && (
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00d2ff] to-[#0066ff] flex items-center justify-center text-[#050811] shrink-0 mb-1 shadow-sm">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={`max-w-[85%] min-w-0 rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm break-words [overflow-wrap:anywhere] [word-break:break-word] ${
                          isUser
                            ? "bg-gradient-to-r from-[#00a3ff] to-[#00d2ff] text-[#050811] font-medium rounded-br-none"
                            : "bg-[#091228] border border-[#00d2ff]/20 text-slate-100 rounded-bl-none"
                        }`}
                        style={{
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                          minWidth: 0,
                        }}
                      >
                        {isUser ? (
                          <div className="space-y-1.5 min-w-0">
                            {/* Uploaded Design / UI Screenshot Thumbnail */}
                            {msg.imagePreview && (
                              <div className="relative rounded-xl overflow-hidden border border-white/25 bg-black/50 max-w-[200px] shadow-md group">
                                <img
                                  src={msg.imagePreview}
                                  alt="Uploaded design screenshot"
                                  className="w-full max-h-36 object-cover hover:scale-105 transition-transform duration-300"
                                />
                                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[8.5px] text-white font-mono flex items-center gap-1 backdrop-blur-sm border border-white/10">
                                  <ImageIcon className="w-2.5 h-2.5 text-[#00d2ff]" />
                                  Design Reference
                                </span>
                              </div>
                            )}

                            {/* Uploaded Document Badge */}
                            {msg.docAttachment && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/40 border border-white/20 text-[#050811] font-mono text-[10px] max-w-full">
                                <FileText className="w-3 h-3 text-[#050811] shrink-0" />
                                <span className="font-semibold truncate max-w-[170px]">
                                  {msg.docAttachment.name}
                                </span>
                                <span className="text-[9px] opacity-75">
                                  ({(msg.docAttachment.size / 1024).toFixed(0)} KB)
                                </span>
                              </div>
                            )}

                            {/* Detected Reference URL Pill */}
                            {msg.detectedUrl && (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/30 border border-white/15 text-[9.5px] text-[#00d2ff] font-mono break-all max-w-full">
                                <Globe className="w-2.5 h-2.5 text-cyan-300 shrink-0" />
                                <span className="truncate max-w-[170px]">
                                  {msg.detectedUrl.replace(/^https?:\/\//, "")}
                                </span>
                              </div>
                            )}

                            <p
                              className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] [word-break:break-word] min-w-0"
                              style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                            >
                              {msg.content}
                            </p>
                          </div>
                        ) : (
                          <div
                            className="space-y-1 min-w-0 break-words [overflow-wrap:anywhere] [word-break:break-word]"
                            style={{
                              overflowWrap: "anywhere",
                              wordBreak: "break-word",
                              minWidth: 0,
                            }}
                          >
                            {renderMessageContent(msg.content)}
                          </div>
                        )}

                        {/* Timestamp & Micro AI Response Actions (Listen, Copy, Feedback) */}
                        <div className="flex items-center justify-between text-[8px] font-mono mt-1 pt-1 border-t border-white/[0.06] gap-2">
                          <span
                            className={
                              isUser ? "text-[#050811]/70 text-right w-full" : "text-slate-400"
                            }
                          >
                            {msg.timestamp}
                          </span>

                          {!isUser && (
                            <div className="flex items-center gap-1 shrink-0 text-slate-400">
                              {/* Listen / Stop */}
                              <button
                                type="button"
                                onClick={() => handleToggleSpeech(msg.id, msg.content)}
                                title={
                                  speakingMessageId === msg.id ? "Stop audio" : "Listen aloud"
                                }
                                aria-label={
                                  speakingMessageId === msg.id ? "Stop audio" : "Listen aloud"
                                }
                                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                                  speakingMessageId === msg.id
                                    ? "bg-[#00d2ff]/20 text-[#00f0ff] border border-[#00d2ff]/40 shadow-[0_0_8px_rgba(0,210,255,0.4)]"
                                    : "hover:text-[#00d2ff] hover:bg-white/5"
                                }`}
                              >
                                {speakingMessageId === msg.id ? (
                                  <>
                                    <VolumeX className="w-2.5 h-2.5 text-[#00f0ff] animate-pulse" />
                                    <span className="text-[8px] font-bold text-[#00f0ff]">
                                      Stop
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-2.5 h-2.5" />
                                    <span className="text-[8px] opacity-75">Listen</span>
                                  </>
                                )}
                              </button>

                              {/* Copy */}
                              <button
                                type="button"
                                onClick={() => handleCopyMessage(msg.id, msg.content)}
                                title={copiedMessageId === msg.id ? "Copied!" : "Copy response"}
                                aria-label={
                                  copiedMessageId === msg.id ? "Copied!" : "Copy response"
                                }
                                className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded transition-all cursor-pointer ${
                                  copiedMessageId === msg.id
                                    ? "text-emerald-400 bg-emerald-500/10"
                                    : "hover:text-[#00d2ff] hover:bg-white/5"
                                }`}
                              >
                                {copiedMessageId === msg.id ? (
                                  <>
                                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                                    <span className="text-[8px] text-emerald-400 font-bold">
                                      Copied
                                    </span>
                                  </>
                                ) : (
                                  <Copy className="w-2.5 h-2.5" />
                                )}
                              </button>

                              {/* Helpful */}
                              <button
                                type="button"
                                onClick={() => handleFeedback(msg.id, "up")}
                                title="Helpful"
                                aria-label="Helpful"
                                className={`p-0.5 rounded transition-all cursor-pointer ${
                                  messageFeedback[msg.id] === "up"
                                    ? "text-emerald-400 bg-emerald-500/15"
                                    : "hover:text-emerald-400 hover:bg-white/5"
                                }`}
                              >
                                <ThumbsUp className="w-2.5 h-2.5" />
                              </button>

                              {/* Not Helpful */}
                              <button
                                type="button"
                                onClick={() => handleFeedback(msg.id, "down")}
                                title="Not helpful"
                                aria-label="Not helpful"
                                className={`p-0.5 rounded transition-all cursor-pointer ${
                                  messageFeedback[msg.id] === "down"
                                    ? "text-rose-400 bg-rose-500/15"
                                    : "hover:text-rose-400 hover:bg-white/5"
                                }`}
                              >
                                <ThumbsDown className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* User Avatar */}
                      {isUser && (
                        <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-slate-300 shrink-0 mb-1">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* 3. Typing Indicator: 'Tarek AI is thinking...' ● ● ● */}
                {isLoading && (
                  <div className="flex items-end gap-1.5 justify-start animate-in fade-in duration-200">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00d2ff] to-[#0066ff] flex items-center justify-center text-[#050811] shrink-0 mb-1 shadow-[0_0_8px_rgba(0,210,255,0.4)]">
                      <Bot className="w-3.5 h-3.5 text-[#050811]" />
                    </div>
                    <div className="px-3 py-2 rounded-2xl rounded-bl-none bg-[#091228] border border-[#00d2ff]/30 text-xs text-slate-300 flex items-center gap-2 shadow-sm">
                      <span className="text-[10.5px] font-medium text-cyan-300">
                        Tarek AI is thinking...
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-bounce [animation-delay:-0.3s] shadow-[0_0_4px_#00d2ff]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-bounce [animation-delay:-0.15s] shadow-[0_0_4px_#00d2ff]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-bounce shadow-[0_0_4px_#00d2ff]" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ----------------------------------------------------------- */}
              {/* E. CHATGPT-INSPIRED INPUT BAR WITH PLUS MENU & ATTACHMENTS */}
              {/* Layout: [ + ] [ EN / বাংলা ] [ Mic ] [ Input ] [ Send ] */}
              {/* ----------------------------------------------------------- */}
              <div className="p-2.5 bg-[#060c1d] border-t border-white/[0.08] relative">
                {/* Voice Status/Error Notice */}
                {speechNotice && (
                  <div className="mb-2 px-2.5 py-1 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[10px] text-cyan-300 flex items-center justify-between animate-in fade-in duration-150">
                    <span className="truncate">{speechNotice}</span>
                    {isListening && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0 ml-1.5" />
                    )}
                  </div>
                )}

                {/* Uploaded Design Screenshot Thumbnail Preview */}
                {imageAttachment && (
                  <div className="mb-2 p-1.5 px-2 rounded-xl bg-[#091530] border border-[#00d2ff]/40 flex items-center justify-between gap-2 shadow-[0_0_12px_rgba(0,210,255,0.2)] animate-in fade-in slide-in-from-bottom-1 duration-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#00d2ff]/50 shrink-0 bg-black/60">
                        <img
                          src={imageAttachment.previewUrl}
                          alt="Design preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-white truncate max-w-[170px]">
                          {imageAttachment.name}
                        </p>
                        <p className="text-[9px] font-mono text-cyan-300">
                          {(imageAttachment.size / 1024).toFixed(0)} KB • Design Screenshot
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageAttachment(null)}
                      title="Remove attachment"
                      aria-label="Remove attachment"
                      className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Uploaded Document Preview */}
                {docAttachment && (
                  <div className="mb-2 p-1.5 px-2 rounded-xl bg-[#091530] border border-[#00d2ff]/40 flex items-center justify-between gap-2 shadow-[0_0_12px_rgba(0,210,255,0.2)] animate-in fade-in slide-in-from-bottom-1 duration-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg border border-[#00d2ff]/50 bg-black/60 flex items-center justify-center text-[#00d2ff] shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-white truncate max-w-[170px]">
                          {docAttachment.name}
                        </p>
                        <p className="text-[9px] font-mono text-cyan-300">
                          {(docAttachment.size / 1024).toFixed(0)} KB • Document Attached
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDocAttachment(null)}
                      title="Remove document"
                      aria-label="Remove document"
                      className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* PLUS BUTTON ACTION MENU POPOVER */}
                {isPlusMenuOpen && (
                  <div
                    ref={plusMenuRef}
                    className="absolute bottom-full left-2.5 mb-2 w-56 rounded-2xl bg-[#09142e]/98 backdrop-blur-xl border border-[#00d2ff]/40 shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(0,210,255,0.2)] p-1.5 z-40 space-y-1 animate-in fade-in zoom-in-95 duration-150"
                  >
                    {/* Option 1: Upload Image */}
                    <button
                      type="button"
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/[0.08] text-slate-200 hover:text-white transition-all text-left cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[11.5px] font-semibold text-white">Upload Image</div>
                        <div className="text-[9.5px] text-slate-400">Design screenshot or UI</div>
                      </div>
                    </button>

                    {/* Option 2: Analyze Website Link */}
                    <button
                      type="button"
                      onClick={handleAnalyzeLinkAction}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/[0.08] text-slate-200 hover:text-white transition-all text-left cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#00d2ff]/15 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] group-hover:scale-105 transition-transform">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[11.5px] font-semibold text-white">Analyze Link</div>
                        <div className="text-[9.5px] text-slate-400">Website URL estimate</div>
                      </div>
                    </button>

                    {/* Option 3: Attach Document */}
                    <button
                      type="button"
                      onClick={() => {
                        docInputRef.current?.click();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/[0.08] text-slate-200 hover:text-white transition-all text-left cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[11.5px] font-semibold text-white">Attach File</div>
                        <div className="text-[9.5px] text-slate-400">PDF, DOCX, or TXT brief</div>
                      </div>
                    </button>

                    {/* Option 4: Clear Current Chat */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsPlusMenuOpen(false);
                        if (messages.length > 0) {
                          setShowClearCurrentConfirm(true);
                        } else {
                          handleStartNewChat();
                        }
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-rose-500/10 text-slate-200 hover:text-rose-300 transition-all text-left cursor-pointer group border-t border-white/[0.06] pt-2"
                    >
                      <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                        <Trash2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[11.5px] font-semibold text-white group-hover:text-rose-200">Clear Current Chat</div>
                        <div className="text-[9.5px] text-slate-400">Start fresh conversation</div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Hidden File Inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <input
                  ref={docInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleDocChange}
                  className="hidden"
                />

                {/* INPUT BAR CONTROLS */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-1.5"
                >
                  {/* Plus Button */}
                  <button
                    type="button"
                    onClick={() => setIsPlusMenuOpen((prev) => !prev)}
                    title="Add attachment (Image, Website Link, File)"
                    aria-label="Add attachment"
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      isPlusMenuOpen || imageAttachment || docAttachment
                        ? "bg-[#00d2ff]/25 text-[#00f0ff] border border-[#00d2ff] shadow-[0_0_12px_rgba(0,210,255,0.45)]"
                        : "bg-white/5 hover:bg-[#00d2ff]/15 text-slate-300 hover:text-[#00d2ff] border border-white/10 hover:border-[#00d2ff]/40"
                    }`}
                  >
                    <Plus
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isPlusMenuOpen ? "rotate-45 text-[#00f0ff]" : ""
                      }`}
                    />
                  </button>

                  {/* Language Toggle for Voice Input */}
                  <button
                    type="button"
                    onClick={() => setSpeechLang((prev) => (prev === "en-US" ? "bn-BD" : "en-US"))}
                    title={`Voice language: ${
                      speechLang === "en-US"
                        ? "English (Click for Bangla)"
                        : "বাংলা (Click for English)"
                    }`}
                    className="px-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#00d2ff]/15 border border-white/10 hover:border-[#00d2ff]/40 text-[10px] font-mono text-cyan-300 transition-colors cursor-pointer shrink-0 select-none"
                  >
                    {speechLang === "en-US" ? "EN" : "বাং"}
                  </button>

                  {/* Microphone Voice Input Button */}
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    title={
                      isListening
                        ? "Stop listening"
                        : `Click to speak (${speechLang === "en-US" ? "English" : "Bangla"})`
                    }
                    aria-label={isListening ? "Stop voice input" : "Start voice input"}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      isListening
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse"
                        : "bg-white/5 hover:bg-[#00d2ff]/15 text-slate-300 hover:text-[#00d2ff] border border-white/10 hover:border-[#00d2ff]/40"
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 text-rose-400 animate-bounce" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>

                  {/* Chat Input Field */}
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputMessage}
                    onChange={(e) => {
                      setInputMessage(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={
                      imageAttachment
                        ? "Ask about this design or click Send..."
                        : docAttachment
                        ? "Ask about this document..."
                        : "Ask anything about Tarek..."
                    }
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 rounded-xl bg-black/50 border border-white/15 focus:border-[#00d2ff] text-white text-xs placeholder:text-slate-500 outline-none transition-all shadow-inner disabled:opacity-50 min-w-0 resize-none max-h-24 chat-scrollbar"
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={
                      (!inputMessage.trim() && !imageAttachment && !docAttachment) || isLoading
                    }
                    aria-label="Send Message"
                    className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#00d2ff] via-[#00a3ff] to-[#0072ff] text-white flex items-center justify-center hover:shadow-[0_0_15px_rgba(0,210,255,0.6)] active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </>,
      document.body
    );
  }
