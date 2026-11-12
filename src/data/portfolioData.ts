import {
  ProfileInfo,
  EducationItem,
  CertificationItem,
  ServiceItem,
  SkillCategory,
  ProjectItem,
  ProcessStep,
  TestimonialItem,
  StatItem,
  ClientBrand,
  CollagePhotoItem
} from "@/types/portfolio";

export const profileData: ProfileInfo = {
  name: "Tarek Rahaman",
  fullName: "Md Tarek Rahaman",
  titles: [
    "Full-Stack Web Developer",
    "Laravel Developer",
    "WordPress & WooCommerce Specialist",
    "Speed Optimization Expert",
    "Aspiring Machine Learning Engineer"
  ],
  shortBio:
    "I build modern, responsive and user-friendly websites & web applications. WordPress WooCommerce PHP Laravel Web Development.",
  fullBio:
    "I am studying Software Engineering at Daffodil International University with a major in Data Science. As a professional WordPress developer and e-commerce expert, I deliver products and services that are simple, elegant, and powerful — unleashing new value and revolutionizing digital presence for brands worldwide.",
  location: "Mirpur-1, Dhaka, Bangladesh",
  email: "tarekrahaman186@gmail.com",
  alternateEmail: "wde3716@gmail.com",
  phone: "01733119269",
  alternatePhone: "01840019449",
  whatsapp: "https://wa.me/8801733119269?text=Hi%20Tarek,%20I%20want%20to%20talk%20about%20a%20project.",
  messenger: "https://m.me/tarak.rahoman.3",
  cvUrl: "/assets/Tarek-Rahaman-Professional-CV-Resume.pdf",
  availableForHire: true,
  mainPortraitUrl: "/uploads/1793719116653-Untitled_design.png",
  heroPhotos: [
    {
      src: "/assets/profile-1-scaled.png",
      alt: "Tarek Rahaman - Full-Stack Web Developer",
      label: "Primary Hero Portrait",
      role: "Full-Stack Web Developer",
      description: "Tarek Rahaman at the development workstation building high-performance web systems and custom WordPress architectures.",
      rotation: "-5deg"
    },
    {
      src: "/assets/profile-1-scaled.png",
      alt: "Tarek Rahaman - Creative Web Developer",
      label: "Tarek Rahaman",
      role: "Creative Web Developer",
      description: "Md Tarek Rahaman — Full-Stack Web Developer & WordPress/WooCommerce Specialist.",
      rotation: "0deg"
    },
    {
      src: "/assets/1786250627196.jpg.jpeg",
      alt: "Tarek Rahaman - NSDA National Skills Certificate",
      label: "NSDA Certified",
      role: "Govt. Level-3 Certification",
      description: "National Skills Certificate in Web Design and Development for Freelancing (Level-3) by National Skills Development Authority (NSDA), Chief Adviser's Office, Bangladesh.",
      rotation: "5deg"
    }
  ],
  socialLinks: [
    {
      name: "Facebook",
      url: "https://www.facebook.com/tarak.rahoman.3",
      icon: "Facebook"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/tarek_rahman333?igsh=d3VnNWZ4bGN4MHEz",
      icon: "Instagram"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/tarek-rahaman-167396355?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      icon: "Linkedin"
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/8801733119269?text=Hi%20Tarek,%20I%20want%20to%20talk%20about%20a%20project.",
      icon: "MessageCircle"
    },
    {
      name: "GitHub",
      url: "https://github.com/TarekSD552",
      icon: "Github"
    }
  ]
};

export const heroSkillsBadges = [
  "Laravel",
  "WordPress",
  "WooCommerce",
  "PHP",
  "React",
  "HTML5/CSS3",
  "Elementor Pro"
];

export const educationData: EducationItem[] = [
  {
    institution: "Daffodil International University",
    degree: "B.Sc. in Software Engineering (Major in Data Science)",
    location: "Dhaka, Bangladesh",
    description:
      "Focused on advanced software architecture, database management, machine learning models, and modern full-stack web applications.",
    highlight: "Major in Data Science"
  },
  {
    institution: "Rajshahi Police Lines School and College",
    degree: "Higher Secondary Certificate (HSC)",
    location: "Rajshahi Division",
    description:
      "Successfully completed HSC with strong academic standing, specializing in Science and Mathematics.",
    highlight: "Science Division"
  },
  {
    institution: "Katipur Kalinagar High School",
    degree: "Secondary School Certificate (SSC)",
    location: "Sapahar, Naogaon",
    description:
      "Built rigorous foundation in physics, higher mathematics, algorithms, and logical problem-solving.",
    highlight: "Science Foundation"
  }
];

export const certificationsData: CertificationItem[] = [
  {
    title: "National Skills Development Authority (NSDA)",
    issuer: "Government of Bangladesh Verified Certification",
    description: "Industry-standard certification for professional web design and web application development."
  },
  {
    title: "WordPress & WooCommerce Architecture Expert",
    issuer: "Professional Development Program",
    description: "Advanced training in creating bespoke themes, custom checkout flows, and plugin architectures."
  },
  {
    title: "Frontend Engineering & Modern UI Architecture",
    issuer: "Advanced Web Technologies",
    description: "Specialized in HTML5, CSS3, modern JavaScript, Tailwind CSS, and performance optimization."
  }
];

export const futureVision = {
  title: "My Future Vision & Global Goals",
  statement:
    "As a dedicated Software Engineering student, my ultimate goal is to evolve into a world-class Machine Learning Engineer & Full-Stack Architect. I am deeply passionate about artificial intelligence, data science, and high-performance digital systems. Furthermore, I have a clear aspiration to build an international career and collaborate on global tech innovations.",
  focusAreas: [
    "Machine Learning & AI Integration",
    "High-Performance Full-Stack Systems",
    "Data Science & Predictive Modeling",
    "Global Enterprise Web Applications"
  ]
};

export const statsData: StatItem[] = [
  {
    label: "Happy Clients",
    value: 150,
    suffix: "+",
    description: "Satisfied international and local clients"
  },
  {
    label: "Projects Completed",
    value: 200,
    suffix: "+",
    description: "Commercial web solutions deployed successfully"
  },
  {
    label: "My Services",
    value: 5,
    suffix: "+",
    description: "Specialized digital development disciplines"
  },
  {
    label: "Company Connect us",
    value: 60,
    suffix: "+",
    description: "Organizations and partners collaborated with"
  }
];

export const servicesData: ServiceItem[] = [
  {
    number: "01",
    title: "Website Design & Development",
    shortDesc: "Create modern, fast and professional websites for your business.",
    fullDesc:
      "Bespoke websites designed to establish credibility, attract visitors, and drive real business growth with clean design and responsive mobile performance.",
    features: [
      "Modern & Responsive Design",
      "Mobile Friendly",
      "Fast & SEO Ready"
    ],
    icon: "WebsiteDesign",
    badge: "Web Design"
  },
  {
    number: "02",
    title: "E-Commerce Website Development",
    shortDesc: "Build a professional online store to sell your products easily.",
    fullDesc:
      "Complete e-commerce stores equipped with smooth product browsing, secure payment gateways, inventory management, and seamless customer checkout.",
    features: [
      "Online Store Setup",
      "Secure Payment System",
      "Easy Product Management"
    ],
    icon: "ECommerce",
    badge: "E-Commerce"
  },
  {
    number: "03",
    title: "Landing Page Design",
    shortDesc: "High-converting landing pages designed to grow your business.",
    fullDesc:
      "Persuasive, targeted landing pages engineered with clear call-to-actions, psychological structure, and rapid loading speeds to maximize conversion rates.",
    features: [
      "Modern UI Design",
      "Mobile Responsive",
      "Conversion Focused"
    ],
    icon: "LandingPage",
    badge: "Landing Page"
  },
  {
    number: "04",
    title: "Laravel Web Applications",
    shortDesc: "Custom, secure and powerful web applications built for your needs.",
    fullDesc:
      "Custom business portals, management software, and scalable backend platforms engineered for high reliability, clean data architecture, and top-tier security.",
    features: [
      "Custom Web Applications",
      "Secure & Fast Database",
      "High Performance & Scalable"
    ],
    icon: "Laravel",
    badge: "Laravel App"
  },
  {
    number: "05",
    title: "WordPress & WooCommerce",
    shortDesc: "Custom WordPress websites and online stores that are easy to manage.",
    fullDesc:
      "Custom-tailored WordPress themes and WooCommerce setups that give you full control of your content with intuitive admin dashboards and reliable speed.",
    features: [
      "Easy Content Management",
      "Custom Theme & Design",
      "Speed & Security Optimized"
    ],
    icon: "WordPress",
    badge: "WordPress"
  },
  {
    number: "06",
    title: "Custom Web Solutions",
    shortDesc: "Tailored web solutions and automation built for your unique business.",
    fullDesc:
      "Solving your exact business challenges with custom integrations, workflow automations, custom API connections, and specialized digital tools.",
    features: [
      "Tailored Business Solutions",
      "Third-Party Integrations",
      "Automated & Reliable Workflows"
    ],
    icon: "CustomSolution",
    badge: "Custom Solutions"
  }
];

export const skillCategoriesData: SkillCategory[] = [
  {
    category: "Coding & Programming Languages",
    description: "Core programming fundamentals, frontend engineering, and server-side systems",
    skills: [
      { name: "HTML", level: 95 },
      { name: "CSS", level: 92 },
      { name: "JavaScript", level: 85 },
      { name: "PHP", level: 88 },
      { name: "Laravel", level: 85 },
      { name: "React", level: 84 },
      { name: "Next.js", level: 80 },
      { name: "Tailwind CSS", level: 90 },
      { name: "MySQL", level: 92 },
      { name: "SQL / Database Management", level: 88 },
      { name: "Python", level: 82 },
      { name: "C Programming", level: 80 },
      { name: "Java", level: 78 },
      { name: "R Programming", level: 75 },
      { name: "Git", level: 88 }
    ]
  },
  {
    category: "Tools & Technologies",
    description: "Industry-standard development tools, workflows, design software, and platforms",
    skills: [
      { name: "VS Code", level: 95 },
      { name: "Git & GitHub", level: 88 },
      { name: "WordPress & Elementor", level: 95 },
      { name: "Figma", level: 82 },
      { name: "Postman", level: 80 },
      { name: "Tailwind CSS & React", level: 85 },
      { name: "Power BI", level: 78 },
      { name: "MySQL Workbench", level: 86 },
      { name: "XAMPP", level: 90 },
      { name: "Canva", level: 85 },
      { name: "Chrome DevTools", level: 88 },
      { name: "Terminal & CLI", level: 84 }
    ]
  }
];

export const projectsData: ProjectItem[] = [
  {
    id: "project-01-ecommerce-website",
    slug: "e-commerce-website-tereasnusuae",
    title: "E-Commerce Website",
    category: "ecommerce",
    categoryName: "E-Commerce",
    image: "/assets/Screenshot-2026-09-04-024440.png",
    liveUrl: "https://tereasnusuae.ae/",
    description:
      "Modern e-commerce platform tailored for seamless product catalog browsing, dynamic checkout, and multi-currency orders.",
    technologies: ["WooCommerce", "WordPress", "Multi-Currency", "Responsive"],
    featured: true
  },
  {
    id: "project-02-ruporia-fashion",
    slug: "ruporia-fashion-store",
    title: "Ruporia Fashion Store",
    category: "ecommerce",
    categoryName: "E-Commerce",
    image: "/assets/Screenshot-2026-08-28-003617.png",
    liveUrl: "https://ruporia.com/",
    description:
      "Sophisticated luxury fashion and jewelry boutique website featuring curated lookbooks and secure checkout.",
    technologies: ["WooCommerce", "WordPress", "Luxury UI Design", "Responsive"],
    featured: true
  },
  {
    id: "project-03-innovebd-business",
    slug: "innovebd-business-website",
    title: "InnoveBD Business Website",
    category: "business",
    categoryName: "Business & Agency",
    image: "/assets/Screenshot-2026-08-09-233147.png",
    liveUrl: "https://innovebd.com/",
    description:
      "Commercial IT hardware, surveillance, and enterprise security solutions portal with categorized catalog and quote inquiries.",
    technologies: ["Business Web", "WordPress", "Custom PHP", "MySQL"],
    featured: true
  },
  {
    id: "project-04-shikaku-japanese",
    slug: "shikaku-japanese-language-school",
    title: "Shikaku Japanese Language School",
    category: "education",
    categoryName: "Education",
    image: "/assets/Screenshot-2026-10-04-082353.png",
    liveUrl: "https://shikakujapanese.online/",
    description:
      "Specialized Japanese language learning and online curriculum platform with interactive courses and student evaluation.",
    technologies: ["Education Web App", "PHP", "MySQL", "JavaScript"],
    featured: true
  },
  {
    id: "project-05-education-results",
    slug: "education-results-platform",
    title: "Education Results Platform",
    category: "education",
    categoryName: "Education",
    image: "/assets/Screenshot-2026-09-04-024902.png",
    liveUrl: "https://educationresults.online/",
    description:
      "Centralized public educational result verification platform for instant lookup of scores, registration, and grade cards.",
    technologies: ["PHP", "MySQL", "Database Query Engine", "Responsive UI"],
    featured: true
  },
  {
    id: "project-06-student-exam",
    slug: "student-exam-management-system",
    title: "Student Exam Management System",
    category: "education",
    categoryName: "Education",
    image: "/assets/Screenshot-2026-08-13-191532.png",
    liveUrl: "https://student-exam.xyz/",
    description:
      "Automated examination and assessment portal providing real-time score grading, student accounts, and secure test sessions.",
    technologies: ["Web App", "PHP", "MySQL", "Bootstrap"],
    featured: true
  },
  {
    id: "project-07-jahed-hasan",
    slug: "jahed-hasan-portfolio",
    title: "Jahed Hasan Portfolio",
    category: "portfolio",
    categoryName: "Personal Portfolio",
    image: "/assets/Screenshot-2026-08-28-002156.png",
    liveUrl: "https://jahedhasan.com/",
    description:
      "Custom branded personal portfolio website designed for an SEO specialist, featuring rank proof graphs and case studies.",
    technologies: ["Personal Brand", "WordPress", "Custom Styles", "SEO Optimized"],
    featured: true
  },
  {
    id: "project-08-kahhar-ikram",
    slug: "kahhar-ikram-portfolio",
    title: "Kahhar Ikram Portfolio",
    category: "portfolio",
    categoryName: "Personal Portfolio",
    image: "/assets/Screenshot-2026-09-17-033900.png",
    liveUrl: "https://kahharikram.com/",
    description:
      "Clean, modern personal portfolio website crafted for an SEO professional to showcase client case studies and consultation booking.",
    technologies: ["WordPress", "Modern Layout", "Performance Tuned", "Mobile First"],
    featured: true
  },
  {
    id: "project-09-bangla-business",
    slug: "bangla-business-website",
    title: "বাংলা Business Website",
    category: "business",
    categoryName: "Business & Agency",
    image: "/assets/screencapture-xn-44b5b2aq8a5a8gk2k-2026-10-04-08_26_05-scaled.png",
    liveUrl: "https://xn--44b5b2aq8a5a8gk2k.com/",
    description:
      "Laser-targeted business landing page with localized Bengali typography, instant lead capture, and high conversion rate.",
    technologies: ["Landing Page", "Bengali UI", "High Speed", "WordPress"],
    featured: true
  },
  {
    id: "project-10-mango-store",
    slug: "naogaon-mango-bazar-ecommerce",
    title: "Naogaon Mango Bazar",
    category: "ecommerce",
    categoryName: "E-Commerce",
    image: "/assets/Screenshot-2026-08-09-004651.png",
    liveUrl: "https://naogaonmangobazar.com/",
    description:
      "Specialized organic mango e-commerce platform built for seasonal wholesale and retail commerce with dynamic order calculation.",
    technologies: ["WordPress", "WooCommerce", "Custom CSS", "Payment Gateway"],
    featured: false
  },
  {
    id: "project-11-fashion-store",
    slug: "china-city-fashion-store",
    title: "China City Fashion",
    category: "ecommerce",
    categoryName: "E-Commerce",
    image: "/assets/Screenshot-2026-08-22-213330.png",
    liveUrl: "https://chinacityfashion.com/",
    description:
      "High-end fashion retail online store with multi-category product filters, responsive lookbooks, and seamless payment integration.",
    technologies: ["WooCommerce", "WordPress", "JavaScript", "Elementor Pro"],
    featured: false
  },
  {
    id: "project-12-corporate-agency",
    slug: "corporate-business-agency-consulting",
    title: "Corporate Business Agency",
    category: "business",
    categoryName: "Business & Agency",
    image: "/assets/photo-1460925895917-afdab827c52f",
    liveUrl: "https://tarekrahaman.com/contact",
    description:
      "Premium corporate agency web presence with strategic case studies, modern lead-generation touchpoints, and executive branding.",
    technologies: ["Corporate Design", "WordPress", "Responsive Grid"],
    featured: false
  },
  {
    id: "project-13-digital-marketing",
    slug: "digital-marketing-agency-solutions",
    title: "Digital Marketing Agency",
    category: "business",
    categoryName: "Business & Agency",
    image: "/assets/photo-1507679799987-c73779587ccf",
    liveUrl: "https://tarekrahaman.com/contact",
    description:
      "Dynamic digital agency web layout highlighting campaign analytics, service suites, case study metrics, and client engagement tools.",
    technologies: ["Agency Layout", "UI/UX", "Interactive Elements"],
    featured: false
  }
];

export const processStepsData: ProcessStep[] = [
  {
    step: "01",
    title: "Requirement Analysis",
    description:
      "We deeply understand client needs first, conducting a thorough assessment before initiating any development workflow.",
    icon: "Compass"
  },
  {
    step: "02",
    title: "Achievement Goals",
    description:
      "Every project is strategically structured keeping your core business objectives and targeted success milestones in focus.",
    icon: "Target"
  },
  {
    step: "03",
    title: "Service / Product Development",
    description:
      "Following comprehensive planning, our expert team implements cutting-edge coding to build your digital product.",
    icon: "Code2"
  },
  {
    step: "04",
    title: "Service / Product Testing",
    description:
      "We rigorously examine and test every functionality to ensure a seamless, bug-free, and flawless performance.",
    icon: "CheckCircle2"
  },
  {
    step: "05",
    title: "High Quality Services",
    description:
      "We are uncompromised in maintaining top-tier industry standards to guarantee premium quality across all deliverables.",
    icon: "Award"
  },
  {
    step: "06",
    title: "Right Time Delivery",
    description:
      "We highly value your schedule, committing to deliver your project punctually within the agreed timeframe.",
    icon: "Clock"
  }
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: "1",
    name: "Henson Harnandez",
    role: "Chief Executive",
    quote:
      "I entrusted Tarek with redesigning my WordPress blog, and he did a phenomenal job. His expertise in WordPress customization and plugins was evident in every aspect of the project. I highly recommend his services.",
    avatar: "/assets/avatar-1.jpg",
    rating: 5
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    role: "Store Owner",
    quote:
      "Tarek's work on our e-commerce store was outstanding. The design is sleek, incredibly fast, and converted visitors into buyers instantly. Truly professional developer!",
    avatar: "/assets/avatar-2.jpg",
    rating: 5
  },
  {
    id: "3",
    name: "David Warner",
    role: "Managing Director",
    quote:
      "An absolute pleasure to work with! Tarek delivered our corporate business website ahead of schedule with zero bugs. Excellent communication and design skills.",
    avatar: "/assets/avatar-3.jpg",
    rating: 5
  },
  {
    id: "4",
    name: "Emily Rose",
    role: "Marketing Head",
    quote:
      "The landing page Tarek built for our marketing campaign had a massive conversion boost. Clean code and beautiful visual hierarchy. Will definitely hire again!",
    avatar: "/assets/avatar-4.jpg",
    rating: 5
  },
  {
    id: "5",
    name: "Michael Scott",
    role: "Tech Entrepreneur",
    quote:
      "Finding someone who understands both Elementor and custom CSS optimization is rare. Tarek nailed it completely and our site speed is now top-tier.",
    avatar: "/assets/avatar-5.jpg",
    rating: 5
  },
  {
    id: "6",
    name: "Jessica Taylor",
    role: "Operations Lead",
    quote:
      "His ongoing website maintenance and support have been a lifesaver for our platform. Always responsive, reliable, and exceptionally skilled.",
    avatar: "/assets/avatar-6.jpg",
    rating: 5
  }
];

export const clientBrandsData: ClientBrand[] = [
  { name: "Naogaon Mango Bazar", label: "Naogaon Mango Bazar", industry: "E-Commerce Fruit Hub", iconName: "Mango", showName: true, fitMode: "contain", active: true },
  { name: "Ruporia Jewelry", label: "Ruporia Jewelry", industry: "Luxury Jewelry E-Commerce", iconName: "Gem", showName: true, fitMode: "contain", active: true },
  { name: "Desert Sands UAE", label: "Desert Sands UAE", industry: "Enterprise Hospitality", iconName: "Hotel", showName: true, fitMode: "contain", active: true },
  { name: "Suns Luxury Group", label: "Suns Luxury Group", industry: "Fashion Retail", iconName: "Crown", showName: true, fitMode: "contain", active: true },
  { name: "Apex Learning Studio", label: "Apex Learning Studio", industry: "EdTech Solutions", iconName: "GraduationCap", showName: true, fitMode: "contain", active: true },
  { name: "Nordic Tech Stack", label: "Nordic Tech Stack", industry: "SaaS Platform", iconName: "Code2", showName: true, fitMode: "contain", active: true }
];

export const collagePhotosData: CollagePhotoItem[] = [
  {
    id: "collage-photo-1",
    src: "/assets/WhatsApp-Image-2026-08-06-at-4.49.13-PM.jpeg",
    alt: "Tarek Rahaman at Developer Workstation Lab",
    badge: "WORKSTATION",
    title: "Engineering Lab",
    subtitle: "High-Performance Web Architecture",
    description: "Tarek Rahaman at the development workstation designing clean Laravel systems, custom APIs, and high-performance WooCommerce architectures.",
    rotation: -3.5,
    desktopPos: {
      left: "1%",
      top: "36px",
      width: "23.5%",
      zIndex: 15,
      aspectRatio: "aspect-[4/5]"
    }
  },
  {
    id: "collage-photo-2",
    src: "/assets/photo-1531482615713-2afd69097998",
    alt: "Tech Collaboration & Engineering Sprints",
    badge: "COLLABORATION",
    title: "Agile Sprints",
    subtitle: "Team Synergies & Solutions",
    description: "Collaborative design sprints and peer reviews ensuring every web solution is battle-tested, secure, and user-centric.",
    rotation: 2.2,
    desktopPos: {
      left: "19.5%",
      top: "66px",
      width: "23%",
      zIndex: 20,
      aspectRatio: "aspect-[4/5]"
    }
  },
  {
    id: "collage-photo-3",
    src: "/assets/profile-1-scaled.png",
    alt: "Md Tarek Rahaman - Full-Stack Web Developer",
    badge: "MAIN FOCAL PORTRAIT",
    title: "Md Tarek Rahaman",
    subtitle: "Full-Stack Web Developer",
    description: "Creative Full-Stack Web Developer specializing in Laravel web applications, WordPress/WooCommerce, and high-converting modern digital interfaces.",
    rotation: 0,
    desktopPos: {
      left: "37%",
      top: "10px",
      width: "26%",
      zIndex: 30,
      aspectRatio: "aspect-[4/5]"
    }
  },
  {
    id: "collage-photo-4",
    src: "/assets/1786250627196.jpg.jpeg",
    alt: "NSDA National Skills Certificate Level-3",
    badge: "CERTIFICATION",
    title: "NSDA Level-3 Certified",
    subtitle: "Govt. Skills Authority Recognition",
    description: "Govt. Level-3 National Skills Certificate in Web Design & Development for Freelancing by National Skills Development Authority (NSDA), Chief Adviser's Office.",
    rotation: -2.2,
    desktopPos: {
      left: "57.5%",
      top: "44px",
      width: "23%",
      zIndex: 20,
      aspectRatio: "aspect-[4/5]"
    }
  },
  {
    id: "collage-photo-5",
    src: "/assets/photo-1507679799987-c73779587ccf",
    alt: "Client Tech Presentation & Strategy",
    badge: "STRATEGY",
    title: "Strategic Impact",
    subtitle: "Client Delivery & Tech Leadership",
    description: "Aligning deep technical precision with business goals to deliver robust digital platforms that convert and scale seamlessly.",
    rotation: 3.5,
    desktopPos: {
      left: "75.5%",
      top: "66px",
      width: "23.5%",
      zIndex: 15,
      aspectRatio: "aspect-[4/5]"
    }
  }
];

