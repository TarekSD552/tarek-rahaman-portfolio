/**
 * ============================================================================
 * TAREK RAHAMAN PORTFOLIO — SMART PROJECT PRICING & ESTIMATION CONFIGURATION
 * ============================================================================
 * 
 * Central, easy-to-edit configuration for project pricing, timelines,
 * and service packages.
 * 
 * Edit this file anytime to update Tarek's pricing rates, delivery times,
 * or package inclusions. The AI Chat Assistant automatically uses this file
 * to provide accurate, controlled, and realistic estimates.
 */

export interface PricingTier {
  id: string;
  name: string;
  category: "landing" | "business" | "ecommerce" | "webapp" | "portfolio" | "optimization";
  typicalPages: string;
  timelineDays: { min: number; max: number };
  budgetBdt: { min: number; max: number };
  budgetUsd: { min: number; max: number };
  included: string[];
  recommendedTech: string[];
  description: string;
}

export interface PricingAddon {
  id: string;
  name: string;
  bdt: { min: number; max: number };
  usd: { min: number; max: number };
  description: string;
}

/**
 * Standard Project Types and Price Tiers
 */
export const PROJECT_PRICING_TIERS: PricingTier[] = [
  {
    id: "landing_page",
    name: "Landing Page / One-Page Website",
    category: "landing",
    typicalPages: "1 Single High-Converting Page (Multiple Sections)",
    timelineDays: { min: 3, max: 5 },
    budgetBdt: { min: 8000, max: 15000 },
    budgetUsd: { min: 80, max: 150 },
    included: [
      "Custom responsive design (Mobile, Tablet & Desktop)",
      "Modern hero section with lead capture / CTA",
      "Interactive features & smooth scroll animations",
      "Contact form with email / WhatsApp integration",
      "On-page speed optimization & basic SEO setup",
      "Social media integration",
    ],
    recommendedTech: ["Next.js / Tailwind CSS", "WordPress + Elementor Pro", "HTML5 / Modern JS"],
    description: "Ideal for product launches, marketing campaigns, event promotions, or single service showcases.",
  },
  {
    id: "business_corporate",
    name: "Business / Corporate Website",
    category: "business",
    typicalPages: "5 to 8 standard pages (Home, About, Services, Portfolio, Blog, Contact, etc.)",
    timelineDays: { min: 7, max: 12 },
    budgetBdt: { min: 18000, max: 35000 },
    budgetUsd: { min: 180, max: 350 },
    included: [
      "Custom modern UI tailored to company brand",
      "5 to 8 fully responsive pages",
      "User-friendly Admin CMS for easy text/image editing",
      "Dynamic Services & Project Showcase gallery",
      "Contact form with spam protection & Google Maps",
      "Direct WhatsApp chat integration",
      "Technical SEO & Core Web Vitals speed optimization (90+ score)",
    ],
    recommendedTech: ["Next.js / React with Headless CMS", "Custom WordPress Development", "PHP / Laravel"],
    description: "Perfect for companies, agencies, clinics, consulting firms, and institutions wanting a professional digital presence.",
  },
  {
    id: "ecommerce_store",
    name: "E-Commerce / WooCommerce Online Store",
    category: "ecommerce",
    typicalPages: "Full online store with catalog, cart, checkout, account, and policy pages",
    timelineDays: { min: 12, max: 20 },
    budgetBdt: { min: 30000, max: 65000 },
    budgetUsd: { min: 300, max: 650 },
    included: [
      "Complete WooCommerce setup & custom product catalog",
      "Local payment gateways (bKash, Nagad, Rocket, SSLCommerz, Aamarpay, COD) and/or international (Stripe, PayPal)",
      "Shopping cart, dynamic checkout & automated order tracking",
      "Inventory management & discount coupon system",
      "Automated invoice PDF generation & email notifications",
      "Customer accounts & order history dashboard",
      "Comprehensive security hardening & caching optimization",
    ],
    recommendedTech: ["WordPress + WooCommerce", "Next.js / React Commerce + Node.js/Laravel API"],
    description: "Designed for clothing brands, electronics, grocery, and multi-product stores seeking seamless checkout and conversion.",
  },
  {
    id: "custom_webapp",
    name: "Custom Web Application / SaaS / Portal",
    category: "webapp",
    typicalPages: "Dynamic multi-view application with authentication, dashboards, and role-based views",
    timelineDays: { min: 20, max: 35 },
    budgetBdt: { min: 50000, max: 120000 },
    budgetUsd: { min: 500, max: 1200 },
    included: [
      "Custom software architecture & database schema (MySQL / PostgreSQL)",
      "User authentication, password reset, and Role-Based Access Control (RBAC)",
      "Interactive analytics / client / admin dashboards",
      "Custom RESTful APIs & third-party service integrations",
      "Data export (PDF, Excel) and automated reporting",
      "High-security validation, sanitization & CSRF protection",
      "Production deployment on VPS (cPanel, Hostinger, Vercel, AWS)",
    ],
    recommendedTech: ["Laravel + MySQL + React/Next.js", "Node.js / Express / TypeScript", "Tailwind CSS"],
    description: "For custom business tools, booking systems, learning management (LMS), real-estate portals, or SaaS MVPs.",
  },
  {
    id: "portfolio_personal",
    name: "Personal / Portfolio Website",
    category: "portfolio",
    typicalPages: "3 to 5 pages (Home, About, Skills, Projects, Contact)",
    timelineDays: { min: 5, max: 8 },
    budgetBdt: { min: 12000, max: 22000 },
    budgetUsd: { min: 120, max: 220 },
    included: [
      "Signature modern aesthetic (dark/light, neon or minimalist)",
      "Interactive skills breakdown & dynamic project showcases",
      "Resume download, education & experience timeline",
      "Built-in contact form & direct social/WhatsApp links",
      "Smooth micro-interactions & mobile responsiveness",
    ],
    recommendedTech: ["Next.js / React / Tailwind CSS", "WordPress Custom Theme"],
    description: "Tailored for software engineers, designers, executives, photographers, and creative professionals.",
  },
  {
    id: "optimization_redesign",
    name: "Website Redesign & Speed Optimization",
    category: "optimization",
    typicalPages: "Existing website overhaul",
    timelineDays: { min: 3, max: 7 },
    budgetBdt: { min: 8000, max: 18000 },
    budgetUsd: { min: 80, max: 180 },
    included: [
      "Google Core Web Vitals speed optimization (target 90+ mobile & desktop)",
      "Modern UI/UX redesign of legacy sections",
      "Fixing layout brokenness, responsiveness, and mobile bugs",
      "Image WebP conversion, CSS/JS minification, and database cleanup",
      "Security audit & malware scan cleanup",
    ],
    recommendedTech: ["WordPress / Elementor", "Next.js / React", "PHP / HTML / CSS"],
    description: "For slow, outdated, or broken websites needing a fresh look and rapid loading times.",
  },
];

/**
 * Optional Add-ons & Feature Modifiers
 */
export const PRICING_ADDONS: PricingAddon[] = [
  {
    id: "extra_pages",
    name: "Additional Content Page",
    bdt: { min: 1500, max: 2500 },
    usd: { min: 15, max: 25 },
    description: "Per additional custom-designed page beyond package scope",
  },
  {
    id: "payment_gateway",
    name: "Custom Payment Gateway (bKash/Nagad/SSLCommerz/Stripe)",
    bdt: { min: 5000, max: 10000 },
    usd: { min: 50, max: 100 },
    description: "Automated API verification and instant payment callback",
  },
  {
    id: "multilingual",
    name: "Bilingual / Multi-language Support (Bangla + English)",
    bdt: { min: 5000, max: 8000 },
    usd: { min: 50, max: 80 },
    description: "Language switcher with separate language content",
  },
  {
    id: "advanced_animation",
    name: "Advanced 3D / GSAP / Interactive Neon Animations",
    bdt: { min: 5000, max: 12000 },
    usd: { min: 50, max: 120 },
    description: "Cinematic, luxury-grade scroll interactions and interactive widgets",
  },
];

/**
 * Helper to build the pricing knowledge text for injection into Gemini's system prompt.
 */
export function buildPricingKnowledgePrompt(): string {
  const tiersText = PROJECT_PRICING_TIERS.map((tier) => {
    return `### ${tier.name} (${tier.category})
- Typical Scope: ${tier.typicalPages}
- Estimated Timeline: ${tier.timelineDays.min}–${tier.timelineDays.max} days
- Estimated Budget: ৳${tier.budgetBdt.min.toLocaleString()} – ৳${tier.budgetBdt.max.toLocaleString()} BDT ($${tier.budgetUsd.min} – $${tier.budgetUsd.max} USD)
- Typical Inclusions:
${tier.included.map((inc) => `  * ${inc}`).join("\n")}
- Recommended Stack: ${tier.recommendedTech.join(", ")}
- Best For: ${tier.description}`;
  }).join("\n\n");

  const addonsText = PRICING_ADDONS.map(
    (a) =>
      `- **${a.name}**: ৳${a.bdt.min.toLocaleString()} – ৳${a.bdt.max.toLocaleString()} BDT ($${a.usd.min} – $${a.usd.max} USD) [${a.description}]`
  ).join("\n");

  return `
======================================================
SMART PROJECT PRICE ESTIMATOR — OFFICIAL PRICING RULES:
======================================================
CRITICAL RULE: DO NOT INVENT RANDOM PRICES OR OVERCHARGE/UNDERCHARGE.
All pricing estimates MUST strictly follow Tarek Rahaman's official rate card below:

${tiersText}

OPTIONAL ADD-ONS & MODIFIERS:
${addonsText}

RULES FOR PRESENTING ESTIMATES TO CLIENTS:
1. Always present estimates as an **ESTIMATED RANGE** (never a rigid final contract price), since final price depends on custom features, total pages, and API integrations.
2. Structure the estimate cleanly using this format:

**Project Type:** [Identified Type, e.g. Business Website / E-Commerce Store]  
**Estimated Timeline:** [X]–[Y] days  
**Estimated Budget:** ৳[Min,000] – ৳[Max,000] BDT (approx. $[Min] – $[Max] USD)  

**Included:**  
- [Item 1]  
- [Item 2]  
- [Item 3]  
- [Item 4]  

**Note:** The final cost depends on the exact features and requirements. Based on the information available, this project may fall within an estimated range. Tarek can provide a final quote after reviewing the complete requirements.
3. If the user writes in Bangla, translate the currency and terms naturally into Bengali (e.g., ৳২০,০০০ – ৳৩৫,০০০ টাকা, সময়: ৭–১২ দিন) and use the note: "চূড়ান্ত খরচ প্রকল্পের সুনির্দিষ্ট বৈশিষ্ট্য ও চাহিদার ওপর নির্ভর করে। সম্পূর্ণ প্রয়োজনীয়তা পর্যালোচনার পর তারেক চূড়ান্ত বাজেট প্রদান করবেন।"
4. Always invite the client to discuss their specific scope directly with Tarek via WhatsApp (+880 1733-119269) or the Contact Page (/contact) for a detailed breakdown.
`.trim();
}

/**
 * Programmatic matching helper for finding the best matching tier from user text.
 */
export function matchPricingTier(query: string): PricingTier {
  const q = query.toLowerCase();

  if (
    q.includes("ecommerce") ||
    q.includes("e-commerce") ||
    q.includes("store") ||
    q.includes("shop") ||
    q.includes("woocommerce") ||
    q.includes("দোকান") ||
    q.includes("ই-কমার্স") ||
    q.includes("প্রোডাক্ট")
  ) {
    return PROJECT_PRICING_TIERS.find((t) => t.category === "ecommerce")!;
  }

  if (
    q.includes("app") ||
    q.includes("saas") ||
    q.includes("portal") ||
    q.includes("dashboard") ||
    q.includes("management") ||
    q.includes("laravel") ||
    q.includes("সফটওয়্যার")
  ) {
    return PROJECT_PRICING_TIERS.find((t) => t.category === "webapp")!;
  }

  if (
    q.includes("landing") ||
    q.includes("one page") ||
    q.includes("single page") ||
    q.includes("ল্যান্ডিং")
  ) {
    return PROJECT_PRICING_TIERS.find((t) => t.category === "landing")!;
  }

  if (
    q.includes("portfolio") ||
    q.includes("personal") ||
    q.includes("cv") ||
    q.includes("resume") ||
    q.includes("পোর্টফোলিও")
  ) {
    return PROJECT_PRICING_TIERS.find((t) => t.category === "portfolio")!;
  }

  if (
    q.includes("redesign") ||
    q.includes("speed") ||
    q.includes("slow") ||
    q.includes("fix") ||
    q.includes("optimize") ||
    q.includes("স্পিড")
  ) {
    return PROJECT_PRICING_TIERS.find((t) => t.category === "optimization")!;
  }

  // Default to standard business / corporate website
  return PROJECT_PRICING_TIERS.find((t) => t.category === "business")!;
}

