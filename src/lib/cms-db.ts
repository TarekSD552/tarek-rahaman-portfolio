import fs from "fs/promises";
import path from "path";
import { CmsData } from "@/types/portfolio";
import { defaultCmsData } from "./cms-default-data";

const CMS_FILE_PATH = path.join(process.cwd(), "src", "data", "cms-content.json");

/**
 * Get current CMS data from disk.
 * If file does not exist, initialize it with defaultCmsData.
 */
export async function getCmsData(): Promise<CmsData> {
  try {
    const raw = await fs.readFile(CMS_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);

    // Deep merge with defaults so all 35+ keys are always guaranteed
    return {
      ...defaultCmsData,
      ...parsed,
      siteSettings: {
        ...defaultCmsData.siteSettings,
        ...(parsed.siteSettings || {}),
        faviconUrl:
          parsed.siteSettings?.faviconUrl ||
          parsed.siteSettings?.favicon ||
          defaultCmsData.siteSettings.faviconUrl ||
          "/favicon.ico",
        favicon:
          parsed.siteSettings?.faviconUrl ||
          parsed.siteSettings?.favicon ||
          defaultCmsData.siteSettings.faviconUrl ||
          "/favicon.ico",
      },
      aiChatSettings: {
        ...defaultCmsData.aiChatSettings,
        ...(parsed.aiChatSettings || {}),
        quickQuestions:
          parsed.aiChatSettings?.quickQuestions &&
          parsed.aiChatSettings.quickQuestions.length > 0
            ? parsed.aiChatSettings.quickQuestions
            : defaultCmsData.aiChatSettings?.quickQuestions,
      },
      loadingSoundSettings: {
        ...defaultCmsData.loadingSoundSettings,
        ...(parsed.loadingSoundSettings || {}),
        enabled: parsed.loadingSoundSettings?.enabled !== undefined ? parsed.loadingSoundSettings.enabled : true,
        soundUrl: parsed.loadingSoundSettings?.soundUrl || defaultCmsData.loadingSoundSettings?.soundUrl || "/sounds/whoosh-transition.wav",
        soundFileName: parsed.loadingSoundSettings?.soundFileName || defaultCmsData.loadingSoundSettings?.soundFileName || "whoosh-transition.wav (Default Futuristic Whoosh)",
        volume: parsed.loadingSoundSettings?.volume !== undefined ? parsed.loadingSoundSettings.volume : 45,
        isCustom: Boolean(parsed.loadingSoundSettings?.isCustom),
      },
      hero: { ...defaultCmsData.hero, ...(parsed.hero || {}) },
      contactInfo: { ...defaultCmsData.contactInfo, ...(parsed.contactInfo || {}) },
      profile: {
        ...defaultCmsData.profile,
        ...(parsed.profile || {}),
        mainPortraitUrl:
          parsed.profile?.mainPortraitUrl ||
          parsed.profile?.portraitUrl ||
          defaultCmsData.profile?.mainPortraitUrl ||
          "/uploads/1793719116653-Untitled_design.png",
        heroPhotos: Array.isArray(parsed.profile?.heroPhotos) && parsed.profile.heroPhotos.length >= 3
          ? parsed.profile.heroPhotos
          : (Array.isArray(parsed.profile?.heroPhotos) && parsed.profile.heroPhotos.length > 0
              ? [
                  ...parsed.profile.heroPhotos,
                  ...defaultCmsData.profile.heroPhotos.slice(parsed.profile.heroPhotos.length)
                ]
              : defaultCmsData.profile.heroPhotos),
      },
      education: Array.isArray(parsed.education) ? parsed.education : (defaultCmsData.education || []),
      certifications: Array.isArray(parsed.certifications) ? parsed.certifications : (defaultCmsData.certifications || []),
      pages: Array.isArray(parsed.pages) ? parsed.pages : defaultCmsData.pages,
      homeSections: Array.isArray(parsed.homeSections) ? parsed.homeSections : defaultCmsData.homeSections,
      projects: Array.isArray(parsed.projects) ? parsed.projects : defaultCmsData.projects,
      projectCategories: Array.isArray(parsed.projectCategories) ? parsed.projectCategories : (defaultCmsData.projectCategories || []),
      portfolioPageSettings: {
        ...(defaultCmsData.portfolioPageSettings || {}),
        ...(parsed.portfolioPageSettings || {}),
        heroTags: Array.isArray(parsed.portfolioPageSettings?.heroTags)
          ? parsed.portfolioPageSettings.heroTags
          : defaultCmsData.portfolioPageSettings?.heroTags,
        heroStats: Array.isArray(parsed.portfolioPageSettings?.heroStats)
          ? parsed.portfolioPageSettings.heroStats
          : defaultCmsData.portfolioPageSettings?.heroStats,
        heroFeatured: {
          ...(defaultCmsData.portfolioPageSettings?.heroFeatured || {}),
          ...(parsed.portfolioPageSettings?.heroFeatured || {}),
        },
      },
      services: Array.isArray(parsed.services) ? parsed.services : defaultCmsData.services,
      servicesHero: { ...(defaultCmsData.servicesHero || {}), ...(parsed.servicesHero || {}) },
      servicesWhyWorkWithMe: { ...(defaultCmsData.servicesWhyWorkWithMe || {}), ...(parsed.servicesWhyWorkWithMe || {}) },
      servicesTechList: Array.isArray(parsed.servicesTechList) ? parsed.servicesTechList : (defaultCmsData.servicesTechList || []),
      servicesCta: { ...(defaultCmsData.servicesCta || {}), ...(parsed.servicesCta || {}) },
      skills: Array.isArray(parsed.skills) ? parsed.skills : defaultCmsData.skills,
      skillsCoreExpertise: Array.isArray(parsed.skillsCoreExpertise) ? parsed.skillsCoreExpertise : (defaultCmsData.skillsCoreExpertise || []),
      skillsLearning: Array.isArray(parsed.skillsLearning) ? parsed.skillsLearning : (defaultCmsData.skillsLearning || []),
      skillsRoadmap: Array.isArray(parsed.skillsRoadmap) ? parsed.skillsRoadmap : (defaultCmsData.skillsRoadmap || []),
      navigation: Array.isArray(parsed.navigation) ? parsed.navigation : defaultCmsData.navigation,
      contactHero: { ...(defaultCmsData.contactHero || {}), ...(parsed.contactHero || {}) },
      quickContactChannels: Array.isArray(parsed.quickContactChannels)
        ? parsed.quickContactChannels
        : (defaultCmsData.quickContactChannels || []),
      contactAvailabilityBadges: Array.isArray(parsed.contactAvailabilityBadges)
        ? parsed.contactAvailabilityBadges
        : (defaultCmsData.contactAvailabilityBadges || []),
      directReachHeader: { ...(defaultCmsData.directReachHeader || {}), ...(parsed.directReachHeader || {}) },
      directContactCards: Array.isArray(parsed.directContactCards)
        ? parsed.directContactCards
        : (defaultCmsData.directContactCards || []),
      officeWorkingHours: { ...(defaultCmsData.officeWorkingHours || {}), ...(parsed.officeWorkingHours || {}) },
      contactFormSettings: {
        ...(defaultCmsData.contactFormSettings || {}),
        ...(parsed.contactFormSettings || {}),
        fields: Array.isArray(parsed.contactFormSettings?.fields)
          ? parsed.contactFormSettings.fields
          : (defaultCmsData.contactFormSettings?.fields || []),
      },
      resumeSettings: { ...(defaultCmsData.resumeSettings || {}), ...(parsed.resumeSettings || {}) },
      contactVisibility: { ...(defaultCmsData.contactVisibility || {}), ...(parsed.contactVisibility || {}) },
      contactSeo: { ...(defaultCmsData.contactSeo || {}), ...(parsed.contactSeo || {}) },
      footerSettings: { ...(defaultCmsData.footerSettings || {}), ...(parsed.footerSettings || {}) },
      media: Array.isArray(parsed.media) ? parsed.media : defaultCmsData.media,
      milestonesPhotos: Array.isArray(parsed.milestonesPhotos) ? parsed.milestonesPhotos : defaultCmsData.milestonesPhotos,
      stats: Array.isArray(parsed.stats) ? parsed.stats : defaultCmsData.stats,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : defaultCmsData.testimonials,
      processSteps: Array.isArray(parsed.processSteps) ? parsed.processSteps : defaultCmsData.processSteps,
      clientBrands: Array.isArray(parsed.clientBrands) ? parsed.clientBrands : defaultCmsData.clientBrands,
      futureVision: { ...(defaultCmsData.futureVision || {}), ...(parsed.futureVision || {}) },
      faqs: Array.isArray(parsed.faqs) ? parsed.faqs : (defaultCmsData.faqs || []),
      aboutCta: { ...(defaultCmsData.aboutCta || {}), ...(parsed.aboutCta || {}) },
      aboutBio: {
        ...defaultCmsData.aboutBio,
        ...(parsed.aboutBio || {}),
        badges: Array.isArray(parsed.aboutBio?.badges) && parsed.aboutBio.badges.length > 0
          ? parsed.aboutBio.badges
          : (defaultCmsData.aboutBio?.badges || []),
      },
      aboutGallery: Array.isArray(parsed.aboutGallery) && parsed.aboutGallery.length > 0
        ? parsed.aboutGallery
        : (defaultCmsData.aboutGallery || []),
      aboutHero: {
        ...defaultCmsData.aboutHero,
        ...(parsed.aboutHero || {}),
        badge: { ...(defaultCmsData.aboutHero?.badge || {}), ...(parsed.aboutHero?.badge || {}) },
        heading: { ...(defaultCmsData.aboutHero?.heading || {}), ...(parsed.aboutHero?.heading || {}) },
        paragraphs: Array.isArray(parsed.aboutHero?.paragraphs) && parsed.aboutHero.paragraphs.length > 0
          ? parsed.aboutHero.paragraphs
          : (defaultCmsData.aboutHero?.paragraphs || []),
        techBadges: Array.isArray(parsed.aboutHero?.techBadges) && parsed.aboutHero.techBadges.length > 0
          ? parsed.aboutHero.techBadges
          : (defaultCmsData.aboutHero?.techBadges || []),
        stats: Array.isArray(parsed.aboutHero?.stats) && parsed.aboutHero.stats.length > 0
          ? parsed.aboutHero.stats
          : (defaultCmsData.aboutHero?.stats || []),
        buttons: Array.isArray(parsed.aboutHero?.buttons) && parsed.aboutHero.buttons.length > 0
          ? parsed.aboutHero.buttons
          : (defaultCmsData.aboutHero?.buttons || []),
      },
      aboutProfileCard: {
        ...defaultCmsData.aboutProfileCard,
        ...(parsed.aboutProfileCard || {}),
      },
      aboutSectionsVisibility: {
        ...defaultCmsData.aboutSectionsVisibility,
        ...(parsed.aboutSectionsVisibility || {}),
      },
      aboutStatsSection: {
        ...defaultCmsData.aboutStatsSection,
        ...(parsed.aboutStatsSection || {}),
      },
      aboutProcessHeader: {
        ...(defaultCmsData.aboutProcessHeader || {}),
        ...(parsed.aboutProcessHeader || {}),
      },
      aboutTechHeader: {
        ...(defaultCmsData.aboutTechHeader || {}),
        ...(parsed.aboutTechHeader || {}),
      },
      homeJourneyHeader: {
        ...(defaultCmsData.homeJourneyHeader || {}),
        ...(parsed.homeJourneyHeader || {}),
      },
      homeServicesHeader: {
        ...(defaultCmsData.homeServicesHeader || {}),
        ...(parsed.homeServicesHeader || {}),
      },
      homeSkillsHeader: {
        ...(defaultCmsData.homeSkillsHeader || {}),
        ...(parsed.homeSkillsHeader || {}),
      },
      homeToolsHeader: {
        ...(defaultCmsData.homeToolsHeader || {}),
        ...(parsed.homeToolsHeader || {}),
      },
      homePortfolioSettings: {
        ...(defaultCmsData.homePortfolioSettings || {}),
        ...(parsed.homePortfolioSettings || {}),
        stats: Array.isArray(parsed.homePortfolioSettings?.stats)
          ? parsed.homePortfolioSettings.stats
          : defaultCmsData.homePortfolioSettings?.stats,
      },
      homeWorkflowHeader: {
        ...(defaultCmsData.homeWorkflowHeader || {}),
        ...(parsed.homeWorkflowHeader || {}),
      },
      homeAboutSettings: {
        ...(defaultCmsData.homeAboutSettings || {}),
        ...(parsed.homeAboutSettings || {}),
        techBadges: Array.isArray(parsed.homeAboutSettings?.techBadges)
          ? parsed.homeAboutSettings.techBadges
          : defaultCmsData.homeAboutSettings?.techBadges,
        stats: Array.isArray(parsed.homeAboutSettings?.stats)
          ? parsed.homeAboutSettings.stats
          : defaultCmsData.homeAboutSettings?.stats,
      },
      homeTestimonialsHeader: {
        ...(defaultCmsData.homeTestimonialsHeader || {}),
        ...(parsed.homeTestimonialsHeader || {}),
      },
      homeStatsSettings: {
        ...(defaultCmsData.homeStatsSettings || {}),
        ...(parsed.homeStatsSettings || {}),
        globeCountries: Array.isArray(parsed.homeStatsSettings?.globeCountries)
          ? parsed.homeStatsSettings.globeCountries
          : defaultCmsData.homeStatsSettings?.globeCountries,
      },
      homeClientsHeader: {
        ...(defaultCmsData.homeClientsHeader || {}),
        ...(parsed.homeClientsHeader || {}),
      },
      homeCtaSettings: {
        ...(defaultCmsData.homeCtaSettings || {}),
        ...(parsed.homeCtaSettings || {}),
      },
      homeThemeSettings: {
        ...(defaultCmsData.homeThemeSettings || {}),
        ...(parsed.homeThemeSettings || {}),
      },
      servicesWorkflowHeader: {
        ...(defaultCmsData.servicesWorkflowHeader || {}),
        ...(parsed.servicesWorkflowHeader || {}),
      },
      servicesTechHeader: {
        ...(defaultCmsData.servicesTechHeader || {}),
        ...(parsed.servicesTechHeader || {}),
      },
      servicesFaqHeader: {
        ...(defaultCmsData.servicesFaqHeader || {}),
        ...(parsed.servicesFaqHeader || {}),
      },
      servicesSeoSettings: {
        ...(defaultCmsData.servicesSeoSettings || {}),
        ...(parsed.servicesSeoSettings || {}),
      },
      servicesDesignSettings: {
        ...(defaultCmsData.servicesDesignSettings || {}),
        ...(parsed.servicesDesignSettings || {}),
      },
      skillsHero: {
        ...defaultCmsData.skillsHero,
        ...(parsed.skillsHero || {}),
        tags: Array.isArray(parsed.skillsHero?.tags) ? parsed.skillsHero.tags : defaultCmsData.skillsHero?.tags,
        stats: Array.isArray(parsed.skillsHero?.stats) ? parsed.skillsHero.stats : defaultCmsData.skillsHero?.stats,
        visualCards: Array.isArray(parsed.skillsHero?.visualCards) ? parsed.skillsHero.visualCards : defaultCmsData.skillsHero?.visualCards,
      },
      skillsCodingHeader: {
        ...(defaultCmsData.skillsCodingHeader || {}),
        ...(parsed.skillsCodingHeader || {}),
      },
      skillsToolsHeader: {
        ...(defaultCmsData.skillsToolsHeader || {}),
        ...(parsed.skillsToolsHeader || {}),
      },
      skillsCoreHeader: {
        ...(defaultCmsData.skillsCoreHeader || {}),
        ...(parsed.skillsCoreHeader || {}),
      },
      skillsLearningHeader: {
        ...(defaultCmsData.skillsLearningHeader || {}),
        ...(parsed.skillsLearningHeader || {}),
      },
      skillsRoadmapHeader: {
        ...(defaultCmsData.skillsRoadmapHeader || {}),
        ...(parsed.skillsRoadmapHeader || {}),
      },
      skillsSeoSettings: {
        ...(defaultCmsData.skillsSeoSettings || {}),
        ...(parsed.skillsSeoSettings || {}),
      },
      skillsDesignSettings: {
        ...(defaultCmsData.skillsDesignSettings || {}),
        ...(parsed.skillsDesignSettings || {}),
      },
      mediaManager: (() => {
        if (!parsed.mediaManager) return defaultCmsData.mediaManager;
        const rawAudios = Array.isArray(parsed.mediaManager.audios) ? parsed.mediaManager.audios : [];
        const rawVideos = Array.isArray(parsed.mediaManager.videos) ? parsed.mediaManager.videos : [];
        const rawYouTubeAudios = Array.isArray(parsed.mediaManager.youtubeAudios) ? parsed.mediaManager.youtubeAudios : [];
        const rawSettings = {
          ...defaultCmsData.mediaManager?.settings,
          ...(parsed.mediaManager.settings || {}),
        };
        // Sanitize active IDs: ensure active IDs always exist in their respective media lists
        if (rawSettings.activeAudioId && !rawAudios.some((a: any) => a.id === rawSettings.activeAudioId)) {
          rawSettings.activeAudioId = "";
        }
        if (rawSettings.activeVideoId && !rawVideos.some((v: any) => v.id === rawSettings.activeVideoId)) {
          rawSettings.activeVideoId = "";
        }
        if (rawSettings.activeYouTubeAudioId && !rawYouTubeAudios.some((y: any) => y.id === rawSettings.activeYouTubeAudioId)) {
          rawSettings.activeYouTubeAudioId = "";
        }
        if (!rawSettings.activeYouTubeAudioId && rawYouTubeAudios.length > 0) {
          rawSettings.activeYouTubeAudioId = rawYouTubeAudios[0].id;
        }
        if (!rawSettings.activeAudioId && rawAudios.length > 0) {
          rawSettings.activeAudioId = rawAudios[0].id;
        }
        return {
          ...defaultCmsData.mediaManager,
          ...parsed.mediaManager,
          settings: rawSettings,
          videos: rawVideos,
          audios: rawAudios,
          youtubeAudios: rawYouTubeAudios,
        };
      })(),
    };
  } catch (err: any) {
    if (err.code === "ENOENT" || err.name === "SyntaxError") {
      // Initialize on first access
      await saveCmsData(defaultCmsData);
      return defaultCmsData;
    }
    console.error("Error reading CMS content file:", err);
    return defaultCmsData;
  }
}

/**
 * Atomically write CMS data to disk.
 */
export async function saveCmsData(data: CmsData): Promise<CmsData> {
  const tempPath = `${CMS_FILE_PATH}.tmp`;
  const serialized = JSON.stringify(data, null, 2);
  
  // Ensure directory exists
  await fs.mkdir(path.dirname(CMS_FILE_PATH), { recursive: true });
  
  // Write to temporary file then rename for atomic safety
  await fs.writeFile(tempPath, serialized, "utf-8");
  await fs.rename(tempPath, CMS_FILE_PATH);
  
  return data;
}

/**
 * Update partial CMS section with safe deep merging for all 35+ fields.
 */
export async function updateCmsPartial(partial: Partial<CmsData>): Promise<CmsData> {
  const current = await getCmsData();
  const updated: CmsData = {
    ...current,
    ...partial,
    siteSettings: partial.siteSettings
      ? {
          ...current.siteSettings,
          ...partial.siteSettings,
          faviconUrl:
            partial.siteSettings.faviconUrl ||
            (partial.siteSettings as any).favicon ||
            current.siteSettings.faviconUrl ||
            "/favicon.ico",
          favicon:
            partial.siteSettings.faviconUrl ||
            (partial.siteSettings as any).favicon ||
            current.siteSettings.faviconUrl ||
            "/favicon.ico",
        }
      : current.siteSettings,
    hero: partial.hero ? { ...current.hero, ...partial.hero } : current.hero,
    profile: partial.profile ? { ...current.profile, ...partial.profile } : current.profile,
    contactInfo: partial.contactInfo ? { ...current.contactInfo, ...partial.contactInfo } : current.contactInfo,
    futureVision: partial.futureVision ? { ...(current.futureVision || {}), ...partial.futureVision } : current.futureVision,
    aboutCta: partial.aboutCta ? { ...(current.aboutCta || {}), ...partial.aboutCta } : current.aboutCta,
    aboutBio: partial.aboutBio ? { ...(current.aboutBio || {}), ...partial.aboutBio } : current.aboutBio,
    aboutGallery: partial.aboutGallery ?? current.aboutGallery,
    aboutHero: partial.aboutHero ? { ...(current.aboutHero || {}), ...partial.aboutHero } : current.aboutHero,
    aboutProfileCard: partial.aboutProfileCard ? { ...(current.aboutProfileCard || {}), ...partial.aboutProfileCard } : current.aboutProfileCard,
    aboutSectionsVisibility: partial.aboutSectionsVisibility ? { ...(current.aboutSectionsVisibility || {}), ...partial.aboutSectionsVisibility } : current.aboutSectionsVisibility,
    aboutStatsSection: partial.aboutStatsSection ? { ...(current.aboutStatsSection || {}), ...partial.aboutStatsSection } : current.aboutStatsSection,
    aboutProcessHeader: partial.aboutProcessHeader ? { ...(current.aboutProcessHeader || {}), ...partial.aboutProcessHeader } : current.aboutProcessHeader,
    aboutTechHeader: partial.aboutTechHeader ? { ...(current.aboutTechHeader || {}), ...partial.aboutTechHeader } : current.aboutTechHeader,
    homeJourneyHeader: partial.homeJourneyHeader ? { ...(current.homeJourneyHeader || {}), ...partial.homeJourneyHeader } : current.homeJourneyHeader,
    homeServicesHeader: partial.homeServicesHeader ? { ...(current.homeServicesHeader || {}), ...partial.homeServicesHeader } : current.homeServicesHeader,
    homeSkillsHeader: partial.homeSkillsHeader ? { ...(current.homeSkillsHeader || {}), ...partial.homeSkillsHeader } : current.homeSkillsHeader,
    homeToolsHeader: partial.homeToolsHeader ? { ...(current.homeToolsHeader || {}), ...partial.homeToolsHeader } : current.homeToolsHeader,
    homePortfolioSettings: partial.homePortfolioSettings ? { ...(current.homePortfolioSettings || {}), ...partial.homePortfolioSettings } : current.homePortfolioSettings,
    homeWorkflowHeader: partial.homeWorkflowHeader ? { ...(current.homeWorkflowHeader || {}), ...partial.homeWorkflowHeader } : current.homeWorkflowHeader,
    homeAboutSettings: partial.homeAboutSettings ? { ...(current.homeAboutSettings || {}), ...partial.homeAboutSettings } : current.homeAboutSettings,
    homeTestimonialsHeader: partial.homeTestimonialsHeader ? { ...(current.homeTestimonialsHeader || {}), ...partial.homeTestimonialsHeader } : current.homeTestimonialsHeader,
    homeStatsSettings: partial.homeStatsSettings ? { ...(current.homeStatsSettings || {}), ...partial.homeStatsSettings } : current.homeStatsSettings,
    homeClientsHeader: partial.homeClientsHeader ? { ...(current.homeClientsHeader || {}), ...partial.homeClientsHeader } : current.homeClientsHeader,
    homeCtaSettings: partial.homeCtaSettings ? { ...(current.homeCtaSettings || {}), ...partial.homeCtaSettings } : current.homeCtaSettings,
    homeThemeSettings: partial.homeThemeSettings ? { ...(current.homeThemeSettings || {}), ...partial.homeThemeSettings } : current.homeThemeSettings,
    portfolioPageSettings: partial.portfolioPageSettings
      ? {
          ...(current.portfolioPageSettings || defaultCmsData.portfolioPageSettings || {}),
          ...partial.portfolioPageSettings,
          heroTags: partial.portfolioPageSettings.heroTags ?? current.portfolioPageSettings?.heroTags,
          heroStats: partial.portfolioPageSettings.heroStats ?? current.portfolioPageSettings?.heroStats,
          heroFeatured: partial.portfolioPageSettings.heroFeatured
            ? {
                ...(current.portfolioPageSettings?.heroFeatured || defaultCmsData.portfolioPageSettings?.heroFeatured || {}),
                ...partial.portfolioPageSettings.heroFeatured,
              }
            : current.portfolioPageSettings?.heroFeatured,
        }
      : current.portfolioPageSettings,
    contactHero: partial.contactHero ? { ...(current.contactHero || {}), ...partial.contactHero } : current.contactHero,
    quickContactChannels: partial.quickContactChannels ?? current.quickContactChannels,
    contactAvailabilityBadges: partial.contactAvailabilityBadges ?? current.contactAvailabilityBadges,
    directReachHeader: partial.directReachHeader ? { ...(current.directReachHeader || {}), ...partial.directReachHeader } : current.directReachHeader,
    directContactCards: partial.directContactCards ?? current.directContactCards,
    officeWorkingHours: partial.officeWorkingHours ? { ...(current.officeWorkingHours || {}), ...partial.officeWorkingHours } : current.officeWorkingHours,
    contactFormSettings: partial.contactFormSettings ? { ...(current.contactFormSettings || {}), ...partial.contactFormSettings } : current.contactFormSettings,
    resumeSettings: partial.resumeSettings ? { ...(current.resumeSettings || {}), ...partial.resumeSettings } : current.resumeSettings,
    contactVisibility: partial.contactVisibility ? { ...(current.contactVisibility || {}), ...partial.contactVisibility } : current.contactVisibility,
    contactSeo: partial.contactSeo ? { ...(current.contactSeo || {}), ...partial.contactSeo } : current.contactSeo,
    footerSettings: partial.footerSettings ? { ...(current.footerSettings || {}), ...partial.footerSettings } : current.footerSettings,
    education: partial.education ?? current.education,
    certifications: partial.certifications ?? current.certifications,
    projects: partial.projects ?? current.projects,
    projectCategories: partial.projectCategories ?? current.projectCategories,
    services: partial.services ?? current.services,
    servicesTechList: partial.servicesTechList ?? current.servicesTechList,
    skills: partial.skills ?? current.skills,
    skillsCoreExpertise: partial.skillsCoreExpertise ?? current.skillsCoreExpertise,
    skillsLearning: partial.skillsLearning ?? current.skillsLearning,
    skillsRoadmap: partial.skillsRoadmap ?? current.skillsRoadmap,
    pages: partial.pages ?? current.pages,
    homeSections: partial.homeSections ?? current.homeSections,
    navigation: partial.navigation ?? current.navigation,
    media: partial.media ?? current.media,
    milestonesPhotos: partial.milestonesPhotos ?? current.milestonesPhotos,
    stats: partial.stats ?? current.stats,
    testimonials: partial.testimonials ?? current.testimonials,
    processSteps: partial.processSteps ?? current.processSteps,
    clientBrands: partial.clientBrands ?? current.clientBrands,
    faqs: partial.faqs ?? current.faqs,
    servicesHero: partial.servicesHero ? { ...(current.servicesHero || defaultCmsData.servicesHero || {}), ...partial.servicesHero } : current.servicesHero,
    servicesWhyWorkWithMe: partial.servicesWhyWorkWithMe ? { ...(current.servicesWhyWorkWithMe || defaultCmsData.servicesWhyWorkWithMe || {}), ...partial.servicesWhyWorkWithMe } : current.servicesWhyWorkWithMe,
    servicesCta: partial.servicesCta ? { ...(current.servicesCta || defaultCmsData.servicesCta || {}), ...partial.servicesCta } : current.servicesCta,
    servicesWorkflowHeader: partial.servicesWorkflowHeader ? { ...(current.servicesWorkflowHeader || defaultCmsData.servicesWorkflowHeader || {}), ...partial.servicesWorkflowHeader } : current.servicesWorkflowHeader,
    servicesTechHeader: partial.servicesTechHeader ? { ...(current.servicesTechHeader || defaultCmsData.servicesTechHeader || {}), ...partial.servicesTechHeader } : current.servicesTechHeader,
    servicesFaqHeader: partial.servicesFaqHeader ? { ...(current.servicesFaqHeader || defaultCmsData.servicesFaqHeader || {}), ...partial.servicesFaqHeader } : current.servicesFaqHeader,
    servicesSeoSettings: partial.servicesSeoSettings ? { ...(current.servicesSeoSettings || defaultCmsData.servicesSeoSettings || {}), ...partial.servicesSeoSettings } : current.servicesSeoSettings,
    servicesDesignSettings: partial.servicesDesignSettings ? { ...(current.servicesDesignSettings || defaultCmsData.servicesDesignSettings || {}), ...partial.servicesDesignSettings } : current.servicesDesignSettings,
    skillsHero: partial.skillsHero ? { ...(current.skillsHero || defaultCmsData.skillsHero || {}), ...partial.skillsHero } : current.skillsHero,
    skillsCodingHeader: partial.skillsCodingHeader ? { ...(current.skillsCodingHeader || defaultCmsData.skillsCodingHeader || {}), ...partial.skillsCodingHeader } : current.skillsCodingHeader,
    skillsToolsHeader: partial.skillsToolsHeader ? { ...(current.skillsToolsHeader || defaultCmsData.skillsToolsHeader || {}), ...partial.skillsToolsHeader } : current.skillsToolsHeader,
    skillsCoreHeader: partial.skillsCoreHeader ? { ...(current.skillsCoreHeader || defaultCmsData.skillsCoreHeader || {}), ...partial.skillsCoreHeader } : current.skillsCoreHeader,
    skillsLearningHeader: partial.skillsLearningHeader ? { ...(current.skillsLearningHeader || defaultCmsData.skillsLearningHeader || {}), ...partial.skillsLearningHeader } : current.skillsLearningHeader,
    skillsRoadmapHeader: partial.skillsRoadmapHeader ? { ...(current.skillsRoadmapHeader || defaultCmsData.skillsRoadmapHeader || {}), ...partial.skillsRoadmapHeader } : current.skillsRoadmapHeader,
    skillsSeoSettings: partial.skillsSeoSettings ? { ...(current.skillsSeoSettings || defaultCmsData.skillsSeoSettings || {}), ...partial.skillsSeoSettings } : current.skillsSeoSettings,
    skillsDesignSettings: partial.skillsDesignSettings ? { ...(current.skillsDesignSettings || defaultCmsData.skillsDesignSettings || {}), ...partial.skillsDesignSettings } : current.skillsDesignSettings,
    aiChatSettings: partial.aiChatSettings
      ? {
          ...(current.aiChatSettings || defaultCmsData.aiChatSettings || {}),
          ...partial.aiChatSettings,
          quickQuestions:
            partial.aiChatSettings.quickQuestions ??
            current.aiChatSettings?.quickQuestions ??
            defaultCmsData.aiChatSettings?.quickQuestions,
        }
      : current.aiChatSettings || defaultCmsData.aiChatSettings,
    mediaManager: (() => {
      const base = current.mediaManager || defaultCmsData.mediaManager;
      if (!partial.mediaManager) return base;
      const rawAudios = partial.mediaManager.audios ?? base?.audios ?? [];
      const rawVideos = partial.mediaManager.videos ?? base?.videos ?? [];
      const rawYouTubeAudios = partial.mediaManager.youtubeAudios ?? base?.youtubeAudios ?? [];
      const rawSettings = {
        ...(base?.settings || defaultCmsData.mediaManager?.settings),
        ...(partial.mediaManager.settings || {}),
      };
      // Sanitize active IDs: ensure active IDs always exist in their respective media lists
      if (rawSettings.activeAudioId && !rawAudios.some((a: any) => a.id === rawSettings.activeAudioId)) {
        rawSettings.activeAudioId = "";
      }
      if (rawSettings.activeVideoId && !rawVideos.some((v: any) => v.id === rawSettings.activeVideoId)) {
        rawSettings.activeVideoId = "";
      }
      if (rawSettings.activeYouTubeAudioId && !rawYouTubeAudios.some((y: any) => y.id === rawSettings.activeYouTubeAudioId)) {
        rawSettings.activeYouTubeAudioId = "";
      }
      if (!rawSettings.activeYouTubeAudioId && rawYouTubeAudios.length > 0) {
        rawSettings.activeYouTubeAudioId = rawYouTubeAudios[0].id;
      }
      if (!rawSettings.activeAudioId && rawAudios.length > 0) {
        rawSettings.activeAudioId = rawAudios[0].id;
      }
      return {
        ...base,
        ...partial.mediaManager,
        settings: rawSettings,
        videos: rawVideos,
        audios: rawAudios,
        youtubeAudios: rawYouTubeAudios,
      };
    })(),
  };
  return saveCmsData(updated);
}
