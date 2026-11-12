"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Globe,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  Navigation,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ServiceAreaSection() {
  const { t, language } = useLanguage();
  const isBn = language === "bn";

  const servicePillars = [
    {
      id: "dhaka-mirpur",
      icon: MapPin,
      badge: t("servicesPage.serviceArea.localBadge"),
      badgeColor: "cyan",
      title: t("servicesPage.serviceArea.localTitle"),
      subtitle: t("servicesPage.serviceArea.localSubtitle"),
      description: t("servicesPage.serviceArea.localDesc"),
      locations: isBn
        ? [
            "মিরপুর (মিরপুর ১, ২, ৬, ১০, ১১, ১২, মিরপুর ডিওএইচএস)",
            "উত্তরা ও এয়ারপোর্ট রোড এলাকা",
            "গুলশান, বনানী ও বারিধারা",
            "ধানমন্ডি, মোহাম্মদপুর ও লালমাটিয়া",
            "মতিঝিল, তেজগাঁও ও সেন্ট্রাল ঢাকা",
          ]
        : [
            "Mirpur (Mirpur 1, 2, 6, 10, 11, 12, Mirpur DOHS)",
            "Uttara & Airport Road Hubs",
            "Gulshan, Banani & Baridhara",
            "Dhanmondi, Mohammadpur & Lalmatia",
            "Motijheel, Tejgaon & Central Dhaka",
          ],
      highlights: isBn
        ? [
            "সরাসরি ইন-পার্সন প্রজেক্ট পরিকল্পনা ও আর্কিটেকচার আলোচনা",
            "জরুরি লাইভ সাপোর্ট ও তাৎক্ষণিক বাগ ফিক্সিং",
            "ঢাকার ব্যবসার প্রয়োজনের সাথে কাস্টমাইজড দ্রুত ডেলিভারি",
          ]
        : [
            "In-person project planning & architectural discussions",
            "Same-day emergency support & live debugging",
            "Fast turnaround customized for Dhaka businesses",
          ],
      ctaText: t("servicesPage.serviceArea.discussLocal"),
    },
    {
      id: "nationwide-bangladesh",
      icon: Building2,
      badge: t("servicesPage.serviceArea.nationBadge"),
      badgeColor: "emerald",
      title: t("servicesPage.serviceArea.nationTitle"),
      subtitle: t("servicesPage.serviceArea.nationSubtitle"),
      description: t("servicesPage.serviceArea.nationDesc"),
      locations: isBn
        ? [
            "ঢাকা বিভাগ ও পার্শ্ববর্তী শিল্পাঞ্চলসমূহ",
            "চট্টগ্রাম বাণিজ্যিক ও রপ্তানি হাব",
            "সিলেট আঞ্চলিক ও প্রবাসী ব্যবসা প্রতিষ্ঠান",
            "রাজশাহী, খুলনা, রংপুর ও বরিশাল",
            "ময়মনসিংহ ও দ্রুত বর্ধনশীল জেলাসমূহ",
          ]
        : [
            "Dhaka Division & Surrounding Industrial Belts",
            "Chattogram Commercial & Export Hubs",
            "Sylhet Regional & Expatriate Businesses",
            "Rajshahi, Khulna, Rangpur & Barishal",
            "Mymensingh & Fast-Growing Regional Districts",
          ],
      highlights: isBn
        ? [
            "বাংলাদেশি পেমেন্ট গেটওয়ে (বিকাশ, নগদ, SSLCommerz)",
            "লোকাল কুরিয়ার API ইন্টিগ্রেশন (Steadfast, Pathao, RedX)",
            "Google Meet, Zoom ও WhatsApp-এর মাধ্যমে ১০০% রিমোট সহযোগিতা",
          ]
        : [
            "Bangladeshi Payment Gateways (bKash, Nagad, SSLCommerz)",
            "Local Courier API Integrations (Steadfast, Pathao, RedX)",
            "100% remote collaboration via Google Meet, Zoom & WhatsApp",
          ],
      ctaText: t("servicesPage.serviceArea.discussNation"),
    },
    {
      id: "global-remote",
      icon: Globe,
      badge: t("servicesPage.serviceArea.globalBadge"),
      badgeColor: "purple",
      title: t("servicesPage.serviceArea.globalTitle"),
      subtitle: t("servicesPage.serviceArea.globalSubtitle"),
      description: t("servicesPage.serviceArea.globalDesc"),
      locations: isBn
        ? [
            "যুক্তরাষ্ট্র ও কানাডা (EST, CST, PST টাইমজোন ওভারল্যাপ)",
            "যুক্তরাজ্য ও পশ্চিম ইউরোপ (GMT/BST)",
            "সংযুক্ত আরব আমিরাত ও মধ্যপ্রাচ্য (GST)",
            "অস্ট্রেলিয়া ও এশিয়া-প্যাসিফিক টেক হাব",
          ]
        : [
            "United States & Canada (EST, CST, PST Overlap)",
            "United Kingdom & Western Europe (GMT/BST)",
            "United Arab Emirates & Gulf Region (GST)",
            "Australia & Asia-Pacific Tech Centers",
          ],
      highlights: isBn
        ? [
            "টাইমজোনের সাথে সামঞ্জস্য রেখে নিয়মিত মিটিং ও আপডেট",
            "গিট ও ক্লিন কোড রিপোজিটরি হ্যান্ডঅফ",
            "Stripe, PayPal ও আন্তর্জাতিক পেমেন্ট কমপ্লায়েন্স",
          ]
        : [
            "Timezone-aligned milestone meetings & updates",
            "Git-based clean code repository handoffs",
            "Stripe, PayPal, and international bank compliance",
          ],
      ctaText: t("servicesPage.serviceArea.discussGlobal"),
    },
  ];

  return (
    <section
      id="service-areas"
      className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#00d2ff]/08 via-[#6366f1]/08 to-[#00d2ff]/08 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Container */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 shadow-[0_0_15px_rgba(0,210,255,0.18)] mb-3"
        >
          <Navigation className="w-3.5 h-3.5 text-[#00d2ff] animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#00d2ff]">
            {t("servicesPage.serviceArea.badge")}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4"
        >
          {isBn ? (
            <>
              ব্যবসার সেবা প্রদানে{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#818cf8]">
                মিরপুর, ঢাকা
              </span>{" "}
              ও সমগ্র বাংলাদেশ
            </>
          ) : (
            <>
              Serving Businesses in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#38bdf8] to-[#818cf8]">
                Mirpur, Dhaka
              </span>{" "}
              &amp; Across Bangladesh
            </>
          )}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="text-slate-300 text-sm sm:text-base leading-relaxed"
        >
          {t("servicesPage.serviceArea.desc")}
        </motion.p>

        {/* Trust Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#090f1e]/80 border border-[#00d2ff]/25 backdrop-blur-md shadow-[0_0_20px_rgba(0,210,255,0.08)]"
        >
          <p className="text-xs sm:text-sm text-cyan-200/90 font-medium leading-relaxed italic">
            {isBn
              ? "“আমি ঢাকা ও বাংলাদেশের বিভিন্ন এলাকার ব্যক্তি এবং ব্যবসার জন্য Professional Web Design ও Web Development Service প্রদান করি। Remote এবং Online Client-এর সাথেও নিয়মিতভাবে বিশ্বস্ততার সাথে কাজ করি।”"
              : "“I provide professional web design & web development services for individuals and businesses across Dhaka and Bangladesh, alongside trusted partnerships with remote and online clients worldwide.”"}
          </p>
        </motion.div>
      </div>

      {/* 3 Comprehensive Service Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
        {servicePillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          const isPrimary = pillar.id === "dhaka-mirpur";

          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 * idx }}
              className={`group relative rounded-2xl sm:rounded-3xl p-4.5 sm:p-6 lg:p-8 flex flex-col justify-between transition-all duration-300 ${
                isPrimary
                  ? "bg-gradient-to-b from-[#0c1630] via-[#091124] to-[#070c1a] border-2 border-[#00d2ff]/40 shadow-[0_0_35px_rgba(0,210,255,0.15)] hover:border-[#00d2ff] hover:shadow-[0_0_45px_rgba(0,210,255,0.3)]"
                  : "bg-[#090f20]/70 border border-[#00d2ff]/20 backdrop-blur-xl hover:border-[#00d2ff]/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.12)]"
              }`}
            >
              <div>
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/30">
                    <Sparkles className="w-3 h-3 text-[#00d2ff]" />
                    <span>{pillar.badge}</span>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-2 group-hover:text-[#00d2ff] transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">
                  {pillar.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5">
                  {pillar.description}
                </p>

                {/* Coverage List */}
                <div className="mb-5 pt-3 border-t border-slate-800/80">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5 font-bold">
                    {isBn ? "প্রধান কর্মক্ষেত্র:" : "Primary Coverage:"}
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {pillar.locations.map((loc) => (
                      <li key={loc} className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#00d2ff] shrink-0 mt-0.5" />
                        <span>{loc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Execution Highlights */}
                <div className="mb-6 pt-3 border-t border-slate-800/80">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5 font-bold">
                    {isBn ? "কাজের সক্ষমতা:" : "Service Capabilities:"}
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {pillar.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-4 border-t border-slate-800">
                <Link
                  href="/contact"
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                    isPrimary
                      ? "bg-gradient-to-r from-[#00d2ff] to-[#0088ff] text-slate-950 hover:shadow-[0_0_20px_rgba(0,210,255,0.6)] hover:scale-[1.02]"
                      : "bg-[#0b1329] border border-[#00d2ff]/30 text-white hover:border-[#00d2ff] hover:text-[#00d2ff] hover:bg-[#00d2ff]/10"
                  }`}
                >
                  <span>{pillar.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
