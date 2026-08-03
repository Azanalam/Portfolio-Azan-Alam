import { motion, type Variants } from 'motion/react';
import { Briefcase, ArrowUpRight, Code, Cpu, Zap, Layers, Rocket, Shield, Globe, Settings, Check } from 'lucide-react';
import { ComponentType } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';

interface ServicesProps {
  onNavigate: (path: string) => void;
}

const iconMap: Record<string, ComponentType<any>> = {
  Code,
  Cpu,
  Zap,
  Layers,
  Rocket,
  Shield,
  Globe,
  Settings,
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 16 },
  },
};

export default function Services({ onNavigate }: ServicesProps) {
  const { data, loading } = usePortfolio();

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center font-mono text-xs text-(--text-muted) gap-2">
        <svg className="animate-spin h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Loading service catalog...</span>
      </div>
    );
  }

  const services = data?.services || [];

  return (
    <motion.div
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
      initial="hidden"
      animate="visible"
      className="space-y-12 py-12 md:py-16"
    >
      {/* Title Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
          <Briefcase className="h-4 w-4" />
          <span>SERVICE CATALOG</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-(--text-1)">
          How I Can Help You Ship
        </h1>
        <p className="text-sm sm:text-base text-(--text-mid) max-w-2xl font-sans">
          From launching a high-performance website to building out a complete product with a secure backend — every engagement starts with a scoped, transparent handshake.
        </p>
      </div>

      {services.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-(--line) bg-(--surface)/30">
          <p className="text-xs font-mono text-(--text-muted)">No services published yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Code;
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -3 }}
                className={`flex flex-col justify-between p-7 rounded-2xl border transition-all ${
                  service.highlight
                    ? 'bg-(--surface) border-emerald-500/30 shadow-[0_0_40px_-20px_rgba(16,185,129,0.25)]'
                    : 'bg-(--surface) border-(--line) hover:border-(--line-strong)'
                }`}
              >
                <div className="space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl bg-(--surface-2) border border-(--line) text-emerald-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    {service.highlight && (
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 rounded">
                        Most requested
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="text-lg font-bold text-(--text-1) tracking-tight">{service.title}</h2>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">{service.price}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-(--text-mid) leading-relaxed">{service.description}</p>
                  </div>

                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-(--text-muted) font-sans">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 mt-6 border-t border-(--line)">
                  <button
                    onClick={() => onNavigate('/contact')}
                    className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-(--text-1) hover:text-emerald-500 transition cursor-pointer bg-transparent border-none"
                  >
                    <span>{service.ctaLabel || 'Start a project'}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Process strip */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-xl border border-(--line) bg-(--surface)/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-400">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-(--text-1)">Clear process, no surprises</h3>
            <p className="text-xs text-(--text-muted) mt-0.5">Scope → Build → Test → Handoff & support.</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('/contact')}
          className="inline-flex items-center justify-center gap-2 bg-(--cta-bg) hover:bg-(--cta-hover) text-(--cta-fg) font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition cursor-pointer"
        >
          <span>Discuss your project</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </motion.div>
    </motion.div>
  );
}