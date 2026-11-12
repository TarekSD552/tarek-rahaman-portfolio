"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Download,
  Sparkles,
  ShieldCheck,
  Globe,
  Zap,
  FileText,
  Share2,
  ExternalLink,
  Layers,
  Award,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";
import WaveDivider from "@/components/ui/WaveDivider";
import MagneticButton from "@/components/ui/MagneticButton";
import { profileData } from "@/data/portfolioData";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  QuickContactChannelItem,
  ContactAvailabilityBadge,
  DirectContactCardItem,
  ContactFormFieldItem
} from "@/types/portfolio";
import { normalizeImageUrl } from "@/lib/image-utils";

function getDynamicContactIcon(name?: string) {
  switch (name) {
    case "MessageCircle":
      return MessageCircle;
    case "Mail":
      return Mail;
    case "Phone":
      return Phone;
    case "MapPin":
      return MapPin;
    case "Clock":
      return Clock;
    case "Send":
      return Send;
    case "CheckCircle2":
      return CheckCircle2;
    case "Download":
      return Download;
    case "Sparkles":
      return Sparkles;
    case "ShieldCheck":
      return ShieldCheck;
    case "Globe":
      return Globe;
    case "Zap":
      return Zap;
    case "FileText":
      return FileText;
    case "Share2":
      return Share2;
    case "Layers":
      return Layers;
    case "Award":
      return Award;
    case "ArrowRight":
      return ArrowRight;
    default:
      return Sparkles;
  }
}

export default function ContactContent() {
  const { cmsData } = useCms();
  const { t, tCms, language } = useLanguage();

  const hero = cmsData.contactHero;
  const visibility = cmsData.contactVisibility || {};
  const contactInfo = cmsData.contactInfo || {
    email: profileData.email,
    alternateEmail: profileData.alternateEmail,
    phone: profileData.phone,
    alternatePhone: profileData.alternatePhone,
    whatsapp: profileData.whatsapp,
    messenger: profileData.messenger,
    location: profileData.location,
    workingHours: "Sat - Thu (10:00 AM - 8:00 PM)",
  };
  const profile = cmsData.profile || profileData;

  // 1. Quick Contact Channels (Right column in Hero)
  const defaultQuickChannels: QuickContactChannelItem[] = [
    {
      id: "qc-1",
      label: t("contact.instantWhatsapp"),
      icon: "MessageCircle",
      value: contactInfo.phone || profileData.phone,
      link: contactInfo.whatsapp || profileData.whatsapp,
      colorClass: "text-emerald-400",
      order: 1,
      enabled: true,
    },
    {
      id: "qc-2",
      label: t("contact.directEmail"),
      icon: "Mail",
      value: contactInfo.email || profileData.email,
      link: `mailto:${contactInfo.email || profileData.email}`,
      colorClass: "text-[#00d2ff]",
      order: 2,
      enabled: true,
    },
    {
      id: "qc-3",
      label: t("contact.workingHours"),
      icon: "Clock",
      value: language === "bn" ? "শনি – বৃহস্পতি (১০টা–৮টা)" : (contactInfo.workingHours || "Sat – Thu (10am–8pm)"),
      link: "",
      colorClass: "text-white",
      order: 3,
      enabled: true,
    },
  ];

  const quickChannels = useMemo(() => {
    const list = cmsData.quickContactChannels && cmsData.quickContactChannels.length > 0
      ? cmsData.quickContactChannels
      : defaultQuickChannels;
    return list
      .filter((c) => c.enabled !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((c) => {
        if (language !== "bn") return c;
        let l = c.label;
        if (l.toLowerCase().includes("whatsapp")) l = t("contact.instantWhatsapp");
        else if (l.toLowerCase().includes("email")) l = t("contact.directEmail");
        else if (l.toLowerCase().includes("work") || l.toLowerCase().includes("day") || l.toLowerCase().includes("hour")) l = t("contact.workingHours");
        return { ...c, label: l };
      });
  }, [cmsData.quickContactChannels, contactInfo, language, t]);

  // 2. Availability Badges (Under Hero Heading)
  const defaultAvailabilityBadges: ContactAvailabilityBadge[] = [
    {
      id: "ab-1",
      text: hero?.availabilityText ? tCms(hero.availabilityText, "contact.availableForNew") : t("contact.availableForNew"),
      icon: "Sparkles",
      accentStyle: "emerald",
      showPing: true,
      order: 1,
      enabled: true,
    },
    {
      id: "ab-2",
      text: t("contact.typicalResponse"),
      icon: "Clock",
      accentStyle: "cyan",
      showPing: false,
      order: 2,
      enabled: true,
    },
    {
      id: "ab-3",
      text: t("contact.worldwideDelivery"),
      icon: "Globe",
      accentStyle: "purple",
      showPing: false,
      order: 3,
      enabled: true,
    },
  ];

  const availabilityBadges = useMemo(() => {
    const list = cmsData.contactAvailabilityBadges && cmsData.contactAvailabilityBadges.length > 0
      ? cmsData.contactAvailabilityBadges
      : defaultAvailabilityBadges;
    return list
      .filter((b) => b.enabled !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((b) => {
        if (language !== "bn") return b;
        let txt = b.text;
        if (txt.toLowerCase().includes("available")) txt = t("contact.availableForNew");
        else if (txt.toLowerCase().includes("response") || txt.toLowerCase().includes("hour")) txt = t("contact.typicalResponse");
        else if (txt.toLowerCase().includes("worldwide") || txt.toLowerCase().includes("remote")) txt = t("contact.worldwideDelivery");
        return { ...b, text: txt };
      });
  }, [cmsData.contactAvailabilityBadges, hero?.availabilityText, language, t]);

  // 3. Direct Reach Cards (Left Column)
  const defaultDirectCards: DirectContactCardItem[] = [
    {
      id: "dcc-1",
      icon: "MessageCircle",
      badge: t("contact.whatsappInstant"),
      badgeColor: "emerald",
      value: contactInfo.phone || profileData.phone,
      secondaryInfo: "",
      link: contactInfo.whatsapp || profileData.whatsapp,
      isLink: true,
      order: 1,
      enabled: true,
    },
    {
      id: "dcc-2",
      icon: "Mail",
      badge: t("contact.primaryEmail"),
      badgeColor: "cyan",
      value: contactInfo.email || profileData.email,
      secondaryInfo: `Alt: ${contactInfo.alternateEmail || profileData.alternateEmail}`,
      link: `mailto:${contactInfo.email || profileData.email}`,
      isLink: true,
      order: 2,
      enabled: true,
    },
    {
      id: "dcc-3",
      icon: "Phone",
      badge: t("contact.directCall"),
      badgeColor: "cyan",
      value: contactInfo.phone || profileData.phone,
      secondaryInfo: `Alt: ${contactInfo.alternatePhone || profileData.alternatePhone}`,
      link: `tel:${contactInfo.phone || profileData.phone}`,
      isLink: true,
      order: 3,
      enabled: true,
    },
    {
      id: "dcc-4",
      icon: "MapPin",
      badge: t("contact.officeLocationCard"),
      badgeColor: "purple",
      value: language === "bn" ? "মিরপুর-১, ঢাকা, বাংলাদেশ" : (contactInfo.location || profile.location || profileData.location),
      secondaryInfo: "",
      link: "https://maps.google.com/?q=Mirpur-1,Dhaka,Bangladesh",
      isLink: false,
      order: 4,
      enabled: true,
    },
  ];

  const directCards = useMemo(() => {
    const list = cmsData.directContactCards && cmsData.directContactCards.length > 0
      ? cmsData.directContactCards
      : defaultDirectCards;
    return list
      .filter((c) => c.enabled !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((c) => {
        if (language !== "bn") return c;
        let b = c.badge || "";
        let val = c.value;
        const bLower = b.toLowerCase();
        if (bLower.includes("whatsapp")) b = t("contact.whatsappInstant");
        else if (bLower.includes("email")) b = t("contact.primaryEmail");
        else if (bLower.includes("call") || bLower.includes("phone")) b = t("contact.directCall");
        else if (bLower.includes("office") || bLower.includes("location")) {
          b = t("contact.officeLocationCard");
          val = "মিরপুর-১, ঢাকা, বাংলাদেশ";
        }
        return { ...c, badge: b, value: val };
      });
  }, [cmsData.directContactCards, contactInfo, profile.location, language, t]);

  // 4. Office Working Hours & Schedule
  const officeHours = {
    officeLocation: language === "bn" ? "মিরপুর-১, ঢাকা, বাংলাদেশ" : (contactInfo.location || profile.location || profileData.location),
    locationIcon: "MapPin",
    locationUrl: "https://maps.google.com/?q=Mirpur-1,Dhaka,Bangladesh",
    workingHours: language === "bn" ? "শনি - বৃহস্পতি (সকাল ১০:০০ - রাত ৮:০০)" : (contactInfo.workingHours || "Sat - Thu (10:00 AM - 8:00 PM)"),
    workingHoursIcon: "Clock",
    additionalOfficeInfo: t("contact.officeConsultations"),
    enabled: true,
  };

  // 5. Resume Download Settings
  const resume = {
    title: t("contact.resumeTitle"),
    description: t("contact.resumeDesc"),
    fileUrl: profile.cvUrl || profileData.cvUrl || "/assets/Tarek-Rahaman-Professional-CV-Resume.pdf",
    buttonLabel: t("contact.resumeDownload"),
    buttonIcon: "Download",
    downloadFileName: "Tarek-Rahaman-CV.pdf",
    enabled: true,
  };

  // 6. Contact Form Settings & Fields
  const formSettings = {
    heading: tCms(cmsData.contactFormSettings?.heading, "contact.formHeading"),
    description: tCms(cmsData.contactFormSettings?.description, "contact.formDescription"),
    recipientEmail: contactInfo.email || "tarekrahaman186@gmail.com",
    submitButtonText: t("contact.submitButton"),
    submitButtonIcon: "Send",
    submittingText: t("contact.submitting"),
    successHeading: t("contact.successHeading"),
    successMessage: t("contact.successText"),
    resetButtonText: t("contact.sendAnother"),
  };

  const defaultFormFields: ContactFormFieldItem[] = [
    {
      id: "f-name",
      name: "name",
      label: t("contact.nameLabel"),
      placeholder: t("contact.namePlaceholder"),
      type: "text",
      required: true,
      halfWidth: true,
      enabled: true,
      order: 1,
    },
    {
      id: "f-email",
      name: "email",
      label: t("contact.emailLabel"),
      placeholder: t("contact.emailPlaceholder"),
      type: "email",
      required: true,
      halfWidth: true,
      enabled: true,
      order: 2,
    },
    {
      id: "f-phone",
      name: "phone",
      label: t("contact.phoneLabel"),
      placeholder: t("contact.phonePlaceholder"),
      type: "tel",
      required: false,
      halfWidth: true,
      enabled: true,
      order: 3,
    },
    {
      id: "f-subject",
      name: "subject",
      label: t("contact.subjectLabel"),
      placeholder: t("contact.subjectPlaceholder"),
      type: "text",
      required: false,
      halfWidth: true,
      enabled: true,
      order: 4,
    },
    {
      id: "f-message",
      name: "message",
      label: t("contact.messageLabel"),
      placeholder: t("contact.messagePlaceholder"),
      type: "textarea",
      required: true,
      halfWidth: false,
      enabled: true,
      order: 5,
    },
  ];

  const formFields = useMemo(() => {
    return defaultFormFields;
  }, [language, t]);

  // Form Submission State
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (fieldKey: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00d2ff", "#0088ff", "#ffffff", "#facc15"],
      });
    }, 800);
  };

  // Badge dynamic icon helper
  const HeroBadgeIcon = getDynamicContactIcon(hero?.badgeIcon || "Sparkles");
  const SubmitButtonIcon = getDynamicContactIcon(formSettings.submitButtonIcon || "Send");
  const ResumeButtonIcon = getDynamicContactIcon(resume.buttonIcon || "Download");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ======================================================== */}
      {/* 1. CINEMATIC HERO / BANNER                               */}
      {/* ======================================================== */}
      {visibility.showHero !== false && (
        <div className="relative mb-12 sm:mb-16 select-none overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-[#030612] border border-[#00d2ff]/35 p-6 sm:p-10 lg:p-12 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(0,210,255,0.18)]">
          {/* Glowing Bottom Neon Line */}
          {hero?.showNeonGlowLine !== false && (
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_18px_#00f0ff] z-30" />
          )}

          {/* Cyan Ambient Glow Lower Left */}
          {hero?.showAmbientGlow !== false && (
            <>
              <div className="absolute -bottom-16 -left-16 w-[450px] h-[350px] bg-gradient-to-tr from-[#00d2ff]/22 via-[#0066ff]/14 to-transparent rounded-full blur-[130px] pointer-events-none z-10" />
              <div className="absolute -top-16 right-10 w-[550px] h-[420px] bg-gradient-to-bl from-[#a855f7]/26 via-[#7c3aed]/14 to-transparent rounded-full blur-[140px] pointer-events-none z-10" />
            </>
          )}

          {/* Mountain Ridge SVG Silhouette */}
          {hero?.showMountainRidge !== false && (
            <svg
              viewBox="0 0 540 170"
              className="absolute bottom-0 left-0 w-[280px] sm:w-[420px] md:w-[500px] h-auto pointer-events-none opacity-40 overflow-visible z-10"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="contact-page-mtn-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.85" />
                  <stop offset="55%" stopColor="#0066ff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 170 L0 145 L70 120 L130 135 L200 95 L260 115 L330 65 L410 110 L480 80 L540 120 L540 170 Z"
                fill="#050a18"
              />
              <path
                d="M0 145 L70 120 L130 135 L200 95 L260 115 L330 65 L410 110 L480 80 L540 120"
                stroke="url(#contact-page-mtn-grad)"
                strokeWidth="2.2"
                fill="none"
                className="drop-shadow-[0_0_12px_#00f0ff]"
              />
            </svg>
          )}

          {/* Background Developer Workstation Visual on Right Side */}
          {hero?.backgroundUrl && (
            <div className="absolute top-0 right-0 bottom-0 w-full lg:w-1/2 pointer-events-none overflow-hidden z-0">
              <img
                src={normalizeImageUrl(hero.backgroundUrl || "/assets/developer-workstation-hd.jpg")}
                alt={hero.backgroundAlt || "Developer Workstation"}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-right"
                style={{
                  opacity: (hero.backgroundOverlayStrength ?? 50) / 100,
                }}
              />
              {hero.backgroundOverlay !== false && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#030612] via-[#030612]/75 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030612] via-transparent to-transparent" />
                </>
              )}
            </div>
          )}

          <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading, Subtitle & Key Signals */}
            <div
              className={`${
                visibility.showQuickChannels !== false ? "lg:col-span-8" : "lg:col-span-12"
              } flex flex-col items-start text-left space-y-4 sm:space-y-5`}
            >
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0a1224]/90 backdrop-blur-md border border-[#00d2ff]/40 shadow-[0_0_15px_rgba(0,210,255,0.25)]">
                <HeroBadgeIcon className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
                <span className="text-[11px] sm:text-xs font-bold tracking-wider text-[#00f0ff] uppercase">
                  {tCms(hero?.badge, "contact.heroBadge")}
                </span>
              </div>

              {/* Main Heading with Highlights */}
              <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-black text-white tracking-tight leading-[1.14]">
                {language === "bn" ? (
                  <span>{t("contact.title")}</span>
                ) : hero?.headingHighlight1 || hero?.headingHighlight2 ? (
                  <>
                    <span>
                      {hero?.heading
                        ? hero.heading
                            .replace(hero.headingHighlight1 || "", "")
                            .replace(hero.headingHighlight2 || "", "")
                        : "Have a Vision? Let's Turn It Into "}
                    </span>
                    {hero?.headingLineBreak && <br />}
                    {hero?.headingHighlight1 && (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#00f0ff] to-[#0088ff] drop-shadow-[0_0_20px_rgba(0,210,255,0.4)]">
                        {hero.headingHighlight1}{" "}
                      </span>
                    )}
                    {hero?.headingHighlight2 && (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0088ff] via-[#a855f7] to-[#c084fc] drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                        {hero.headingHighlight2}
                      </span>
                    )}
                  </>
                ) : (
                  <span>{hero?.heading || "Have a Vision? Let's Turn It Into Digital Reality."}</span>
                )}
              </h1>

              {/* Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {tCms(hero?.description, "contact.description")}
              </p>

              {/* Availability Badges Row */}
              {visibility.showAvailabilityBadges !== false && (
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                  {availabilityBadges.map((b) => {
                    const BadgeIcon = getDynamicContactIcon(b.icon || "Sparkles");

                    // Accent styling
                    let bgClass = "bg-[#00d2ff]/10 border-[#00d2ff]/30 text-[#00f0ff]";
                    if (b.accentStyle === "emerald") {
                      bgClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
                    } else if (b.accentStyle === "purple") {
                      bgClass = "bg-[#a855f7]/12 border-[#a855f7]/30 text-[#c084fc]";
                    } else if (b.accentStyle === "amber") {
                      bgClass = "bg-amber-500/10 border-amber-500/30 text-amber-300";
                    }

                    const Content = (
                      <div
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${bgClass} transition-all hover:scale-105`}
                      >
                        {b.showPing && (
                          <span className="w-2 h-2 rounded-full bg-[#00ff9f] animate-ping" />
                        )}
                        <BadgeIcon className="w-3.5 h-3.5" />
                        <span>{b.text}</span>
                      </div>
                    );

                    return b.link ? (
                      <a
                        key={b.id}
                        href={b.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer"
                      >
                        {Content}
                      </a>
                    ) : (
                      <div key={b.id}>{Content}</div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Fast Contact Channels Pill Card */}
            {visibility.showQuickChannels !== false && (
              <div className="lg:col-span-4 flex flex-col justify-center">
                <div className="p-5 sm:p-6 rounded-2xl bg-[#060d1e]/85 backdrop-blur-md border border-[#00d2ff]/30 shadow-[0_10px_30px_rgba(0,0,0,0.6)] space-y-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00d2ff] block">
                    {tCms(hero?.quickChannelsTitle, "contact.fastChannels")}
                  </span>
                  <div className="space-y-2 text-xs text-slate-300">
                    {quickChannels.map((qc) => {
                      const Icon = getDynamicContactIcon(qc.icon || "Sparkles");
                      const itemJsx = (
                        <div
                          key={qc.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#040814] border border-white/5 hover:border-[#00d2ff]/30 transition-all group"
                        >
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Icon className="w-3 h-3 text-[#00d2ff]" />
                            <span>{qc.label}</span>
                          </div>
                          <span
                            className={`font-semibold truncate max-w-[170px] ${
                              qc.colorClass || "text-white"
                            }`}
                          >
                            {qc.value}
                          </span>
                        </div>
                      );

                      return qc.link ? (
                        <a
                          key={qc.id}
                          href={qc.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block cursor-pointer"
                        >
                          {itemJsx}
                        </a>
                      ) : (
                        <div key={qc.id}>{itemJsx}</div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transition Wave Divider */}
      {visibility.showWaveDivider !== false && (
        <WaveDivider variant={5} className="my-2 sm:my-4" />
      )}

      {/* Main Grid: Direct Reach + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        {/* Left Column: Direct Contact Info */}
        {visibility.showDirectReach !== false && (
          <div
            className={`${
              visibility.showContactForm !== false ? "lg:col-span-5" : "lg:col-span-12"
            } space-y-6`}
          >
            <div className="p-8 rounded-3xl bg-[#090f1e]/85 border border-[#00d2ff]/25 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00d2ff]">
                  {tCms(cmsData.directReachHeader?.badge, "contact.directReachBadge")}
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  {tCms(cmsData.directReachHeader?.heading, "contact.directReachTitle")}
                </h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  {tCms(cmsData.directReachHeader?.description, "contact.directReachDesc")}
                </p>
              </div>

              {/* Dynamic Contact Cards */}
              <div className="space-y-4 pt-2">
                {directCards.map((card) => {
                  const Icon = getDynamicContactIcon(card.icon || "Mail");

                  // Color styles
                  let iconBg = "bg-[#00d2ff]/10 border-[#00d2ff]/30 text-[#00d2ff]";
                  let badgeText = "text-[#00d2ff]";
                  if (card.badgeColor === "emerald") {
                    iconBg = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
                    badgeText = "text-emerald-400";
                  } else if (card.badgeColor === "purple") {
                    iconBg = "bg-purple-500/10 border-purple-500/30 text-purple-400";
                    badgeText = "text-purple-400";
                  } else if (card.badgeColor === "amber") {
                    iconBg = "bg-amber-500/10 border-amber-500/30 text-amber-400";
                    badgeText = "text-amber-400";
                  }

                  const CardInner = (
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#070b16] hover:bg-[#00d2ff]/10 border border-[#00d2ff]/20 hover:border-[#00d2ff]/60 transition-all group">
                      <div
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${iconBg}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        {card.badge && (
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider block ${badgeText}`}
                          >
                            {card.badge}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-white group-hover:text-[#00d2ff] transition-colors truncate">
                          {card.value}
                        </h4>
                        {card.secondaryInfo && (
                          <span className="text-[10px] text-slate-500 block truncate">
                            {card.secondaryInfo}
                          </span>
                        )}
                      </div>
                    </div>
                  );

                  return card.link && card.isLink !== false ? (
                    <a
                      key={card.id}
                      href={card.link}
                      target={card.link.startsWith("http") ? "_blank" : undefined}
                      rel={card.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="block cursor-pointer"
                    >
                      {CardInner}
                    </a>
                  ) : (
                    <div key={card.id}>{CardInner}</div>
                  );
                })}

                {/* Office Location & Hours Box */}
                {visibility.showOfficeHours !== false && officeHours.enabled !== false && (
                  <div className="p-4 rounded-2xl bg-[#070b16] border border-[#00d2ff]/15 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <MapPin className="w-4 h-4 text-[#00d2ff] shrink-0" />
                      {officeHours.locationUrl ? (
                        <a
                          href={officeHours.locationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-[#00d2ff]"
                        >
                          {officeHours.officeLocation || "Mirpur-1, Dhaka, Bangladesh"}
                        </a>
                      ) : (
                        <span>{officeHours.officeLocation || "Mirpur-1, Dhaka, Bangladesh"}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>
                        Working Hours: {officeHours.workingHours || "Sat - Thu (10:00 AM - 8:00 PM)"}
                      </span>
                    </div>
                    {officeHours.additionalOfficeInfo && (
                      <p className="text-[11px] text-slate-500 pt-1 border-t border-white/5">
                        {officeHours.additionalOfficeInfo}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Resume / CV Download Card */}
            {visibility.showResumeCard !== false && resume.enabled !== false && (
              <div className="p-6 rounded-3xl bg-[#090f1e]/85 border border-[#00d2ff]/20 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {resume.title || "Need an official resume?"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {resume.description || "Tarek Rahaman CV Resume (PDF)"}
                  </p>
                </div>
                <MagneticButton>
                  <a
                    href={resume.fileUrl || "/assets/Tarek-Rahaman-Professional-CV-Resume.pdf"}
                    download={resume.downloadFileName || "Tarek-Rahaman-CV.pdf"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#050811] bg-[#00d2ff] shadow-[0_0_12px_rgba(0,210,255,0.6)] hover:shadow-[0_0_20px_rgba(0,210,255,0.9)] flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                  >
                    <ResumeButtonIcon className="w-3.5 h-3.5" />
                    <span>{resume.buttonLabel || "Download"}</span>
                  </a>
                </MagneticButton>
              </div>
            )}
          </div>
        )}

        {/* Right Column: Contact Form */}
        {visibility.showContactForm !== false && (
          <div
            className={`${
              visibility.showDirectReach !== false ? "lg:col-span-7" : "lg:col-span-12"
            }`}
          >
            <div className="p-8 sm:p-10 rounded-3xl bg-[#090f1e]/90 border border-[#00d2ff]/25 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#00d2ff]/20 border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff] mx-auto shadow-[0_0_25px_rgba(0,210,255,0.5)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    {formSettings.successHeading || "Message Sent Successfully!"}
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    {formSettings.successMessage ||
                      "Your message has been sent successfully. Tarek Rahaman will review your details and get back to you very soon!"}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({});
                    }}
                    className="mt-4 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#050811] bg-gradient-to-r from-[#00d2ff] to-[#0088ff] hover:opacity-90 transition-all cursor-pointer shadow-md"
                  >
                    {formSettings.resetButtonText || "Send Another Message"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-white">
                      {formSettings.heading || "Send A Message"}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {formSettings.description ||
                        "Fill out the form below to get in touch about a new project."}
                    </p>
                  </div>

                  {/* Dynamic Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formFields.map((field) => {
                      const isHalf = field.halfWidth !== false && field.type !== "textarea";
                      const colSpanClass = isHalf ? "sm:col-span-1" : "sm:col-span-2";

                      return (
                        <div key={field.id} className={colSpanClass}>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                            {field.label}
                          </label>

                          {field.type === "textarea" ? (
                            <textarea
                              required={field.required}
                              rows={5}
                              value={formData[field.name] || ""}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full px-4 py-3 rounded-xl bg-[#070b16] border border-[#00d2ff]/20 focus:border-[#00d2ff] focus:outline-none text-sm text-white placeholder-slate-600 transition-colors resize-none"
                            />
                          ) : (
                            <input
                              type={field.type}
                              required={field.required}
                              value={formData[field.name] || ""}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full px-4 py-3 rounded-xl bg-[#070b16] border border-[#00d2ff]/20 focus:border-[#00d2ff] focus:outline-none text-sm text-white placeholder-slate-600 transition-colors"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <MagneticButton>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-black uppercase tracking-wider text-[#050811] bg-gradient-to-r from-[#00d2ff] via-[#00f0ff] to-[#00a3ff] shadow-[0_0_25px_rgba(0,210,255,0.7)] hover:shadow-[0_0_35px_rgba(0,210,255,1)] hover:scale-[1.02] transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>{formSettings.submittingText || "Sending..."}</span>
                      ) : (
                        <>
                          <SubmitButtonIcon className="w-4 h-4" />
                          <span>{formSettings.submitButtonText || "Send Message"}</span>
                        </>
                      )}
                    </button>
                  </MagneticButton>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 5. DEDICATED LOCAL SEO & CONTACT LOCATION SECTION        */}
      {/* ======================================================== */}
      <section className="mt-14 sm:mt-20 pt-10 border-t border-slate-800/80 w-full relative">
        {/* Soft Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-r from-[#00d2ff]/08 via-[#6366f1]/06 to-[#00d2ff]/08 rounded-full blur-[110px] pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 shadow-[0_0_15px_rgba(0,210,255,0.18)] mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#00d2ff] animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#00d2ff]">
              {t("contact.locationBadge")}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-3">
            {language === "bn" ? (
              <span>
                অবস্থান:{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#818cf8]">
                  মিরপুর-১, ঢাকা
                </span>
                , বাংলাদেশ
              </span>
            ) : (
              <span>
                Based in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#818cf8]">
                  Mirpur-1, Dhaka
                </span>
                , Bangladesh
              </span>
            )}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {t("contact.locationDesc")}
          </p>
        </div>

        {/* Two-Column Grid: Location Card (Left) + Interactive Responsive Google Map (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch relative z-10">
          
          {/* LEFT COLUMN: Location & Availability Card */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#090f1e]/90 border border-[#00d2ff]/30 shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(0,210,255,0.1)] backdrop-blur-xl space-y-6">
            <div className="space-y-5">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{t("contact.primaryHub")}</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {language === "bn" ? "মিরপুর-১, ঢাকা-১২১৬" : "Mirpur-1, Dhaka-1216"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  {language === "bn" ? "ঢাকা বিভাগ, বাংলাদেশ" : "Dhaka Division, Bangladesh"}
                </p>
              </div>

              {/* Verified Features */}
              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#00d2ff] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">{t("contact.localConsultations")}</strong>
                    <span>
                      {language === "bn"
                        ? "মিরপুর (মিরপুর ১, ২, ৬, ১০, ডিওএইচএস), ধানমন্ডি, উত্তরা, গুলশান সহ সমগ্র ঢাকায় সরাসরি মিটিং সুবিধা।"
                        : "In-person meetings available across Mirpur (Mirpur 1, 2, 6, 10, DOHS), Dhanmondi, Uttara, Gulshan & greater Dhaka."}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-[#00d2ff] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">{t("contact.remoteAvailability")}</strong>
                    <span className="text-cyan-200/90 font-medium">
                      {language === "bn"
                        ? "সমগ্র বাংলাদেশ ও বিশ্বব্যাপী রিমোট প্রজেক্ট ডেলিভারির সুবিধা।"
                        : "Available for Remote Projects Across Bangladesh and Worldwide."}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#00d2ff] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">{t("contact.meetingHours")}</strong>
                    <span>
                      {language === "bn"
                        ? "শনিবার – বৃহস্পতিবার (সকাল ১০:০০ – রাত ৮:০০ বিএসটি)"
                        : "Saturday – Thursday (10:00 AM – 8:00 PM BST)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Natural Bangla Trust Callout */}
              <div className="p-3.5 rounded-2xl bg-[#060b17] border border-[#00d2ff]/20 text-xs text-slate-300 leading-relaxed">
                <p className="italic text-slate-200">
                  &ldquo;ঢাকা ও বাংলাদেশের যেকোনো প্রান্ত থেকে নতুন ওয়েবসাইট বা সফটওয়্যার প্রজেক্টের জন্য সরাসরি কল বা WhatsApp-এ যোগাযোগ করতে পারেন।&rdquo;
                </p>
              </div>
            </div>

            {/* Direct Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2.5">
              <a
                href="https://maps.google.com/?q=Mirpur-1,Dhaka,Bangladesh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#00d2ff] to-[#0088ff] hover:shadow-[0_0_20px_rgba(0,210,255,0.6)] hover:scale-[1.02] transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t("contact.openMaps")}</span>
              </a>

              <a
                href={contactInfo.whatsapp || "https://wa.me/8801733119269"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0b1329] border border-[#00d2ff]/30 hover:border-[#00d2ff] hover:text-[#00d2ff] hover:bg-[#00d2ff]/10 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t("contact.whatsappChat")}</span>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Responsive Google Map Embed in Dark Futuristic Frame */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden bg-[#060a15] border border-[#00d2ff]/30 shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_25px_rgba(0,210,255,0.12)] relative min-h-[320px] sm:min-h-[380px] flex flex-col justify-between">
            {/* Top Bar of Map Container */}
            <div className="px-4 py-2.5 bg-[#091024] border-b border-[#00d2ff]/20 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono font-bold uppercase tracking-wider text-white">
                  {t("contact.mapsTitle")}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#00d2ff]">23.8067° N, 90.3547° E</span>
            </div>

            {/* Map Frame with Dark Mode Filter */}
            <div className="relative w-full flex-1 min-h-[280px] sm:min-h-[340px]">
              <iframe
                title="Tarek Rahaman Office Location - Mirpur-1, Dhaka"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.700318029525!2d90.34444585!3d23.80665795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0c978b77627%3A0x6b107b3b3a0e69b2!2sMirpur-1%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "invert(90%) hue-rotate(180deg) contrast(115%) saturate(85%)",
                }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[280px] sm:min-h-[340px]"
              />
            </div>

            {/* Bottom Bar overlay */}
            <div className="px-4 py-2 bg-[#080e22]/90 border-t border-[#00d2ff]/15 flex items-center justify-between text-[11px] text-slate-400">
              <span>{t("contact.coverage")}</span>
              <span className="text-emerald-400 font-semibold">{t("contact.activeReachable")}</span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

