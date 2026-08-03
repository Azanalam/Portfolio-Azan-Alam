import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:3000';

const env = {};
for (const line of fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const USER = env.ADMIN_USERNAME || 'Azanalam';
const PASS = env.ADMIN_PASSWORD || 'azanlovesbiryani';

let cookie = '';

async function api(route, { method = 'GET', body } = {}) {
  const headers = { 'content-type': 'application/json' };
  if (cookie) headers.cookie = cookie;
  const res = await fetch(BASE + route, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const setCookies = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [];
  for (const sc of setCookies) {
    const m = sc.match(/^admin_token=([^;]+)/);
    if (m) cookie = `admin_token=${m[1]}`;
  }
  if (!setCookies.length && res.headers.get('set-cookie')) {
    const m = res.headers.get('set-cookie').match(/admin_token=([^;]+)/);
    if (m) cookie = `admin_token=${m[1]}`;
  }
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

const P = { project: 'new-portfolio-cms' };

const portfolioProject = {
  slug: 'portfolio-cms',
  title: 'This Site — Full-Stack Portfolio CMS',
  subtitle: 'React 19 SPA + Express API + Supabase persistence',
  description:
    'The site you are viewing: a production portfolio platform with a secure admin CMS, media uploads, automated tests, and a crash-safe local cache layer.',
  longDescription:
    'This portfolio is not a static template — it is a working full-stack product. A React 19 single-page app renders every section from a single JSON document served by an Express API. An authenticated admin CMS edits the same document through hardened endpoints, and a Supabase table with a JSONB column acts as the source of truth, mirrored to a local cache so the site still works during database outages.',
  tags: ['React 19', 'Vite', 'Tailwind CSS', 'Express', 'Supabase', 'JWT Auth', 'Vitest'],
  category: 'fullstack',
  githubUrl: 'https://github.com/Azanalam',
  liveUrl: '#/',
  featured: true,
  published: true,
  order: 0,
  problemStatement:
    'Portfolios go stale the moment their owner stops editing code, and editing code to change a sentence is how content dies. The site also needed to stay fast, secure, and safe to edit — even when the network to the database drops.',
  goals: [
    'Let the owner edit every section from a browser CMS with no redeploys.',
    'Keep the public site fast with a single-document API response.',
    'Never corrupt content: writes go through a serialized queue with atomic file replacement.',
    'Ship with security hardening: JWT auth, rate limiting, and upload whitelisting.',
  ],
  solution:
    'A single Express server serves both the API and the Vite-built SPA. The CMS is JWT-cookie protected with constant-time credential checks and a brute-force limiter. Content lives in Supabase (one row, JSONB column) and is mirrored to database.json locally; every file write is atomic (temp file + rename) and gated by a write queue, so concurrent reads never see partial JSON. A test suite locks down the auth, upload, and CRUD behavior.',
  architecture:
    'React 19 (Vite) renders hash-routed views from a single /api/portfolio payload. Express exposes public reads plus protected /api/admin/* endpoints. A dbEngine layer owns persistence: read-through cache with content comparison (no writes when nothing changed), upsert to Supabase, and graceful fallback to the local file when the database is unreachable.',
  folderStructure: `portfolio/
├── server.ts              # Express API, auth, uploads, rate limiting
├── src/
│   ├── entry.ts           # Dev/prod startup
│   ├── data/dbEngine.ts   # Supabase sync + atomic local cache
│   ├── views/             # Public + admin views (hash routed)
│   └── components/admin/  # CMS section managers
├── supabase/migrations/   # Schema (portfolio JSONB row)
└── tests/                 # API + UI suites (vitest)`,
  challenges: [
    {
      title: 'Hot-reload loop from cache writes',
      description:
        'Rewriting database.json on every read triggered Vite full-page reloads in development, which re-triggered fetches — an infinite loop.',
    },
    {
      title: 'Corruption under concurrent writes',
      description:
        'Two writers racing on a single file produced truncated JSON that crashed the server on startup.',
    },
  ],
  tradeoffs: [
    {
      title: 'Cache vs. consistency',
      choice: 'Local JSON cache with compare-before-write',
      reason: 'Keeps the site fast and offline-tolerant; the cache only rewrites when content actually changed, killing the reload loop.',
    },
    {
      title: 'One JSONB row vs. relational tables',
      choice: 'Single document per portfolio',
      reason: 'Simplest possible CMS architecture for a personal site; the entire site updates in one transaction.',
    },
  ],
  accessibility: [
    'Semantic landmarks and heading hierarchy across all views.',
    'Keyboard-first navigation: number shortcuts, focus-visible rings, skip-free flows.',
    'Contrast-safe palette with light/dark theme support.',
    'ARIA labels on icon-only controls.',
  ],
  performance: [
    {
      metric: 'API round trip',
      before: 'Multiple endpoints',
      after: 'Single document fetch',
      technique: 'One /api/portfolio payload powers every view',
    },
    {
      metric: 'Cache writes',
      before: 'On every read',
      after: 'Only on content change',
      technique: 'Content comparison before atomic write',
    },
  ],
  lessons: [
    'File-backed caches must compare before they write, or dev servers loop.',
    'Atomic rename is the cheapest corruption-proofing a file cache can get.',
    'A CMS you can edit from a browser keeps a portfolio alive for years.',
  ],
};

const newInterests =
  'I recharge through a mix of outdoor activities and creative hobbies. I enjoy narrative-driven story games and studying how compelling plots and interactive worlds are crafted, and I love experimenting with AI tools to see how machine learning can supercharge my development workflow and spark ideas for new web projects. When I am not building, I read about web standards, system design, and the history of computing.';

const newStats = [
  { value: '1', label: 'Live Platform', subtext: 'This portfolio, in production' },
  { value: '100%', label: 'Responsive', subtext: 'Mobile to ultra-wide' },
  { value: 'AA', label: 'Accessibility', subtext: 'Semantic, keyboard-first markup' },
  { value: '18', label: 'Automated Tests', subtext: 'API & UI suites, CI-ready' },
];

// Honest skill experience levels for a 2+ year learning journey
const normalizedSkills = [
  {
    category: 'Frontend Engineering',
    description: 'Creating accessible, beautiful, high-performance web systems',
    skills: [
      { name: 'React 19 & Next.js', level: 'Advanced', years: 2, iconName: 'React', useCase: 'Building component-driven UIs, state machines, and server-rendered pages with modern hooks.' },
      { name: 'TypeScript', level: 'Advanced', years: 2, iconName: 'TypeScript', useCase: 'Typed end-to-end applications with strict null-safety and zero use-any practices.' },
      { name: 'Tailwind CSS', level: 'Advanced', years: 2, iconName: 'Wind', useCase: 'Responsive, utility-first design systems without bloated custom CSS.' },
      { name: 'Framer Motion', level: 'Intermediate', years: 1, iconName: 'Zap', useCase: 'Smooth page transitions and physics-based micro-interactions at 60 FPS.' },
    ],
  },
  {
    category: 'Systems & Architecture',
    description: 'Building robust background logic, APIs, and storage systems',
    skills: [
      { name: 'Node.js & Express', level: 'Advanced', years: 2, iconName: 'Server', useCase: 'REST APIs, middleware, auth flows, and full-stack applications.' },
      { name: 'Supabase & PostgreSQL', level: 'Intermediate', years: 1, iconName: 'Database', useCase: 'Row-level-security-aware storage, JSONB documents, and real-time data.' },
      { name: 'WebAssembly', level: 'Intermediate', years: 1, iconName: 'Cpu', useCase: 'Exploring in-browser execution of compiled binaries.' },
    ],
  },
  {
    category: 'Tooling & DevOps',
    description: 'Optimizing continuous integration, build steps, and asset sizes',
    skills: [
      { name: 'Vite / esbuild / Rollup', level: 'Intermediate', years: 1, iconName: 'Settings', useCase: 'Fast dev servers, tree-shaken production bundles, and build pipelines.' },
      { name: 'CI/CD Pipelines (GitHub Actions)', level: 'Intermediate', years: 1, iconName: 'GitBranch', useCase: 'Automated typecheck, tests, and deployment workflows.' },
      { name: 'Docker', level: 'Intermediate', years: 1, iconName: 'Layers', useCase: 'Containerized local environments and deploy targets.' },
    ],
  },
];

async function main() {
  const login = await api('/api/admin/login', { method: 'POST', body: { username: USER, password: PASS } });
  if (login.status !== 200) {
    console.error(`LOGIN FAILED (${login.status})`, login.data);
    process.exit(1);
  }
  console.log(`Logged in as ${USER}`);

  const current = (await api('/api/portfolio')).data;
  if (!current) {
    console.error('Could not load current portfolio data');
    process.exit(1);
  }

  const results = [];

  // Settings: identity + social links (github known; linkedin added later once provided)
  const settings = {
    ...current.settings,
    siteName: 'Azan Alam',
    siteLogo: 'AZ',
    footerText: 'Crafted with React, TypeScript & Node. Fast, accessible, SEO-ready.',
    copyright: '© 2026 Azan Alam',
    timezone: 'UTC',
    socialLinks: { ...(current.settings.socialLinks || {}), github: 'https://github.com/Azanalam', linkedin: 'https://www.linkedin.com/in/azan-alam-0ab7a0317/' },
  };
  results.push(['settings', await api('/api/admin/settings', { method: 'POST', body: settings })]);

  // About: first-person interests + results-based stats (items 4 & 8) + truthful stack
  const about = {
    ...current.about,
    interests: newInterests,
    stats: newStats,
    developerSnapshot: {
      ...(current.about.developerSnapshot || {}),
      techStack: 'React 19, Vite, Tailwind CSS, Express, Supabase, PostgreSQL',
    },
  };
  results.push(['about', await api('/api/admin/about', { method: 'POST', body: about })]);

  // Hero: truthful frontend/backend stack claims (item 2)
  const hero = {
    ...current.hero,
    statistics: [
      { label: 'Frontend Stack', value: 'React, TypeScript, Vite' },
      { label: 'Backend Stack', value: 'Express, Supabase, PostgreSQL' },
      { label: 'Product Design', value: 'Figma, Design Ops' },
    ],
  };
  results.push(['hero', await api('/api/admin/hero', { method: 'POST', body: hero })]);

  // Education: fix typo + degree labels + institution names (item 4)
  for (const edu of current.education || []) {
    const fixed = { ...edu };
    if (/SSC/.test(edu.degree)) {
      fixed.degree = 'Secondary School Certificate (Computer Science)';
      fixed.school = fixed.school || 'The Smart School';
    } else if (/Sxience/i.test(edu.degree)) {
      fixed.degree = edu.degree.replace(/Sxience/i, 'Science');
      fixed.school = fixed.school || 'Adamjee Government Science College';
    } else if (/Intermediate/i.test(edu.degree) && !fixed.school) {
      fixed.school = 'Adamjee Government Science College';
    }
    if (JSON.stringify(fixed) !== JSON.stringify(edu)) {
      results.push([`education:${edu.id || edu.degree}`, await api('/api/admin/education', { method: 'POST', body: { action: 'save', item: fixed } })]);
    }
  }

    // Skills: honest experience levels (normalized to a 2+ year journey)
  results.push(['skills', await api('/api/admin/skills', { method: 'POST', body: normalizedSkills })]);

  // Remove fabricated seed entries (template defaults that must never appear live)
  for (const t of current.testimonials || []) {
    if (/Sarah Connor|Cyberdyne/i.test(t.name + ' ' + t.company)) {
      results.push([`testimonials:del:${t.id}`, await api('/api/admin/testimonials', { method: 'POST', body: { action: 'delete', item: { id: t.id } } })]);
    }
  }
  for (const c of current.certifications || []) {
    if (/AWS Certified|Amazon Web/i.test(c.name + ' ' + c.organization)) {
      results.push([`certifications:del:${c.id}`, await api('/api/admin/certifications', { method: 'POST', body: { action: 'delete', item: { id: c.id } } })]);
    }
  }
  for (const a of current.awards || []) {
    if (/Outstanding Innovator|Vector Tech/i.test(a.name + ' ' + a.organization)) {
      results.push([`awards:del:${a.id}`, await api('/api/admin/awards', { method: 'POST', body: { action: 'delete', item: { id: a.id } } })]);
    }
  }

  // Projects: add this portfolio as a case study (item 10) / refresh its links
  results.push(['projects:portfolio-cms', await api('/api/admin/projects', { method: 'POST', body: { action: 'save', item: portfolioProject } })]);

  // Services: persist catalog into Supabase (item 5)
  const services = (current.services || []).map((s, i) => ({
    ...s,
    id: s.id || `service-${i + 1}`,
    ctaLabel: s.ctaLabel || 'Start a project',
  }));
  results.push(['services', await api('/api/admin/services', { method: 'POST', body: services })]);

  // Layout: surface services on the homepage after the hero (item 5)
  const order = ['hero', 'services', ...current.layout.sectionOrder.filter((s) => s !== 'hero' && s !== 'services')];
  results.push(['layout', await api('/api/admin/layout', { method: 'POST', body: { sectionOrder: order, hiddenSections: current.layout.hiddenSections || [] } })]);

  for (const [label, r] of results) {
    const status = typeof r === 'string' ? r : r.status;
    console.log(`${label}: ${status}`);
  }

  const after = (await api('/api/portfolio')).data;
  console.log('\n--- VERIFY ---');
  console.log('siteName:', after.settings.siteName);
  console.log('socialLinks:', JSON.stringify(after.settings.socialLinks));
  console.log('about.stats:', JSON.stringify(after.about.stats));
  console.log('interests starts:', after.about.interests.slice(0, 40) + '...');
  console.log('education degrees:', after.education.map((e) => e.degree).join(' | '));
  console.log('projects:', after.projects.map((p) => p.title).join(' | '));
  console.log('services:', after.services.map((s) => s.title).join(' | '));
  console.log('layout order:', after.layout.sectionOrder.join(', '));
}

main().catch((err) => {
  console.error('SCRIPT ERROR:', err);
  process.exit(1);
});
