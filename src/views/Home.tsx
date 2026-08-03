import { ReactNode } from 'react';
import { motion, type Variants } from 'motion/react';
import { ArrowUpRight, ArrowRight, Github, Code, Briefcase, Sparkles, Terminal, GraduationCap, Layers } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { data, loading, theme } = usePortfolio();

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center font-mono text-xs text-[#71717A] gap-2">
        <svg className="animate-spin h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Initializing system layout...</span>
      </div>
    );
  }

  // Fallbacks to default data if empty
  const hero = data?.hero;
  const projectsList = data?.projects || [];
  const experiencesList = data?.experiences || [];
  const educationList = data?.education || [];
  const testimonialsList = data?.testimonials || [];

  const featuredProjects = projectsList.filter((p) => p.featured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projectsList.slice(0, 2);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  // Section components mapped by key
  const sectionMap: Record<string, ReactNode> = {
    hero: (
      <section className="relative px-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Hero Bento Card */}
          <motion.div 
            variants={itemVariants}
            className={`lg:col-span-8 border rounded-xl p-8 flex flex-col justify-between min-h-[360px] ${
              theme === 'light'
                ? 'bg-gradient-to-br from-[#FFFFFF] to-[#F4F4F5] border-[#E4E4E7]'
                : 'bg-gradient-to-br from-[#111111] to-[#050505] border-[#1A1A1A]'
            }`}
          >
            <div>
              {/* Status Indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-[#27272A] rounded-full mb-6">
                <div className={`w-1.5 h-1.5 ${hero?.availability !== false ? 'bg-emerald-500' : 'bg-zinc-500'} rounded-full ${hero?.availability !== false ? 'animate-pulse' : ''}`}></div>
                <span className={`text-[10px] uppercase font-bold ${hero?.availability !== false ? 'text-emerald-500' : 'text-zinc-500'}`}>
                  {hero?.statusBadge || 'Available'}
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-serif italic text-left text-[52px] font-bold tracking-tighter text-[#FAFAFA] leading-[1.05]">
                {hero?.headline || 'Systems architect building resilient, high-scale digital products.'}
              </h1>
              
              <p className="mt-4 text-[#71717A] max-w-xl text-sm sm:text-base leading-relaxed">
                {hero?.description || 'Focusing on distributed systems, compilers, offline-first architectures, and developer experience at the intersection of design and robust logic.'}
              </p>
            </div>

            {/* Actions row */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              {hero?.ctaButtons && hero.ctaButtons.length > 0 ? (
                hero.ctaButtons.map((btn, bIdx) => (
                  <button
                    key={bIdx}
                    onClick={() => {
                      if (btn.hash.startsWith('/')) {
                        onNavigate(btn.hash);
                      } else {
                        window.location.hash = btn.hash;
                      }
                    }}
                    className={
                      btn.primary
                        ? "group inline-flex items-center gap-2 bg-[#FAFAFA] hover:bg-white text-black font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-all duration-200 cursor-pointer"
                        : "inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#222] text-[#FAFAFA] border border-[#27272A] font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-all duration-200 cursor-pointer"
                    }
                  >
                    <span>{btn.label}</span>
                    {btn.primary && <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />}
                  </button>
                ))
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('/projects')}
                    className="group inline-flex items-center gap-2 bg-[#FAFAFA] hover:bg-white text-black font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <span>Explore Technical Cases</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  
                  <button
                    onClick={() => onNavigate('/contact')}
                    className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#222] text-[#FAFAFA] border border-[#27272A] font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <span>Initialize Handshake</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Quick Technical Summary Panel (Expertise Log) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#71717A] font-bold mb-4 block">Expertise Specs</span>
              
              <div className="space-y-3.5 font-sans">
                {hero?.statistics && hero.statistics.length > 0 ? (
                  hero.statistics.map((stat, sIdx) => (
                    <div key={sIdx} className="flex justify-between items-end border-b border-[#1A1A1A] pb-2">
                      <span className="text-sm font-medium text-[#FAFAFA]">{stat.label}</span>
                      <span className="text-xs text-[#71717A] font-mono italic">{stat.value}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between items-end border-b border-[#1A1A1A] pb-2">
                      <span className="text-sm font-medium text-[#FAFAFA]">Frontend Stack</span>
                      <span className="text-xs text-[#71717A] font-mono italic">React, TypeScript, Vite</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-[#1A1A1A] pb-2">
                      <span className="text-sm font-medium text-[#FAFAFA]">Backend Stack</span>
                      <span className="text-xs text-[#71717A] font-mono italic">Express, Supabase, PostgreSQL</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-[#1A1A1A] pb-2">
                      <span className="text-sm font-medium text-[#FAFAFA]">Product Design</span>
                      <span className="text-xs text-[#71717A] font-mono italic">Figma, Design Ops</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="p-4 bg-[#111111] rounded-lg border border-[#1A1A1A]">
                <span className="text-[9px] block mb-1 text-[#71717A] uppercase tracking-wider font-mono">Current Focus</span>
                <p className="text-xs leading-relaxed italic text-[#A1A1AA]">
                  {data?.about?.careerGoals || "Optimizing edge compute runtimes for sub-10ms cold starts in serverless sandboxes."}
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    ),

    projects: (
      <section className="space-y-6">
        <motion.div variants={itemVariants} className="flex items-end justify-between border-b border-[#1A1A1A] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
              <Code className="h-4 w-4" />
              <span>Production Work</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAFA]">Featured Case Studies</h2>
          </div>
          
          <button 
            onClick={() => onNavigate('/projects')}
            className="group flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#71717A] hover:text-[#FAFAFA] transition cursor-pointer bg-transparent border-none"
          >
            <span>All projects</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>

        {/* Custom Bento Grid Cards */}
        {displayProjects.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] text-xs font-mono text-[#71717A]">
            No projects in pipeline. Customize via the CMS admin interface.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                className={`flex flex-col justify-between p-6 sm:p-8 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl hover:border-[#27272A] transition-all ${
                  index === 0 && displayProjects.length > 1 ? 'md:col-span-2 md:grid md:grid-cols-12 md:gap-8 md:items-center' : ''
                }`}
              >
                
                <div className={index === 0 && displayProjects.length > 1 ? 'md:col-span-7 space-y-5' : 'space-y-4'}>
                  {/* Category & Tags */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold bg-[#111] border border-[#1A1A1A] text-emerald-500 rounded">
                      {project.category}
                    </span>
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-block text-[10px] font-mono text-[#71717A]">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Micro metrics bento spec */}
                  {project.performance && project.performance.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-[#1A1A1A] font-mono text-[10px] text-[#71717A]">
                      <div>
                        <div className="text-[#52525B]">PERF METRIC</div>
                        <div className="font-semibold text-[#FAFAFA] mt-0.5">{project.performance[0]?.metric || 'Latency'}</div>
                      </div>
                      <div>
                        <div className="text-[#52525B]">OPTIMIZATION</div>
                        <div className="font-semibold text-[#FAFAFA] mt-0.5">{project.performance[0]?.after || '60 FPS'}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-1">
                    <button
                      onClick={() => onNavigate(`/projects/${project.slug}`)}
                      className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-white hover:text-emerald-500 transition-colors duration-150 cursor-pointer bg-transparent border-none"
                    >
                      <span>Read Engineering study</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-[#71717A] hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="h-3.5 w-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Graphical Visual Panel for the first top bento item */}
                {index === 0 && displayProjects.length > 1 && (
                  <div className="hidden md:flex md:col-span-5 h-full min-h-[220px] rounded-lg border border-[#1A1A1A] bg-[#111111] flex-col justify-between p-4 font-mono text-[10px] text-[#71717A]">
                    <div className="flex items-center justify-between border-b border-[#1A1A1A]/80 pb-2">
                      <span>STACK_MONITOR</span>
                      <span className="text-emerald-500 animate-pulse">● SAMPLING</span>
                    </div>
                    
                    {/* Visual simulated bytes flow */}
                    <div className="space-y-1.5 py-4">
                      <div className="flex justify-between">
                        <span>VM Code Decoded:</span>
                        <span className="text-[#FAFAFA] font-medium">1,024 byte vectors</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Control AST AST:</span>
                        <span className="text-[#FAFAFA] font-medium">O(1) compiled table</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Memory boundaries:</span>
                        <span className="text-emerald-500 font-medium">Isolated sandboxed</span>
                      </div>
                      <div className="w-full bg-[#1A1A1A] h-1 rounded overflow-hidden mt-2">
                        <div className="h-full bg-emerald-500 rounded w-[85%] animate-pulse" />
                      </div>
                    </div>

                    <div className="border-t border-[#1A1A1A]/80 pt-2 text-[9px] text-[#52525B]">
                      AUTO_TUNED PIPELINES
                    </div>
                  </div>
                )}

              </motion.div>
            ))}
          </div>
        )}
      </section>
    ),

    services: (
      <section className="space-y-6">
        <motion.div variants={itemVariants} className="flex items-end justify-between border-b border-[#1A1A1A] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
              <Layers className="h-4 w-4" />
              <span>What I Offer</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAFA]">Services & Engagements</h2>
          </div>

          <button
            onClick={() => onNavigate('/services')}
            className="group flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#71717A] hover:text-[#FAFAFA] transition cursor-pointer bg-transparent border-none"
          >
            <span>All services</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>

        {(data?.services || []).length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] text-xs font-mono text-[#71717A]">
            No services in catalog. Customize via the CMS admin interface.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(data?.services || []).slice(0, 3).map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -3 }}
                className="flex flex-col justify-between p-6 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl hover:border-[#27272A] transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-lg bg-[#111] border border-[#1A1A1A] text-emerald-400">
                      <Layers className="h-4 w-4" />
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      {service.price}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-white tracking-tight">{service.title}</h3>
                    <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-3">{service.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="pt-4 mt-4 border-t border-[#1A1A1A] inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-white hover:text-emerald-500 transition-colors cursor-pointer bg-transparent border-none"
                >
                  <span>{service.ctaLabel || 'Start a project'}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    ),

    experiences: (
      <section className="space-y-12">
        {/* Employment Record */}
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="space-y-1 border-b border-[#1A1A1A] pb-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
              <Briefcase className="h-4 w-4" />
              <span>Employment Record</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAFA]">Engineering Experience</h2>
          </motion.div>

          {experiencesList.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] text-xs font-mono text-[#71717A]">
              No career milestones added. Edit via Career Milestones admin tab.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experiencesList.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((exp) => (
                <motion.div
                  key={exp.id || exp.company}
                  variants={itemVariants}
                  className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 hover:border-[#27272A] transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="font-mono text-xs font-bold text-emerald-500">{exp.period}</div>
                      <span className="text-[9px] font-mono tracking-widest text-[#71717A] uppercase">LEADERSHIP SPEC</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {exp.role} <span className="text-[#71717A] font-medium">@</span> {exp.company}
                      </h3>
                    </div>

                    <ul className="space-y-2 text-xs text-[#A1A1AA] list-none leading-relaxed">
                      {exp.description.map((desc, dIdx) => (
                        <li key={dIdx} className="flex gap-2 items-start">
                          <span className="text-emerald-500 select-none shrink-0">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {exp.tags && exp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#1A1A1A] mt-4">
                      {exp.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-[9px] font-mono text-[#A1A1AA] bg-[#111] border border-[#1A1A1A] rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Academic Milestones */}
        {educationList.length > 0 && (
          <div className="space-y-6 pt-2">
            <motion.div variants={itemVariants} className="space-y-1 border-b border-[#1A1A1A] pb-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
                <GraduationCap className="h-4 w-4" />
                <span>Academic Record</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAFA]">Academic Milestones & Education</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {educationList.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((edu) => (
                <motion.div
                  key={edu.id || edu.school}
                  variants={itemVariants}
                  className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 hover:border-[#27272A] transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="font-mono text-xs font-bold text-emerald-500">{edu.years || (edu as any).period || 'Academic'}</div>
                      <span className="text-[9px] font-mono tracking-widest text-[#71717A] uppercase">ACADEMIC SPEC</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white">{edu.degree}</h3>
                      <p className="text-xs font-semibold text-zinc-400">{edu.school}</p>
                    </div>

                    {edu.description && (
                      <p className="text-xs text-[#A1A1AA] leading-relaxed pt-1 font-sans">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>
    ),

    education: (
      <section className="space-y-6">
        <motion.div variants={itemVariants} className="space-y-1 border-b border-[#1A1A1A] pb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
            <GraduationCap className="h-4 w-4" />
            <span>Academic Record</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAFA]">Academic Milestones & Education</h2>
        </motion.div>

        {educationList.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] text-xs font-mono text-[#71717A]">
            No academic milestones added. Edit via Academic Milestones in CMS.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educationList.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((edu) => (
              <motion.div
                key={edu.id || edu.school}
                variants={itemVariants}
                className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 hover:border-[#27272A] transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="font-mono text-xs font-bold text-emerald-500">{edu.years || (edu as any).period || 'Academic'}</div>
                    <span className="text-[9px] font-mono tracking-widest text-[#71717A] uppercase">ACADEMIC SPEC</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">{edu.degree}</h3>
                    <p className="text-xs font-semibold text-zinc-400">{edu.school}</p>
                  </div>

                  {edu.description && (
                    <p className="text-xs text-[#A1A1AA] leading-relaxed pt-1 font-sans">
                      {edu.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    ),

    testimonials: (
      <section className="space-y-6">
        <motion.div variants={itemVariants} className="space-y-1 border-b border-[#1A1A1A] pb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
            <Sparkles className="h-4 w-4" />
            <span>Professional Endorsements</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAFA]">Testimonials</h2>
        </motion.div>

        {testimonialsList.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] text-xs font-mono text-[#71717A]">
            No endorsements listed.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonialsList.slice().sort((a, b) => a.order - b.order).map((test) => (
              <motion.div
                key={test.id}
                variants={itemVariants}
                className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 flex flex-col justify-between hover:border-[#27272A] transition-colors"
              >
                <p className="text-xs sm:text-sm text-[#A1A1AA] italic leading-relaxed">
                  "{test.quote}"
                </p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#1A1A1A]">
                  {test.image ? (
                    <img 
                      src={test.image} 
                      alt={test.name} 
                      className="h-8 w-8 rounded-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#111] border border-[#1A1A1A] flex items-center justify-center font-mono text-xs text-emerald-500 font-bold shrink-0">
                      {test.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-xs text-white">{test.name}</h4>
                    <p className="text-[9px] text-[#71717A] font-mono leading-none mt-0.5">{test.position} @ {test.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    ),

    contact: (
      <section>
        <motion.div
          variants={itemVariants}
          className="bg-[#FAFAFA] text-black rounded-xl p-8 sm:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden"
        >
          {/* Accent decoration line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-white to-neutral-400" />
          
          <div className="space-y-3 max-w-2xl">
            <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest text-[#71717A]">GET IN TOUCH</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-black leading-tight">Have a high-scale challenge to solve?</h2>
            <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed font-sans">
              I collaborate with technical founders, hiring managers, and product leads to engineer resilient infrastructure. Let's arrange a brief, structured video session.
            </p>
          </div>

          <div className="relative pt-2 shrink-0">
            <button
              onClick={() => onNavigate('/contact')}
              className="inline-flex items-center gap-2 bg-black hover:bg-neutral-900 text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-sm transition-all duration-200 shadow-md cursor-pointer"
            >
              <span>Contact</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </section>
    ),
  };

  const defaultOrder = ['hero', 'services', 'projects', 'experiences', 'testimonials', 'contact'];
  // Normalise names (e.g. settings says 'experience', our key is 'experiences')
  const orderRaw = data?.layout?.sectionOrder || defaultOrder;
  const hidden = data?.layout?.hiddenSections || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 py-12 md:py-16"
    >
      {orderRaw.map((secKey) => {
        let key = secKey;
        if (secKey === 'experience') key = 'experiences';
        if (hidden.includes(secKey) || hidden.includes(key)) return null;
        
        const renderNode = sectionMap[key];
        if (!renderNode) return null;

        return <div key={secKey}>{renderNode}</div>;
      })}
    </motion.div>
  );
}
