import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Check, Layout, AlertCircle, Save, Plus, Trash2, Globe, Sparkles } from 'lucide-react';
import { DBStructure, SiteSettings, LayoutConfig } from '../../types';

interface SettingsManagerProps {
  data: DBStructure;
  onUpdate: (updatedDB: DBStructure) => Promise<void>;
}

export default function SettingsManager({ data, onUpdate }: SettingsManagerProps) {
  const [settings, setSettings] = useState<SiteSettings>({
    ...data.settings,
    socialLinks: data.settings.socialLinks || {},
  });
  const [layout, setLayout] = useState<LayoutConfig>({
    sectionOrder: data.layout?.sectionOrder || ['hero', 'projects', 'experience', 'testimonials', 'contact'],
    hiddenSections: data.layout?.hiddenSections || [],
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customPlatform, setCustomPlatform] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  const handleSaveSettings = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        // Save layout configuration as well
        const layoutRes = await fetch('/api/admin/layout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(layout),
        });

        if (layoutRes.ok) {
          await onUpdate({ ...data, settings, layout });
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addCustomSocial = () => {
    if (!customPlatform.trim() || !customUrl.trim()) return;
    const cleanPlatform = customPlatform.trim().toLowerCase();
    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [cleanPlatform]: customUrl.trim(),
      },
    }));
    setCustomPlatform('');
    setCustomUrl('');
  };

  const removeSocial = (platform: string) => {
    setSettings((prev) => {
      const updated = { ...prev.socialLinks };
      delete updated[platform];
      return { ...prev, socialLinks: updated };
    });
  };

  const toggleSectionVisibility = (sec: string) => {
    setLayout((prev) => {
      const hidden = prev.hiddenSections.includes(sec)
        ? prev.hiddenSections.filter((s) => s !== sec)
        : [...prev.hiddenSections, sec];
      return { ...prev, hiddenSections: hidden };
    });
  };

  const moveSection = (idx: number, direction: 'up' | 'down') => {
    setLayout((prev) => {
      const order = [...prev.sectionOrder];
      if (direction === 'up' && idx > 0) {
        const temp = order[idx];
        order[idx] = order[idx - 1];
        order[idx - 1] = temp;
      } else if (direction === 'down' && idx < order.length - 1) {
        const temp = order[idx];
        order[idx] = order[idx + 1];
        order[idx + 1] = temp;
      }
      return { ...prev, sectionOrder: order };
    });
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--line) pb-5">
        <div>
          <h2 className="text-xl font-bold text-(--text-1) flex items-center gap-2">
            <Settings className="h-5 w-5 text-emerald-500" />
            <span>Site Settings & Layout Director</span>
          </h2>
          <p className="text-xs text-(--text-muted) mt-1 uppercase font-mono tracking-wider">
            Reconfigure brand typography, metadata variables, social platforms, and homepage rendering hierarchies.
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-(--cta-fg) font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50"
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
              <span>Save System Settings</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Core Settings & Identity */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-(--surface) border border-(--line) rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-(--text-1) uppercase tracking-wider font-mono border-b border-(--line) pb-2 text-emerald-500 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Identity Specs</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-(--text-muted) uppercase tracking-wider block">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full bg-(--surface-2) border border-(--line) text-(--text-1) rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-(--text-muted) uppercase tracking-wider block">Site Logo Initials</label>
                <input
                  type="text"
                  value={settings.siteLogo}
                  onChange={(e) => setSettings({ ...settings, siteLogo: e.target.value })}
                  className="w-full bg-(--surface-2) border border-(--line) text-(--text-1) rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-(--text-muted) uppercase tracking-wider block">Accent Theme Color</label>
                <select
                  value={settings.brandColors?.primary || 'emerald'}
                  onChange={(e) => setSettings({ ...settings, brandColors: { ...settings.brandColors, primary: e.target.value } })}
                  className="w-full bg-(--surface-2) border border-(--line) text-(--text-1) rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="emerald">Emerald Green (Theme Standard)</option>
                  <option value="cyan">Cyan Blue</option>
                  <option value="indigo">Indigo Violet</option>
                  <option value="amber">Amber Gold</option>
                  <option value="rose">Rose Red</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-(--text-muted) uppercase tracking-wider block">Interface Theme Mode</label>
                <select
                  value={settings.theme || 'dark'}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'dark' | 'light' })}
                  className="w-full bg-(--surface-2) border border-(--line) text-(--text-1) rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="dark">Dark Theme (Cosmic Slate)</option>
                  <option value="light">Light Theme (Minimal Polar)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-(--text-muted) uppercase tracking-wider block">Timezone Scope</label>
                <input
                  type="text"
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full bg-(--surface-2) border border-(--line) text-(--text-1) rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-mono font-bold text-(--text-muted) uppercase tracking-wider block">Copyright Phrase</label>
              <input
                type="text"
                value={settings.copyright}
                onChange={(e) => setSettings({ ...settings, copyright: e.target.value })}
                className="w-full bg-(--surface-2) border border-(--line) text-(--text-1) rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Social Platforms & Integration */}
          <div className="bg-(--surface) border border-(--line) rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-(--text-1) uppercase tracking-wider font-mono border-b border-(--line) pb-2 text-emerald-500 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Social Links Integrator</span>
            </h3>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {Object.entries(settings.socialLinks).map(([platform, url]) => (
                <div key={platform} className="flex items-center gap-2 bg-(--surface-2) border border-(--line) p-2 rounded-lg justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-500 px-1.5 py-0.5 bg-emerald-950/20 border border-emerald-500/10 rounded">
                      {platform}
                    </span>
                    <span className="text-xs text-(--text-mid) truncate max-w-sm font-mono">{url}</span>
                  </div>
                  <button
                    onClick={() => removeSocial(platform)}
                    className="p-1 text-(--text-muted) hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Platform Form */}
            <div className="bg-(--surface-2) border border-(--line)/80 p-3 rounded-xl space-y-3.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-(--text-muted) font-bold">Inject Social Media Platform</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Platform (e.g. GitHub, LinkedIn, X, Dev.to)"
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                  className="bg-(--surface) border border-(--line) text-(--text-1) rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-emerald-500 font-mono"
                />
                <input
                  type="url"
                  placeholder="Full URL (https://...)"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="bg-(--surface) border border-(--line) text-(--text-1) rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={addCustomSocial}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-(--cta-bg) hover:bg-(--cta-hover) text-(--cta-fg) font-bold text-[10px] uppercase tracking-wider rounded transition cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Link Social Handle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Homepage Layout Sorting */}
        <div className="lg:col-span-5">
          <div className="bg-(--surface) border border-(--line) rounded-xl p-6 space-y-4 h-full">
            <h3 className="text-sm font-bold text-(--text-1) uppercase tracking-wider font-mono border-b border-(--line) pb-2 text-emerald-500 flex items-center gap-2">
              <Layout className="h-4 w-4" />
              <span>Homepage Layout Engine</span>
            </h3>

            <p className="text-xs text-(--text-muted) leading-relaxed font-sans">
              Reorder or toggles any component block on the root homepage instantly. Slide blocks or hide them to adapt to your branding goals.
            </p>

            <div className="space-y-2.5 pt-2">
              {layout.sectionOrder.map((sec, idx) => {
                const isHidden = layout.hiddenSections.includes(sec);
                return (
                  <div
                    key={sec}
                    className={`flex items-center justify-between p-3 border rounded-xl transition font-mono text-xs ${
                      isHidden
                        ? 'bg-(--surface-2)/40 text-(--text-faint) border-(--line)'
                        : 'bg-(--surface-2) text-(--text-1) border-(--line-strong)'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-(--text-faint) font-bold">#{idx + 1}</span>
                      <span className="font-bold uppercase tracking-wide text-emerald-400">
                        {sec} Section
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Move actions */}
                      <button
                        onClick={() => moveSection(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-(--text-muted) hover:text-(--text-1) transition disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveSection(idx, 'down')}
                        disabled={idx === layout.sectionOrder.length - 1}
                        className="p-1 text-(--text-muted) hover:text-(--text-1) transition disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        ▼
                      </button>

                      <div className="w-px h-3.5 bg-(--line-strong) mx-1" />

                      {/* Hide toggle */}
                      <button
                        onClick={() => toggleSectionVisibility(sec)}
                        className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded cursor-pointer ${
                          isHidden
                            ? 'bg-red-950/40 text-red-400 border border-red-500/10'
                            : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/10'
                        }`}
                      >
                        {isHidden ? 'Hidden' : 'Visible'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
