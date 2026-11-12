import { CmsData } from "@/types/portfolio";
import {
  VERIFIED_CONTACT,
  VERIFIED_RESPONSES,
} from "./tarek-verified-knowledge";

export type DetectedLang = "bn" | "banglish" | "en";

/**
 * Detects whether the user is typing in Bangla (script), Banglish, or English
 */
export function detectLanguage(text: string): DetectedLang {
  const bnRegex = /[\u0980-\u09FF]/;
  if (bnRegex.test(text)) {
    return "bn";
  }

  const lower = text.toLowerCase();
  const banglishWords = [
    "ki", "kemon", "achen", "koren", "korte", "parbe", "parben", "hobe", "lagbe",
    "banay", "banaben", "banate", "chaichi", "chai", "dam", "khoroch", "tarek",
    "tumi", "apni", "amar", "ekta", "koto", "valo", "shathe", "jogajog", "bolte",
    "shob", "bhalo", "dhaka", "porashona", "shikkha", "kaj", "shuru", "keno", "number",
    "paren", "pare", "link", "project", "projects"
  ];

  let matches = 0;
  for (const w of banglishWords) {
    if (new RegExp(`\\b${w}\\b`, "i").test(lower)) {
      matches++;
    }
  }

  if (matches >= 1) {
    return "banglish";
  }

  return "en";
}

/**
 * Generates an intelligent, accurate fallback reply strictly following
 * the 18 Master Rules and anti-hallucination standards.
 */
export function generateSmartFallbackReply(
  userQuery: string,
  cms?: CmsData,
  _options?: { hasImage?: boolean; referenceUrl?: string; documentName?: string }
): string {
  const lang = detectLanguage(userQuery);
  const q = userQuery.toLowerCase().trim();

  // 1. SIMPLE GREETINGS (Short & Friendly)
  const greetingsRegex = /^(hi|hello|hey|hola|greetings|হাই|হ্যালো|হে|সালাম|আসসালামু আলাইকুম|salam|assalamu alaikum)[\s!.,?]*$/i;
  if (greetingsRegex.test(q)) {
    if (lang === "bn") return VERIFIED_RESPONSES.greeting.bn;
    if (lang === "banglish") return "হাই! 👋 আমি Tarek AI Assistant। কী জানতে চান বলুন?";
    return VERIFIED_RESPONSES.greeting.en;
  }

  // 2. LANGUAGE CAPABILITY QUESTIONS (e.g. "তুমি বাংলায় কথা বলতে পারো?")
  if (
    q.includes("বাংলা") ||
    q.includes("bangla") ||
    q.includes("bengali") ||
    q.includes("english") ||
    q.includes("ইংরেজি") ||
    q.includes("কথা বলতে") ||
    q.includes("kotha bolte") ||
    q.includes("speak bangla") ||
    q.includes("speak in bangla") ||
    q.includes("speak english")
  ) {
    if (
      q.includes("পারো") ||
      q.includes("পারেন") ||
      q.includes("পারে") ||
      q.includes("বলতে") ||
      q.includes("speak") ||
      q.includes("talk") ||
      q.includes("understand") ||
      q.includes("বোঝো") ||
      q.includes("জানেন") ||
      q.includes("paro") ||
      q.includes("parbe") ||
      q.includes("language") ||
      q.includes("ভাষা")
    ) {
      if (lang === "bn" || lang === "banglish") {
        return VERIFIED_RESPONSES.languageCapability.bn;
      }
      return VERIFIED_RESPONSES.languageCapability.en;
    }
  }

  // 3. BLOOD GROUP (STRICT: Mention only when asked directly)
  if (
    q.includes("blood") ||
    q.includes("ব্লাড") ||
    q.includes("রক্ত") ||
    q.includes("blood group")
  ) {
    if (lang === "bn" || lang === "banglish") {
      return VERIFIED_RESPONSES.bloodGroup.bn;
    }
    return VERIFIED_RESPONSES.bloodGroup.en;
  }

  // 4. QUESTIONS ABOUT SKILLS ("সে কি কি পারে?", "কি কি পারে?")
  if (
    q.includes("কি কি পারে") ||
    q.includes("কি পারে") ||
    q.includes("কি কি পারেন") ||
    q.includes("কি পারেন") ||
    q.includes("ki ki pare") ||
    q.includes("ki ki paren") ||
    q.includes("what can he do") ||
    q.includes("what can tarek do") ||
    (q.includes("দক্ষতা") && !q.includes("প্রজেক্ট")) ||
    (q.includes("স্কিল") && !q.includes("প্রজেক্ট")) ||
    (q.includes("skill") && !q.includes("project"))
  ) {
    if (lang === "bn" || lang === "banglish") {
      return VERIFIED_RESPONSES.skillsSummary.bn;
    }
    return VERIFIED_RESPONSES.skillsSummary.en;
  }

  // 5. PROJECTS & PORTFOLIO LINKS ("তারেকের প্রজেক্টের লিংক দাও", "projects", "portfolio")
  if (
    q.includes("project") ||
    q.includes("projects") ||
    q.includes("portfolio") ||
    q.includes("প্রজেক্ট") ||
    q.includes("পোর্টফোলিও") ||
    q.includes("কাজের লিংক") ||
    q.includes("লিংক দাও") ||
    q.includes("link") ||
    q.includes("ওয়েবসাইট লিঙ্ক") ||
    q.includes("পূর্বের কাজ") ||
    q.includes("কাজগুলো")
  ) {
    const rawProjects = cms?.projects || [];
    const liveProjects = rawProjects
      .filter((p) => p.title && p.liveUrl && p.liveUrl.startsWith("http"))
      .slice(0, 10);

    if (liveProjects.length > 0) {
      const list = liveProjects
        .map((p, i) => `${i + 1}. **${p.title}** — ${p.liveUrl}`)
        .join("\n");

      if (lang === "bn" || lang === "banglish") {
        return `তারেকের কিছু উল্লেখযোগ্য প্রজেক্ট নিচে দেওয়া হলো:\n\n${list}\n\nআপনি চাইলে আমি যেকোনো প্রজেক্ট সম্পর্কে সংক্ষেপে বিস্তারিতও জানাতে পারি।`;
      }
      return `Here are some of Tarek's verified projects:\n\n${list}\n\nFeel free to ask for more details about any specific project!`;
    }

    if (lang === "bn") {
      return "তারেকের বেশ কিছু আধুনিক লাইভ প্রজেক্ট পোর্টফোলিওতে রয়েছে (যেমন ই-কমার্স, কর্পোরেট ও বিজনেস ওয়েবসাইট)। আপনি সরাসরি পোর্টফোলিও সেকশন ঘুরে দেখতে পারেন বা তারেকের সঙ্গে যোগাযোগ করতে পারেন।";
    }
    return "Tarek has developed multiple live web applications and e-commerce stores available in his portfolio. Feel free to explore the portfolio section or contact Tarek directly.";
  }

  // 6. WHAT TAREK DOES / PROFESSION / IDENTITY ("Tarek কি কাজ করে?")
  if (
    q.includes("কি কাজ") ||
    q.includes("কাজ কি") ||
    q.includes("কাজ করে") ||
    q.includes("কাজ করেন") ||
    q.includes("ki kaj") ||
    q.includes("kaj ki") ||
    q.includes("kaj kore") ||
    q.includes("kaj koren") ||
    q.includes("what does tarek do") ||
    q.includes("what does he do") ||
    q.includes("profession") ||
    q.includes("পেশা") ||
    q.includes("who is tarek") ||
    q.includes("tell me about tarek") ||
    q.includes("about tarek") ||
    q.includes("তারেক সম্পর্কে") ||
    q.includes("তারেক কে") ||
    q.includes("তার পরিচয়")
  ) {
    if (lang === "bn" || lang === "banglish") {
      return VERIFIED_RESPONSES.whatTarekDoes.bn;
    }
    return VERIFIED_RESPONSES.whatTarekDoes.en;
  }

  // 7. CONTACT / PHONE / EMAIL
  if (
    q.includes("phone") ||
    q.includes("number") ||
    q.includes("contact") ||
    q.includes("email") ||
    q.includes("mail") ||
    q.includes("ইমেইল") ||
    q.includes("ইমেল") ||
    q.includes("ফোন") ||
    q.includes("নাম্বার") ||
    q.includes("মোবাইল") ||
    q.includes("যোগাযোগ") ||
    q.includes("কল") ||
    q.includes("jogajog") ||
    q.includes("nombor")
  ) {
    if (lang === "bn" || lang === "banglish") {
      return VERIFIED_RESPONSES.contact.bn;
    }
    return VERIFIED_RESPONSES.contact.en;
  }

  // 8. EDUCATION & UNIVERSITY ("তারেক কি পড়াশোনা করে?")
  if (
    q.includes("education") ||
    q.includes("study") ||
    q.includes("studying") ||
    q.includes("university") ||
    q.includes("college") ||
    q.includes("degree") ||
    q.includes("diu") ||
    q.includes("daffodil") ||
    q.includes("পড়াশোনা") ||
    q.includes("পড়াশুনা") ||
    q.includes("শিক্ষা") ||
    q.includes("ভার্সিটি") ||
    q.includes("বিশ্ববিদ্যালয়") ||
    q.includes("porashona")
  ) {
    if (lang === "bn" || lang === "banglish") {
      return VERIFIED_RESPONSES.education.bn;
    }
    return VERIFIED_RESPONSES.education.en;
  }

  // 9. SERVICES OFFERED
  if (
    q.includes("service") ||
    q.includes("services") ||
    q.includes("offer") ||
    q.includes("সার্ভিস") ||
    q.includes("সেবা") ||
    q.includes("website banate") ||
    q.includes("ওয়েবসাইট তৈরি") ||
    q.includes("ওয়েবসাইট বানাতে") ||
    q.includes("ওয়েবসাইট ডিজাইন") ||
    q.includes("landing page") ||
    q.includes("e-commerce") ||
    q.includes("ecommerce")
  ) {
    if (lang === "bn" || lang === "banglish") {
      return VERIFIED_RESPONSES.services.bn;
    }
    return VERIFIED_RESPONSES.services.en;
  }

  // 10. CASUAL WELL-BEING / HOW ARE YOU
  if (
    q.includes("kemon") ||
    q.includes("কেমন") ||
    q.includes("how are you") ||
    q.includes("valo") ||
    q.includes("ভালো")
  ) {
    if (lang === "bn" || lang === "banglish") {
      return "আমি আলহামদুলিল্লাহ ভালো আছি! আপনি কেমন আছেন? তারেক রহমানের পোর্টফোলিও বা ওয়েব ডেভেলপমেন্ট সার্ভিস সম্পর্কে কিছু জানতে চাইলে বলতে পারেন। 😊";
    }
    return "I'm doing well, thank you! How can I help you today? Feel free to ask me anything about Tarek Rahaman's work, services, or projects! 😊";
  }

  // 11. GRATITUDE / THANKS
  if (
    q.includes("thank") ||
    q.includes("ধন্যবাদ") ||
    q.includes("dhonnobad")
  ) {
    if (lang === "bn" || lang === "banglish") {
      return "আপনাকে অনেক ধন্যবাদ! যেকোনো প্রজেক্ট বা প্রয়োজনে নির্দ্বিধায় মেসেজ দিতে পারেন। শুভ দিন! 😊";
    }
    return "You're very welcome! Feel free to ask anytime or contact Tarek directly if you'd like to collaborate. Have a wonderful day! 😊";
  }

  // 12. FAVORITE COLOR
  if (
    q.includes("favorite color") ||
    q.includes("favourite color") ||
    q.includes("color") ||
    q.includes("colour") ||
    q.includes("রং") ||
    q.includes("রঙ")
  ) {
    if (lang === "bn" || lang === "banglish") return "তারেক রহমানের প্রিয় রং হলো কালো (Black)।";
    return "Tarek's favorite color is black.";
  }

  // 13. FAVORITE PROGRAMMING LANGUAGE
  if (
    (q.includes("favorite") || q.includes("favourite") || q.includes("প্রিয়") || q.includes("pochondo")) &&
    (q.includes("language") || q.includes("programming") || q.includes("ভাষা"))
  ) {
    if (lang === "bn" || lang === "banglish") return "তারেকের প্রিয় প্রোগ্রামিং ভাষা হলো Python।";
    return "Tarek's favorite programming language is Python.";
  }

  // 14. HOBBIES & CASUAL INTERESTS
  if (
    q.includes("hobby") ||
    q.includes("hobbies") ||
    q.includes("free time") ||
    q.includes("leisure") ||
    q.includes("শখ") ||
    q.includes("অবসর")
  ) {
    if (lang === "bn" || lang === "banglish") {
      return "তারেকের প্রিয় শখগুলোর মধ্যে রয়েছে কোডিং, ব্যাডমিন্টন ও ফুটবল খেলা, এবং পাহাড় ও সমুদ্র সৈকতে ভ্রমণ করা।";
    }
    return "Tarek's hobbies include coding, playing badminton and football, and traveling to mountains and sea beaches.";
  }

  // 15. MANGO GARDEN CONNECTION
  if (
    q.includes("mango") ||
    q.includes("আম") ||
    q.includes("বাগান")
  ) {
    if (lang === "bn" || lang === "banglish") {
      return "হ্যাঁ, তারেক রহমানের আম চাষের সাথে একটি ব্যক্তিগত সম্পর্ক রয়েছে এবং তিনি নিজের পারিবারিক আমের বাগান ও পরিচর্যা খুব পছন্দ করেন।";
    }
    return "Yes, Tarek has a personal connection with mango cultivation and genuinely enjoys his family mango garden.";
  }

  // 16. CAREER DREAMS & ASPIRATIONS
  if (
    q.includes("dream") ||
    q.includes("goal") ||
    q.includes("ambition") ||
    q.includes("স্বপ্ন") ||
    q.includes("লক্ষ্য")
  ) {
    if (lang === "bn" || lang === "banglish") {
      return "তারেকের লক্ষ্য হলো একজন দক্ষ সফটওয়্যার ইঞ্জিনিয়ার হওয়া, ভবিষ্যতে নিজের একটি টেক কোম্পানি গড়ে তোলা এবং গুগল বা মাইক্রোসফটের মতো শীর্ষ প্রতিষ্ঠানে কাজ করার স্বপ্ন দেখেন।";
    }
    return "Tarek's long-term goal is to become an accomplished Software Engineer, build his own tech company, and he dreams of working with global tech pioneers like Google or Microsoft in the future.";
  }

  // 17. CATCH-ALL / UNVERIFIED / UNKNOWN QUESTION
  // Strict rule: do not invent or guess. Politely refer to Tarek.
  if (lang === "bn" || lang === "banglish") {
    return VERIFIED_RESPONSES.unverified.bn;
  }
  return VERIFIED_RESPONSES.unverified.en;
}
