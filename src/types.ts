export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  tags: string[];
  category: 'frontend' | 'fullstack' | 'systems' | 'tooling';
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  
  // Detailed Case Study Fields
  problemStatement: string;
  goals: string[];
  solution: string;
  architecture: string;
  folderStructure: string;
  challenges: { title: string; description: string }[];
  tradeoffs: { title: string; choice: string; reason: string }[];
  accessibility: string[];
  performance: { metric: string; before: string; after: string; technique: string }[];
  lessons: string[];
}

export interface Experience {
  id?: string;
  company: string;
  role: string;
  period: string;
  description: string[];
  tags: string[];
  location?: string;
  website?: string;
  logo?: string;
  order?: number;
}

export interface SkillGroup {
  category: string;
  description: string;
  skills: {
    name: string;
    level: 'Expert' | 'Advanced' | 'Intermediate';
    years: number;
    iconName: string;
    useCase: string;
  }[];
}

export interface NavItem {
  label: string;
  hash: string;
  shortcut?: string;
}

export interface SiteSettings {
  siteName: string;
  siteLogo: string;
  favicon: string;
  brandColors: { primary: string; accent: string };
  theme: 'dark' | 'light';
  footerText: string;
  copyright: string;
  email: string;
  phone: string;
  address: string;
  timezone: string;
  socialLinks: Record<string, string>;
}

export interface HeroSection {
  name: string;
  jobTitle: string;
  headline: string;
  description: string;
  heroImage: string;
  backgroundImage: string;
  ctaButtons: { label: string; hash: string; primary: boolean }[];
  statistics: { label: string; value: string }[];
  statusBadge: string;
  availability: boolean;
}

export interface AboutDeveloperSnapshot {
  currentFocus: string;
  specialization: string;
  techStack: string;
  availability: string;
  location: string;
  statusBadge: string;
}

export interface AboutStat {
  value: string;
  label: string;
  subtext: string;
}

export interface AboutInterestHighlight {
  title: string;
  desc: string;
  icon: string;
}

export interface AboutSection {
  biography: string;
  introduction: string;
  story: string;
  careerGoals: string;
  interests: string;
  personalImage: string;
  principles: { title: string; icon: string; description: string }[];
  skillsList?: string[];
  developerSnapshot?: AboutDeveloperSnapshot;
  stats?: AboutStat[];
  interestHighlights?: AboutInterestHighlight[];
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  years: string;
  description: string;
  logo?: string;
  order: number;
}

export interface TestimonialEntry {
  id: string;
  name: string;
  position: string;
  company: string;
  image?: string;
  quote: string;
  order: number;
}

export interface CertificationEntry {
  id: string;
  name: string;
  organization: string;
  date: string;
  credentialUrl?: string;
  image?: string;
}

export interface AwardEntry {
  id: string;
  name: string;
  organization: string;
  date: string;
  description: string;
}

export interface BlogEntry {
  id: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  category: string;
  coverImage?: string;
  readingTime: number;
  status: 'draft' | 'published';
  createdAt: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface MediaItem {
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  ctaLabel: string;
  highlight: boolean;
}

export interface LayoutConfig {
  sectionOrder: string[];
  hiddenSections: string[];
}

export interface DBStructure {
  settings: SiteSettings;
  hero: HeroSection;
  about: AboutSection;
  experiences: (Experience & { id: string; website?: string; order: number })[];
  education: EducationEntry[];
  skills: SkillGroup[];
  projects: (Project & { published?: boolean; order?: number; seoTitle?: string; seoDescription?: string; seoKeywords?: string[]; images?: string[] })[];
  services: ServiceItem[];
  blog: BlogEntry[];
  testimonials: TestimonialEntry[];
  certifications: CertificationEntry[];
  awards: AwardEntry[];
  media: MediaItem[];
  layout: LayoutConfig;
  resumeUrl: string;
}

