"use client";

import { useEffect, useRef } from "react";
import { useCms } from "@/context/CmsContext";

/**
 * DynamicFavicon Component
 * Dynamically binds the browser tab favicon to cmsData.siteSettings.faviconUrl
 * Supports PNG, JPG, ICO, SVG, and WEBP with instantaneous cache-busting (?v=timestamp).
 */
export default function DynamicFavicon() {
  const { cmsData } = useCms();
  const rawFavicon =
    cmsData?.siteSettings?.faviconUrl ||
    (cmsData?.siteSettings as any)?.favicon ||
    "/favicon.ico";
  const lastFaviconRef = useRef<string>("");

  useEffect(() => {
    if (!rawFavicon || typeof document === "undefined") return;

    // Clean prior queries and generate cache-busting timestamp
    const cleanUrl = rawFavicon.split("?")[0].trim();
    if (!cleanUrl) return;

    // Cache buster to bypass aggressive browser favicon caching
    const timestamp = Date.now();
    const finalUrl = `${cleanUrl}?v=${timestamp}`;

    // Determine accurate MIME type
    let mimeType = "image/x-icon";
    const lower = cleanUrl.toLowerCase();
    if (lower.endsWith(".png")) mimeType = "image/png";
    else if (lower.endsWith(".svg")) mimeType = "image/svg+xml";
    else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) mimeType = "image/jpeg";
    else if (lower.endsWith(".webp")) mimeType = "image/webp";
    else if (lower.endsWith(".ico")) mimeType = "image/x-icon";

    // Update or create icon link elements
    const linkRels = [
      { rel: "icon", type: mimeType },
      { rel: "shortcut icon", type: mimeType },
      { rel: "apple-touch-icon", type: undefined },
    ];

    linkRels.forEach(({ rel, type }) => {
      const existingLinks = document.querySelectorAll<HTMLLinkElement>(`link[rel*='icon']`);
      let matched = false;

      existingLinks.forEach((link) => {
        if (link.getAttribute("rel") === rel) {
          link.href = finalUrl;
          if (type) link.type = type;
          matched = true;
        }
      });

      if (!matched) {
        const link = document.createElement("link");
        link.rel = rel;
        link.href = finalUrl;
        if (type) link.type = type;
        document.head.appendChild(link);
      }
    });

    lastFaviconRef.current = cleanUrl;
  }, [rawFavicon]);

  return null;
}

