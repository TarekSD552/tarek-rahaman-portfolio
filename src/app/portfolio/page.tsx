import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PortfolioContent from "./PortfolioContent";
import StructuredData from "@/components/seo/StructuredData";
import { getAbsoluteUrl } from "@/config/site";
import { getCmsData } from "@/lib/cms-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await getCmsData();
  const seo = cmsData.portfolioPageSettings?.seo;
  const pageSeo = cmsData.pages?.find((p) => p.slug === "portfolio" || p.id === "portfolio");

  const title =
    seo?.title ||
    pageSeo?.seoTitle ||
    pageSeo?.title ||
    "Web Development Portfolio & Projects | Tarek Rahaman";

  const description =
    seo?.description ||
    pageSeo?.seoDesc ||
    "Browse client projects, e-commerce stores, and custom web applications developed by Tarek Rahaman for businesses in Dhaka, Bangladesh, and international clients.";

  const keywords =
    seo?.keywords ||
    pageSeo?.keywords ||
    "Tarek Rahaman Portfolio, Web Development Projects, E-Commerce Portfolio Bangladesh, WordPress Work, Laravel Web Apps, Next.js Projects Dhaka";
  const ogImage = seo?.ogImage || pageSeo?.ogImage || "/assets/profile-1-scaled.png";
  const canonicalUrl = getAbsoluteUrl("/portfolio");

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: keywords.split(",").map((k: string) => k.trim()),
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Tarek Rahaman - Portfolio & Client Work",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      images: [ogImage],
    },
  };
}

export default function PortfolioPage() {
  return (
    <div className="relative min-h-screen bg-[#050811] text-white selection:bg-[#00d2ff] selection:text-[#050811]">
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Portfolio", url: "/portfolio" },
        ]}
      />
      <Navbar />

      <main className="pt-24 sm:pt-28 pb-20">
        <PortfolioContent />
      </main>

      <Footer />
    </div>
  );
}
