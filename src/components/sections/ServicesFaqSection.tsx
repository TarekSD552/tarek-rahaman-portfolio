"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Sparkles, HelpCircle } from "lucide-react";
import { useCms } from "@/context/CmsContext";
import { useLanguage } from "@/context/LanguageContext";
import StructuredData from "@/components/seo/StructuredData";

const defaultFaqData = [
  {
    number: "01",
    question: "Do you provide web development services for clients in Mirpur and Dhaka?",
    answer:
      "Yes, absolutely. I am based in Mirpur-1, Dhaka, and frequently meet local clients in-person for project planning across Mirpur (Mirpur 1, 2, 6, 10, DOHS), Dhanmondi, Uttara, Gulshan, Banani, and greater Dhaka. In addition to in-person consultations, we coordinate smoothly via WhatsApp, phone, and Google Meet.",
  },
  {
    number: "02",
    question: "Do you work with clients across Bangladesh and internationally?",
    answer:
      "Yes. I actively collaborate with businesses all across Bangladesh (Dhaka, Chattogram, Sylhet, Rajshahi, Khulna, etc.) as well as international clients in the USA, UK, Canada, UAE, and Australia using remote tools like Zoom, Google Meet, GitHub, and Figma.",
  },
  {
    number: "03",
    question: "How long does it take to develop a professional website?",
    answer:
      "A high-converting landing page is typically completed in 3 to 5 business days, a standard business website in 7 to 14 days, and full-featured e-commerce platforms or custom Laravel applications usually take 2 to 4 weeks depending on feature complexity and revisions.",
  },
  {
    number: "04",
    question: "Do you develop E-Commerce websites with Bangladeshi payment gateways?",
    answer:
      "Yes. I build custom WooCommerce and Laravel e-commerce stores integrated with bKash, Nagad, Rocket, Upay, and SSLCommerz, alongside automated courier APIs (Steadfast, Pathao, RedX). International gateways such as Stripe and PayPal are also supported.",
  },
  {
    number: "05",
    question: "Do you provide post-launch support and maintenance?",
    answer:
      "Yes. Every project includes complimentary post-launch support for bug fixes and adjustments. Additionally, I offer monthly maintenance packages covering WordPress core/plugin updates, automated database backups, security monitoring, and Core Web Vitals speed optimization.",
  },
  {
    number: "06",
    question: "Can I easily update and manage my website content myself?",
    answer:
      "Yes. All websites are built with user-friendly dashboards (such as WordPress or custom CMS panels). You can easily add products, edit text, and change images without touching any code. I also provide personalized video or live training upon delivery.",
  },
  {
    number: "07",
    question: "How much does a custom website project cost?",
    answer:
      "Project costs depend on your specific requirements, such as number of pages, custom features, payment integrations, and design complexity. Contact me directly via WhatsApp or email with your vision for a transparent, itemized quotation.",
  },
];

const bnFaqData = [
  {
    number: "০১",
    question: "আপনি কি মিরপুর এবং ঢাকায় ওয়েব ডেভেলপমেন্ট সেবা দেন?",
    answer:
      "হ্যাঁ, অবশ্যই। আমি মিরপুর-১, ঢাকায় অবস্থান করি এবং প্রজেক্ট পরিকল্পনার জন্য মিরপুর (মিরপুর ১, ২, ৬, ১০, ডিওএইচএস), ধানমন্ডি, উত্তরা, গুলশান, বনানীসহ সমগ্র ঢাকার ক্লায়েন্টদের সাথে সরাসরি ইন-পার্সন মিটিং করি। এছাড়া WhatsApp, ফোন ও Google Meet-এর মাধ্যমেও সার্বক্ষণিক যোগাযোগ বজায় থাকে।",
  },
  {
    number: "০২",
    question: "আপনি কি সমগ্র বাংলাদেশ এবং আন্তর্জাতিকভাবে কাজ করেন?",
    answer:
      "হ্যাঁ। আমি দেশের যেকোনো প্রান্তের (ঢাকা, চট্টগ্রাম, সিলেট, রাজশাহী, খুলনা ইত্যাদি) ব্যবসার পাশাপাশি যুক্তরাষ্ট্র, যুক্তরাজ্য, কানাডা, সংযুক্ত আরব আমিরাত ও অস্ট্রেলিয়ার আন্তর্জাতিক ক্লায়েন্টদের সাথে Zoom, Google Meet, GitHub ও Figma ব্যবহার করে রিমোটলি কাজ করি।",
  },
  {
    number: "০৩",
    question: "একটি প্রফেশনাল ওয়েবসাইট তৈরি করতে কত সময় লাগে?",
    answer:
      "সাধারণত একটি হাই-কনভার্টিং ল্যান্ডিং পেজ ৩ থেকে ৫ কার্যদিবসে, স্ট্যান্ডার্ড বিজনেস ওয়েবসাইট ৭ থেকে ১৪ দিনে এবং ফুল-ফিচার্ড ই-কমার্স বা কাস্টম লারাভেল অ্যাপ্লিকেশন ফিচার ও রিভিশনের ওপর ভিত্তি করে ২ থেকে ৪ সপ্তাহের মধ্যে ডেলিভারি করা হয়।",
  },
  {
    number: "০৪",
    question: "আপনি কি বাংলাদেশি পেমেন্ট গেটওয়েসহ ই-কমার্স ওয়েবসাইট তৈরি করেন?",
    answer:
      "হ্যাঁ। আমি বিকাশ, নগদ, রকেট, উপায় এবং SSLCommerz গেটওয়ে সংবলিত কাস্টম WooCommerce ও Laravel ই-কমার্স স্টোর তৈরি করি, সাথে Steadfast, Pathao ও RedX কুরিয়ার API ইন্টিগ্রেশন থাকে। আন্তর্জাতিক গেটওয়ে Stripe ও PayPal-ও সমর্থিত।",
  },
  {
    number: "০৫",
    question: "প্রজেক্ট ডেলিভারির পর কি মেইনটেন্যান্স ও সাপোর্ট সুবিধা পাওয়া যায়?",
    answer:
      "হ্যাঁ। প্রতিটি প্রজেক্টের সাথে বাগ ফিক্সিং ও সামঞ্জস্যের জন্য নির্দিষ্ট ফ্রি সাপোর্ট অন্তর্ভুক্ত থাকে। এছাড়াও নিয়মিত ব্যাকআপ, স্পিড মনিটরিং, সিকিউরিটি অডিট ও ফিচার আপডেটের জন্য মান্থলি মেইনটেন্যান্স প্যাকেজ উপলব্ধ রয়েছে।",
  },
  {
    number: "০৬",
    question: "আমি কি নিজে ওয়েবসাইট পরিচালনা ও কন্টেন্ট আপডেট করতে পারব?",
    answer:
      "হ্যাঁ। প্রতিটি ওয়েবসাইটেই ইউজার-ফ্রেন্ডলি এডমিন ড্যাশবোর্ড (যেমন ওয়ার্ডপ্রেস বা কাস্টম সিএমএস) দেওয়া থাকে। কোনো কোডিং জ্ঞান ছাড়াই আপনি সহজে নতুন প্রোডাক্ট যোগ, টেক্সট পরিবর্তন ও ছবি আপডেট করতে পারবেন। ডেলিভারির সময় প্রয়োজনে লাইভ বা ভিডিও ট্রেনিং দেওয়া হয়।",
  },
  {
    number: "০৭",
    question: "একটি কাস্টম ওয়েবসাইট প্রজেক্টের খরচ কেমন হয়?",
    answer:
      "প্রজেক্টের খরচ নির্ভর করে আপনার নির্দিষ্ট প্রয়োজনীয়তা, পেজ সংখ্যা, কাস্টম ফিচার, পেমেন্ট গেটওয়ে এবং ডিজাইনের জটিলতার ওপর। আপনার প্রজেক্টের বিস্তারিত জানিয়ে WhatsApp বা ইমেইলে সরাসরি মেসেজ দিন — আমি স্বচ্ছ ও আইটেমাইজড কোটেশন প্রদান করব।",
  },
];

export default function ServicesFaqSection() {
  const { cmsData } = useCms();
  const { tCms, language } = useLanguage();
  const isBn = language === "bn";

  const header = cmsData?.servicesFaqHeader;
  const badge = tCms(header?.badge, "servicesPage.faq.badge");
  const title = tCms(header?.title, "servicesPage.faq.title");
  const highlightText = tCms(header?.highlightText, "servicesPage.faq.highlight");
  const description = tCms(header?.description, "servicesPage.faq.desc");

  const rawFaqs = cmsData?.servicesFaq?.length
    ? cmsData.servicesFaq
    : cmsData?.faqs?.length
    ? cmsData.faqs
    : defaultFaqData;

  const baseFaqs = rawFaqs.filter((f: any) => f.visible !== false && f.active !== false);

  const faqs = isBn
    ? baseFaqs.map((faq: any, idx: number) => {
        const bnMatch = bnFaqData[idx] || bnFaqData[0];
        return {
          ...faq,
          number: bnMatch.number || String(idx + 1).padStart(2, "0"),
          question: bnMatch.question,
          answer: bnMatch.answer,
        };
      })
    : baseFaqs;

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      className="relative py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full select-none overflow-hidden"
    >
      <StructuredData type="faq" faqs={faqs} />
      {/* Background Soft Ambient Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-[#00d2ff]/08 via-[#818cf8]/06 to-[#c084fc]/08 rounded-full blur-[110px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 shadow-[0_0_15px_rgba(0,210,255,0.18)] mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00d2ff] animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#00d2ff]">
            {badge}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-3"
        >
          {title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#818cf8] to-[#c084fc]">
            {highlightText}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal"
        >
          {description}
        </motion.p>
      </div>

      {/* FAQ Accordions List */}
      <div className="space-y-3.5 relative z-10">
        {faqs.map((faq: any, idx: number) => {
          const isOpen = openIndex === idx;
          const numStr = faq.number || String(idx + 1).padStart(2, "0");

          return (
            <motion.div
              key={faq.id || faq.question || idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.04 * idx }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "bg-[#0c1630]/90 border-[#00d2ff]/60 shadow-[0_4px_24px_rgba(0,210,255,0.15)]"
                  : "bg-[#080e1e]/80 border-[#00d2ff]/20 hover:border-[#00d2ff]/40 hover:bg-[#0a1226]/90"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                aria-expanded={isOpen}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 select-none cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#00d2ff] px-2 py-0.5 rounded bg-[#00d2ff]/10 border border-[#00d2ff]/25 shrink-0">
                    {numStr}
                  </span>
                  <span className="font-semibold text-sm sm:text-base text-white group-hover:text-[#00d2ff] transition-colors leading-snug">
                    {faq.question}
                  </span>
                </div>

                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 transition-colors duration-200 ${
                    isOpen
                      ? "bg-[#00d2ff]/20 border-[#00d2ff]/50 text-[#00d2ff]"
                      : "bg-white/[0.04] border-white/10 text-slate-400 group-hover:text-white group-hover:border-white/20"
                  }`}
                >
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.06] mt-1 font-normal">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
