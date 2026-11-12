"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  ExternalLink,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Globe,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Eye,
  ArrowUp,
  ArrowDown,
  X,
  FileText,
  Clock,
  Send,
  Upload,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Sliders,
  Check,
  Copy,
  Layers,
  Award,
  Zap,
  ShieldCheck,
  Download,
  Info,
  Image as ImageIcon,
  HelpCircle,
  Settings,
  ArrowRight
} from "lucide-react";
import { useCms } from "@/context/CmsContext";
import UniversalImageManager from "@/components/admin/UniversalImageManager";
import DynamicSocialIcon, { AVAILABLE_SOCIAL_PLATFORMS } from "@/components/icons/DynamicSocialIcon";
import {
  SocialLink,
  ContactHeroSettings,
  QuickContactChannelItem,
  ContactAvailabilityBadge,
  DirectReachHeader,
  DirectContactCardItem,
  OfficeWorkingHoursSettings,
  ContactFormFieldItem,
  ContactFormSettings,
  ResumeSettings,
  ContactVisibilitySettings,
  ContactSeoSettings
} from "@/types/portfolio";

interface AdminContactSocialCmsProps {
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  openMediaPicker?: (callback: (url: string) => void) => void;
  activeSubPage?: string;
  onSubPageChange?: (subPage: string) => void;
}

export type ContactSectionKey =
  | "overview"
  | "hero"
  | "quick-channels"
  | "availability"
  | "direct-reach"
  | "office-hours"
  | "form"
  | "resume"
  | "social"
  | "visibility-theme"
  | "seo";

export default function AdminContactSocialCms({
  showToast,
  openMediaPicker,
  activeSubPage: externalSubPage,
  onSubPageChange: externalSetSubPage
}: AdminContactSocialCmsProps) {
  const { cmsData, updateCms } = useCms();

  const [internalSubPage, setInternalSubPage] = useState<ContactSectionKey>("overview");
  const activeSubPage = (externalSubPage as ContactSectionKey) || internalSubPage;

  const setActiveSubPage = (page: ContactSectionKey) => {
    setInternalSubPage(page);
    if (externalSetSubPage) {
      externalSetSubPage(page);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  // 1. Hero Settings State
  const defaultHero: ContactHeroSettings = {
    badge: "LET'S WORK TOGETHER // DIRECT INQUIRIES",
    badgeIcon: "Sparkles",
    heading: "Have a Vision? Let's Turn It Into Digital Reality.",
    headingHighlight1: "Vision?",
    headingHighlight2: "Digital Reality.",
    headingLineBreak: false,
    highlightedWords: "Digital Reality.",
    description:
      "Available for freelance projects, custom WordPress architectures, WooCommerce systems, and full-stack software development collaborations. Let's discuss your vision and build something extraordinary.",
    backgroundUrl: "/assets/developer-workstation-hd.jpg",
    backgroundAlt: "Developer Workstation & Setup",
    backgroundOverlay: true,
    backgroundOverlayStrength: 50,
    showMountainRidge: true,
    showNeonGlowLine: true,
    showAmbientGlow: true,
    availabilityText: "Available for New Projects",
    quickChannelsTitle: "FAST CONTACT CHANNELS",
  };

  const [heroForm, setHeroForm] = useState<ContactHeroSettings>({
    ...defaultHero,
    ...(cmsData.contactHero || {}),
  });

  // 2. Quick Contact Channels State
  const defaultQuickChannels: QuickContactChannelItem[] = [
    {
      id: "qc-1",
      label: "WhatsApp Instant:",
      icon: "MessageCircle",
      value: cmsData.contactInfo?.phone || "01733119269",
      link: cmsData.contactInfo?.whatsapp || "https://wa.me/8801733119269?text=Hi%20Tarek,%20I%20want%20to%20talk%20about%20a%20project.",
      colorClass: "text-emerald-400",
      order: 1,
      enabled: true,
    },
    {
      id: "qc-2",
      label: "Direct Email:",
      icon: "Mail",
      value: cmsData.contactInfo?.email || "tarekrahaman186@gmail.com",
      link: `mailto:${cmsData.contactInfo?.email || "tarekrahaman186@gmail.com"}`,
      colorClass: "text-[#00d2ff]",
      order: 2,
      enabled: true,
    },
    {
      id: "qc-3",
      label: "Working Days:",
      icon: "Clock",
      value: cmsData.contactInfo?.workingHours || "Sat – Thu (10am–8pm)",
      link: "",
      colorClass: "text-white",
      order: 3,
      enabled: true,
    },
  ];

  const [quickChannels, setQuickChannels] = useState<QuickContactChannelItem[]>(
    cmsData.quickContactChannels && cmsData.quickContactChannels.length > 0
      ? cmsData.quickContactChannels
      : defaultQuickChannels
  );

  // 3. Availability Badges State
  const defaultAvailabilityBadges: ContactAvailabilityBadge[] = [
    {
      id: "ab-1",
      text: heroForm.availabilityText || "Available for New Projects",
      icon: "Sparkles",
      accentStyle: "emerald",
      showPing: true,
      order: 1,
      enabled: true,
    },
    {
      id: "ab-2",
      text: "Typical Response < 2 Hours",
      icon: "Clock",
      accentStyle: "cyan",
      showPing: false,
      order: 2,
      enabled: true,
    },
    {
      id: "ab-3",
      text: "Worldwide Remote Delivery",
      icon: "Globe",
      accentStyle: "purple",
      showPing: false,
      order: 3,
      enabled: true,
    },
  ];

  const [availabilityBadges, setAvailabilityBadges] = useState<ContactAvailabilityBadge[]>(
    cmsData.contactAvailabilityBadges && cmsData.contactAvailabilityBadges.length > 0
      ? cmsData.contactAvailabilityBadges
      : defaultAvailabilityBadges
  );

  // 4. Direct Reach Header & Cards State
  const [directHeader, setDirectHeader] = useState<DirectReachHeader>(
    cmsData.directReachHeader || {
      badge: "DIRECT REACH",
      heading: "Get In Touch Directly",
      description:
        "Available for freelance projects, full-stack website design, e-commerce stores, and software development collaborations.",
    }
  );

  const defaultDirectCards: DirectContactCardItem[] = [
    {
      id: "dcc-1",
      icon: "MessageCircle",
      badge: "WhatsApp (Instant Reply)",
      badgeColor: "emerald",
      value: cmsData.contactInfo?.phone || "01733119269",
      secondaryInfo: "",
      link: cmsData.contactInfo?.whatsapp || "https://wa.me/8801733119269?text=Hi%20Tarek,%20I%20want%20to%20talk%20about%20a%20project.",
      isLink: true,
      order: 1,
      enabled: true,
    },
    {
      id: "dcc-2",
      icon: "Mail",
      badge: "Primary Email",
      badgeColor: "cyan",
      value: cmsData.contactInfo?.email || "tarekrahaman186@gmail.com",
      secondaryInfo: `Alt: ${cmsData.contactInfo?.alternateEmail || "wde3716@gmail.com"}`,
      link: `mailto:${cmsData.contactInfo?.email || "tarekrahaman186@gmail.com"}`,
      isLink: true,
      order: 2,
      enabled: true,
    },
    {
      id: "dcc-3",
      icon: "Phone",
      badge: "Direct Call",
      badgeColor: "cyan",
      value: cmsData.contactInfo?.phone || "01733119269",
      secondaryInfo: `Alt: ${cmsData.contactInfo?.alternatePhone || "01840019449"}`,
      link: `tel:${cmsData.contactInfo?.phone || "01733119269"}`,
      isLink: true,
      order: 3,
      enabled: true,
    },
    {
      id: "dcc-4",
      icon: "MapPin",
      badge: "Office Location",
      badgeColor: "purple",
      value: cmsData.contactInfo?.location || "Mirpur-1, Dhaka, Bangladesh",
      secondaryInfo: "",
      link: "https://maps.google.com/?q=Mirpur-1,Dhaka,Bangladesh",
      isLink: false,
      order: 4,
      enabled: true,
    },
  ];

  const [directCards, setDirectCards] = useState<DirectContactCardItem[]>(
    cmsData.directContactCards && cmsData.directContactCards.length > 0
      ? cmsData.directContactCards
      : defaultDirectCards
  );

  // 5. Office & Working Hours State
  const [officeHours, setOfficeHours] = useState<OfficeWorkingHoursSettings>(
    cmsData.officeWorkingHours || {
      officeLocation: cmsData.contactInfo?.location || "Mirpur-1, Dhaka, Bangladesh",
      locationIcon: "MapPin",
      locationUrl: "https://maps.google.com/?q=Mirpur-1,Dhaka,Bangladesh",
      workingHours: cmsData.contactInfo?.workingHours || "Sat - Thu (10:00 AM - 8:00 PM)",
      workingHoursIcon: "Clock",
      additionalOfficeInfo: "Available for scheduled in-person and Google Meet architectural consultations.",
      enabled: true,
    }
  );

  // 6. Contact Form Settings State
  const defaultFields: ContactFormFieldItem[] = [
    {
      id: "f-name",
      name: "name",
      label: "Your Name *",
      placeholder: "e.g. John Doe",
      type: "text",
      required: true,
      halfWidth: true,
      enabled: true,
      order: 1,
    },
    {
      id: "f-email",
      name: "email",
      label: "Your Email *",
      placeholder: "john@example.com",
      type: "email",
      required: true,
      halfWidth: true,
      enabled: true,
      order: 2,
    },
    {
      id: "f-phone",
      name: "phone",
      label: "Phone Number",
      placeholder: "+880 1XXX XXXXXX",
      type: "tel",
      required: false,
      halfWidth: true,
      enabled: true,
      order: 3,
    },
    {
      id: "f-subject",
      name: "subject",
      label: "Subject / Project Type",
      placeholder: "e.g. WooCommerce E-Commerce Store",
      type: "text",
      required: false,
      halfWidth: true,
      enabled: true,
      order: 4,
    },
    {
      id: "f-message",
      name: "message",
      label: "Message *",
      placeholder: "Describe your project, timeline, or requirements...",
      type: "textarea",
      required: true,
      halfWidth: false,
      enabled: true,
      order: 5,
    },
  ];

  const defaultFormSettings: ContactFormSettings = {
    heading: "Send A Message",
    description: "Fill out the form below to get in touch about a new project.",
    recipientEmail: "tarekrahaman186@gmail.com",
    submitButtonText: "Send Message",
    submitButtonIcon: "Send",
    submittingText: "Sending...",
    successHeading: "Message Sent Successfully!",
    successMessage:
      "Your message has been sent successfully. Tarek Rahaman will review your details and get back to you very soon!",
    resetButtonText: "Send Another Message",
    errorMessage: "Failed to send message. Please contact directly via WhatsApp.",
    fields: defaultFields,
  };

  const [formSettings, setFormSettings] = useState<ContactFormSettings>({
    ...defaultFormSettings,
    ...(cmsData.contactFormSettings || {}),
    fields: cmsData.contactFormSettings?.fields && cmsData.contactFormSettings.fields.length > 0
      ? cmsData.contactFormSettings.fields
      : defaultFields,
  });

  // 7. Resume Download Settings State
  const [resumeSettings, setResumeSettings] = useState<ResumeSettings>(
    cmsData.resumeSettings || {
      title: "Need an official resume?",
      description: "Tarek Rahaman CV Resume (PDF)",
      fileUrl: "/assets/Tarek-Rahaman-Professional-CV-Resume.pdf",
      buttonLabel: "Download",
      buttonIcon: "Download",
      downloadFileName: "Tarek-Rahaman-CV.pdf",
      enabled: true,
    }
  );

  // 8. Social Media Links State
  const defaultSocialLinks: SocialLink[] = [
    { name: "Facebook", url: "https://www.facebook.com/tarak.rahoman.3", icon: "Facebook", active: true, order: 1 },
    { name: "Instagram", url: "https://www.instagram.com/tarekrahaman24/", icon: "Instagram", active: true, order: 2 },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/tarek-rahaman/", icon: "Linkedin", active: true, order: 3 },
    { name: "WhatsApp", url: "https://wa.me/8801733119269", icon: "MessageCircle", active: true, order: 4 },
    { name: "GitHub", url: "https://github.com/tarekrahaman", icon: "Github", active: true, order: 5 },
  ];

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    cmsData.profile?.socialLinks && cmsData.profile.socialLinks.length > 0
      ? cmsData.profile.socialLinks
      : defaultSocialLinks
  );

  // 9. Section Visibility & Visual Settings State
  const [visibilitySettings, setVisibilitySettings] = useState<ContactVisibilitySettings>(
    cmsData.contactVisibility || {
      showHero: true,
      showQuickChannels: true,
      showAvailabilityBadges: true,
      showDirectReach: true,
      showContactForm: true,
      showOfficeHours: true,
      showResumeCard: true,
      showWaveDivider: true,
      showMountainRidge: true,
      showNeonGlowLine: true,
      showAmbientGlow: true,
      accentColor: "#00d2ff",
    }
  );

  // 10. Page SEO & OG State
  const contactPage = cmsData.pages?.find((p) => p.id === "contact" || p.slug === "contact");
  const [seoForm, setSeoForm] = useState<ContactSeoSettings>(
    cmsData.contactSeo || {
      title: contactPage?.title || "Contact & Direct Consultation | Tarek Rahaman",
      description:
        contactPage?.seoDesc ||
        "Get in touch with Tarek Rahaman for web development projects, custom WordPress architectures, WooCommerce systems, and Laravel applications.",
      keywords:
        contactPage?.keywords ||
        "Contact Tarek Rahaman, Hire Web Developer Bangladesh, WordPress Consultant Dhaka, Full-Stack Engineer, Laravel Freelancer",
      canonicalUrl: "https://tarekrahaman.me/contact",
      ogTitle: "Contact & Direct Consultation | Tarek Rahaman",
      ogDescription:
        "Available for freelance contracts, full-stack website design, e-commerce stores, and enterprise digital solutions.",
      ogImage: "/assets/developer-workstation-hd.jpg",
    }
  );

  // Modals State
  const [quickChannelModal, setQuickChannelModal] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    index: number;
    data: Partial<QuickContactChannelItem>;
  }>({
    isOpen: false,
    mode: "add",
    index: -1,
    data: {},
  });

  const [badgeModal, setBadgeModal] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    index: number;
    data: Partial<ContactAvailabilityBadge>;
  }>({
    isOpen: false,
    mode: "add",
    index: -1,
    data: {},
  });

  const [directCardModal, setDirectCardModal] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    index: number;
    data: Partial<DirectContactCardItem>;
  }>({
    isOpen: false,
    mode: "add",
    index: -1,
    data: {},
  });

  const [fieldModal, setFieldModal] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    index: number;
    data: Partial<ContactFormFieldItem>;
  }>({
    isOpen: false,
    mode: "add",
    index: -1,
    data: {},
  });

  const [socialModal, setSocialModal] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    index: number;
    data: Partial<SocialLink>;
  }>({
    isOpen: false,
    mode: "add",
    index: -1,
    data: {},
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // Unified save handler
  const handleSaveAll = async (sectionName: string, customPayload?: any) => {
    setIsSaving(true);
    try {
      const updatedPages = (cmsData.pages || []).map((p) =>
        p.id === "contact" || p.slug === "contact"
          ? {
              ...p,
              title: seoForm.title || p.title,
              seoTitle: seoForm.title || p.seoTitle,
              seoDesc: seoForm.description || p.seoDesc,
              keywords: seoForm.keywords || p.keywords,
              ogImage: seoForm.ogImage || p.ogImage,
            }
          : p
      );

      const updatedProfile = {
        ...(cmsData.profile || {}),
        socialLinks: socialLinks,
        cvUrl: resumeSettings.fileUrl,
        location: officeHours.officeLocation || cmsData.profile?.location,
      };

      const updatedContactInfo = {
        ...(cmsData.contactInfo || {}),
        location: officeHours.officeLocation || cmsData.contactInfo?.location,
        workingHours: officeHours.workingHours || cmsData.contactInfo?.workingHours,
      };

      const payload = {
        contactHero: heroForm,
        quickContactChannels: quickChannels,
        contactAvailabilityBadges: availabilityBadges,
        directReachHeader: directHeader,
        directContactCards: directCards,
        officeWorkingHours: officeHours,
        contactFormSettings: formSettings,
        resumeSettings: resumeSettings,
        contactVisibility: visibilitySettings,
        contactSeo: seoForm,
        contactInfo: updatedContactInfo,
        profile: updatedProfile,
        pages: updatedPages,
        ...customPayload,
      };

      await updateCms(payload);
      showToast(`Saved ${sectionName} changes successfully!`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Section cards for Overview Hub
  const contactSections = [
    {
      id: "hero" as ContactSectionKey,
      number: "01",
      name: "Contact Hero Banner",
      desc: "Badge, headline, dual glow highlights, description, background image, workstation visual & cyber effects",
      icon: Sparkles,
    },
    {
      id: "quick-channels" as ContactSectionKey,
      number: "02",
      name: "Quick Contact Channels",
      desc: "Fast contact channels panel (WhatsApp instant, email, working hours, and custom channels CRUD)",
      icon: MessageCircle,
    },
    {
      id: "availability" as ContactSectionKey,
      number: "03",
      name: "Availability Badges",
      desc: "Glow badges row under hero (Available for projects, 2hr response, worldwide delivery CRUD)",
      icon: Clock,
    },
    {
      id: "direct-reach" as ContactSectionKey,
      number: "04",
      name: "Direct Reach Cards",
      desc: "Section header and contact cards (WhatsApp, Primary Email, Direct Call, Office Location CRUD)",
      icon: Mail,
    },
    {
      id: "office-hours" as ContactSectionKey,
      number: "05",
      name: "Location & Working Hours",
      desc: "Office physical address, map link, working schedule, and Google Meet consultation notes",
      icon: MapPin,
    },
    {
      id: "form" as ContactSectionKey,
      number: "06",
      name: "Contact Form Management",
      desc: "Form headers, submit button, success/error feedback, and dynamic form fields CRUD with validation",
      icon: Send,
    },
    {
      id: "resume" as ContactSectionKey,
      number: "07",
      name: "Resume / CV Download",
      desc: "Download card title, description, button label, icon, PDF file upload, and custom download file name",
      icon: FileText,
    },
    {
      id: "social" as ContactSectionKey,
      number: "08",
      name: "Social Media Hub",
      desc: "Manage global social links (Facebook, Instagram, LinkedIn, GitHub, WhatsApp, YouTube)",
      icon: Share2,
    },
    {
      id: "visibility-theme" as ContactSectionKey,
      number: "09",
      name: "Visibility & Visuals",
      desc: "Independent section toggles (hero, channels, badges, direct reach, form, resume, mountain SVG, neon line)",
      icon: Sliders,
    },
    {
      id: "seo" as ContactSectionKey,
      number: "10",
      name: "Page SEO & Open Graph",
      desc: "Meta title, 160-char description counter, keywords, canonical URL, OG Title, and share card image",
      icon: Globe,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#060c1d] via-[#08132d] to-[#060c1d] border border-[#00d2ff]/20 shadow-[0_0_30px_rgba(0,210,255,0.06)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00d2ff]">
            <Link href="/admin" className="hover:underline opacity-80">
              Admin
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span>Contact &amp; Social CMS</span>
            {activeSubPage !== "overview" && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-white font-bold capitalize">
                  {contactSections.find((s) => s.id === activeSubPage)?.name || activeSubPage}
                </span>
              </>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-[#00d2ff]" />
            Contact Page &amp; Communication Management
          </h2>
          <p className="text-xs text-slate-400">
            100% dynamic control over every heading, phone, email, card, badge, form label, and resume file on <span className="font-mono text-[#00d2ff]">/contact</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Link
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#091124] hover:bg-[#0c1836] border border-[#00d2ff]/30 shadow-sm transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span>Live Contact</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            onClick={() => handleSaveAll(contactSections.find((s) => s.id === activeSubPage)?.name || "Contact")}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-[#050811] bg-gradient-to-r from-[#00d2ff] via-[#00a8ff] to-[#0072ff] hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,210,255,0.4)] disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setActiveSubPage("overview")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubPage === "overview"
              ? "bg-[#00d2ff] text-[#050811] shadow-[0_0_15px_rgba(0,210,255,0.4)]"
              : "bg-[#070e24] text-slate-300 hover:text-white hover:bg-[#0b173b] border border-white/5"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Overview Hub</span>
        </button>

        {contactSections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSubPage === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSubPage(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#00d2ff] text-[#050811] shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                  : "bg-[#070e24] text-slate-300 hover:text-white hover:bg-[#0b173b] border border-white/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.number}. {sec.name.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 0. OVERVIEW HUB                                          */}
      {/* ======================================================== */}
      {activeSubPage === "overview" && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Direct Cards</div>
              <div className="mt-1 text-2xl font-black text-white font-mono">{directCards.length}</div>
              <div className="mt-0.5 text-[10px] text-[#00d2ff]">
                {directCards.filter((c) => c.enabled !== false).length} Active
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#070e24] border border-emerald-500/20">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Quick Channels</div>
              <div className="mt-1 text-2xl font-black text-white font-mono">{quickChannels.length}</div>
              <div className="mt-0.5 text-[10px] text-emerald-400">
                {quickChannels.filter((c) => c.enabled !== false).length} Active
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#070e24] border border-cyan-500/20">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Badges</div>
              <div className="mt-1 text-2xl font-black text-white font-mono">{availabilityBadges.length}</div>
              <div className="mt-0.5 text-[10px] text-cyan-400">Hero Pills</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#070e24] border border-blue-500/20">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Form Fields</div>
              <div className="mt-1 text-2xl font-black text-white font-mono">
                {formSettings.fields?.length || 5}
              </div>
              <div className="mt-0.5 text-[10px] text-blue-400">Interactive</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#070e24] border border-purple-500/20">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Social Links</div>
              <div className="mt-1 text-2xl font-black text-white font-mono">{socialLinks.length}</div>
              <div className="mt-0.5 text-[10px] text-purple-400">Connected</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#070e24] border border-rose-500/20">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">SEO Status</div>
              <div className="mt-1 text-2xl font-black text-emerald-400 font-mono">100%</div>
              <div className="mt-0.5 text-[10px] text-slate-400">Optimized</div>
            </div>
          </div>

          {/* Section Jump Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSubPage(sec.id)}
                  className="p-5 rounded-2xl bg-[#070e24] border border-white/10 hover:border-[#00d2ff]/50 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-[#00d2ff]">
                        {sec.number}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#00d2ff] transition-colors">
                        {sec.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        {sec.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white">
                    <span>Manage Section</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#00d2ff] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. CONTACT HERO BANNER CMS                               */}
      {/* ======================================================== */}
      {activeSubPage === "hero" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00d2ff]" />
                  Hero Typography &amp; Headlines
                </h3>
                <p className="text-xs text-slate-400">
                  Manage the top badge, heading, dual-color highlights, line breaks, and description.
                </p>
              </div>
              <button
                onClick={() => handleSaveAll("Contact Hero")}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
              >
                Save Hero
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Hero Top Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={heroForm.badge}
                  onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                  placeholder="LET'S WORK TOGETHER // DIRECT INQUIRIES"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Badge Icon
                </label>
                <select
                  value={heroForm.badgeIcon || "Sparkles"}
                  onChange={(e) => setHeroForm({ ...heroForm, badgeIcon: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                >
                  <option value="Sparkles">Sparkles</option>
                  <option value="Globe">Globe</option>
                  <option value="Mail">Mail</option>
                  <option value="Send">Send</option>
                  <option value="Zap">Zap</option>
                  <option value="ShieldCheck">ShieldCheck</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Main Heading Text
                </label>
                <input
                  type="text"
                  value={heroForm.heading}
                  onChange={(e) => setHeroForm({ ...heroForm, heading: e.target.value })}
                  placeholder="Have a Vision? Let's Turn It Into Digital Reality."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Heading Highlight #1 (Cyan Glow)
                </label>
                <input
                  type="text"
                  value={heroForm.headingHighlight1 || ""}
                  onChange={(e) => setHeroForm({ ...heroForm, headingHighlight1: e.target.value })}
                  placeholder="e.g. Vision?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Heading Highlight #2 (Blue/Purple Glow)
                </label>
                <input
                  type="text"
                  value={heroForm.headingHighlight2 || ""}
                  onChange={(e) => setHeroForm({ ...heroForm, headingHighlight2: e.target.value })}
                  placeholder="e.g. Digital Reality."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div className="flex items-center gap-3 md:col-span-2">
                <input
                  type="checkbox"
                  id="contactHeroLineBreak"
                  checked={heroForm.headingLineBreak || false}
                  onChange={(e) => setHeroForm({ ...heroForm, headingLineBreak: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#00d2ff]"
                />
                <label htmlFor="contactHeroLineBreak" className="text-xs text-slate-300 cursor-pointer">
                  Break heading into a new line before highlight words
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Hero Paragraph / Description
                </label>
                <textarea
                  rows={3}
                  value={heroForm.description}
                  onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Quick Channels Box Title (Right Column)
                </label>
                <input
                  type="text"
                  value={heroForm.quickChannelsTitle || "FAST CONTACT CHANNELS"}
                  onChange={(e) => setHeroForm({ ...heroForm, quickChannelsTitle: e.target.value })}
                  placeholder="FAST CONTACT CHANNELS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Background Workstation Visual & Cyber Effects */}
          <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#00d2ff]" />
                Hero Background Workstation Visual &amp; Effects
              </h3>
              <p className="text-xs text-slate-400">
                Upload or replace the developer workstation background image, adjust overlays, and toggle cyber silhouettes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <UniversalImageManager
                  label="Hero Workstation Background Image"
                  imageUrl={heroForm.backgroundUrl || "/assets/developer-workstation-hd.jpg"}
                  alt={heroForm.backgroundAlt || "Developer Workstation"}
                  aspectRatio="wide"
                  openMediaPicker={openMediaPicker}
                  showToast={showToast}
                  onImageChange={(newUrl) => setHeroForm({ ...heroForm, backgroundUrl: newUrl })}
                  onImageRemove={() => setHeroForm({ ...heroForm, backgroundUrl: "" })}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Background Image Alt Text
                </label>
                <input
                  type="text"
                  value={heroForm.backgroundAlt || ""}
                  onChange={(e) => setHeroForm({ ...heroForm, backgroundAlt: e.target.value })}
                  placeholder="Developer Workstation & Setup"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Background Overlay Strength ({heroForm.backgroundOverlayStrength ?? 50}%)
                </label>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={heroForm.backgroundOverlayStrength ?? 50}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, backgroundOverlayStrength: parseInt(e.target.value) })
                  }
                  className="w-full accent-[#00d2ff] cursor-pointer mt-2"
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#040815] border border-white/5">
                  <input
                    type="checkbox"
                    id="showMountainRidgeToggle"
                    checked={heroForm.showMountainRidge !== false}
                    onChange={(e) => setHeroForm({ ...heroForm, showMountainRidge: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#00d2ff]"
                  />
                  <label htmlFor="showMountainRidgeToggle" className="text-xs text-slate-300 cursor-pointer">
                    Mountain Silhouette SVG
                  </label>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#040815] border border-white/5">
                  <input
                    type="checkbox"
                    id="showNeonGlowLineToggle"
                    checked={heroForm.showNeonGlowLine !== false}
                    onChange={(e) => setHeroForm({ ...heroForm, showNeonGlowLine: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#00d2ff]"
                  />
                  <label htmlFor="showNeonGlowLineToggle" className="text-xs text-slate-300 cursor-pointer">
                    Bottom Glowing Neon Line
                  </label>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#040815] border border-white/5">
                  <input
                    type="checkbox"
                    id="showAmbientGlowToggle"
                    checked={heroForm.showAmbientGlow !== false}
                    onChange={(e) => setHeroForm({ ...heroForm, showAmbientGlow: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#00d2ff]"
                  />
                  <label htmlFor="showAmbientGlowToggle" className="text-xs text-slate-300 cursor-pointer">
                    Cyan &amp; Purple Blur Lighting
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. QUICK CONTACT CHANNELS CMS                            */}
      {/* ======================================================== */}
      {activeSubPage === "quick-channels" && (
        <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#00d2ff]" />
                Quick Contact Channels (Right Column Panel)
              </h3>
              <p className="text-xs text-slate-400">
                Manage WhatsApp, Email, Working Days, or add any custom instant channel.
              </p>
            </div>

            <button
              onClick={() => {
                setQuickChannelModal({
                  isOpen: true,
                  mode: "add",
                  index: -1,
                  data: {
                    id: `qc-${Date.now()}`,
                    label: "Channel Label:",
                    icon: "MessageCircle",
                    value: "Contact Value",
                    link: "",
                    colorClass: "text-[#00d2ff]",
                    order: quickChannels.length + 1,
                    enabled: true,
                  },
                });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Channel</span>
            </button>
          </div>

          <div className="space-y-3">
            {quickChannels.map((channel, idx) => (
              <div
                key={channel.id || idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#040815] border border-white/5 hover:border-[#00d2ff]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-500 w-6">#{idx + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{channel.label}</span>
                      <span className={`text-xs font-bold ${channel.colorClass || "text-white"}`}>
                        {channel.value}
                      </span>
                      {channel.enabled === false && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                          Hidden
                        </span>
                      )}
                    </div>
                    {channel.link && (
                      <span className="text-[10px] text-slate-500 font-mono truncate max-w-sm block">
                        Link: {channel.link}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    disabled={idx === 0}
                    onClick={() => {
                      if (idx === 0) return;
                      const updated = [...quickChannels];
                      const temp = updated[idx];
                      updated[idx] = updated[idx - 1];
                      updated[idx - 1] = temp;
                      setQuickChannels(updated);
                    }}
                    className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-white disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    disabled={idx === quickChannels.length - 1}
                    onClick={() => {
                      if (idx === quickChannels.length - 1) return;
                      const updated = [...quickChannels];
                      const temp = updated[idx];
                      updated[idx] = updated[idx + 1];
                      updated[idx + 1] = temp;
                      setQuickChannels(updated);
                    }}
                    className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-white disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setQuickChannelModal({
                        isOpen: true,
                        mode: "edit",
                        index: idx,
                        data: { ...channel },
                      });
                    }}
                    className="p-1.5 rounded-lg bg-[#070e24] text-slate-300 hover:text-[#00d2ff]"
                    title="Edit Channel"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setDeleteConfirm({
                        isOpen: true,
                        title: `Delete "${channel.label}"?`,
                        description: "This contact channel will be removed from the Hero fast channels card.",
                        onConfirm: () => {
                          setQuickChannels(quickChannels.filter((_, i) => i !== idx));
                          setDeleteConfirm({ ...deleteConfirm, isOpen: false });
                        },
                      });
                    }}
                    className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-red-400"
                    title="Delete Channel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. AVAILABILITY BADGES CMS                               */}
      {/* ======================================================== */}
      {activeSubPage === "availability" && (
        <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00d2ff]" />
                Hero Availability Badges (Pills Row)
              </h3>
              <p className="text-xs text-slate-400">
                Manage the glowing response pills (Available for projects, 2hr response, worldwide remote delivery).
              </p>
            </div>

            <button
              onClick={() => {
                setBadgeModal({
                  isOpen: true,
                  mode: "add",
                  index: -1,
                  data: {
                    id: `ab-${Date.now()}`,
                    text: "New Assurance Badge",
                    icon: "CheckCircle2",
                    accentStyle: "cyan",
                    showPing: false,
                    order: availabilityBadges.length + 1,
                    enabled: true,
                  },
                });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Badge</span>
            </button>
          </div>

          <div className="space-y-3">
            {availabilityBadges.map((badge, idx) => (
              <div
                key={badge.id || idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#040815] border border-white/5 hover:border-[#00d2ff]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-500 w-6">#{idx + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{badge.text}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-[#00d2ff] border border-white/10">
                        {badge.accentStyle}
                      </span>
                      {badge.showPing && (
                        <span className="w-2 h-2 rounded-full bg-[#00ff9f] animate-ping" title="Pulsing dot active" />
                      )}
                      {badge.enabled === false && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    disabled={idx === 0}
                    onClick={() => {
                      if (idx === 0) return;
                      const updated = [...availabilityBadges];
                      const temp = updated[idx];
                      updated[idx] = updated[idx - 1];
                      updated[idx - 1] = temp;
                      setAvailabilityBadges(updated);
                    }}
                    className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-white disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    disabled={idx === availabilityBadges.length - 1}
                    onClick={() => {
                      if (idx === availabilityBadges.length - 1) return;
                      const updated = [...availabilityBadges];
                      const temp = updated[idx];
                      updated[idx] = updated[idx + 1];
                      updated[idx + 1] = temp;
                      setAvailabilityBadges(updated);
                    }}
                    className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-white disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setBadgeModal({
                        isOpen: true,
                        mode: "edit",
                        index: idx,
                        data: { ...badge },
                      });
                    }}
                    className="p-1.5 rounded-lg bg-[#070e24] text-slate-300 hover:text-[#00d2ff]"
                    title="Edit Badge"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setDeleteConfirm({
                        isOpen: true,
                        title: `Delete Badge "${badge.text}"?`,
                        description: "This availability badge will be removed from the Hero section.",
                        onConfirm: () => {
                          setAvailabilityBadges(availabilityBadges.filter((_, i) => i !== idx));
                          setDeleteConfirm({ ...deleteConfirm, isOpen: false });
                        },
                      });
                    }}
                    className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-red-400"
                    title="Delete Badge"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. DIRECT REACH SECTION CMS                              */}
      {/* ======================================================== */}
      {activeSubPage === "direct-reach" && (
        <div className="space-y-6">
          {/* Section Header Controls */}
          <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-4">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00d2ff]" />
                Direct Reach Section Header
              </h3>
              <p className="text-xs text-slate-400">
                The eyebrow badge, main heading, and intro description displayed above the direct cards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Eyebrow Badge Text
                </label>
                <input
                  type="text"
                  value={directHeader.badge || "DIRECT REACH"}
                  onChange={(e) => setDirectHeader({ ...directHeader, badge: e.target.value })}
                  placeholder="DIRECT REACH"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Main Heading Text
                </label>
                <input
                  type="text"
                  value={directHeader.heading || "Get In Touch Directly"}
                  onChange={(e) => setDirectHeader({ ...directHeader, heading: e.target.value })}
                  placeholder="Get In Touch Directly"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Description Text
                </label>
                <textarea
                  rows={2}
                  value={directHeader.description || ""}
                  onChange={(e) => setDirectHeader({ ...directHeader, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Cards CRUD */}
          <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#00d2ff]" />
                  Direct Contact Cards List (Full CRUD)
                </h3>
                <p className="text-xs text-slate-400">
                  Manage WhatsApp, Primary Email, Direct Phone Call, and Office Location cards.
                </p>
              </div>

              <button
                onClick={() => {
                  setDirectCardModal({
                    isOpen: true,
                    mode: "add",
                    index: -1,
                    data: {
                      id: `dcc-${Date.now()}`,
                      icon: "Mail",
                      badge: "New Contact Channel",
                      badgeColor: "cyan",
                      value: "Contact Details",
                      secondaryInfo: "",
                      link: "mailto:example@domain.com",
                      isLink: true,
                      order: directCards.length + 1,
                      enabled: true,
                    },
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Contact Card</span>
              </button>
            </div>

            <div className="space-y-3">
              {directCards.map((card, idx) => (
                <div
                  key={card.id || idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#040815] border border-white/5 hover:border-[#00d2ff]/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-500 w-6">#{idx + 1}</span>
                    <div className="w-10 h-10 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#00d2ff]">
                          {card.badge}
                        </span>
                        {card.enabled === false && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            Hidden
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white">{card.value}</h4>
                      {card.secondaryInfo && (
                        <span className="text-[10px] text-slate-500 block">{card.secondaryInfo}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        const updated = [...directCards];
                        const temp = updated[idx];
                        updated[idx] = updated[idx - 1];
                        updated[idx - 1] = temp;
                        setDirectCards(updated);
                      }}
                      className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      disabled={idx === directCards.length - 1}
                      onClick={() => {
                        if (idx === directCards.length - 1) return;
                        const updated = [...directCards];
                        const temp = updated[idx];
                        updated[idx] = updated[idx + 1];
                        updated[idx + 1] = temp;
                        setDirectCards(updated);
                      }}
                      className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        const copyItem: DirectContactCardItem = {
                          ...card,
                          id: `dcc-${Date.now()}`,
                          badge: `${card.badge} (Copy)`,
                        };
                        const updated = [...directCards];
                        updated.splice(idx + 1, 0, copyItem);
                        setDirectCards(updated);
                        showToast(`Duplicated "${card.badge}"!`);
                      }}
                      className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-[#00d2ff]"
                      title="Duplicate Card"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setDirectCardModal({
                          isOpen: true,
                          mode: "edit",
                          index: idx,
                          data: { ...card },
                        });
                      }}
                      className="p-1.5 rounded-lg bg-[#070e24] text-slate-300 hover:text-[#00d2ff]"
                      title="Edit Card"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setDeleteConfirm({
                          isOpen: true,
                          title: `Delete "${card.badge}"?`,
                          description: "This contact card will be permanently removed.",
                          onConfirm: () => {
                            setDirectCards(directCards.filter((_, i) => i !== idx));
                            setDeleteConfirm({ ...deleteConfirm, isOpen: false });
                          },
                        });
                      }}
                      className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-red-400"
                      title="Delete Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. LOCATION & WORKING HOURS CMS                          */}
      {/* ======================================================== */}
      {activeSubPage === "office-hours" && (
        <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00d2ff]" />
                Office Physical Address &amp; Schedule
              </h3>
              <p className="text-xs text-slate-400">
                Customize office location, Google Maps URL, and working schedule hours.
              </p>
            </div>
            <button
              onClick={() => handleSaveAll("Office & Schedule")}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
            >
              Save Schedule
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Office Location Text
              </label>
              <input
                type="text"
                value={officeHours.officeLocation || ""}
                onChange={(e) => setOfficeHours({ ...officeHours, officeLocation: e.target.value })}
                placeholder="Mirpur-1, Dhaka, Bangladesh"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Google Maps Link / URL
              </label>
              <input
                type="text"
                value={officeHours.locationUrl || ""}
                onChange={(e) => setOfficeHours({ ...officeHours, locationUrl: e.target.value })}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Working Hours &amp; Schedule Text
              </label>
              <input
                type="text"
                value={officeHours.workingHours || ""}
                onChange={(e) => setOfficeHours({ ...officeHours, workingHours: e.target.value })}
                placeholder="Sat - Thu (10:00 AM - 8:00 PM)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Additional Office Note (Displayed below hours)
              </label>
              <input
                type="text"
                value={officeHours.additionalOfficeInfo || ""}
                onChange={(e) => setOfficeHours({ ...officeHours, additionalOfficeInfo: e.target.value })}
                placeholder="Available for scheduled in-person and Google Meet architectural consultations."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div className="flex items-center gap-3 md:col-span-2 pt-2">
              <input
                type="checkbox"
                id="officeHoursEnabledToggle"
                checked={officeHours.enabled !== false}
                onChange={(e) => setOfficeHours({ ...officeHours, enabled: e.target.checked })}
                className="w-4 h-4 rounded accent-[#00d2ff]"
              />
              <label htmlFor="officeHoursEnabledToggle" className="text-xs text-slate-300 cursor-pointer">
                Display Location &amp; Hours card on the live Contact page
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. CONTACT FORM MANAGEMENT CMS                           */}
      {/* ======================================================== */}
      {activeSubPage === "form" && (
        <div className="space-y-6">
          {/* Form Settings Card */}
          <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#00d2ff]" />
                  Contact Form Headings &amp; Button Text
                </h3>
                <p className="text-xs text-slate-400">
                  Manage title, description, recipient email, button label, and success messages.
                </p>
              </div>
              <button
                onClick={() => handleSaveAll("Contact Form")}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
              >
                Save Form
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Form Heading
                </label>
                <input
                  type="text"
                  value={formSettings.heading}
                  onChange={(e) => setFormSettings({ ...formSettings, heading: e.target.value })}
                  placeholder="Send A Message"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  value={formSettings.recipientEmail || ""}
                  onChange={(e) => setFormSettings({ ...formSettings, recipientEmail: e.target.value })}
                  placeholder="tarekrahaman186@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Form Description
                </label>
                <input
                  type="text"
                  value={formSettings.description}
                  onChange={(e) => setFormSettings({ ...formSettings, description: e.target.value })}
                  placeholder="Fill out the form below to get in touch about a new project."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Submit Button Text
                </label>
                <input
                  type="text"
                  value={formSettings.submitButtonText || "Send Message"}
                  onChange={(e) => setFormSettings({ ...formSettings, submitButtonText: e.target.value })}
                  placeholder="Send Message"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Submitting State Text
                </label>
                <input
                  type="text"
                  value={formSettings.submittingText || "Sending..."}
                  onChange={(e) => setFormSettings({ ...formSettings, submittingText: e.target.value })}
                  placeholder="Sending..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Success Modal Heading
                </label>
                <input
                  type="text"
                  value={formSettings.successHeading || "Message Sent Successfully!"}
                  onChange={(e) => setFormSettings({ ...formSettings, successHeading: e.target.value })}
                  placeholder="Message Sent Successfully!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Reset Button Label
                </label>
                <input
                  type="text"
                  value={formSettings.resetButtonText || "Send Another Message"}
                  onChange={(e) => setFormSettings({ ...formSettings, resetButtonText: e.target.value })}
                  placeholder="Send Another Message"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Success Message
                </label>
                <textarea
                  rows={2}
                  value={formSettings.successMessage || ""}
                  onChange={(e) => setFormSettings({ ...formSettings, successMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Form Fields CRUD */}
          <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#00d2ff]" />
                  Dynamic Form Fields (Labels, Placeholders &amp; Order)
                </h3>
                <p className="text-xs text-slate-400">
                  Add, customize, reorder, or toggle input fields rendered on the live contact form.
                </p>
              </div>

              <button
                onClick={() => {
                  setFieldModal({
                    isOpen: true,
                    mode: "add",
                    index: -1,
                    data: {
                      id: `f-${Date.now()}`,
                      name: `field_${Date.now()}`,
                      label: "Custom Field *",
                      placeholder: "Enter details...",
                      type: "text",
                      required: false,
                      halfWidth: true,
                      enabled: true,
                      order: (formSettings.fields?.length || 0) + 1,
                    },
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Field</span>
              </button>
            </div>

            <div className="space-y-3">
              {(formSettings.fields || []).map((field, idx) => (
                <div
                  key={field.id || idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#040815] border border-white/5 hover:border-[#00d2ff]/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-500 w-6">#{idx + 1}</span>
                    <div className="w-8 h-8 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{field.label}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-[#00d2ff] border border-white/10 uppercase">
                          {field.type}
                        </span>
                        {field.required && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Required
                          </span>
                        )}
                        {field.halfWidth && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            1/2 Col
                          </span>
                        )}
                        {field.enabled === false && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Placeholder: &quot;{field.placeholder}&quot;</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        const updated = [...(formSettings.fields || [])];
                        const temp = updated[idx];
                        updated[idx] = updated[idx - 1];
                        updated[idx - 1] = temp;
                        setFormSettings({ ...formSettings, fields: updated });
                      }}
                      className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      disabled={idx === (formSettings.fields || []).length - 1}
                      onClick={() => {
                        if (idx === (formSettings.fields || []).length - 1) return;
                        const updated = [...(formSettings.fields || [])];
                        const temp = updated[idx];
                        updated[idx] = updated[idx + 1];
                        updated[idx + 1] = temp;
                        setFormSettings({ ...formSettings, fields: updated });
                      }}
                      className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setFieldModal({
                          isOpen: true,
                          mode: "edit",
                          index: idx,
                          data: { ...field },
                        });
                      }}
                      className="p-1.5 rounded-lg bg-[#070e24] text-slate-300 hover:text-[#00d2ff]"
                      title="Edit Field"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setDeleteConfirm({
                          isOpen: true,
                          title: `Delete Field "${field.label}"?`,
                          description: "This input field will be removed from the contact form.",
                          onConfirm: () => {
                            setFormSettings({
                              ...formSettings,
                              fields: (formSettings.fields || []).filter((_, i) => i !== idx),
                            });
                            setDeleteConfirm({ ...deleteConfirm, isOpen: false });
                          },
                        });
                      }}
                      className="p-1.5 rounded-lg bg-[#070e24] text-slate-400 hover:text-red-400"
                      title="Delete Field"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. RESUME DOWNLOAD SECTION CMS                           */}
      {/* ======================================================== */}
      {activeSubPage === "resume" && (
        <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00d2ff]" />
                Resume / CV Download Card
              </h3>
              <p className="text-xs text-slate-400">
                Manage resume title, description, button label, downloadable PDF file URL, and custom download file name.
              </p>
            </div>
            <button
              onClick={() => handleSaveAll("Resume Settings")}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
            >
              Save Resume
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Card Title
              </label>
              <input
                type="text"
                value={resumeSettings.title}
                onChange={(e) => setResumeSettings({ ...resumeSettings, title: e.target.value })}
                placeholder="Need an official resume?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Card Description
              </label>
              <input
                type="text"
                value={resumeSettings.description}
                onChange={(e) => setResumeSettings({ ...resumeSettings, description: e.target.value })}
                placeholder="Tarek Rahaman CV Resume (PDF)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={resumeSettings.buttonLabel}
                onChange={(e) => setResumeSettings({ ...resumeSettings, buttonLabel: e.target.value })}
                placeholder="Download"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Download File Name (When clicked)
              </label>
              <input
                type="text"
                value={resumeSettings.downloadFileName || "Tarek-Rahaman-CV.pdf"}
                onChange={(e) => setResumeSettings({ ...resumeSettings, downloadFileName: e.target.value })}
                placeholder="Tarek-Rahaman-CV.pdf"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Resume PDF File URL / Asset Path
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={resumeSettings.fileUrl}
                  onChange={(e) => setResumeSettings({ ...resumeSettings, fileUrl: e.target.value })}
                  placeholder="/assets/Tarek-Rahaman-Professional-CV-Resume.pdf"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                />

                {openMediaPicker && (
                  <button
                    type="button"
                    onClick={() => {
                      openMediaPicker((url) => {
                        setResumeSettings({ ...resumeSettings, fileUrl: url });
                        showToast("Updated resume file URL!");
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-[#070e24] border border-[#00d2ff]/30 hover:border-[#00d2ff] cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#00d2ff]" />
                    <span>Upload PDF</span>
                  </button>
                )}

                <a
                  href={resumeSettings.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#040815] border border-white/10 text-slate-300 hover:text-[#00d2ff] shrink-0"
                  title="Test Download File"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 md:col-span-2 pt-2">
              <input
                type="checkbox"
                id="resumeEnabledToggle"
                checked={resumeSettings.enabled !== false}
                onChange={(e) => setResumeSettings({ ...resumeSettings, enabled: e.target.checked })}
                className="w-4 h-4 rounded accent-[#00d2ff]"
              />
              <label htmlFor="resumeEnabledToggle" className="text-xs text-slate-300 cursor-pointer">
                Display Resume / CV Download Card on the live Contact page
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. SOCIAL MEDIA HUB CMS                                  */}
      {/* ======================================================== */}
      {activeSubPage === "social" && (
        <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#00d2ff]" />
                  Global Social Media Channels (Website Floating Sidebar &amp; Footer)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20">
                  {socialLinks.filter((s) => s.active !== false).length} Active / {socialLinks.length} Total
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Manage all social links shown in the website&apos;s right-side floating sidebar and footer. Add, reorder, edit, disable, or delete anytime.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSocialModal({
                    isOpen: true,
                    mode: "add",
                    index: -1,
                    data: {
                      name: "LinkedIn",
                      url: "https://www.linkedin.com/in/",
                      icon: "LinkedIn",
                      active: true,
                      order: socialLinks.length + 1,
                    },
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.3)]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Social Link</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveAll("Social Media Hub")}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? "Saving..." : "Save Channels"}</span>
              </button>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-3.5 rounded-xl bg-[#040815]/80 border border-[#00d2ff]/20 flex items-start gap-3 text-xs text-slate-300">
            <Info className="w-4 h-4 text-[#00d2ff] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>
                <strong className="text-white">Live Synchronization:</strong> Active channels are instantly rendered on the website&apos;s right-side floating sidebar and open in a new tab (<code className="text-[#00d2ff] font-mono">target=&quot;_blank&quot;</code>).
              </p>
              <p className="text-slate-400 text-[11px]">
                Toggle the switch to &quot;Inactive&quot; to hide an icon without deleting it. Drag or use the up/down arrows to reorder display position.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {socialLinks.map((social, idx) => {
              const isActive = social.active !== false;
              return (
                <div
                  key={social.name || idx}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all ${
                    isActive
                      ? "bg-[#040815] border-white/10 hover:border-[#00d2ff]/40"
                      : "bg-[#040815]/50 border-white/5 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-slate-500 w-6 text-center font-bold">
                      #{idx + 1}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#070e24] border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.15)] shrink-0">
                      <DynamicSocialIcon
                        iconName={social.icon}
                        platformName={social.name}
                        className="w-5 h-5 text-[#00d2ff]"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{social.name}</span>
                        {social.icon && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-white/5 text-slate-400 border border-white/10">
                            icon: {social.icon}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...socialLinks];
                            updated[idx] = { ...social, active: !isActive };
                            setSocialLinks(updated);
                          }}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                            isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                          }`}
                          title="Click to toggle Active / Inactive"
                        >
                          {isActive ? "● Active" : "○ Inactive (Hidden)"}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400 font-mono truncate max-w-xs sm:max-w-md block">
                          {social.url || "No link provided"}
                        </span>
                        {social.url && (
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00d2ff] hover:underline inline-flex items-center gap-0.5 text-[10px] shrink-0"
                            title="Test open link in new tab"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Visit</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        const updated = [...socialLinks];
                        const temp = updated[idx];
                        updated[idx] = updated[idx - 1];
                        updated[idx - 1] = temp;
                        setSocialLinks(updated);
                      }}
                      className="p-2 rounded-lg bg-[#070e24] text-slate-400 hover:text-white disabled:opacity-30 border border-white/5 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === socialLinks.length - 1}
                      onClick={() => {
                        if (idx === socialLinks.length - 1) return;
                        const updated = [...socialLinks];
                        const temp = updated[idx];
                        updated[idx] = updated[idx + 1];
                        updated[idx + 1] = temp;
                        setSocialLinks(updated);
                      }}
                      className="p-2 rounded-lg bg-[#070e24] text-slate-400 hover:text-white disabled:opacity-30 border border-white/5 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSocialModal({
                          isOpen: true,
                          mode: "edit",
                          index: idx,
                          data: { ...social },
                        });
                      }}
                      className="p-2 rounded-lg bg-[#070e24] text-slate-300 hover:text-[#00d2ff] border border-white/5 cursor-pointer"
                      title="Edit Social Channel"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirm({
                          isOpen: true,
                          title: `Delete "${social.name}"?`,
                          description: "This social link will be completely removed from the website and dashboard.",
                          onConfirm: () => {
                            setSocialLinks(socialLinks.filter((_, i) => i !== idx));
                            setDeleteConfirm({ ...deleteConfirm, isOpen: false });
                          },
                        });
                      }}
                      className="p-2 rounded-lg bg-[#070e24] text-slate-400 hover:text-red-400 border border-white/5 cursor-pointer"
                      title="Delete Social Channel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Tip: Remember to click <strong className="text-emerald-400">Save Social Channels</strong> to persist your changes to the live site.
            </span>
            <button
              type="button"
              onClick={() => handleSaveAll("Social Media Hub")}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Social Channels"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. VISIBILITY & THEME CONTROLS CMS                       */}
      {/* ======================================================== */}
      {activeSubPage === "visibility-theme" && (
        <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00d2ff]" />
                Section Visibility &amp; Cyber Aesthetics
              </h3>
              <p className="text-xs text-slate-400">
                Independently toggle sections, wave dividers, and background lighting effects.
              </p>
            </div>
            <button
              onClick={() => handleSaveAll("Visibility & Theme")}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
            >
              Save Theme
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Page Section Switches</h4>

            {[
              { id: "showHero", label: "Contact Hero Banner", desc: "Top hero headline, badge, and background visual" },
              { id: "showQuickChannels", label: "Quick Contact Channels Box", desc: "Fast WhatsApp, email, and schedule panel on right of Hero" },
              { id: "showAvailabilityBadges", label: "Availability Badges", desc: "Response time & worldwide delivery pills row" },
              { id: "showDirectReach", label: "Direct Reach Section", desc: "Left column contact cards list" },
              { id: "showOfficeHours", label: "Office Location & Schedule Box", desc: "Address and consultation hours card" },
              { id: "showContactForm", label: "Contact Inquiry Form", desc: "Right column interactive message form" },
              { id: "showResumeCard", label: "Resume / CV Download Card", desc: "Curriculum vitae download card" },
              { id: "showWaveDivider", label: "Wave Section Divider", desc: "Futuristic wave transition line" },
              { id: "showMountainRidge", label: "Mountain Ridge Silhouette SVG", desc: "Cyber mountain ridge outline in Hero" },
              { id: "showNeonGlowLine", label: "Bottom Glowing Neon Line", desc: "Glowing bottom neon line border" },
              { id: "showAmbientGlow", label: "Atmospheric Ambient Glow Spheres", desc: "Background blur cyan & purple glow lighting" },
            ].map((toggleItem) => {
              const isChecked = (visibilitySettings as any)[toggleItem.id] !== false;
              return (
                <div
                  key={toggleItem.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#040815] border border-white/5"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{toggleItem.label}</div>
                    <div className="text-[11px] text-slate-400">{toggleItem.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) =>
                      setVisibilitySettings({ ...visibilitySettings, [toggleItem.id]: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-[#00d2ff] cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          {/* Theme Accent Color */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Theme Accent Color</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Primary Theme Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={visibilitySettings.accentColor || "#00d2ff"}
                    onChange={(e) =>
                      setVisibilitySettings({ ...visibilitySettings, accentColor: e.target.value })
                    }
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={visibilitySettings.accentColor || "#00d2ff"}
                    onChange={(e) =>
                      setVisibilitySettings({ ...visibilitySettings, accentColor: e.target.value })
                    }
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 10. PAGE SEO & OPEN GRAPH CMS                            */}
      {/* ======================================================== */}
      {activeSubPage === "seo" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#070e24] border border-[#00d2ff]/20 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#00d2ff]" />
                  Contact Page SEO &amp; Open Graph Meta
                </h3>
                <p className="text-xs text-slate-400">
                  Manage search engine titles, snippets, social share cards, and canonical tags for <span className="font-mono text-[#00d2ff]">/contact</span>.
                </p>
              </div>
              <button
                onClick={() => handleSaveAll("Contact SEO")}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#050811] bg-[#00d2ff] hover:opacity-90 transition-all cursor-pointer"
              >
                Save SEO
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-slate-300 uppercase">
                    Meta Title (Browser Tab &amp; Google SERP)
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {(seoForm.title || "").length} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={seoForm.title || ""}
                  onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
                  placeholder="Contact & Direct Consultation | Tarek Rahaman"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-slate-300 uppercase">
                    Meta Description (Search Snippet)
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    {(seoForm.description || "").length} / 160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={seoForm.description || ""}
                  onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
                  placeholder="Get in touch with Tarek Rahaman for web development projects..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Keywords (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    value={seoForm.keywords || ""}
                    onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                    placeholder="Contact Tarek Rahaman, Hire Web Developer, WordPress Consultant"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Canonical URL
                  </label>
                  <input
                    type="text"
                    value={seoForm.canonicalUrl || ""}
                    onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
                    placeholder="https://tarekrahaman.me/contact"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Open Graph (Social) Title
                  </label>
                  <input
                    type="text"
                    value={seoForm.ogTitle || ""}
                    onChange={(e) => setSeoForm({ ...seoForm, ogTitle: e.target.value })}
                    placeholder="Contact & Direct Consultation | Tarek Rahaman"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Open Graph (Social) Description
                  </label>
                  <input
                    type="text"
                    value={seoForm.ogDescription || ""}
                    onChange={(e) => setSeoForm({ ...seoForm, ogDescription: e.target.value })}
                    placeholder="Social share summary description..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <UniversalImageManager
                    label="Open Graph / Social Share Card Image"
                    imageUrl={seoForm.ogImage || "/assets/developer-workstation-hd.jpg"}
                    alt="SEO Social Share Image"
                    aspectRatio="wide"
                    openMediaPicker={openMediaPicker}
                    showToast={showToast}
                    onImageChange={(newUrl) => setSeoForm({ ...seoForm, ogImage: newUrl })}
                    onImageRemove={() => setSeoForm({ ...seoForm, ogImage: "" })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Google SERP Preview Card */}
          <div className="p-6 rounded-2xl bg-[#070e24] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00d2ff]">
              <Globe className="w-4 h-4" />
              <span>Live Google Search SERP Preview</span>
            </div>
            <div className="p-4 rounded-xl bg-[#202124] text-left max-w-2xl border border-white/5 space-y-1">
              <div className="text-[11px] font-sans text-[#bdc1c6] truncate">
                {seoForm.canonicalUrl || "https://tarekrahaman.me/contact"}
              </div>
              <h4 className="text-base font-medium text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                {seoForm.title || "Contact & Direct Consultation | Tarek Rahaman"}
              </h4>
              <p className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
                {seoForm.description ||
                  "Get in touch with Tarek Rahaman for web development projects, custom WordPress architectures, WooCommerce systems, and Laravel applications."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT QUICK CONTACT CHANNEL                  */}
      {/* ======================================================== */}
      <AnimatePresence>
        {quickChannelModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/30 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#00d2ff]" />
                  {quickChannelModal.mode === "add" ? "Add Quick Contact Channel" : "Edit Channel"}
                </h3>
                <button
                  onClick={() => setQuickChannelModal({ ...quickChannelModal, isOpen: false })}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Channel Label *
                  </label>
                  <input
                    type="text"
                    value={quickChannelModal.data.label || ""}
                    onChange={(e) =>
                      setQuickChannelModal({
                        ...quickChannelModal,
                        data: { ...quickChannelModal.data, label: e.target.value },
                      })
                    }
                    placeholder="e.g. WhatsApp Instant:"
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Contact Value / Detail *
                  </label>
                  <input
                    type="text"
                    value={quickChannelModal.data.value || ""}
                    onChange={(e) =>
                      setQuickChannelModal({
                        ...quickChannelModal,
                        data: { ...quickChannelModal.data, value: e.target.value },
                      })
                    }
                    placeholder="e.g. +880 1883 839955"
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Clickable Link URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={quickChannelModal.data.link || ""}
                    onChange={(e) =>
                      setQuickChannelModal({
                        ...quickChannelModal,
                        data: { ...quickChannelModal.data, link: e.target.value },
                      })
                    }
                    placeholder="https://wa.me/... or mailto:..."
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Value Color Accent
                  </label>
                  <select
                    value={quickChannelModal.data.colorClass || "text-white"}
                    onChange={(e) =>
                      setQuickChannelModal({
                        ...quickChannelModal,
                        data: { ...quickChannelModal.data, colorClass: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  >
                    <option value="text-emerald-400">Emerald Green (WhatsApp)</option>
                    <option value="text-[#00d2ff]">Cyan Glow (Email)</option>
                    <option value="text-white">White (Schedule)</option>
                    <option value="text-purple-400">Purple</option>
                    <option value="text-amber-400">Amber</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="qcEnabledToggle"
                    checked={quickChannelModal.data.enabled !== false}
                    onChange={(e) =>
                      setQuickChannelModal({
                        ...quickChannelModal,
                        data: { ...quickChannelModal.data, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded accent-[#00d2ff]"
                  />
                  <label htmlFor="qcEnabledToggle" className="text-xs text-slate-300 cursor-pointer">
                    Channel Active / Visible
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setQuickChannelModal({ ...quickChannelModal, isOpen: false })}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!quickChannelModal.data.label || !quickChannelModal.data.value) {
                      showToast("Please provide label and value", "error");
                      return;
                    }
                    const finalItem: QuickContactChannelItem = {
                      id: quickChannelModal.data.id || `qc-${Date.now()}`,
                      label: quickChannelModal.data.label,
                      icon: quickChannelModal.data.icon || "MessageCircle",
                      value: quickChannelModal.data.value,
                      link: quickChannelModal.data.link || "",
                      colorClass: quickChannelModal.data.colorClass || "text-white",
                      order: quickChannelModal.data.order || quickChannels.length + 1,
                      enabled: quickChannelModal.data.enabled !== false,
                    };

                    if (quickChannelModal.mode === "add") {
                      setQuickChannels([...quickChannels, finalItem]);
                      showToast(`Added channel "${finalItem.label}"!`);
                    } else {
                      const updated = [...quickChannels];
                      updated[quickChannelModal.index] = finalItem;
                      setQuickChannels(updated);
                      showToast(`Updated channel "${finalItem.label}"!`);
                    }
                    setQuickChannelModal({ ...quickChannelModal, isOpen: false });
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs font-extrabold text-[#050811] bg-[#00d2ff] hover:opacity-90"
                >
                  {quickChannelModal.mode === "add" ? "Add Channel" : "Save"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT AVAILABILITY BADGE                     */}
      {/* ======================================================== */}
      <AnimatePresence>
        {badgeModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/30 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00d2ff]" />
                  {badgeModal.mode === "add" ? "Add Availability Badge" : "Edit Badge"}
                </h3>
                <button
                  onClick={() => setBadgeModal({ ...badgeModal, isOpen: false })}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Badge Text *
                  </label>
                  <input
                    type="text"
                    value={badgeModal.data.text || ""}
                    onChange={(e) =>
                      setBadgeModal({ ...badgeModal, data: { ...badgeModal.data, text: e.target.value } })
                    }
                    placeholder="e.g. Typical Response < 2 Hours"
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Icon
                  </label>
                  <select
                    value={badgeModal.data.icon || "Clock"}
                    onChange={(e) =>
                      setBadgeModal({ ...badgeModal, data: { ...badgeModal.data, icon: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  >
                    <option value="Clock">Clock</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="Globe">Globe</option>
                    <option value="Zap">Zap</option>
                    <option value="ShieldCheck">ShieldCheck</option>
                    <option value="CheckCircle2">CheckCircle2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Accent Style
                  </label>
                  <select
                    value={badgeModal.data.accentStyle || "cyan"}
                    onChange={(e) =>
                      setBadgeModal({
                        ...badgeModal,
                        data: { ...badgeModal.data, accentStyle: e.target.value as any },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  >
                    <option value="cyan">Cyan Accent</option>
                    <option value="emerald">Emerald Green Accent</option>
                    <option value="purple">Purple Accent</option>
                    <option value="amber">Amber Accent</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="badgePingToggle"
                    checked={badgeModal.data.showPing || false}
                    onChange={(e) =>
                      setBadgeModal({
                        ...badgeModal,
                        data: { ...badgeModal.data, showPing: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded accent-[#00d2ff]"
                  />
                  <label htmlFor="badgePingToggle" className="text-xs text-slate-300 cursor-pointer">
                    Show pulsing animated ping dot
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="badgeEnabledToggle"
                    checked={badgeModal.data.enabled !== false}
                    onChange={(e) =>
                      setBadgeModal({
                        ...badgeModal,
                        data: { ...badgeModal.data, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded accent-[#00d2ff]"
                  />
                  <label htmlFor="badgeEnabledToggle" className="text-xs text-slate-300 cursor-pointer">
                    Badge Visible
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setBadgeModal({ ...badgeModal, isOpen: false })}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!badgeModal.data.text) {
                      showToast("Please provide badge text", "error");
                      return;
                    }
                    const finalItem: ContactAvailabilityBadge = {
                      id: badgeModal.data.id || `ab-${Date.now()}`,
                      text: badgeModal.data.text,
                      icon: badgeModal.data.icon || "Sparkles",
                      accentStyle: badgeModal.data.accentStyle || "cyan",
                      showPing: badgeModal.data.showPing || false,
                      link: badgeModal.data.link || "",
                      order: badgeModal.data.order || availabilityBadges.length + 1,
                      enabled: badgeModal.data.enabled !== false,
                    };

                    if (badgeModal.mode === "add") {
                      setAvailabilityBadges([...availabilityBadges, finalItem]);
                      showToast(`Added badge "${finalItem.text}"!`);
                    } else {
                      const updated = [...availabilityBadges];
                      updated[badgeModal.index] = finalItem;
                      setAvailabilityBadges(updated);
                      showToast(`Updated badge "${finalItem.text}"!`);
                    }
                    setBadgeModal({ ...badgeModal, isOpen: false });
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs font-extrabold text-[#050811] bg-[#00d2ff] hover:opacity-90"
                >
                  {badgeModal.mode === "add" ? "Add Badge" : "Save"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT DIRECT CONTACT CARD                    */}
      {/* ======================================================== */}
      <AnimatePresence>
        {directCardModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/30 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#00d2ff]" />
                  {directCardModal.mode === "add" ? "Add Direct Contact Card" : "Edit Contact Card"}
                </h3>
                <button
                  onClick={() => setDirectCardModal({ ...directCardModal, isOpen: false })}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Small Eyebrow Label *
                  </label>
                  <input
                    type="text"
                    value={directCardModal.data.badge || ""}
                    onChange={(e) =>
                      setDirectCardModal({
                        ...directCardModal,
                        data: { ...directCardModal.data, badge: e.target.value },
                      })
                    }
                    placeholder="e.g. WhatsApp (Instant Reply)"
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Main Contact Value *
                  </label>
                  <input
                    type="text"
                    value={directCardModal.data.value || ""}
                    onChange={(e) =>
                      setDirectCardModal({
                        ...directCardModal,
                        data: { ...directCardModal.data, value: e.target.value },
                      })
                    }
                    placeholder="e.g. +880 1883 839955"
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Secondary Info (Optional)
                  </label>
                  <input
                    type="text"
                    value={directCardModal.data.secondaryInfo || ""}
                    onChange={(e) =>
                      setDirectCardModal({
                        ...directCardModal,
                        data: { ...directCardModal.data, secondaryInfo: e.target.value },
                      })
                    }
                    placeholder="e.g. Alt: wde3716@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Destination Click Link URL
                  </label>
                  <input
                    type="text"
                    value={directCardModal.data.link || ""}
                    onChange={(e) =>
                      setDirectCardModal({
                        ...directCardModal,
                        data: { ...directCardModal.data, link: e.target.value },
                      })
                    }
                    placeholder="https://wa.me/... or mailto:..."
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      Icon
                    </label>
                    <select
                      value={directCardModal.data.icon || "Mail"}
                      onChange={(e) =>
                        setDirectCardModal({
                          ...directCardModal,
                          data: { ...directCardModal.data, icon: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                    >
                      <option value="MessageCircle">MessageCircle</option>
                      <option value="Mail">Mail</option>
                      <option value="Phone">Phone</option>
                      <option value="MapPin">MapPin</option>
                      <option value="Globe">Globe</option>
                      <option value="Send">Send</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      Accent Color
                    </label>
                    <select
                      value={directCardModal.data.badgeColor || "cyan"}
                      onChange={(e) =>
                        setDirectCardModal({
                          ...directCardModal,
                          data: { ...directCardModal.data, badgeColor: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                    >
                      <option value="emerald">Emerald</option>
                      <option value="cyan">Cyan</option>
                      <option value="purple">Purple</option>
                      <option value="amber">Amber</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="cardEnabledToggle"
                    checked={directCardModal.data.enabled !== false}
                    onChange={(e) =>
                      setDirectCardModal({
                        ...directCardModal,
                        data: { ...directCardModal.data, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded accent-[#00d2ff]"
                  />
                  <label htmlFor="cardEnabledToggle" className="text-xs text-slate-300 cursor-pointer">
                    Card Visible
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setDirectCardModal({ ...directCardModal, isOpen: false })}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!directCardModal.data.value) {
                      showToast("Please provide contact value", "error");
                      return;
                    }
                    const finalItem: DirectContactCardItem = {
                      id: directCardModal.data.id || `dcc-${Date.now()}`,
                      icon: directCardModal.data.icon || "Mail",
                      badge: directCardModal.data.badge || "Contact",
                      badgeColor: directCardModal.data.badgeColor || "cyan",
                      value: directCardModal.data.value,
                      secondaryInfo: directCardModal.data.secondaryInfo || "",
                      link: directCardModal.data.link || "",
                      isLink: !!directCardModal.data.link,
                      order: directCardModal.data.order || directCards.length + 1,
                      enabled: directCardModal.data.enabled !== false,
                    };

                    if (directCardModal.mode === "add") {
                      setDirectCards([...directCards, finalItem]);
                      showToast(`Added card "${finalItem.badge}"!`);
                    } else {
                      const updated = [...directCards];
                      updated[directCardModal.index] = finalItem;
                      setDirectCards(updated);
                      showToast(`Updated card "${finalItem.badge}"!`);
                    }
                    setDirectCardModal({ ...directCardModal, isOpen: false });
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs font-extrabold text-[#050811] bg-[#00d2ff] hover:opacity-90"
                >
                  {directCardModal.mode === "add" ? "Add Card" : "Save"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT FORM FIELD                             */}
      {/* ======================================================== */}
      <AnimatePresence>
        {fieldModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/30 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#00d2ff]" />
                  {fieldModal.mode === "add" ? "Add Form Input Field" : "Edit Field"}
                </h3>
                <button
                  onClick={() => setFieldModal({ ...fieldModal, isOpen: false })}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Field Label *
                  </label>
                  <input
                    type="text"
                    value={fieldModal.data.label || ""}
                    onChange={(e) =>
                      setFieldModal({
                        ...fieldModal,
                        data: { ...fieldModal.data, label: e.target.value },
                      })
                    }
                    placeholder="e.g. Budget Range"
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Placeholder Text *
                  </label>
                  <input
                    type="text"
                    value={fieldModal.data.placeholder || ""}
                    onChange={(e) =>
                      setFieldModal({
                        ...fieldModal,
                        data: { ...fieldModal.data, placeholder: e.target.value },
                      })
                    }
                    placeholder="e.g. $1,000 - $3,000 USD"
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      Field Type
                    </label>
                    <select
                      value={fieldModal.data.type || "text"}
                      onChange={(e) =>
                        setFieldModal({
                          ...fieldModal,
                          data: { ...fieldModal.data, type: e.target.value as any },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-medium focus:border-[#00d2ff] outline-none"
                    >
                      <option value="text">Single-line Text</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone / Tel</option>
                      <option value="textarea">Multi-line Textarea</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      Internal Key
                    </label>
                    <input
                      type="text"
                      value={fieldModal.data.name || ""}
                      onChange={(e) =>
                        setFieldModal({
                          ...fieldModal,
                          data: { ...fieldModal.data, name: e.target.value.toLowerCase().replace(/\s+/g, "_") },
                        })
                      }
                      placeholder="e.g. budget"
                      className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="fieldReqToggle"
                      checked={fieldModal.data.required || false}
                      onChange={(e) =>
                        setFieldModal({
                          ...fieldModal,
                          data: { ...fieldModal.data, required: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded accent-[#00d2ff]"
                    />
                    <label htmlFor="fieldReqToggle" className="text-xs text-slate-300 cursor-pointer">
                      Required Field
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="fieldHalfToggle"
                      checked={fieldModal.data.halfWidth || false}
                      onChange={(e) =>
                        setFieldModal({
                          ...fieldModal,
                          data: { ...fieldModal.data, halfWidth: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded accent-[#00d2ff]"
                    />
                    <label htmlFor="fieldHalfToggle" className="text-xs text-slate-300 cursor-pointer">
                      Half Width (2-Col)
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="fieldEnabledToggle"
                    checked={fieldModal.data.enabled !== false}
                    onChange={(e) =>
                      setFieldModal({
                        ...fieldModal,
                        data: { ...fieldModal.data, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded accent-[#00d2ff]"
                  />
                  <label htmlFor="fieldEnabledToggle" className="text-xs text-slate-300 cursor-pointer">
                    Field Active
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setFieldModal({ ...fieldModal, isOpen: false })}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!fieldModal.data.label) {
                      showToast("Please provide field label", "error");
                      return;
                    }
                    const finalItem: ContactFormFieldItem = {
                      id: fieldModal.data.id || `f-${Date.now()}`,
                      name: fieldModal.data.name || `field_${Date.now()}`,
                      label: fieldModal.data.label,
                      placeholder: fieldModal.data.placeholder || "",
                      type: fieldModal.data.type || "text",
                      required: fieldModal.data.required || false,
                      halfWidth: fieldModal.data.halfWidth || false,
                      order: fieldModal.data.order || (formSettings.fields?.length || 0) + 1,
                      enabled: fieldModal.data.enabled !== false,
                    };

                    const currentFields = formSettings.fields || [];
                    if (fieldModal.mode === "add") {
                      setFormSettings({
                        ...formSettings,
                        fields: [...currentFields, finalItem],
                      });
                      showToast(`Added field "${finalItem.label}"!`);
                    } else {
                      const updated = [...currentFields];
                      updated[fieldModal.index] = finalItem;
                      setFormSettings({ ...formSettings, fields: updated });
                      showToast(`Updated field "${finalItem.label}"!`);
                    }
                    setFieldModal({ ...fieldModal, isOpen: false });
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs font-extrabold text-[#050811] bg-[#00d2ff] hover:opacity-90"
                >
                  {fieldModal.mode === "add" ? "Add Field" : "Save"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT SOCIAL LINK                            */}
      {/* ======================================================== */}
      <AnimatePresence>
        {socialModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg p-6 rounded-3xl bg-[#070e24] border border-[#00d2ff]/30 shadow-2xl space-y-4 my-8"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#00d2ff]" />
                  {socialModal.mode === "add" ? "Add Social Media Channel" : "Edit Social Media Channel"}
                </h3>
                <button
                  type="button"
                  onClick={() => setSocialModal({ ...socialModal, isOpen: false })}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Platform Presets */}
              <div>
                <label className="block text-[11px] font-mono text-slate-300 uppercase mb-2">
                  Quick Select Preset Platform
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {AVAILABLE_SOCIAL_PLATFORMS.map((platform) => {
                    const isSelected =
                      (socialModal.data.name || "").toLowerCase() === platform.label.toLowerCase() ||
                      (socialModal.data.icon || "").toLowerCase() === platform.icon.toLowerCase();
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => {
                          const currentUrl = socialModal.data.url || "";
                          const shouldUpdateUrl =
                            !currentUrl ||
                            AVAILABLE_SOCIAL_PLATFORMS.some((p) => p.defaultDomain === currentUrl);
                          setSocialModal({
                            ...socialModal,
                            data: {
                              ...socialModal.data,
                              name: platform.label,
                              icon: platform.icon,
                              url: shouldUpdateUrl ? platform.defaultDomain : currentUrl,
                            },
                          });
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#00d2ff]/20 text-[#00d2ff] border-[#00d2ff] font-bold"
                            : "bg-[#040815] text-slate-300 border-white/10 hover:border-[#00d2ff]/40"
                        }`}
                      >
                        <DynamicSocialIcon
                          iconName={platform.icon}
                          platformName={platform.id}
                          className="w-3.5 h-3.5"
                        />
                        <span>{platform.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      Platform Name *
                    </label>
                    <input
                      type="text"
                      value={socialModal.data.name || ""}
                      onChange={(e) =>
                        setSocialModal({
                          ...socialModal,
                          data: { ...socialModal.data, name: e.target.value },
                        })
                      }
                      placeholder="e.g. LinkedIn, GitHub, YouTube"
                      className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      Icon Identifier *
                    </label>
                    <select
                      value={socialModal.data.icon || socialModal.data.name || "Share"}
                      onChange={(e) =>
                        setSocialModal({
                          ...socialModal,
                          data: { ...socialModal.data, icon: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-bold focus:border-[#00d2ff] outline-none"
                    >
                      {AVAILABLE_SOCIAL_PLATFORMS.map((p) => (
                        <option key={p.id} value={p.icon} className="bg-[#070e24] text-white">
                          {p.label} ({p.icon})
                        </option>
                      ))}
                      <option value="Share" className="bg-[#070e24] text-white">
                        Generic Share Icon
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                    Profile / Destination URL *
                  </label>
                  <input
                    type="url"
                    value={socialModal.data.url || ""}
                    onChange={(e) =>
                      setSocialModal({
                        ...socialModal,
                        data: { ...socialModal.data, url: e.target.value },
                      })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Must start with <code className="text-[#00d2ff]">https://</code> or <code className="text-[#00d2ff]">mailto:</code>. Opens in a new tab when clicked.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      Display Order (Sort Position)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={socialModal.data.order ?? (socialModal.index >= 0 ? socialModal.index + 1 : socialLinks.length + 1)}
                      onChange={(e) =>
                        setSocialModal({
                          ...socialModal,
                          data: { ...socialModal.data, order: parseInt(e.target.value) || 1 },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#040815] border border-white/10 text-white text-xs font-mono focus:border-[#00d2ff] outline-none"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                      Visibility Status
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#040815] border border-white/10">
                      <input
                        type="checkbox"
                        id="socialActiveToggle"
                        checked={socialModal.data.active !== false}
                        onChange={(e) =>
                          setSocialModal({
                            ...socialModal,
                            data: { ...socialModal.data, active: e.target.checked },
                          })
                        }
                        className="w-4 h-4 rounded accent-[#00d2ff] cursor-pointer"
                      />
                      <label htmlFor="socialActiveToggle" className="text-xs text-slate-200 cursor-pointer select-none">
                        {socialModal.data.active !== false ? "Active (Visible on site)" : "Inactive (Hidden)"}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="p-3 rounded-xl bg-[#040815] border border-[#00d2ff]/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0a1022] border border-[#00d2ff]/40 text-[#00d2ff] flex items-center justify-center shadow-[0_0_15px_rgba(0,210,255,0.3)]">
                      <DynamicSocialIcon
                        iconName={socialModal.data.icon || socialModal.data.name}
                        platformName={socialModal.data.name}
                        className="w-5 h-5 text-[#00d2ff]"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{socialModal.data.name || "Preview Platform"}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          socialModal.data.active !== false
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {socialModal.data.active !== false ? "Active" : "Hidden"}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono truncate max-w-xs block">
                        {socialModal.data.url || "https://..."}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Order #{socialModal.data.order ?? (socialModal.index >= 0 ? socialModal.index + 1 : socialLinks.length + 1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSocialModal({ ...socialModal, isOpen: false })}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const name = (socialModal.data.name || "").trim();
                    const url = (socialModal.data.url || "").trim();
                    if (!name || !url) {
                      showToast("Please provide both Platform Name and URL", "error");
                      return;
                    }
                    const finalItem: SocialLink = {
                      name: name,
                      url: url,
                      icon: (socialModal.data.icon || name).trim(),
                      active: socialModal.data.active !== false,
                      order: Number(socialModal.data.order) || (socialModal.index >= 0 ? socialModal.index + 1 : socialLinks.length + 1),
                    };

                    if (socialModal.mode === "add") {
                      const updated = [...socialLinks, finalItem];
                      setSocialLinks(updated);
                      showToast(`Added "${finalItem.name}"! Remember to click Save Channels.`);
                    } else {
                      const updated = [...socialLinks];
                      updated[socialModal.index] = finalItem;
                      setSocialLinks(updated);
                      showToast(`Updated "${finalItem.name}"! Remember to click Save Channels.`);
                    }
                    setSocialModal({ ...socialModal, isOpen: false });
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold text-[#050811] bg-[#00d2ff] hover:opacity-90 cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                >
                  {socialModal.mode === "add" ? "Add Channel" : "Apply Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL                                */}
      {/* ======================================================== */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-[#070e24] border border-red-500/30 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{deleteConfirm.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{deleteConfirm.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteConfirm.onConfirm}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-md"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
