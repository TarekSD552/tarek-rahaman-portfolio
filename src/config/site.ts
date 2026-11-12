/**
 * Official Site Configuration & Production Domain Authority
 *
 * Single Source of Truth for production domain, canonical URLs, and branding.
 * Future domain or brand updates should be configured here.
 */
export const SITE_CONFIG = {
  name: "Tarek Rahaman",
  title: "Tarek Rahaman | Full-Stack Web Developer in Dhaka, Bangladesh",
  description:
    "Official portfolio of Tarek Rahaman — Creative Full-Stack Web Developer, WordPress & WooCommerce Specialist, and Software Engineering student based in Mirpur, Dhaka, Bangladesh.",

  // Official Production Domain — Single Canonical Authority (Non-WWW canonical)
  domain: "tarekrahaman.com",
  baseUrl: "https://tarekrahaman.com",

  // Author & Verified Entity
  author: {
    name: "Tarek Rahaman",
    alternateName: "Md Tarek Rahaman",
    role: "Full-Stack Web Developer & Software Engineer",
    email: "tarekrahaman186@gmail.com",
    phone: "+8801733119269",
    location: "Mirpur-1, Dhaka-1216, Bangladesh",
    institution: "Daffodil International University",
  },

  // Verified Social Channels
  social: {
    github: "https://github.com/TarekSD552",
    facebook: "https://www.facebook.com/tarak.rahoman.3",
    instagram: "https://www.instagram.com/tarek_rahman333",
    whatsapp: "https://wa.me/8801733119269",
  },

  // Default Open Graph Image
  defaultOgImage: "/assets/profile-1-scaled.png",
} as const;

/**
 * Generates an absolute canonical URL from a relative path.
 * Guarantees standard non-trailing slash behavior (e.g. https://tarekrahaman.com/about)
 * while root returns https://tarekrahaman.com without trailing slash.
 */
export function getAbsoluteUrl(path: string = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath === "/" || cleanPath === "") {
    return SITE_CONFIG.baseUrl;
  }
  // Trim trailing slash for consistent canonical indexing
  const trimmed = cleanPath.endsWith("/") ? cleanPath.slice(0, -1) : cleanPath;
  return `${SITE_CONFIG.baseUrl}${trimmed}`;
}

