"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Wrench,
  Terminal as TerminalIcon,
  Database,
  Cpu,
} from "lucide-react";
import { skillCategoriesData } from "@/data/portfolioData";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";

export interface SkillItem {
  name: string;
  level: number;
  icon?: string;
  highlight?: boolean;
}

// =========================================================================
// HIGH-FIDELITY VECTOR BRAND LOGOS FOR ALL SKILLS & TOOLS
// =========================================================================
export function TechBrandLogo({ name, className = "w-12 h-12" }: { name: string; className?: string }) {
  const n = name.toLowerCase().trim();

  // 1. React (Cyan Atom)
  if (n.includes("react") && !n.includes("tailwind")) {
    return (
      <svg className={className} viewBox="-11.5 -10.23174 23 20.46348">
        <circle cx="0" cy="0" r="2.05" fill="#00d2ff" className="drop-shadow-[0_0_8px_#00d2ff]" />
        <g stroke="#00d2ff" strokeWidth="1" fill="none" className="drop-shadow-[0_0_6px_#00d2ff]">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // 2. HTML (Orange Shield)
  if (n === "html" || n.includes("html5")) {
    return (
      <svg className={className} viewBox="0 0 512 512">
        <path fill="#E44D26" d="M107.6 441.6L67.1 0h377.8l-40.5 441.5L256 484.2z" />
        <path fill="#F16529" d="M256 446.4l117-32.4 34.6-377h-151.6z" />
        <path fill="#EBEBEB" d="M256 193.6h-60.6l-4.2-46.7H256V99H135.2l12.4 140.2H256zm0 144.1l-51.5-13.9-3.3-36.9h-47.3l6.5 72.8 95.6 26.5z" />
        <path fill="#FFFFFF" d="M256 99v47.9h62.5l-5.9 66.2H256v47.9h58.3l-8.5 94.6-49.8 13.5v49.8l95.7-26.5 13.2-147.4 3.7-41.9.9-10.2.9-10.2H256z" />
      </svg>
    );
  }

  // 3. CSS (Blue Shield)
  if (n === "css" || n.includes("css3")) {
    return (
      <svg className={className} viewBox="0 0 512 512">
        <path fill="#264DE4" d="M107.6 441.6L67.1 0h377.8l-40.5 441.5L256 484.2z" />
        <path fill="#2965F1" d="M256 446.4l117-32.4 34.6-377h-151.6z" />
        <path fill="#EBEBEB" d="M256 193.6h-60.6l-4.2-46.7H256V99H135.2l12.4 140.2H256zm0 144.1l-51.5-13.9-3.3-36.9h-47.3l6.5 72.8 95.6 26.5z" />
        <path fill="#FFFFFF" d="M256 99v47.9h112.7l-4.3 46.7H256v47.9h54.1l-5.8 65.5-48.3 13.1v49.8l95.8-26.6 13.4-149.7 3.5-39.7.9-10.2H256z" />
      </svg>
    );
  }

  // 4. JavaScript (Yellow Square JS)
  if (n.includes("javascript") || n === "js") {
    return (
      <svg className={className} viewBox="0 0 630 630">
        <rect width="630" height="630" rx="100" fill="#F7DF1E" />
        <path d="m165.65 526.4c10.87 6.4 24.6 11.2 41.5 11.2 35.8 0 58.7-18.2 58.7-55.7v-224.7h-52.9v221.7c0 19.8-10.3 27.6-26.8 27.6-11.2 0-19.4-4.2-24.6-8.3zm195.9-4.8c18.5 10.3 43 17.5 70.4 17.5 60.8 0 94.6-30.8 94.6-77.9 0-41.9-25.2-64.2-70.6-83.3-30.4-13-43.9-22.3-43.9-37.4 0-13.6 11.7-24 33-24 18.2 0 34.6 6 45.4 12.3l12.9-42.3c-11.9-6.4-31-12.3-56.7-12.3-54.7 0-90.4 31.8-90.4 75.8 0 38.6 24.6 62.3 69.2 81.3 32.1 14.1 45.4 24.1 45.4 40.5 0 16.4-14.7 27.1-39.2 27.1-23.7 0-43.7-8.3-57.2-16.7z" fill="#000000" />
      </svg>
    );
  }

  // 5. PHP (Classic Indigo/Cyan Oval)
  if (n === "php") {
    return (
      <svg className={className} viewBox="0 0 256 150">
        <ellipse cx="128" cy="75" rx="120" ry="70" fill="#777BB4" />
        <path d="M68 45H35L20 115h20l4.5-22h14c18 0 28-9 31-25 3-16-5-23-21.5-23zm-8 30h-9l4.5-17h9c6.5 0 10 2.5 8.5 9-1.5 6-5.5 8-12.5 8zm84-30h-33l-15 70h20l4.5-22h14c18 0 28-9 31-25 3-16-5-23-21.5-23zm-8 30h-9l4.5-17h9c6.5 0 10 2.5 8.5 9-1.5 6-5.5 8-12.5 8zm84-30h-33l-15 70h20l4.5-22h14c18 0 28-9 31-25 3-16-5-23-21.5-23zm-8 30h-9l4.5-17h9c6.5 0 10 2.5 8.5 9-1.5 6-5.5 8-12.5 8z" fill="#FFFFFF" />
      </svg>
    );
  }

  // 6. Laravel (Official Red Box)
  if (n.includes("laravel")) {
    return (
      <svg className={`${className} drop-shadow-[0_0_10px_rgba(255,45,32,0.6)]`} viewBox="0 0 24 24" fill="#FF2D20">
        <path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.027c-.008.002-.016.008-.024.01a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 01.023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.037-.027.014-.012.027-.024.041-.034H.53L5.043.05a.375.375 0 01.375 0L9.93 2.647h.002c.015.01.027.021.04.033l.038.027c.013.014.02.03.033.045.008.011.02.021.025.033.01.02.017.038.024.058.003.011.01.021.013.032.01.031.014.064.014.098v9.652l3.76-2.164V5.527c0-.033.004-.066.013-.098.003-.01.01-.02.013-.032a.487.487 0 01.024-.059c.007-.012.018-.02.025-.033.012-.015.021-.03.033-.043.012-.012.025-.02.037-.028.014-.01.026-.023.041-.032h.001l4.513-2.598a.375.375 0 01.375 0l4.513 2.598c.016.01.027.021.042.031.012.01.025.018.036.028.013.014.022.03.034.044.008.012.019.021.024.033.011.02.018.04.024.06.006.01.012.021.015.032zm-.74 5.032V6.179l-1.578.908-2.182 1.256v4.283zm-4.51 7.75v-4.287l-2.147 1.225-6.126 3.498v4.325zM1.093 3.624v14.588l8.273 4.761v-4.325l-4.322-2.445-.002-.003H5.04c-.014-.01-.025-.021-.04-.031-.011-.01-.024-.018-.035-.027l-.001-.002c-.013-.012-.021-.025-.031-.04-.01-.011-.021-.022-.028-.036h-.002c-.008-.014-.013-.031-.02-.047-.006-.016-.014-.027-.018-.043a.49.49 0 01-.008-.057c-.002-.014-.006-.027-.006-.041V5.789l-2.18-1.257zM5.23.81L1.47 2.974l3.76 2.164 3.758-2.164zm1.956 13.505l2.182-1.256V3.624l-1.58.91-2.182 1.255v9.435zm11.581-10.95l-3.76 2.163 3.76 2.163 3.759-2.164zm-.376 4.978L16.21 7.087 14.63 6.18v4.283l2.182 1.256 1.58.908zm-8.65 9.654l5.514-3.148 2.756-1.572-3.757-2.163-4.323 2.489-3.941 2.27z" />
      </svg>
    );
  }

  // 7. Next.js (Black/Cyan 'N')
  if (n.includes("next")) {
    return (
      <svg className={className} viewBox="0 0 180 180" fill="none">
        <circle cx="90" cy="90" r="85" fill="#050811" stroke="#00d2ff" strokeWidth="6" />
        <path d="M128 135V45H110L62 120V45H44V135H62L110 60V135H128Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // 8. Tailwind CSS (Dual Waves)
  if (n.includes("tailwind")) {
    return (
      <svg className={`${className} drop-shadow-[0_0_8px_#38bdf8]`} viewBox="0 0 24 24" fill="#38BDF8">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
      </svg>
    );
  }

  // 9. MySQL (Dolphin & Database)
  if (n.includes("mysql") && !n.includes("workbench")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M21.5 12c0 4.14-4.25 7.5-9.5 7.5S2.5 16.14 2.5 12 6.75 4.5 12 4.5s9.5 3.36 9.5 7.5z" stroke="#00758F" strokeWidth="2" fill="#005A6F" fillOpacity="0.3" />
        <path d="M12 9c-3 0-5.5 1.5-5.5 3s2.5 3 5.5 3 5.5-1.5 5.5-3-2.5-3-5.5-3z" fill="#F29111" />
        <path d="M16 11c1.5-1.5 3-1 4 0" stroke="#00f0ff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 10. SQL / Database Management
  if (n.includes("sql") || n.includes("database")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="1.8">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        <line x1="12" y1="8" x2="12" y2="12" stroke="#a855f7" />
        <line x1="12" y1="15" x2="12" y2="19" stroke="#a855f7" />
      </svg>
    );
  }

  // 11. Python (Yellow & Blue Snakes)
  if (n.includes("python")) {
    return (
      <svg className={className} viewBox="0 0 110 110">
        <path d="M54.2 2c-24.3 0-22.8 10.5-22.8 10.5l.1 10.9h23.2v3.3H22.4S2 24.3 2 48.7s17.8 23.7 17.8 23.7h10.6v-14.8s-.6-17.8 17.5-17.8h17.1V22.5S66.5 2 54.2 2zm-12.7 7.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6z" fill="#387EB8" />
        <path d="M55.8 108c24.3 0 22.8-10.5 22.8-10.5l-.1-10.9H55.3v-3.3h32.3s20.4 2.4 20.4-22-17.8-23.7-17.8-23.7H79.6v14.8s.6 17.8-17.5 17.8H45V87.5S43.5 108 55.8 108zm12.7-7.2a3.8 3.8 0 1 1 0-7.6 3.8 3.8 0 0 1 0 7.6z" fill="#FFE052" />
      </svg>
    );
  }

  // 12. C Programming (Blue Hexagon with C)
  if (n.includes("c programming") || n === "c") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" stroke="#00d2ff" strokeWidth="2" fill="#0055ff" fillOpacity="0.25" />
        <path d="M15.5 8.5C14.5 7.5 13.2 7 12 7c-2.8 0-5 2.2-5 5s2.2 5 5 5c1.2 0 2.5-.5 3.5-1.5" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }

  // 13. Java (Coffee Cup with Steams)
  if (n.includes("java") && !n.includes("script")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M4 14c0 3 3 5 8 5s8-2 8-5H4z" fill="#5382A1" />
        <path d="M18 14h2a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2h-2" stroke="#5382A1" strokeWidth="1.8" />
        <path d="M3 20h16" stroke="#E76F00" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 3c-1 2 1 3 0 5" stroke="#E76F00" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M13 2c-1 2 1 3 0 6" stroke="#E76F00" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 4c-.8 1.5.8 2.5 0 4" stroke="#E76F00" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 14. R Programming
  if (n.includes("r programming") || n === "r") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="12" rx="10" ry="8" stroke="#276DC3" strokeWidth="2" fill="#165BAA" fillOpacity="0.2" />
        <path d="M8 8h4.5a2.5 2.5 0 0 1 0 5H8V8zm4.5 5L16 17" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  // 15. Git (Orange Diamond Branch)
  if (n === "git") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" transform="rotate(45 12 12)" fill="#F05032" />
        <circle cx="8" cy="12" r="1.8" fill="#FFFFFF" />
        <circle cx="16" cy="12" r="1.8" fill="#FFFFFF" />
        <path d="M8 12h8" stroke="#FFFFFF" strokeWidth="1.5" />
      </svg>
    );
  }

  // -------------------------------------------------------------------------
  // TOOLS & TECHNOLOGIES LOGOS
  // -------------------------------------------------------------------------

  // VS Code (Blue Ribbon Bowtie)
  if (n.includes("vs code") || n.includes("vscode")) {
    return (
      <svg className={`${className} drop-shadow-[0_0_8px_#007acc]`} viewBox="0 0 24 24" fill="#007ACC">
        <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.26a.999.999 0 0 0-.004 1.415L4.54 12 .323 15.326a.999.999 0 0 0 .004 1.415l1.322 1.202c.373.34 1 .36 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zM18 16.5l-6-4.5 6-4.5v9z" fill="#007ACC" />
      </svg>
    );
  }

  // Git & GitHub
  if (n.includes("github")) {
    return (
      <svg className={`${className} drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]`} viewBox="0 0 24 24" fill="#FFFFFF">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }

  // WordPress & Elementor
  if (n.includes("wordpress") || n.includes("elementor")) {
    return (
      <svg className={`${className} drop-shadow-[0_0_8px_#21759b]`} viewBox="0 0 24 24" fill="#21759B">
        <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0" />
      </svg>
    );
  }

  // Figma (5 Multi-color blocks)
  if (n.includes("figma")) {
    return (
      <svg className={className} viewBox="0 0 38 57" fill="none">
        <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
        <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
        <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
        <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
        <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
      </svg>
    );
  }

  // Postman (Orange Astronaut Rocket)
  if (n.includes("postman")) {
    return (
      <svg className={`${className} drop-shadow-[0_0_8px_#ff6c37]`} viewBox="0 0 24 24" fill="#FF6C37">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#FF6C37" />
        <circle cx="12" cy="12" r="9" stroke="#FF6C37" strokeWidth="2" fill="none" />
        <path d="M8 12l3 3 5-5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Power BI (Yellow Bar Chart)
  if (n.includes("power bi") || n.includes("powerbi")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="12" width="4" height="9" rx="1" fill="#F2C811" />
        <rect x="10" y="8" width="4" height="13" rx="1" fill="#E6AD10" />
        <rect x="17" y="4" width="4" height="17" rx="1" fill="#D99B0C" />
      </svg>
    );
  }

  // MySQL Workbench
  if (n.includes("workbench")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#00758F" strokeWidth="1.8">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="#00758F" fillOpacity="0.3" />
      </svg>
    );
  }

  // XAMPP (Orange Bone shape)
  if (n.includes("xampp")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#FB7A24">
        <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.3L18 8v8l-6 3.7L6 16V8l6-3.7z" />
        <path d="M9 9l6 6m0-6l-6 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Canva (Gradient C)
  if (n.includes("canva")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="canva-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00c4cc" />
            <stop offset="100%" stopColor="#7d2ae8" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#canva-grad)" />
        <path d="M15.5 8.5C14.2 7.5 12.5 7.2 11 8c-2.4 1.3-3.2 4.4-1.8 6.7 1.2 2 3.8 2.5 5.5 1.2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  // Chrome DevTools
  if (n.includes("chrome") || n.includes("devtools")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#4285F4" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="#4285F4" />
        <line x1="12" y1="3" x2="12" y2="8" stroke="#EA4335" strokeWidth="2" />
        <line x1="4.2" y1="16.5" x2="8.5" y2="14" stroke="#FBBC05" strokeWidth="2" />
        <line x1="19.8" y1="16.5" x2="15.5" y2="14" stroke="#34A853" strokeWidth="2" />
      </svg>
    );
  }

  // Terminal & CLI
  if (n.includes("terminal") || n.includes("cli")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    );
  }

  // Fallback
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="2">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

// =========================================================================
// 3D ISOMETRIC PEDESTAL (GLOWING PLINTH BENEATH CENTER CARD)
// =========================================================================
function IsometricPedestal({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 260 90"
        className="w-[180px] xs:w-[210px] sm:w-[260px] md:w-[280px] h-[60px] xs:h-[72px] sm:h-[88px] md:h-[95px] overflow-visible"
      >
        <defs>
          <linearGradient id="pedestal-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b1733" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#121b38" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#1e0f35" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="pedestal-left-face" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#061a38" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#030c1c" stopOpacity="0.98" />
          </linearGradient>
          <linearGradient id="pedestal-right-face" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#250d40" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#10041d" stopOpacity="0.98" />
          </linearGradient>
          <linearGradient id="pedestal-rim-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="45%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <filter id="plinth-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        {/* Floor Neon Glow Pool */}
        <ellipse
          cx="130"
          cy="58"
          rx="105"
          ry="28"
          fill="url(#pedestal-rim-glow)"
          opacity="0.45"
          filter="url(#plinth-blur)"
        />

        {/* 3D Left Thickness Face */}
        <polygon
          points="130,48 16,26 16,40 130,62"
          fill="url(#pedestal-left-face)"
          stroke="#00d2ff"
          strokeWidth="1.2"
          strokeOpacity="0.85"
        />

        {/* 3D Right Thickness Face */}
        <polygon
          points="130,48 244,26 244,40 130,62"
          fill="url(#pedestal-right-face)"
          stroke="#c084fc"
          strokeWidth="1.2"
          strokeOpacity="0.85"
        />

        {/* Top Isometric Diamond / Rhombus Face */}
        <polygon
          points="130,4 244,26 130,48 16,26"
          fill="url(#pedestal-top)"
          stroke="url(#pedestal-rim-glow)"
          strokeWidth="2.5"
          className="drop-shadow-[0_0_15px_rgba(0,210,255,0.9)]"
        />

        {/* Inner Isometric Accent Line */}
        <polygon
          points="130,10 230,26 130,42 30,26"
          fill="none"
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}

// =========================================================================
// 3D VERTICAL HEXAGONAL CARD (MATCHING REFERENCE DESIGN CONCEPT 13)
// =========================================================================
function HexagonSkillCard({
  skill,
  isCenter = false,
  onClick,
  className = "",
}: {
  skill: SkillItem;
  isCenter?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: isCenter ? 1.02 : 1.05 }}
      transition={{ duration: 0.25 }}
      className={`relative select-none ${
        isCenter
          ? "w-[160px] xs:w-[185px] sm:w-[210px] h-[195px] xs:h-[225px] sm:h-[255px]"
          : "w-[110px] xs:w-[130px] sm:w-[160px] h-[135px] xs:h-[160px] sm:h-[195px]"
      } ${onClick ? "cursor-pointer" : "cursor-default"} ${className}`}
    >
      {/* Hexagon SVG Frame with Dual Neon Glow Gradients */}
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full overflow-visible"
        style={{
          filter: isCenter
            ? "drop-shadow(0 0 25px rgba(0, 210, 255, 0.65)) drop-shadow(0 15px 35px rgba(168, 85, 247, 0.5))"
            : "drop-shadow(0 0 14px rgba(0, 210, 255, 0.35))",
        }}
      >
        <defs>
          <linearGradient
            id={`hex-fill-${skill.name.replace(/[^a-zA-Z0-9]/g, "_")}`}
            x1="20%"
            y1="0%"
            x2="80%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#081024" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#0d1836" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#170d2b" stopOpacity="0.95" />
          </linearGradient>

          {/* Cyan to Purple Dual Neon Border */}
          <linearGradient
            id={`hex-stroke-${skill.name.replace(/[^a-zA-Z0-9]/g, "_")}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="35%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>

          {/* Subtle Top-Down Diagonal Glass Light Reflection */}
          <linearGradient
            id={`hex-refl-${skill.name.replace(/[^a-zA-Z0-9]/g, "_")}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="60%"
          >
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.28)" />
            <stop offset="40%" stopColor="rgba(255, 255, 255, 0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Vertical Point-Topped Hexagon with Rounded Vertices */}
        <path
          d="M 46 6.5 Q 50 4 54 6.5 L 90 27 Q 94 29.5 94 34 L 94 86 Q 94 90.5 90 93 L 54 113.5 Q 50 116 46 113.5 L 10 93 Q 6 90.5 6 86 L 6 34 Q 6 29.5 10 27 Z"
          fill={`url(#hex-fill-${skill.name.replace(/[^a-zA-Z0-9]/g, "_")})`}
          stroke={`url(#hex-stroke-${skill.name.replace(/[^a-zA-Z0-9]/g, "_")})`}
          strokeWidth={isCenter ? "2.6" : "1.8"}
        />

        {/* Diagonal Light Streak Reflection */}
        <path
          d="M 46 6.5 Q 50 4 54 6.5 L 90 27 Q 94 29.5 94 34 L 94 65 Q 60 45 6 75 L 6 34 Q 6 29.5 10 27 Z"
          fill={`url(#hex-refl-${skill.name.replace(/[^a-zA-Z0-9]/g, "_")})`}
          pointerEvents="none"
        />
      </svg>

      {/* Hexagon Content Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2.5 sm:p-3 text-center">
        {/* Brand Icon */}
        <div
          className={`flex items-center justify-center ${
            isCenter ? "w-11 h-11 xs:w-13 xs:h-13 sm:w-16 sm:h-16 mb-1 sm:mb-2.5" : "w-7 h-7 xs:w-9 xs:h-9 sm:w-11 sm:h-11 mb-1"
          }`}
        >
          <TechBrandLogo
            name={skill.name}
            className={isCenter ? "w-9 h-9 xs:w-11 xs:h-11 sm:w-14 sm:h-14" : "w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9"}
          />
        </div>

        {/* Skill Name */}
        <h4
          className={`font-black text-white tracking-tight leading-tight line-clamp-1 ${
            isCenter ? "text-xs xs:text-sm sm:text-lg" : "text-[10px] xs:text-xs sm:text-sm text-slate-200"
          }`}
        >
          {skill.name}
        </h4>

        {/* Percentage */}
        <span
          className={`font-black tracking-wider drop-shadow-[0_0_8px_#00d2ff] ${
            isCenter
              ? "text-xs xs:text-sm sm:text-lg text-[#00f0ff] mt-0.5"
              : "text-[10px] xs:text-xs sm:text-sm text-[#38bdf8] mt-0.5"
          }`}
        >
          {skill.level}%
        </span>
      </div>
    </motion.div>
  );
}

// =========================================================================
// CONCENTRIC ORBITAL LINES & GLOWING NODES (CENTERED ON 3D SHOWCASE)
// =========================================================================
function OrbitalBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
      {/* Central Cyan & Ocean-Blue Ambient Pool Concentrated on Technology Platform */}
      <div className="w-[420px] sm:w-[500px] md:w-[580px] h-[180px] sm:h-[210px] md:h-[240px] bg-gradient-to-r from-[#00d2ff]/20 via-[#0088ff]/16 to-[#023e8a]/18 rounded-full blur-[60px]" />

      {/* Inner Orbit Ellipse */}
      <div className="absolute w-[320px] sm:w-[400px] md:w-[480px] h-[170px] sm:h-[210px] md:h-[240px] rounded-[50%] border border-[#00d2ff]/25 shadow-[0_0_12px_rgba(0,210,255,0.15)]">
        {/* Glowing Node 1 */}
        <div className="absolute top-[8%] left-[25%] w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff] animate-pulse" />
        {/* Glowing Node 2 */}
        <div className="absolute bottom-[10%] right-[22%] w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8] animate-pulse" />
      </div>

      {/* Middle Orbit Ellipse */}
      <div className="absolute w-[480px] sm:w-[600px] md:w-[700px] h-[230px] sm:h-[275px] md:h-[310px] rounded-[50%] border border-[#0088ff]/20 shadow-[0_0_15px_rgba(0,136,255,0.12)]">
        {/* Glowing Node 3 */}
        <div className="absolute top-[28%] right-[6%] w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_12px_#38bdf8]" />
        {/* Glowing Node 4 */}
        <div className="absolute bottom-[22%] left-[8%] w-2.5 h-2.5 rounded-full bg-[#00d2ff] shadow-[0_0_12px_#00d2ff]" />
      </div>

      {/* Outer Orbit Ellipse (Concentrated around 3-card cluster, clear of heading area) */}
      <div className="absolute w-[640px] sm:w-[780px] md:w-[880px] h-[280px] sm:h-[330px] md:h-[365px] rounded-[50%] border border-[#00d2ff]/14 shadow-[0_0_15px_rgba(0,210,255,0.08)]">
        {/* Glowing Node 5 */}
        <div className="absolute top-[16%] left-[18%] w-2 h-2 rounded-full bg-[#00d2ff] shadow-[0_0_10px_#00d2ff]" />
        {/* Glowing Node 6 */}
        <div className="absolute bottom-[14%] right-[20%] w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
      </div>
    </div>
  );
}

// =========================================================================
// REUSABLE 3D ORBITAL TECHNOLOGY SHOWCASE (2s AUTOMATIC SLIDING)
// =========================================================================
function OrbitalShowcaseSection({
  badge,
  badgeIcon: BadgeIcon,
  title,
  highlightWord,
  subtitle,
  items,
  sectionId,
  className = "py-6 sm:py-8 md:py-10",
}: {
  badge: string;
  badgeIcon: any;
  title: string;
  highlightWord?: string;
  subtitle: string;
  items: SkillItem[];
  sectionId: string;
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [timerKey, setTimerKey] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const count = items.length;

  // Active triplet (left, center, right)
  const leftIdx = (activeIndex - 1 + count) % count;
  const centerIdx = activeIndex;
  const rightIdx = (activeIndex + 1) % count;

  const leftItem = items[leftIdx];
  const centerItem = items[centerIdx];
  const rightItem = items[rightIdx];

  const resetTimer = useCallback(() => {
    setTimerKey((k) => k + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
    resetTimer();
  }, [count, resetTimer]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % count);
    resetTimer();
  }, [count, resetTimer]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Check tab visibility so background tabs pause interval
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const carouselRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(carouselRef, { margin: "100px 0px" });

  // Automatic 2-second interval slider (2000ms) — pauses when scrolled out of view
  useEffect(() => {
    if (!isInView || isHovered || !isTabVisible || count <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, 2000);

    return () => clearInterval(timer);
  }, [isInView, isHovered, isTabVisible, count, timerKey]);

  return (
    <div
      ref={carouselRef}
      id={sectionId}
      className={`relative w-full select-none overflow-hidden ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">

        {/* Section Header (Completely clean, unobstructed heading area) */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-6 md:mb-7 relative z-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 rounded-full bg-[#0a1124]/90 backdrop-blur-md border border-[#00d2ff]/40 shadow-[0_0_15px_rgba(0,210,255,0.25)] mb-3">
            <BadgeIcon className="w-3.5 h-3.5 text-[#00d2ff] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#00d2ff] uppercase">
              {badge}
            </span>
          </div>

          {/* Title with subtle highlight hierarchy */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            {highlightWord && title.includes(highlightWord) ? (
              <>
                <span>{title.replace(highlightWord, "").trim()}{" "}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#00d2ff] drop-shadow-[0_0_20px_rgba(0,210,255,0.45)]">
                  {highlightWord}
                </span>
              </>
            ) : (
              title
            )}
          </h2>

          {/* Subtitle */}
          <p className="text-slate-200 text-xs sm:text-sm md:text-[14px] mt-1.5 font-normal tracking-wide">
            {subtitle}
          </p>
        </div>

        {/* 3D Central Stage with Concentric Orbital Rings & Surrounding Cards */}
        <div
          className="relative w-full max-w-3xl min-h-[290px] xs:min-h-[330px] sm:min-h-[380px] md:min-h-[410px] flex items-center justify-center my-2 sm:my-3 overflow-hidden sm:overflow-visible"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Concentric Orbital Rings & Ambient Glow concentrated on Central Card */}
          <OrbitalBackground />

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous skill"
            className="absolute left-0.5 sm:left-4 z-40 w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full bg-[#0a1226]/85 hover:bg-[#152347] border border-[#00d2ff]/30 hover:border-[#00d2ff] text-slate-200 hover:text-white flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(0,210,255,0.2)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next skill"
            className="absolute right-0.5 sm:right-4 z-40 w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full bg-[#0a1226]/85 hover:bg-[#152347] border border-[#00d2ff]/30 hover:border-[#00d2ff] text-slate-200 hover:text-white flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(0,210,255,0.2)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </button>

          {/* 3-Card Isometric Composition */}
          <div className="relative flex items-center justify-center w-full">

            {/* A. LEFT RECESSED HEXAGON CARD */}
            <motion.div
              key={`left-${leftItem.name}`}
              initial={{ opacity: 0.5, scale: 0.82 }}
              animate={{ opacity: 0.88, scale: 0.9 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative z-10 shrink-0 translate-x-6 xs:translate-x-10 sm:translate-x-16 md:translate-x-20 -translate-y-2 cursor-pointer hover:opacity-100 transition-opacity"
            >
              <HexagonSkillCard
                skill={leftItem}
                isCenter={false}
                onClick={handlePrev}
              />
            </motion.div>

            {/* B. CENTER PROMINENT 3D HEXAGON CARD ON GLOWING PEDESTAL */}
            <div className="relative z-20 shrink-0 flex flex-col items-center">
              <motion.div
                key={`center-${centerItem.name}`}
                initial={{ scale: 0.92, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.38, ease: "easeOut" }}
                className="relative z-20 -translate-y-3 sm:-translate-y-4"
              >
                <HexagonSkillCard
                  skill={centerItem}
                  isCenter={true}
                />
              </motion.div>

              {/* Glowing Isometric Pedestal beneath center card */}
              <div className="-mt-10 xs:-mt-12 sm:-mt-16 z-10">
                <IsometricPedestal />
              </div>
            </div>

            {/* C. RIGHT RECESSED HEXAGON CARD */}
            <motion.div
              key={`right-${rightItem.name}`}
              initial={{ opacity: 0.5, scale: 0.82 }}
              animate={{ opacity: 0.88, scale: 0.9 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative z-10 shrink-0 -translate-x-6 xs:-translate-x-10 sm:-translate-x-16 md:-translate-x-20 -translate-y-2 cursor-pointer hover:opacity-100 transition-opacity"
            >
              <HexagonSkillCard
                skill={rightItem}
                isCenter={false}
                onClick={handleNext}
              />
            </motion.div>

          </div>
        </div>

        {/* Small Progress Dots Pagination */}
        <div className="flex items-center justify-center gap-1.5 mt-3 sm:mt-4">
          {items.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  setActiveIndex(idx);
                  resetTimer();
                }}
                aria-label={`Jump to ${item.name}`}
                className={`transition-all duration-300 rounded-full h-1.5 cursor-pointer ${
                  isActive
                    ? "w-6 bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#c084fc] shadow-[0_0_10px_#00d2ff]"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}

// =========================================================================
// MAIN SKILLS SECTION EXPORT (PART 1: TECH SKILLS + PART 2: TOOLS & TECHNOLOGIES)
// =========================================================================
export default function SkillsSection() {
  const { cmsData } = useCms();
  const { language, t, tCms } = useLanguage();
  const rawCategories = cmsData.skills?.length ? cmsData.skills : skillCategoriesData;

  // Find Tech Skills Category (Coding & Programming Languages)
  const techCategory =
    rawCategories.find((c) =>
      c.category.toLowerCase().includes("coding") ||
      c.category.toLowerCase().includes("programming") ||
      c.category.toLowerCase().includes("tech")
    ) || rawCategories[0];

  // Find Tools & Technologies Category
  const toolsCategory =
    rawCategories.find((c) =>
      c.category.toLowerCase().includes("tool") ||
      c.category.toLowerCase().includes("technolog") ||
      c.category.toLowerCase().includes("platform")
    ) || rawCategories[1] || rawCategories[0];

  const techSkills: SkillItem[] = techCategory?.skills?.length
    ? techCategory.skills
    : [
        { name: "HTML", level: 95 },
        { name: "CSS", level: 92 },
        { name: "JavaScript", level: 85 },
        { name: "PHP", level: 88 },
        { name: "Laravel", level: 85 },
        { name: "React", level: 84 },
        { name: "Next.js", level: 80 },
        { name: "Tailwind CSS", level: 90 },
        { name: "MySQL", level: 92 },
        { name: "SQL / Database Management", level: 88 },
        { name: "Python", level: 82 },
        { name: "C Programming", level: 80 },
        { name: "Java", level: 78 },
        { name: "R Programming", level: 75 },
        { name: "Git", level: 88 },
      ];

  const toolsSkills: SkillItem[] = toolsCategory?.skills?.length
    ? toolsCategory.skills
    : [
        { name: "VS Code", level: 95 },
        { name: "Git & GitHub", level: 88 },
        { name: "WordPress & Elementor", level: 95 },
        { name: "Figma", level: 82 },
        { name: "Postman", level: 80 },
        { name: "Tailwind CSS & React", level: 85 },
        { name: "Power BI", level: 78 },
        { name: "MySQL Workbench", level: 86 },
        { name: "XAMPP", level: 90 },
        { name: "Canva", level: 85 },
        { name: "Chrome DevTools", level: 88 },
        { name: "Terminal & CLI", level: 84 },
      ];

  const skillsHeader = {
    badge: tCms(cmsData?.homeSkillsHeader?.badge, "skills.techStackBadge"),
    title: tCms(cmsData?.homeSkillsHeader?.title, "skills.techSkillsTitle"),
    highlightText: language === "bn" ? "প্রযুক্তিগত দক্ষতা" : cmsData?.homeSkillsHeader?.highlightText || "Tech Skills",
    description: tCms(cmsData?.homeSkillsHeader?.description, "skills.techSkillsDesc"),
  };

  const toolsHeader = {
    badge: tCms(cmsData?.homeToolsHeader?.badge, "skills.toolsBadge"),
    title: tCms(cmsData?.homeToolsHeader?.title, "skills.toolsTitle"),
    highlightText: language === "bn" ? "টেকনোলজিস" : cmsData?.homeToolsHeader?.highlightText || "Technologies",
    description: tCms(cmsData?.homeToolsHeader?.description, "skills.toolsDesc"),
  };

  return (
    <section
      id="skills"
      aria-label="Skills & Technologies"
      className="relative w-full bg-gradient-to-b from-[#040a20] via-[#061434] to-[#040a20] pt-1 sm:pt-1.5 md:pt-2 pb-3 sm:pb-4 md:pb-6 overflow-hidden"
    >
      {/* Contained Cinematic Ocean-Blue & Dark Cyan Ambient Background */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* 1. Deep Atmospheric Ocean-Blue Radial Depth Pool in Center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 65% at 50% 50%, rgba(6, 30, 68, 0.88) 0%, rgba(4, 16, 42, 0.96) 60%, rgba(3, 9, 24, 1) 100%)",
          }}
        />

        {/* 2. Soft Blue Core Glow Centered Around Technology Showcase */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] sm:w-[1100px] h-[550px] bg-gradient-to-r from-[#023e8a]/25 via-[#0077b6]/22 to-[#023e8a]/25 rounded-full blur-[150px]" />

        {/* 3. Rich Dark Cyan & Ocean-Blue Glow on Left Side */}
        <div className="absolute top-1/4 -left-32 w-[600px] sm:w-[750px] h-[750px] bg-gradient-to-r from-[#0077b6]/30 via-[#00d2ff]/18 to-transparent rounded-full blur-[140px]" />

        {/* 4. Deep Ocean-Blue Glow on Right Side (Pure Blue/Cyan, Zero Purple) */}
        <div className="absolute top-1/3 -right-32 w-[600px] sm:w-[750px] h-[750px] bg-gradient-to-l from-[#023e8a]/32 via-[#0096c7]/20 to-transparent rounded-full blur-[140px]" />

        {/* 5. Elegant Curved Cyan/Ocean-Blue Gradient Shape on Left Edge */}
        <svg
          viewBox="0 0 400 900"
          className="absolute left-0 top-0 h-full w-[220px] sm:w-[300px] md:w-[380px] opacity-35 sm:opacity-45 pointer-events-none mix-blend-screen overflow-visible"
        >
          <defs>
            <linearGradient id="skills-ocean-left-curve" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#0077b6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
            <filter id="skills-ocean-blur-left" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="38" />
            </filter>
          </defs>
          <path
            d="M -100 0 C 160 180, 230 450, -40 750 L -100 900 Z"
            fill="url(#skills-ocean-left-curve)"
            filter="url(#skills-ocean-blur-left)"
          />
        </svg>

        {/* 6. Elegant Curved Deep Ocean-Blue Gradient Shape on Right Edge */}
        <svg
          viewBox="0 0 400 900"
          className="absolute right-0 top-0 h-full w-[220px] sm:w-[300px] md:w-[380px] opacity-35 sm:opacity-45 pointer-events-none mix-blend-screen overflow-visible"
        >
          <defs>
            <linearGradient id="skills-ocean-right-curve" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#023e8a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
            <filter id="skills-ocean-blur-right" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="38" />
            </filter>
          </defs>
          <path
            d="M 500 0 C 240 250, 170 600, 440 900 L 500 900 Z"
            fill="url(#skills-ocean-right-curve)"
            filter="url(#skills-ocean-blur-right)"
          />
        </svg>

        {/* 7. Subtle Top and Bottom Edge Blending for Seamless Section Boundaries */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#050811] via-[#050811]/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050811] via-[#050811]/70 to-transparent" />
      </div>

      {/* ======================================================== */}
      {/* PART 1: MY TECH SKILLS — COMPACT TOP SPACING (~48px UP)  */}
      {/* ======================================================== */}
      <OrbitalShowcaseSection
        sectionId="tech-skills"
        badge={skillsHeader.badge || "MY TECH STACK"}
        badgeIcon={Sparkles}
        title={skillsHeader.title || "My Tech Skills"}
        highlightWord={skillsHeader.highlightText || "Tech Skills"}
        subtitle={skillsHeader.description || "A modern look at my technical skills and proficiency levels."}
        items={techSkills}
        className="pt-3 sm:pt-4 md:pt-5 pb-5 sm:pb-7 md:pb-8"
      />

      {/* Elegant Glowing Section Divider (Cyan to Ocean Blue) */}
      <div className="w-full max-w-4xl mx-auto my-3 sm:my-5 px-4 flex items-center justify-center gap-4">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#00d2ff]/35 to-transparent" />
        <div className="w-2.5 h-2.5 rotate-45 border border-[#00d2ff] bg-[#040a20] shadow-[0_0_8px_#00d2ff]" />
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#0088ff]/35 to-transparent" />
      </div>

      {/* ======================================================== */}
      {/* PART 2: TOOLS & TECHNOLOGIES — SAME 3D ORBITAL DESIGN    */}
      {/* ======================================================== */}
      <OrbitalShowcaseSection
        sectionId="tools-technologies"
        badge={toolsHeader.badge || "WORKFLOW & PLATFORMS"}
        badgeIcon={Wrench}
        title={toolsHeader.title || "Tools & Technologies"}
        highlightWord={toolsHeader.highlightText || "Technologies"}
        subtitle={toolsHeader.description || "The tools and platforms I use to design and develop digital solutions."}
        items={toolsSkills}
        className="pt-2 sm:pt-3 md:pt-4 pb-4 sm:pb-6"
      />
    </section>
  );
}
