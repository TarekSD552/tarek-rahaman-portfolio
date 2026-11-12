import { MetadataRoute } from "next";
import { getCmsData } from "@/lib/cms-db";
import { projectsData } from "@/data/portfolioData";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.baseUrl;
  const now = new Date();

  // Fetch projects from CMS or fallback to static data
  let allProjects = projectsData;
  try {
    const cms = await getCmsData();
    if (cms?.projects && cms.projects.length > 0) {
      allProjects = cms.projects;
    }
  } catch {
    allProjects = projectsData;
  }

  // Core public pages with priority & change frequency
  const corePages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: getAbsoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: getAbsoluteUrl("/services"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: getAbsoluteUrl("/skills"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl("/portfolio"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: getAbsoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  // Dynamic portfolio project detail routes
  const projectPages: MetadataRoute.Sitemap = allProjects
    .filter((p) => p.slug || p.id)
    .map((p) => {
      const slug = p.slug || p.id;
      return {
        url: getAbsoluteUrl(`/portfolio/${slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
      };
    });

  return [...corePages, ...projectPages];
}
