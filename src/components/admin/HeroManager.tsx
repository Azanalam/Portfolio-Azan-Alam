import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Save, Check, UserCheck, Play, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { DBStructure, HeroSection } from '../../types';

interface HeroManagerProps {
  data: DBStructure;
  onUpdate: (updatedDB: DBStructure) => Promise<void>;
}

export default function HeroManager({ data, onUpdate }: HeroManagerProps) {
  const [hero, setHero] = useState<HeroSection>({
    name: data.hero?.name || '',
    jobTitle: data.hero?.jobTitle || '',
    headline: data.hero?.headline || '',
    description: data.hero?.description || '',
    heroImage: data.hero?.heroImage || '',
    backgroundImage: data.hero?.backgroundImage || '',
    ctaButtons: data.hero?.ctaButtons || [],
    statistics: data.hero?.statistics || [],
    statusBadge: data.hero?.statusBadge || 'Available',
    availability: data.hero?.availability ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Quick stat input helpers
  const [newStatLabel, setNewStatLabel] = useState('');
  const [newStatValue, setNewStatValue] = useState('');

  const handleSaveHero = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero),
      });

      if (res.ok) {
        await onUpdate({ ...data, hero });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addStatistic = () => {
    if (!newStatLabel.trim() || !newStatValue.trim()) return;
    setHero((prev) => ({
      ...prev,
      statistics: [...prev.statistics, { label: newStatLabel.trim(), value: newStatValue.trim() }],
    }));
    setNewStatLabel('');
    setNewStatValue('');
  };

  const removeStatistic = (idx: number) => {
    setHero((prev) => ({
      ...prev,
      statistics: prev.statistics.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <span>Hero Section Specifications</span>
          </h2>
          <p className="text-xs text-[#71717A] mt-1 uppercase font-mono tracking-wider">
            Govern primary headings, availability indexes, Call-to-Actions, and active skill-telemetry cards.
          </p>
        </div>
        <button
          onClick={handleSaveHero}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <span>Saving Specifications...</span>
          ) : success ? (
            <>
              <Check className="h-4 w-4" />
              <span>Specs Synchronized!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Hero Specs</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Principal Spec Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-[#1A1A1A] pb-2 text-emerald-500 flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span>Core Copywriting Specs</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Developer Name</label>
                <input
                  type="text"
                  value={hero.name}
                  onChange={(e) => setHero({ ...hero, name: e.target.value })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Job Title Specs</label>
                <input
                  type="text"
                  value={hero.jobTitle}
                  onChange={(e) => setHero({ ...hero, jobTitle: e.target.value })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Homepage Headline Heading</label>
              <input
                type="text"
                value={hero.headline}
                onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Principal Headline Subtext Description</label>
              <textarea
                value={hero.description}
                rows={4}
                onChange={(e) => setHero({ ...hero, description: e.target.value })}
                className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors font-sans resize-none"
              />
            </div>
          </div>

          {/* Status badge controller */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-[#1A1A1A] pb-2 text-emerald-500 flex items-center gap-2">
              <Play className="h-4 w-4" />
              <span>Availability Badge Controller</span>
            </h3>

            <div className="flex items-center gap-6 p-4 bg-[#111] border border-[#1A1A1A] rounded-xl">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Status Index Mode</span>
                <span className="text-[10px] text-[#71717A] block">Determines the active green-glow indicator toggle.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hero.availability}
                  onChange={(e) => setHero({ ...hero, availability: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 peer-checked:after:bg-white" />
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Status Text Phrase (e.g. "Available", "Focus Mode")</label>
              <input
                type="text"
                value={hero.statusBadge}
                onChange={(e) => setHero({ ...hero, statusBadge: e.target.value })}
                className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Expertise Specifications (Bento Grid cards stats) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-[#1A1A1A] pb-2 text-emerald-500 flex items-center gap-2">
              <span>Technical Expertise Deck</span>
            </h3>

            <p className="text-xs text-[#71717A] leading-relaxed">
              These are 4 spec lines rendered on the secondary Bento grid module. Re-configure the headings and stats labels to match your career stack.
            </p>

            <div className="space-y-2.5">
              {hero.statistics.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-[#111] border border-[#1A1A1A] rounded-lg">
                  <div className="space-y-0.5">
                    <span className="text-xs text-white block font-bold">{stat.label}</span>
                    <span className="text-[10px] text-emerald-400 block font-mono">{stat.value}</span>
                  </div>
                  <button
                    onClick={() => removeStatistic(idx)}
                    className="p-1 text-[#71717A] hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Stat Mini Form */}
            <div className="p-3 bg-[#111] border border-[#1A1A1A] rounded-xl space-y-3 mt-4">
              <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#71717A]">Add Technical Stat Row</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Heading (e.g. Cloud Infra)"
                  value={newStatLabel}
                  onChange={(e) => setNewStatLabel(e.target.value)}
                  className="bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. AWS, K8s)"
                  value={newStatValue}
                  onChange={(e) => setNewStatValue(e.target.value)}
                  className="bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="button"
                onClick={addStatistic}
                disabled={hero.statistics.length >= 4}
                className="w-full inline-flex items-center justify-center gap-1 py-1.5 bg-white hover:bg-neutral-100 disabled:bg-neutral-900 disabled:text-neutral-700 text-black font-bold text-[10px] uppercase tracking-wider rounded transition cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Append Stat Row ({hero.statistics.length}/4)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
