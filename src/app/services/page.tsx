import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WaveDivider from "@/components/ui/WaveDivider";
import ServicesContent from "./ServicesContent";
import StructuredData from "@/components/seo/StructuredData";
import { getAbsoluteUrl } from "@/config/site";
import { getCmsData } from "@/lib/cms-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await getCmsData();
  const seo = cmsData.servicesSeoSettings;
  const pageSeo = cmsData.pages?.find((p) => p.slug === "services");

  const title =
    seo?.title ||
    pageSeo?.seoTitle ||
    pageSeo?.title ||
    "Web Development Services in Bangladesh & Dhaka | Tarek Rahaman";

  const description =
    seo?.description ||
    pageSeo?.seoDesc ||
    "Professional web development services in Dhaka, Mirpur & across Bangladesh. Custom WordPress, high-converting E-Commerce (WooCommerce), Laravel web apps, and speed optimization by Tarek Rahaman.";

  const keywords =
    seo?.keywords ||
    pageSeo?.keywords ||
    "Web Developer in Mirpur, Web Developer Mirpur Dhaka, Website Developer in Dhaka, Freelance Web Developer Bangladesh, Web Design Services in Bangladesh, WordPress Developer Dhaka, E-Commerce Development Bangladesh";
  const ogImage = seo?.ogImage || pageSeo?.ogImage || "/assets/profile-1-scaled.png";
  const canonicalUrl = getAbsoluteUrl("/services");

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
          alt: "Web Development Services - Tarek Rahaman",
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

export default function ServicesPage() {
  return (
    <div className="relative min-h-screen bg-[#050811] text-white selection:bg-[#00d2ff] selection:text-[#050811]">
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
        ]}
      />
      {/* 1. Full-Width Sticky Navbar */}
      <Navbar />

      {/* 2. Top Animated RGB Wave Divider (Directly below navbar) */}
      <div className="pt-16 sm:pt-18">
        <WaveDivider variant={1} className="-mt-2 sm:-mt-3 !py-0" />
      </div>

      {/* 3. Fully Dynamic Services Page Content with Reordering & Visibility Controls */}
      <ServicesContent />

      {/* 4. Global Footer */}
      <Footer />
    </div>
  );
}
