import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Globe, Layers } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StructuredData from "@/components/seo/StructuredData";
import ProjectDetailContent from "./ProjectDetailContent";
import { getAbsoluteUrl } from "@/config/site";
import { projectsData } from "@/data/portfolioData";
import { getCmsData } from "@/lib/cms-db";
import { normalizeImageUrl } from "@/lib/image-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cms = await getCmsData();
  const allProjects = cms.projects?.length ? cms.projects : projectsData;
  const project = allProjects.find((p) => p.slug === slug || p.id === slug);
  if (!project) return { title: "Project Not Found" };

  const canonicalUrl = getAbsoluteUrl(`/portfolio/${project.slug || slug}`);
  const title = `${project.title} | Tarek Rahaman Portfolio`;
  const description = project.description || `Case study of ${project.title} developed by Tarek Rahaman.`;
  const imageUrl = normalizeImageUrl(project.image, "/assets/profile-1-scaled.png");

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cms = await getCmsData();
  const allProjects = cms.projects?.length ? cms.projects : projectsData;
  const projectIndex = allProjects.findIndex((p) => p.slug === slug || p.id === slug);

  if (projectIndex === -1) {
    notFound();
  }

  const project = allProjects[projectIndex];
  const prevProject =
    projectIndex > 0 ? allProjects[projectIndex - 1] : allProjects[allProjects.length - 1];
  const nextProject =
    projectIndex < allProjects.length - 1 ? allProjects[projectIndex + 1] : allProjects[0];

  return (
    <div className="relative min-h-screen bg-[#050811] text-white selection:bg-[#00d2ff] selection:text-[#050811]">
      <Navbar />

      <main className="pt-32 pb-24">
        <StructuredData
          type="project"
          project={{
            title: project.title,
            description: project.description,
            url: getAbsoluteUrl(`/portfolio/${project.slug || slug}`),
            image: normalizeImageUrl(project.image, "/assets/profile-1-scaled.png"),
            technologies: project.technologies,
          }}
          breadcrumbs={[
            { name: "Home", url: "/" },
            { name: "Portfolio", url: "/portfolio" },
            { name: project.title, url: `/portfolio/${project.slug || slug}` },
          ]}
        />
        <ProjectDetailContent
          project={project}
          prevProject={prevProject}
          nextProject={nextProject}
          slug={slug}
        />
      </main>

      <Footer />
    </div>
  );
}

