import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowUpRight, Github, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';

interface ProjectsProps {
  onNavigate: (path: string) => void;
}

export default function Projects({ onNavigate }: ProjectsProps) {
  const { data, loading } = usePortfolio();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categories = [
    { label: 'All Projects', value: 'all' },
    { label: 'Systems / WASM', value: 'systems' },
    { label: 'Full-Stack Sync', value: 'fullstack' },
    { label: 'Frontend Architecture', value: 'frontend' },
    { label: 'Tooling & Pipelines', value: 'tooling' },
  ];

  const projects = data?.projects || [];

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [projects]);

  // Compute dynamic project count matching each tag contextually
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch = !search.trim() ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      
      if (matchCategory && matchSearch) {
        p.tags.forEach((t) => {
          counts[t] = (counts[t] || 0) + 1;
        });
      }
    });
    return counts;
  }, [projects, search, selectedCategory]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filter projects dynamically
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' || project.category === selectedCategory;

      const matchTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => project.tags.includes(tag));

      return matchSearch && matchCategory && matchTags;
    });
  }, [projects, search, selectedCategory, selectedTags]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center font-mono text-xs text-[#71717A] gap-2">
        <svg className="animate-spin h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Loading project indices...</span>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-12 md:py-16">
      
      {/* Title Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
          <SlidersHorizontal className="h-4 w-4" />
          <span>PORTFOLIO INDEX</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-[#FAFAFA]">
          Technical Works & Case Studies
        </h1>
        <p className="text-sm sm:text-base text-[#A1A1AA] max-w-2xl font-sans">
          Each project represents an original, deeply integrated system built to address performance, safety, or accessibility limits on the modern web platform.
        </p>
      </div>

      {/* Interactive Filter Toolbar (Bento Style) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A]">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
          <input
            type="text"
            placeholder="Search projects by stack, feature, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#050505] border border-[#1A1A1A] rounded-lg text-sm text-white placeholder-[#52525B] focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-150"
            aria-label="Search cases"
          />
        </div>

        {/* Categories Tab Row */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0" role="tablist" aria-label="Project categories">
          {categories.map((cat) => (
            <button
              key={cat.value}
              role="tab"
              aria-selected={selectedCategory === cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 text-[10px] font-mono font-bold tracking-tight uppercase rounded-md border transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-white text-black border-white shadow-sm'
                  : 'bg-[#1A1A1A] text-[#A1A1AA] border-[#27272A] hover:text-white hover:border-[#52525B]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Technology Stack Filter Deck */}
      <div className="p-5 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A]/60 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FAFAFA]">
              Filter by Technology Stack
            </span>
          </div>
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="text-[9px] font-mono font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-wider cursor-pointer hover:underline transition"
            >
              Reset Stack Filter ({selectedTags.length} active)
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            const count = tagCounts[tag] || 0;
            const disabled = count === 0 && !isSelected;

            return (
              <button
                key={tag}
                disabled={disabled}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-[9px] font-mono rounded border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/50'
                    : disabled
                    ? 'opacity-30 bg-[#050505] text-[#52525B] border-[#121215] cursor-not-allowed'
                    : 'bg-[#111] text-[#71717A] border-[#1A1A1A] hover:text-white hover:border-[#27272A]'
                }`}
              >
                <span>{tag}</span>
                {count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${
                    isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#1A1A1D] text-[#52525B]'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid List */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-[#1A1A1A] bg-[#0A0A0A]/30 px-4"
            >
              <AlertCircle className="h-10 w-10 text-[#71717A] mb-3" />
              <h3 className="text-base font-bold text-white">No cases matching filter parameters</h3>
              <p className="text-xs text-[#71717A] max-w-sm mt-1">
                Try resetting your search filter or selecting the "All Projects" category to review other compilations.
              </p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedTags([]); }}
                className="mt-4 text-xs font-bold uppercase tracking-wider text-emerald-500 font-mono hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -3 }}
                  className="flex flex-col justify-between p-6 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] hover:border-[#27272A] transition-all"
                >
                  <div className="space-y-4">
                    {/* Top Meta info */}
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#111] border border-[#1A1A1A] text-emerald-500 rounded">
                        {project.category}
                      </span>
                      <span className="text-[9px] font-mono text-[#52525B] uppercase tracking-wider">
                        AA COMPLIANT
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-[10px] text-[#71717A] font-mono line-clamp-1">
                        {project.subtitle}
                      </p>
                      <p className="text-xs sm:text-sm text-[#A1A1AA] line-clamp-3 leading-relaxed pt-1">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer tags & CTA */}
                  <div className="pt-4 mt-6 border-t border-[#1A1A1A] space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[9px] font-mono text-[#71717A] bg-[#111] border border-[#1A1A1A] rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => onNavigate(`/projects/${project.slug}`)}
                        className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-white hover:text-emerald-500 transition cursor-pointer bg-transparent border-none"
                      >
                        <span>Case study</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-[#71717A] hover:text-white transition-colors"
                          aria-label={`View ${project.title} source on GitHub`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>

                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
