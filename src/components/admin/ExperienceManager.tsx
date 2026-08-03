import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, GraduationCap, Plus, Trash2, Edit3, Save, Check } from 'lucide-react';
import { DBStructure, Experience } from '../../types';

interface ExperienceManagerProps {
  data: DBStructure;
  onUpdate: (updatedDB: DBStructure) => Promise<void>;
}

export default function ExperienceManager({ data, onUpdate }: ExperienceManagerProps) {
  const [experiences, setExperiences] = useState<(Experience & { id: string; website?: string; order: number; location?: string })[]>(
    (data.experiences || []) as any
  );
  const [education, setEducation] = useState<any[]>(data.education || []);

  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [editingEdu, setEditingEdu] = useState<any | null>(null);

  const [saving, setSaving] = useState(false);
  const [newDescBullet, setNewDescBullet] = useState('');
  const [newTechTag, setNewTechTag] = useState('');
  const [deletingExpId, setDeletingExpId] = useState<string | null>(null);
  const [deletingEduId, setDeletingEduId] = useState<string | null>(null);

  // Experience Handlers
  const handleEditExp = (exp: any) => {
    setEditingExp({
      ...exp,
      description: exp.description || [],
      tags: exp.tags || [],
    });
    setEditingEdu(null);
  };

  const handleCreateExp = () => {
    setEditingExp({
      id: 'exp-' + Date.now(),
      company: '',
      role: '',
      period: '',
      location: '',
      description: [],
      tags: [],
      website: '',
      order: experiences.length,
    });
    setEditingEdu(null);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp.company || !editingExp.role) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', item: editingExp }),
      });

      if (res.ok) {
        const index = experiences.findIndex((x) => x.id === editingExp.id);
        const updatedList = index > -1
          ? experiences.map((x) => (x.id === editingExp.id ? editingExp : x))
          : [...experiences, editingExp];

        setExperiences(updatedList);
        await onUpdate({ ...data, experiences: updatedList });
        setEditingExp(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExp = async (id: string) => {
    try {
      const res = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', item: { id } }),
      });
      if (res.ok) {
        const updatedList = experiences.filter((x) => x.id !== id && x.company !== id);
        setExperiences(updatedList);
        await onUpdate({ ...data, experiences: updatedList });
        setDeletingExpId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Education Handlers
  const handleEditEdu = (edu: any) => {
    setEditingEdu({ ...edu });
    setEditingExp(null);
  };

  const handleCreateEdu = () => {
    setEditingEdu({
      id: 'edu-' + Date.now(),
      school: '',
      degree: '',
      years: '',
      location: '',
      description: '',
      order: education.length,
    });
    setEditingExp(null);
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu.school || !editingEdu.degree) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', item: editingEdu }),
      });

      if (res.ok) {
        const index = education.findIndex((x) => x.id === editingEdu.id);
        const updatedList = index > -1
          ? education.map((x) => (x.id === editingEdu.id ? editingEdu : x))
          : [...education, editingEdu];

        setEducation(updatedList);
        await onUpdate({ ...data, education: updatedList });
        setEditingEdu(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEdu = async (id: string) => {
    try {
      const res = await fetch('/api/admin/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', item: { id } }),
      });
      if (res.ok) {
        const updatedList = education.filter((x) => x.id !== id && x.school !== id);
        setEducation(updatedList);
        await onUpdate({ ...data, education: updatedList });
        setDeletingEduId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-12 font-sans">
      {/* Work Experience Block */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-500" />
              <span>Career Milestones & Chronology</span>
            </h2>
            <p className="text-xs text-[#71717A] mt-1 uppercase font-mono tracking-wider">
              Manage work timelines, corporate entities, bullets summaries, and engineering tech stacks utilized.
            </p>
          </div>
          {!editingExp && !editingEdu && (
            <button
              onClick={handleCreateExp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Work Milestone</span>
            </button>
          )}
        </div>

        {/* List Work Milestones */}
        {!editingExp && !editingEdu && (
          <div className="space-y-4">
            {experiences.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-[#1A1A1A] bg-[#0A0A0A]/30 rounded-xl">
                <span className="text-[10px] font-mono text-zinc-600 block mb-1">NO DATA</span>
                <p className="text-xs text-zinc-500">Press button above to add career chronological blocks.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#222] transition rounded-xl flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-white tracking-tight">{exp.role}</h4>
                          <span className="text-xs text-emerald-400 font-bold font-mono">{exp.company}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#71717A] bg-[#111] border border-[#1A1A1A] px-2 py-0.5 rounded">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-xs text-[#71717A] line-clamp-2 leading-relaxed">
                        {exp.description[0] || 'No description points committed.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#1A1A1A] mt-4">
                      <span className="text-[9px] font-mono text-zinc-600">{exp.location || 'Remote'}</span>
                      <div className="flex gap-1.5 items-center">
                        <button
                          type="button"
                          onClick={() => handleEditExp(exp)}
                          className="p-1.5 bg-[#111] hover:bg-[#1A1A1A] border border-[#222] text-white rounded transition cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        {deletingExpId === (exp.id || exp.company) ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteExp(exp.id || exp.company)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] uppercase tracking-wider rounded transition cursor-pointer"
                          >
                            Confirm?
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeletingExpId(exp.id || exp.company)}
                            className="p-1.5 bg-[#111] hover:bg-red-950/20 border border-[#222] text-zinc-500 hover:text-red-400 rounded transition cursor-pointer"
                            title="Delete milestone"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Experience Edit Form */}
        {editingExp && (
          <form onSubmit={handleSaveExp} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-4">
              <h3 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
                {editingExp.company ? `EDIT WORK: ${editingExp.company}` : 'CREATE WORK CHRONOLOGY'}
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingExp(null)}
                  className="px-3 py-1.5 bg-[#111] hover:bg-[#1A1A1A] text-white text-[10px] uppercase font-bold tracking-wider rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] uppercase font-bold tracking-wider rounded"
                >
                  Save Milestone
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-[#71717A] uppercase block">Entity / Company Name</span>
                <input
                  type="text"
                  required
                  placeholder="SpaceX"
                  value={editingExp.company}
                  onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-[#71717A] uppercase block">Position / Role Title</span>
                <input
                  type="text"
                  required
                  placeholder="Staff Kernel Dev"
                  value={editingExp.role}
                  onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-[#71717A] uppercase block">Timeframe Period</span>
                <input
                  type="text"
                  required
                  placeholder="Jan 2024 - Present"
                  value={editingExp.period}
                  onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-[#71717A] uppercase block">Geographic Location</span>
                <input
                  type="text"
                  placeholder="Los Angeles, CA (Remote)"
                  value={editingExp.location || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Description list editor */}
            <div className="space-y-3">
              <span className="text-[9px] font-mono font-bold text-[#71717A] uppercase block">Milestones & Achievements</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {editingExp.description.map((desc: string, idx: number) => (
                  <div key={idx} className="flex gap-2 bg-[#111] border border-[#1a1a1a] p-2 rounded justify-between items-start">
                    <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">{desc}</p>
                    <button
                      type="button"
                      onClick={() => setEditingExp({ ...editingExp, description: editingExp.description.filter((_: any, i: any) => i !== idx) })}
                      className="text-red-400 font-bold text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Designed bitwise WebAssembly decoders speeding up compile cycle by 42%..."
                  value={newDescBullet}
                  onChange={(e) => setNewDescBullet(e.target.value)}
                  className="flex-grow bg-[#111] border border-[#1A1A1A] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none font-sans"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newDescBullet.trim()) {
                      setEditingExp({ ...editingExp, description: [...editingExp.description, newDescBullet.trim()] });
                      setNewDescBullet('');
                    }
                  }}
                  className="px-4 bg-white text-black font-bold text-[10px] uppercase rounded"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Technologies list */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-bold text-[#71717A] uppercase block">Technologies Utilized</span>
              <div className="flex flex-wrap gap-1">
                {editingExp.tags.map((tech: string) => (
                  <span key={tech} className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono text-[#FAFAFA] bg-[#111] border border-[#1a1a1a] rounded">
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => setEditingExp({ ...editingExp, tags: editingExp.tags.filter((t: string) => t !== tech) })}
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
                  placeholder="Rust, WASM, TypeScript"
                  value={newTechTag}
                  onChange={(e) => setNewTechTag(e.target.value)}
                  className="flex-grow bg-[#111] border border-[#1A1A1A] text-white rounded px-2.5 py-1 text-xs focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newTechTag.trim() && !editingExp.tags.includes(newTechTag.trim())) {
                      setEditingExp({ ...editingExp, tags: [...editingExp.tags, newTechTag.trim()] });
                      setNewTechTag('');
                    }
                  }}
                  className="px-4 bg-white text-black font-bold text-[10px] uppercase rounded"
                >
                  Link
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Academic / Education History Block */}
      <div className="space-y-6 pt-6 border-t border-[#1A1A1A]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-500" />
              <span>Academic Milestones</span>
            </h2>
            <p className="text-xs text-[#71717A] mt-1 uppercase font-mono tracking-wider">
              Record secondary degrees, computer science modules, and university achievements.
            </p>
          </div>
          {!editingExp && !editingEdu && (
            <button
              onClick={handleCreateEdu}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Academic Block</span>
            </button>
          )}
        </div>

        {/* List Academic Blocks */}
        {!editingExp && !editingEdu && (
          <div className="space-y-4">
            {education.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-[#1A1A1A] bg-[#0A0A0A]/30 rounded-xl">
                <span className="text-[10px] font-mono text-zinc-600 block mb-1">NO DATA</span>
                <p className="text-xs text-zinc-500">Press button above to add academic chronological blocks.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#222] transition rounded-xl flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-white tracking-tight">{edu.degree}</h4>
                          <span className="text-xs text-emerald-400 font-bold font-mono">{edu.school}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#71717A] bg-[#111] border border-[#1A1A1A] px-2 py-0.5 rounded">
                          {edu.years}
                        </span>
                      </div>
                      <p className="text-xs text-[#71717A] leading-relaxed">
                        {edu.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#1A1A1A] mt-4">
                      <span className="text-[9px] font-mono text-zinc-600">{edu.location}</span>
                      <div className="flex gap-1.5 items-center">
                        <button
                          type="button"
                          onClick={() => handleEditEdu(edu)}
                          className="p-1.5 bg-[#111] hover:bg-[#1A1A1A] border border-[#222] text-white rounded transition cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        {deletingEduId === (edu.id || edu.school) ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteEdu(edu.id || edu.school)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] uppercase tracking-wider rounded transition cursor-pointer"
                          >
                            Confirm?
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeletingEduId(edu.id || edu.school)}
                            className="p-1.5 bg-[#111] hover:bg-red-950/20 border border-[#222] text-zinc-500 hover:text-red-400 rounded transition cursor-pointer"
                            title="Delete milestone"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Education Edit Form */}
        {editingEdu && (
          <form onSubmit={handleSaveEdu} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-4">
              <h3 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
                {editingEdu.school ? `EDIT DEGREE: ${editingEdu.school}` : 'CREATE ACADEMIC DEGREE'}
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEdu(null)}
                  className="px-3 py-1.5 bg-[#111] hover:bg-[#1A1A1A] text-white text-[10px] uppercase font-bold tracking-wider rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] uppercase font-bold tracking-wider rounded"
                >
                  Save Academic Block
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-[#71717A] uppercase block">University / School</span>
                <input
                  type="text"
                  required
                  placeholder="Stanford University"
                  value={editingEdu.school}
                  onChange={(e) => setEditingEdu({ ...editingEdu, school: e.target.value })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-[#71717A] uppercase block">Degree / Course Major</span>
                <input
                  type="text"
                  required
                  placeholder="M.S. Computer Science"
                  value={editingEdu.degree}
                  onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-[#71717A] uppercase block">Period Range</span>
                <input
                  type="text"
                  required
                  placeholder="2020 - 2022"
                  value={editingEdu.years}
                  onChange={(e) => setEditingEdu({ ...editingEdu, years: e.target.value })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-[#71717A] uppercase block">Geographic Location</span>
                <input
                  type="text"
                  placeholder="Stanford, CA"
                  value={editingEdu.location}
                  onChange={(e) => setEditingEdu({ ...editingEdu, location: e.target.value })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-[#71717A] uppercase block">Degree dissertation details</span>
              <textarea
                placeholder="Specialized in distributed compiler theory, memory architectures..."
                value={editingEdu.description}
                rows={3}
                onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none resize-none font-sans"
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
