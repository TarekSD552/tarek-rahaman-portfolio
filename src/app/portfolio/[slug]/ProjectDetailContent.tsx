"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Globe, Layers } from "lucide-react";
import WaveDivider from "@/components/ui/WaveDivider";
import { useLanguage } from "@/context/LanguageContext";
import { ProjectItem } from "@/types/portfolio";
import { normalizeImageUrl } from "@/lib/image-utils";

interface ProjectDetailContentProps {
  project: ProjectItem;
  prevProject: ProjectItem;
  nextProject: ProjectItem;
  slug: string;
}

export default function ProjectDetailContent({
  project,
  prevProject,
  nextProject,
  slug,
}: ProjectDetailContentProps) {
  const { t, tCategory } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb / Back Link */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-[#00d2ff] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("projects.backToAll")}</span>
        </Link>

        <span className="text-xs font-mono font-bold text-[#00d2ff] uppercase tracking-wider bg-[#00d2ff]/10 border border-[#00d2ff]/30 px-3 py-1 rounded-full">
          {tCategory(project.categoryName || project.category || "")}
        </span>
      </div>

      {/* Project Header */}
      <div className="space-y-4 mb-10 text-left">
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          {project.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Large Hero Image */}
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-[#00d2ff]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] mb-12 bg-[#070b14]">
        <Image
          src={normalizeImageUrl(project.image, "/assets/profile-1-scaled.png")}
          alt={project.title}
          fill
          sizes="(max-width: 1024px) 100vw, 1000px"
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050811]/60 via-transparent to-transparent" />
      </div>

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Left: Project Overview */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl bg-[#090f1e]/85 border border-[#00d2ff]/20 backdrop-blur-xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00d2ff]" />
              <span>{t("projects.projectOverview")}</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t("projects.overviewP1")}
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t("projects.overviewP2")}
            </p>
          </div>

          {/* Technologies Used */}
          <div className="p-8 rounded-3xl bg-[#090f1e]/85 border border-[#00d2ff]/20 backdrop-blur-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00d2ff]" />
              <span>{t("projects.technologiesArchitecture")}</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-[#070b16] border border-[#00d2ff]/25"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00d2ff]" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Project Meta Box & Live Link */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#090f1e]/90 border border-[#00d2ff]/30 shadow-[0_0_25px_rgba(0,210,255,0.1)] space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {t("projects.category")}
              </span>
              <div className="text-sm font-bold text-white">
                {tCategory(project.categoryName || project.category || "")}
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {t("projects.deploymentStatus")}
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {project.liveUrl && project.liveUrl !== "#"
                    ? t("projects.liveProduction")
                    : t("projects.commercialDemo")}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {t("projects.developerArchitect")}
              </span>
              <div className="text-sm font-bold text-white">Tarek Rahaman</div>
            </div>

            {project.liveUrl && project.liveUrl !== "#" ? (
              <div className="pt-4">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-xs font-black uppercase tracking-wider text-[#050811] bg-gradient-to-r from-[#00d2ff] via-[#00f0ff] to-[#00a3ff] shadow-[0_0_20px_rgba(0,210,255,0.7)] hover:scale-[1.02] transition-all"
                >
                  <Globe className="w-4 h-4" />
                  <span>{t("projects.livePreview")}</span>
                </a>
              </div>
            ) : (
              <div className="pt-4">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-xs font-black uppercase tracking-wider text-[#050811] bg-gradient-to-r from-[#00d2ff] to-[#0088ff] hover:scale-[1.02] transition-all"
                >
                  <span>{t("projects.inquireSolution")}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <WaveDivider variant={1} />

      {/* Previous / Next Project Navigation Bar */}
      <div className="my-12 p-6 rounded-3xl bg-[#090f1e]/85 border border-[#00d2ff]/20 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href={`/portfolio/${prevProject.slug}`}
          className="flex items-center gap-3 text-left group hover:text-[#00d2ff] transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#070b16] border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] group-hover:bg-[#00d2ff] group-hover:text-black transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {t("projects.prevProject")}
            </span>
            <span className="text-sm font-bold text-white group-hover:text-[#00d2ff]">
              {prevProject.title}
            </span>
          </div>
        </Link>

        <Link
          href="/portfolio"
          className="text-xs font-bold uppercase tracking-wider text-[#00d2ff] hover:underline"
        >
          {t("projects.allProjects")}
        </Link>

        <Link
          href={`/portfolio/${nextProject.slug}`}
          className="flex items-center gap-3 text-right group hover:text-[#00d2ff] transition-colors sm:flex-row-reverse"
        >
          <div className="w-10 h-10 rounded-full bg-[#070b16] border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] group-hover:bg-[#00d2ff] group-hover:text-black transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {t("projects.nextProject")}
            </span>
            <span className="text-sm font-bold text-white group-hover:text-[#00d2ff]">
              {nextProject.title}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

