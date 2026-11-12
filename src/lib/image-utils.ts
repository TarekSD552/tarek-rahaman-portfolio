/**
 * Normalize and sanitize image URLs across CMS, uploads, and assets
 */
export function normalizeImageUrl(url?: string | null, fallback = "/assets/profile-1-scaled.png"): string {
  if (!url || typeof url !== "string") {
    return fallback;
  }

  let clean = url.trim();

  // Fix /public/uploads/ or public/uploads/ -> /uploads/
  if (clean.startsWith("/public/")) {
    clean = clean.replace(/^\/public\//, "/");
  } else if (clean.startsWith("public/")) {
    clean = "/" + clean.replace(/^public\//, "");
  }

  // Ensure leading slash for root-relative paths
  if (
    !clean.startsWith("/") &&
    !clean.startsWith("http://") &&
    !clean.startsWith("https://") &&
    !clean.startsWith("data:")
  ) {
    clean = "/" + clean;
  }

  return clean;
}

