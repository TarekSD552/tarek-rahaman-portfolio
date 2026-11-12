import React from "react";

export interface SocialIconProps {
  className?: string;
}

export function LinkedInIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function GitHubIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function FacebookIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function InstagramIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.19-.09-1.1-.54-1.27-.6-.17-.06-.3-.09-.43.1-.13.18-.49.6-.6.73-.11.12-.22.14-.4.05-.19-.09-.79-.29-1.51-.93-.56-.5-9.4-1.11-1.05-1.3-.11-.19-.01-.29.08-.38.08-.08.19-.22.28-.33.09-.11.13-.19.19-.31.06-.13.03-.24-.01-.33-.05-.09-.43-1.04-.59-1.42-.16-.38-.32-.33-.43-.33h-.37c-.13 0-.33.05-.5.24-.17.18-.66.65-.66 1.58s.68 1.83.77 1.96c.1.13 1.34 2.05 3.25 2.87.45.2.81.31 1.09.4.46.15.87.13 1.2.08.37-.06 1.1-.45 1.25-.88.16-.44.16-.81.11-.89-.04-.09-.17-.14-.35-.24" />
    </svg>
  );
}

export function TwitterXIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function YouTubeIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function TelegramIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

export function DiscordIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function DribbbleIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm9.849 10.993c-.332-.024-2.873-.186-5.748.744-.09-.204-.183-.41-.28-.616-.543-1.157-1.164-2.315-1.847-3.414 3.014-1.275 5.589-.523 7.875 3.286zm-1.884-5.32c-2.029-3.238-4.32-3.818-6.993-2.695.534.982 1.034 1.996 1.488 3.018 2.658-.87 4.793-.473 5.505-.323zm-9.33-3.486c-.961 1.782-1.83 3.676-2.574 5.626-2.737-.886-5.362-.644-6.071-.565 1.583-3.003 4.887-5.061 8.645-5.061zm-8.498 7.37c.72-.078 3.125-.28 5.766.577-.66 1.936-1.168 3.967-1.503 6.012-3.535-1.127-4.148-3.95-4.263-6.589zm3.84 8.788c.31-1.87.77-3.719 1.374-5.485 2.668 1.096 4.966 2.923 6.643 5.253-2.32 1.493-5.08 2.115-8.017.232zm10.158.62c-1.564-2.227-3.738-4.004-6.31-5.076.08-.227.158-.456.234-.686 2.973-.974 5.717-.79 6.068-.764-.17 2.62-1.748 5.093 0 6.526z" />
    </svg>
  );
}

export function BehanceIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.976 3-3.414 0-5.75-2.585-5.75-6s2.336-6 5.75-6c3.275 0 5.25 2.378 5.25 5.5v1.5h-8c.09 1.637 1.155 3 2.75 3 1.442 0 2.215-.758 2.548-1.5h2.428zm-4.976-5.5c-1.398 0-2.372-.942-2.5-2h5c-.09-1.077-1.033-2-2.5-2s-2.41 1.058-2.5 2h2.5zm-10.75-7.5h-8v16h7.5c2.618 0 4.5-1.42 4.5-4 0-1.637-.842-2.887-2.25-3.5 1.105-.625 1.75-1.763 1.75-3.25 0-2.37-1.79-4.25-4.5-4.25zm-5 3h4c1.103 0 2 .897 2 2s-.897 2-2 2h-4v-4zm0 7h4.5c1.103 0 2 .897 2 2s-.897 2-2 2h-4.5v-4z" />
    </svg>
  );
}

export function GlobeIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function MailIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function ShareIcon({ className = "w-4 h-4" }: SocialIconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

/**
 * Registry of known social icons with user-friendly metadata
 */
export const AVAILABLE_SOCIAL_PLATFORMS = [
  { id: "LinkedIn", label: "LinkedIn", icon: "LinkedIn", defaultDomain: "https://www.linkedin.com/in/" },
  { id: "GitHub", label: "GitHub", icon: "GitHub", defaultDomain: "https://github.com/" },
  { id: "Facebook", label: "Facebook", icon: "Facebook", defaultDomain: "https://www.facebook.com/" },
  { id: "Instagram", label: "Instagram", icon: "Instagram", defaultDomain: "https://www.instagram.com/" },
  { id: "WhatsApp", label: "WhatsApp", icon: "WhatsApp", defaultDomain: "https://wa.me/" },
  { id: "Twitter", label: "Twitter / X", icon: "Twitter", defaultDomain: "https://twitter.com/" },
  { id: "YouTube", label: "YouTube", icon: "YouTube", defaultDomain: "https://www.youtube.com/@" },
  { id: "Telegram", label: "Telegram", icon: "Telegram", defaultDomain: "https://t.me/" },
  { id: "Discord", label: "Discord", icon: "Discord", defaultDomain: "https://discord.gg/" },
  { id: "Dribbble", label: "Dribbble", icon: "Dribbble", defaultDomain: "https://dribbble.com/" },
  { id: "Behance", label: "Behance", icon: "Behance", defaultDomain: "https://www.behance.net/" },
  { id: "Website", label: "Website / Portfolio", icon: "Globe", defaultDomain: "https://" },
  { id: "Mail", label: "Email Contact", icon: "Mail", defaultDomain: "mailto:" },
] as const;

/**
 * Universal component that resolves any icon identifier to an exact SVG icon.
 */
export default function DynamicSocialIcon({
  iconName,
  platformName,
  className = "w-4 h-4",
}: {
  iconName?: string;
  platformName?: string;
  className?: string;
}) {
  const normalized = (iconName || platformName || "").toLowerCase().trim();

  if (normalized.includes("linkedin")) return <LinkedInIcon className={className} />;
  if (normalized.includes("github") || normalized.includes("git")) return <GitHubIcon className={className} />;
  if (normalized.includes("facebook") || normalized.includes("fb")) return <FacebookIcon className={className} />;
  if (normalized.includes("instagram") || normalized.includes("insta")) return <InstagramIcon className={className} />;
  if (normalized.includes("whatsapp") || normalized.includes("wa.me") || normalized === "messagecircle") return <WhatsAppIcon className={className} />;
  if (normalized.includes("twitter") || normalized === "x" || normalized.includes("tweet")) return <TwitterXIcon className={className} />;
  if (normalized.includes("youtube") || normalized.includes("yt")) return <YouTubeIcon className={className} />;
  if (normalized.includes("telegram") || normalized.includes("tg")) return <TelegramIcon className={className} />;
  if (normalized.includes("discord")) return <DiscordIcon className={className} />;
  if (normalized.includes("dribbble")) return <DribbbleIcon className={className} />;
  if (normalized.includes("behance")) return <BehanceIcon className={className} />;
  if (normalized.includes("mail") || normalized.includes("email")) return <MailIcon className={className} />;
  if (normalized.includes("globe") || normalized.includes("web") || normalized.includes("site") || normalized.includes("portfolio")) return <GlobeIcon className={className} />;

  return <ShareIcon className={className} />;
}

