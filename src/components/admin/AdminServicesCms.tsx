"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  ExternalLink,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Layers,
  HelpCircle,
  Zap,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Eye,
  Sliders,
  Cpu,
  ChevronRight,
  ArrowLeft,
  Copy,
  Globe,
  Share2,
  Send,
  RefreshCw,
  Search,
  FileText,
  Compass,
  Settings,
  Palette,
  Layout,
  Tag,
  Star,
  Award,
  HeartHandshake,
  MessageSquare,
  Gem,
  Rocket,
  Code2,
  Image as ImageIcon
} from "lucide-react";
import { useCms } from "@/context/CmsContext";
import UniversalImageManager from "@/components/admin/UniversalImageManager";
import {
  ServiceItem,
  ServicesHero,
  WhyWorkWithMeCard,
  ProcessStep,
  FaqItem,
  ServicesCta,
  ServicesTechItem,
  ServicesWorkflowHeader,
  ServicesTechHeader,
  ServicesFaqHeader,
  ServicesSeoSettings,
  ServicesDesignSettings,
  CmsPage
} from "@/types/portfolio";

interface AdminServicesCmsProps {
  showToast: (text: string, type?: "success" | "error" | "info") => void;
  openMediaPicker?: (callback: (url: string) => void) => void;
  activeSubPage?: string;
  onSubPageChange?: (subPage: string) => void;
}

export type ServicesSectionKey =
  | "overview"
  | "hero"
  | "services"
  | "why-us"
  | "process"
  | "tech"
  | "faq"
  | "cta"
  | "footer"
  | "seo"
  | "theme";

export default function AdminServicesCms({
  showToast,
  openMediaPicker,
  activeSubPage: externalSubPage,
  onSubPageChange: externalSetSubPage
}: AdminServicesCmsProps) {
  const { cmsData, updateCms } = useCms();

  const [internalSubPage, setInternalSubPage] = useState<ServicesSectionKey>("overview");
  const activeSubPage = (externalSubPage as ServicesSectionKey) || internalSubPage;

  const setActiveSubPage = (page: ServicesSectionKey) => {
    setInternalSubPage(page);
    if (externalSetSubPage) {
      externalSetSubPage(page);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  // 1. Hero Form
  const [heroForm, setHeroForm] = useState<ServicesHero>(
    cmsData.servicesHero || {
      badge: "BESPOKE WEB SOLUTIONS // ARCHITECTURE & ENGINEERING",
      title: "Bespoke Web Solutions Crafted for Exponential Growth",
      highlightText: "Exponential Growth",
      description:
        "From high-converting E-Commerce architectures and custom WordPress systems to robust Laravel backends and bespoke web applications built for speed and longevity.",
      featureTags: [
        "100% Bespoke Code",
        "Sub-Second Response",
        "WooCommerce & E-Commerce",
        "Laravel Custom Backends",
        "WordPress Theme & Plugin Core"
      ],
      badgeIcon: "Sparkles",
      showBadge: true
    }
  );

  // 2. Services List
  const [servicesList, setServicesList] = useState<ServiceItem[]>(
    cmsData.services && cmsData.services.length > 0
      ? cmsData.services
      : [
          {
            number: "01",
            title: "Custom WordPress Architecture",
            shortDesc: "High-performance bespoke WordPress websites engineered for speed, clean UX, and conversions.",
            fullDesc:
              "Engineered from the ground up without bloated page builders. Includes custom theme design, tailored Gutenberg blocks, custom post types, and enterprise caching setups.",
            icon: "WordPress",
            features: [
              "Zero Bloat Clean Architecture",
              "Sub-1.2s Core Web Vitals",
              "Custom Theme & Plugin Core",
              "WooCommerce Integration"
            ],
            techStack: ["WordPress", "PHP 8.3", "Tailwind CSS", "JavaScript", "MySQL"],
            active: true
          },
          {
            number: "02",
            title: "Full-Stack Laravel Web Apps",
            shortDesc: "Enterprise MVC architectures, multi-tenant SaaS backends, and robust REST API pipelines.",
            fullDesc:
              "Scalable full-stack solutions built on modern Laravel standards: role-based access control, queue workers, payment gateways, and high-concurrency database queries.",
            icon: "Laravel",
            features: [
              "Scalable MVC Architecture",
              "RESTful API & Webhooks",
              "Stripe & SSLCommerz Ready",
              "Redis Caching & Queue Workers"
            ],
            techStack: ["Laravel 11", "PHP", "Livewire", "MySQL", "Tailwind CSS"],
            active: true
          },
          {
            number: "03",
            title: "High-Converting E-Commerce",
            shortDesc: "Optimized WooCommerce storefronts with streamlined checkout funnels and fast performance.",
            fullDesc:
              "Tailored storefronts designed to maximize conversions, lower cart abandonment, and integrate multi-currency, custom shipping logic, and automated invoicing.",
            icon: "ECommerce",
            features: [
              "1-Step Checkout Optimization",
              "Automated Inventory Sync",
              "Multi-Currency & Payment Gateways",
              "SEO Optimized Product Schemas"
            ],
            techStack: ["WooCommerce", "WordPress", "Stripe", "PayPal", "MySQL"],
            active: true
          },
          {
            number: "04",
            title: "Landing Pages & Conversion UI",
            shortDesc: "Speed-focused marketing landing pages built to turn traffic into paying clients.",
            fullDesc:
              "High-impact, responsive, modern digital experiences with micro-animations, accessible forms, and tracking pixels integrated for high-conversion marketing campaigns.",
            icon: "LandingPage",
            features: [
              "A/B Testing Structure",
              "95+ Google PageSpeed Score",
              "Pixel-Perfect Mobile Precision",
              "Instant Form Validations"
            ],
            techStack: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
            active: true
          },
          {
            number: "05",
            title: "Custom Web Solutions",
            shortDesc: "Bespoke integrations, external API bridges, custom dashboards, and workflow automations.",
            fullDesc:
              "Specialized engineering tailored to your unique requirements: third-party ERP/CRM integrations, automated webhook handlers, internal dashboards, and client portals.",
            icon: "CustomSolution",
            features: [
              "Bespoke Dashboard UI",
              "CRM & ERP API Sync",
              "Automated Notification Queues",
              "Data Export & Analytics"
            ],
            techStack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
            active: true
          },
          {
            number: "06",
            title: "Speed & Core Web Vitals Tuning",
            shortDesc: "Deep database optimization, script deferral, image compression, and server-level caching.",
            fullDesc:
              "Transform sluggish websites into lightning-fast experiences. Eliminate render-blocking resources, streamline database queries, and achieve green 90+ PageSpeed scores.",
            icon: "WebsiteDesign",
            features: [
              "90+ Google Mobile Scores",
              "Database Bloat Cleanup",
              "Next-Gen WebP/AVIF Formatting",
              "Server Caching & CDN Setup"
            ],
            techStack: ["Lighthouse", "Redis", "Cloudflare", "Nginx", "MySQL"],
            active: true
          }
        ]
  );

  const [serviceModal, setServiceModal] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    index: number;
    data: Partial<ServiceItem>;
  }>({
    isOpen: false,
    mode: "add",
    index: -1,
    data: {}
  });

  // 3. Why Work With Me Form
  const [whyWorkHeader, setWhyWorkHeader] = useState({
    badge: cmsData.servicesWhyWorkWithMe?.badge || "WHY CHOOSE ME",
    title: cmsData.servicesWhyWorkWithMe?.title || "Why Work With",
    subtitle: cmsData.servicesWhyWorkWithMe?.subtitle || "Me?",
    highlightText: cmsData.servicesWhyWorkWithMe?.highlightText || "Me?",
    description:
      cmsData.servicesWhyWorkWithMe?.description ||
      "Delivering modern, reliable, and high-quality digital solutions focused on your business goals."
  });

  const [whyWorkCards, setWhyWorkCards] = useState<WhyWorkWithMeCard[]>(
    cmsData.servicesWhyWorkWithMe?.cards && cmsData.servicesWhyWorkWithMe.cards.length > 0
      ? cmsData.servicesWhyWorkWithMe.cards
      : [
          {
            badge: "⚡ FAST DELIVERY",
            title: "Fast & Reliable Delivery",
            description: "Projects are carefully planned and delivered efficiently without compromising quality.",
            icon: "Zap",
            gradient: "from-[#00d2ff] to-[#0088ff]",
            enabled: true
          },
          {
            badge: "💎 PREMIUM QUALITY",
            title: "Premium Quality",
            description: "Modern, clean, responsive, and professionally engineered digital experiences.",
            icon: "Gem",
            gradient: "from-[#00f0ff] to-[#818cf8]",
            enabled: true
          },
          {
            badge: "💬 CLEAR COMMUNICATION",
            title: "Clear Communication",
            description: "Stay informed throughout the project with transparent and professional communication.",
            icon: "MessageSquare",
            gradient: "from-[#818cf8] to-[#c084fc]",
            enabled: true
          },
          {
            badge: "🚀 PERFORMANCE FOCUSED",
            title: "Performance Focused",
            description: "Fast, optimized, scalable websites built for excellent user experience.",
            icon: "Rocket",
            gradient: "from-[#00d2ff] to-[#a855f7]",
            enabled: true
          }
        ]
  );

  // 4. Engineering Process Form
  const [processHeader, setProcessHeader] = useState<ServicesWorkflowHeader>(
    cmsData.servicesWorkflowHeader || {
      badge: "ENGINEERING BLUEPRINT",
      title: "My Development",
      highlightText: "Process",
      description: "A disciplined 6-phase engineering lifecycle ensuring every build is secure, performant, and delivered on schedule."
    }
  );

  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(
    cmsData.servicesProcess && cmsData.servicesProcess.length > 0
      ? cmsData.servicesProcess
      : cmsData.processSteps && cmsData.processSteps.length > 0
      ? cmsData.processSteps
      : [
          {
            step: "01",
            title: "Discovery & Architecture",
            description: "Deep dive into business goals, functional requirements, technical specifications, and database schema planning.",
            time: "Phase 1 - Planning",
            icon: "Layers",
            active: true
          },
          {
            step: "02",
            title: "UI/UX & Interactive Design",
            description: "Modern wireframes, accessible component design systems, and responsive interactive prototypes.",
            time: "Phase 2 - Design",
            icon: "Zap",
            active: true
          },
          {
            step: "03",
            title: "Engineered Development",
            description: "Clean modular coding using WordPress, Laravel, or modern React frameworks following clean architecture principles.",
            time: "Phase 3 - Build",
            icon: "Cpu",
            active: true
          },
          {
            step: "04",
            title: "Speed & SEO Optimization",
            description: "Sub-second response tuning, database indexing, Core Web Vitals optimization, and on-page schema markup.",
            time: "Phase 4 - Tuning",
            icon: "Rocket",
            active: true
          },
          {
            step: "05",
            title: "Rigorous QA & Security",
            description: "Cross-device responsiveness testing, OWASP security audit, form validation, and edge-case handling.",
            time: "Phase 5 - Testing",
            icon: "ShieldCheck",
            active: true
          },
          {
            step: "06",
            title: "Seamless Launch & Scale",
            description: "Zero-downtime production deployment, SSL certification, analytics integration, and 30-day post-launch warranty.",
            time: "Phase 6 - Launch",
            icon: "Code2",
            active: true
          }
        ]
  );

  // 5. Technologies & Tools Form
  const [techHeader, setTechHeader] = useState<ServicesTechHeader>(
    cmsData.servicesTechHeader || {
      badge: "ENGINEERING ARSENAL",
      title: "Technologies I",
      highlightText: "Work With",
      description: "Battle-tested modern stacks, frameworks, CMS platforms, and databases used to construct resilient digital solutions."
    }
  );

  const [techList, setTechList] = useState<ServicesTechItem[]>(
    cmsData.servicesTechList && cmsData.servicesTechList.length > 0
      ? cmsData.servicesTechList
      : cmsData.aboutTechList && cmsData.aboutTechList.length > 0
      ? cmsData.aboutTechList
      : [
          { name: "WordPress", category: "CMS", brand: "WordPress", enabled: true },
          { name: "Laravel", category: "Backend", brand: "Laravel", enabled: true },
          { name: "PHP", category: "Backend", brand: "PHP", enabled: true },
          { name: "React", category: "Frontend", brand: "React", enabled: true },
          { name: "Next.js", category: "Frontend", brand: "Next.js", enabled: true },
          { name: "Tailwind CSS", category: "Frontend", brand: "Tailwind", enabled: true },
          { name: "JavaScript", category: "Frontend", brand: "JavaScript", enabled: true },
          { name: "TypeScript", category: "Frontend", brand: "TypeScript", enabled: true },
          { name: "MySQL", category: "Database", brand: "MySQL", enabled: true },
          { name: "WooCommerce", category: "CMS", brand: "WooCommerce", enabled: true },
          { name: "Git & GitHub", category: "DevOps", brand: "Git", enabled: true },
          { name: "Docker", category: "DevOps", brand: "Docker", enabled: true },
          { name: "Figma", category: "Design", brand: "Figma", enabled: true },
          { name: "REST APIs", category: "Backend", brand: "API", enabled: true }
        ]
  );

  // 6. FAQ Management Form
  const [faqHeader, setFaqHeader] = useState<ServicesFaqHeader>(
    cmsData.servicesFaqHeader || {
      badge: "CLIENT QUESTIONS & ANSWERS",
      title: "Frequently Asked",
      highlightText: "Questions",
      description: "Clear answers to common questions about timelines, technology selection, project pricing, and post-launch maintenance."
    }
  );

  const [faqList, setFaqList] = useState<FaqItem[]>(
    cmsData.servicesFaq && cmsData.servicesFaq.length > 0
      ? cmsData.servicesFaq
      : cmsData.faqs && cmsData.faqs.length > 0
      ? cmsData.faqs
      : [
          {
            id: "faq-1",
            question: "What is your typical project delivery timeline?",
            answer: "A standard custom WordPress or high-converting landing page takes approximately 7 to 14 business days. Complex Laravel web applications and multi-vendor platforms typically require 3 to 6 weeks with scheduled weekly sprint demos.",
            category: "Timelines",
            order: 1,
            visible: true
          },
          {
            id: "faq-2",
            question: "Do you build custom themes or use pre-made bloated templates?",
            answer: "Every single theme and component is 100% custom-coded from scratch using modern semantic HTML, Tailwind CSS, and lightweight PHP/JavaScript. I never use sluggish multi-purpose page builders that degrade Core Web Vitals.",
            category: "Architecture",
            order: 2,
            visible: true
          },
          {
            id: "faq-3",
            question: "What is included in your 30-day post-launch warranty?",
            answer: "Every completed project includes 30 calendar days of complimentary support covering bug fixes, server monitoring, security verification, speed fine-tuning, and administrative training for your team.",
            category: "Support",
            order: 3,
            visible: true
          },
          {
            id: "faq-4",
            question: "Can you optimize my existing slow website to pass Google Core Web Vitals?",
            answer: "Yes! I conduct in-depth speed audits to eliminate render-blocking assets, optimize heavy database queries, implement server-level caching, compress media to AVIF/WebP, and configure CDN delivery for 90+ mobile scores.",
            category: "Performance",
            order: 4,
            visible: true
          },
          {
            id: "faq-5",
            question: "How do we collaborate and communicate during the build?",
            answer: "We communicate directly via WhatsApp, Slack, or email with daily status check-ins. You receive a private live staging URL and GitHub access so you can test updates in real-time before launch.",
            category: "Process",
            order: 5,
            visible: true
          },
          {
            id: "faq-6",
            question: "Do you integrate payment gateways like Stripe, PayPal, and SSLCommerz?",
            answer: "Absolutely. I implement secure, PCI-compliant payment integrations for global gateways (Stripe, PayPal, Wise) as well as regional Bangladeshi processors (bKash, Nagad, SSLCommerz, Shurjopay) with automated webhooks.",
            category: "Payments",
            order: 6,
            visible: true
          }
        ]
  );

  // 7. Final CTA Form
  const [ctaForm, setCtaForm] = useState<ServicesCta>(
    cmsData.servicesCta || {
      badge: "START YOUR PROJECT TODAY",
      heading: "Ready to Build Something Extraordinary?",
      description: "Let's collaborate to engineer a high-performing digital product that drives revenue, impresses customers, and scales seamlessly.",
      primaryBtn: "Discuss on WhatsApp",
      primaryLink: "https://wa.me/8801733119269?text=Hi%20Tarek,%20I%20want%20to%20discuss%20a%20project.",
      secondaryBtn: "Browse Portfolio Showcase",
      secondaryLink: "/portfolio",
      badgeIcon: "Sparkles",
      bgImageUrl: "",
      primaryButtonVisible: true,
      secondaryButtonVisible: true
    }
  );

  // 8. Footer Controls
  const [footerForm, setFooterForm] = useState({
    brandName: cmsData.profile?.name || "Tarek Rahaman",
    role: cmsData.profile?.titles?.[0] || "Full-Stack Web Developer",
    shortBio:
      cmsData.profile?.shortBio ||
      "Designing and engineering bespoke digital experiences, high-converting web applications, and scalable platforms.",
    copyright: `© ${new Date().getFullYear()} Tarek Rahaman. All rights reserved.`,
    email: cmsData.profile?.email || "contact@tarekmiah.com",
    phone: cmsData.profile?.phone || "+880 1733-119269",
    location: cmsData.profile?.location || "Dhaka, Bangladesh"
  });

  // 9. SEO Form
  const servicesPage = cmsData.pages?.find((p) => p.slug === "services" || p.id === "services");
  const [seoForm, setSeoForm] = useState<ServicesSeoSettings>({
    title: cmsData.servicesSeoSettings?.title || servicesPage?.title || "Services | Tarek Rahaman - Full-Stack Web Developer",
    description:
      cmsData.servicesSeoSettings?.description ||
      servicesPage?.seoDesc ||
      "Explore Tarek Rahaman's luxury web development services: Laravel Web Applications, High-Converting E-Commerce, Custom WordPress Solutions, and Landing Pages.",
    keywords:
      cmsData.servicesSeoSettings?.keywords ||
      servicesPage?.keywords ||
      "WordPress Development Services, WooCommerce Expert, Laravel Application Developer, Website Speed Optimization, Full-Stack Bangladesh",
    canonicalUrl: cmsData.servicesSeoSettings?.canonicalUrl || "https://tarekmiah.com/services",
    ogTitle: cmsData.servicesSeoSettings?.ogTitle || "Professional Web Development Services | Tarek Rahaman",
    ogDescription:
      cmsData.servicesSeoSettings?.ogDescription ||
      "Bespoke WordPress architectures, enterprise-grade Laravel web applications, and Core Web Vitals optimization.",
    ogImage: cmsData.servicesSeoSettings?.ogImage || servicesPage?.ogImage || "/assets/profile-1-scaled.png"
  });

  // 10. Design & Visual Controls
  const [designForm, setDesignForm] = useState<ServicesDesignSettings>(
    cmsData.servicesDesignSettings || {
      sectionOrder: ["hero", "services", "whyUs", "process", "tech", "faq", "cta"],
      sectionVisibility: {
        hero: true,
        services: true,
        whyUs: true,
        process: true,
        tech: true,
        faq: true,
        cta: true
      },
      showWaveDividers: true,
      show3dBackground: true,
      primaryAccentColor: "#00d2ff",
      secondaryAccentColor: "#818cf8"
    }
  );

  // Helper Save Handlers for each subpage
  const handleSaveHero = async () => {
    setIsSaving(true);
    try {
      const ok = await updateCms({ servicesHero: heroForm });
      if (ok) showToast("Services Hero saved successfully!");
      else showToast("Failed to save Services Hero", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveServices = async () => {
    setIsSaving(true);
    try {
      const ok = await updateCms({ services: servicesList });
      if (ok) showToast("Services Showcase saved successfully!");
      else showToast("Failed to save Services", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWhyUs = async () => {
    setIsSaving(true);
    try {
      const ok = await updateCms({
        servicesWhyWorkWithMe: {
          badge: whyWorkHeader.badge,
          title: whyWorkHeader.title,
          subtitle: whyWorkHeader.subtitle,
          highlightText: whyWorkHeader.highlightText,
          description: whyWorkHeader.description,
          cards: whyWorkCards
        }
      });
      if (ok) showToast("Why Work With Me saved successfully!");
      else showToast("Failed to save Why Work With Me", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProcess = async () => {
    setIsSaving(true);
    try {
      const ok = await updateCms({
        servicesWorkflowHeader: processHeader,
        servicesProcess: processSteps,
        processSteps: processSteps
      });
      if (ok) showToast("Engineering Process saved successfully!");
      else showToast("Failed to save Process", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTech = async () => {
    setIsSaving(true);
    try {
      const ok = await updateCms({
        servicesTechHeader: techHeader,
        servicesTechList: techList,
        aboutTechList: techList
      });
      if (ok) showToast("Technologies & Tools saved successfully!");
      else showToast("Failed to save Technologies", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFaq = async () => {
    setIsSaving(true);
    try {
      const ok = await updateCms({
        servicesFaqHeader: faqHeader,
        servicesFaq: faqList,
        faqs: faqList
      });
      if (ok) showToast("FAQ items & Header saved successfully!");
      else showToast("Failed to save FAQs", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCta = async () => {
    setIsSaving(true);
    try {
      const ok = await updateCms({ servicesCta: ctaForm });
      if (ok) showToast("Final CTA Banner saved successfully!");
      else showToast("Failed to save CTA", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFooter = async () => {
    setIsSaving(true);
    try {
      const ok = await updateCms({
        profile: {
          ...cmsData.profile,
          name: footerForm.brandName,
          email: footerForm.email,
          phone: footerForm.phone,
          location: footerForm.location
        }
      });
      if (ok) showToast("Footer information saved successfully!");
      else showToast("Failed to save Footer", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSeo = async () => {
    setIsSaving(true);
    try {
      const updatedPages = (cmsData.pages || []).map((p) =>
        p.slug === "services" || p.id === "services"
          ? {
              ...p,
              title: seoForm.title || p.title,
              seoTitle: seoForm.title || p.seoTitle,
              seoDesc: seoForm.description || p.seoDesc,
              keywords: seoForm.keywords || p.keywords,
              ogImage: seoForm.ogImage || p.ogImage
            }
          : p
      );

      const ok = await updateCms({
        servicesSeoSettings: seoForm,
        pages: updatedPages
      });
      if (ok) showToast("Services SEO & Social Graph saved successfully!");
      else showToast("Failed to save SEO", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDesign = async (updatedDesign?: ServicesDesignSettings) => {
    const payload = updatedDesign || designForm;
    setIsSaving(true);
    try {
      const ok = await updateCms({ servicesDesignSettings: payload });
      if (ok) showToast("Design, Order & Visibility saved successfully!");
      else showToast("Failed to save Design settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Sections definition for the Overview Hub
  const overviewSections = [
    {
      id: "hero" as ServicesSectionKey,
      number: "01",
      name: "Services Hero",
      subtitle: "Headline, Badge & Capability Badges",
      desc: "Hero introduction, badge pill, dynamic headline, gradient highlight, and capability chips.",
      icon: Sparkles,
      countText: `${heroForm.featureTags?.length || 0} Capability Tags`,
      visible: designForm.sectionVisibility?.hero !== false
    },
    {
      id: "services" as ServicesSectionKey,
      number: "02",
      name: "Services Showcase",
      subtitle: "3D Overlapping Carousel & Modals",
      desc: "Add, edit, feature, and reorder all 6+ service offerings with icons, custom images, features, and links.",
      icon: Wrench,
      countText: `${servicesList.length} Active Services`,
      visible: designForm.sectionVisibility?.services !== false
    },
    {
      id: "why-us" as ServicesSectionKey,
      number: "03",
      name: "Why Work With Me",
      subtitle: "4 Engineering Advantage Cards",
      desc: "High-trust value cards highlighting clean architecture, fast delivery, clear communication, and quality.",
      icon: Zap,
      countText: `${whyWorkCards.length} Benefit Cards`,
      visible: designForm.sectionVisibility?.whyUs !== false
    },
    {
      id: "process" as ServicesSectionKey,
      number: "04",
      name: "Engineering Process",
      subtitle: "6-Phase Development Blueprint",
      desc: "Discovery, UI/UX design, engineered development, speed optimization, QA testing, and seamless launch.",
      icon: Layers,
      countText: `${processSteps.length} Execution Phases`,
      visible: designForm.sectionVisibility?.process !== false
    },
    {
      id: "tech" as ServicesSectionKey,
      number: "05",
      name: "Technologies & Tools",
      subtitle: "14+ Full-Stack Arsenal Badges",
      desc: "WordPress, Laravel, React, Tailwind, PHP, Next.js, MySQL, Docker, and developer tools.",
      icon: Cpu,
      countText: `${techList.length} Technologies`,
      visible: designForm.sectionVisibility?.tech !== false
    },
    {
      id: "faq" as ServicesSectionKey,
      number: "06",
      name: "FAQ Management",
      subtitle: "Interactive FAQ Accordions",
      desc: "Client objection handling, turnaround times, custom code standards, warranties, and pricing.",
      icon: HelpCircle,
      countText: `${faqList.length} Questions`,
      visible: designForm.sectionVisibility?.faq !== false
    },
    {
      id: "cta" as ServicesSectionKey,
      number: "07",
      name: "Final CTA Banner",
      subtitle: "Closing Conversion Banner",
      desc: "Headline, description, custom background scene, and dual direct contact action buttons.",
      icon: Send,
      countText: "Conversion Banner",
      visible: designForm.sectionVisibility?.cta !== false
    },
    {
      id: "footer" as ServicesSectionKey,
      number: "08",
      name: "Footer Controls",
      subtitle: "Shared Global Footer Sync",
      desc: "Manage footer branding, bio summary, contact channels, and copyright notice on the services page.",
      icon: Compass,
      countText: "Global Sync",
      visible: true
    },
    {
      id: "seo" as ServicesSectionKey,
      number: "09",
      name: "Page SEO & OG",
      subtitle: "Meta Tags, Social Card & Keywords",
      desc: "Search engine title, meta description, indexed keywords, canonical URL, and OpenGraph social card.",
      icon: Globe,
      countText: "Search & Social",
      visible: true
    },
    {
      id: "theme" as ServicesSectionKey,
      number: "10",
      name: "Design & Visuals",
      subtitle: "Section Order, Toggles & Accents",
      desc: "Reorder page sections, toggle wave dividers, enable 3D particles, and customize cyber accent colors.",
      icon: Settings,
      countText: "Visual Controls",
      visible: true
    }
  ];

  // Common Header for Sub-Pages
  const renderSubPageHeader = (
    sectionNumber: string,
    title: string,
    description: string,
    liveAnchor: string,
    onSave: () => void,
    saveLabel = "Save Changes"
  ) => {
    return (
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#070e24] via-[#09173d] to-[#060c1e] border border-[#00d2ff]/30 shadow-[0_0_35px_rgba(0,210,255,0.12)] mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveSubPage("overview")}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#00d2ff] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Services CMS</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#00d2ff] font-bold">
              Section #{sectionNumber}: {title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/services${liveAnchor}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 border border-[#00d2ff]/30 text-[11px] font-bold text-[#00d2ff] transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live Section</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
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
  // VIEW: 00. SERVICES OVERVIEW HUB
  // =========================================================================
  if (activeSubPage === "overview") {
    const sectionNames: Record<string, string> = {
      hero: "01. Services Hero",
      services: "02. Services Showcase",
      whyUs: "03. Why Work With Me",
      process: "04. Engineering Process",
      tech: "05. Technologies & Tools",
      faq: "06. FAQ Management",
      cta: "07. Final CTA Banner"
    };

    const handleMoveSection = (idx: number, direction: "up" | "down") => {
      const current = [...(designForm.sectionOrder || ["hero", "services", "whyUs", "process", "tech", "faq", "cta"])];
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= current.length) return;
      const temp = current[idx];
      current[idx] = current[targetIdx];
      current[targetIdx] = temp;
      const updated = { ...designForm, sectionOrder: current };
      setDesignForm(updated);
      handleSaveDesign(updated);
    };

    const toggleSectionVisibility = (id: string) => {
      const keyMap: Record<string, "hero" | "services" | "whyUs" | "process" | "tech" | "faq" | "cta"> = {
        hero: "hero",
        services: "services",
        "why-us": "whyUs",
        process: "process",
        tech: "tech",
        faq: "faq",
        cta: "cta"
      };
      const key = keyMap[id];
      if (!key) return;
      const curr = designForm.sectionVisibility || {};
      const nextVal = curr[key] === false ? true : false;
      const updated = {
        ...designForm,
        sectionVisibility: {
          ...curr,
          [key]: nextVal
        }
      };
      setDesignForm(updated);
      handleSaveDesign(updated);
    };

    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#070e24] via-[#09173d] to-[#060c1e] border border-[#00d2ff]/30 shadow-[0_0_35px_rgba(0,210,255,0.12)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/15 border border-[#00d2ff]/30 text-[11px] font-mono font-bold uppercase text-[#00d2ff]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Services CMS // 11 Sub-Pages</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Services Page Full CMS Management
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Complete A-to-Z control over every word, card, icon, image, button, and visual setting on the Live Services Page. Nothing is hardcoded. Changes synchronize instantly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/services"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#081228] hover:bg-[#00d2ff]/15 border border-[#00d2ff]/30 hover:border-[#00d2ff] text-xs font-bold text-[#00d2ff] hover:text-white transition-all shadow-[0_0_15px_rgba(0,210,255,0.15)]"
              >
                <Eye className="w-4 h-4" />
                <span>View Live /services</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Section Reordering Quick Panel */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00d2ff]" />
                <span>Page Section Layout &amp; Reordering</span>
              </h3>
              <p className="text-xs text-slate-400">
                Arrange the vertical appearance of sections on the live Services page or toggle their visibility.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const defaultOrder = ["hero", "services", "whyUs", "process", "tech", "faq", "cta"];
                const updated = { ...designForm, sectionOrder: defaultOrder };
                setDesignForm(updated);
                handleSaveDesign(updated);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors"
            >
              Reset Default Order
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {(designForm.sectionOrder || ["hero", "services", "whyUs", "process", "tech", "faq", "cta"]).map((key, idx, arr) => {
              const isVisible = designForm.sectionVisibility?.[key as keyof typeof designForm.sectionVisibility] !== false;

              return (
                <div
                  key={key}
                  className="p-3 rounded-xl bg-[#050914] border border-white/10 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-[#00d2ff]/10 text-[#00d2ff] text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 truncate">
                      {sectionNames[key] || key}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, "up")}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === arr.length - 1}
                      onClick={() => handleMoveSection(idx, "down")}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 10 Section Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {overviewSections.map((sec) => {
            const Icon = sec.icon;

            return (
              <div
                key={sec.id}
                className="p-5 rounded-2xl bg-[#070d1e]/90 hover:bg-[#091228] border border-white/10 hover:border-[#00d2ff]/50 transition-all duration-200 shadow-md flex flex-col justify-between group relative overflow-hidden"
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

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${
                        sec.visible
                          ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                          : "bg-rose-950/60 border border-rose-500/40 text-rose-300"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${sec.visible ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
                      <span>{sec.visible ? "VISIBLE" : "HIDDEN"}</span>
                    </span>
                  </div>

                  <div className="space-y-1 mb-4">
                    <h3 className="text-base font-bold text-white group-hover:text-[#00d2ff] transition-colors">
                      {sec.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveSubPage(sec.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00d2ff] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Manage Section</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {sec.id !== "footer" && sec.id !== "seo" && sec.id !== "theme" && (
                    <button
                      type="button"
                      onClick={() => toggleSectionVisibility(sec.id as any)}
                      className="text-[11px] font-mono font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {sec.visible ? "Hide" : "Show"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 01. SERVICES HERO
  // =========================================================================
  if (activeSubPage === "hero") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "01",
          "Services Hero Banner",
          "Manage headline, top badge, sub-description, and primary capability pills displayed at the top of the Services page.",
          "#services",
          handleSaveHero
        )}

        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-6">
          {/* Top Badge */}
          <div className="p-5 rounded-xl bg-[#050914] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d2ff] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Top Badge Pill</span>
              </span>

              <button
                type="button"
                onClick={() => setHeroForm({ ...heroForm, showBadge: heroForm.showBadge === false ? true : false })}
                className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-all ${
                  heroForm.showBadge !== false
                    ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-300"
                    : "bg-white/5 border-white/10 text-slate-400"
                }`}
              >
                {heroForm.showBadge !== false ? "Badge Visible" : "Badge Hidden"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Badge Text</label>
                <input
                  type="text"
                  value={heroForm.badge || ""}
                  onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                  placeholder="e.g. BESPOKE WEB SOLUTIONS // ARCHITECTURE & ENGINEERING"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a1226] border border-white/10 text-xs sm:text-sm text-white outline-none focus:border-[#00d2ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Badge Icon</label>
                <select
                  value={heroForm.badgeIcon || "Sparkles"}
                  onChange={(e) => setHeroForm({ ...heroForm, badgeIcon: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a1226] border border-white/10 text-xs sm:text-sm text-white outline-none focus:border-[#00d2ff]"
                >
                  <option value="Sparkles">Sparkles ✨</option>
                  <option value="Zap">Zap ⚡</option>
                  <option value="Wrench">Wrench 🔧</option>
                  <option value="Cpu">Cpu 💻</option>
                  <option value="Star">Star ⭐</option>
                  <option value="Code2">Code2 🖥️</option>
                </select>
              </div>
            </div>
          </div>

          {/* Heading & Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Main Headline</label>
              <input
                type="text"
                value={heroForm.title || ""}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                placeholder="Bespoke Web Solutions Crafted for Exponential Growth"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs sm:text-sm text-white outline-none focus:border-[#00d2ff]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Highlight Text (Gradient Cyan/Purple)</label>
              <input
                type="text"
                value={heroForm.highlightText || ""}
                onChange={(e) => setHeroForm({ ...heroForm, highlightText: e.target.value })}
                placeholder="e.g. Exponential Growth"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs sm:text-sm text-white outline-none focus:border-[#00d2ff]"
              />
            </div>
          </div>

          {/* Sub-Description */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Sub-Description Paragraph</label>
            <textarea
              rows={3}
              value={heroForm.description || ""}
              onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
              placeholder="Enter hero paragraph..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs sm:text-sm text-white outline-none focus:border-[#00d2ff]"
            />
          </div>

          {/* Capability Tags Manager */}
          <div className="p-5 rounded-xl bg-[#050914] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00d2ff]">
                Capability Tags ({heroForm.featureTags?.length || 0})
              </span>

              <button
                type="button"
                onClick={() => {
                  const updated = [...(heroForm.featureTags || []), "New Capability Tag"];
                  setHeroForm({ ...heroForm, featureTags: updated });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tag</span>
              </button>
            </div>

            <div className="space-y-2">
              {(heroForm.featureTags || []).map((tag, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-[#0a1226] border border-white/10"
                >
                  <span className="w-6 h-6 rounded-lg bg-white/5 text-[10px] font-mono text-slate-400 flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => {
                      const updated = [...(heroForm.featureTags || [])];
                      updated[idx] = e.target.value;
                      setHeroForm({ ...heroForm, featureTags: updated });
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#050914] border border-white/10 text-xs text-white outline-none focus:border-[#00d2ff]"
                  />

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...(heroForm.featureTags || [])];
                        const temp = updated[idx - 1];
                        updated[idx - 1] = updated[idx];
                        updated[idx] = temp;
                        setHeroForm({ ...heroForm, featureTags: updated });
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === (heroForm.featureTags || []).length - 1}
                      onClick={() => {
                        const updated = [...(heroForm.featureTags || [])];
                        const temp = updated[idx + 1];
                        updated[idx + 1] = updated[idx];
                        updated[idx] = temp;
                        setHeroForm({ ...heroForm, featureTags: updated });
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = (heroForm.featureTags || []).filter((_, i) => i !== idx);
                        setHeroForm({ ...heroForm, featureTags: updated });
                      }}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/15"
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
    );
  }

  // =========================================================================
  // VIEW: 02. SERVICES SHOWCASE / CAROUSEL
  // =========================================================================
  if (activeSubPage === "services") {
    const handleDuplicateService = (idx: number) => {
      const item = servicesList[idx];
      const duplicated: ServiceItem = {
        ...item,
        number: String(servicesList.length + 1).padStart(2, "0"),
        title: `${item.title} (Copy)`
      };
      const updated = [...servicesList];
      updated.splice(idx + 1, 0, duplicated);
      setServicesList(updated);
      showToast(`Duplicated ${item.title}`);
    };

    const handleDeleteService = (idx: number) => {
      if (servicesList.length <= 1) {
        showToast("Must have at least one service item", "error");
        return;
      }
      const updated = servicesList.filter((_, i) => i !== idx);
      setServicesList(updated);
      showToast("Service item removed");
    };

    const handleMoveService = (idx: number, direction: "up" | "down") => {
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= servicesList.length) return;
      const updated = [...servicesList];
      const temp = updated[idx];
      updated[idx] = updated[target];
      updated[target] = temp;
      setServicesList(updated);
    };

    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "02",
          "Services Showcase & 3D Carousel",
          "Manage all 6+ service offerings, high-fidelity brand icons, custom images, feature checklists, and CTA buttons.",
          "#services",
          handleSaveServices
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">
            Total Services: <span className="text-[#00d2ff] font-bold">{servicesList.length}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setServiceModal({
                isOpen: true,
                mode: "add",
                index: -1,
                data: {
                  number: String(servicesList.length + 1).padStart(2, "0"),
                  title: "New Bespoke Service",
                  shortDesc: "Short summary for carousel card preview.",
                  fullDesc: "Detailed description shown in service modal.",
                  icon: "WebsiteDesign",
                  features: ["Feature standard 1", "Feature standard 2", "Feature standard 3"],
                  techStack: ["WordPress", "Tailwind CSS"],
                  active: true,
                  buttonText: "Learn more",
                  buttonUrl: "/contact"
                }
              });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00d2ff]/15 hover:bg-[#00d2ff]/25 border border-[#00d2ff]/30 text-xs font-bold text-[#00d2ff] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Services Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servicesList.map((service, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#070d1e]/90 border border-white/10 hover:border-[#00d2ff]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#00d2ff]/10 text-[#00d2ff] text-xs font-mono font-bold flex items-center justify-center">
                      {service.number || `0${idx + 1}`}
                    </span>
                    <span className="text-xs font-mono text-slate-400 uppercase">
                      Icon: {service.icon || "Custom"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...servicesList];
                        updated[idx] = { ...updated[idx], active: updated[idx].active === false ? true : false };
                        setServicesList(updated);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                        service.active !== false
                          ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                          : "bg-white/5 border border-white/10 text-slate-400"
                      }`}
                    >
                      {service.active !== false ? "Active" : "Disabled"}
                    </button>

                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveService(idx, "up")}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === servicesList.length - 1}
                      onClick={() => handleMoveService(idx, "down")}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-white">{service.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{service.shortDesc}</p>
                </div>

                {service.imageUrl && (
                  <div className="mt-3 w-full h-24 rounded-xl overflow-hidden border border-white/10 relative">
                    <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(service.features || []).slice(0, 3).map((feat, fIdx) => (
                    <span key={fIdx} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300 font-mono">
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setServiceModal({ isOpen: true, mode: "edit", index: idx, data: { ...service } })}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00d2ff] hover:text-white transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDuplicateService(idx)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteService(idx)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Service Add/Edit Modal */}
        <AnimatePresence>
          {serviceModal.isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setServiceModal({ ...serviceModal, isOpen: false })}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#080e1e] border border-white/15 p-6 sm:p-8 space-y-5 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-[#00d2ff]" />
                    <span>{serviceModal.mode === "add" ? "Add New Service" : "Edit Service Offering"}</span>
                  </h3>

                  <button
                    type="button"
                    onClick={() => setServiceModal({ ...serviceModal, isOpen: false })}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Number Tag</label>
                    <input
                      type="text"
                      value={serviceModal.data.number || ""}
                      onChange={(e) =>
                        setServiceModal({ ...serviceModal, data: { ...serviceModal.data, number: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Brand Icon Style</label>
                    <select
                      value={serviceModal.data.icon || "WebsiteDesign"}
                      onChange={(e) =>
                        setServiceModal({ ...serviceModal, data: { ...serviceModal.data, icon: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
                    >
                      <option value="WebsiteDesign">WebsiteDesign (Monitor)</option>
                      <option value="ECommerce">ECommerce (Shopping Cart)</option>
                      <option value="LandingPage">LandingPage (Rocket)</option>
                      <option value="Laravel">Laravel (Isometric Cube)</option>
                      <option value="WordPress">WordPress (Official W)</option>
                      <option value="CustomSolution">CustomSolution (Layers)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Service Title</label>
                  <input
                    type="text"
                    value={serviceModal.data.title || ""}
                    onChange={(e) =>
                      setServiceModal({ ...serviceModal, data: { ...serviceModal.data, title: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Short Description (Card)</label>
                  <textarea
                    rows={2}
                    value={serviceModal.data.shortDesc || ""}
                    onChange={(e) =>
                      setServiceModal({ ...serviceModal, data: { ...serviceModal.data, shortDesc: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Full Description (Modal)</label>
                  <textarea
                    rows={3}
                    value={serviceModal.data.fullDesc || ""}
                    onChange={(e) =>
                      setServiceModal({ ...serviceModal, data: { ...serviceModal.data, fullDesc: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
                  />
                </div>

                {/* Custom Service Image Upload */}
                <div className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
                  <span className="text-xs font-mono font-bold uppercase text-[#00d2ff]">
                    Custom Service Image (Optional)
                  </span>
                  <UniversalImageManager
                    label="Service Preview Image"
                    imageUrl={serviceModal.data.imageUrl || ""}
                    fallbackUrl="/assets/profile-1-scaled.png"
                    alt={serviceModal.data.title || "Service Preview"}
                    aspectRatio="wide"
                    onImageChange={(url) =>
                      setServiceModal({ ...serviceModal, data: { ...serviceModal.data, imageUrl: url } })
                    }
                    onImageRemove={() =>
                      setServiceModal({ ...serviceModal, data: { ...serviceModal.data, imageUrl: "" } })
                    }
                    openMediaPicker={openMediaPicker}
                    showToast={showToast}
                  />
                </div>

                {/* Features Checklist */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Features Checklist (1 per line)</label>
                  <textarea
                    rows={4}
                    value={(serviceModal.data.features || []).join("\n")}
                    onChange={(e) =>
                      setServiceModal({
                        ...serviceModal,
                        data: {
                          ...serviceModal.data,
                          features: e.target.value.split("\n").filter((f) => f.trim())
                        }
                      })
                    }
                    placeholder="Enter one feature per line..."
                    className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white font-mono"
                  />
                </div>

                {/* Button Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Button Text</label>
                    <input
                      type="text"
                      value={serviceModal.data.buttonText || ""}
                      placeholder="Learn more / Inquire"
                      onChange={(e) =>
                        setServiceModal({ ...serviceModal, data: { ...serviceModal.data, buttonText: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Button URL</label>
                    <input
                      type="text"
                      value={serviceModal.data.buttonUrl || ""}
                      placeholder="/contact?service=..."
                      onChange={(e) =>
                        setServiceModal({ ...serviceModal, data: { ...serviceModal.data, buttonUrl: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setServiceModal({ ...serviceModal, isOpen: false })}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (serviceModal.mode === "add") {
                        setServicesList([...servicesList, serviceModal.data as ServiceItem]);
                      } else {
                        const updated = [...servicesList];
                        updated[serviceModal.index] = serviceModal.data as ServiceItem;
                        setServicesList(updated);
                      }
                      setServiceModal({ ...serviceModal, isOpen: false });
                      showToast("Service updated in list. Click Save to persist!");
                    }}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#0072ff] text-xs text-white font-bold"
                  >
                    Apply Service
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 03. WHY WORK WITH ME
  // =========================================================================
  if (activeSubPage === "why-us") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "03",
          "Why Work With Me",
          "Manage section headline, description, and 4 benefit advantage cards highlighting engineering rigor.",
          "#why-choose-me",
          handleSaveWhyUs
        )}

        {/* Section Header Controls */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <h3 className="text-sm font-mono font-bold uppercase text-[#00d2ff]">Section Header Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Badge Text</label>
              <input
                type="text"
                value={whyWorkHeader.badge}
                onChange={(e) => setWhyWorkHeader({ ...whyWorkHeader, badge: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Title</label>
              <input
                type="text"
                value={whyWorkHeader.title}
                onChange={(e) => setWhyWorkHeader({ ...whyWorkHeader, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Highlight / Subtitle</label>
              <input
                type="text"
                value={whyWorkHeader.highlightText}
                onChange={(e) => setWhyWorkHeader({ ...whyWorkHeader, highlightText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Description</label>
            <textarea
              rows={2}
              value={whyWorkHeader.description}
              onChange={(e) => setWhyWorkHeader({ ...whyWorkHeader, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
            />
          </div>
        </div>

        {/* Benefit Cards Manager */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-mono font-bold uppercase text-[#00d2ff]">Benefit Cards ({whyWorkCards.length})</h3>

            <button
              type="button"
              onClick={() => {
                const newCard: WhyWorkWithMeCard = {
                  badge: "⭐ BENEFIT BADGE",
                  title: "New Benefit Advantage",
                  description: "Explain the client value and engineering commitment clearly.",
                  icon: "Zap",
                  enabled: true
                };
                setWhyWorkCards([...whyWorkCards, newCard]);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whyWorkCards.map((card, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#00d2ff]">Card #{idx + 1}</span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...whyWorkCards];
                        updated[idx] = { ...updated[idx], enabled: updated[idx].enabled === false ? true : false };
                        setWhyWorkCards(updated);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        card.enabled !== false
                          ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                          : "bg-white/5 border border-white/10 text-slate-400"
                      }`}
                    >
                      {card.enabled !== false ? "Visible" : "Hidden"}
                    </button>

                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...whyWorkCards];
                        const temp = updated[idx - 1];
                        updated[idx - 1] = updated[idx];
                        updated[idx] = temp;
                        setWhyWorkCards(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === whyWorkCards.length - 1}
                      onClick={() => {
                        const updated = [...whyWorkCards];
                        const temp = updated[idx + 1];
                        updated[idx + 1] = updated[idx];
                        updated[idx] = temp;
                        setWhyWorkCards(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (whyWorkCards.length <= 1) {
                          showToast("Must have at least one benefit card", "error");
                          return;
                        }
                        setWhyWorkCards(whyWorkCards.filter((_, i) => i !== idx));
                      }}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/15"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase">Micro Badge</label>
                    <input
                      type="text"
                      value={card.badge || ""}
                      onChange={(e) => {
                        const updated = [...whyWorkCards];
                        updated[idx] = { ...updated[idx], badge: e.target.value };
                        setWhyWorkCards(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a1226] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase">Icon</label>
                    <select
                      value={typeof card.icon === "string" ? card.icon : "Zap"}
                      onChange={(e) => {
                        const updated = [...whyWorkCards];
                        updated[idx] = { ...updated[idx], icon: e.target.value };
                        setWhyWorkCards(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a1226] border border-white/10 text-xs text-white"
                    >
                      <option value="Zap">Zap ⚡</option>
                      <option value="Gem">Gem 💎</option>
                      <option value="MessageSquare">MessageSquare 💬</option>
                      <option value="Rocket">Rocket 🚀</option>
                      <option value="Shield">Shield 🛡️</option>
                      <option value="Award">Award 🏆</option>
                      <option value="CheckCircle2">CheckCircle2 ✓</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase">Title</label>
                  <input
                    type="text"
                    value={card.title || ""}
                    onChange={(e) => {
                      const updated = [...whyWorkCards];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setWhyWorkCards(updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a1226] border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase">Description</label>
                  <textarea
                    rows={2}
                    value={card.description || ""}
                    onChange={(e) => {
                      const updated = [...whyWorkCards];
                      updated[idx] = { ...updated[idx], description: e.target.value };
                      setWhyWorkCards(updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a1226] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 04. ENGINEERING PROCESS
  // =========================================================================
  if (activeSubPage === "process") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "04",
          "Engineering Process Phases",
          "Manage the 6-phase engineering blueprint, step numbers, titles, and phase descriptions.",
          "#process",
          handleSaveProcess
        )}

        {/* Section Header */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <h3 className="text-sm font-mono font-bold uppercase text-[#00d2ff]">Header Controls</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Top Badge</label>
              <input
                type="text"
                value={processHeader.badge}
                onChange={(e) => setProcessHeader({ ...processHeader, badge: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Title</label>
              <input
                type="text"
                value={processHeader.title}
                onChange={(e) => setProcessHeader({ ...processHeader, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Highlight Text</label>
              <input
                type="text"
                value={processHeader.highlightText}
                onChange={(e) => setProcessHeader({ ...processHeader, highlightText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Description</label>
            <textarea
              rows={2}
              value={processHeader.description}
              onChange={(e) => setProcessHeader({ ...processHeader, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
            />
          </div>
        </div>

        {/* Process Steps */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-mono font-bold uppercase text-[#00d2ff]">Execution Steps ({processSteps.length})</h3>

            <button
              type="button"
              onClick={() => {
                const newStep: ProcessStep = {
                  step: String(processSteps.length + 1).padStart(2, "0"),
                  title: "New Engineering Step",
                  description: "Describe the objectives and deliverables for this phase.",
                  time: `Phase ${processSteps.length + 1}`,
                  icon: "Layers",
                  active: true
                };
                setProcessSteps([...processSteps, newStep]);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          <div className="space-y-3">
            {processSteps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#00d2ff]/10 text-[#00d2ff] text-xs font-mono font-bold flex items-center justify-center">
                      {step.step || `0${idx + 1}`}
                    </span>
                    <span className="text-xs font-bold text-white">{step.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...processSteps];
                        const temp = updated[idx - 1];
                        updated[idx - 1] = updated[idx];
                        updated[idx] = temp;
                        setProcessSteps(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === processSteps.length - 1}
                      onClick={() => {
                        const updated = [...processSteps];
                        const temp = updated[idx + 1];
                        updated[idx + 1] = updated[idx];
                        updated[idx] = temp;
                        setProcessSteps(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (processSteps.length <= 1) {
                          showToast("Must have at least one step", "error");
                          return;
                        }
                        setProcessSteps(processSteps.filter((_, i) => i !== idx));
                      }}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/15"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase">Phase / Time</label>
                    <input
                      type="text"
                      value={step.time || ""}
                      onChange={(e) => {
                        const updated = [...processSteps];
                        updated[idx] = { ...updated[idx], time: e.target.value };
                        setProcessSteps(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a1226] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase">Title</label>
                    <input
                      type="text"
                      value={step.title || ""}
                      onChange={(e) => {
                        const updated = [...processSteps];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setProcessSteps(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a1226] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase">Icon</label>
                    <select
                      value={step.icon || "Layers"}
                      onChange={(e) => {
                        const updated = [...processSteps];
                        updated[idx] = { ...updated[idx], icon: e.target.value };
                        setProcessSteps(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a1226] border border-white/10 text-xs text-white"
                    >
                      <option value="Layers">Layers</option>
                      <option value="Zap">Zap</option>
                      <option value="Cpu">Cpu</option>
                      <option value="Rocket">Rocket</option>
                      <option value="ShieldCheck">ShieldCheck</option>
                      <option value="Code2">Code2</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase">Description</label>
                  <textarea
                    rows={2}
                    value={step.description || ""}
                    onChange={(e) => {
                      const updated = [...processSteps];
                      updated[idx] = { ...updated[idx], description: e.target.value };
                      setProcessSteps(updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a1226] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 05. TECHNOLOGIES & TOOLS
  // =========================================================================
  if (activeSubPage === "tech") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "05",
          "Technologies & Tools",
          "Manage all 14+ technical skills, official brand SVGs, custom icons, documentation links, and categories.",
          "#tech",
          handleSaveTech
        )}

        {/* Header Controls */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <h3 className="text-sm font-mono font-bold uppercase text-[#00d2ff]">Tech Header Controls</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Top Badge</label>
              <input
                type="text"
                value={techHeader.badge}
                onChange={(e) => setTechHeader({ ...techHeader, badge: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Title</label>
              <input
                type="text"
                value={techHeader.title}
                onChange={(e) => setTechHeader({ ...techHeader, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Highlight Text</label>
              <input
                type="text"
                value={techHeader.highlightText}
                onChange={(e) => setTechHeader({ ...techHeader, highlightText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Description</label>
            <textarea
              rows={2}
              value={techHeader.description}
              onChange={(e) => setTechHeader({ ...techHeader, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
            />
          </div>
        </div>

        {/* Tech Items List */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-mono font-bold uppercase text-[#00d2ff]">Technologies ({techList.length})</h3>

            <button
              type="button"
              onClick={() => {
                const newTech: ServicesTechItem = {
                  name: "New Framework",
                  category: "Frontend",
                  brand: "React",
                  enabled: true
                };
                setTechList([...techList, newTech]);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Technology</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {techList.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#050914] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#00d2ff]">#{idx + 1}</span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...techList];
                        updated[idx] = { ...updated[idx], enabled: updated[idx].enabled === false ? true : false };
                        setTechList(updated);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        item.enabled !== false ? "text-emerald-400 bg-emerald-950/40" : "text-slate-500 bg-white/5"
                      }`}
                    >
                      {item.enabled !== false ? "Active" : "Off"}
                    </button>

                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...techList];
                        const temp = updated[idx - 1];
                        updated[idx - 1] = updated[idx];
                        updated[idx] = temp;
                        setTechList(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === techList.length - 1}
                      onClick={() => {
                        const updated = [...techList];
                        const temp = updated[idx + 1];
                        updated[idx + 1] = updated[idx];
                        updated[idx] = temp;
                        setTechList(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setTechList(techList.filter((_, i) => i !== idx))}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/15"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase">Technology Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const updated = [...techList];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      setTechList(updated);
                    }}
                    className="w-full px-2 py-1 rounded-lg bg-[#0a1226] border border-white/10 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase">Category</label>
                    <input
                      type="text"
                      value={item.category || ""}
                      onChange={(e) => {
                        const updated = [...techList];
                        updated[idx] = { ...updated[idx], category: e.target.value };
                        setTechList(updated);
                      }}
                      placeholder="Frontend, Backend, CMS"
                      className="w-full px-2 py-1 rounded-lg bg-[#0a1226] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase">Brand / SVG</label>
                    <input
                      type="text"
                      value={item.brand || ""}
                      onChange={(e) => {
                        const updated = [...techList];
                        updated[idx] = { ...updated[idx], brand: e.target.value };
                        setTechList(updated);
                      }}
                      placeholder="WordPress, Laravel..."
                      className="w-full px-2 py-1 rounded-lg bg-[#0a1226] border border-white/10 text-xs text-white"
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
  // VIEW: 06. FAQ MANAGEMENT
  // =========================================================================
  if (activeSubPage === "faq") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "06",
          "FAQ Management",
          "Manage client objection handling, project scopes, delivery timelines, and post-launch warranties.",
          "#faq",
          handleSaveFaq
        )}

        {/* Section Header Controls */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <h3 className="text-sm font-mono font-bold uppercase text-[#00d2ff]">FAQ Header Controls</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Top Badge</label>
              <input
                type="text"
                value={faqHeader.badge}
                onChange={(e) => setFaqHeader({ ...faqHeader, badge: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Title</label>
              <input
                type="text"
                value={faqHeader.title}
                onChange={(e) => setFaqHeader({ ...faqHeader, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Highlight Text</label>
              <input
                type="text"
                value={faqHeader.highlightText}
                onChange={(e) => setFaqHeader({ ...faqHeader, highlightText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Description</label>
            <textarea
              rows={2}
              value={faqHeader.description}
              onChange={(e) => setFaqHeader({ ...faqHeader, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
            />
          </div>
        </div>

        {/* FAQs Manager */}
        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-mono font-bold uppercase text-[#00d2ff]">Questions ({faqList.length})</h3>

            <button
              type="button"
              onClick={() => {
                const newFaq: FaqItem = {
                  id: `faq-${Date.now()}`,
                  question: "New Client Question?",
                  answer: "Provide a detailed, reassuring response addressing this topic.",
                  category: "General",
                  order: faqList.length + 1,
                  visible: true
                };
                setFaqList([...faqList, newFaq]);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqList.map((faq, idx) => (
              <div key={faq.id || idx} className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#00d2ff]/10 text-[#00d2ff] text-xs font-mono font-bold flex items-center justify-center">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Order: {faq.order || idx + 1}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...faqList];
                        updated[idx] = { ...updated[idx], visible: updated[idx].visible === false ? true : false };
                        setFaqList(updated);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        faq.visible !== false
                          ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                          : "bg-white/5 border border-white/10 text-slate-400"
                      }`}
                    >
                      {faq.visible !== false ? "Visible" : "Hidden"}
                    </button>

                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...faqList];
                        const temp = updated[idx - 1];
                        updated[idx - 1] = updated[idx];
                        updated[idx] = temp;
                        setFaqList(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === faqList.length - 1}
                      onClick={() => {
                        const updated = [...faqList];
                        const temp = updated[idx + 1];
                        updated[idx + 1] = updated[idx];
                        updated[idx] = temp;
                        setFaqList(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const duplicated: FaqItem = {
                          ...faq,
                          id: `faq-${Date.now()}`,
                          question: `${faq.question} (Copy)`
                        };
                        const updated = [...faqList];
                        updated.splice(idx + 1, 0, duplicated);
                        setFaqList(updated);
                      }}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400"
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setFaqList(faqList.filter((_, i) => i !== idx))}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/15"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Question</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [...faqList];
                      updated[idx] = { ...updated[idx], question: e.target.value };
                      setFaqList(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a1226] border border-white/10 text-xs sm:text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Answer</label>
                  <textarea
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...faqList];
                      updated[idx] = { ...updated[idx], answer: e.target.value };
                      setFaqList(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a1226] border border-white/10 text-xs sm:text-sm text-white leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 07. FINAL CTA BANNER
  // =========================================================================
  if (activeSubPage === "cta") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "07",
          "Final Call-To-Action Banner",
          "Manage headline, description, background image, WhatsApp direct trigger, and secondary portfolio links.",
          "#cta",
          handleSaveCta
        )}

        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Top Badge</label>
              <input
                type="text"
                value={ctaForm.badge || ""}
                onChange={(e) => setCtaForm({ ...ctaForm, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Badge Icon</label>
              <select
                value={ctaForm.badgeIcon || "Sparkles"}
                onChange={(e) => setCtaForm({ ...ctaForm, badgeIcon: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs sm:text-sm text-white"
              >
                <option value="Sparkles">Sparkles ✨</option>
                <option value="Send">Send 🚀</option>
                <option value="Zap">Zap ⚡</option>
                <option value="MessageSquare">MessageSquare 💬</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Main Headline</label>
            <input
              type="text"
              value={ctaForm.heading || ""}
              onChange={(e) => setCtaForm({ ...ctaForm, heading: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs sm:text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Description</label>
            <textarea
              rows={3}
              value={ctaForm.description || ""}
              onChange={(e) => setCtaForm({ ...ctaForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs sm:text-sm text-white"
            />
          </div>

          {/* Background Scene Image */}
          <div className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-[#00d2ff]">
              Custom CTA Background Scene (Optional)
            </span>
            <UniversalImageManager
              label="CTA Scene Background"
              imageUrl={ctaForm.bgImageUrl || ""}
              fallbackUrl="/assets/profile-1-scaled.png"
              alt="Services CTA Background"
              aspectRatio="wide"
              onImageChange={(url) => setCtaForm({ ...ctaForm, bgImageUrl: url })}
              onImageRemove={() => setCtaForm({ ...ctaForm, bgImageUrl: "" })}
              openMediaPicker={openMediaPicker}
              showToast={showToast}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Button */}
            <div className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#00d2ff]">Primary Button</span>
                <button
                  type="button"
                  onClick={() =>
                    setCtaForm({ ...ctaForm, primaryButtonVisible: ctaForm.primaryButtonVisible === false ? true : false })
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    ctaForm.primaryButtonVisible !== false ? "text-emerald-400 bg-emerald-950/40" : "text-slate-500 bg-white/5"
                  }`}
                >
                  {ctaForm.primaryButtonVisible !== false ? "Visible" : "Hidden"}
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase">Text</label>
                <input
                  type="text"
                  value={ctaForm.primaryBtn || ""}
                  onChange={(e) => setCtaForm({ ...ctaForm, primaryBtn: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a1226] border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase">Link URL</label>
                <input
                  type="text"
                  value={ctaForm.primaryLink || ""}
                  onChange={(e) => setCtaForm({ ...ctaForm, primaryLink: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a1226] border border-white/10 text-xs text-white"
                />
              </div>
            </div>

            {/* Secondary Button */}
            <div className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-300">Secondary Button</span>
                <button
                  type="button"
                  onClick={() =>
                    setCtaForm({ ...ctaForm, secondaryButtonVisible: ctaForm.secondaryButtonVisible === false ? true : false })
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    ctaForm.secondaryButtonVisible !== false ? "text-emerald-400 bg-emerald-950/40" : "text-slate-500 bg-white/5"
                  }`}
                >
                  {ctaForm.secondaryButtonVisible !== false ? "Visible" : "Hidden"}
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase">Text</label>
                <input
                  type="text"
                  value={ctaForm.secondaryBtn || ""}
                  onChange={(e) => setCtaForm({ ...ctaForm, secondaryBtn: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a1226] border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase">Link URL</label>
                <input
                  type="text"
                  value={ctaForm.secondaryLink || ""}
                  onChange={(e) => setCtaForm({ ...ctaForm, secondaryLink: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0a1226] border border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 08. FOOTER CONTROLS
  // =========================================================================
  if (activeSubPage === "footer") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "08",
          "Footer Controls",
          "The Services page shares the central global website footer. You can edit footer branding, bio, and contacts here.",
          "#",
          handleSaveFooter
        )}

        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-6">
          <div className="p-4 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-xs text-slate-200 leading-relaxed flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-[#00d2ff] shrink-0" />
              <span>
                Changes saved here reflect in the global footer at the bottom of <strong>/services</strong> and across the entire website.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Footer Brand Name</label>
              <input
                type="text"
                value={footerForm.brandName}
                onChange={(e) => setFooterForm({ ...footerForm, brandName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Tagline / Role</label>
              <input
                type="text"
                value={footerForm.role}
                onChange={(e) => setFooterForm({ ...footerForm, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs sm:text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Footer Bio / Summary</label>
            <textarea
              rows={2}
              value={footerForm.shortBio}
              onChange={(e) => setFooterForm({ ...footerForm, shortBio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs sm:text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Email</label>
              <input
                type="email"
                value={footerForm.email}
                onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Phone / WhatsApp</label>
              <input
                type="text"
                value={footerForm.phone}
                onChange={(e) => setFooterForm({ ...footerForm, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Location</label>
              <input
                type="text"
                value={footerForm.location}
                onChange={(e) => setFooterForm({ ...footerForm, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Copyright Statement</label>
            <input
              type="text"
              value={footerForm.copyright}
              onChange={(e) => setFooterForm({ ...footerForm, copyright: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
            />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 09. PAGE SEO & OG
  // =========================================================================
  if (activeSubPage === "seo") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "09",
          "Services Page SEO & OpenGraph",
          "Configure search engine title tags, meta descriptions, target ranking keywords, and social preview cards for /services.",
          "#",
          handleSaveSeo
        )}

        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-6">
          {/* Google Preview Snippet */}
          <div className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-[#00d2ff]">
              Search Engine Preview
            </span>
            <div className="text-sm font-semibold text-[#8ab4f8] hover:underline cursor-pointer truncate">
              {seoForm.title || "Services | Tarek Rahaman"}
            </div>
            <div className="text-[11px] text-[#00885a] font-mono">
              https://tarekmiah.com/services
            </div>
            <div className="text-xs text-slate-400 line-clamp-2">
              {seoForm.description || "Explore Tarek Rahaman's luxury web development services..."}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Meta Page Title</label>
            <input
              type="text"
              value={seoForm.title || ""}
              onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs sm:text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Meta Description</label>
            <textarea
              rows={3}
              value={seoForm.description || ""}
              onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs sm:text-sm text-white leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Target Keywords (Comma Separated)</label>
            <input
              type="text"
              value={seoForm.keywords || ""}
              onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs sm:text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Canonical URL</label>
            <input
              type="text"
              value={seoForm.canonicalUrl || ""}
              onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050914] border border-white/10 text-xs sm:text-sm text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">OpenGraph Social Title</label>
              <input
                type="text"
                value={seoForm.ogTitle || ""}
                onChange={(e) => setSeoForm({ ...seoForm, ogTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">OpenGraph Social Description</label>
              <input
                type="text"
                value={seoForm.ogDescription || ""}
                onChange={(e) => setSeoForm({ ...seoForm, ogDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#050914] border border-white/10 text-xs text-white"
              />
            </div>
          </div>

          {/* OG Image */}
          <div className="p-4 rounded-xl bg-[#050914] border border-white/10 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-[#00d2ff]">
              OpenGraph Social Preview Image (1200 x 630px)
            </span>
            <UniversalImageManager
              label="OG Social Image"
              imageUrl={seoForm.ogImage || ""}
              fallbackUrl="/assets/profile-1-scaled.png"
              alt="Services Social Share Image"
              aspectRatio="wide"
              onImageChange={(url) => setSeoForm({ ...seoForm, ogImage: url })}
              onImageRemove={() => setSeoForm({ ...seoForm, ogImage: "" })}
              openMediaPicker={openMediaPicker}
              showToast={showToast}
            />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 10. DESIGN & VISUAL CONTROLS
  // =========================================================================
  if (activeSubPage === "theme") {
    return (
      <div className="space-y-6">
        {renderSubPageHeader(
          "10",
          "Design & Visual Controls",
          "Manage vertical section order, visibility switches, wave dividers, and cyber glowing accent colors.",
          "#",
          () => handleSaveDesign()
        )}

        <div className="p-6 rounded-2xl bg-[#070d1e]/90 border border-white/10 space-y-6">
          {/* Visual Effect Switches */}
          <div className="p-5 rounded-xl bg-[#050914] border border-white/10 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-[#00d2ff] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Atmospheric &amp; Visual Controls</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0a1226] border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Flowing Wave Dividers</h4>
                  <p className="text-[11px] text-slate-400">Display RGB glowing energy wave dividers between sections.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDesignForm({
                      ...designForm,
                      showWaveDividers: designForm.showWaveDividers === false ? true : false
                    })
                  }
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    designForm.showWaveDividers !== false
                      ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                      : "bg-white/5 border border-white/10 text-slate-400"
                  }`}
                >
                  {designForm.showWaveDividers !== false ? "ON" : "OFF"}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#0a1226] border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">3D Ambient Glow</h4>
                  <p className="text-[11px] text-slate-400">Render cyber ambient light beams and soft radial gradients.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDesignForm({
                      ...designForm,
                      show3dBackground: designForm.show3dBackground === false ? true : false
                    })
                  }
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    designForm.show3dBackground !== false
                      ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                      : "bg-white/5 border border-white/10 text-slate-400"
                  }`}
                >
                  {designForm.show3dBackground !== false ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          </div>

          {/* Section Visibility Master Switches */}
          <div className="p-5 rounded-xl bg-[#050914] border border-white/10 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-[#00d2ff] flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Section Visibility Switches</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { key: "hero", label: "01. Hero Banner" },
                { key: "services", label: "02. Services Showcase" },
                { key: "whyUs", label: "03. Why Work With Me" },
                { key: "process", label: "04. Engineering Process" },
                { key: "tech", label: "05. Tech Stack" },
                { key: "faq", label: "06. FAQs" },
                { key: "cta", label: "07. Final CTA Banner" }
              ].map(({ key, label }) => {
                const isVis = designForm.sectionVisibility?.[key as keyof typeof designForm.sectionVisibility] !== false;

                return (
                  <div key={key} className="p-3 rounded-xl bg-[#0a1226] border border-white/10 flex items-center justify-between">
                    <span className="text-xs text-slate-200">{label}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const curr = designForm.sectionVisibility || {};
                        setDesignForm({
                          ...designForm,
                          sectionVisibility: {
                            ...curr,
                            [key]: isVis ? false : true
                          }
                        });
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isVis
                          ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                          : "bg-rose-950/60 border border-rose-500/40 text-rose-300"
                      }`}
                    >
                      {isVis ? "VISIBLE" : "HIDDEN"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Accents */}
          <div className="p-5 rounded-xl bg-[#050914] border border-white/10 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-[#00d2ff] flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span>Cyber Glowing Accents</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Primary Cyber Accent</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={designForm.primaryAccentColor || "#00d2ff"}
                    onChange={(e) => setDesignForm({ ...designForm, primaryAccentColor: e.target.value })}
                    className="w-10 h-10 rounded-xl bg-transparent border border-white/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={designForm.primaryAccentColor || "#00d2ff"}
                    onChange={(e) => setDesignForm({ ...designForm, primaryAccentColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0a1226] border border-white/10 text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Secondary Purple/Pink Accent</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={designForm.secondaryAccentColor || "#818cf8"}
                    onChange={(e) => setDesignForm({ ...designForm, secondaryAccentColor: e.target.value })}
                    className="w-10 h-10 rounded-xl bg-transparent border border-white/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={designForm.secondaryAccentColor || "#818cf8"}
                    onChange={(e) => setDesignForm({ ...designForm, secondaryAccentColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0a1226] border border-white/10 text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
