import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Trash2, Plus, Edit3, Check, Save, ExternalLink, ShieldAlert, Sparkles, FolderOpen } from 'lucide-react';
import { DBStructure, Project } from '../../types';

interface ProjectsManagerProps {
  data: DBStructure;
  onUpdate: (updatedDB: DBStructure) => Promise<void>;
}

export default function ProjectsManager({ data, onUpdate }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<(Project & { published?: boolean; order?: number; seoTitle?: string; seoDescription?: string; seoKeywords?: string[]; images?: string[] })[]>(data.projects || []);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Field Array helpers for active form
  const [newTag, setNewTag] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newA11y, setNewA11y] = useState('');
  const [newLesson, setNewLesson] = useState('');

  // Complex substructures helpers for active form
  const [newPerfMetric, setNewPerfMetric] = useState('');
  const [newPerfBefore, setNewPerfBefore] = useState('');
  const [newPerfAfter, setNewPerfAfter] = useState('');
  const [newPerfTech, setNewPerfTech] = useState('');

  const [newChalTitle, setNewChalTitle] = useState('');
  const [newChalDesc, setNewChalDesc] = useState('');

  const [newTradeTitle, setNewTradeTitle] = useState('');
  const [newTradeChoice, setNewTradeChoice] = useState('');
  const [newTradeReason, setNewTradeReason] = useState('');

  const [newSeoKeyword, setNewSeoKeyword] = useState('');

  const handleEditClick = (p: any) => {
    setEditingProject({
      ...p,
      tags: p.tags || [],
      goals: p.goals || [],
      accessibility: p.accessibility || [],
      lessons: p.lessons || [],
      performance: p.performance || [],
      challenges: p.challenges || [],
      tradeoffs: p.tradeoffs || [],
      seoKeywords: p.seoKeywords || [],
      images: p.images || [],
    });
    setIsCreating(false);
  };

  const handleCreateClick = () => {
    setEditingProject({
      slug: '',
      title: '',
      subtitle: '',
      description: '',
      longDescription: '',
      tags: [],
      category: 'frontend',
      githubUrl: '',
      liveUrl: '',
      featured: false,
      published: true,
      order: projects.length,
      problemStatement: '',
      goals: [],
      solution: '',
      architecture: '',
      folderStructure: '',
      challenges: [],
      tradeoffs: [],
      accessibility: [],
      performance: [],
      lessons: [],
      seoTitle: '',
      seoDescription: '',
      seoKeywords: [],
      images: [],
    });
    setIsCreating(true);
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditingProject((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject.slug || !editingProject.title) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', item: editingProject }),
      });

      if (res.ok) {
        const updatedList = isCreating
          ? [...projects, editingProject]
          : projects.map((p) => (p.slug === editingProject.slug ? editingProject : p));

        setProjects(updatedList);
        await onUpdate({ ...data, projects: updatedList });
        setEditingProject(null);
        setIsCreating(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const handleDelete = async (slug: string) => {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', item: { slug } }),
      });

      if (res.ok) {
        const updatedList = projects.filter((p) => p.slug !== slug);
        setProjects(updatedList);
        await onUpdate({ ...data, projects: updatedList });
        if (editingProject?.slug === slug) setEditingProject(null);
        setDeletingSlug(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--line) pb-5">
        <div>
          <h2 className="text-xl font-bold text-(--text-1) flex items-center gap-2">
            <Code className="h-5 w-5 text-emerald-500" />
            <span>Project Case Studies Director</span>
          </h2>
          <p className="text-xs text-(--text-muted) mt-1 uppercase font-mono tracking-wider">
            Edit engineering portfolio items, build pipelines, benchmark specs, structural layout trees, and SEO metadata.
          </p>
        </div>
        {!editingProject && (
          <button
            onClick={handleCreateClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-(--cta-fg) font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Launch New Case Study</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Project Case Studies List */}
        {!editingProject && (
          <div className="xl:col-span-12 space-y-4">
            {projects.length === 0 ? (
              <div className="text-center p-16 border border-dashed border-(--line) bg-(--surface)/50 rounded-2xl">
                <span className="text-[10px] font-mono uppercase tracking-widest text-(--text-muted) block mb-2">Null State Detected</span>
                <p className="text-sm text-(--text-muted)">No projects currently available. Press the "Launch New Case Study" button to append work.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.slug}
                    className="p-6 bg-(--surface) border border-(--line) hover:border-(--line-strong) transition rounded-xl flex flex-col justify-between space-y-4 shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase px-1.5 py-0.5 bg-emerald-950/20 border border-emerald-500/10 rounded">
                          {project.category}
                        </span>
                        <div className="flex gap-1.5">
                          {project.featured && (
                            <span className="text-[8px] font-mono uppercase tracking-widest px-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold rounded">
                              Featured
                            </span>
                          )}
                          {!project.published && (
                            <span className="text-[8px] font-mono uppercase tracking-widest px-1 bg-(--surface-3) border border-(--line-strong) text-(--text-mid) font-bold rounded">
                              Draft
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-(--text-1) tracking-tight truncate">
                          {project.title}
                        </h4>
                        <p className="text-xs text-(--text-muted) line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-(--line)">
                      <span className="text-[9px] font-mono text-(--text-faint)">SLUG: /{project.slug}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditClick(project)}
                          className="p-1.5 bg-(--surface-2) hover:bg-(--surface-3) border border-(--line-strong) hover:border-(--line-strong) text-(--text-1) rounded transition cursor-pointer"
                          title="Edit Case Study"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.slug)}
                          className="p-1.5 bg-(--surface-2) hover:bg-red-950/20 border border-(--line-strong) hover:border-red-500/20 text-(--text-muted) hover:text-red-400 rounded transition cursor-pointer"
                          title="Delete Case Study"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Detailed edit/creation form */}
        {editingProject && (
          <form onSubmit={handleSave} className="xl:col-span-12 bg-(--surface) border border-(--line) rounded-2xl p-6 sm:p-8 space-y-8 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--line) pb-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-(--text-muted) block">
                  {isCreating ? 'CREATE METRICS' : 'EDIT WORK_SPEC'}
                </span>
                <h3 className="text-base font-bold text-(--text-1) tracking-tight mt-1">
                  {isCreating ? 'Establish Brand Case Study' : `Re-configure: ${editingProject.title}`}
                </h3>
              </div>

              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 bg-(--surface-2) hover:bg-(--surface-3) border border-(--line) text-(--text-1) text-xs font-bold uppercase tracking-wider rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-(--cta-fg) text-xs font-bold uppercase tracking-wider rounded-lg transition cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Committing...' : 'Commit Specs'}</span>
                </button>
              </div>
            </div>

            {/* Form grid layout split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Primary parameters */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-(--surface-2)/40 border border-(--line) p-5 rounded-xl space-y-4">
                  <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest border-b border-(--line) pb-1.5">
                    1. Primary Meta Parameters
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Unique Path Slug</span>
                      <input
                        type="text"
                        required
                        disabled={!isCreating}
                        placeholder="aether-vm"
                        value={editingProject.slug}
                        onChange={(e) => handleFieldChange('slug', e.target.value)}
                        className="w-full bg-(--surface) border border-(--line) text-(--text-1) rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Project Display Title</span>
                      <input
                        type="text"
                        required
                        placeholder="Aether WASM engine"
                        value={editingProject.title}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        className="w-full bg-(--surface) border border-(--line) text-(--text-1) rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Short Subtitle (Specs summary)</span>
                      <input
                        type="text"
                        placeholder="High-performance compiler in TS"
                        value={editingProject.subtitle}
                        onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                        className="w-full bg-(--surface) border border-(--line) text-(--text-1) rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Project Category</span>
                      <select
                        value={editingProject.category}
                        onChange={(e) => handleFieldChange('category', e.target.value)}
                        className="w-full bg-(--surface) border border-(--line) text-(--text-1) rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                      >
                        <option value="frontend">Frontend Application</option>
                        <option value="fullstack">Fullstack SaaS Application</option>
                        <option value="systems">Systems & Compilers</option>
                        <option value="tooling">Build & Developer Tooling</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">GitHub Repository URL</span>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={editingProject.githubUrl || ''}
                        onChange={(e) => handleFieldChange('githubUrl', e.target.value)}
                        className="w-full bg-(--surface) border border-(--line) text-(--text-1) rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Live Production URL</span>
                      <input
                        type="text"
                        placeholder="#/projects/aether-vm"
                        value={editingProject.liveUrl || ''}
                        onChange={(e) => handleFieldChange('liveUrl', e.target.value)}
                        className="w-full bg-(--surface) border border-(--line) text-(--text-1) rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 p-3 bg-(--surface) border border-(--line) rounded-lg mt-2">
                    <label className="flex items-center gap-2 text-xs text-(--text-1) select-none">
                      <input
                        type="checkbox"
                        checked={editingProject.featured}
                        onChange={(e) => handleFieldChange('featured', e.target.checked)}
                        className="rounded bg-(--surface-2) border-(--line) text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                      />
                      <span>Featured (Display on Homepage)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-(--text-1) select-none">
                      <input
                        type="checkbox"
                        checked={editingProject.published ?? true}
                        onChange={(e) => handleFieldChange('published', e.target.checked)}
                        className="rounded bg-(--surface-2) border-(--line) text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                      />
                      <span>Published (Show in Case Listing)</span>
                    </label>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Short Case Study Synopsis</span>
                    <textarea
                      value={editingProject.description}
                      rows={2}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      className="w-full bg-(--surface) border border-(--line) text-(--text-1) rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 resize-none font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Detailed Engineering Dissertation</span>
                    <textarea
                      value={editingProject.longDescription}
                      rows={5}
                      onChange={(e) => handleFieldChange('longDescription', e.target.value)}
                      className="w-full bg-(--surface) border border-(--line) text-(--text-1) rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 resize-none font-sans"
                    />
                  </div>
                </div>

                {/* Case Study Contexts */}
                <div className="bg-(--surface-2)/40 border border-(--line) p-5 rounded-xl space-y-4">
                  <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest border-b border-(--line) pb-1.5">
                    2. Engineering Case Specifications
                  </h4>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Problem Statement Spec</span>
                    <textarea
                      value={editingProject.problemStatement}
                      rows={3}
                      onChange={(e) => handleFieldChange('problemStatement', e.target.value)}
                      className="w-full bg-(--surface) border border-(--line) text-(--text-1) rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 resize-none font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Solution Overview Summary</span>
                    <textarea
                      value={editingProject.solution}
                      rows={3}
                      onChange={(e) => handleFieldChange('solution', e.target.value)}
                      className="w-full bg-(--surface) border border-(--line) text-(--text-1) rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 resize-none font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Technical Architecture Description</span>
                    <textarea
                      value={editingProject.architecture}
                      rows={3}
                      onChange={(e) => handleFieldChange('architecture', e.target.value)}
                      className="w-full bg-(--surface) border border-(--line) text-(--text-1) rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 resize-none font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Structural Folder Tree Graph (Monospace)</span>
                    <textarea
                      value={editingProject.folderStructure}
                      rows={4}
                      onChange={(e) => handleFieldChange('folderStructure', e.target.value)}
                      className="w-full bg-(--surface) border border-(--line) text-(--text-1) rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 resize-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Tag array matrices & complex substructures */}
              <div className="lg:col-span-5 space-y-6">
                {/* Tech Tags & Objectives */}
                <div className="bg-(--surface-2)/40 border border-(--line) p-5 rounded-xl space-y-4">
                  <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest border-b border-(--line) pb-1.5">
                    3. Technology Matrix & Goals
                  </h4>

                  <div className="space-y-2">
                    <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Core Tech Stack Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {editingProject.tags.map((tag: string) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono text-(--text-1) bg-(--surface) border border-(--line) rounded">
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleFieldChange('tags', editingProject.tags.filter((t: string) => t !== tag))}
                            className="text-red-400 hover:text-red-500 font-bold ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        placeholder="React, WASM"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-grow bg-(--surface) border border-(--line) text-(--text-1) rounded px-2.5 py-1 text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newTag.trim() && !editingProject.tags.includes(newTag.trim())) {
                            handleFieldChange('tags', [...editingProject.tags, newTag.trim()]);
                            setNewTag('');
                          }
                        }}
                        className="px-3 bg-(--cta-bg) text-(--cta-fg) font-bold text-[10px] uppercase rounded"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Milestones / Objective Metrics</span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {editingProject.goals.map((goal: string, idx: number) => (
                        <div key={idx} className="flex gap-2 bg-(--surface) border border-(--line) p-2 rounded justify-between items-start">
                          <p className="text-[11px] text-(--text-2) leading-normal">{goal}</p>
                          <button
                            type="button"
                            onClick={() => handleFieldChange('goals', editingProject.goals.filter((_: any, i: any) => i !== idx))}
                            className="text-red-400 font-bold text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        placeholder="Achieve sub-ms compilations"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        className="flex-grow bg-(--surface) border border-(--line) text-(--text-1) rounded px-2.5 py-1 text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newGoal.trim()) {
                            handleFieldChange('goals', [...editingProject.goals, newGoal.trim()]);
                            setNewGoal('');
                          }
                        }}
                        className="px-3 bg-(--cta-bg) text-(--cta-fg) font-bold text-[10px] uppercase rounded"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Performance Benchmarks */}
                <div className="bg-(--surface-2)/40 border border-(--line) p-5 rounded-xl space-y-4">
                  <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest border-b border-(--line) pb-1.5">
                    4. Performance Benchmarking
                  </h4>

                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {editingProject.performance.map((p: any, idx: number) => (
                      <div key={idx} className="bg-(--surface) border border-(--line) p-2 rounded text-[10px] space-y-1 relative">
                        <button
                          type="button"
                          onClick={() => handleFieldChange('performance', editingProject.performance.filter((_: any, i: any) => i !== idx))}
                          className="absolute top-1 right-2 text-red-400 font-bold text-xs"
                        >
                          ×
                        </button>
                        <div>
                          <span className="font-bold text-(--text-1) uppercase font-mono">{p.metric}</span>
                        </div>
                        <div className="flex gap-4 font-mono text-(--text-muted)">
                          <span>BEFORE: <span className="text-red-400 font-bold">{p.before}</span></span>
                          <span>AFTER: <span className="text-emerald-400 font-bold">{p.after}</span></span>
                        </div>
                        <div className="text-(--text-muted) italic">TECH: {p.technique}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 bg-(--surface) border border-(--line) rounded-lg space-y-2 text-[10px]">
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        placeholder="Metric Name"
                        value={newPerfMetric}
                        onChange={(e) => setNewPerfMetric(e.target.value)}
                        className="bg-(--surface-2) border border-(--line) text-(--text-1) px-2 py-1 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Technique details"
                        value={newPerfTech}
                        onChange={(e) => setNewPerfTech(e.target.value)}
                        className="bg-(--surface-2) border border-(--line) text-(--text-1) px-2 py-1 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Before (e.g. 14ms)"
                        value={newPerfBefore}
                        onChange={(e) => setNewPerfBefore(e.target.value)}
                        className="bg-(--surface-2) border border-(--line) text-(--text-1) px-2 py-1 rounded"
                      />
                      <input
                        type="text"
                        placeholder="After (e.g. 1.1ms)"
                        value={newPerfAfter}
                        onChange={(e) => setNewPerfAfter(e.target.value)}
                        className="bg-(--surface-2) border border-(--line) text-(--text-1) px-2 py-1 rounded"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (newPerfMetric.trim() && newPerfAfter.trim()) {
                          handleFieldChange('performance', [
                            ...editingProject.performance,
                            {
                              metric: newPerfMetric.trim(),
                              before: newPerfBefore.trim() || 'N/A',
                              after: newPerfAfter.trim(),
                              technique: newPerfTech.trim() || 'Optimizer compilation',
                            },
                          ]);
                          setNewPerfMetric('');
                          setNewPerfBefore('');
                          setNewPerfAfter('');
                          setNewPerfTech('');
                        }
                      }}
                      className="w-full py-1.5 bg-(--cta-bg) hover:bg-(--cta-hover) text-(--cta-fg) font-bold uppercase rounded text-[9px]"
                    >
                      Append Perf Benchmark
                    </button>
                  </div>
                </div>

                {/* Challenges and Tradeoffs */}
                <div className="bg-(--surface-2)/40 border border-(--line) p-5 rounded-xl space-y-4">
                  <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest border-b border-(--line) pb-1.5">
                    5. Engineering Tradeoffs & Risks
                  </h4>

                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {editingProject.challenges.map((c: any, idx: number) => (
                      <div key={idx} className="bg-(--surface) border border-(--line) p-2 rounded text-[10px] space-y-1 relative">
                        <button
                          type="button"
                          onClick={() => handleFieldChange('challenges', editingProject.challenges.filter((_: any, i: any) => i !== idx))}
                          className="absolute top-1 right-2 text-red-400 font-bold text-xs"
                        >
                          ×
                        </button>
                        <div className="font-bold text-(--text-1) uppercase font-mono">CHALLENGE: {c.title}</div>
                        <p className="text-(--text-muted) font-sans">{c.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 bg-(--surface) border border-(--line) rounded-lg space-y-2 text-[10px]">
                    <input
                      type="text"
                      placeholder="Challenge Title"
                      value={newChalTitle}
                      onChange={(e) => setNewChalTitle(e.target.value)}
                      className="w-full bg-(--surface-2) border border-(--line) text-(--text-1) px-2 py-1 rounded"
                    />
                    <textarea
                      placeholder="Challenge Explanation..."
                      value={newChalDesc}
                      rows={2}
                      onChange={(e) => setNewChalDesc(e.target.value)}
                      className="w-full bg-(--surface-2) border border-(--line) text-(--text-1) px-2 py-1 rounded resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newChalTitle.trim() && newChalDesc.trim()) {
                          handleFieldChange('challenges', [
                            ...editingProject.challenges,
                            { title: newChalTitle.trim(), description: newChalDesc.trim() },
                          ]);
                          setNewChalTitle('');
                          setNewChalDesc('');
                        }
                      }}
                      className="w-full py-1.5 bg-(--cta-bg) hover:bg-(--cta-hover) text-(--cta-fg) font-bold uppercase rounded text-[9px]"
                    >
                      Append Technical Challenge
                    </button>
                  </div>
                </div>

                {/* SEO Metadata and Accessibility */}
                <div className="bg-(--surface-2)/40 border border-(--line) p-5 rounded-xl space-y-4">
                  <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest border-b border-(--line) pb-1.5">
                    6. Search Engine Optimization
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">SEO Custom Title Target</span>
                      <input
                        type="text"
                        placeholder="Aether Engine | Alex Rivers Case Study"
                        value={editingProject.seoTitle || ''}
                        onChange={(e) => handleFieldChange('seoTitle', e.target.value)}
                        className="w-full bg-(--surface) border border-(--line) text-(--text-1) rounded px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">SEO Custom description Target</span>
                      <textarea
                        placeholder="Dissertation explaining the bitwise decoders and linear memory compilation..."
                        value={editingProject.seoDescription || ''}
                        rows={2}
                        onChange={(e) => handleFieldChange('seoDescription', e.target.value)}
                        className="w-full bg-(--surface) border border-(--line) text-(--text-1) rounded px-2.5 py-1.5 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
