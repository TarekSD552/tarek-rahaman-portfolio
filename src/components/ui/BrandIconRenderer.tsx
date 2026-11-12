"use client";

import React from "react";
import {
  Gem,
  Hotel,
  Palmtree,
  Building2,
  Compass,
  Crown,
  Sparkles,
  ShoppingBag,
  Shirt,
  Watch,
  GraduationCap,
  BookOpen,
  Award,
  Code2,
  Terminal,
  Laptop,
  Cpu,
  Layers,
  Server,
  Globe,
  Store,
  Briefcase,
  Rocket,
  Zap,
  ShieldCheck,
  Activity,
  TrendingUp,
  Database,
  Bed,
  LucideIcon,
} from "lucide-react";
import { ClientBrand } from "@/types/portfolio";

export interface BrandIconOption {
  name: string;
  label: string;
  category:
    | "E-Commerce & Retail"
    | "Luxury & Lifestyle"
    | "Hospitality & Travel"
    | "EdTech & Learning"
    | "Tech & SaaS"
    | "Business & Enterprise";
  keywords: string[];
}

export const BRAND_ICON_OPTIONS: BrandIconOption[] = [
  // E-Commerce & Retail
  {
    name: "Mango",
    label: "Mango Fruit (E-Commerce Agri)",
    category: "E-Commerce & Retail",
    keywords: ["mango", "fruit", "agriculture", "agro", "food", "farm", "naogaon", "bazar", "ecommerce", "organic"],
  },
  {
    name: "Store",
    label: "Storefront (Marketplace & Shop)",
    category: "E-Commerce & Retail",
    keywords: ["store", "shop", "market", "bazar", "retail", "commerce", "outlet"],
  },
  {
    name: "ShoppingBag",
    label: "Shopping Bag (Retail & Fashion)",
    category: "E-Commerce & Retail",
    keywords: ["shopping", "bag", "cart", "retail", "fashion", "boutique", "order"],
  },

  // Luxury & Lifestyle
  {
    name: "Gem",
    label: "Diamond / Gem (Luxury Jewelry)",
    category: "Luxury & Lifestyle",
    keywords: ["gem", "diamond", "jewelry", "ruporia", "luxury", "precious", "gold", "crystal"],
  },
  {
    name: "Crown",
    label: "Crown (Royal Luxury & Fashion)",
    category: "Luxury & Lifestyle",
    keywords: ["crown", "luxury", "royalty", "suns", "vip", "prestige", "fashion", "elite"],
  },
  {
    name: "Sparkles",
    label: "Sparkles (Luxury & Elegance)",
    category: "Luxury & Lifestyle",
    keywords: ["sparkles", "luxury", "shine", "stars", "elegance", "premium", "glamour"],
  },
  {
    name: "Shirt",
    label: "Apparel / Clothing (Fashion Retail)",
    category: "Luxury & Lifestyle",
    keywords: ["shirt", "apparel", "clothing", "fashion", "textile", "wear", "garments"],
  },
  {
    name: "Watch",
    label: "Watch (Luxury Accessories)",
    category: "Luxury & Lifestyle",
    keywords: ["watch", "time", "clock", "luxury", "accessories", "jewelry"],
  },

  // Hospitality, Travel & Real Estate
  {
    name: "Hotel",
    label: "Hotel & Resort (Hospitality)",
    category: "Hospitality & Travel",
    keywords: ["hotel", "hospitality", "resort", "desert", "sands", "uae", "motel", "stay", "accommodation"],
  },
  {
    name: "Palmtree",
    label: "Palm Tree & Oasis (Resort/Travel)",
    category: "Hospitality & Travel",
    keywords: ["palmtree", "palm", "desert", "beach", "tropical", "vacation", "oasis", "tourism"],
  },
  {
    name: "Building2",
    label: "Enterprise Tower (Real Estate / Corporate)",
    category: "Hospitality & Travel",
    keywords: ["building", "tower", "real estate", "corporate", "properties", "apartments"],
  },
  {
    name: "Compass",
    label: "Compass (Exploration & Travel)",
    category: "Hospitality & Travel",
    keywords: ["compass", "travel", "desert", "adventure", "navigation", "expedition"],
  },
  {
    name: "Bed",
    label: "Bed & Stay (Hospitality)",
    category: "Hospitality & Travel",
    keywords: ["bed", "stay", "lodge", "hotel", "rooms", "hostel"],
  },

  // EdTech & Learning
  {
    name: "GraduationCap",
    label: "Graduation Cap (EdTech & Academy)",
    category: "EdTech & Learning",
    keywords: ["graduation", "cap", "edtech", "education", "learning", "apex", "school", "university", "academy", "shikaku"],
  },
  {
    name: "BookOpen",
    label: "Open Book (Education & Knowledge)",
    category: "EdTech & Learning",
    keywords: ["book", "reading", "study", "learning", "knowledge", "training", "courses"],
  },
  {
    name: "Award",
    label: "Award Medal (Excellence & Certification)",
    category: "EdTech & Learning",
    keywords: ["award", "badge", "certificate", "excellence", "medal", "achievement"],
  },

  // Tech & SaaS
  {
    name: "Code2",
    label: "Code & Tags (Software Stack)",
    category: "Tech & SaaS",
    keywords: ["code", "software", "developer", "tech", "nordic", "stack", "programming", "dev"],
  },
  {
    name: "Laptop",
    label: "Laptop (Digital Platform & Workstation)",
    category: "Tech & SaaS",
    keywords: ["laptop", "computer", "digital", "platform", "saas", "tech", "app"],
  },
  {
    name: "Cpu",
    label: "CPU / Chip (Hardware & AI High-Tech)",
    category: "Tech & SaaS",
    keywords: ["cpu", "chip", "processor", "hardware", "ai", "machine learning", "tech"],
  },
  {
    name: "Layers",
    label: "Stacked Layers (SaaS Architecture)",
    category: "Tech & SaaS",
    keywords: ["layers", "stack", "framework", "saas", "architecture", "cloud", "platform"],
  },
  {
    name: "Terminal",
    label: "Terminal / CLI (Cloud & DevOps)",
    category: "Tech & SaaS",
    keywords: ["terminal", "cli", "devops", "cloud", "console", "sysadmin"],
  },
  {
    name: "Server",
    label: "Server (Infrastructure & Hosting)",
    category: "Tech & SaaS",
    keywords: ["server", "database", "infrastructure", "backend", "hosting", "cloud"],
  },

  // Business & Enterprise
  {
    name: "Globe",
    label: "Globe (Global Enterprise & International)",
    category: "Business & Enterprise",
    keywords: ["globe", "world", "international", "global", "network", "web", "multinational"],
  },
  {
    name: "ShieldCheck",
    label: "Shield Check (Security & Enterprise IT)",
    category: "Business & Enterprise",
    keywords: ["shield", "security", "protection", "trust", "verified", "innove", "cybersecurity"],
  },
  {
    name: "Rocket",
    label: "Rocket (Startup & Innovation)",
    category: "Business & Enterprise",
    keywords: ["rocket", "launch", "startup", "growth", "speed", "scale", "innovation"],
  },
  {
    name: "Zap",
    label: "Lightning Zap (High Velocity & Energy)",
    category: "Business & Enterprise",
    keywords: ["zap", "lightning", "fast", "speed", "energy", "power", "performance"],
  },
  {
    name: "Briefcase",
    label: "Briefcase (Consulting & Corporate)",
    category: "Business & Enterprise",
    keywords: ["briefcase", "consulting", "agency", "corporate", "business", "professional"],
  },
  {
    name: "TrendingUp",
    label: "Trending Chart (Finance & Growth)",
    category: "Business & Enterprise",
    keywords: ["trending", "chart", "finance", "growth", "revenue", "analytics", "invest"],
  },
  {
    name: "Activity",
    label: "Pulse Activity (HealthTech & Monitoring)",
    category: "Business & Enterprise",
    keywords: ["activity", "pulse", "health", "metrics", "monitoring", "analytics"],
  },
  {
    name: "Database",
    label: "Database (Data Science & Analytics)",
    category: "Business & Enterprise",
    keywords: ["database", "data", "storage", "sql", "analytics", "lakehouse"],
  },
];

/**
 * Custom Crisp Mango SVG (Matches client brand reference exactly)
 */
export function MangoIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={`${className} drop-shadow-[0_0_8px_rgba(245,158,11,0.65)] shrink-0`}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="brand-mango-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      {/* Green Stem Leaf */}
      <path d="M16 7 C18 3, 23 3, 24 5 C24 8, 21 10, 17 8" fill="#10b981" />
      {/* Golden-Orange Mango Body */}
      <path
        d="M16 7 C11 7, 7.5 12, 8.5 18.5 C9.5 24, 14.5 28.5, 19 27.5 C24 25.5, 25.5 18, 22.5 12.5 C20.5 8.5, 18 7, 16 7 Z"
        fill="url(#brand-mango-grad)"
      />
    </svg>
  );
}

/**
 * Automatically determine the recommended default industry icon based on name and industry
 */
export function getDefaultBrandIcon(brand: Partial<ClientBrand>): string {
  const text = `${brand.name || ""} ${brand.industry || ""}`.toLowerCase();

  if (text.includes("mango") || text.includes("fruit") || text.includes("agri") || text.includes("farm")) {
    return "Mango";
  }
  if (text.includes("ruporia") || text.includes("jewelry") || text.includes("diamond") || text.includes("gem")) {
    return "Gem";
  }
  if (
    text.includes("desert") ||
    text.includes("sands") ||
    text.includes("hotel") ||
    text.includes("hospitality") ||
    text.includes("resort") ||
    text.includes("uae")
  ) {
    return "Hotel";
  }
  if (text.includes("suns") || text.includes("crown") || text.includes("vip") || text.includes("luxury")) {
    return "Crown";
  }
  if (
    text.includes("fashion") ||
    text.includes("retail") ||
    text.includes("apparel") ||
    text.includes("clothing") ||
    text.includes("boutique") ||
    text.includes("china city")
  ) {
    return "ShoppingBag";
  }
  if (
    text.includes("apex") ||
    text.includes("learning") ||
    text.includes("edtech") ||
    text.includes("education") ||
    text.includes("school") ||
    text.includes("university") ||
    text.includes("shikaku")
  ) {
    return "GraduationCap";
  }
  if (
    text.includes("nordic") ||
    text.includes("stack") ||
    text.includes("saas") ||
    text.includes("code") ||
    text.includes("software") ||
    text.includes("developer")
  ) {
    return "Code2";
  }
  if (text.includes("innove") || text.includes("security") || text.includes("shield") || text.includes("cyber")) {
    return "ShieldCheck";
  }
  if (text.includes("store") || text.includes("shop") || text.includes("bazar") || text.includes("commerce")) {
    return "Store";
  }
  return "Globe";
}

const ICON_MAP: Record<string, { icon: LucideIcon; color: string }> = {
  Gem: { icon: Gem, color: "text-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff]" },
  Hotel: { icon: Hotel, color: "text-[#f59e0b] drop-shadow-[0_0_8px_#f59e0b]" },
  Palmtree: { icon: Palmtree, color: "text-[#10b981] drop-shadow-[0_0_8px_#10b981]" },
  Building2: { icon: Building2, color: "text-[#00d9ff] drop-shadow-[0_0_8px_#00d9ff]" },
  Compass: { icon: Compass, color: "text-[#38bdf8] drop-shadow-[0_0_8px_#38bdf8]" },
  Crown: { icon: Crown, color: "text-[#fbbf24] drop-shadow-[0_0_8px_#fbbf24]" },
  Sparkles: { icon: Sparkles, color: "text-[#ec4899] drop-shadow-[0_0_8px_#ec4899]" },
  ShoppingBag: { icon: ShoppingBag, color: "text-[#ec4899] drop-shadow-[0_0_8px_#ec4899]" },
  Shirt: { icon: Shirt, color: "text-[#f43f5e] drop-shadow-[0_0_8px_#f43f5e]" },
  Watch: { icon: Watch, color: "text-[#e2e8f0] drop-shadow-[0_0_8px_#e2e8f0]" },
  GraduationCap: { icon: GraduationCap, color: "text-[#60a5fa] drop-shadow-[0_0_8px_#60a5fa]" },
  BookOpen: { icon: BookOpen, color: "text-[#38bdf8] drop-shadow-[0_0_8px_#38bdf8]" },
  Award: { icon: Award, color: "text-[#facc15] drop-shadow-[0_0_8px_#facc15]" },
  Code2: { icon: Code2, color: "text-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff]" },
  Laptop: { icon: Laptop, color: "text-[#38bdf8] drop-shadow-[0_0_8px_#38bdf8]" },
  Cpu: { icon: Cpu, color: "text-[#818cf8] drop-shadow-[0_0_8px_#818cf8]" },
  Layers: { icon: Layers, color: "text-[#38bdf8] drop-shadow-[0_0_8px_#38bdf8]" },
  Terminal: { icon: Terminal, color: "text-[#34d399] drop-shadow-[0_0_8px_#34d399]" },
  Server: { icon: Server, color: "text-[#a78bfa] drop-shadow-[0_0_8px_#a78bfa]" },
  Globe: { icon: Globe, color: "text-[#00d9ff] drop-shadow-[0_0_8px_#00d9ff]" },
  Store: { icon: Store, color: "text-[#34d399] drop-shadow-[0_0_8px_#34d399]" },
  Briefcase: { icon: Briefcase, color: "text-[#94a3b8] drop-shadow-[0_0_8px_#94a3b8]" },
  Rocket: { icon: Rocket, color: "text-[#f97316] drop-shadow-[0_0_8px_#f97316]" },
  Zap: { icon: Zap, color: "text-[#facc15] drop-shadow-[0_0_8px_#facc15]" },
  ShieldCheck: { icon: ShieldCheck, color: "text-[#10b981] drop-shadow-[0_0_8px_#10b981]" },
  TrendingUp: { icon: TrendingUp, color: "text-[#34d399] drop-shadow-[0_0_8px_#34d399]" },
  Activity: { icon: Activity, color: "text-[#f43f5e] drop-shadow-[0_0_8px_#f43f5e]" },
  Database: { icon: Database, color: "text-[#38bdf8] drop-shadow-[0_0_8px_#38bdf8]" },
  Bed: { icon: Bed, color: "text-[#f59e0b] drop-shadow-[0_0_8px_#f59e0b]" },
};

export interface BrandIconRendererProps {
  iconName?: string;
  brandName?: string;
  industry?: string;
  className?: string;
}

/**
 * Universal Brand Icon Renderer:
 * Priority: Exact iconName match -> Automatic keyword match -> Globe fallback
 */
export default function BrandIconRenderer({
  iconName,
  brandName,
  industry,
  className = "w-6 sm:w-7 h-6 sm:h-7",
}: BrandIconRendererProps) {
  const chosenIcon = iconName || getDefaultBrandIcon({ name: brandName, industry });

  if (chosenIcon === "Mango") {
    return <MangoIcon className={className} />;
  }

  const match = ICON_MAP[chosenIcon];
  if (match) {
    const IconComponent = match.icon;
    return <IconComponent className={`${className} ${match.color} shrink-0`} />;
  }

  // Fallback
  return <Globe className={`${className} text-[#00d9ff] drop-shadow-[0_0_8px_#00d9ff] shrink-0`} />;
}

