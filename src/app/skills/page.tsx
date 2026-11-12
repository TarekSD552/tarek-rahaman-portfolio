import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SkillsContent from "./SkillsContent";
import StructuredData from "@/components/seo/StructuredData";
import { getAbsoluteUrl } from "@/config/site";
import { getCmsData } from "@/lib/cms-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await getCmsData();
  const seo = cmsData.skillsSeoSettings;
  const pageSeo = cmsData.pages?.find((p) => p.slug === "skills" || p.id === "skills");

  const title =
    seo?.title ||
    pageSeo?.seoTitle ||
    pageSeo?.title ||
    "Skills & Technology Stack | Tarek Rahaman - Web Developer";

  const description =
    seo?.description ||
    pageSeo?.seoDesc ||
    "Explore the technical skillset of Tarek Rahaman: Next.js, React, Tailwind CSS, Laravel, PHP, WordPress, WooCommerce, Python, MySQL, and Core Web Vitals optimization.";

  const keywords =
    seo?.keywords ||
    pageSeo?.keywords ||
    "Tarek Rahaman Skills, Web Developer Tech Stack, WordPress Specialist, Laravel Developer Bangladesh, PHP MySQL Developer, Next.js React Developer Dhaka";
  const ogImage = seo?.ogImage || pageSeo?.ogImage || "/assets/profile-1-scaled.png";
  const canonicalUrl = getAbsoluteUrl("/skills");

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
          alt: "Tarek Rahaman - Technology Stack & Skills",
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

export default function SkillsPage() {
  return (
    <div className="relative min-h-screen bg-[#050811] text-white selection:bg-[#00d2ff] selection:text-[#050811]">
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Skills", url: "/skills" },
        ]}
      />
      <Navbar />

      <main className="pt-28 pb-20">
        <SkillsContent />
      </main>

      <Footer />
    </div>
  );
}
