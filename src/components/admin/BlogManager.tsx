import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Plus, Trash2, Edit3, Save, Check, FileText, Sparkles } from 'lucide-react';
import { DBStructure } from '../../types';

interface BlogManagerProps {
  data: DBStructure;
  onUpdate: (updatedDB: DBStructure) => Promise<void>;
}

export default function BlogManager({ data, onUpdate }: BlogManagerProps) {
  const [blogs, setBlogs] = useState<any[]>(data.blog || []);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [newBlogTag, setNewBlogTag] = useState('');

  const handleEditBlog = (b: any) => {
    setEditingBlog({
      ...b,
      tags: b.tags || [],
    });
  };

  const handleCreateBlog = () => {
    setEditingBlog({
      id: 'blog-' + Date.now(),
      title: '',
      excerpt: '',
      content: '',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      readTime: '5 min read',
      tags: [],
      published: true,
      slug: '',
    });
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog.title || !editingBlog.slug) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', item: editingBlog }),
      });

      if (res.ok) {
        const index = blogs.findIndex((b) => b.id === editingBlog.id);
        const updatedList = index > -1
          ? blogs.map((b) => (b.id === editingBlog.id ? editingBlog : b))
          : [...blogs, editingBlog];

        setBlogs(updatedList);
        await onUpdate({ ...data, blog: updatedList });
        setEditingBlog(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);

  const handleDeleteBlog = async (id: string) => {
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', item: { id } }),
      });
      if (res.ok) {
        const updatedList = blogs.filter((b) => b.id !== id);
        setBlogs(updatedList);
        await onUpdate({ ...data, blog: updatedList });
        setDeletingBlogId(null);
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
            <BookOpen className="h-5 w-5 text-emerald-500" />
            <span>Articles & Technical Blogs</span>
          </h2>
          <p className="text-xs text-(--text-muted) mt-1 uppercase font-mono tracking-wider">
            Draft, edit, list, and schedule computer science notes and technical blog posts.
          </p>
        </div>
        {!editingBlog && (
          <button
            onClick={handleCreateBlog}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-(--cta-fg) font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Write New Article</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Blog Article cards list */}
        {!editingBlog && (
          <div className="xl:col-span-12 space-y-4">
            {blogs.length === 0 ? (
              <div className="text-center p-16 border border-dashed border-(--line) bg-(--surface)/30 rounded-xl">
                <span className="text-[10px] font-mono text-(--text-faint) block mb-1">NO ARTICLES DISCOVERED</span>
                <p className="text-xs text-(--text-muted)">Press button above to write your first portfolio article.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 bg-(--surface) border border-(--line) hover:border-(--line-strong) rounded-xl flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-(--text-faint)">/{b.slug}</span>
                        {!b.published && (
                          <span className="text-[8px] font-mono uppercase px-1.5 py-0.5 bg-(--surface-3) text-(--text-mid) rounded">
                            Draft
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-(--text-1) truncate">{b.title}</h4>
                      <p className="text-xs text-(--text-muted) line-clamp-2 leading-relaxed">{b.excerpt}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-(--line) mt-4 text-[10px] text-(--text-faint) font-mono">
                      <span>{b.date} • {b.readTime}</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleEditBlog(b)}
                          className="p-1.5 bg-(--surface-2) hover:bg-(--surface-3) border border-(--line-strong) text-(--text-1) rounded transition cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(b.id)}
                          className="p-1.5 bg-(--surface-2) hover:bg-red-950/20 border border-(--line-strong) text-(--text-muted) hover:text-red-400 rounded transition cursor-pointer"
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

        {/* Dynamic Markdown Form */}
        {editingBlog && (
          <form onSubmit={handleSaveBlog} className="xl:col-span-12 bg-(--surface) border border-(--line) rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-(--line) pb-4">
              <h3 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
                {editingBlog.title ? `EDIT ARTICLE: ${editingBlog.title}` : 'WRITE NEW ARTICLE'}
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-3.5 py-1.5 bg-(--surface-2) hover:bg-(--surface-3) text-(--text-1) text-[10px] uppercase font-bold tracking-wider rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-(--cta-fg) text-[10px] uppercase font-bold tracking-wider rounded"
                >
                  Publish Article
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Article Title</span>
                <input
                  type="text"
                  required
                  placeholder="Advanced WASM Memory Compilation"
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full bg-(--surface-2) border border-(--line) text-(--text-1) rounded px-2.5 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">URL Path Slug</span>
                <input
                  type="text"
                  required
                  placeholder="wasm-memory-decoding"
                  value={editingBlog.slug}
                  onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                  className="w-full bg-(--surface-2) border border-(--line) text-(--text-1) rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Reading Time (e.g. "4 min read")</span>
                <input
                  type="text"
                  placeholder="4 min read"
                  value={editingBlog.readTime}
                  onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                  className="w-full bg-(--surface-2) border border-(--line) text-(--text-1) rounded px-2.5 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Date (Will default to current)</span>
                <input
                  type="text"
                  placeholder="July 15, 2026"
                  value={editingBlog.date}
                  onChange={(e) => setEditingBlog({ ...editingBlog, date: e.target.value })}
                  className="w-full bg-(--surface-2) border border-(--line) text-(--text-1) rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-(--surface-2) border border-(--line) rounded-lg">
              <label className="flex items-center gap-2 text-xs text-(--text-1) cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={editingBlog.published}
                  onChange={(e) => setEditingBlog({ ...editingBlog, published: e.target.checked })}
                  className="rounded bg-(--surface) border-(--line) text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                />
                <span>Publish instantly (Draft mode if unchecked)</span>
              </label>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Card Summary Excerpt</span>
              <input
                type="text"
                placeholder="A concise, engaging digest summary displayed on card listing..."
                value={editingBlog.excerpt}
                onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                className="w-full bg-(--surface-2) border border-(--line) text-(--text-1) rounded px-2.5 py-1.5 text-xs focus:outline-none"
              />
            </div>

            {/* Markdown Body Textarea */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Markdown Rich-text Body</span>
                <span className="text-[8px] font-mono text-emerald-500 uppercase">Supports Full Github Markdown</span>
              </div>
              <textarea
                required
                placeholder="# Dynamic Subheading \n\n Write compilation thesis guidelines here..."
                value={editingBlog.content}
                rows={12}
                onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                className="w-full bg-(--surface-2) border border-(--line) text-(--text-1) rounded px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono resize-none"
              />
            </div>

            {/* Tag array */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-bold text-(--text-muted) uppercase block">Article Tags</span>
              <div className="flex flex-wrap gap-1">
                {editingBlog.tags.map((tag: string) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono text-(--text-1) bg-(--surface-2) border border-(--line) rounded">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => setEditingBlog({ ...editingBlog, tags: editingBlog.tags.filter((t: string) => t !== tag) })}
                      className="text-red-400 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5 max-w-sm">
                <input
                  type="text"
                  placeholder="Compiler, Memory, Rust"
                  value={newBlogTag}
                  onChange={(e) => setNewBlogTag(e.target.value)}
                  className="flex-grow bg-(--surface-2) border border-(--line) text-(--text-1) rounded px-2 py-1 text-xs focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newBlogTag.trim() && !editingBlog.tags.includes(newBlogTag.trim())) {
                      setEditingBlog({ ...editingBlog, tags: [...editingBlog.tags, newBlogTag.trim()] });
                      setNewBlogTag('');
                    }
                  }}
                  className="px-4 bg-(--cta-bg) text-(--cta-fg) font-bold text-[10px] uppercase rounded"
                >
                  Link
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
