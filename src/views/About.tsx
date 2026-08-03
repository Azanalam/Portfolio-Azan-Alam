import { motion, type Variants } from 'motion/react';
import { 
  Terminal, 
  Cpu, 
  CheckCircle, 
  Code, 
  Shield, 
  Layers, 
  ArrowUpRight, 
  Mail, 
  Check, 
  Sparkles, 
  Globe, 
  Briefcase, 
  Zap, 
  Compass, 
  BookOpen, 
  Rocket, 
  Award,
  UserCheck,
  FileText
} from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { ComponentType } from 'react';

// Map icon names to Lucide icon components
const iconMap: Record<string, ComponentType<any>> = {
  'Database': DatabaseIcon,
  'Cpu': Cpu,
  'Shield': Shield,
  'Layers': Layers,
  'Code': Code,
  'Zap': Zap,
  'Sparkles': Sparkles,
  'BookOpen': BookOpen,
  'Rocket': Rocket,
  'Compass': Compass
};

// Fallback Database Icon
function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

const DEFAULT_SKILLS = [
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
];

const DEFAULT_INTERESTS = [
  { title: 'Continuous Learning', desc: 'Constantly absorbing compiler tech, web standards, and edge runtimes.', icon: 'BookOpen' },
  { title: 'Problem Solving', desc: 'Deconstructing complex architecture bottlenecks into clean, minimal code.', icon: 'Zap' },
  { title: 'Building Products', desc: 'Crafting user-centric software with pixel precision and fluid responsiveness.', icon: 'Rocket' },
  { title: 'Open Source', desc: 'Contributing to open ecosystems, developer tools, and reusable design packages.', icon: 'Code' },
  { title: 'Systems & Theory', desc: 'Studying computing history, system design patterns, and WebAssembly specs.', icon: 'Compass' },
  { title: 'Product Innovation', desc: 'Experimenting with client-side storage, local AI, and modern web capabilities.', icon: 'Sparkles' },
];

const DEFAULT_STATS = [
  { value: '15+', label: 'Projects', subtext: 'Built & Deployed' },
  { value: '2+', label: 'Years Learning', subtext: 'Modern Web Architecture' },
  { value: '100%', label: 'Responsive', subtext: 'Mobile to Ultra-wide' },
  { value: '90+', label: 'Lighthouse Target', subtext: 'Performance & SEO' },
];

export default function About() {
  const { data, loading } = usePortfolio();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 16 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center font-mono text-xs text-(--text-muted) gap-3">
        <svg className="animate-spin h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Loading engineer dossier...</span>
      </div>
    );
  }

  const about = data?.about;
  const resumeUrl = data?.resumeUrl || '';
  const principles = about?.principles || [];
  const skillsList = (about?.skillsList && about.skillsList.length > 0) ? about.skillsList : DEFAULT_SKILLS;
  const statsList = (about?.stats && about.stats.length > 0) ? about.stats : DEFAULT_STATS;
  const interestHighlights = (about?.interestHighlights && about.interestHighlights.length > 0) ? about.interestHighlights : DEFAULT_INTERESTS;
  const snapshot = about?.developerSnapshot || {
    currentFocus: 'Full-Stack Web Systems & Performance',
    specialization: 'React, TypeScript, Node.js & Design Systems',
    techStack: 'React 19, Vite, Tailwind CSS, Express, Supabase, PostgreSQL',
    availability: 'Open to Roles',
    location: 'Remote / Global',
    statusBadge: 'Available'
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 py-8 md:py-12 max-w-6xl mx-auto font-sans"
    >
      {/* Title Header */}
      <section className="space-y-4 max-w-3xl">
        <motion.div 
          variants={itemVariants} 
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-medium text-emerald-400"
        >
          <Terminal className="h-3.5 w-3.5" />
          <span className="uppercase tracking-wider">About the Developer</span>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-(--text-1) leading-[1.15]"
        >
          {about?.introduction || 'Systems-minded engineer crafting modern, accessible web experiences.'}
        </motion.h1>
      </section>

      {/* Main Grid: Left Column (Bio & Skills & Story) + Right Column (Developer Snapshot) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Biography & CTA Buttons */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-500 font-semibold flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Biography
            </h2>

            <p className="max-w-[700px] text-base sm:text-lg leading-relaxed text-(--text-2) font-sans">
              {about?.biography || 'Hello, I am a full-stack engineer focused on building robust client-side applications, local virtual engines, and responsive design systems with modern TypeScript.'}
            </p>

            {/* Ghost Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a 
                href="#/projects" 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-(--cta-bg) text-(--cta-fg) hover:bg-(--cta-hover) transition-all duration-200 shadow-sm active:scale-95"
              >
                <span>View Projects</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <a 
                href="#/contact" 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-(--line-strong) bg-(--surface) text-(--text-2) hover:text-(--text-1) hover:bg-(--surface-3) hover:border-(--line-strong) transition-all duration-200 active:scale-95"
              >
                <Mail className="h-4 w-4 text-emerald-400" />
                <span>Contact Me</span>
              </a>

              {resumeUrl && (
                <a 
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-(--line-strong) bg-(--surface) text-(--text-2) hover:text-(--text-1) hover:bg-(--surface-3) hover:border-(--line-strong) transition-all duration-200 active:scale-95"
                >
                  <FileText className="h-4 w-4 text-emerald-400" />
                  <span>View Résumé</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Skills Grid */}
          <motion.div variants={itemVariants} className="space-y-4 pt-4 border-t border-(--line)">
            <h3 className="text-xs font-mono uppercase tracking-widest text-(--text-mid) font-medium">
              Core Technical Capabilities
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {skillsList.map((skill) => (
                <div 
                  key={skill}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-(--line-strong) bg-(--surface) text-xs sm:text-sm font-medium text-(--text-2) hover:border-emerald-500/30 hover:bg-(--surface-2) transition-all duration-200"
                >
                  <div className="flex items-center justify-center h-5 w-5 rounded-md bg-emerald-500/10 text-emerald-400 shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate">{skill}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Story & Career Goals */}
          <motion.div variants={itemVariants} className="space-y-6 pt-6 border-t border-(--line)">
            {about?.story && (
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-(--text-mid) font-medium flex items-center gap-2">
                  <Compass className="h-3.5 w-3.5 text-emerald-400" />
                  Engineering Journey
                </h3>
                <p className="max-w-[700px] text-sm sm:text-base text-(--text-mid) leading-relaxed">
                  {about.story}
                </p>
              </div>
            )}

            {about?.careerGoals && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-(--text-mid) font-medium flex items-center gap-2">
                  <Rocket className="h-3.5 w-3.5 text-emerald-400" />
                  Career Direction & Focus
                </h3>
                <p className="max-w-[700px] text-sm sm:text-base text-(--text-mid) leading-relaxed">
                  {about.careerGoals}
                </p>
              </div>
            )}
          </motion.div>

        </div>

        {/* Right Column: Developer Snapshot (Sticky Card) */}
        <motion.div variants={itemVariants} className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="p-6 rounded-2xl border border-(--line-strong) bg-(--surface) shadow-2xl space-y-6 relative overflow-hidden">
            {/* Subtle top glow line */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-(--line)">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold tracking-widest text-(--text-1) uppercase">
                  Developer Snapshot
                </h3>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{snapshot.statusBadge || 'Available'}</span>
              </div>
            </div>

            {/* Spec Items */}
            <div className="space-y-4 text-xs font-mono">
              <div>
                <span className="text-(--text-muted) block uppercase text-[10px] tracking-wider mb-1">Current Focus</span>
                <span className="text-(--text-2) font-semibold block leading-snug">{snapshot.currentFocus}</span>
              </div>

              <div>
                <span className="text-(--text-muted) block uppercase text-[10px] tracking-wider mb-1">Specialization</span>
                <span className="text-(--text-2) font-semibold block leading-snug">{snapshot.specialization}</span>
              </div>

              <div>
                <span className="text-(--text-muted) block uppercase text-[10px] tracking-wider mb-1">Tech Stack</span>
                <span className="text-(--text-2) block leading-snug font-sans text-xs">
                  {snapshot.techStack}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-(--line)">
                <div>
                  <span className="text-(--text-muted) block uppercase text-[9px] tracking-wider mb-0.5">Availability</span>
                  <span className="text-emerald-400 font-semibold text-[11px]">{snapshot.availability}</span>
                </div>
                <div>
                  <span className="text-(--text-muted) block uppercase text-[9px] tracking-wider mb-0.5">Location</span>
                  <span className="text-(--text-2) font-semibold text-[11px]">{snapshot.location}</span>
                </div>
              </div>
            </div>

            {/* Mini Quick Highlights */}
            <div className="pt-4 border-t border-(--line) grid grid-cols-2 gap-2 text-center">
              {statsList.slice(0, 2).map((st) => (
                <div key={st.label} className="p-2.5 rounded-xl bg-(--surface-2) border border-(--line-strong)">
                  <div className="text-lg font-bold text-(--text-1) font-mono">{st.value}</div>
                  <div className="text-[10px] text-(--text-mid)">{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </section>

      {/* Animated Stats Section */}
      <section className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsList.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl border border-(--line-strong) bg-(--surface) hover:border-(--line-strong)/60 transition-all duration-200 space-y-1 text-center sm:text-left"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-(--text-1) font-mono tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-(--text-2)">
                {stat.label}
              </div>
              <div className="text-xs text-(--text-muted) font-sans">
                {stat.subtext}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Engineering Principles */}
      <section className="space-y-6 pt-6">
        <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-(--line) pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-(--text-1) tracking-tight">
              Engineering Principles
            </h2>
            <p className="text-xs sm:text-sm text-(--text-mid) mt-1">
              Core guidelines that steer my design, architecture, and code execution.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {principles.map((pr) => {
            const Icon = iconMap[pr.icon] || Shield;
            return (
              <motion.div
                key={pr.title}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border border-(--line-strong) bg-(--surface) hover:border-(--line-strong)/80 transition-all duration-200 flex flex-col justify-between space-y-5 group shadow-lg"
              >
                <div className="space-y-4">
                  <div className="p-3 w-max rounded-xl bg-(--surface-2) border border-(--line-strong) text-emerald-400 group-hover:border-emerald-500/40 group-hover:text-emerald-300 transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-base text-(--text-1) tracking-tight">
                    {pr.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-(--text-mid) leading-relaxed font-sans">
                    {pr.description}
                  </p>
                </div>
                
                <div className="pt-3 border-t border-(--line) flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-medium">
                  <CheckCircle className="h-4 w-4" />
                  <span>Enforced Standard</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Beyond Development */}
      <section className="space-y-6 pt-6 border-t border-(--line)">
        <motion.div variants={itemVariants} className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-(--text-1) tracking-tight">
            Beyond Development
          </h2>
          <p className="text-xs sm:text-sm text-(--text-mid) max-w-[700px] leading-relaxed">
            {about?.interests || 'When I am not auditing code or designing interfaces, I engage in open-source exploration, technical writing, and problem-solving.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {interestHighlights.map((item) => {
            const Icon = iconMap[item.icon] || Sparkles;
            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={{ y: -3 }}
                className="p-5 rounded-xl border border-(--line-strong) bg-(--surface) hover:border-(--line-strong) transition-all duration-200 space-y-2"
              >
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-sm text-(--text-1)">{item.title}</h3>
                </div>
                <p className="text-xs text-(--text-mid) leading-relaxed font-sans">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}
