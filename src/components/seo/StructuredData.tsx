import React from "react";
import { SITE_CONFIG } from "@/config/site";

interface StructuredDataProps {
  type?: "person-and-business" | "faq" | "breadcrumb" | "project";
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  project?: {
    title: string;
    description: string;
    url: string;
    image?: string;
    technologies?: string[];
  };
}

export default function StructuredData({
  type = "person-and-business",
  breadcrumbs,
  faqs,
  project,
}: StructuredDataProps) {
  const baseUrl = SITE_CONFIG.baseUrl;

  // 1. Person Schema — Verified Personal Brand: Tarek Rahaman
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name: "Tarek Rahaman",
    alternateName: ["Md Tarek Rahaman", "Tarek Rahman"],
    jobTitle: "Full-Stack Web Developer & Software Engineer",
    description:
      "Tarek Rahaman is a professional Full-Stack Web Developer, WordPress Specialist, and Software Engineering student at Daffodil International University (Data Science major) based in Mirpur, Dhaka, Bangladesh.",
    url: baseUrl,
    image: `${baseUrl}/assets/profile-1-scaled.png`,
    email: "mailto:tarekrahaman186@gmail.com",
    telephone: "+8801733119269",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Daffodil International University",
      url: "https://daffodilvarsity.edu.bd",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mirpur-1",
      addressLocality: "Dhaka",
      addressRegion: "Dhaka Division",
      postalCode: "1216",
      addressCountry: "BD",
    },
    sameAs: [
      "https://github.com/TarekSD552",
      "https://www.facebook.com/tarak.rahoman.3",
      "https://www.instagram.com/tarek_rahman333",
      "https://wa.me/8801733119269",
    ],
    knowsAbout: [
      "Web Development",
      "Full-Stack Web Development",
      "WordPress Development",
      "WooCommerce",
      "Next.js",
      "React",
      "Laravel",
      "PHP",
      "MySQL",
      "Python",
      "Speed Optimization",
      "Technical SEO",
    ],
  };

  // 2. ProfessionalService Schema — Local Business & Web Development in Mirpur, Dhaka, Bangladesh
  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${baseUrl}/#business`,
    name: "Tarek Rahaman - Web Development & Digital Solutions",
    alternateName: "Tarek Rahaman Web Development Bangladesh",
    image: `${baseUrl}/assets/profile-1-scaled.png`,
    url: baseUrl,
    telephone: "+8801733119269",
    email: "tarekrahaman186@gmail.com",
    priceRange: "$$",
    currenciesAccepted: "BDT, USD, EUR",
    paymentAccepted: "Cash, Credit Card, Bank Transfer, bKash, Nagad, SSLCommerz, Stripe, PayPal",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mirpur-1",
      addressLocality: "Dhaka",
      addressRegion: "Dhaka Division",
      postalCode: "1216",
      addressCountry: "BD",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 23.8067,
      longitude: 90.3547,
    },
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Mirpur, Dhaka",
      },
      {
        "@type": "City",
        name: "Dhaka",
      },
      {
        "@type": "Country",
        name: "Bangladesh",
      },
      {
        "@type": "Country",
        name: "Worldwide",
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web Development & Digital Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Full-Stack Web Development",
            description: "High-performance web applications built with Next.js, React, Laravel, and PHP.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "E-Commerce Website Development (WooCommerce & Custom)",
            description: "High-converting online stores with bKash, Nagad, SSLCommerz, and global payment integrations.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom WordPress Development & Speed Optimization",
            description: "Bespoke WordPress themes, custom WooCommerce architectures, and Core Web Vitals optimization.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "High-Converting Landing Page Development",
            description: "Fast, responsive, lead-generating landing pages tailored for advertising campaigns and startups.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Website Redesign & Technical SEO",
            description: "Modernizing legacy websites with clean UI/UX, semantic HTML, mobile responsiveness, and SEO best practices.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Website Maintenance & Security Support",
            description: "Ongoing technical updates, security patching, database backups, and feature enhancements.",
          },
        },
      ],
    },
  };

  // 3. WebSite Schema
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "Tarek Rahaman Portfolio",
    description: "Personal Portfolio and Web Development Services of Tarek Rahaman.",
    publisher: {
      "@id": `${baseUrl}/#person`,
    },
    inLanguage: ["en-US", "bn-BD"],
  };

  // 4. BreadcrumbList Schema
  let breadcrumbSchema = null;
  if (breadcrumbs && breadcrumbs.length > 0) {
    breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: crumb.name,
        item: crumb.url.startsWith("http") ? crumb.url : `${baseUrl}${crumb.url}`,
      })),
    };
  }

  // 5. FAQPage Schema
  let faqSchema = null;
  if (faqs && faqs.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  }

  // 6. CreativeWork Project Schema
  let projectSchema = null;
  if (project) {
    projectSchema = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      url: project.url,
      image: project.image ? (project.image.startsWith("http") ? project.image : `${baseUrl}${project.image}`) : undefined,
      author: {
        "@id": `${baseUrl}/#person`,
      },
      creator: {
        "@id": `${baseUrl}/#person`,
      },
      keywords: project.technologies?.join(", "),
    };
  }

  // Safely serializes JSON-LD structured data and escapes `<` to prevent script breakout XSS
  const safeJsonLd = (schema: any): string => {
    return JSON.stringify(schema).replace(/</g, "\\u003c");
  };

  return (
    <>
      {type === "person-and-business" && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(professionalServiceSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(webSiteSchema) }}
          />
        </>
      )}

      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
        />
      )}

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
        />
      )}

      {projectSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(projectSchema) }}
        />
      )}
    </>
  );
}

