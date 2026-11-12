export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  active?: boolean;
  order?: number;
}

export interface HeroPhoto {
  id?: string;
  src: string;
  alt: string;
  label: string;
  rotation: string;
  role?: string;
  description?: string;
  visible?: boolean;
  position?: "left" | "center" | "right" | string;
}

export interface AboutGalleryItem {
  id?: string;
  src: string;
  alt?: string;
  label?: string;
  title?: string;
  description?: string;
  visible?: boolean;
  link?: string;
}

export interface AboutBioBadge {
  id?: string;
  label: string;
  icon?: string;
  value?: string;
  subtitle?: string;
  visible?: boolean;
}

export interface AboutBioParagraph {
  id: string;
  text: string;
  visible?: boolean;
}

export interface AboutBioSection {
  badge: string;
  badgeIcon?: string;
  showBadge?: boolean;
  headingPrefix: string;
  highlightedText: string;
  headingSuffix: string;
  highlightStyle?: "cyan" | "purple" | "gradient" | "emerald";
  firstParagraph: string;
  secondParagraph: string;
  additionalParagraphs?: AboutBioParagraph[];
  badges: AboutBioBadge[];
  visible?: boolean;
}

export interface AboutHeroBadge {
  text: string;
  icon?: string;
  visible?: boolean;
}

export interface AboutHeroHeading {
  prefix: string;
  highlight1: string;
  highlight2?: string;
  suffix?: string;
  highlightStyle?: "cyan" | "purple" | "gradient" | "emerald";
}

export interface AboutHeroParagraph {
  id: string;
  text: string;
  visible?: boolean;
}

export interface AboutHeroTechBadge {
  id: string;
  label: string;
  icon?: string;
  link?: string;
  visible?: boolean;
}

export interface AboutHeroStat {
  id: string;
  value: string;
  label: string;
  suffix?: string;
  icon?: string;
  visible?: boolean;
}

export interface AboutHeroButton {
  id: string;
  text: string;
  url: string;
  icon?: string;
  isDownload?: boolean;
  downloadName?: string;
  openInNewTab?: boolean;
  visible?: boolean;
}

export interface AboutHeroSettings {
  visible?: boolean;
  badge: AboutHeroBadge;
  heading: AboutHeroHeading;
  paragraphs: AboutHeroParagraph[];
  techBadges: AboutHeroTechBadge[];
  stats: AboutHeroStat[];
  buttons: AboutHeroButton[];
  orbitEffectsVisible?: boolean;
}

export interface AboutProfileCardSettings {
  visible?: boolean;
  imageUrl?: string;
  altText?: string;
  verifiedBadgeText?: string;
  verifiedBadgeIcon?: string;
  showVerifiedBadge?: boolean;
  eyebrowText?: string;
  title?: string;
  location?: string;
  locationIcon?: string;
}

export interface AboutSectionVisibility {
  hero?: boolean;
  profileGrid?: boolean;
  profileCard?: boolean;
  gallery?: boolean;
  bioStory?: boolean;
  process?: boolean;
  techStack?: boolean;
  education?: boolean;
  certifications?: boolean;
  vision?: boolean;
  cta?: boolean;
  stats?: boolean;
}

export interface AboutStatsSectionSettings {
  visible?: boolean;
  badge?: string;
  title?: string;
  highlightText?: string;
  description?: string;
}

export interface ProfileInfo {
  name: string;
  fullName: string;
  titles: string[];
  shortBio: string;
  fullBio: string;
  location: string;
  email: string;
  alternateEmail: string;
  phone: string;
  alternatePhone: string;
  whatsapp: string;
  messenger: string;
  cvUrl: string;
  availableForHire: boolean;
  mainPortraitUrl?: string;
  portraitUrl?: string;
  heroPhotos: HeroPhoto[];
  socialLinks: SocialLink[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period?: string;
  description: string;
  location: string;
  highlight?: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  description: string;
  credentialUrl?: string;
  badgeUrl?: string;
  date?: string;
}

export interface ServiceItem {
  id?: string;
  number?: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  icon: string;
  badge?: string;
  featured?: boolean;
  popular?: boolean;
  tags?: string[];
  techStack?: string[];
  order?: number;
  visible?: boolean;
  active?: boolean;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  openInNewTab?: boolean;
}

export interface SkillItem {
  id?: string;
  name: string;
  level: number;
  icon?: string;
  imageUrl?: string;
  proficiencyLabel?: string;
  description?: string;
  highlight?: boolean;
  enabled?: boolean;
}

export interface SkillCategory {
  category: string;
  description?: string;
  skills: SkillItem[];
}

export type ProjectCategory =
  | "all"
  | "ecommerce"
  | "business"
  | "education"
  | "sales"
  | "portfolio"
  | string;

export interface ProjectItem {
  id: string;
  slug?: string;
  title: string;
  category: ProjectCategory;
  categoryName?: string;
  image: string;
  imageAlt?: string;
  liveUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  description: string;
  fullDesc?: string;
  completionDate?: string;
  client?: string;
  clientName?: string;
  technologies: string[];
  gallery?: string[];
  screenshots?: string[];
  demoVideo?: string;
  featured?: boolean;
  homeFeatured?: boolean;
  active?: boolean;
  enabled?: boolean;
  order?: number;
  buttonText?: string;
  buttonIcon?: string;
  badgeText?: string;
  badgeColor?: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  icon?: string;
  phase?: string;
  time?: string;
  details?: string;
  accent?: string;
  active?: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company?: string;
  quote: string;
  avatar: string;
  rating: number;
}

export interface StatItem {
  label: string;
  value: number;
  suffix: string;
  description: string;
}

export interface ClientBrand {
  name: string;
  label: string;
  industry: string;
  iconName: string;
  logoUrl?: string;
  logoAlt?: string;
  logoSize?: 'sm' | 'md' | 'lg';
  fitMode?: 'contain' | 'cover';
  showName?: boolean;
  showIndustry?: boolean;
  active?: boolean;
  websiteUrl?: string;
}

export interface CollagePhotoItem {
  id: string;
  src: string;
  alt: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  rotation: number;
  desktopPos: {
    left: string;
    top: string;
    width: string;
    zIndex: number;
    aspectRatio: string;
  };
}

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDesc: string;
  keywords?: string;
  ogImage?: string;
  enabled?: boolean;
  isPublished?: boolean;
  order?: number;
}

export interface CmsSection {
  id: string;
  key: string;
  name: string;
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  enabled: boolean;
  order: number;
  buttonText?: string;
  buttonLink?: string;
}

export interface CmsNavItem {
  id?: string;
  name: string;
  href: string;
  order: number;
  enabled: boolean;
}

export interface CmsMediaItem {
  id: string;
  name: string;
  url: string;
  size?: string | number;
  type?: string;
  mimeType?: string;
  category?: string;
  uploadedAt: string;
}

export interface CmsHero {
  greeting: string;
  name: string;
  mainTitle: string;
  subTitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  portraitUrl?: string;
  animatedPhrases?: string[];
  badgeText?: string;
  badgeIcon?: string;
  showBadge?: boolean;
  nameHighlight?: string;
  titleHighlight?: string;
  titleHighlightStyle?: "cyan" | "purple" | "emerald" | "gradient";
  primaryButtonIcon?: string;
  primaryButtonDownload?: boolean;
  primaryButtonNewTab?: boolean;
  primaryButtonVisible?: boolean;
  secondaryButtonIcon?: string;
  secondaryButtonNewTab?: boolean;
  secondaryButtonVisible?: boolean;
  cloudBgUrl?: string;
  showClouds?: boolean;
  cloudOpacity?: number;
  showLightBeam?: boolean;
  availabilityText?: string;
  showAvailability?: boolean;
  portraitAlt?: string;
  portraitMaxHeight?: number;
  statusText?: string;
}

export interface HomeJourneyHeader {
  badge?: string;
  badgeIcon?: string;
  headingLine1?: string;
  headingLine2?: string;
  headingStyle?: "cyan" | "purple" | "emerald" | "gradient";
  description?: string;
  showSmileArc?: boolean;
}

export interface HomeSectionHeader {
  badge?: string;
  badgeIcon?: string;
  title?: string;
  highlightText?: string;
  subtitle?: string;
  description?: string;
  visible?: boolean;
}

export interface HomePortfolioStat {
  id: string;
  value: string;
  label: string;
  icon?: string;
  visible?: boolean;
}

export interface HomePortfolioSettings {
  badge?: string;
  badgeNumber?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonIcon?: string;
  stats?: HomePortfolioStat[];
}

export interface HomeAboutBadge {
  id: string;
  label: string;
  visible?: boolean;
}

export interface HomeAboutStat {
  id: string;
  value: string;
  label: string;
  icon?: string;
  colorTheme?: "cyan" | "purple" | "emerald";
  visible?: boolean;
}

export interface HomeAboutSettings {
  badge?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  name?: string;
  role?: string;
  workstationImage?: string;
  workstationAlt?: string;
  certificateImage?: string;
  certificateAlt?: string;
  portraitImage?: string;
  portraitAlt?: string;
  techBadges?: HomeAboutBadge[];
  stats?: HomeAboutStat[];
}

export interface HomeGlobeCountry {
  id: string;
  name: string;
  badgeColor?: string;
  visible?: boolean;
}

export interface HomeStatsSettings {
  badge?: string;
  title?: string;
  highlightText?: string;
  description?: string;
  globeTitle?: string;
  globeDeploymentMetric?: string;
  globeCountries?: HomeGlobeCountry[];
  visible?: boolean;
}

export interface HomeCtaSettings {
  badge?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  bgImageUrl?: string;
  showMountainContour?: boolean;
  codePillText?: string;
  showCodePill?: boolean;
  monogramText?: string;
  showMonogram?: boolean;
  metricPillText?: string;
  metricPillValue?: string;
  showMetricPill?: boolean;
  visible?: boolean;
}

export interface HomeThemeSettings {
  primaryAccent?: string;
  secondaryAccent?: string;
  enable3dBackground?: boolean;
  enableWaveDividers?: boolean;
}

export interface CmsSiteSettings {
  websiteName: string;
  tagline: string;
  logoText: string;
  logoUrl?: string;
  adminLogoUrl?: string;
  favicon?: string;
  faviconUrl: string;
  defaultSeoTitle: string;
  defaultSeoDesc: string;
  copyrightText: string;
  copyrightYear?: string;
  cvUrl?: string;
  footerText?: string;
  availableForHire: boolean;
}

export interface FutureVision {
  title?: string;
  heading?: string;
  subtitle?: string;
  statement?: string;
  description?: string;
  badge?: string;
  focusAreas?: string[];
  tags?: string[];
  quote?: string;
  quoteAuthor?: string;
}

export interface FaqItem {
  id?: string;
  number?: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  visible?: boolean;
}

export interface WhyWorkWithMeCard {
  id?: string;
  number?: string;
  badge: string;
  title: string;
  description: string;
  metric?: string;
  icon?: string;
  gradient?: string;
  link?: string;
  enabled?: boolean;
}

export interface ServicesWhyWorkWithMe {
  badge?: string;
  badgeIcon?: string;
  title?: string;
  heading?: string;
  subtitle?: string;
  highlightText?: string;
  description?: string;
  cards: WhyWorkWithMeCard[];
}

export interface ServicesHero {
  badge: string;
  badgeIcon?: string;
  showBadge?: boolean;
  title?: string;
  heading?: string;
  subtitle?: string;
  highlightText?: string;
  description: string;
  featureTags: string[];
}

export interface ServicesCta {
  badge: string;
  badgeIcon?: string;
  title?: string;
  heading?: string;
  subtitle?: string;
  description: string;
  bgImageUrl?: string;
  primaryButtonText?: string;
  primaryBtn?: string;
  primaryButtonUrl?: string;
  primaryButtonLink?: string;
  primaryLink?: string;
  primaryButtonVisible?: boolean;
  secondaryButtonText?: string;
  secondaryBtn?: string;
  secondaryButtonUrl?: string;
  secondaryButtonLink?: string;
  secondaryLink?: string;
  secondaryButtonVisible?: boolean;
}

export interface AboutCta {
  badge: string;
  title: string;
  subtitle?: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl?: string;
  primaryButtonLink?: string;
  secondaryButtonText: string;
  secondaryButtonUrl?: string;
  secondaryButtonLink?: string;
}

export interface ServicesTechItem {
  name: string;
  brand?: string;
  category: string;
  badge?: string;
  icon?: string;
  iconUrl?: string;
  customUrl?: string;
  level?: string;
  enabled?: boolean;
}

export interface ServicesWorkflowHeader {
  badge?: string;
  badgeIcon?: string;
  title?: string;
  highlightText?: string;
  description?: string;
}

export interface ServicesTechHeader {
  badge?: string;
  badgeIcon?: string;
  title?: string;
  highlightText?: string;
  description?: string;
}

export interface ServicesFaqHeader {
  badge?: string;
  badgeIcon?: string;
  title?: string;
  highlightText?: string;
  description?: string;
}

export interface ServicesSeoSettings {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  twitterImageUrl?: string;
}

export interface ServicesDesignSettings {
  show3dBackground?: boolean;
  showWaveDividers?: boolean;
  enableAnimations?: boolean;
  primaryAccentColor?: string;
  secondaryAccentColor?: string;
  sectionOrder?: string[];
  sectionVisibility?: {
    hero?: boolean;
    services?: boolean;
    whyUs?: boolean;
    process?: boolean;
    tech?: boolean;
    faq?: boolean;
    cta?: boolean;
    footer?: boolean;
  };
}

export interface CmsContactInfo {
  email: string;
  alternateEmail: string;
  phone: string;
  alternatePhone: string;
  whatsapp: string;
  messenger: string;
  location: string;
  workingHours?: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  github: string;
  youtube?: string;
}

export interface SkillsHeroTag {
  id?: string;
  name?: string;
  text?: string;
  icon?: string;
  enabled?: boolean;
}

export interface SkillsHeroStat {
  id?: string;
  icon?: string;
  number: string;
  suffix?: string;
  label: string;
  description?: string;
  enabled?: boolean;
}

export interface SkillsHeroVisualCard {
  id?: string;
  name: string;
  level: number;
  logoName?: string;
  imageUrl?: string;
  isCenter?: boolean;
  enabled?: boolean;
}

export interface SkillsHeroSettings {
  badge?: string;
  badgeIcon?: string;
  showBadge?: boolean;
  title?: string;
  titleHighlight1?: string;
  titleHighlight2?: string;
  description?: string;
  tags?: SkillsHeroTag[];
  stats?: SkillsHeroStat[];
  visualCards?: SkillsHeroVisualCard[];
  visible?: boolean;
}

export interface SkillsCodingHeader {
  badge?: string;
  badgeIcon?: string;
  title?: string;
  highlightText?: string;
  description?: string;
  visible?: boolean;
}

export interface SkillsCoreExpertiseItem {
  id?: string;
  number: string;
  title: string;
  badge: string;
  icon?: string;
  imageUrl?: string;
  highlights: string[];
  link?: string;
  enabled?: boolean;
}

export interface SkillsLearningItem {
  id?: string;
  icon?: string;
  imageUrl?: string;
  emoji?: string;
  title: string;
  description: string;
  status: string;
  tag: string;
  footerLabel?: string;
  progressText?: string;
  gradient?: string;
  enabled?: boolean;
}

export interface SkillsRoadmapItem {
  id?: string;
  year: string;
  title: string;
  badge: string;
  techList: string[];
  description: string;
  icon?: string;
  isCurrent?: boolean;
  isFuture?: boolean;
  enabled?: boolean;
}

export interface SkillsSeoSettings {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
  twitterImageUrl?: string;
}

export interface SkillsDesignSettings {
  show3dBackground?: boolean;
  showAmbientGlow?: boolean;
  showWaveDividers?: boolean;
  enableAnimations?: boolean;
  primaryAccent?: string;
  primaryAccentColor?: string;
  secondaryAccent?: string;
  secondaryAccentColor?: string;
  sectionOrder?: string[];
  sectionVisibility?: {
    hero?: boolean;
    coding?: boolean;
    tools?: boolean;
    strengths?: boolean;
    learning?: boolean;
    roadmap?: boolean;
    [key: string]: boolean | undefined;
  };
  [key: string]: any;
}

export interface ProjectCategoryItem {
  id?: string;
  label: string;
  value: string;
  description?: string;
  icon?: string;
  enabled?: boolean;
  order?: number;
}

export interface PortfolioHeroTag {
  id?: string;
  text: string;
  icon?: string;
  enabled?: boolean;
}

export interface PortfolioHeroStat {
  id?: string;
  number: string;
  label: string;
  icon?: string;
  enabled?: boolean;
}

export interface PortfolioHeroFeatured {
  title?: string;
  category?: string;
  liveUrl?: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  badge?: string;
  lockText?: string;
  enabled?: boolean;
}

export interface PortfolioPageSettings {
  // 1. Hero Section
  heroBadge?: string;
  heroBadgeIcon?: string;
  heroHeading?: string;
  heroHeadingHighlight1?: string;
  heroHeadingHighlight2?: string;
  heroHeadingLineBreak?: boolean;
  heroSubtitle?: string;
  heroDescription?: string;
  heroTags?: PortfolioHeroTag[];
  heroStats?: PortfolioHeroStat[];
  heroFeatured?: PortfolioHeroFeatured;

  // 2. Search & Filters
  searchPlaceholder?: string;
  searchIcon?: string;
  searchEnabled?: boolean;
  activeFilterLabel?: string;

  // 3. Load More Settings
  loadMoreButtonText?: string;
  loadMoreRemainingTemplate?: string;
  loadMoreButtonIcon?: string;
  initialProjectsCount?: number;
  projectsPerPage?: number;
  loadMoreEnabled?: boolean;

  // 4. Section Visibility
  showHero?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  showProjectGrid?: boolean;
  showLoadMore?: boolean;
  showWaveDividers?: boolean;
  showAmbientGlow?: boolean;

  // 5. Design & Theme
  accentColor?: string;
  cardAccent?: string;

  // 6. SEO & Social Graph
  title?: string;
  description?: string;
  seoTitle?: string;
  seoDesc?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;

  // Backwards compatibility
  featuredTags?: string[];
  [key: string]: any;
}

export interface ContactHeroSettings {
  badge: string;
  badgeIcon?: string;
  heading: string;
  headingHighlight1?: string;
  headingHighlight2?: string;
  headingLineBreak?: boolean;
  highlightedWords?: string;
  description: string;
  backgroundUrl?: string;
  backgroundAlt?: string;
  backgroundOverlay?: boolean;
  backgroundOverlayStrength?: number;
  showMountainRidge?: boolean;
  showNeonGlowLine?: boolean;
  showAmbientGlow?: boolean;
  availabilityText?: string;
  quickChannelsTitle?: string;
}

export interface QuickContactChannelItem {
  id: string;
  label: string;
  icon?: string;
  value: string;
  link?: string;
  colorClass?: string;
  order?: number;
  enabled?: boolean;
}

export interface ContactAvailabilityBadge {
  id: string;
  text: string;
  icon?: string;
  link?: string;
  accentStyle?: "emerald" | "cyan" | "purple" | "amber" | "blue";
  showPing?: boolean;
  order?: number;
  enabled?: boolean;
}

export interface DirectReachHeader {
  badge?: string;
  heading?: string;
  description?: string;
}

export interface DirectContactCardItem {
  id: string;
  icon?: string;
  badge?: string;
  badgeColor?: string;
  value: string;
  secondaryInfo?: string;
  link?: string;
  isLink?: boolean;
  order?: number;
  enabled?: boolean;
}

export interface OfficeWorkingHoursSettings {
  officeLocation?: string;
  locationIcon?: string;
  locationUrl?: string;
  workingHours?: string;
  workingHoursIcon?: string;
  additionalOfficeInfo?: string;
  enabled?: boolean;
}

export interface ContactFormFieldItem {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required: boolean;
  halfWidth?: boolean;
  enabled: boolean;
  order: number;
}

export interface ContactFormFieldLabel {
  nameLabel?: string;
  emailLabel?: string;
  phoneLabel?: string;
  subjectLabel?: string;
  messageLabel?: string;
}

export interface ContactFormSettings {
  heading: string;
  description: string;
  recipientEmail?: string;
  submitButtonText?: string;
  submitButtonIcon?: string;
  submittingText?: string;
  successHeading?: string;
  successMessage?: string;
  resetButtonText?: string;
  errorMessage?: string;
  fields?: ContactFormFieldItem[];
  fieldLabels?: ContactFormFieldLabel;
}

export interface ResumeSettings {
  title: string;
  description: string;
  fileUrl: string;
  buttonLabel: string;
  buttonIcon?: string;
  downloadFileName?: string;
  enabled?: boolean;
}

export interface ContactVisibilitySettings {
  showHero?: boolean;
  showQuickChannels?: boolean;
  showAvailabilityBadges?: boolean;
  showDirectReach?: boolean;
  showContactForm?: boolean;
  showOfficeHours?: boolean;
  showResumeCard?: boolean;
  showWaveDivider?: boolean;
  showMountainRidge?: boolean;
  showNeonGlowLine?: boolean;
  showAmbientGlow?: boolean;
  accentColor?: string;
}

export interface ContactSeoSettings {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export interface FooterLinkItem {
  name: string;
  href: string;
  enabled?: boolean;
}

export interface FooterSettings {
  logoText?: string;
  brandName?: string;
  brandTagline?: string;
  description?: string;
  copyrightText?: string;
  availabilityText?: string;
  links?: FooterLinkItem[];
  infoLinks?: FooterLinkItem[];
  [key: string]: any;
}

export interface MediaVideoItem {
  id: string;
  title: string;
  type: "upload" | "youtube";
  url: string;
  youtubeId?: string;
  size?: string;
  duration?: string;
  createdAt: string;
}

export interface MediaAudioItem {
  id: string;
  title: string;
  type: "upload" | "url";
  url: string;
  size?: string;
  duration?: string;
  createdAt: string;
}

export interface MediaYouTubeAudioItem {
  id: string;
  title: string;
  url: string;
  youtubeId: string;
  duration?: string;
  createdAt: string;
}

export interface WebsiteMediaSettings {
  enabled: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
  activeVideoId?: string;
  activeAudioId?: string;
  activeYouTubeAudioId?: string;
  musicSource?: "audio" | "youtube";
  autoplay: boolean;
  loop: boolean;
  volume: number; // 0 to 100
  muted: boolean;
}

export interface WebsiteMediaManager {
  settings: WebsiteMediaSettings;
  videos: MediaVideoItem[];
  audios: MediaAudioItem[];
  youtubeAudios?: MediaYouTubeAudioItem[];
}

export interface CmsData {
  siteSettings: CmsSiteSettings;
  hero: CmsHero;
  profile: ProfileInfo;
  education: EducationItem[];
  certifications: CertificationItem[];
  pages: CmsPage[];
  homeSections: CmsSection[];
  projects: ProjectItem[];
  services: ServiceItem[];
  skills: SkillCategory[];
  navigation: CmsNavItem[];
  contactInfo: CmsContactInfo;
  media: CmsMediaItem[];
  mediaManager?: WebsiteMediaManager;
  milestonesPhotos: CollagePhotoItem[];
  stats: StatItem[];
  testimonials?: TestimonialItem[];
  processSteps?: ProcessStep[];
  clientBrands?: ClientBrand[];
  futureVision?: FutureVision;
  faqs?: FaqItem[];
  servicesFaq?: FaqItem[];
  servicesWhyWorkWithMe?: ServicesWhyWorkWithMe;
  servicesHero?: ServicesHero;
  servicesCta?: ServicesCta;
  servicesProcess?: ProcessStep[];
  aboutCta?: AboutCta;
  aboutBio?: AboutBioSection;
  aboutGallery?: AboutGalleryItem[];
  aboutHero?: AboutHeroSettings;
  aboutProfileCard?: AboutProfileCardSettings;
  aboutSectionsVisibility?: AboutSectionVisibility;
  aboutStatsSection?: AboutStatsSectionSettings;
  aboutProcessHeader?: { badge?: string; title?: string; highlightText?: string; description?: string };
  aboutTechHeader?: { badge?: string; title?: string; highlightText?: string; description?: string };
  servicesTechList?: ServicesTechItem[];
  aboutTechList?: ServicesTechItem[];
  skillsCoreExpertise?: SkillsCoreExpertiseItem[];
  skillsLearning?: SkillsLearningItem[];
  skillsRoadmap?: SkillsRoadmapItem[];
  projectCategories?: ProjectCategoryItem[];
  portfolioPageSettings?: PortfolioPageSettings;
  contactHero?: ContactHeroSettings;
  quickContactChannels?: QuickContactChannelItem[];
  contactAvailabilityBadges?: ContactAvailabilityBadge[];
  directReachHeader?: DirectReachHeader;
  directContactCards?: DirectContactCardItem[];
  officeWorkingHours?: OfficeWorkingHoursSettings;
  contactFormSettings?: ContactFormSettings;
  resumeSettings?: ResumeSettings;
  contactVisibility?: ContactVisibilitySettings;
  contactSeo?: ContactSeoSettings;
  footerSettings?: FooterSettings;
  homeJourneyHeader?: HomeJourneyHeader;
  homeServicesHeader?: HomeSectionHeader;
  homeSkillsHeader?: HomeSectionHeader;
  homeToolsHeader?: HomeSectionHeader;
  homePortfolioSettings?: HomePortfolioSettings;
  homeWorkflowHeader?: HomeSectionHeader;
  homeAboutSettings?: HomeAboutSettings;
  homeTestimonialsHeader?: HomeSectionHeader;
  homeStatsSettings?: HomeStatsSettings;
  homeClientsHeader?: HomeSectionHeader;
  homeCtaSettings?: HomeCtaSettings;
  homeThemeSettings?: HomeThemeSettings;
  servicesWorkflowHeader?: ServicesWorkflowHeader;
  servicesTechHeader?: ServicesTechHeader;
  servicesFaqHeader?: ServicesFaqHeader;
  servicesSeoSettings?: ServicesSeoSettings;
  servicesDesignSettings?: ServicesDesignSettings;
  skillsHero?: SkillsHeroSettings;
  skillsCodingHeader?: SkillsCodingHeader;
  skillsToolsHeader?: SkillsCodingHeader;
  skillsCoreHeader?: SkillsCodingHeader;
  skillsLearningHeader?: SkillsCodingHeader;
  skillsRoadmapHeader?: SkillsCodingHeader;
  skillsSeoSettings?: SkillsSeoSettings;
  skillsDesignSettings?: SkillsDesignSettings;
  aiChatSettings?: AiChatSettings;
  loadingSoundSettings?: LoadingSoundSettings;
}

export interface LoadingSoundSettings {
  enabled: boolean;
  soundUrl: string;
  soundFileName?: string;
  volume: number; // 0 to 100
  isCustom?: boolean;
}

export interface AiQuickQuestion {
  id: string;
  label: string;
  prompt: string;
  icon?: string;
}

export interface AiChatSettings {
  enabled?: boolean;
  botName?: string;
  botRole?: string;
  welcomeMessageEn?: string;
  welcomeMessageBn?: string;
  quickQuestions?: AiQuickQuestion[];
  systemPromptAddendum?: string;
  maxHistoryTurns?: number;
}



