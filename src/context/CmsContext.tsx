"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CmsData } from "@/types/portfolio";
import { defaultCmsData } from "@/lib/cms-default-data";

interface CmsContextType {
  cmsData: CmsData;
  isLoading: boolean;
  updateCms: (partial: Partial<CmsData>) => Promise<boolean>;
  refreshCms: () => Promise<void>;
  getSectionStatus: (key: string) => boolean;
}

const CmsContext = createContext<CmsContextType>({
  cmsData: defaultCmsData,
  isLoading: false,
  updateCms: async () => false,
  refreshCms: async () => {},
  getSectionStatus: () => true,
});

const LOCAL_STORAGE_KEY = "tarek_portfolio_cms_cache";

export function CmsProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: CmsData;
}) {
  const [cmsData, setCmsData] = useState<CmsData>(initialData || defaultCmsData);
  const [isLoading, setIsLoading] = useState(!initialData);

  // Sync state if initialData from server updates
  useEffect(() => {
    if (initialData) {
      setCmsData(initialData);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
      } catch {}
    }
  }, [initialData]);

  // Load latest data from API & fallback to cache
  const refreshCms = useCallback(async () => {
    try {
      // 1. If no initialData, try local cache for instant render
      if (!initialData) {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setCmsData((prev) => ({ ...prev, ...parsed }));
          } catch {}
        }
      }

      // 2. Fetch fresh single-source-of-truth from server API
      const res = await fetch(`/api/cms?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setCmsData(json.data);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data));
          } catch {}
        }
      }
    } catch (err) {
      console.warn("Could not fetch remote CMS data, using current/cached:", err);
    } finally {
      setIsLoading(false);
    }
  }, [initialData]);

  useEffect(() => {
    refreshCms();

    // Cross-tab and same-window instant sync
    const handleUpdate = (e: any) => {
      // Do not re-fetch if this window just updated state locally in updateCms
      if (e?.detail?.origin === "updateCms") return;
      refreshCms();
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("cms-storage-update", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("cms-storage-update", handleUpdate);
    };
  }, [refreshCms]);

  // Update CMS data both remotely and locally
  const updateCms = async (partial: Partial<CmsData>): Promise<boolean> => {
    const updated: CmsData = {
      ...cmsData,
      ...partial,
      siteSettings: partial.siteSettings ? { ...cmsData.siteSettings, ...partial.siteSettings } : cmsData.siteSettings,
      hero: partial.hero ? { ...cmsData.hero, ...partial.hero } : cmsData.hero,
      profile: partial.profile ? { ...cmsData.profile, ...partial.profile } : cmsData.profile,
      contactInfo: partial.contactInfo ? { ...cmsData.contactInfo, ...partial.contactInfo } : cmsData.contactInfo,
      futureVision: partial.futureVision ? { ...(cmsData.futureVision || {}), ...partial.futureVision } : cmsData.futureVision,
      servicesWhyWorkWithMe: partial.servicesWhyWorkWithMe ? { ...(cmsData.servicesWhyWorkWithMe || {}), ...partial.servicesWhyWorkWithMe } : cmsData.servicesWhyWorkWithMe,
      servicesHero: partial.servicesHero ? { ...(cmsData.servicesHero || {}), ...partial.servicesHero } : cmsData.servicesHero,
      servicesCta: partial.servicesCta ? { ...(cmsData.servicesCta || {}), ...partial.servicesCta } : cmsData.servicesCta,
      aboutCta: partial.aboutCta ? { ...(cmsData.aboutCta || {}), ...partial.aboutCta } : cmsData.aboutCta,
      portfolioPageSettings: partial.portfolioPageSettings ? { ...(cmsData.portfolioPageSettings || {}), ...partial.portfolioPageSettings } : cmsData.portfolioPageSettings,
      contactHero: partial.contactHero ? { ...(cmsData.contactHero || {}), ...partial.contactHero } : cmsData.contactHero,
      directReachHeader: partial.directReachHeader ? { ...(cmsData.directReachHeader || {}), ...partial.directReachHeader } : cmsData.directReachHeader,
      officeWorkingHours: partial.officeWorkingHours ? { ...(cmsData.officeWorkingHours || {}), ...partial.officeWorkingHours } : cmsData.officeWorkingHours,
      contactFormSettings: partial.contactFormSettings ? { ...(cmsData.contactFormSettings || {}), ...partial.contactFormSettings } : cmsData.contactFormSettings,
      resumeSettings: partial.resumeSettings ? { ...(cmsData.resumeSettings || {}), ...partial.resumeSettings } : cmsData.resumeSettings,
      contactVisibility: partial.contactVisibility ? { ...(cmsData.contactVisibility || {}), ...partial.contactVisibility } : cmsData.contactVisibility,
      contactSeo: partial.contactSeo ? { ...(cmsData.contactSeo || {}), ...partial.contactSeo } : cmsData.contactSeo,
      quickContactChannels: partial.quickContactChannels ?? cmsData.quickContactChannels,
      contactAvailabilityBadges: partial.contactAvailabilityBadges ?? cmsData.contactAvailabilityBadges,
      directContactCards: partial.directContactCards ?? cmsData.directContactCards,
      footerSettings: partial.footerSettings ? { ...(cmsData.footerSettings || {}), ...partial.footerSettings } : cmsData.footerSettings,
      education: partial.education ?? cmsData.education,
      certifications: partial.certifications ?? cmsData.certifications,
      projects: partial.projects ?? cmsData.projects,
      projectCategories: partial.projectCategories ?? cmsData.projectCategories,
      services: partial.services ?? cmsData.services,
      servicesTechList: partial.servicesTechList ?? cmsData.servicesTechList,
      skills: partial.skills ?? cmsData.skills,
      skillsCoreExpertise: partial.skillsCoreExpertise ?? cmsData.skillsCoreExpertise,
      skillsLearning: partial.skillsLearning ?? cmsData.skillsLearning,
      skillsRoadmap: partial.skillsRoadmap ?? cmsData.skillsRoadmap,
      pages: partial.pages ?? cmsData.pages,
      homeSections: partial.homeSections ?? cmsData.homeSections,
      navigation: partial.navigation ?? cmsData.navigation,
      media: partial.media ?? cmsData.media,
      milestonesPhotos: partial.milestonesPhotos ?? cmsData.milestonesPhotos,
      stats: partial.stats ?? cmsData.stats,
      testimonials: partial.testimonials ?? cmsData.testimonials,
      processSteps: partial.processSteps ?? cmsData.processSteps,
      clientBrands: partial.clientBrands ?? cmsData.clientBrands,
      faqs: partial.faqs ?? cmsData.faqs,
      aiChatSettings: partial.aiChatSettings
        ? { ...(cmsData.aiChatSettings || {}), ...partial.aiChatSettings }
        : cmsData.aiChatSettings,
      mediaManager: partial.mediaManager
        ? {
            ...cmsData.mediaManager,
            ...partial.mediaManager,
            settings: {
              ...cmsData.mediaManager?.settings,
              ...partial.mediaManager.settings,
            },
            videos: partial.mediaManager.videos ?? cmsData.mediaManager?.videos ?? [],
            audios: partial.mediaManager.audios ?? cmsData.mediaManager?.audios ?? [],
            youtubeAudios: partial.mediaManager.youtubeAudios ?? cmsData.mediaManager?.youtubeAudios ?? [],
          }
        : cmsData.mediaManager,
    };
    // Optimistic UI update
    setCmsData(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      const authHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (typeof window !== "undefined") {
        try {
          const token = localStorage.getItem("admin_token");
          const session = localStorage.getItem("admin_session");
          if (token) {
            authHeaders["Authorization"] = `Bearer ${token}`;
          } else if (session && JSON.parse(session)?.authenticated) {
            authHeaders["Authorization"] = "Bearer active";
          }
        } catch {}
      }

      const res = await fetch("/api/cms", {
        method: "POST",
        headers: authHeaders,
        credentials: "same-origin",
        body: JSON.stringify({ partial }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setCmsData(json.data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cms-storage-update", { detail: { origin: "updateCms" } }));
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to persist CMS update:", err);
      return false;
    }
  };

  const getSectionStatus = useCallback(
    (key: string): boolean => {
      const section = cmsData.homeSections?.find((s) => s.key === key);
      return section ? section.enabled : true;
    },
    [cmsData.homeSections]
  );

  return (
    <CmsContext.Provider
      value={{
        cmsData,
        isLoading,
        updateCms,
        refreshCms,
        getSectionStatus,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error("useCms must be used within a CmsProvider");
  }
  return context;
}

