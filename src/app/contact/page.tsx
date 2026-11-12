import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactContent from "./ContactContent";
import StructuredData from "@/components/seo/StructuredData";
import { getAbsoluteUrl } from "@/config/site";
import { getCmsData } from "@/lib/cms-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await getCmsData();
  const seo = cmsData.contactSeo;
  const pageSeo = cmsData.pages?.find((p) => p.slug === "contact" || p.id === "contact");

  const title =
    seo?.title ||
    pageSeo?.seoTitle ||
    pageSeo?.title ||
    "Contact Tarek Rahaman | Web Developer in Mirpur, Dhaka";

  const description =
    seo?.description ||
    pageSeo?.seoDesc ||
    "Contact Tarek Rahaman for web design, e-commerce, and web application projects in Mirpur, Dhaka, across Bangladesh or worldwide. Direct WhatsApp, email, and phone consultation.";

  const keywords =
    seo?.keywords ||
    pageSeo?.keywords ||
    "Contact Tarek Rahaman, Hire Web Developer Dhaka, Web Developer in Mirpur, Freelance Developer Bangladesh, Web Design Consultation Dhaka";
  const ogImage = seo?.ogImage || pageSeo?.ogImage || "/assets/developer-workstation-hd.jpg";
  const canonicalUrl = getAbsoluteUrl("/contact");

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
          alt: "Contact Tarek Rahaman - Web Developer",
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

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-[#050811] text-white selection:bg-[#00d2ff] selection:text-[#050811]">
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-24">
        <ContactContent />
      </main>

      <Footer />
    </div>
  );
}
