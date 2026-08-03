import { useState } from 'react';
import { BookOpen, Save, Check, Plus, Trash2, Cpu, FileText, UserCheck, BarChart2, Sparkles, Code } from 'lucide-react';
import { DBStructure, AboutSection, AboutStat, AboutInterestHighlight } from '../../types';

interface AboutManagerProps {
  data: DBStructure;
  onUpdate: (updatedDB: DBStructure) => Promise<void>;
}

export default function AboutManager({ data, onUpdate }: AboutManagerProps) {
  const [about, setAbout] = useState<AboutSection>({
    biography: data.about?.biography || '',
    introduction: data.about?.introduction || '',
    story: data.about?.story || '',
    careerGoals: data.about?.careerGoals || '',
    interests: data.about?.interests || '',
    personalImage: data.about?.personalImage || '',
    principles: data.about?.principles || [],
    skillsList: data.about?.skillsList || [
      'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express',
      'REST APIs', 'Responsive Design', 'SEO', 'Performance', 'CMS Development', 'UI/UX'
    ],
    developerSnapshot: data.about?.developerSnapshot || {
      currentFocus: 'Full-Stack Web Systems & Performance',
      specialization: 'React, TypeScript, Node.js & Design Systems',
      techStack: 'Next.js, Express, Tailwind CSS, PostgreSQL, Web APIs',
      availability: 'Open to Roles',
      location: 'Remote / Global',
      statusBadge: 'Available'
    },
    stats: data.about?.stats || [
      { value: '15+', label: 'Projects', subtext: 'Built & Deployed' },
      { value: '2+', label: 'Years Learning', subtext: 'Modern Web Architecture' },
      { value: '100%', label: 'Responsive', subtext: 'Mobile to Ultra-wide' },
      { value: '90+', label: 'Lighthouse Target', subtext: 'Performance & SEO' }
    ],
    interestHighlights: data.about?.interestHighlights || [
      { title: 'Continuous Learning', desc: 'Constantly absorbing compiler tech, web standards, and edge runtimes.', icon: 'BookOpen' },
      { title: 'Problem Solving', desc: 'Deconstructing complex architecture bottlenecks into clean, minimal code.', icon: 'Zap' },
      { title: 'Building Products', desc: 'Crafting user-centric software with pixel precision and fluid responsiveness.', icon: 'Rocket' }
    ]
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // New item sub-form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIcon, setNewIcon] = useState('Cpu');

  const [skillsText, setSkillsText] = useState((about.skillsList || []).join(', '));

  const [newStatValue, setNewStatValue] = useState('');
  const [newStatLabel, setNewStatLabel] = useState('');
  const [newStatSubtext, setNewStatSubtext] = useState('');

  const [newInterestTitle, setNewInterestTitle] = useState('');
  const [newInterestDesc, setNewInterestDesc] = useState('');
  const [newInterestIcon, setNewInterestIcon] = useState('Sparkles');

  const handleSaveAbout = async () => {
    setSaving(true);
    setSuccess(false);
    
    // Parse skills list
    const parsedSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedAbout: AboutSection = {
      ...about,
      skillsList: parsedSkills
    };

    try {
      const res = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAbout),
      });

      if (res.ok) {
        await onUpdate({ ...data, about: updatedAbout });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addPrinciple = () => {
    if (!newTitle.trim() || !newDesc.trim()) return;
    setAbout((prev) => ({
      ...prev,
      principles: [
        ...prev.principles,
        { title: newTitle.trim(), icon: newIcon, description: newDesc.trim() },
      ],
    }));
    setNewTitle('');
    setNewDesc('');
  };

  const removePrinciple = (idx: number) => {
    setAbout((prev) => ({
      ...prev,
      principles: prev.principles.filter((_, i) => i !== idx),
    }));
  };

  const addStat = () => {
    if (!newStatValue.trim() || !newStatLabel.trim()) return;
    setAbout((prev) => ({
      ...prev,
      stats: [
        ...(prev.stats || []),
        { value: newStatValue.trim(), label: newStatLabel.trim(), subtext: newStatSubtext.trim() }
      ]
    }));
    setNewStatValue('');
    setNewStatLabel('');
    setNewStatSubtext('');
  };

  const removeStat = (idx: number) => {
    setAbout((prev) => ({
      ...prev,
      stats: (prev.stats || []).filter((_, i) => i !== idx)
    }));
  };

  const addInterestHighlight = () => {
    if (!newInterestTitle.trim() || !newInterestDesc.trim()) return;
    setAbout((prev) => ({
      ...prev,
      interestHighlights: [
        ...(prev.interestHighlights || []),
        { title: newInterestTitle.trim(), desc: newInterestDesc.trim(), icon: newInterestIcon }
      ]
    }));
    setNewInterestTitle('');
    setNewInterestDesc('');
  };

  const removeInterestHighlight = (idx: number) => {
    setAbout((prev) => ({
      ...prev,
      interestHighlights: (prev.interestHighlights || []).filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-500" />
            <span>Profile About Dossier</span>
          </h2>
          <p className="text-xs text-[#71717A] mt-1 uppercase font-mono tracking-wider">
            Edit biography scripts, developer snapshot specs, skills, stats, and principles.
          </p>
        </div>
        <button
          onClick={handleSaveAbout}
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
              <span>Save About Specs</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Copywriting & Developer Snapshot */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Copywriting Blocks */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-[#1A1A1A] pb-2 text-emerald-500 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Dossier Copywriting Blocks</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Short Biography Introduction</label>
              <input
                type="text"
                value={about.introduction}
                onChange={(e) => setAbout({ ...about, introduction: e.target.value })}
                className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Principal Biography Paragraph</label>
              <textarea
                value={about.biography}
                rows={4}
                onChange={(e) => setAbout({ ...about, biography: e.target.value })}
                className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors resize-none font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Background Story / Education Path</label>
              <textarea
                value={about.story}
                rows={4}
                onChange={(e) => setAbout({ ...about, story: e.target.value })}
                className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors resize-none font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Career Methodology Goals</label>
                <textarea
                  value={about.careerGoals}
                  rows={4}
                  onChange={(e) => setAbout({ ...about, careerGoals: e.target.value })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors resize-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Interests / Beyond Code Paragraph</label>
                <textarea
                  value={about.interests}
                  rows={4}
                  onChange={(e) => setAbout({ ...about, interests: e.target.value })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors resize-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* Developer Snapshot Specifications */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-[#1A1A1A] pb-2 text-emerald-500 flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span>Developer Snapshot Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Current Focus</label>
                <input
                  type="text"
                  value={about.developerSnapshot?.currentFocus || ''}
                  onChange={(e) => setAbout({
                    ...about,
                    developerSnapshot: {
                      ...about.developerSnapshot!,
                      currentFocus: e.target.value
                    }
                  })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Specialization</label>
                <input
                  type="text"
                  value={about.developerSnapshot?.specialization || ''}
                  onChange={(e) => setAbout({
                    ...about,
                    developerSnapshot: {
                      ...about.developerSnapshot!,
                      specialization: e.target.value
                    }
                  })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Tech Stack</label>
                <input
                  type="text"
                  value={about.developerSnapshot?.techStack || ''}
                  onChange={(e) => setAbout({
                    ...about,
                    developerSnapshot: {
                      ...about.developerSnapshot!,
                      techStack: e.target.value
                    }
                  })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Availability</label>
                <input
                  type="text"
                  value={about.developerSnapshot?.availability || ''}
                  onChange={(e) => setAbout({
                    ...about,
                    developerSnapshot: {
                      ...about.developerSnapshot!,
                      availability: e.target.value
                    }
                  })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Location</label>
                <input
                  type="text"
                  value={about.developerSnapshot?.location || ''}
                  onChange={(e) => setAbout({
                    ...about,
                    developerSnapshot: {
                      ...about.developerSnapshot!,
                      location: e.target.value
                    }
                  })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Status Badge Text</label>
                <input
                  type="text"
                  value={about.developerSnapshot?.statusBadge || ''}
                  onChange={(e) => setAbout({
                    ...about,
                    developerSnapshot: {
                      ...about.developerSnapshot!,
                      statusBadge: e.target.value
                    }
                  })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Core Technical Capabilities (Skills List) */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-[#1A1A1A] pb-2 text-emerald-500 flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>Core Skills & Technologies List</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">Skills List (Comma Separated)</label>
              <textarea
                value={skillsText}
                rows={3}
                onChange={(e) => setSkillsText(e.target.value)}
                className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors resize-none font-mono"
              />
              <p className="text-[10px] text-[#71717A]">
                Enter skill labels separated by commas. These will render as chips in the Core Capabilities grid on the About page.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Principles, Stats & Interest Highlights */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Animated Stats Section CMS */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-[#1A1A1A] pb-2 text-emerald-500 flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Metrics & Impact Stats</span>
            </h3>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {(about.stats || []).map((st, idx) => (
                <div key={idx} className="bg-[#111] border border-[#1A1A1A] p-2.5 rounded-lg flex justify-between gap-3 items-center">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 font-mono">{st.value}</span>
                    <span className="text-xs font-semibold text-white ml-2">{st.label}</span>
                    <span className="text-[10px] text-[#71717A] block">{st.subtext}</span>
                  </div>
                  <button
                    onClick={() => removeStat(idx)}
                    className="p-1 text-[#71717A] hover:text-red-400 transition shrink-0 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#111] border border-[#1A1A1A]/80 rounded-xl space-y-2 mt-2">
              <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#71717A]">Append Stat Item</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Value (e.g. 15+)"
                  value={newStatValue}
                  onChange={(e) => setNewStatValue(e.target.value)}
                  className="bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded px-2 py-1 text-xs focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Label (e.g. Projects)"
                  value={newStatLabel}
                  onChange={(e) => setNewStatLabel(e.target.value)}
                  className="bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded px-2 py-1 text-xs focus:outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Subtext (e.g. Built & Deployed)"
                value={newStatSubtext}
                onChange={(e) => setNewStatSubtext(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded px-2 py-1 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={addStat}
                className="w-full py-1 bg-white hover:bg-neutral-100 text-black font-bold text-[10px] uppercase tracking-wider rounded transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="h-3 w-3" />
                <span>Add Stat Metric</span>
              </button>
            </div>
          </div>

          {/* Operating principles list */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-[#1A1A1A] pb-2 text-emerald-500 flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <span>Core Guidelines / Principles</span>
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {about.principles.map((pr, idx) => (
                <div key={idx} className="bg-[#111] border border-[#1A1A1A] p-3 rounded-lg flex justify-between gap-3 items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold uppercase text-emerald-500 bg-emerald-950/20 border border-emerald-500/10 px-1 rounded">
                        {pr.icon}
                      </span>
                      <span className="text-xs font-bold text-white">{pr.title}</span>
                    </div>
                    <p className="text-[11px] text-[#71717A] leading-relaxed font-sans">{pr.description}</p>
                  </div>
                  <button
                    onClick={() => removePrinciple(idx)}
                    className="p-1 text-[#71717A] hover:text-red-400 transition shrink-0 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Principle Subform */}
            <div className="p-3 bg-[#111] border border-[#1A1A1A]/80 rounded-xl space-y-3 mt-2">
              <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#71717A]">Append Guideline</div>
              
              <input
                type="text"
                placeholder="Principle Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded px-2.5 py-1 text-xs focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <span className="text-[8px] font-mono font-bold text-[#71717A] uppercase flex items-center">Icon:</span>
                <select
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded px-2 py-1 text-[11px] focus:outline-none"
                >
                  <option value="Cpu">CPU Chip</option>
                  <option value="Database">Database Set</option>
                  <option value="Layers">Layers</option>
                  <option value="Shield">Shield</option>
                  <option value="Code">Code</option>
                  <option value="Zap">Zap</option>
                </select>
              </div>

              <textarea
                placeholder="Principle details..."
                value={newDesc}
                rows={2}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded px-2.5 py-1 text-xs focus:outline-none resize-none"
              />

              <button
                type="button"
                onClick={addPrinciple}
                className="w-full py-1 bg-white hover:bg-neutral-100 text-black font-bold text-[10px] uppercase tracking-wider rounded transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="h-3 w-3" />
                <span>Append Guideline Card</span>
              </button>
            </div>
          </div>

          {/* Interest Highlights CMS */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-[#1A1A1A] pb-2 text-emerald-500 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Beyond Development Highlights</span>
            </h3>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {(about.interestHighlights || []).map((ih, idx) => (
                <div key={idx} className="bg-[#111] border border-[#1A1A1A] p-2.5 rounded-lg flex justify-between gap-3 items-start">
                  <div>
                    <span className="text-xs font-bold text-white">{ih.title}</span>
                    <span className="text-[9px] font-mono text-emerald-400 ml-2">({ih.icon})</span>
                    <p className="text-[11px] text-[#71717A] mt-0.5">{ih.desc}</p>
                  </div>
                  <button
                    onClick={() => removeInterestHighlight(idx)}
                    className="p-1 text-[#71717A] hover:text-red-400 transition shrink-0 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#111] border border-[#1A1A1A]/80 rounded-xl space-y-2 mt-2">
              <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#71717A]">Append Interest Highlight</div>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Title (e.g. Open Source)"
                  value={newInterestTitle}
                  onChange={(e) => setNewInterestTitle(e.target.value)}
                  className="bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded px-2 py-1 text-xs focus:outline-none"
                />
                <select
                  value={newInterestIcon}
                  onChange={(e) => setNewInterestIcon(e.target.value)}
                  className="bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded px-2 py-1 text-[11px] focus:outline-none"
                >
                  <option value="Sparkles">Sparkles</option>
                  <option value="BookOpen">BookOpen</option>
                  <option value="Zap">Zap</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Code">Code</option>
                  <option value="Compass">Compass</option>
                </select>
              </div>

              <textarea
                placeholder="Brief description..."
                value={newInterestDesc}
                rows={2}
                onChange={(e) => setNewInterestDesc(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded px-2.5 py-1 text-xs focus:outline-none resize-none"
              />

              <button
                type="button"
                onClick={addInterestHighlight}
                className="w-full py-1 bg-white hover:bg-neutral-100 text-black font-bold text-[10px] uppercase tracking-wider rounded transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="h-3 w-3" />
                <span>Add Interest Highlight</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
