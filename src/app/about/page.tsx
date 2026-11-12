import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutContent from "./AboutContent";
import StructuredData from "@/components/seo/StructuredData";
import { getAbsoluteUrl } from "@/config/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "About Tarek Rahaman | Full-Stack Web Developer in Dhaka, Bangladesh",
  description:
    "Learn about Tarek Rahaman's software engineering background at Daffodil International University (Data Science major), NSDA certifications, development process, and full-stack expertise based in Mirpur, Dhaka.",
  alternates: {
    canonical: getAbsoluteUrl("/about"),
  },
  openGraph: {
    type: "profile",
    title: "About Tarek Rahaman | Full-Stack Web Developer in Dhaka, Bangladesh",
    description:
      "Software Engineering student at Daffodil International University & Professional Full-Stack Developer specializing in Next.js, Laravel, WordPress, and high-performance e-commerce systems.",
    url: getAbsoluteUrl("/about"),
    images: [
      {
        url: "/assets/profile-1-scaled.png",
        width: 1200,
        height: 630,
        alt: "About Tarek Rahaman - Full-Stack Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Tarek Rahaman | Full-Stack Web Developer",
    description:
      "Software Engineering student at Daffodil International University & Professional Full-Stack Developer based in Mirpur, Dhaka.",
    images: ["/assets/profile-1-scaled.png"],
  },
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#050811] text-white selection:bg-[#00d2ff] selection:text-[#050811]">
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ]}
      />
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-16 sm:pb-20">
        <AboutContent />
      </main>

      <Footer />
    </div>
  );
}
