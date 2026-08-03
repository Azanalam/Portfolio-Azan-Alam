import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Project,
  Experience,
  SkillGroup,
  SiteSettings,
  HeroSection,
  AboutSection,
  EducationEntry,
  TestimonialEntry,
  CertificationEntry,
  AwardEntry,
  BlogEntry,
  MediaItem,
  LayoutConfig,
  ServiceItem,
  DBStructure
} from '../types';

const DB_PATH = path.join(process.cwd(), 'database.json');

// Default backup lists for the initial seed (real, verifiable content only)
const defaultExperiences = [
  {
    id: 'exp-1',
    company: 'Self-Employed',
    role: 'Responsive Web Developer',
    period: '2025 - Current',
    description: [
      'Building full-stack web projects end-to-end: React + TypeScript frontends, Node/Express APIs, and Supabase-backed persistence.',
      'Shipping accessible, SEO-ready, high-performance sites â€” including this very portfolio CMS.'
    ],
    tags: ['React', 'TypeScript', 'Express', 'Supabase', 'Web Performance'],
    order: 0
  }
];

const defaultSkills: SkillGroup[] = [
  {
    category: 'Frontend Engineering',
    description: 'Creating accessible, beautiful, high-performance web systems',
    skills: [
      { name: 'React 19 & Next.js', level: 'Advanced', years: 2, iconName: 'React', useCase: 'Building component-driven UIs, state machines, and server-rendered pages with modern hooks.' },
      { name: 'TypeScript', level: 'Advanced', years: 2, iconName: 'TypeScript', useCase: 'Typed end-to-end applications with strict null-safety and zero use-any practices.' },
      { name: 'Tailwind CSS', level: 'Advanced', years: 2, iconName: 'Wind', useCase: 'Responsive, utility-first design systems without bloated custom CSS.' },
      { name: 'Framer Motion', level: 'Intermediate', years: 1, iconName: 'Zap', useCase: 'Smooth page transitions and physics-based micro-interactions at 60 FPS.' }
    ]
  },
  {
    category: 'Systems & Architecture',
    description: 'Building robust background logic, APIs, and storage systems',
    skills: [
      { name: 'Node.js & Express', level: 'Advanced', years: 2, iconName: 'Server', useCase: 'REST APIs, middleware, auth flows, and full-stack applications.' },
      { name: 'Supabase & PostgreSQL', level: 'Intermediate', years: 1, iconName: 'Database', useCase: 'Row-level-security-aware storage, JSONB documents, and real-time data.' },
      { name: 'WebAssembly', level: 'Intermediate', years: 1, iconName: 'Cpu', useCase: 'Exploring in-browser execution of compiled binaries.' }
    ]
  },
  {
    category: 'Tooling & DevOps',
    description: 'Optimizing continuous integration, build steps, and asset sizes',
    skills: [
      { name: 'Vite / esbuild / Rollup', level: 'Intermediate', years: 1, iconName: 'Settings', useCase: 'Fast dev servers, tree-shaken production bundles, and build pipelines.' },
      { name: 'CI/CD Pipelines (GitHub Actions)', level: 'Intermediate', years: 1, iconName: 'GitBranch', useCase: 'Automated typecheck, tests, and deployment workflows.' },
      { name: 'Docker', level: 'Intermediate', years: 1, iconName: 'Layers', useCase: 'Containerized local environments and deploy targets.' }
    ]
  }
];


const defaultServices: ServiceItem[] = [
  {
    id: 'service-1',
    icon: 'Code',
    title: 'Business Websites & Landing Pages',
    description: 'Fast, responsive, conversion-focused sites built with React, TypeScript, and modern CSS. Fully editable content, on-brand design, and SEO ready from day one.',
    features: ['Responsive on every screen', 'SEO & Core Web Vitals optimized', 'Contact forms & analytics wired', 'CMS-style content editing'],
    price: 'Custom quote',
    ctaLabel: 'Start a project',
    highlight: true
  },
  {
    id: 'service-2',
    icon: 'Cpu',
    title: 'Full-Stack Web Applications',
    description: 'From admin dashboards to custom CMS platforms, I build complete React + Node applications with secure auth, Supabase/PostgreSQL storage, and clean architecture.',
    features: ['Secure JWT authentication', 'Database design & APIs', 'Admin control panels', 'Codebases with automated tests'],
    price: 'Custom quote',
    ctaLabel: 'Scope your build',
    highlight: false
  },
  {
    id: 'service-3',
    icon: 'Zap',
    title: 'Performance & SEO Audits',
    description: 'A hard review of load time, Core Web Vitals, accessibility, and search visibility â€” with a prioritized list of fixes I can implement for you.',
    features: ['Lighthouse & Web Vitals review', 'Accessibility (WCAG AA) pass', 'Actionable prioritized roadmap', 'Hands-on fix implementation'],
    price: 'From $120',
    ctaLabel: 'Book an audit',
    highlight: false
  },
  {
    id: 'service-4',
    icon: 'Layers',
    title: 'Modern Redesigns & Revamps',
    description: 'Give an outdated site a modern, accessible rebuild â€” new design system fidelity, faster builds, and content migration with zero downtime.',
    features: ['Design system adoption', 'Content migration', 'Tailwind & motion polish', 'Training & handover docs'],
    price: 'Custom quote',
    ctaLabel: 'Request a quote',
    highlight: false
  }
];

const initialDB: DBStructure = {
  settings: {
    siteName: 'Azan Alam',
    siteLogo: 'AZ',
    favicon: '',
    brandColors: { primary: 'emerald', accent: 'emerald' },
    theme: 'dark',
    footerText: 'Crafted with React, TypeScript & Node. Fast, accessible, SEO-ready.',
    copyright: 'Â© 2026 Azan Alam',
    email: 'azanalam7@gmail.com',
    phone: '',
    address: '',
    timezone: 'UTC',
    socialLinks: {
      github: 'https://github.com/Azanalam',
      linkedin: 'https://www.linkedin.com/in/azan-alam-0ab7a0317/',
      twitter: '',
      instagram: '',
      facebook: '',
      youtube: '',
      devto: '',
      medium: '',
      hashnode: ''
    }
  },
  hero: {
    name: 'Azan Alam',
    jobTitle: 'Responsive Web Developer',
    headline: 'Designing the Surface, Mastering the System',
    description: 'Blending clean code, modern front-end frameworks, and fast design to build seamless, high-performance websites across all devices.',
    heroImage: '',
    backgroundImage: '',
    ctaButtons: [
      { label: 'Explore Technical Cases', hash: '/projects', primary: true },
      { label: 'Initialize Handshake', hash: '/contact', primary: false }
    ],
    statistics: [
      { label: 'Frontend Stack', value: 'React, TypeScript, Vite' },
      { label: 'Backend Stack', value: 'Express, Supabase, PostgreSQL' },
      { label: 'Product Design', value: 'Figma, Design Ops' }
    ],
    statusBadge: 'Available',
    availability: true
  },
  about: {
    biography: 'Hello, I am a software engineer focused on building robust client-side storage, local virtual engines, and fully accessible design systems. I operate under the philosophy that frontend engineering is systems engineering applied directly to user-facing boundaries.',
    introduction: 'Systems-minded builder centered on the modern web platform.',
    story: 'My engineering path started in low-level compiler principles, which ultimately led to a fascination with the web platform as a universal runtime. Since then, I have dedicated myself to proving that browser-based web applications can feel just as robust, responsive, and durable as high-end native software.',
    careerGoals: 'I routinely collaborate with distributed tech stacks, build modular bundlers, and spearhead compliance testing guidelines. Whether designing logical vector clocks to handle distributed database writes or optimizing binary loaders, I focus on predictable codebases and transparent benchmarks.',
    interests: 'When I am not auditing WebAssembly stack operations or drafting design specs, I usually read retro-computing publications, review paper drafts regarding peer-to-peer databases, or compile customized hardware keyboards. I find that building clean interfaces requires a balanced mental space, which is why I prioritize clear spacing, visual stillness, and structured focus.',
    personalImage: '',
    principles: [
      {
        title: 'Offline-First by Default',
        icon: 'Database',
        description: 'I believe user data should reside on user machines first. Networks are volatile transport layers; databases should operate locally and sync differentially when pipelines allow.'
      },
      {
        title: 'Performance as a Feature',
        icon: 'Cpu',
        description: 'A 100ms lag is a product bug. I optimize bundle sizes, write zero-allocation loops, and utilize WebAssembly memory blocks to achieve native performance inside the browser sandbox.'
      },
      {
        title: 'Accessibility is the Skeleton',
        icon: 'Layers',
        description: 'Semantic markup is not optional; it is the skeleton of the internet. I build screen-reader accessible layouts with native ARIA compliance, full focus bounding, and keyboard-first loops.'
      }
    ],
    skillsList: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'Express',
      'REST APIs',
      'Responsive Design',
      'SEO',
      'Performance',
      'CMS Development',
      'UI/UX'
    ],
    developerSnapshot: {
      currentFocus: 'Full-Stack Web Systems & Performance',
      specialization: 'React, TypeScript, Node.js & Design Systems',
      techStack: 'React 19, Vite, Tailwind CSS, Express, Supabase, PostgreSQL',
      availability: 'Open to Roles',
      location: 'Remote / Global',
      statusBadge: 'Available'
    },
    stats: [
      { value: '15+', label: 'Projects', subtext: 'Built & Deployed' },
      { value: '2+', label: 'Years Learning', subtext: 'Modern Web Architecture' },
      { value: '100%', label: 'Responsive', subtext: 'Mobile to Ultra-wide' },
      { value: '90+', label: 'Lighthouse Target', subtext: 'Performance & SEO' }
    ],
    interestHighlights: [
      { title: 'Continuous Learning', desc: 'Constantly absorbing compiler tech, web standards, and edge runtimes.', icon: 'BookOpen' },
      { title: 'Problem Solving', desc: 'Deconstructing complex architecture bottlenecks into clean, minimal code.', icon: 'Zap' },
      { title: 'Building Products', desc: 'Crafting user-centric software with pixel precision and fluid responsiveness.', icon: 'Rocket' },
      { title: 'Open Source', desc: 'Contributing to open ecosystems, developer tools, and reusable design packages.', icon: 'Code' },
      { title: 'Systems & Theory', desc: 'Studying computing history, system design patterns, and WebAssembly specs.', icon: 'Compass' },
      { title: 'Product Innovation', desc: 'Experimenting with client-side storage, local AI, and modern web capabilities.', icon: 'Sparkles' }
    ]
  },
  experiences: defaultExperiences,
  education: [
    {
      id: 'edu-1',
      school: 'The Smart School',
      degree: 'Secondary School Certificate (Computer Science)',
      years: '',
      description: '',
      logo: '',
      order: 0
    },
    {
      id: 'edu-2',
      school: 'Adamjee Government Science College',
      degree: 'Intermediate in Computer Science',
      years: '',
      description: '',
      logo: '',
      order: 1
    }
  ],
  skills: defaultSkills,
  projects: [],
  services: defaultServices,
  blog: [],
  testimonials: [],
  certifications: [],
  awards: [],
  media: [],
  layout: {
    sectionOrder: ['hero', 'projects', 'experience', 'testimonials', 'contact'],
    hiddenSections: []
  },
  resumeUrl: ''
};

// Supabase client. Uses the service-role key (server-only); RLS is enforced
// for any other role. Falls back to local file storage when credentials are absent.
let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.warn('No Supabase credentials found (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY). Falling back to local file storage only.');
    return null;
  }

  try {
    supabaseInstance = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    console.log('Supabase client initialized.');
    return supabaseInstance;
  } catch (err) {
    console.error('Error initializing Supabase client:', err);
    return null;
  }
}

// Queue helper to prevent race conditions during write
class LockQueue {
  private promise: Promise<void> = Promise.resolve();

  async enqueue<T>(callback: () => Promise<T>): Promise<T> {
    const nextPromise = this.promise.then(async () => {
      return callback();
    });
    this.promise = nextPromise.then(
      () => {},
      () => {}
    );
    return nextPromise;
  }
}

const writeQueue = new LockQueue();

// Atomic file write: write to a temp file then rename, so an abrupt crash or
// concurrent reader never observes a truncated/corrupt database.json.
function writeFileAtomic(filePath: string, contents: string) {
  const tmp = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, contents, 'utf-8');
  fs.renameSync(tmp, filePath);
}

function mergeWithInitial(parsed: any): DBStructure {
  const mergedAbout = {
    ...initialDB.about,
    ...(parsed.about || {}),
    developerSnapshot: {
      ...initialDB.about.developerSnapshot,
      ...(parsed.about?.developerSnapshot || {})
    },
    skillsList: parsed.about?.skillsList && parsed.about.skillsList.length > 0 ? parsed.about.skillsList : initialDB.about.skillsList,
    stats: parsed.about?.stats && parsed.about.stats.length > 0 ? parsed.about.stats : initialDB.about.stats,
    interestHighlights: parsed.about?.interestHighlights && parsed.about.interestHighlights.length > 0 ? parsed.about.interestHighlights : initialDB.about.interestHighlights,
  };
  return { 
    ...initialDB, 
    ...parsed,
    about: mergedAbout
  };
}

export async function readDB(): Promise<DBStructure> {
  // 1. Load local baseline / cache
  let localDb: DBStructure = initialDB;
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      localDb = JSON.parse(data);
    } else {
      writeFileAtomic(DB_PATH, JSON.stringify(initialDB, null, 2));
      localDb = initialDB;
    }
  } catch (err) {
    console.error('Error reading local database file:', err);
    // Corrupt cache: back it up and fall back to defaults so we recover cleanly.
    try {
      fs.renameSync(DB_PATH, `${DB_PATH}.corrupt-${Date.now()}`);
      console.warn('Backed up corrupt cache file; will reseed.');
    } catch (backupErr) {
      // ignore: file may already be gone
    }
    localDb = initialDB;
  }

  const supabase = getSupabase();
  if (!supabase) {
    return mergeWithInitial(localDb);
  }

  try {
    // 2. Fetch the portfolio row from Supabase (single JSONB document)
    const { data, error } = await supabase
      .from('portfolio')
      .select('data')
      .eq('id', 'default')
      .maybeSingle();

    if (error) throw error;

    if (data) {
      const remoteData = data.data as DBStructure;
      // Sync the local cache only when the content actually changed.
      // (The dev watcher triggers a page reload on any file change, so we
      // must not rewrite this file on every read.)
      const remoteJson = JSON.stringify(remoteData, null, 2);
      try {
        const current = fs.existsSync(DB_PATH) ? fs.readFileSync(DB_PATH, 'utf-8') : '';
        if (current !== remoteJson) {
          writeFileAtomic(DB_PATH, remoteJson);
        }
      } catch (err) {
        console.error('Error updating local database cache:', err);
      }
      return mergeWithInitial(remoteData);
    } else {
      // 3. Row does not exist in Supabase (first start) -> seed it
      console.log('No portfolio row found in Supabase. Seeding with local database...');
      const { error: insertError } = await supabase
        .from('portfolio')
        .insert({ id: 'default', data: localDb });
      if (insertError) throw insertError;
      return mergeWithInitial(localDb);
    }
  } catch (err) {
    console.error('Error reading from Supabase, falling back to local DB:', err);
    return mergeWithInitial(localDb);
  }
}

export async function writeDB(db: DBStructure): Promise<void> {
  return writeQueue.enqueue(async () => {
    // 1. Write locally first
    try {
      writeFileAtomic(DB_PATH, JSON.stringify(db, null, 2));
    } catch (err) {
      console.error('Error writing database file locally:', err);
    }

    // 2. Write to Supabase
    const supabase = getSupabase();
    if (!supabase) {
      return;
    }

    try {
      const { error } = await supabase
        .from('portfolio')
        .upsert({ id: 'default', data: db, updated_at: new Date().toISOString() });
      if (error) throw error;
      console.log('Portfolio successfully saved to Supabase.');
    } catch (err) {
      console.error('Error writing database to Supabase:', err);
      throw err;
    }
  });
}
