"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { en, TranslationDict } from "@/locales/en";
import { bn } from "@/locales/bn";
import { ServiceItem } from "@/types/portfolio";

export type Language = "en" | "bn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (path: string, fallback?: string) => string;
  tCms: (cmsValue: string | undefined, localePath: string) => string;
  tService: (service: ServiceItem) => ServiceItem;
  tCategory: (catName: string) => string;
  tStatLabel: (label: string) => string;
  isMounted: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (path: string, fallback?: string) => fallback || path,
  tCms: (cmsValue: string | undefined) => cmsValue || "",
  tService: (service: ServiceItem) => service,
  tCategory: (catName: string) => catName,
  tStatLabel: (label: string) => label,
  isMounted: false,
});

const STORAGE_KEY = "tarek_portfolio_lang";

const dictionaries: Record<Language, TranslationDict> = {
  en,
  bn,
};

function getNestedValue(obj: any, path: string): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const keys = path.split(".");
  let current: any = obj;
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored === "en" || stored === "bn") {
        setLanguageState(stored);
        document.documentElement.lang = stored;
      } else {
        document.documentElement.lang = "en";
      }
    } catch {
      document.documentElement.lang = "en";
    }
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    document.documentElement.lang = newLang;
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {}
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next: Language = prev === "en" ? "bn" : "en";
      document.documentElement.lang = next;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      return next;
    });
  }, []);

  // Central Translation helper
  const t = useCallback(
    (path: string, fallback?: string): string => {
      const dict = dictionaries[language] || en;
      const val = getNestedValue(dict, path);
      if (val !== undefined) return val;

      // Fallback to English dictionary
      const enVal = getNestedValue(en, path);
      if (enVal !== undefined) return enVal;

      return fallback !== undefined ? fallback : path;
    },
    [language]
  );

  // CMS aware translation helper
  const tCms = useCallback(
    (cmsValue: string | undefined, localePath: string): string => {
      if (language === "bn") {
        const bnVal = getNestedValue(bn, localePath);
        if (bnVal) return bnVal;
      }
      return cmsValue || getNestedValue(en, localePath) || "";
    },
    [language]
  );

  // Service item translation helper
  const tService = useCallback(
    (service: ServiceItem): ServiceItem => {
      if (language !== "bn") return service;

      const num = service.number;
      const tKey =
        num === "01"
          ? "service1"
          : num === "02"
          ? "service2"
          : num === "03"
          ? "service3"
          : num === "04"
          ? "service4"
          : num === "05"
          ? "service5"
          : num === "06"
          ? "service6"
          : null;

      if (!tKey) return service;

      const bnDict = bn.services;
      return {
        ...service,
        title: (bnDict as any)[`${tKey}Title`] || service.title,
        shortDesc: (bnDict as any)[`${tKey}ShortDesc`] || service.shortDesc,
        fullDesc: (bnDict as any)[`${tKey}FullDesc`] || service.fullDesc,
        features: (bnDict as any)[`${tKey}Features`] || service.features,
        buttonText: bnDict.learnMore || "বিস্তারিত জানুন",
      };
    },
    [language]
  );

  // Category name translation helper
  const tCategory = useCallback(
    (catName: string): string => {
      if (language !== "bn") return catName;
      const lower = catName.toLowerCase().trim();
      if (lower.includes("all")) return "সকল ওয়েবসাইট";
      if (lower.includes("e-commerce") || lower.includes("ecommerce")) return "ই-কমার্স";
      if (lower.includes("business") || lower.includes("agency")) return "ব্যবসা ও এজেন্সি";
      if (lower.includes("education")) return "শিক্ষা ও একাডেমি";
      if (lower.includes("portfolio")) return "ব্যক্তিগত পোর্টফোলিও";
      if (lower.includes("coding") || lower.includes("programming"))
        return "কোডিং ও প্রোগ্রামিং ল্যাঙ্গুয়েজ";
      if (lower.includes("tool") || lower.includes("platform"))
        return "টুলস ও প্ল্যাটফর্ম";
      return catName;
    },
    [language]
  );

  // Stat label translation helper
  const tStatLabel = useCallback(
    (label: string): string => {
      if (language !== "bn") return label;
      const lower = label.toLowerCase().trim();
      if (lower.includes("completed") || (lower.includes("project") && !lower.includes("live")))
        return "সম্পন্ন প্রজেক্ট";
      if (lower.includes("year") || lower.includes("experience"))
        return "বছরের অভিজ্ঞতা";
      if (lower.includes("client") && (lower.includes("happy") || lower.includes("satisfied")))
        return "সন্তুষ্ট ক্লায়েন্ট";
      if (lower.includes("rating") || lower.includes("satisfaction"))
        return "ক্লায়েন্ট সন্তুষ্টি";
      if (lower.includes("retention") || lower.includes("support"))
        return "ক্লায়েন্ট রিটেনশন";
      if (lower.includes("data science") || lower.includes("diu"))
        return "ডিআইইউ ডাটা সায়েন্স";
      if (lower.includes("live website"))
        return "লাইভ ওয়েবসাইট";
      if (lower.includes("industry") || lower.includes("industries"))
        return "প্রধান ইন্ডাস্ট্রি";
      if (lower.includes("responsive") || lower.includes("fast"))
        return "দ্রুত ও রেসপনসিভ";
      return label;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        tCms,
        tService,
        tCategory,
        tStatLabel,
        isMounted,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
