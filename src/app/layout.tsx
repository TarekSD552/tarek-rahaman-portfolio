import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import ClientOverlays from "@/components/layout/ClientOverlays";
import GlobalSocialSidebar from "@/components/layout/GlobalSocialSidebar";
import DynamicFavicon from "@/components/layout/DynamicFavicon";
import WebsiteAnalyticsTracker from "@/components/analytics/WebsiteAnalyticsTracker";
import InitialPageLoader from "@/components/ui/InitialPageLoader";
import StructuredData from "@/components/seo/StructuredData";
import SmoothScrollProvider from "@/lib/lenis";
import { SITE_CONFIG } from "@/config/site";
import { CmsProvider } from "@/context/CmsContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { getCmsData } from "@/lib/cms-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const initialCmsData = await getCmsData();
  const site = initialCmsData?.siteSettings;
  const rawFavicon =
    site?.faviconUrl || (site as any)?.favicon || "/favicon.ico";
  const cleanUrl = rawFavicon.split("?")[0].trim();
  const timestamp = Date.now();
  const faviconWithVersion = `${cleanUrl}?v=${timestamp}`;

  let mimeType = "image/x-icon";
  const lower = cleanUrl.toLowerCase();
  if (lower.endsWith(".png")) mimeType = "image/png";
  else if (lower.endsWith(".svg")) mimeType = "image/svg+xml";
  else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) mimeType = "image/jpeg";
  else if (lower.endsWith(".webp")) mimeType = "image/webp";
  else if (lower.endsWith(".ico")) mimeType = "image/x-icon";

  const siteTitle =
    site?.defaultSeoTitle ||
    "Tarek Rahaman | Full-Stack Web Developer in Dhaka, Bangladesh";
  const siteDesc =
    site?.defaultSeoDesc ||
    "Official portfolio of Tarek Rahaman — Creative Full-Stack Web Developer, WordPress & WooCommerce Specialist, and Software Engineering student in Mirpur, Dhaka, Bangladesh.";

  return {
    metadataBase: new URL(SITE_CONFIG.baseUrl),
    alternates: {
      canonical: SITE_CONFIG.baseUrl,
    },
    title: {
      default: siteTitle,
      template: "%s | Tarek Rahaman",
    },
    description: siteDesc,
    icons: {
      icon: [
        {
          url: faviconWithVersion,
          type: mimeType,
        },
      ],
      shortcut: [faviconWithVersion],
      apple: [faviconWithVersion],
    },
    keywords: [
      "Tarek Rahaman",
      "Tarek Rahaman Web Developer",
      "Tarek Rahaman Portfolio",
      "Full-Stack Web Developer",
      "Professional Web Developer in Bangladesh",
      "Web Developer in Mirpur",
      "Web Developer Mirpur Dhaka",
      "Website Developer in Dhaka",
      "Freelance Web Developer Bangladesh",
      "Web Design Services in Bangladesh",
      "WordPress Specialist Bangladesh",
      "WooCommerce Expert Dhaka",
      "Laravel Developer Bangladesh",
      "Daffodil International University",
      "Speed Optimization",
      "E-Commerce Solutions",
    ],
    authors: [
      {
        name: "Tarek Rahaman",
        url: SITE_CONFIG.baseUrl,
      },
    ],
    creator: "Tarek Rahaman",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_CONFIG.baseUrl,
      title: siteTitle,
      description: siteDesc,
      siteName: site?.websiteName || "Tarek Rahaman Portfolio",
      images: [
        {
          url: "/assets/profile-1-scaled.png",
          width: 1200,
          height: 630,
          alt: "Tarek Rahaman - Full-Stack Web Developer in Dhaka, Bangladesh",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDesc,
      images: ["/assets/profile-1-scaled.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialCmsData = await getCmsData();
  const site = initialCmsData?.siteSettings;
  const rawFavicon =
    site?.faviconUrl || (site as any)?.favicon || "/favicon.ico";
  const cleanUrl = rawFavicon.split("?")[0].trim();
  const timestamp = Date.now();
  const faviconWithVersion = `${cleanUrl}?v=${timestamp}`;

  let mimeType = "image/x-icon";
  const lower = cleanUrl.toLowerCase();
  if (lower.endsWith(".png")) mimeType = "image/png";
  else if (lower.endsWith(".svg")) mimeType = "image/svg+xml";
  else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) mimeType = "image/jpeg";
  else if (lower.endsWith(".webp")) mimeType = "image/webp";
  else if (lower.endsWith(".ico")) mimeType = "image/x-icon";

  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href={faviconWithVersion} type={mimeType} />
        <link rel="shortcut icon" href={faviconWithVersion} />
        <link rel="apple-touch-icon" href={faviconWithVersion} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('tarek_portfolio_theme');
                  var theme = storedTheme === 'light' ? 'light' : 'dark';
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  root.classList.add(theme);
                  root.setAttribute('data-theme', theme);

                  var storedLang = localStorage.getItem('tarek_portfolio_lang');
                  var lang = storedLang === 'bn' ? 'bn' : 'en';
                  root.setAttribute('lang', lang);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${jakarta.variable} ${outfit.variable} antialiased bg-[#050811] text-slate-100 min-h-screen selection:bg-[#00d2ff] selection:text-[#050811]`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <CmsProvider initialData={initialCmsData}>
              <StructuredData type="person-and-business" />
              <InitialPageLoader />
              <WebsiteAnalyticsTracker />
              <DynamicFavicon />
              <ClientOverlays />
              <GlobalSocialSidebar />
              <SmoothScrollProvider>
                {children}
              </SmoothScrollProvider>
            </CmsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
