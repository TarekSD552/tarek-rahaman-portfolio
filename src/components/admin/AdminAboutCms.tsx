"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Save,
  CheckCircle2,
  Sparkles,
  Camera,
  User,
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Eye,
  ArrowUp,
  ArrowDown,
  Layers,
  Zap,
  Quote,
  Target,
  Clock,
  TrendingUp,
  X,
  ChevronRight,
  ArrowLeft,
  Copy,
  Globe,
  Globe2,
  Users,
  Cpu,
  MapPin,
  Building,
  Download,
  Send,
  Check,
  Share2,
  Code2,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Search
} from "lucide-react";
import { useCms } from "@/context/CmsContext";
import { normalizeImageUrl } from "@/lib/image-utils";
import UniversalImageManager from "@/components/admin/UniversalImageManager";
import {
  EducationItem,
  CertificationItem,
  StatItem,
  HeroPhoto,
  AboutGalleryItem,
  AboutBioSection,
  AboutBioBadge,
  AboutHeroSettings,
  AboutHeroBadge,
  AboutHeroHeading,
  AboutHeroParagraph,
  AboutHeroTechBadge,
  AboutHeroStat,
  AboutHeroButton,
  AboutProfileCardSettings,
  AboutSectionVisibility,
  AboutStatsSectionSettings,
  FutureVision,
  AboutCta,
  ProcessStep,
  ServicesTechItem
} from "@/types/portfolio";

const AVAILABLE_BADGE_ICONS: { value: string; label: string }[] = [
  { value: "GraduationCap", label: "Graduation Cap" },
  { value: "Layers", label: "Layers / Tech Stack" },
  { value: "Award", label: "Award / Certification" },
  { value: "Briefcase", label: "Briefcase / Deployments" },
  { value: "ShieldCheck", label: "Shield / Security / Verified" },
  { value: "Code2", label: "Code / Software" },
  { value: "Cpu", label: "CPU / Data Science" },
  { value: "Zap", label: "Zap / Speed & Performance" },
  { value: "Target", label: "Target / Focus" },
  { value: "Sparkles", label: "Sparkles / Creative" },
  { value: "BookOpen", label: "Book / Education" },
  { value: "CheckCircle2", label: "Check / Verified" },
  { value: "Globe2", label: "Globe / Web" },
  { value: "Users", label: "Users / Collaboration" },
  { value: "Download", label: "Download / Resume" },
  { value: "Send", label: "Send / Connect" },
  { value: "MapPin", label: "MapPin / Location" },
  { value: "Building", label: "Building / Office" },
];

const BADGE_ICON_COMPONENTS: Record<string, any> = {
  GraduationCap,
  Layers,
  Award,
  Briefcase,
  ShieldCheck,
  Code2,
  Cpu,
  Zap,
  Target,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Globe2,
  Users,
  Download,
  Send,
  MapPin,
  Building,
  User,
};

function renderBadgeIcon(iconName?: string, className = "w-4 h-4") {
  const IconComp = (iconName && BADGE_ICON_COMPONENTS[iconName]) || Sparkles;
  return <IconComp className={className} />;
}

interface AdminAboutCmsProps {
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  openMediaPicker: (callback: (url: string) => void) => void;
  activeSubPage?: string;
  onSubPageChange?: (subPage: string) => void;
}

export type AboutSectionKey =
  | "overview"
  | "hero"
  | "profile"
  | "photos"
  | "process"
  | "tech"
  | "education"
  | "certifications"
  | "vision"
  | "cta"
  | "stats"
  | "seo";

export default function AdminAboutCms({
  showToast,
  openMediaPicker,
  activeSubPage: externalSubPage,
  onSubPageChange: externalSetSubPage
}: AdminAboutCmsProps) {
  const { cmsData, updateCms } = useCms();

  const [internalSubPage, setInternalSubPage] = useState<AboutSectionKey>("overview");
  const activeSubPage = (externalSubPage as AboutSectionKey) || internalSubPage;

  const setActiveSubPage = (page: AboutSectionKey) => {
    setInternalSubPage(page);
    if (externalSetSubPage) {
      externalSetSubPage(page);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  // Profile forms
  const [profileForm, setProfileForm] = useState({
    name: cmsData.profile?.name || "Tarek Rahaman",
    fullName: cmsData.profile?.fullName || "Md Tarek Rahaman",
    location: cmsData.profile?.location || "Mirpur-1, Dhaka, Bangladesh",
    titles: cmsData.profile?.titles?.join(", ") || "Full-Stack Web Developer, Laravel Developer, WordPress & WooCommerce Specialist",
    shortBio: cmsData.profile?.shortBio || "",
    fullBio: cmsData.profile?.fullBio || "",
    cvUrl: cmsData.profile?.cvUrl || "/assets/Tarek-Rahaman-Professional-CV-Resume.pdf"
  });

  // Hero photos state (the 3 cards in About Hero)
  const defaultHeroPhotos: HeroPhoto[] = [
    {
      id: "hero-card-1",
      src: "/assets/profile-1-scaled.png",
      alt: "Tarek Rahaman - Full-Stack Web Developer",
      label: "Workstation Lab",
      role: "Full-Stack Web Developer",
      description: "Tarek Rahaman at the development workstation building high-performance web systems.",
      rotation: "-5deg"
    },
    {
      id: "hero-card-2",
      src: "/uploads/1793719116653-Untitled_design.png",
      alt: "Tarek Rahaman - Creative Web Developer",
      label: "Tarek Rahaman",
      role: "Creative Web Developer",
      description: "Md Tarek Rahaman — Full-Stack Web Developer & WordPress/WooCommerce Specialist.",
      rotation: "0deg"
    },
    {
      id: "hero-card-3",
      src: "/assets/1786250627196.jpg.jpeg",
      alt: "Tarek Rahaman - NSDA National Skills Certificate",
      label: "NSDA Certified",
      role: "Govt. Level-3 Certification",
      description: "National Skills Certificate in Web Design and Development for Freelancing (Level-3).",
      rotation: "5deg"
    }
  ];

  const [heroPhotos, setHeroPhotos] = useState<HeroPhoto[]>(
    Array.isArray(cmsData.profile?.heroPhotos) && cmsData.profile.heroPhotos.length > 0
      ? cmsData.profile.heroPhotos
      : defaultHeroPhotos
  );

  // Main Hero / Profile Photo state (Primary Focal Portrait on Live About page)
  const defaultMainPortrait =
    cmsData.profile?.mainPortraitUrl ||
    cmsData.profile?.portraitUrl ||
    (Array.isArray(cmsData.profile?.heroPhotos) && cmsData.profile.heroPhotos[1]?.src) ||
    "/uploads/1793719116653-Untitled_design.png";

  const [mainPortraitUrl, setMainPortraitUrl] = useState<string>(defaultMainPortrait);
  const [mainPortraitAlt, setMainPortraitAlt] = useState<string>(
    (Array.isArray(cmsData.profile?.heroPhotos) && cmsData.profile.heroPhotos[1]?.alt) ||
    "Md Tarek Rahaman - Creative Web Developer"
  );
  const [mainPortraitTitle, setMainPortraitTitle] = useState<string>(
    (Array.isArray(cmsData.profile?.heroPhotos) && cmsData.profile.heroPhotos[1]?.role) ||
    "Creative Web Developer"
  );

  // Gallery photos state (Section 03: Milestone Gallery)
  const defaultGalleryPhotos: AboutGalleryItem[] = [
    {
      id: "about-gallery-1",
      src: "/assets/profile-1-scaled.png",
      alt: "Workstation Lab",
      label: "Workstation Lab",
      title: "Workstation Lab",
      description: "Development workstation lab for building high-performance web systems."
    },
    {
      id: "about-gallery-2",
      src: "/assets/1786250627196.jpg.jpeg",
      alt: "NSDA Govt. Certificate",
      label: "NSDA Certified",
      title: "NSDA Certified",
      description: "National Skills Certificate in Web Design and Development for Freelancing (Level-3)."
    },
    {
      id: "about-gallery-3",
      src: "/uploads/1793809308109-WhatsApp_Image_2026-11-04_at_9.40.30_PM.jpeg",
      alt: "Agile Team Collaboration",
      label: "Agile Sprints",
      title: "Agile Sprints",
      description: "Sprint planning and agile collaboration on high-impact projects."
    }
  ];

  const [galleryPhotos, setGalleryPhotos] = useState<AboutGalleryItem[]>(
    Array.isArray(cmsData.aboutGallery) && cmsData.aboutGallery.length > 0
      ? cmsData.aboutGallery
      : defaultGalleryPhotos
  );

  // Biography & Expertise Section state (Subpage 02: Biography Details)
  const defaultAboutBio: AboutBioSection = {
    badge: cmsData.aboutBio?.badge || "BIOGRAPHY & EXPERTISE",
    headingPrefix: cmsData.aboutBio?.headingPrefix || "Turning complex problems into ",
    highlightedText: cmsData.aboutBio?.highlightedText || "elegant, scalable",
    headingSuffix: cmsData.aboutBio?.headingSuffix || ", and revenue-generating digital products.",
    highlightStyle: cmsData.aboutBio?.highlightStyle || "cyan",
    firstParagraph:
      cmsData.aboutBio?.firstParagraph ||
      cmsData.profile?.fullBio ||
      cmsData.profile?.shortBio ||
      "Software Engineering undergraduate at Daffodil International University (Data Science Major), NSDA-certified web engineer, and specialist in custom WordPress, WooCommerce, and Laravel systems with over 200+ commercial deployments.",
    secondParagraph:
      cmsData.aboutBio?.secondParagraph ||
      "Over the course of 200+ commercial web deployments, I have honed deep expertise in custom theme and plugin engineering, WooCommerce sales architecture, Laravel backends, database query optimization, and technical speed enhancement.",
    badges: cmsData.aboutBio?.badges?.length
      ? cmsData.aboutBio.badges
      : [
          { id: "bio-badge-1", label: "DIU Software Eng.", icon: "GraduationCap" },
          { id: "bio-badge-2", label: "Data Science Major", icon: "Layers" },
          { id: "bio-badge-3", label: "NSDA Certified", icon: "Award" },
          { id: "bio-badge-4", label: "200+ Deployments", icon: "Briefcase" },
        ],
  };

  const [bioForm, setBioForm] = useState<AboutBioSection>(defaultAboutBio);

  const [educationList, setEducationList] = useState<EducationItem[]>([
    ...(cmsData.education || [])
  ]);

  const [certificationsList, setCertificationsList] = useState<CertificationItem[]>([
    ...(cmsData.certifications || [])
  ]);

  const [processStepsList, setProcessStepsList] = useState<ProcessStep[]>([
    ...(cmsData.processSteps || [])
  ]);

  const [techList, setTechList] = useState<ServicesTechItem[]>([
    ...(cmsData.aboutTechList || cmsData.servicesTechList || [])
  ]);

  const [processHeader, setProcessHeader] = useState({
    badge: (cmsData as any)?.aboutProcessHeader?.badge || "HOW I WORK",
    title: (cmsData as any)?.aboutProcessHeader?.title || "My Development",
    highlightText: (cmsData as any)?.aboutProcessHeader?.highlightText || "Process",
    description: (cmsData as any)?.aboutProcessHeader?.description || "A structured approach to turning ideas into high-quality digital experiences."
  });

  const [techHeader, setTechHeader] = useState({
    badge: (cmsData as any)?.aboutTechHeader?.badge || "TECH ARSENAL",
    title: (cmsData as any)?.aboutTechHeader?.title || "Technologies I",
    highlightText: (cmsData as any)?.aboutTechHeader?.highlightText || "Work With",
    description: (cmsData as any)?.aboutTechHeader?.description || "To build and scale generative & high-reliability systems."
  });

  // Future vision form
  const [visionForm, setVisionForm] = useState<FutureVision>(
    cmsData.futureVision || {
      badge: "FUTURE-READY ARCHITECTURE",
      heading: "Building for Tomorrow",
      subtitle: "Bridging Modern Web Development with Data Science & AI",
      description:
        "My vision is to bridge the gap between enterprise web engineering and practical machine learning applications. I am actively expanding my skillset in Python data pipelines and AI-assisted workflows while continuing to craft high-converting WordPress and Laravel solutions.",
      tags: ["Full-Stack Architecture", "Data Science Major", "Machine Learning", "Enterprise Web Apps", "AI Integration"],
      quote: "Software is not just code; it's the bridge between complex human problems and elegant digital experiences.",
      quoteAuthor: "Md Tarek Rahaman"
    }
  );

  // About CTA form
  const [ctaForm, setCtaForm] = useState<AboutCta>(
    cmsData.aboutCta || {
      badge: "READY TO COLLABORATE",
      title: "Have a Project in Mind?",
      subtitle: "Let's Collaborate",
      description: "Let's turn your ideas into a modern, high-performing digital experience.",
      primaryButtonText: "Start a Project",
      primaryButtonUrl: "/contact",
      secondaryButtonText: "Contact Me",
      secondaryButtonUrl: "/contact"
    }
  );

  // About Page SEO form
  const aboutPageObj = cmsData.pages?.find((p) => p.id === "about");
  const [seoForm, setSeoForm] = useState({
    title: aboutPageObj?.seoTitle || "About Tarek Rahaman | Full-Stack Web Developer",
    description: aboutPageObj?.seoDesc || "Learn more about Md Tarek Rahaman — Software Engineering student at DIU, Laravel & WordPress specialist.",
    keywords: aboutPageObj?.keywords || "Tarek Rahaman, About Tarek, Web Developer, Bangladesh",
    ogImage: aboutPageObj?.ogImage || "/assets/profile-1-scaled.png"
  });

  // 1. About Hero Section Settings (Subpage 01: Hero & Banner)
  const defaultAboutHero: AboutHeroSettings = {
    visible: cmsData.aboutHero?.visible !== false,
    orbitEffectsVisible: cmsData.aboutHero?.orbitEffectsVisible !== false,
    badge: {
      text: cmsData.aboutHero?.badge?.text || "ABOUT ME // ACADEMIC & ENGINEERING JOURNEY",
      icon: cmsData.aboutHero?.badge?.icon || "Sparkles",
      visible: cmsData.aboutHero?.badge?.visible !== false,
    },
    heading: {
      prefix: cmsData.aboutHero?.heading?.prefix || "Turning Ideas into ",
      highlight1: cmsData.aboutHero?.heading?.highlight1 || "Digital ",
      highlight2: cmsData.aboutHero?.heading?.highlight2 || "Experiences",
      suffix: cmsData.aboutHero?.heading?.suffix || "",
      highlightStyle: cmsData.aboutHero?.heading?.highlightStyle || "gradient",
    },
    paragraphs: cmsData.aboutHero?.paragraphs?.length
      ? cmsData.aboutHero.paragraphs
      : [
          {
            id: "hero-para-1",
            text: "Software Engineering undergraduate at Daffodil International University (Data Science Major), NSDA-certified web engineer, and specialist in custom WordPress, WooCommerce, and Laravel systems with over 200+ commercial deployments.",
            visible: true,
          },
        ],
    techBadges: cmsData.aboutHero?.techBadges?.length
      ? cmsData.aboutHero.techBadges
      : [
          { id: "tech-badge-1", label: "WordPress", icon: "Sparkles", visible: true },
          { id: "tech-badge-2", label: "WooCommerce", icon: "Sparkles", visible: true },
          { id: "tech-badge-3", label: "Laravel", icon: "Sparkles", visible: true },
          { id: "tech-badge-4", label: "Data Science", icon: "Sparkles", visible: true },
          { id: "tech-badge-5", label: "Full-Stack", icon: "Sparkles", visible: true },
        ],
    stats: cmsData.aboutHero?.stats?.length
      ? cmsData.aboutHero.stats
      : [
          { id: "hero-stat-1", value: "150", suffix: "+", label: "Happy Clients", icon: "User", visible: true },
          { id: "hero-stat-2", value: "200", suffix: "+", label: "Projects Completed", icon: "Layers", visible: true },
          { id: "hero-stat-3", value: "B.Sc. SWE", suffix: "", label: "DIU Data Science", icon: "GraduationCap", visible: true },
        ],
    buttons: cmsData.aboutHero?.buttons?.length
      ? cmsData.aboutHero.buttons
      : [
          {
            id: "hero-btn-1",
            text: "Download Resume (PDF)",
            url: "/assets/Tarek-Rahaman-Professional-CV-Resume.pdf",
            icon: "Download",
            isDownload: true,
            downloadName: "Tarek-Rahaman-CV.pdf",
            visible: true,
          },
          {
            id: "hero-btn-2",
            text: "Let's Connect",
            url: "/contact",
            icon: "Send",
            openInNewTab: false,
            visible: true,
          },
        ],
  };

  const [aboutHeroForm, setAboutHeroForm] = useState<AboutHeroSettings>(
    cmsData.aboutHero || defaultAboutHero
  );

  // 2. Profile Card Settings (Subpage 02: Detailed Bio Grid - Left Card)
  const defaultProfileCard: AboutProfileCardSettings = {
    visible: cmsData.aboutProfileCard?.visible !== false,
    imageUrl: cmsData.aboutProfileCard?.imageUrl || "/uploads/1793719116653-Untitled_design.png",
    altText: cmsData.aboutProfileCard?.altText || "Md Tarek Rahaman - Creative Web Developer",
    verifiedBadgeText: cmsData.aboutProfileCard?.verifiedBadgeText || "Verified",
    verifiedBadgeIcon: cmsData.aboutProfileCard?.verifiedBadgeIcon || "ShieldCheck",
    showVerifiedBadge: cmsData.aboutProfileCard?.showVerifiedBadge !== false,
    eyebrowText: cmsData.aboutProfileCard?.eyebrowText || "Md Tarek Rahaman",
    title: cmsData.aboutProfileCard?.title || "Full-Stack & WordPress Specialist",
    location: cmsData.aboutProfileCard?.location || "Mirpur-1, Dhaka, Bangladesh",
    locationIcon: cmsData.aboutProfileCard?.locationIcon || "MapPin",
  };

  const [profileCardForm, setProfileCardForm] = useState<AboutProfileCardSettings>(
    cmsData.aboutProfileCard || defaultProfileCard
  );

  // 3. Section Visibility Settings
  const defaultVisibility: AboutSectionVisibility = {
    hero: true,
    profileGrid: true,
    profileCard: true,
    gallery: true,
    bioStory: true,
    process: true,
    techStack: true,
    education: true,
    certifications: true,
    vision: true,
    cta: true,
    stats: true,
  };

  const [sectionsVisibility, setSectionsVisibility] = useState<AboutSectionVisibility>(
    cmsData.aboutSectionsVisibility || defaultVisibility
  );

  // 4. Milestones by Numbers (Statistics)
  const defaultStatsSection = {
    visible: cmsData.aboutStatsSection?.visible !== false,
    badge: cmsData.aboutStatsSection?.badge || "PROVEN TRACK RECORD",
    title: cmsData.aboutStatsSection?.title || "Milestones by the",
    highlightText: cmsData.aboutStatsSection?.highlightText || "Numbers",
    description: cmsData.aboutStatsSection?.description || "",
  };

  const [statsSectionForm, setStatsSectionForm] = useState(defaultStatsSection);
  const [statsList, setStatsList] = useState<StatItem[]>(
    cmsData.stats && cmsData.stats.length > 0 ? cmsData.stats : []
  );

  // Sync state with cmsData
  useEffect(() => {
    if (cmsData.profile) {
      setProfileForm({
        name: cmsData.profile.name || "Tarek Rahaman",
        fullName: cmsData.profile.fullName || "Md Tarek Rahaman",
        location: cmsData.profile.location || "Mirpur-1, Dhaka, Bangladesh",
        titles: cmsData.profile.titles?.join(", ") || "",
        shortBio: cmsData.profile.shortBio || "",
        fullBio: cmsData.profile.fullBio || "",
        cvUrl: cmsData.profile.cvUrl || ""
      });
      if (cmsData.profile.mainPortraitUrl || cmsData.profile.portraitUrl) {
        setMainPortraitUrl(cmsData.profile.mainPortraitUrl || cmsData.profile.portraitUrl || "");
      } else if (Array.isArray(cmsData.profile.heroPhotos) && cmsData.profile.heroPhotos[1]?.src) {
        setMainPortraitUrl(cmsData.profile.heroPhotos[1].src);
      }
      if (Array.isArray(cmsData.profile.heroPhotos) && cmsData.profile.heroPhotos.length > 0) {
        setHeroPhotos(cmsData.profile.heroPhotos);
        if (cmsData.profile.heroPhotos[1]?.alt) {
          setMainPortraitAlt(cmsData.profile.heroPhotos[1].alt);
        }
        if (cmsData.profile.heroPhotos[1]?.role) {
          setMainPortraitTitle(cmsData.profile.heroPhotos[1].role);
        }
      }
    }
    if (cmsData.aboutHero) {
      setAboutHeroForm({
        ...defaultAboutHero,
        ...cmsData.aboutHero,
        badge: { ...defaultAboutHero.badge, ...(cmsData.aboutHero.badge || {}) },
        heading: { ...defaultAboutHero.heading, ...(cmsData.aboutHero.heading || {}) },
        paragraphs: cmsData.aboutHero.paragraphs?.length ? cmsData.aboutHero.paragraphs : defaultAboutHero.paragraphs,
        techBadges: cmsData.aboutHero.techBadges?.length ? cmsData.aboutHero.techBadges : defaultAboutHero.techBadges,
        stats: cmsData.aboutHero.stats?.length ? cmsData.aboutHero.stats : defaultAboutHero.stats,
        buttons: cmsData.aboutHero.buttons?.length ? cmsData.aboutHero.buttons : defaultAboutHero.buttons,
      });
    }
    if (cmsData.aboutProfileCard) {
      setProfileCardForm({ ...defaultProfileCard, ...cmsData.aboutProfileCard });
    }
    if (cmsData.aboutSectionsVisibility) {
      setSectionsVisibility({ ...defaultVisibility, ...cmsData.aboutSectionsVisibility });
    }
    if (cmsData.aboutStatsSection) {
      setStatsSectionForm({ ...defaultStatsSection, ...cmsData.aboutStatsSection });
    }
    if (cmsData.stats && cmsData.stats.length > 0) {
      setStatsList([...cmsData.stats]);
    }
    if (cmsData.aboutBio) {
      setBioForm({
        badge: cmsData.aboutBio.badge || "BIOGRAPHY & EXPERTISE",
        headingPrefix: cmsData.aboutBio.headingPrefix || "Turning complex problems into ",
        highlightedText: cmsData.aboutBio.highlightedText || "elegant, scalable",
        headingSuffix: cmsData.aboutBio.headingSuffix || ", and revenue-generating digital products.",
        highlightStyle: cmsData.aboutBio.highlightStyle || "cyan",
        firstParagraph: cmsData.aboutBio.firstParagraph || "",
        secondParagraph: cmsData.aboutBio.secondParagraph || "",
        badges: cmsData.aboutBio.badges || []
      });
    }
    if (Array.isArray(cmsData.aboutGallery) && cmsData.aboutGallery.length > 0) {
      setGalleryPhotos(cmsData.aboutGallery);
    }
    if (cmsData.education) setEducationList([...cmsData.education]);
    if (cmsData.certifications) setCertificationsList([...cmsData.certifications]);
    if (cmsData.processSteps) setProcessStepsList([...cmsData.processSteps]);
    if (cmsData.aboutTechList || cmsData.servicesTechList) {
      setTechList([...(cmsData.aboutTechList || cmsData.servicesTechList || [])]);
    }
    if ((cmsData as any)?.aboutProcessHeader) {
      setProcessHeader({
        badge: (cmsData as any).aboutProcessHeader.badge || "HOW I WORK",
        title: (cmsData as any).aboutProcessHeader.title || "My Development",
        highlightText: (cmsData as any).aboutProcessHeader.highlightText || "Process",
        description: (cmsData as any).aboutProcessHeader.description || "A structured approach to turning ideas into high-quality digital experiences."
      });
    }
    if ((cmsData as any)?.aboutTechHeader) {
      setTechHeader({
        badge: (cmsData as any).aboutTechHeader.badge || "TECH ARSENAL",
        title: (cmsData as any).aboutTechHeader.title || "Technologies I",
        highlightText: (cmsData as any).aboutTechHeader.highlightText || "Work With",
        description: (cmsData as any).aboutTechHeader.description || "To build and scale generative & high-reliability systems."
      });
    }
    if (cmsData.futureVision) setVisionForm({ ...cmsData.futureVision });
    if (cmsData.aboutCta) setCtaForm({ ...cmsData.aboutCta });
  }, [cmsData]);

  // 11 Defined About Sections
  const aboutSections = [
    {
      id: "hero" as AboutSectionKey,
      number: "01",
      name: "Hero & Banner",
      subtitle: "Main Headline, Signals & 3D Rotating Stack",
      desc: "Manage the hero banner: top badge, headline builder, bio paragraphs, core tech badges, quick metrics, action buttons, and 3D card stack.",
      icon: Camera,
      anchor: "#hero",
      countText: `${aboutHeroForm.techBadges.length} Badges • ${aboutHeroForm.stats.length} Stats`
    },
    {
      id: "profile" as AboutSectionKey,
      number: "02",
      name: "Biography & Profile Card",
      subtitle: "Large Profile Card, Narrative & Specialty Badges",
      desc: "Manage the left large profile card (Verified badge, name, role, location) and right-side Biography & Expertise narrative and specialty badges.",
      icon: User,
      anchor: "#profile",
      countText: `${bioForm.badges.length} Badges`
    },
    {
      id: "photos" as AboutSectionKey,
      number: "03",
      name: "Profile Image Gallery",
      subtitle: "Milestone Gallery & Moment Photos",
      desc: "Manage secondary milestone photos displayed under the profile card (Workstation, NSDA Certificate, and Agile Collaboration).",
      icon: Sparkles,
      anchor: "#gallery",
      countText: `${galleryPhotos.length} Items`
    },
    {
      id: "process" as AboutSectionKey,
      number: "04",
      name: "Development Process",
      subtitle: "4-Phase Engineering Blueprint",
      desc: "Discover & Plan, Design & Develop, Test & Optimize, and Launch & Support phases.",
      icon: Zap,
      anchor: "#process",
      countText: `${processStepsList.length} Phases`
    },
    {
      id: "tech" as AboutSectionKey,
      number: "05",
      name: "Technologies I Work With",
      subtitle: "Tech Stack & Engineering Tools",
      desc: "Full-stack languages, CMS systems, databases, frameworks, and UI engineering tools.",
      icon: Layers,
      anchor: "#tech",
      countText: `${techList.length} Technologies`
    },
    {
      id: "education" as AboutSectionKey,
      number: "06",
      name: "Educational Journey",
      subtitle: "Academic Degrees & Institutions",
      desc: "Degree programs, major subjects, institutions (Daffodil International University), and graduation dates.",
      icon: GraduationCap,
      anchor: "#education",
      countText: `${educationList.length} Degrees`
    },
    {
      id: "certifications" as AboutSectionKey,
      number: "07",
      name: "Verified Certifications",
      subtitle: "Govt. & Industry Credentials",
      desc: "NSDA Govt. Level-3 Certificate, organizations, credential URLs, and verification badges.",
      icon: Award,
      anchor: "#certifications",
      countText: `${certificationsList.length} Certificates`
    },
    {
      id: "vision" as AboutSectionKey,
      number: "08",
      name: "Future Vision & Goals",
      subtitle: "Data Science & AI Vision",
      desc: "Future roadmap statement, machine learning goals, personal philosophy quote, and tags.",
      icon: Target,
      anchor: "#vision",
      countText: "Vision Goals"
    },
    {
      id: "cta" as AboutSectionKey,
      number: "09",
      name: "Final CTA",
      subtitle: "Collaboration & Contact Trigger",
      desc: "Ready to Collaborate banner with heading, description, and direct contact buttons.",
      icon: BookOpen,
      anchor: "#cta",
      countText: "CTA Banner"
    },
    {
      id: "stats" as AboutSectionKey,
      number: "10",
      name: "Milestones by Numbers",
      subtitle: "Proven Track Record & Statistics",
      desc: "Manage the bottom 4 statistics cards (Happy Clients, Projects Completed, Years Experience, Full-Stack Deployments).",
      icon: TrendingUp,
      anchor: "#stats",
      countText: `${statsList.length} Metrics`
    },
    {
      id: "seo" as AboutSectionKey,
      number: "11",
      name: "Page SEO & Meta",
      subtitle: "Search Engine Optimization",
      desc: "SEO Title, meta description, keywords, and Open Graph social sharing preview image.",
      icon: Globe,
      anchor: "",
      countText: "SEO Meta"
    }
  ];

  // Save Handlers
  const handleSaveHeroSection = async () => {
    setIsSaving(true);
    try {
      const titlesArray = profileForm.titles.split(",").map((t) => t.trim()).filter(Boolean);
      const updatedProfile = {
        ...cmsData.profile,
        mainPortraitUrl,
        portraitUrl: mainPortraitUrl,
        heroPhotos,
        titles: titlesArray
      };
      const success = await updateCms({
        aboutHero: aboutHeroForm,
        profile: updatedProfile
      });
      if (success) {
        showToast("Hero Section, Headings, Badges, Stats & Buttons saved successfully!");
      } else {
        showToast("Failed to save Hero section", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSectionsVisibility = async (customVis?: AboutSectionVisibility) => {
    setIsSaving(true);
    try {
      const visToSave = customVis || sectionsVisibility;
      const success = await updateCms({ aboutSectionsVisibility: visToSave });
      if (success) {
        showToast("Section visibility preferences saved!");
      } else {
        showToast("Failed to save section visibility", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfileCardAndBio = async () => {
    setIsSaving(true);
    try {
      const titlesArray = profileForm.titles.split(",").map((t) => t.trim()).filter(Boolean);
      const updatedProfile = {
        ...cmsData.profile,
        ...profileForm,
        titles: titlesArray,
        mainPortraitUrl: profileCardForm.imageUrl || mainPortraitUrl,
        portraitUrl: profileCardForm.imageUrl || mainPortraitUrl,
        heroPhotos
      };
      const success = await updateCms({
        aboutBio: bioForm,
        aboutProfileCard: profileCardForm,
        profile: updatedProfile
      });
      if (success) {
        showToast("Large Profile Card & Biography details saved successfully!");
      } else {
        showToast("Failed to save biography details", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveStatsSection = async () => {
    setIsSaving(true);
    try {
      const success = await updateCms({
        aboutStatsSection: statsSectionForm,
        stats: statsList
      });
      if (success) {
        showToast("Milestones by Numbers saved successfully!");
      } else {
        showToast("Failed to save milestones statistics", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHeroPhotos = async (customPhotos?: HeroPhoto[], customMainPortrait?: string) => {
    setIsSaving(true);
    try {
      const photosToSave = customPhotos || heroPhotos;
      const portraitToSave = customMainPortrait !== undefined ? customMainPortrait : mainPortraitUrl;

      // Keep heroPhotos[1] in sync with mainPortraitUrl if card 2 exists
      const syncedPhotos = photosToSave.map((p, idx) => {
        if (idx === 1 && portraitToSave) {
          return {
            ...p,
            src: portraitToSave,
            alt: mainPortraitAlt || p.alt,
            role: mainPortraitTitle || p.role
          };
        }
        return p;
      });

      const updatedProfile = {
        ...cmsData.profile,
        mainPortraitUrl: portraitToSave,
        portraitUrl: portraitToSave,
        heroPhotos: syncedPhotos
      };

      setHeroPhotos(syncedPhotos);

      const success = await updateCms({ profile: updatedProfile });
      if (success) {
        showToast("Main Profile Photo & Hero 3D Cards saved successfully!");
      } else {
        showToast("Failed to save Hero cards", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveGallery = async (customGallery?: AboutGalleryItem[]) => {
    setIsSaving(true);
    try {
      const galleryToSave = customGallery || galleryPhotos;
      const success = await updateCms({ aboutGallery: galleryToSave });
      if (success) {
        showToast("Profile Image Gallery saved successfully!");
      } else {
        showToast("Failed to save gallery photos", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const titlesArray = profileForm.titles.split(",").map((t) => t.trim()).filter(Boolean);
      const updatedProfile = {
        ...cmsData.profile,
        ...profileForm,
        titles: titlesArray,
        mainPortraitUrl,
        portraitUrl: mainPortraitUrl,
        heroPhotos
      };
      const success = await updateCms({ profile: updatedProfile });
      if (success) {
        showToast("Profile information and photos saved successfully!");
      } else {
        showToast("Failed to save profile", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBioDetails = async () => {
    setIsSaving(true);
    try {
      const titlesArray = profileForm.titles.split(",").map((t) => t.trim()).filter(Boolean);
      const updatedProfile = {
        ...cmsData.profile,
        ...profileForm,
        titles: titlesArray,
        mainPortraitUrl,
        portraitUrl: mainPortraitUrl,
        heroPhotos
      };
      const success = await updateCms({
        aboutBio: bioForm,
        profile: updatedProfile
      });
      if (success) {
        showToast("Biography details & narrative saved successfully!");
      } else {
        showToast("Failed to save biography details", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEducation = async () => {
    setIsSaving(true);
    try {
      const success = await updateCms({ education: educationList });
      if (success) {
        showToast("Educational journey updated successfully!");
      } else {
        showToast("Failed to save education", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCertifications = async () => {
    setIsSaving(true);
    try {
      const success = await updateCms({ certifications: certificationsList });
      if (success) {
        showToast("Verified certifications saved successfully!");
      } else {
        showToast("Failed to save certifications", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProcess = async () => {
    setIsSaving(true);
    try {
      const success = await updateCms({
        processSteps: processStepsList,
        aboutProcessHeader: processHeader
      });
      if (success) {
        showToast("Development process steps & header saved successfully!");
      } else {
        showToast("Failed to save process steps", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTech = async () => {
    setIsSaving(true);
    try {
      const success = await updateCms({
        aboutTechList: techList,
        servicesTechList: techList,
        aboutTechHeader: techHeader
      });
      if (success) {
        showToast("Technologies I Work With & header updated successfully!");
      } else {
        showToast("Failed to save technologies", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveVision = async () => {
    setIsSaving(true);
    try {
      const success = await updateCms({ futureVision: visionForm });
      if (success) {
        showToast("Future Vision & Goals updated successfully!");
      } else {
        showToast("Failed to save Future Vision", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCta = async () => {
    setIsSaving(true);
    try {
      const success = await updateCms({ aboutCta: ctaForm });
      if (success) {
        showToast("About CTA banner saved successfully!");
      } else {
        showToast("Failed to save CTA banner", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSeo = async () => {
    setIsSaving(true);
    try {
      const updatedPages = (cmsData.pages || []).map((p) =>
        p.id === "about"
          ? {
              ...p,
              seoTitle: seoForm.title,
              seoDesc: seoForm.description,
              keywords: seoForm.keywords,
              ogImage: seoForm.ogImage
            }
          : p
      );
      const success = await updateCms({ pages: updatedPages });
      if (success) {
        showToast("About Page SEO metadata saved successfully!");
      } else {
        showToast("Failed to save SEO metadata", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const renderSubPageHeader = (
    sectionId: AboutSectionKey,
    title: string,
    description: string,
    anchor: string,
    onSave: () => Promise<void>,
    saveLabel: string = "Save Changes"
  ) => {
    return (
      <div className="space-y-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 px-4 rounded-xl bg-[#060c1c]/90 border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveSubPage("overview")}
              className="inline-flex items-center gap-1.5 font-bold text-[#00d2ff] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>About Hub</span>
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 font-semibold">{title}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/about${anchor}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#07132a] hover:bg-[#00d2ff]/15 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] hover:text-white transition-all shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live Section</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#081026] via-[#0a1533] to-[#070e22] border border-[#00d2ff]/25 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00d2ff]">
                Live Status: Visible on /about
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">{description}</p>
          </div>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] via-[#00a3ff] to-[#0072ff] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_28px_rgba(0,210,255,0.7)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? "Saving..." : saveLabel}</span>
          </button>
        </div>
      </div>
    );
  };

  // =========================================================================
  // VIEW: ABOUT OVERVIEW HUB
  // =========================================================================
  if (activeSubPage === "overview") {
    const getIsSectionVisible = (id: AboutSectionKey): boolean => {
      switch (id) {
        case "hero":
          return sectionsVisibility.hero !== false;
        case "profile":
          return sectionsVisibility.profileGrid !== false;
        case "photos":
          return sectionsVisibility.gallery !== false;
        case "process":
          return sectionsVisibility.process !== false;
        case "tech":
          return sectionsVisibility.techStack !== false;
        case "education":
          return sectionsVisibility.education !== false;
        case "certifications":
          return sectionsVisibility.certifications !== false;
        case "vision":
          return sectionsVisibility.vision !== false;
        case "cta":
          return sectionsVisibility.cta !== false;
        case "stats":
          return sectionsVisibility.stats !== false;
        default:
          return true;
      }
    };

    const toggleSectionVisibility = (id: AboutSectionKey) => {
      let key: keyof AboutSectionVisibility | null = null;
      if (id === "hero") key = "hero";
      else if (id === "profile") key = "profileGrid";
      else if (id === "photos") key = "gallery";
      else if (id === "process") key = "process";
      else if (id === "tech") key = "techStack";
      else if (id === "education") key = "education";
      else if (id === "certifications") key = "certifications";
      else if (id === "vision") key = "vision";
      else if (id === "cta") key = "cta";
      else if (id === "stats") key = "stats";

      if (key) {
        const nextVal = sectionsVisibility[key] === false ? true : false;
        const updated = { ...sectionsVisibility, [key]: nextVal };
        setSectionsVisibility(updated);
        handleSaveSectionsVisibility(updated);
      }
    };

    return (
      <div className="space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#070e24] via-[#09173d] to-[#060c1e] border border-[#00d2ff]/30 shadow-[0_0_35px_rgba(0,210,255,0.12)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/15 border border-[#00d2ff]/30 text-[11px] font-mono font-bold uppercase text-[#00d2ff]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>About &amp; Profile CMS // 11 Sub-Pages</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                About &amp; Profile Management Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Complete A-to-Z dynamic control over all 11 sections of the Live About Page. Every single headline, badge, paragraph, photo, credential, metric, and button is individually manageable with persistent live sync.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleSaveSectionsVisibility()}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] via-[#00a3ff] to-[#0072ff] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_28px_rgba(0,210,255,0.7)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Visibility</span>
              </button>

              <Link
                href="/about"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#081228] hover:bg-[#00d2ff]/15 border border-[#00d2ff]/30 hover:border-[#00d2ff] text-xs font-bold text-[#00d2ff] hover:text-white transition-all shadow-[0_0_15px_rgba(0,210,255,0.15)]"
              >
                <Eye className="w-4 h-4" />
                <span>View Live /about</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {aboutSections.map((sec) => {
            const Icon = sec.icon;
            const isVisible = getIsSectionVisible(sec.id);
            const isSeo = sec.id === "seo";

            return (
              <div
                key={sec.id}
                className={`p-5 rounded-2xl bg-[#070d1e]/90 hover:bg-[#091228] border transition-all duration-200 shadow-md flex flex-col justify-between group relative overflow-hidden ${
                  isVisible ? "border-white/10 hover:border-[#00d2ff]/50" : "border-rose-500/20 opacity-70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] group-hover:scale-105 group-hover:bg-[#00d2ff]/20 transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-black text-[#00d2ff] uppercase">
                          SECTION #{sec.number}
                        </span>
                        <div className="text-[11px] font-bold text-slate-400 font-mono">
                          {sec.countText}
                        </div>
                      </div>
                    </div>

                    {!isSeo ? (
                      <button
                        type="button"
                        onClick={() => toggleSectionVisibility(sec.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          isVisible
                            ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60"
                            : "bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60"
                        }`}
                        title={isVisible ? "Click to Hide Section" : "Click to Show Section"}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isVisible ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                          }`}
                        />
                        <span>{isVisible ? "VISIBLE" : "HIDDEN"}</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff]">
                        <span>ACTIVE</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mb-4">
                    <h3 className="text-base font-bold text-white group-hover:text-[#00d2ff] transition-colors">
                      {sec.name}
                    </h3>
                    <p className="text-[11px] font-mono text-[#00d2ff]/80">
                      {sec.subtitle}
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed pt-1">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                  {sec.anchor ? (
                    <Link
                      href={`/about${sec.anchor}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="View anchor on /about"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  ) : <div />}

                  <button
                    type="button"
                    onClick={() => setActiveSubPage(sec.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00d2ff]/15 to-[#0088ff]/15 hover:from-[#00d2ff] hover:to-[#0088ff] text-[#00d2ff] hover:text-[#050811] border border-[#00d2ff]/30 text-xs font-bold transition-all cursor-pointer group-hover:shadow-[0_0_15px_rgba(0,210,255,0.3)]"
                  >
                    <span>Manage Section</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 1: ABOUT HERO & 3D CARDS
  // =========================================================================
  if (activeSubPage === "hero") {
    return (
      <div className="space-y-8">
        {renderSubPageHeader(
          "hero",
          "About Hero Section & Banner",
          "Manage the live About Hero banner: headline builder with live glow preview, top badge, narrative paragraphs, tech badges, quick metrics, action buttons, and 3D card stack.",
          "#hero",
          () => handleSaveHeroSection(),
          "Save Hero Section"
        )}

        {/* ------------------------------------------------------------- */}
        {/* MASTER CARD 1: HERO CONTENT, HEADLINE BUILDER & SIGNALS        */}
        {/* ------------------------------------------------------------- */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#08122d] via-[#09183d] to-[#060c20] border-2 border-[#00d2ff]/40 shadow-[0_0_35px_rgba(0,210,255,0.18)] space-y-7 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/15 border border-[#00d2ff]/35 text-[11px] font-mono font-bold uppercase tracking-wider text-[#00d2ff]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Section 01 // Headline & Key Signals</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Hero Banner Content &amp; Signaling
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Control every word, badge, metric, and button rendered on the right column of the About Hero banner.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setAboutHeroForm({
                    ...aboutHeroForm,
                    visible: aboutHeroForm.visible === false ? true : false,
                  })
                }
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  aboutHeroForm.visible !== false
                    ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                    : "bg-rose-950/70 border border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    aboutHeroForm.visible !== false ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                  }`}
                />
                <span>{aboutHeroForm.visible !== false ? "HERO: VISIBLE" : "HERO: HIDDEN"}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setAboutHeroForm({
                    ...aboutHeroForm,
                    orbitEffectsVisible: aboutHeroForm.orbitEffectsVisible === false ? true : false,
                  })
                }
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  aboutHeroForm.orbitEffectsVisible !== false
                    ? "bg-[#00d2ff]/15 border border-[#00d2ff]/40 text-[#00d2ff]"
                    : "bg-white/5 border border-white/10 text-slate-400"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{aboutHeroForm.orbitEffectsVisible !== false ? "3D ORBIT ON" : "3D ORBIT OFF"}</span>
              </button>
            </div>
          </div>

          {/* 1.1 Top Badge */}
          <div className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d2ff] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hero Top Badge</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  setAboutHeroForm({
                    ...aboutHeroForm,
                    badge: {
                      ...aboutHeroForm.badge,
                      visible: aboutHeroForm.badge?.visible === false ? true : false,
                    },
                  })
                }
                className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-all ${
                  aboutHeroForm.badge?.visible !== false
                    ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-300"
                    : "bg-white/5 border-white/10 text-slate-400"
                }`}
              >
                {aboutHeroForm.badge?.visible !== false ? "Badge Visible" : "Badge Hidden"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8">
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={aboutHeroForm.badge?.text || ""}
                  onChange={(e) =>
                    setAboutHeroForm({
                      ...aboutHeroForm,
                      badge: { ...aboutHeroForm.badge, text: e.target.value },
                    })
                  }
                  placeholder="e.g. ABOUT ME // ACADEMIC & ENGINEERING JOURNEY"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1e] border border-white/10 text-xs sm:text-sm text-white outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Badge Icon
                </label>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#080e1e] border border-white/10 flex items-center justify-center text-[#00d2ff] shrink-0">
                    {renderBadgeIcon(aboutHeroForm.badge?.icon, "w-4 h-4")}
                  </div>
                  <select
                    value={aboutHeroForm.badge?.icon || "Sparkles"}
                    onChange={(e) =>
                      setAboutHeroForm({
                        ...aboutHeroForm,
                        badge: { ...aboutHeroForm.badge, icon: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                  >
                    {AVAILABLE_BADGE_ICONS.map((ic) => (
                      <option key={ic.value} value={ic.value}>
                        {ic.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 1.2 3-Part Main Heading Builder with Live Preview */}
          <div className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d2ff] flex items-center gap-2">
                <Edit3 className="w-3.5 h-3.5" />
                <span>3-Part Main Headline Builder</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Prefix + Highlight 1 (Cyan) + Highlight 2 (Style) + Suffix
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Prefix Text (White)
                </label>
                <input
                  type="text"
                  value={aboutHeroForm.heading?.prefix || ""}
                  onChange={(e) =>
                    setAboutHeroForm({
                      ...aboutHeroForm,
                      heading: { ...aboutHeroForm.heading, prefix: e.target.value },
                    })
                  }
                  placeholder="e.g. Turning Ideas into "
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1 text-[#00f0ff]">
                  Highlight 1 (Cyan Glow)
                </label>
                <input
                  type="text"
                  value={aboutHeroForm.heading?.highlight1 || ""}
                  onChange={(e) =>
                    setAboutHeroForm({
                      ...aboutHeroForm,
                      heading: { ...aboutHeroForm.heading, highlight1: e.target.value },
                    })
                  }
                  placeholder="e.g. Digital "
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-[#00d2ff]/30 text-xs text-[#00f0ff] outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1 text-purple-300">
                  Highlight 2 (Styled Word)
                </label>
                <input
                  type="text"
                  value={aboutHeroForm.heading?.highlight2 || ""}
                  onChange={(e) =>
                    setAboutHeroForm({
                      ...aboutHeroForm,
                      heading: { ...aboutHeroForm.heading, highlight2: e.target.value },
                    })
                  }
                  placeholder="e.g. Experiences"
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-purple-500/30 text-xs text-purple-200 outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                  Highlight 2 Style
                </label>
                <select
                  value={aboutHeroForm.heading?.highlightStyle || "gradient"}
                  onChange={(e) =>
                    setAboutHeroForm({
                      ...aboutHeroForm,
                      heading: { ...aboutHeroForm.heading, highlightStyle: e.target.value as any },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                >
                  <option value="gradient">Purple to Pink Gradient</option>
                  <option value="cyan">Electric Cyan Glow</option>
                  <option value="emerald">Emerald Green Glow</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Optional Heading Suffix
              </label>
              <input
                type="text"
                value={aboutHeroForm.heading?.suffix || ""}
                onChange={(e) =>
                  setAboutHeroForm({
                    ...aboutHeroForm,
                    heading: { ...aboutHeroForm.heading, suffix: e.target.value },
                  })
                }
                placeholder="Optional text following the highlight"
                className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            {/* Live Glow Preview Box */}
            <div className="p-4 rounded-xl bg-[#02050c] border border-[#00d2ff]/20 space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
                Live Headline Rendering Preview
              </span>
              <div className="text-xl sm:text-2xl font-black text-white leading-tight">
                <span>{aboutHeroForm.heading?.prefix}</span>
                <span className="text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]">
                  {aboutHeroForm.heading?.highlight1}
                </span>
                {aboutHeroForm.heading?.highlight2 && (
                  <span
                    className={
                      aboutHeroForm.heading?.highlightStyle === "cyan"
                        ? "text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]"
                        : aboutHeroForm.heading?.highlightStyle === "emerald"
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-[#34d399] to-[#059669] drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                        : "text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#ec4899] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                    }
                  >
                    {aboutHeroForm.heading?.highlight2}
                  </span>
                )}
                <span>{aboutHeroForm.heading?.suffix}</span>
              </div>
            </div>
          </div>

          {/* 1.3 Hero Paragraphs Manager */}
          <div className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d2ff] flex items-center gap-2">
                <Quote className="w-3.5 h-3.5" />
                <span>Hero Narrative Paragraphs ({aboutHeroForm.paragraphs.length})</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const newPara: AboutHeroParagraph = {
                    id: `hero-para-${Date.now()}`,
                    text: "Software Engineering student and commercial web developer crafting enterprise-grade digital systems.",
                    visible: true,
                  };
                  setAboutHeroForm({
                    ...aboutHeroForm,
                    paragraphs: [...aboutHeroForm.paragraphs, newPara],
                  });
                  showToast("Added new hero paragraph");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Paragraph</span>
              </button>
            </div>

            <div className="space-y-3">
              {aboutHeroForm.paragraphs.map((para, idx) => (
                <div
                  key={para.id || idx}
                  className="p-4 rounded-xl bg-[#080e1e] border border-white/10 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      Paragraph #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...aboutHeroForm.paragraphs];
                          updated[idx] = { ...updated[idx], visible: updated[idx].visible === false ? true : false };
                          setAboutHeroForm({ ...aboutHeroForm, paragraphs: updated });
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all ${
                          para.visible !== false
                            ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                            : "bg-white/5 border-white/10 text-slate-400"
                        }`}
                      >
                        {para.visible !== false ? "Visible" : "Hidden"}
                      </button>

                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = [...aboutHeroForm.paragraphs];
                          const temp = updated[idx - 1];
                          updated[idx - 1] = updated[idx];
                          updated[idx] = temp;
                          setAboutHeroForm({ ...aboutHeroForm, paragraphs: updated });
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        disabled={idx === aboutHeroForm.paragraphs.length - 1}
                        onClick={() => {
                          const updated = [...aboutHeroForm.paragraphs];
                          const temp = updated[idx + 1];
                          updated[idx + 1] = updated[idx];
                          updated[idx] = temp;
                          setAboutHeroForm({ ...aboutHeroForm, paragraphs: updated });
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (aboutHeroForm.paragraphs.length <= 1) {
                            showToast("Must have at least one paragraph", "error");
                            return;
                          }
                          const updated = aboutHeroForm.paragraphs.filter((_, i) => i !== idx);
                          setAboutHeroForm({ ...aboutHeroForm, paragraphs: updated });
                          showToast(`Removed paragraph #${idx + 1}`);
                        }}
                        className="p-1 rounded text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                        title="Delete Paragraph"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={para.text}
                    onChange={(e) => {
                      const updated = [...aboutHeroForm.paragraphs];
                      updated[idx] = { ...updated[idx], text: e.target.value };
                      setAboutHeroForm({ ...aboutHeroForm, paragraphs: updated });
                    }}
                    placeholder="Enter hero paragraph content..."
                    className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs sm:text-sm text-slate-200 outline-none focus:border-[#00d2ff]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 1.4 Core Tech Badges Manager */}
          <div className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d2ff] flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Core Tech Badges Row ({aboutHeroForm.techBadges.length})</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const newBadge: AboutHeroTechBadge = {
                    id: `tech-badge-${Date.now()}`,
                    label: "New Tech",
                    icon: "Sparkles",
                    visible: true,
                  };
                  setAboutHeroForm({
                    ...aboutHeroForm,
                    techBadges: [...aboutHeroForm.techBadges, newBadge],
                  });
                  showToast("Added tech badge");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Tech Badge</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {aboutHeroForm.techBadges.map((badge, idx) => (
                <div
                  key={badge.id || idx}
                  className="p-3.5 rounded-xl bg-[#080e1e] border border-white/10 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        Badge #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...aboutHeroForm.techBadges];
                          updated[idx] = { ...updated[idx], visible: updated[idx].visible === false ? true : false };
                          setAboutHeroForm({ ...aboutHeroForm, techBadges: updated });
                        }}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono border transition-all ${
                          badge.visible !== false
                            ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                            : "bg-white/5 border-white/10 text-slate-400"
                        }`}
                      >
                        {badge.visible !== false ? "Visible" : "Hidden"}
                      </button>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                        Badge Label
                      </label>
                      <input
                        type="text"
                        value={badge.label}
                        onChange={(e) => {
                          const updated = [...aboutHeroForm.techBadges];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setAboutHeroForm({ ...aboutHeroForm, techBadges: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                        placeholder="e.g. WordPress, Laravel"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                        Icon
                      </label>
                      <select
                        value={badge.icon || "Sparkles"}
                        onChange={(e) => {
                          const updated = [...aboutHeroForm.techBadges];
                          updated[idx] = { ...updated[idx], icon: e.target.value };
                          setAboutHeroForm({ ...aboutHeroForm, techBadges: updated });
                        }}
                        className="w-full px-2 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                      >
                        {AVAILABLE_BADGE_ICONS.map((ic) => (
                          <option key={ic.value} value={ic.value}>
                            {ic.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                        Optional Link URL
                      </label>
                      <input
                        type="text"
                        value={badge.link || ""}
                        onChange={(e) => {
                          const updated = [...aboutHeroForm.techBadges];
                          updated[idx] = { ...updated[idx], link: e.target.value };
                          setAboutHeroForm({ ...aboutHeroForm, techBadges: updated });
                        }}
                        placeholder="https://... or empty"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = [...aboutHeroForm.techBadges];
                          const temp = updated[idx - 1];
                          updated[idx - 1] = updated[idx];
                          updated[idx] = temp;
                          setAboutHeroForm({ ...aboutHeroForm, techBadges: updated });
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Left"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === aboutHeroForm.techBadges.length - 1}
                        onClick={() => {
                          const updated = [...aboutHeroForm.techBadges];
                          const temp = updated[idx + 1];
                          updated[idx + 1] = updated[idx];
                          updated[idx] = temp;
                          setAboutHeroForm({ ...aboutHeroForm, techBadges: updated });
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Right"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const dup = { ...badge, id: `tech-badge-${Date.now()}`, label: `${badge.label} (Copy)` };
                          const updated = [...aboutHeroForm.techBadges];
                          updated.splice(idx + 1, 0, dup);
                          setAboutHeroForm({ ...aboutHeroForm, techBadges: updated });
                          showToast(`Duplicated ${badge.label}`);
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = aboutHeroForm.techBadges.filter((_, i) => i !== idx);
                        setAboutHeroForm({ ...aboutHeroForm, techBadges: updated });
                        showToast(`Removed badge`);
                      }}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                      title="Delete Badge"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 1.5 Quick Statistics Row Manager */}
          <div className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d2ff] flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Quick Statistics Row ({aboutHeroForm.stats.length})</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const newStat: AboutHeroStat = {
                    id: `hero-stat-${Date.now()}`,
                    value: "100",
                    suffix: "+",
                    label: "Metric Label",
                    icon: "Sparkles",
                    visible: true,
                  };
                  setAboutHeroForm({
                    ...aboutHeroForm,
                    stats: [...aboutHeroForm.stats, newStat],
                  });
                  showToast("Added quick statistic");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Metric</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {aboutHeroForm.stats.map((stat, idx) => (
                <div
                  key={stat.id || idx}
                  className="p-4 rounded-xl bg-[#080e1e] border border-white/10 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        Metric #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...aboutHeroForm.stats];
                          updated[idx] = { ...updated[idx], visible: updated[idx].visible === false ? true : false };
                          setAboutHeroForm({ ...aboutHeroForm, stats: updated });
                        }}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono border transition-all ${
                          stat.visible !== false
                            ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                            : "bg-white/5 border-white/10 text-slate-400"
                        }`}
                      >
                        {stat.visible !== false ? "Visible" : "Hidden"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                          Value
                        </label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const updated = [...aboutHeroForm.stats];
                            updated[idx] = { ...updated[idx], value: e.target.value };
                            setAboutHeroForm({ ...aboutHeroForm, stats: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs font-bold text-white outline-none focus:border-[#00d2ff]"
                          placeholder="e.g. 150"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                          Suffix
                        </label>
                        <input
                          type="text"
                          value={stat.suffix || ""}
                          onChange={(e) => {
                            const updated = [...aboutHeroForm.stats];
                            updated[idx] = { ...updated[idx], suffix: e.target.value };
                            setAboutHeroForm({ ...aboutHeroForm, stats: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                          placeholder="e.g. +"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                        Label
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...aboutHeroForm.stats];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setAboutHeroForm({ ...aboutHeroForm, stats: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                        placeholder="e.g. Happy Clients"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                        Icon
                      </label>
                      <select
                        value={stat.icon || "User"}
                        onChange={(e) => {
                          const updated = [...aboutHeroForm.stats];
                          updated[idx] = { ...updated[idx], icon: e.target.value };
                          setAboutHeroForm({ ...aboutHeroForm, stats: updated });
                        }}
                        className="w-full px-2 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                      >
                        {AVAILABLE_BADGE_ICONS.map((ic) => (
                          <option key={ic.value} value={ic.value}>
                            {ic.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = [...aboutHeroForm.stats];
                          const temp = updated[idx - 1];
                          updated[idx - 1] = updated[idx];
                          updated[idx] = temp;
                          setAboutHeroForm({ ...aboutHeroForm, stats: updated });
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Left"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === aboutHeroForm.stats.length - 1}
                        onClick={() => {
                          const updated = [...aboutHeroForm.stats];
                          const temp = updated[idx + 1];
                          updated[idx + 1] = updated[idx];
                          updated[idx] = temp;
                          setAboutHeroForm({ ...aboutHeroForm, stats: updated });
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Right"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const dup = { ...stat, id: `hero-stat-${Date.now()}` };
                          const updated = [...aboutHeroForm.stats];
                          updated.splice(idx + 1, 0, dup);
                          setAboutHeroForm({ ...aboutHeroForm, stats: updated });
                          showToast(`Duplicated stat`);
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = aboutHeroForm.stats.filter((_, i) => i !== idx);
                        setAboutHeroForm({ ...aboutHeroForm, stats: updated });
                        showToast("Removed statistic");
                      }}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 1.6 Action Buttons Manager */}
          <div className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d2ff] flex items-center gap-2">
                <Send className="w-3.5 h-3.5" />
                <span>Action Buttons ({aboutHeroForm.buttons.length})</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const newBtn: AboutHeroButton = {
                    id: `hero-btn-${Date.now()}`,
                    text: "New Button",
                    url: "/contact",
                    icon: "Send",
                    visible: true,
                  };
                  setAboutHeroForm({
                    ...aboutHeroForm,
                    buttons: [...aboutHeroForm.buttons, newBtn],
                  });
                  showToast("Added button");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Button</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aboutHeroForm.buttons.map((btn, idx) => (
                <div
                  key={btn.id || idx}
                  className="p-4 rounded-xl bg-[#080e1e] border border-white/10 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        Button #{idx + 1} {idx === 0 ? "(Primary Neon Style)" : "(Secondary Dark Style)"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...aboutHeroForm.buttons];
                          updated[idx] = { ...updated[idx], visible: updated[idx].visible === false ? true : false };
                          setAboutHeroForm({ ...aboutHeroForm, buttons: updated });
                        }}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono border transition-all ${
                          btn.visible !== false
                            ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                            : "bg-white/5 border-white/10 text-slate-400"
                        }`}
                      >
                        {btn.visible !== false ? "Visible" : "Hidden"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={btn.text}
                          onChange={(e) => {
                            const updated = [...aboutHeroForm.buttons];
                            updated[idx] = { ...updated[idx], text: e.target.value };
                            setAboutHeroForm({ ...aboutHeroForm, buttons: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs font-bold text-white outline-none focus:border-[#00d2ff]"
                          placeholder="e.g. Download Resume (PDF)"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                          Icon
                        </label>
                        <select
                          value={btn.icon || "Download"}
                          onChange={(e) => {
                            const updated = [...aboutHeroForm.buttons];
                            updated[idx] = { ...updated[idx], icon: e.target.value };
                            setAboutHeroForm({ ...aboutHeroForm, buttons: updated });
                          }}
                          className="w-full px-2 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                        >
                          {AVAILABLE_BADGE_ICONS.map((ic) => (
                            <option key={ic.value} value={ic.value}>
                              {ic.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                        Target Link / File URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={btn.url}
                          onChange={(e) => {
                            const updated = [...aboutHeroForm.buttons];
                            updated[idx] = { ...updated[idx], url: e.target.value };
                            setAboutHeroForm({ ...aboutHeroForm, buttons: updated });
                          }}
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                          placeholder="/assets/... or /contact"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            openMediaPicker((url) => {
                              const updated = [...aboutHeroForm.buttons];
                              updated[idx] = { ...updated[idx], url };
                              setAboutHeroForm({ ...aboutHeroForm, buttons: updated });
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff]"
                        >
                          Browse
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={btn.isDownload === true}
                          onChange={(e) => {
                            const updated = [...aboutHeroForm.buttons];
                            updated[idx] = { ...updated[idx], isDownload: e.target.checked };
                            setAboutHeroForm({ ...aboutHeroForm, buttons: updated });
                          }}
                          className="rounded border-white/20 bg-[#050914] text-[#00d2ff] focus:ring-0"
                        />
                        <span className="text-[11px] text-slate-300">File Download Trigger</span>
                      </label>

                      {btn.isDownload && (
                        <input
                          type="text"
                          value={btn.downloadName || ""}
                          onChange={(e) => {
                            const updated = [...aboutHeroForm.buttons];
                            updated[idx] = { ...updated[idx], downloadName: e.target.value };
                            setAboutHeroForm({ ...aboutHeroForm, buttons: updated });
                          }}
                          placeholder="Filename (e.g. Tarek-CV.pdf)"
                          className="px-2 py-1 rounded bg-[#050914] border border-white/10 text-[11px] text-white outline-none focus:border-[#00d2ff]"
                        />
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = [...aboutHeroForm.buttons];
                          const temp = updated[idx - 1];
                          updated[idx - 1] = updated[idx];
                          updated[idx] = temp;
                          setAboutHeroForm({ ...aboutHeroForm, buttons: updated });
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === aboutHeroForm.buttons.length - 1}
                        onClick={() => {
                          const updated = [...aboutHeroForm.buttons];
                          const temp = updated[idx + 1];
                          updated[idx + 1] = updated[idx];
                          updated[idx] = temp;
                          setAboutHeroForm({ ...aboutHeroForm, buttons: updated });
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = aboutHeroForm.buttons.filter((_, i) => i !== idx);
                        setAboutHeroForm({ ...aboutHeroForm, buttons: updated });
                        showToast("Removed button");
                      }}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Save Hero Banner Section */}
          <div className="flex justify-end pt-2 border-t border-white/10">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveHeroSection}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] via-[#00a3ff] to-[#0072ff] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_28px_rgba(0,210,255,0.7)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Hero Banner Content</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MASTER CARD 2: FOCAL PORTRAIT & 3D ROTATING CARD STACK        */}
        {/* ------------------------------------------------------------- */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#08122d] via-[#09183d] to-[#060c20] border-2 border-[#00d2ff]/40 shadow-[0_0_35px_rgba(0,210,255,0.18)] space-y-6 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#00d2ff]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/15 border border-[#00d2ff]/35 text-[11px] font-mono font-bold uppercase tracking-wider text-[#00d2ff]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Primary Focal Showcase // Large Portrait &amp; 3D Stack</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Main Hero / Profile Photo &amp; 3D Stack
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                This photo is rendered as the primary portrait on the live About page and the center card of the 3D rotating stack.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE FOCAL PORTRAIT</span>
              </span>
            </div>
          </div>

          {/* Two-Column Layout: Left Preview & Manager, Right Controls & Explanation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 bg-[#050914] p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00d2ff]">
                  Focal Photo Preview
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Aspect 4:5 Portrait
                </span>
              </div>

              <UniversalImageManager
                label="Main Hero Profile Photo"
                imageUrl={mainPortraitUrl}
                fallbackUrl="/assets/profile-1-scaled.png"
                alt={mainPortraitAlt || "Md Tarek Rahaman - Creative Web Developer"}
                aspectRatio="portrait"
                onImageChange={(url) => {
                  setMainPortraitUrl(url);
                  const updated = [...heroPhotos];
                  if (updated[1]) {
                    updated[1] = { ...updated[1], src: url };
                    setHeroPhotos(updated);
                  }
                }}
                onImageRemove={() => {
                  setMainPortraitUrl("");
                }}
                onSaveImmediate={async (url) => {
                  setMainPortraitUrl(url);
                  await handleSaveHeroPhotos(undefined, url);
                }}
                openMediaPicker={openMediaPicker}
                showToast={showToast}
              />
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-xl bg-[#050914] border border-[#00d2ff]/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#00d2ff] uppercase font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Independent Photo Synchronization</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Editing or replacing this main photo updates <strong className="text-white">only the large portrait and hero focal card</strong> on the About page. The <strong className="text-white">03. Milestone Gallery</strong> photos (Workstation, NSDA Certificate, Sprint Collaboration) will remain completely untouched.
                </p>
              </div>

              <div className="space-y-3 p-5 rounded-2xl bg-[#050914] border border-white/10">
                <div>
                  <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1.5 font-bold">
                    Portrait Alt Text / Image Description
                  </label>
                  <input
                    type="text"
                    value={mainPortraitAlt}
                    onChange={(e) => setMainPortraitAlt(e.target.value)}
                    placeholder="e.g. Md Tarek Rahaman - Creative Web Developer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1e] border border-white/10 text-xs sm:text-sm text-white outline-none focus:border-[#00d2ff] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1.5 font-bold">
                    Primary Display Role Badge
                  </label>
                  <input
                    type="text"
                    value={mainPortraitTitle}
                    onChange={(e) => setMainPortraitTitle(e.target.value)}
                    placeholder="e.g. Full-Stack Web Developer & WordPress Specialist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1e] border border-white/10 text-xs sm:text-sm text-white outline-none focus:border-[#00d2ff] transition-colors"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openMediaPicker((url) => {
                          setMainPortraitUrl(url);
                          const updated = [...heroPhotos];
                          if (updated[1]) {
                            updated[1] = { ...updated[1], src: url };
                            setHeroPhotos(updated);
                          }
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] cursor-pointer transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Browse Media</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const defaultUrl = "/uploads/1793719116653-Untitled_design.png";
                        setMainPortraitUrl(defaultUrl);
                        const updated = [...heroPhotos];
                        if (updated[1]) {
                          updated[1] = { ...updated[1], src: defaultUrl };
                          setHeroPhotos(updated);
                        }
                        showToast("Reset to default profile photo");
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 cursor-pointer transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={async () => {
                      await handleSaveHeroPhotos();
                      showToast("Main Profile Photo saved permanently!");
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] via-[#00a3ff] to-[#0072ff] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_28px_rgba(0,210,255,0.7)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Main Photo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Rotating Stack Manager */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00d2ff]" />
                <span>3D Rotating Card Stack ({heroPhotos.length} Cards)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Card 1 renders Left (Workstation), Card 2 renders Center (Main Portrait), Card 3 renders Right (Certificate).
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newCard: HeroPhoto = {
                  id: `hero-card-${Date.now()}`,
                  src: "/assets/profile-1-scaled.png",
                  label: `Hero Card #${heroPhotos.length + 1}`,
                  role: "Creative Web Developer",
                  description: "Digital web engineering and high-performance development.",
                  rotation: "0deg",
                  alt: "Tarek Rahaman",
                };
                const updated = [...heroPhotos, newCard];
                setHeroPhotos(updated);
                showToast(`Added Hero Card #${updated.length}`);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00d2ff]/15 hover:bg-[#00d2ff]/25 border border-[#00d2ff]/40 text-xs font-bold text-[#00d2ff] hover:text-white transition-all shadow-[0_0_15px_rgba(0,210,255,0.2)] cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroPhotos.map((photo, idx) => {
              const cardRoleBadge =
                idx === 0
                  ? "Card 1 • Left Stack (Workstation)"
                  : idx === 1
                  ? "Card 2 • Center Main (Portrait)"
                  : idx === 2
                  ? "Card 3 • Right Stack (Certificate)"
                  : `Card ${idx + 1} • Stack Member`;

              return (
                <div
                  key={photo.id || photo.label + idx}
                  className="p-5 rounded-2xl bg-[#050914] border border-white/10 hover:border-[#00d2ff]/40 transition-all space-y-4 flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-[#00d2ff] uppercase tracking-wider block">
                          {cardRoleBadge}
                        </span>
                        <div className="text-xs font-bold text-white truncate max-w-[180px]">
                          {photo.label || `Card #${idx + 1}`}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff]">
                        {photo.rotation || "0deg"}
                      </span>
                    </div>

                    <UniversalImageManager
                      label={`Card #${idx + 1} Image`}
                      imageUrl={photo.src}
                      fallbackUrl="/assets/profile-1-scaled.png"
                      alt={photo.alt || photo.label}
                      aspectRatio="portrait"
                      onImageChange={(url) => {
                        const updated = [...heroPhotos];
                        updated[idx] = { ...updated[idx], src: url };
                        setHeroPhotos(updated);
                      }}
                      onImageRemove={() => {
                        const updated = [...heroPhotos];
                        updated[idx] = { ...updated[idx], src: "" };
                        setHeroPhotos(updated);
                      }}
                      onSaveImmediate={async (url) => {
                        const updated = [...heroPhotos];
                        updated[idx] = { ...updated[idx], src: url };
                        setHeroPhotos(updated);
                        await updateCms({
                          profile: {
                            ...cmsData.profile,
                            heroPhotos: updated,
                          },
                        });
                        showToast(`Card #${idx + 1} image saved`);
                      }}
                      openMediaPicker={openMediaPicker}
                      showToast={showToast}
                    />

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                          Badge / Card Label
                        </label>
                        <input
                          type="text"
                          value={photo.label}
                          onChange={(e) => {
                            const updated = [...heroPhotos];
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            setHeroPhotos(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff] transition-colors"
                          placeholder="e.g. Workstation Lab or Tarek Rahaman"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                          Role / Title
                        </label>
                        <input
                          type="text"
                          value={photo.role || ""}
                          onChange={(e) => {
                            const updated = [...heroPhotos];
                            updated[idx] = { ...updated[idx], role: e.target.value };
                            setHeroPhotos(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff] transition-colors"
                          placeholder="e.g. Full-Stack Web Developer"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                          Description / Alt Text
                        </label>
                        <textarea
                          rows={2}
                          value={photo.description || photo.alt || ""}
                          onChange={(e) => {
                            const updated = [...heroPhotos];
                            updated[idx] = {
                              ...updated[idx],
                              description: e.target.value,
                              alt: e.target.value,
                            };
                            setHeroPhotos(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff] transition-colors"
                          placeholder="Card description or image alt text"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] uppercase font-mono text-slate-400">
                            Tilt / Rotation
                          </label>
                          <div className="flex items-center gap-1">
                            {["-5deg", "0deg", "5deg"].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => {
                                  const updated = [...heroPhotos];
                                  updated[idx] = { ...updated[idx], rotation: preset };
                                  setHeroPhotos(updated);
                                }}
                                className={`px-1.5 py-0.5 rounded text-[9px] font-mono cursor-pointer transition-colors ${
                                  photo.rotation === preset
                                    ? "bg-[#00d2ff] text-[#050811] font-bold"
                                    : "bg-white/5 text-slate-400 hover:text-white"
                                }`}
                              >
                                {preset}
                              </button>
                            ))}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={photo.rotation || "0deg"}
                          onChange={(e) => {
                            const updated = [...heroPhotos];
                            updated[idx] = { ...updated[idx], rotation: e.target.value };
                            setHeroPhotos(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff] font-mono"
                          placeholder="e.g. -5deg, 0deg, 5deg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = [...heroPhotos];
                          const temp = updated[idx - 1];
                          updated[idx - 1] = updated[idx];
                          updated[idx] = temp;
                          setHeroPhotos(updated);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                        title="Move Left / Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === heroPhotos.length - 1}
                        onClick={() => {
                          const updated = [...heroPhotos];
                          const temp = updated[idx + 1];
                          updated[idx + 1] = updated[idx];
                          updated[idx] = temp;
                          setHeroPhotos(updated);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                        title="Move Right / Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const dup = {
                            ...photo,
                            id: `hero-card-${Date.now()}`,
                            label: `${photo.label} (Copy)`,
                          };
                          const updated = [...heroPhotos];
                          updated.splice(idx + 1, 0, dup);
                          setHeroPhotos(updated);
                          showToast(`Duplicated Card #${idx + 1}`);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
                        title="Duplicate Card"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove Hero Card #${idx + 1} (${photo.label})?`)) {
                            const updated = heroPhotos.filter((_, i) => i !== idx);
                            setHeroPhotos(updated);
                            showToast(`Removed Card #${idx + 1}`);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15 cursor-pointer transition-colors"
                        title="Remove Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={async () => {
                        await handleSaveHeroPhotos();
                        showToast(`Card #${idx + 1} saved!`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00d2ff]/15 hover:bg-[#00d2ff]/25 border border-[#00d2ff]/40 text-[11px] font-bold text-[#00d2ff] hover:text-white cursor-pointer transition-all"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save Card</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 2: PERSONAL PROFILE & BIO
  // =========================================================================
  if (activeSubPage === "profile") {
    return (
      <div className="space-y-8">
        {renderSubPageHeader(
          "profile",
          "Biography & Large Profile Card",
          "Manage the left large profile card (Verified badge, title, location) and right-side Biography & Expertise narrative, specialty badges, and profile credentials.",
          "#profile",
          () => handleSaveProfileCardAndBio(),
          "Save Profile & Biography"
        )}

        {/* ------------------------------------------------------------- */}
        {/* CARD 1: LARGE PROFILE CARD (LEFT COLUMN ON /about)            */}
        {/* ------------------------------------------------------------- */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#08122d] via-[#09183d] to-[#060c20] border-2 border-[#00d2ff]/40 shadow-[0_0_35px_rgba(0,210,255,0.18)] space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/15 border border-[#00d2ff]/35 text-[11px] font-mono font-bold uppercase tracking-wider text-[#00d2ff]">
                <User className="w-3.5 h-3.5" />
                <span>Live About Left Column // Large Focal Profile Card</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Large Profile Card
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Control the large portrait card displayed in the Biography grid on /about with Verified credential pill, eyebrow name, primary title, and location.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setProfileCardForm({
                    ...profileCardForm,
                    visible: profileCardForm.visible === false ? true : false,
                  })
                }
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  profileCardForm.visible !== false
                    ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                    : "bg-rose-950/70 border border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    profileCardForm.visible !== false ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                  }`}
                />
                <span>{profileCardForm.visible !== false ? "CARD VISIBLE" : "CARD HIDDEN"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Image Manager */}
            <div className="lg:col-span-5 bg-[#050914] p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00d2ff]">
                  Card Portrait Preview
                </span>
                <span className="text-[10px] font-mono text-slate-400">Aspect 4:5</span>
              </div>

              <UniversalImageManager
                label="Large Profile Card Image"
                imageUrl={profileCardForm.imageUrl}
                fallbackUrl="/assets/profile-1-scaled.png"
                alt={profileCardForm.altText || "Md Tarek Rahaman"}
                aspectRatio="portrait"
                onImageChange={(url) => setProfileCardForm({ ...profileCardForm, imageUrl: url })}
                onImageRemove={() => setProfileCardForm({ ...profileCardForm, imageUrl: "" })}
                onSaveImmediate={async (url) => {
                  setProfileCardForm((prev) => ({ ...prev, imageUrl: url }));
                  await updateCms({
                    aboutProfileCard: { ...profileCardForm, imageUrl: url },
                  });
                  showToast("Profile card image updated");
                }}
                openMediaPicker={openMediaPicker}
                showToast={showToast}
              />
            </div>

            {/* Right: Card Details & Overlay Badges */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00d2ff] block">
                  Top Verified Badge
                </span>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setProfileCardForm({
                        ...profileCardForm,
                        showVerifiedBadge: profileCardForm.showVerifiedBadge === false ? true : false,
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                      profileCardForm.showVerifiedBadge !== false
                        ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                        : "bg-white/5 border-white/10 text-slate-400"
                    }`}
                  >
                    {profileCardForm.showVerifiedBadge !== false ? "Verified Badge: Visible" : "Verified Badge: Hidden"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={profileCardForm.verifiedBadgeText || ""}
                      onChange={(e) =>
                        setProfileCardForm({ ...profileCardForm, verifiedBadgeText: e.target.value })
                      }
                      placeholder="e.g. Verified"
                      className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Badge Icon
                    </label>
                    <select
                      value={profileCardForm.verifiedBadgeIcon || "ShieldCheck"}
                      onChange={(e) =>
                        setProfileCardForm({ ...profileCardForm, verifiedBadgeIcon: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    >
                      {AVAILABLE_BADGE_ICONS.map((ic) => (
                        <option key={ic.value} value={ic.value}>
                          {ic.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00d2ff] block">
                  Card Typography &amp; Location
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Eyebrow Text (Small Cyan Header)
                    </label>
                    <input
                      type="text"
                      value={profileCardForm.eyebrowText || ""}
                      onChange={(e) =>
                        setProfileCardForm({ ...profileCardForm, eyebrowText: e.target.value })
                      }
                      placeholder="e.g. Md Tarek Rahaman"
                      className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Main Title / Headline
                    </label>
                    <input
                      type="text"
                      value={profileCardForm.title || ""}
                      onChange={(e) =>
                        setProfileCardForm({ ...profileCardForm, title: e.target.value })
                      }
                      placeholder="e.g. Full-Stack & WordPress Specialist"
                      className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Location Text
                      </label>
                      <input
                        type="text"
                        value={profileCardForm.location || ""}
                        onChange={(e) =>
                          setProfileCardForm({ ...profileCardForm, location: e.target.value })
                        }
                        placeholder="e.g. Mirpur-1, Dhaka, Bangladesh"
                        className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Location Icon
                      </label>
                      <select
                        value={profileCardForm.locationIcon || "MapPin"}
                        onChange={(e) =>
                          setProfileCardForm({ ...profileCardForm, locationIcon: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                      >
                        {AVAILABLE_BADGE_ICONS.map((ic) => (
                          <option key={ic.value} value={ic.value}>
                            {ic.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Image Alt Text
                    </label>
                    <input
                      type="text"
                      value={profileCardForm.altText || ""}
                      onChange={(e) =>
                        setProfileCardForm({ ...profileCardForm, altText: e.target.value })
                      }
                      placeholder="e.g. Md Tarek Rahaman - Creative Web Developer"
                      className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CARD 2: BIOGRAPHY & EXPERTISE NARRATIVE (RIGHT COLUMN)        */}
        {/* ------------------------------------------------------------- */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#08122d] via-[#09183d] to-[#060c20] border-2 border-[#00d2ff]/40 shadow-[0_0_35px_rgba(0,210,255,0.18)] space-y-6 relative overflow-hidden">
          <div className="space-y-1 pb-5 border-b border-white/10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/15 border border-[#00d2ff]/35 text-[11px] font-mono font-bold uppercase tracking-wider text-[#00d2ff]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live About Right Column // Narrative &amp; Specialty Badges</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Biography &amp; Expertise Details
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Manage the headline with glowing highlight, first &amp; second story paragraphs, and the 4 specialty qualification pills rendered on /about.
            </p>
          </div>

          <div className="space-y-5">
            {/* Top Badge */}
            <div className="p-4 rounded-xl bg-[#050914] border border-white/10">
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1 font-bold">
                Section Eyebrow Badge
              </label>
              <input
                type="text"
                value={bioForm.badge}
                onChange={(e) => setBioForm({ ...bioForm, badge: e.target.value })}
                placeholder="e.g. BIOGRAPHY & EXPERTISE"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1e] border border-white/10 text-xs sm:text-sm text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            {/* 4-Part Heading Builder with Live Glow Preview */}
            <div className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d2ff] block">
                Main Story Headline Builder
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                    Heading Prefix
                  </label>
                  <input
                    type="text"
                    value={bioForm.headingPrefix}
                    onChange={(e) => setBioForm({ ...bioForm, headingPrefix: e.target.value })}
                    placeholder="e.g. Turning complex problems into "
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-[#00f0ff] block mb-1">
                    Highlighted Words
                  </label>
                  <input
                    type="text"
                    value={bioForm.highlightedText}
                    onChange={(e) => setBioForm({ ...bioForm, highlightedText: e.target.value })}
                    placeholder="e.g. elegant, scalable"
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-[#00d2ff]/30 text-xs text-[#00f0ff] outline-none focus:border-[#00d2ff]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                    Heading Suffix
                  </label>
                  <input
                    type="text"
                    value={bioForm.headingSuffix}
                    onChange={(e) => setBioForm({ ...bioForm, headingSuffix: e.target.value })}
                    placeholder="e.g. , and revenue-generating digital products."
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                    Highlight Style
                  </label>
                  <select
                    value={bioForm.highlightStyle || "cyan"}
                    onChange={(e) => setBioForm({ ...bioForm, highlightStyle: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                  >
                    <option value="cyan">Electric Cyan Glow</option>
                    <option value="gradient">Purple to Pink Gradient</option>
                    <option value="emerald">Emerald Green Glow</option>
                  </select>
                </div>
              </div>

              {/* Live Preview */}
              <div className="p-3.5 rounded-xl bg-[#02050c] border border-[#00d2ff]/20">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  Live Headline Preview
                </span>
                <div className="text-base sm:text-lg font-black text-white leading-snug">
                  <span>{bioForm.headingPrefix}</span>
                  <span
                    className={
                      bioForm.highlightStyle === "gradient"
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#ec4899] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                        : bioForm.highlightStyle === "emerald"
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-[#34d399] to-[#059669] drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                        : "text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]"
                    }
                  >
                    {bioForm.highlightedText}
                  </span>
                  <span>{bioForm.headingSuffix}</span>
                </div>
              </div>
            </div>

            {/* Paragraphs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-2">
                <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                  First Paragraph (Academic &amp; Core Stack)
                </label>
                <textarea
                  rows={4}
                  value={bioForm.firstParagraph}
                  onChange={(e) => setBioForm({ ...bioForm, firstParagraph: e.target.value })}
                  placeholder="Software Engineering undergraduate at Daffodil International University..."
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs sm:text-sm text-slate-200 outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-2">
                <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                  Second Paragraph (Commercial Experience)
                </label>
                <textarea
                  rows={4}
                  value={bioForm.secondParagraph}
                  onChange={(e) => setBioForm({ ...bioForm, secondParagraph: e.target.value })}
                  placeholder="Over the course of 200+ commercial web deployments..."
                  className="w-full px-3 py-2 rounded-xl bg-[#080e1e] border border-white/10 text-xs sm:text-sm text-slate-200 outline-none focus:border-[#00d2ff]"
                />
              </div>
            </div>

            {/* Specialty Info Badges (DIU SWE, Data Science Major, NSDA Certified, 200+ Deployments) */}
            <div className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d2ff] flex items-center gap-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>Specialty Qualification Badges ({bioForm.badges.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newBadge: AboutBioBadge = {
                      id: `bio-badge-${Date.now()}`,
                      label: "Specialty Skill",
                      icon: "Award",
                    };
                    setBioForm({
                      ...bioForm,
                      badges: [...bioForm.badges, newBadge],
                    });
                    showToast("Added qualification badge");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Badge</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {bioForm.badges.map((badge, idx) => (
                  <div
                    key={badge.id || idx}
                    className="p-3.5 rounded-xl bg-[#080e1e] border border-white/10 space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          Pill #{idx + 1}
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
                          {renderBadgeIcon(badge.icon, "w-3.5 h-3.5")}
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          value={badge.label}
                          onChange={(e) => {
                            const updated = [...bioForm.badges];
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            setBioForm({ ...bioForm, badges: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                          placeholder="e.g. DIU Software Eng."
                        />
                      </div>

                      <div>
                        <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                          Icon
                        </label>
                        <select
                          value={badge.icon || "Award"}
                          onChange={(e) => {
                            const updated = [...bioForm.badges];
                            updated[idx] = { ...updated[idx], icon: e.target.value };
                            setBioForm({ ...bioForm, badges: updated });
                          }}
                          className="w-full px-2 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                        >
                          {AVAILABLE_BADGE_ICONS.map((ic) => (
                            <option key={ic.value} value={ic.value}>
                              {ic.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const updated = [...bioForm.badges];
                            const temp = updated[idx - 1];
                            updated[idx - 1] = updated[idx];
                            updated[idx] = temp;
                            setBioForm({ ...bioForm, badges: updated });
                          }}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Left"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === bioForm.badges.length - 1}
                          onClick={() => {
                            const updated = [...bioForm.badges];
                            const temp = updated[idx + 1];
                            updated[idx + 1] = updated[idx];
                            updated[idx] = temp;
                            setBioForm({ ...bioForm, badges: updated });
                          }}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Move Right"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const dup = { ...badge, id: `bio-badge-${Date.now()}` };
                            const updated = [...bioForm.badges];
                            updated.splice(idx + 1, 0, dup);
                            setBioForm({ ...bioForm, badges: updated });
                            showToast(`Duplicated ${badge.label}`);
                          }}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                          title="Duplicate"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = bioForm.badges.filter((_, i) => i !== idx);
                          setBioForm({ ...bioForm, badges: updated });
                          showToast("Removed badge");
                        }}
                        className="p-1 rounded text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CARD 3: PERSONAL PROFILE & GENERAL METADATA                   */}
        {/* ------------------------------------------------------------- */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#08122d] via-[#09183d] to-[#060c20] border border-white/10 space-y-6">
          <div className="space-y-1 pb-4 border-b border-white/10">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Personal Profile &amp; General Metadata
            </h3>
            <p className="text-xs text-slate-400">
              Update core candidate identity, CV resume URL, and professional title list.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Display Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Full Official Name
              </label>
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Office / Living Location
              </label>
              <input
                type="text"
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                CV Document URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={profileForm.cvUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, cvUrl: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => openMediaPicker((url) => setProfileForm({ ...profileForm, cvUrl: url }))}
                  className="px-3 py-2.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff]"
                >
                  Browse
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Professional Titles (Comma-separated)
              </label>
              <input
                type="text"
                value={profileForm.titles}
                onChange={(e) => setProfileForm({ ...profileForm, titles: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Short Bio / Introduction
              </label>
              <textarea
                rows={2}
                value={profileForm.shortBio}
                onChange={(e) => setProfileForm({ ...profileForm, shortBio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Full Biography Narrative
              </label>
              <textarea
                rows={4}
                value={profileForm.fullBio}
                onChange={(e) => setProfileForm({ ...profileForm, fullBio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs sm:text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-white/10">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveProfileCardAndBio}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] via-[#00a3ff] to-[#0072ff] text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_28px_rgba(0,210,255,0.7)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Profile &amp; Biography</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 3: PROFILE IMAGE GALLERY
  // =========================================================================
  if (activeSubPage === "photos") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "photos",
          "Profile Image Gallery Management",
          "Manage milestone gallery photo moments displayed on the live About page under Biography & Credentials.",
          "#gallery",
          () => handleSaveGallery(),
          "Save Gallery"
        )}

        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00d2ff]" />
                <span>Milestone Photo Gallery ({galleryPhotos.length} Items)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Rendered dynamically in the About page grid. You can upload, replace, add, duplicate, or remove photos.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newItem: AboutGalleryItem = {
                  id: `about-gallery-${Date.now()}`,
                  src: "/assets/profile-1-scaled.png",
                  label: `Gallery Item #${galleryPhotos.length + 1}`,
                  title: `Moment #${galleryPhotos.length + 1}`,
                  alt: "Tarek Rahaman Milestone Photo",
                  description: "Professional development activity and milestone showcase."
                };
                const updated = [...galleryPhotos, newItem];
                setGalleryPhotos(updated);
                showToast(`Added Gallery Item #${updated.length}`);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00d2ff]/15 hover:bg-[#00d2ff]/25 border border-[#00d2ff]/40 text-xs font-bold text-[#00d2ff] hover:text-white transition-all shadow-[0_0_15px_rgba(0,210,255,0.2)] cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Gallery Item</span>
            </button>
          </div>

          {/* Gallery Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryPhotos.map((item, idx) => (
              <div
                key={item.id || item.src + idx}
                className="p-5 rounded-2xl bg-[#050914] border border-white/10 hover:border-[#00d2ff]/40 transition-all space-y-4 flex flex-col justify-between group shadow-lg"
              >
                <div className="space-y-4">
                  {/* Item Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold text-[#00d2ff] uppercase tracking-wider block">
                        Gallery Item #{idx + 1}
                      </span>
                      <div className="text-xs font-bold text-white truncate max-w-[200px]">
                        {item.label || item.title || `Item #${idx + 1}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...galleryPhotos];
                          updated[idx] = { ...updated[idx], visible: updated[idx].visible === false ? true : false };
                          setGalleryPhotos(updated);
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all ${
                          item.visible !== false
                            ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                            : "bg-white/5 border-white/10 text-slate-400"
                        }`}
                      >
                        {item.visible !== false ? "Visible" : "Hidden"}
                      </button>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-slate-300">
                        Grid Item
                      </span>
                    </div>
                  </div>

                  {/* Universal Image Manager */}
                  <UniversalImageManager
                    label={`Gallery #${idx + 1} Image`}
                    imageUrl={item.src}
                    fallbackUrl="/assets/profile-1-scaled.png"
                    alt={item.alt || item.title || item.label || "Gallery Photo"}
                    aspectRatio="video"
                    onImageChange={(url) => {
                      const updated = [...galleryPhotos];
                      updated[idx] = { ...updated[idx], src: url };
                      setGalleryPhotos(updated);
                    }}
                    onImageRemove={() => {
                      const updated = [...galleryPhotos];
                      updated[idx] = { ...updated[idx], src: "" };
                      setGalleryPhotos(updated);
                    }}
                    onSaveImmediate={async (url) => {
                      const updated = [...galleryPhotos];
                      updated[idx] = { ...updated[idx], src: url };
                      setGalleryPhotos(updated);
                      await updateCms({ aboutGallery: updated });
                      showToast(`Gallery Item #${idx + 1} image saved`);
                    }}
                    openMediaPicker={openMediaPicker}
                    showToast={showToast}
                  />

                  {/* Form Controls */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Label / Caption
                      </label>
                      <input
                        type="text"
                        value={item.label || item.title || ""}
                        onChange={(e) => {
                          const updated = [...galleryPhotos];
                          updated[idx] = {
                            ...updated[idx],
                            label: e.target.value,
                            title: e.target.value
                          };
                          setGalleryPhotos(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff] transition-colors"
                        placeholder="e.g. Workstation Lab or NSDA Certified"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Alt Text &amp; Description
                      </label>
                      <textarea
                        rows={2}
                        value={item.description || item.alt || ""}
                        onChange={(e) => {
                          const updated = [...galleryPhotos];
                          updated[idx] = {
                            ...updated[idx],
                            description: e.target.value,
                            alt: e.target.value
                          };
                          setGalleryPhotos(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff] transition-colors"
                        placeholder="Short description or alt text"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                        Optional Click Link URL
                      </label>
                      <input
                        type="text"
                        value={item.link || ""}
                        onChange={(e) => {
                          const updated = [...galleryPhotos];
                          updated[idx] = { ...updated[idx], link: e.target.value };
                          setGalleryPhotos(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff] transition-colors"
                        placeholder="https://... or /contact"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...galleryPhotos];
                        const temp = updated[idx - 1];
                        updated[idx - 1] = updated[idx];
                        updated[idx] = temp;
                        setGalleryPhotos(updated);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                      title="Move Left / Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === galleryPhotos.length - 1}
                      onClick={() => {
                        const updated = [...galleryPhotos];
                        const temp = updated[idx + 1];
                        updated[idx + 1] = updated[idx];
                        updated[idx] = temp;
                        setGalleryPhotos(updated);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                      title="Move Right / Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const dup = {
                          ...item,
                          id: `about-gallery-${Date.now()}`,
                          label: `${item.label || item.title || "Photo"} (Copy)`,
                          title: `${item.title || item.label || "Photo"} (Copy)`
                        };
                        const updated = [...galleryPhotos];
                        updated.splice(idx + 1, 0, dup);
                        setGalleryPhotos(updated);
                        showToast(`Duplicated Gallery Item #${idx + 1}`);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
                      title="Duplicate Item"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove gallery item #${idx + 1} (${item.label || item.title || "Photo"})?`)) {
                          const updated = galleryPhotos.filter((_, i) => i !== idx);
                          setGalleryPhotos(updated);
                          showToast(`Removed Gallery Item #${idx + 1}`);
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15 cursor-pointer transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={async () => {
                      await handleSaveGallery();
                      showToast(`Gallery Item #${idx + 1} saved!`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00d2ff]/15 hover:bg-[#00d2ff]/25 border border-[#00d2ff]/40 text-[11px] font-bold text-[#00d2ff] hover:text-white cursor-pointer transition-all"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save Item</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 4: DEVELOPMENT PROCESS
  // =========================================================================
  if (activeSubPage === "process") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "process",
          "Development Process Management",
          "Manage the 4 engineering workflow phases and section header displayed on the About page.",
          "#process",
          handleSaveProcess,
          "Save Process Steps"
        )}

        {/* Section Header Controls */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d2ff] block">
            Process Section Header
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Badge
              </label>
              <input
                type="text"
                value={processHeader.badge}
                onChange={(e) => setProcessHeader({ ...processHeader, badge: e.target.value })}
                placeholder="e.g. HOW I WORK"
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Title
              </label>
              <input
                type="text"
                value={processHeader.title}
                onChange={(e) => setProcessHeader({ ...processHeader, title: e.target.value })}
                placeholder="e.g. My Development"
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-[#00f0ff] block mb-1">
                Highlight Text
              </label>
              <input
                type="text"
                value={processHeader.highlightText}
                onChange={(e) => setProcessHeader({ ...processHeader, highlightText: e.target.value })}
                placeholder="e.g. Process"
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-[#00d2ff]/30 text-xs text-[#00f0ff] outline-none focus:border-[#00d2ff]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
              Description
            </label>
            <input
              type="text"
              value={processHeader.description}
              onChange={(e) => setProcessHeader({ ...processHeader, description: e.target.value })}
              placeholder="e.g. A structured approach to turning ideas into high-quality digital experiences."
              className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {processStepsList.map((step, idx) => (
              <div
                key={step.step || idx}
                className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <span className="text-xs font-mono font-bold text-[#00d2ff]">
                    Phase {step.step || `0${idx + 1}`}
                  </span>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={step.title || ""}
                      onChange={(e) => {
                        const updated = [...processStepsList];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setProcessStepsList(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={step.description || ""}
                      onChange={(e) => {
                        const updated = [...processStepsList];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setProcessStepsList(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 5: TECHNOLOGIES I WORK WITH
  // =========================================================================
  if (activeSubPage === "tech") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "tech",
          "Technologies I Work With",
          "Manage the tech stack items, brand badges, categories, and section header displayed on the About page.",
          "#tech",
          handleSaveTech,
          "Save Technologies"
        )}

        {/* Section Header Controls */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d2ff] block">
            Tech Arsenal Section Header
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Badge
              </label>
              <input
                type="text"
                value={techHeader.badge}
                onChange={(e) => setTechHeader({ ...techHeader, badge: e.target.value })}
                placeholder="e.g. TECH ARSENAL"
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Title
              </label>
              <input
                type="text"
                value={techHeader.title}
                onChange={(e) => setTechHeader({ ...techHeader, title: e.target.value })}
                placeholder="e.g. Technologies I"
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-[#00f0ff] block mb-1">
                Highlight Text
              </label>
              <input
                type="text"
                value={techHeader.highlightText}
                onChange={(e) => setTechHeader({ ...techHeader, highlightText: e.target.value })}
                placeholder="e.g. Work With"
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-[#00d2ff]/30 text-xs text-[#00f0ff] outline-none focus:border-[#00d2ff]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
              Description
            </label>
            <input
              type="text"
              value={techHeader.description}
              onChange={(e) => setTechHeader({ ...techHeader, description: e.target.value })}
              placeholder="e.g. To build and scale generative & high-reliability systems."
              className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              Tech Stack Items ({techList.length})
            </h3>
            <button
              type="button"
              onClick={() => {
                const newTech: ServicesTechItem = {
                  name: "New Technology",
                  brand: "code",
                  category: "Web Engineering"
                };
                setTechList([...techList, newTech]);
                showToast("Added technology item");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tech Item</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {techList.map((tech, idx) => (
              <div
                key={tech.name + idx}
                className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <input
                    type="text"
                    value={tech.name}
                    onChange={(e) => {
                      const updated = [...techList];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      setTechList(updated);
                    }}
                    className="w-full px-2.5 py-1 rounded bg-[#080e1e] border border-white/10 text-xs font-bold text-white outline-none focus:border-[#00d2ff]"
                  />
                  <input
                    type="text"
                    value={tech.category}
                    onChange={(e) => {
                      const updated = [...techList];
                      updated[idx] = { ...updated[idx], category: e.target.value };
                      setTechList(updated);
                    }}
                    className="w-full px-2.5 py-1 rounded bg-[#080e1e] border border-white/10 text-[11px] text-slate-300 outline-none focus:border-[#00d2ff]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTechList(techList.filter((_, i) => i !== idx));
                    showToast("Removed tech item");
                  }}
                  className="self-end text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 6: EDUCATIONAL JOURNEY
  // =========================================================================
  if (activeSubPage === "education") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "education",
          "Educational Journey Management",
          "Manage academic degrees, institutions, graduation dates, major subjects, and descriptions.",
          "#education",
          handleSaveEducation,
          "Save Education"
        )}

        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              Academic Degrees ({educationList.length})
            </h3>
            <button
              type="button"
              onClick={() => {
                const newEdu: EducationItem = {
                  institution: "Daffodil International University",
                  degree: "B.Sc. in Software Engineering",
                  period: "2023 - Present",
                  description: "Major in Data Science with core coursework in Algorithms, Data Structures, OOP, and Database Systems.",
                  location: "Dhaka, Bangladesh"
                };
                setEducationList([...educationList, newEdu]);
                showToast("Added education degree");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Degree</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {educationList.map((edu, idx) => (
              <div
                key={edu.degree + idx}
                className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#00d2ff]">
                      Degree #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={edu.period || ""}
                      onChange={(e) => {
                        const updated = [...educationList];
                        updated[idx] = { ...updated[idx], period: e.target.value };
                        setEducationList(updated);
                      }}
                      className="px-2 py-0.5 rounded bg-[#080e1e] border border-white/10 text-xs text-right font-mono text-[#00d2ff] outline-none"
                      placeholder="e.g. 2023 - Present"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Degree Title
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...educationList];
                        updated[idx] = { ...updated[idx], degree: e.target.value };
                        setEducationList(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...educationList];
                        updated[idx] = { ...updated[idx], institution: e.target.value };
                        setEducationList(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => {
                        const updated = [...educationList];
                        updated[idx] = { ...updated[idx], location: e.target.value };
                        setEducationList(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Description &amp; Highlights
                    </label>
                    <textarea
                      rows={2}
                      value={edu.description}
                      onChange={(e) => {
                        const updated = [...educationList];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setEducationList(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove degree "${edu.degree}"?`)) {
                        setEducationList(educationList.filter((_, i) => i !== idx));
                        showToast("Degree removed");
                      }
                    }}
                    className="p-1 rounded text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 7: VERIFIED CERTIFICATIONS
  // =========================================================================
  if (activeSubPage === "certifications") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "certifications",
          "Verified Certifications Management",
          "Manage government and commercial certifications, issuing organizations, credential URLs, and certificate badges.",
          "#certifications",
          handleSaveCertifications,
          "Save Certifications"
        )}

        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              Certificates ({certificationsList.length})
            </h3>
            <button
              type="button"
              onClick={() => {
                const newCert: CertificationItem = {
                  title: "National Skills Certificate in Web Design & Development (Level-3)",
                  issuer: "National Skills Development Authority (NSDA)",
                  description: "Govt. certified professional qualification verifying commercial web design, development, and freelancing competency.",
                  credentialUrl: "https://nsda.gov.bd",
                  date: "2024"
                };
                setCertificationsList([...certificationsList, newCert]);
                showToast("Added certification");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certification</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {certificationsList.map((cert, idx) => (
              <div
                key={cert.title + idx}
                className="p-5 rounded-2xl bg-[#050914] border border-white/10 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#00d2ff]">
                      Certificate #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={cert.date || ""}
                      onChange={(e) => {
                        const updated = [...certificationsList];
                        updated[idx] = { ...updated[idx], date: e.target.value };
                        setCertificationsList(updated);
                      }}
                      className="px-2 py-0.5 rounded bg-[#080e1e] border border-white/10 text-xs text-right font-mono text-[#00d2ff] outline-none"
                      placeholder="Date/Year"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Certificate Name
                    </label>
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) => {
                        const updated = [...certificationsList];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setCertificationsList(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Issuing Organization
                    </label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => {
                        const updated = [...certificationsList];
                        updated[idx] = { ...updated[idx], issuer: e.target.value };
                        setCertificationsList(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Credential / Verification URL
                    </label>
                    <input
                      type="text"
                      value={cert.credentialUrl || ""}
                      onChange={(e) => {
                        const updated = [...certificationsList];
                        updated[idx] = { ...updated[idx], credentialUrl: e.target.value };
                        setCertificationsList(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={cert.description}
                      onChange={(e) => {
                        const updated = [...certificationsList];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setCertificationsList(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove certificate "${cert.title}"?`)) {
                        setCertificationsList(certificationsList.filter((_, i) => i !== idx));
                        showToast("Certificate removed");
                      }
                    }}
                    className="p-1 rounded text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 8: FUTURE VISION & GOALS
  // =========================================================================
  if (activeSubPage === "vision") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "vision",
          "Future Vision & Goals Management",
          "Manage future architecture vision, data science expansion, and personal philosophy quote.",
          "#vision",
          handleSaveVision,
          "Save Future Vision"
        )}

        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Badge Label
              </label>
              <input
                type="text"
                value={visionForm.badge || ""}
                onChange={(e) => setVisionForm({ ...visionForm, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Heading Title
              </label>
              <input
                type="text"
                value={visionForm.heading || ""}
                onChange={(e) => setVisionForm({ ...visionForm, heading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs text-white outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Subtitle
              </label>
              <input
                type="text"
                value={visionForm.subtitle || ""}
                onChange={(e) => setVisionForm({ ...visionForm, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs text-white outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Vision Statement &amp; Description
              </label>
              <textarea
                rows={3}
                value={visionForm.description || ""}
                onChange={(e) => setVisionForm({ ...visionForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Personal Philosophy Quote
              </label>
              <input
                type="text"
                value={visionForm.quote || ""}
                onChange={(e) => setVisionForm({ ...visionForm, quote: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Quote Author
              </label>
              <input
                type="text"
                value={visionForm.quoteAuthor || ""}
                onChange={(e) => setVisionForm({ ...visionForm, quoteAuthor: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 9: FINAL CTA
  // =========================================================================
  if (activeSubPage === "cta") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "cta",
          "About Final CTA Banner Management",
          "Manage the bottom collaboration banner on the About page.",
          "#cta",
          handleSaveCta,
          "Save CTA Banner"
        )}

        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Badge Label
              </label>
              <input
                type="text"
                value={ctaForm.badge}
                onChange={(e) => setCtaForm({ ...ctaForm, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Main Title
              </label>
              <input
                type="text"
                value={ctaForm.title}
                onChange={(e) => setCtaForm({ ...ctaForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs text-white outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Description
              </label>
              <textarea
                rows={2}
                value={ctaForm.description}
                onChange={(e) => setCtaForm({ ...ctaForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Primary Button Label
              </label>
              <input
                type="text"
                value={ctaForm.primaryButtonText}
                onChange={(e) => setCtaForm({ ...ctaForm, primaryButtonText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Primary Button URL
              </label>
              <input
                type="text"
                value={ctaForm.primaryButtonUrl || "/contact"}
                onChange={(e) => setCtaForm({ ...ctaForm, primaryButtonUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 10: MILESTONES BY NUMBERS (STATISTICS)
  // =========================================================================
  if (activeSubPage === "stats") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "stats",
          "Milestones by Numbers Management",
          "Manage the bottom statistics grid on the About page: happy clients, projects completed, years of experience, and full-stack deployments.",
          "#stats",
          handleSaveStatsSection,
          "Save Milestones & Stats"
        )}

        {/* Section Header Controls */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d2ff] block">
              Statistics Section Header
            </span>
            <button
              type="button"
              onClick={() =>
                setStatsSectionForm({
                  ...statsSectionForm,
                  visible: statsSectionForm.visible === false ? true : false,
                })
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                statsSectionForm.visible !== false
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                  : "bg-white/5 border-white/10 text-slate-400"
              }`}
            >
              {statsSectionForm.visible !== false ? "Section: Visible" : "Section: Hidden"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Badge
              </label>
              <input
                type="text"
                value={statsSectionForm.badge || ""}
                onChange={(e) => setStatsSectionForm({ ...statsSectionForm, badge: e.target.value })}
                placeholder="e.g. PROVEN TRACK RECORD"
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                Title
              </label>
              <input
                type="text"
                value={statsSectionForm.title || ""}
                onChange={(e) => setStatsSectionForm({ ...statsSectionForm, title: e.target.value })}
                placeholder="e.g. Milestones by the"
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-[#00f0ff] block mb-1">
                Highlight Text
              </label>
              <input
                type="text"
                value={statsSectionForm.highlightText || ""}
                onChange={(e) => setStatsSectionForm({ ...statsSectionForm, highlightText: e.target.value })}
                placeholder="e.g. Numbers"
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-[#00d2ff]/30 text-xs text-[#00f0ff] outline-none focus:border-[#00d2ff]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={statsSectionForm.description || ""}
              onChange={(e) => setStatsSectionForm({ ...statsSectionForm, description: e.target.value })}
              placeholder="Key metrics demonstrating consistent commercial delivery..."
              className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
            />
          </div>
        </div>

        {/* Statistics Cards Grid */}
        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00d2ff]" />
              <span>Milestones Metric Cards ({statsList.length})</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                const newStat: StatItem = {
                  label: "Metric Label",
                  value: 100,
                  suffix: "+",
                  description: "High-impact delivery record",
                };
                setStatsList([...statsList, newStat]);
                showToast("Added milestone statistic");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Metric Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsList.map((stat, idx) => (
              <div
                key={stat.label + idx}
                className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono font-bold text-[#00d2ff]">
                    Metric #{idx + 1}
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                        Value (Number)
                      </label>
                      <input
                        type="number"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...statsList];
                          updated[idx] = { ...updated[idx], value: Number(e.target.value) || 0 };
                          setStatsList(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs font-bold text-white outline-none focus:border-[#00d2ff]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                        Suffix
                      </label>
                      <input
                        type="text"
                        value={stat.suffix || ""}
                        onChange={(e) => {
                          const updated = [...statsList];
                          updated[idx] = { ...updated[idx], suffix: e.target.value };
                          setStatsList(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                      Label
                    </label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...statsList];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setStatsList(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={stat.description || ""}
                      onChange={(e) => {
                        const updated = [...statsList];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setStatsList(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#080e1e] border border-white/10 text-[11px] text-slate-300 outline-none focus:border-[#00d2ff]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...statsList];
                        const temp = updated[idx - 1];
                        updated[idx - 1] = updated[idx];
                        updated[idx] = temp;
                        setStatsList(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Left"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === statsList.length - 1}
                      onClick={() => {
                        const updated = [...statsList];
                        const temp = updated[idx + 1];
                        updated[idx + 1] = updated[idx];
                        updated[idx] = temp;
                        setStatsList(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Right"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const dup = { ...stat, label: `${stat.label} (Copy)` };
                        const updated = [...statsList];
                        updated.splice(idx + 1, 0, dup);
                        setStatsList(updated);
                        showToast("Duplicated metric");
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStatsList(statsList.filter((_, i) => i !== idx));
                      showToast("Removed statistic");
                    }}
                    className="p-1 rounded text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBPAGE 11: PAGE SEO & META
  // =========================================================================
  if (activeSubPage === "seo") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "seo",
          "About Page SEO & Meta",
          "Manage the meta title, description, keywords, and Open Graph social sharing image for /about.",
          "",
          handleSaveSeo,
          "Save SEO Meta"
        )}

        <div className="p-6 rounded-2xl bg-[#080e1e]/90 border border-[#00d2ff]/20 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={seoForm.title}
                onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={seoForm.description}
                onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Keywords (Comma-separated)
              </label>
              <input
                type="text"
                value={seoForm.keywords}
                onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 focus:border-[#00d2ff] text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
                Social Sharing (Open Graph) Preview Image
              </label>
              <UniversalImageManager
                label="OG Image"
                imageUrl={seoForm.ogImage}
                fallbackUrl="/assets/profile-1-scaled.png"
                alt="About Social Preview"
                aspectRatio="video"
                onImageChange={(url) => setSeoForm({ ...seoForm, ogImage: url })}
                onImageRemove={() => setSeoForm({ ...seoForm, ogImage: "" })}
                onSaveImmediate={async (url) => {
                  setSeoForm((prev) => ({ ...prev, ogImage: url }));
                  const updatedPages = (cmsData.pages || []).map((p) =>
                    p.id === "about" ? { ...p, ogImage: url } : p
                  );
                  await updateCms({ pages: updatedPages });
                }}
                openMediaPicker={openMediaPicker}
                showToast={showToast}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
