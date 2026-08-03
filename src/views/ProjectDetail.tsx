import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Github, Cpu, ShieldAlert, CheckCircle, ArrowUpRight, Code, BarChart2, BookOpen } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';

interface ProjectDetailProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export default function ProjectDetail({ slug, onNavigate }: ProjectDetailProps) {
  const { data, loading } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'performance' | 'challenges'>('overview');

  const projects = data?.projects || [];
  const project = projects.find((p) => p.slug === slug);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center font-mono text-xs text-(--text-muted) gap-2">
        <svg className="animate-spin h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Compiling case study AST...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-(--text-1)">Engineering study not found</h2>
        <p className="text-(--text-mid)">The requested compiled slug does not exist in our static registry.</p>
        <button
          onClick={() => onNavigate('/projects')}
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-500 font-mono hover:underline cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to index</span>
        </button>
      </div>
    );
  }

  const tabItems = [
    { id: 'overview', label: '1. Problem & Solution', icon: BookOpen },
    { id: 'architecture', label: '2. Architecture & Files', icon: Code },
    { id: 'challenges', label: '3. Challenges & Tradeoffs', icon: ShieldAlert },
    { id: 'performance', label: '4. Benchmarks & A11y', icon: BarChart2 },
  ] as const;

  return (
    <div className="space-y-12 py-12 md:py-16 max-w-5xl">
      
      {/* Back to Project Index Button */}
      <div>
        <button
          onClick={() => onNavigate('/projects')}
          className="group inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-(--text-muted) hover:text-(--text-1) transition-colors cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Return to Projects catalog</span>
        </button>
      </div>

      {/* Header Headline Case Summary */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wider bg-(--surface-2) border border-(--line) text-emerald-500 rounded">
            CASE STUDY // {project.category.toUpperCase()}
          </span>
          <span className="text-xs font-mono text-(--text-faint)">
            STRICT TYPE SAFETY
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-(--text-1) leading-[1.1]">
            {project.title}: {project.subtitle}
          </h1>
          <p className="text-base sm:text-lg text-(--text-mid) max-w-3xl leading-relaxed">
            {project.longDescription}
          </p>
        </div>

        {/* Dynamic Buttons Block */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-(--cta-bg) hover:bg-(--cta-hover) text-(--cta-fg) font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-all"
            >
              <Github className="h-4 w-4" />
              <span>Inspect Source Code</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              className="inline-flex items-center gap-1.5 bg-(--surface-3) hover:bg-(--line-strong) text-(--text-1) border border-(--line-strong) font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-all"
            >
              <span>Explore Prototype</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Technical Spec Matrix (Bento Box) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl border border-(--line) bg-(--surface) font-mono text-xs text-(--text-muted)">
        <div>
          <div className="text-(--text-faint)">CATEGORY</div>
          <div className="font-bold text-(--text-1) capitalize mt-0.5">{project.category}</div>
        </div>
        <div>
          <div className="text-(--text-faint)">COMPLIANCE</div>
          <div className="font-bold text-(--text-1) mt-0.5">WCAG 2.2 AA</div>
        </div>
        <div>
          <div className="text-(--text-faint)">BUNDLE SIZE</div>
          <div className="font-bold text-(--text-1) mt-0.5">Under 25KB gz</div>
        </div>
        <div>
          <div className="text-(--text-faint)">PLATFORM</div>
          <div className="font-bold text-(--text-1) mt-0.5 font-mono">Web (ES2022)</div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-(--line)">
        <div className="flex overflow-x-auto gap-2 pb-px" role="tablist" aria-label="Case Study Modules">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-xs font-mono font-bold uppercase tracking-tight whitespace-nowrap border-b-2 transition-all focus-visible:outline-none cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 text-(--text-1) font-bold'
                    : 'border-transparent text-(--text-muted) hover:text-(--text-1) hover:border-(--line)'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="pt-2 min-h-[400px]">
        
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            <div className="md:col-span-8 space-y-8">
              {/* Problem statement */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-(--text-1) tracking-tight flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-emerald-500" />
                  <span>The Problem Statement</span>
                </h3>
                <p className="text-sm sm:text-base text-(--text-mid) leading-relaxed font-sans">
                  {project.problemStatement}
                </p>
              </div>

              {/* Proposed Solution */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-(--text-1) tracking-tight flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>The Engineering Solution</span>
                </h3>
                <p className="text-sm sm:text-base text-(--text-mid) leading-relaxed font-sans">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Strategic Goals Column */}
            <div className="md:col-span-4 p-6 rounded-xl border border-(--line) bg-(--surface) space-y-4 font-sans text-xs">
              <h3 className="font-bold text-(--text-1) uppercase tracking-wider font-mono text-[10px]">Project Goals</h3>
              <ul className="space-y-3 text-(--text-mid)">
                {project.goals && project.goals.map((g, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-mono text-[10px] shrink-0 font-bold">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Architecture */}
        {activeTab === 'architecture' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            <div className="md:col-span-7 space-y-6">
              <h3 className="text-lg font-bold text-(--text-1) tracking-tight flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-500" />
                <span>Systems Architecture</span>
              </h3>
              <p className="text-sm sm:text-base text-(--text-mid) leading-relaxed font-sans">
                {project.architecture}
              </p>
              <div className="p-5 rounded-lg border border-(--line) bg-(--surface) font-mono text-[11px] text-(--text-mid) leading-relaxed space-y-2">
                <div className="font-bold text-(--text-1)">ARCHITECTURAL INVARIANT:</div>
                <p>The solution completely isolates execution context from the main browser scope, preventing arbitrary document object models access while maintaining constant low latency channels.</p>
              </div>
            </div>

            {/* Folder Structure Code Panel */}
            <div className="md:col-span-5 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-(--text-muted) block">Directory Map</span>
              <div className="rounded-xl border border-(--line) bg-(--surface-2) text-(--text-1) p-5 font-mono text-xs leading-relaxed overflow-x-auto shadow-lg">
                <div className="flex items-center gap-1.5 border-b border-(--line) pb-3 mb-3 text-(--text-muted)">
                  <span className="w-2 h-2 rounded-full bg-red-500/60" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
                  <span className="ml-2 text-[10px]">manifest.json // structure</span>
                </div>
                <pre className="text-xs text-(--text-1)">{project.folderStructure}</pre>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Challenges & Trade-offs */}
        {activeTab === 'challenges' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Challenges list */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-(--text-1) tracking-tight border-b border-(--line) pb-2">Technical Challenges Overcome</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.challenges && project.challenges.map((c, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-(--line) bg-(--surface) space-y-2.5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wide bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded">CHALLENGE {idx + 1}</span>
                    </div>
                    <h4 className="font-bold text-sm text-(--text-1) tracking-tight">{c.title}</h4>
                    <p className="text-xs text-(--text-muted) leading-relaxed font-sans">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trade-offs analysis */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-(--text-1) tracking-tight border-b border-(--line) pb-2">Strategic Trade-offs</h3>
              <div className="space-y-4">
                {project.tradeoffs && project.tradeoffs.map((t, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-(--line) bg-(--surface) grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-3">
                      <div className="text-[10px] font-mono text-(--text-faint)">DESIGN DECISION</div>
                      <div className="font-bold text-sm text-(--text-1) tracking-tight mt-0.5">{t.title}</div>
                    </div>
                    <div className="md:col-span-4">
                      <div className="text-[10px] font-mono text-(--text-faint)">CHOSEN APPROACH</div>
                      <div className="font-semibold text-xs text-emerald-500 mt-0.5">{t.choice}</div>
                    </div>
                    <div className="md:col-span-5">
                      <div className="text-[10px] font-mono text-(--text-faint)">RATIONALE & TRADE-OFF</div>
                      <div className="text-xs text-(--text-mid) leading-relaxed mt-0.5 font-sans">{t.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 4: Performance & Accessibility */}
        {activeTab === 'performance' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            {/* Performance table */}
            <div className="md:col-span-7 space-y-6">
              <h3 className="text-lg font-bold text-(--text-1) tracking-tight">Performance Auditing & Benchmarks</h3>
              
              <div className="overflow-x-auto rounded-lg border border-(--line) bg-(--surface)">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-(--bg) text-(--text-muted) font-mono uppercase text-[9px] border-b border-(--line)">
                      <th className="p-3">METRIC</th>
                      <th className="p-3 text-center">BEFORE</th>
                      <th className="p-3 text-center text-emerald-500 font-bold">AFTER</th>
                      <th className="p-3">METHODOLOGY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-(--line) font-sans text-(--text-mid)">
                    {project.performance && project.performance.map((perf, idx) => (
                      <tr key={idx} className="hover:bg-(--surface-2)/30">
                        <td className="p-3 font-semibold text-(--text-1)">{perf.metric}</td>
                        <td className="p-3 text-center font-mono text-(--text-muted)">{perf.before}</td>
                        <td className="p-3 text-center font-mono text-emerald-500 font-bold">{perf.after}</td>
                        <td className="p-3 text-(--text-muted) text-xs leading-relaxed">{perf.technique}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Accessibility considerations */}
            <div className="md:col-span-5 space-y-4 p-6 rounded-xl border border-(--line) bg-(--surface) font-sans text-xs">
              <h3 className="font-bold text-sm text-(--text-1) border-b border-(--line) pb-2 uppercase tracking-widest font-mono text-[10px]">Accessibility Measures</h3>
              <ul className="space-y-3 text-(--text-mid) leading-relaxed">
                {project.accessibility && project.accessibility.map((a, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-(--line) flex items-center gap-2 text-[9px] text-(--text-faint) font-mono">
                <span>CONFORMS TO SEC 508 & WCAG 2.2 AAA</span>
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* Lessons learned & closing case card */}
      <section className="pt-6 border-t border-(--line)">
        <div className="p-6 sm:p-8 rounded-xl border border-(--line) bg-(--surface) space-y-4">
          <h3 className="font-bold text-xs text-(--text-1) tracking-widest font-mono uppercase text-[10px]">Key Engineering Lessons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-(--text-mid) leading-relaxed font-sans">
            {project.lessons && project.lessons.map((lesson, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-500">LESSON {idx + 1}</span>
                <p className="text-xs sm:text-sm text-(--text-mid)">{lesson}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
