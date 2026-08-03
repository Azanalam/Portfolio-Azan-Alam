import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Plus, Trash2, Edit3, Save, Check, MoveUp, MoveDown, Grid, Sparkles } from 'lucide-react';
import { DBStructure } from '../../types';

interface SkillsManagerProps {
  data: DBStructure;
  onUpdate: (updatedDB: DBStructure) => Promise<void>;
}

export default function SkillsManager({ data, onUpdate }: SkillsManagerProps) {
  const [skillGroups, setSkillGroups] = useState<any[]>(data.skills || []);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Quick inputs
  const [newGroupName, setNewGroupName] = useState('');
  const [activeGroupIdx, setActiveGroupIdx] = useState<number | null>(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillColor, setNewSkillColor] = useState('#10B981');

  const handleSaveSkills = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillGroups),
      });

      if (res.ok) {
        await onUpdate({ ...data, skills: skillGroups });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addGroup = () => {
    if (!newGroupName.trim()) return;
    setSkillGroups((prev) => [
      ...prev,
      {
        id: 'group-' + Date.now(),
        category: newGroupName.trim(),
        skills: [],
      },
    ]);
    setNewGroupName('');
  };

  const removeGroup = (idx: number) => {
    setSkillGroups((prev) => prev.filter((_, i) => i !== idx));
    setActiveGroupIdx(null);
  };

  const addSkillToGroup = (gIdx: number) => {
    if (!newSkillName.trim()) return;
    setSkillGroups((prev) => {
      const updated = [...prev];
      updated[gIdx].skills = [
        ...updated[gIdx].skills,
        {
          name: newSkillName.trim(),
          level: 'Expert', // Keeping schema compatibility but UI uses it purely as a tag/color code
          icon: newSkillColor,
        },
      ];
      return updated;
    });
    setNewSkillName('');
    setNewSkillColor('#10B981');
  };

  const removeSkillFromGroup = (gIdx: number, sIdx: number) => {
    setSkillGroups((prev) => {
      const updated = [...prev];
      updated[gIdx].skills = updated[gIdx].skills.filter((_: any, i: any) => i !== sIdx);
      return updated;
    });
  };

  const moveGroup = (idx: number, direction: 'up' | 'down') => {
    const list = [...skillGroups];
    if (direction === 'up' && idx > 0) {
      const temp = list[idx];
      list[idx] = list[idx - 1];
      list[idx - 1] = temp;
    } else if (direction === 'down' && idx < list.length - 1) {
      const temp = list[idx];
      list[idx] = list[idx + 1];
      list[idx + 1] = temp;
    }
    setSkillGroups(list);
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-500" />
            <span>Technical Skills Matrix</span>
          </h2>
          <p className="text-xs text-[#71717A] mt-1 uppercase font-mono tracking-wider">
            Reorder computer science skill categories, and inject tech rows without performance metrics percentages.
          </p>
        </div>
        <button
          onClick={handleSaveSkills}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <span>Saving Skills...</span>
          ) : success ? (
            <>
              <Check className="h-4 w-4" />
              <span>Skills Synchronized!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Skills Matrix</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Categories Manager */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-[#1A1A1A] pb-2 text-emerald-500 flex items-center gap-2">
              <Grid className="h-4 w-4" />
              <span>Categories Index ({skillGroups.length})</span>
            </h3>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {skillGroups.map((group, idx) => (
                <div
                  key={group.id || idx}
                  onClick={() => setActiveGroupIdx(idx)}
                  className={`flex items-center justify-between p-3 border rounded-xl transition cursor-pointer font-mono text-xs ${
                    activeGroupIdx === idx
                      ? 'bg-emerald-950/25 border-emerald-500/40 text-white shadow-sm'
                      : 'bg-[#111] border-[#1A1A1A] text-[#A1A1AA] hover:border-[#222]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-600">#{idx + 1}</span>
                    <span className="font-bold">{group.category}</span>
                    <span className="text-[9px] text-[#52525B]">({group.skills?.length || 0})</span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => moveGroup(idx, 'up')}
                      disabled={idx === 0}
                      className="p-0.5 text-zinc-600 hover:text-white transition disabled:opacity-10 cursor-pointer"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveGroup(idx, 'down')}
                      disabled={idx === skillGroups.length - 1}
                      className="p-0.5 text-zinc-600 hover:text-white transition disabled:opacity-10 cursor-pointer"
                    >
                      ▼
                    </button>
                    <div className="w-px h-3 bg-zinc-800" />
                    <button
                      onClick={() => removeGroup(idx)}
                      className="p-0.5 text-zinc-600 hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Group Subform */}
            <div className="p-3.5 bg-[#111] border border-[#1A1A1A] rounded-xl space-y-3 mt-4">
              <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#71717A]">Append Category row</div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Systems & WASM"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="flex-grow bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addGroup}
                  className="px-4 py-1.5 bg-white hover:bg-neutral-100 text-black font-bold text-[10px] uppercase tracking-wider rounded transition cursor-pointer"
                >
                  Append
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Nested skills list for Selected Group */}
        <div className="lg:col-span-7">
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4 min-h-[400px] flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-[#1A1A1A] pb-2 text-emerald-500 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Skills inside: {activeGroupIdx !== null ? skillGroups[activeGroupIdx].category : 'Select Category'}</span>
              </h3>

              {activeGroupIdx === null ? (
                <div className="text-center p-16 font-sans text-xs text-[#71717A]">
                  Select a category block from the left panel to display and append nested technologies.
                </div>
              ) : (
                <div className="space-y-3 pt-3">
                  {skillGroups[activeGroupIdx].skills?.length === 0 ? (
                    <div className="text-center p-8 font-mono text-[10px] text-zinc-600">
                      NO TECHNICAL ROWS RECORDED IN THIS CATEGORY.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2.5 max-h-80 overflow-y-auto pr-1">
                      {skillGroups[activeGroupIdx].skills.map((skill: any, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111] border border-[#1A1A1A] rounded-lg font-mono text-xs text-white"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: skill.icon || '#10B981' }}
                          />
                          <span>{skill.name}</span>
                          <button
                            type="button"
                            onClick={() => removeSkillFromGroup(activeGroupIdx, idx)}
                            className="text-[#71717A] hover:text-red-400 font-bold ml-1.5 text-sm cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Add Skill to Active Group Subform */}
            {activeGroupIdx !== null && (
              <div className="p-4 bg-[#111] border border-[#1A1A1A] rounded-xl space-y-3.5 mt-6">
                <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#71717A]">
                  Append skill row to: {skillGroups[activeGroupIdx].category}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono font-bold text-[#71717A] block uppercase">Skill Label</span>
                    <input
                      type="text"
                      placeholder="e.g. WebAssembly"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] font-mono font-bold text-[#71717A] block uppercase">Custom Highlight Color</span>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={newSkillColor}
                        onChange={(e) => setNewSkillColor(e.target.value)}
                        className="bg-transparent border-0 h-7 w-7 p-0 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={newSkillColor}
                        onChange={(e) => setNewSkillColor(e.target.value)}
                        className="bg-[#0A0A0A] border border-[#1A1A1A] text-white px-2 py-1 rounded text-xs focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addSkillToGroup(activeGroupIdx)}
                  className="w-full inline-flex items-center justify-center gap-1 py-1.5 bg-white hover:bg-neutral-100 text-black font-bold text-[10px] uppercase tracking-wider rounded transition cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>Commit Nested Skill</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
