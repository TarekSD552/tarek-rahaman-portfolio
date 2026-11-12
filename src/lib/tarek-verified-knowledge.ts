/**
 * ============================================================================
 * TAREK RAHAMAN — CENTRAL VERIFIED KNOWLEDGE BASE
 * ============================================================================
 * 
 * The single, authoritative ground truth for Tarek AI Assistant.
 * Strictly adheres to all 18 master rules:
 * 1. Zero Hallucination: Never invent, guess, or assume unverified information.
 * 2. Verified Contact Info:
 *    - Email: tarekrahaman186@gmail.com (ONLY approved email)
 *    - Phones: 01733119269, 01840019449
 * 3. Blood Group: B Positive (B+) - only mention when specifically asked.
 * 4. Education: B.Sc. in Software Engineering at Daffodil International University (DIU).
 * 5. Real Project Links: Returns up to 8–10 real project links from the portfolio database.
 * 6. Language Matching: Proper Bangla script for Bengali queries, English for English.
 */

export const VERIFIED_CONTACT = {
  phones: ["01733119269", "01840019449"] as const,
  primaryPhone: "01733119269",
  secondaryPhone: "01840019449",
  email: "tarekrahaman186@gmail.com",
  location: "Mirpur-1, Dhaka, Bangladesh",
  whatsappUrl: "https://wa.me/8801733119269",
  linkedin: "https://www.linkedin.com/in/tarek-rahaman/",
  github: "https://github.com/TarekSD552",
  facebook: "https://www.facebook.com/tarak.rahoman.3",
};

export const VERIFIED_PROFILE = {
  fullName: "Tarek Rahaman",
  formalFullName: "Md Tarek Rahaman",
  preferredName: "Tarek",
  bloodGroup: "B Positive (B+)",
  roles: [
    "Full-Stack Web Developer",
    "Web Designer",
    "WordPress Developer",
    "Software Engineering Student",
    "Freelance Web Developer",
  ],
  education: {
    degree: "Bachelor of Science (BSc) in Software Engineering",
    institution: "Daffodil International University (DIU)",
    institutionShort: "DIU",
    location: "Dhaka, Bangladesh",
    timeline: "2022 – Present",
    interests: [
      "Data Science",
      "Python",
      "Machine Learning",
      "Artificial Intelligence",
      "Deep Learning",
      "Web Development",
    ],
    honestyNote: "Undergraduate student continuously learning and building practical web engineering projects.",
  },
  certification: {
    title: "NSDA National Skills Certificate Level-3",
    issuer: "National Skills Development Authority, Bangladesh",
    verified: true,
  },
  services: [
    "Professional Website Design",
    "Responsive Website Development",
    "Portfolio Website Development",
    "Business Website Development",
    "E-commerce Website Development",
    "Landing Page Development",
    "WordPress Website Development",
    "WordPress Customization",
    "WooCommerce Setup",
    "Website Redesign",
    "Website Maintenance",
    "Basic SEO-Friendly Website Setup",
    "Website Performance and User Experience Improvements",
  ],
  skills: {
    frontend: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Responsive Web Design",
      "Modern UI Design",
      "Basic React",
      "Next.js",
      "Tailwind CSS",
    ],
    webDevelopment: [
      "Website Design",
      "Website Development",
      "Landing Page Development",
      "Business Websites",
      "Portfolio Websites",
      "E-commerce Websites",
      "Website Redesign",
      "Website Maintenance",
    ],
    wordpress: [
      "WordPress Website Development",
      "WordPress Customization",
      "WooCommerce",
      "Theme Customization",
      "Basic Website Optimization",
    ],
    tools: [
      "Visual Studio Code",
      "Figma",
      "WordPress",
      "GitHub",
    ],
    futureLearning: [
      "Data Science",
      "Python",
      "Machine Learning",
      "Artificial Intelligence",
      "Deep Learning",
      "MERN Stack Development",
    ],
  },
  personalDetails: {
    bloodGroup: "B Positive (B+)",
    favoriteColor: "Black",
    favoriteLanguage: "Python",
    hobbies: ["Coding", "Badminton", "Football", "Traveling to mountains and sea beaches"],
    mangoGardenConnection: "Tarek has a personal connection with mango cultivation and enjoys his family mango garden.",
    careerAspirations: "Aspires to become an accomplished Software Engineer, dreams of working with global pioneers like Google or Microsoft in the future, and aims to build his own technology company.",
  },
};

/**
 * Standard Verified Responses for Common Intents
 */
export const VERIFIED_RESPONSES = {
  contact: {
    en: `You can contact Tarek at:\n📧 Email: tarekrahaman186@gmail.com\n📱 Phone: 01733119269 / 01840019449`,
    bn: `আপনি তারেকের সঙ্গে যোগাযোগ করতে পারেন:\n📧 Email: tarekrahaman186@gmail.com\n📱 Phone: 01733119269 / 01840019449`,
  },
  greeting: {
    en: "Hi! 👋 I'm Tarek AI Assistant. How can I help you today?",
    bn: "হাই! 👋 আমি Tarek AI Assistant। কী জানতে চান বলুন?",
  },
  languageCapability: {
    bn: "হ্যাঁ, অবশ্যই! আমি বাংলা এবং ইংরেজি—দুই ভাষাতেই কথা বলতে পারি। আপনি যে ভাষায় প্রশ্ন করবেন, আমি সেই ভাষায় উত্তর দেওয়ার চেষ্টা করব। 😊",
    en: "Yes, absolutely! I can speak and understand both Bangla and English fluently. Feel free to ask me anything in whichever language you prefer! 😊",
  },
  whatTarekDoes: {
    bn: "তারেক রহমান একজন Full-Stack Web Developer। তিনি আধুনিক, রেসপন্সিভ এবং ব্যবহারবান্ধব ওয়েবসাইট ও ওয়েব অ্যাপ্লিকেশন তৈরি করতে পারেন। তিনি Portfolio, Business, Landing Page, E-commerce এবং WordPress Website নিয়ে কাজ করেন।",
    en: "Tarek Rahaman is a Full-Stack Web Developer and Creative Web Developer. He builds modern, responsive, and user-friendly websites and web applications, including Portfolio, Business, Landing Pages, E-commerce, and WordPress websites.",
  },
  skillsSummary: {
    bn: "তারেক একজন Web Developer এবং Web Designer। তিনি HTML, CSS, JavaScript, Responsive Web Design, WordPress এবং WooCommerce নিয়ে কাজ করেন। তিনি আধুনিক Portfolio, Business, Landing Page এবং E-commerce Website তৈরি করতে পারেন।",
    en: "Tarek is a Web Developer and Web Designer. He works with HTML, CSS, JavaScript, Responsive Web Design, WordPress, and WooCommerce. He creates modern Portfolio, Business, Landing Page, and E-commerce websites.",
  },
  bloodGroup: {
    bn: "তারেকের Blood Group হলো B Positive (B+)।",
    en: "Tarek's blood group is B Positive (B+).",
  },
  education: {
    bn: "তারেক Daffodil International University (DIU)-তে Software Engineering নিয়ে পড়াশোনা করছেন।",
    en: "Tarek is studying Bachelor of Science (BSc) in Software Engineering at Daffodil International University (DIU).",
  },
  about: {
    en: "Tarek Rahaman is a Full-Stack Web Developer and a Software Engineering student at Daffodil International University (DIU). He specializes in modern responsive websites, custom WordPress, WooCommerce, and high-performance web applications.",
    bn: "তারেক রহমান একজন Full-Stack Web Developer এবং Daffodil International University (DIU)-এর সফটওয়্যার ইঞ্জিনিয়ারিং বিভাগের একজন শিক্ষার্থী। তিনি আধুনিক রেসপন্সিভ ওয়েবসাইট, ওয়ার্ডপ্রেস, উকমার্স ও ওয়েব অ্যাপ্লিকেশন তৈরিতে কাজ করেন।",
  },
  services: {
    en: "Tarek provides professional web development services including Website Design, Responsive Web Development, Portfolio Websites, Business Websites, E-commerce Stores (WooCommerce), Landing Pages, WordPress Customization, Website Redesign, and Website Maintenance.",
    bn: "তারেক বিভিন্ন ধরনের ওয়েব ডেভেলপমেন্ট সার্ভিস প্রদান করেন, যেমন: প্রফেশনাল ওয়েবসাইট ডিজাইন, রেসপন্সিভ ওয়েব ডেভেলপমেন্ট, পোর্টফোলিও ওয়েবসাইট, বিজনেস ওয়েবসাইট, ই-কমার্স ওয়েবসাইট (WooCommerce), ল্যান্ডিং পেজ, ওয়ার্ডপ্রেস ডেভেলপমেন্ট ও কাস্টমাইজেশন, ওয়েবসাইট রিডিজাইন এবং মেইনটেন্যান্স।",
  },
  unverified: {
    bn: "দুঃখিত, এই বিষয়টি সম্পর্কে আমার কাছে বর্তমানে নির্ভরযোগ্য তথ্য নেই। আপনি চাইলে তারেকের সঙ্গে সরাসরি যোগাযোগ করতে পারেন।",
    en: "I don't have verified information about that yet. Please contact Tarek directly for more details.",
  },
};
