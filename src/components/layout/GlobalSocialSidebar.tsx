"use client";

import { usePathname } from "next/navigation";
import { profileData } from "@/data/portfolioData";
import { useCms } from "@/context/CmsContext";
import WebsiteMediaPlayer from "@/components/media/WebsiteMediaPlayer";
import DynamicSocialIcon from "@/components/icons/DynamicSocialIcon";
import { SocialLink } from "@/types/portfolio";

export default function GlobalSocialSidebar() {
  const pathname = usePathname();
  const { cmsData } = useCms();

  // Never render on Admin Dashboard or Admin Login pages
  if (!pathname || pathname.startsWith("/admin")) {
    return null;
  }

  // Retrieve dynamic social links from CMS, fallback to portfolioData default
  const rawLinks: SocialLink[] =
    cmsData?.profile?.socialLinks && cmsData.profile.socialLinks.length > 0
      ? cmsData.profile.socialLinks
      : (profileData.socialLinks || []);

  // Filter only active social links with non-empty URLs
  const activeSocialLinks = rawLinks
    .filter((item) => item.active !== false && item.url && item.url.trim().length > 0)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  return (
    <aside
      aria-label="Social Media Profiles & Music"
      className="fixed right-2.5 sm:right-4 md:right-5 lg:right-7 top-1/2 -translate-y-1/2 z-50 select-none pointer-events-auto transition-all duration-300"
    >
      {/* Pure minimal floating vertical column — NO background, NO border, NO surrounding box on any screen */}
      <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 bg-transparent border-0 shadow-none p-0">
        {/* Social Media Icons (Facebook, Instagram, LinkedIn, WhatsApp, GitHub) */}
        {activeSocialLinks.map((item, idx) => (
          <a
            key={`${item.name}-${idx}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Tarek Rahaman on ${item.name}`}
            title={item.name}
            className="group relative p-1 text-slate-300 [html.light_&]:text-slate-700 hover:text-white [html.light_&]:hover:text-[#0284c7] transition-all duration-300 hover:scale-125 active:scale-95 cursor-pointer bg-transparent border-0"
          >
            <span className="block transition-transform duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.95)] [html.light_&]:group-hover:drop-shadow-[0_0_8px_rgba(2,132,199,0.5)]">
              <DynamicSocialIcon
                iconName={item.icon}
                platformName={item.name}
                className="w-4 h-4 sm:w-4.5 sm:h-4.5"
              />
            </span>
          </a>
        ))}

        {/* Small Icon-Only Background Music Control — Directly below Social Media Icons with balanced compact gap */}
        <div className="flex items-center justify-center pt-0.5 sm:pt-1">
          <WebsiteMediaPlayer />
        </div>
      </div>
    </aside>
  );
}
