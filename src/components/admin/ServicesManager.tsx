import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Plus, Trash2, Save, Check, Sparkles, MoveUp, MoveDown } from 'lucide-react';
import { DBStructure, ServiceItem } from '../../types';

interface ServicesManagerProps {
  data: DBStructure;
  onUpdate: (updatedDB: DBStructure) => Promise<void>;
}

const ICON_OPTIONS = ['Code', 'Cpu', 'Zap', 'Layers', 'Rocket', 'Shield', 'Globe', 'Settings'];

export default function ServicesManager({ data, onUpdate }: ServicesManagerProps) {
  const [services, setServices] = useState<ServiceItem[]>(data.services || []);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const patch = (id: string, changes: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...changes } : s)));
  };

  const cleanId = (raw: string) => raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const addService = () => {
    const next = services.length + 1;
    setServices((prev) => [
      ...prev,
      {
        id: `service-${Date.now()}`,
        icon: 'Code',
        title: `New Service ${next}`,
        description: 'Describe what the client receives and the outcome you deliver.',
        features: ['Outcome one', 'Outcome two'],
        price: 'Custom quote',
        ctaLabel: 'Start a project',
        highlight: false,
      },
    ]);
  };

  const removeService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const moveService = (idx: number, direction: 'up' | 'down') => {
    setServices((prev) => {
      const list = [...prev];
      const target = direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= list.length) return prev;
      const temp = list[idx];
      list[idx] = list[target];
      list[target] = temp;
      return list;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(services),
      });
      if (res.ok) {
        await onUpdate({ ...data, services });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-emerald-500" />
            <span>Services Catalog</span>
          </h2>
          <p className="text-xs text-[#71717A] mt-1 uppercase font-mono tracking-wider">
            Define client offers, deliverables, and call-to-action labels. Services render on the public Services page and homepage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addService}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Service</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span>Saving...</span>
            ) : success ? (
              <>
                <Check className="h-4 w-4" />
                <span>Services Synced!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Services</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="border border-[#1A1A1A] bg-[#0A0A0A] rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 text-[9px] font-mono font-bold text-emerald-500 bg-emerald-950/20 border border-emerald-500/10 rounded">
                    #{idx + 1}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#71717A]">{service.id}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => moveService(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-[#71717A] hover:text-white transition disabled:opacity-20 cursor-pointer"
                    title="Move up"
                  >
                    <MoveUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveService(idx, 'down')}
                    disabled={idx === services.length - 1}
                    className="p-1 text-[#71717A] hover:text-white transition disabled:opacity-20 cursor-pointer"
                    title="Move down"
                  >
                    <MoveDown className="h-3.5 w-3.5" />
                  </button>
                  <label className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-[#71717A] cursor-pointer ml-2">
                    <input
                      type="checkbox"
                      checked={service.highlight}
                      onChange={(e) => patch(service.id, { highlight: e.target.checked })}
                      className="h-3.5 w-3.5 accent-emerald-500 cursor-pointer"
                    />
                    Featured
                  </label>
                  <button
                    onClick={() => removeService(service.id)}
                    className="p-1.5 text-[#71717A] hover:text-red-400 transition cursor-pointer ml-1"
                    title="Delete service"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono font-bold text-[#71717A] block uppercase">Title</span>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => patch(service.id, { title: e.target.value })}
                    className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-mono font-bold text-[#71717A] block uppercase">Icon</span>
                  <select
                    value={service.icon}
                    onChange={(e) => patch(service.id, { icon: e.target.value })}
                    className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-mono font-bold text-[#71717A] block uppercase">Price Anchor</span>
                  <input
                    type="text"
                    value={service.price}
                    onChange={(e) => patch(service.id, { price: e.target.value })}
                    className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-mono font-bold text-[#71717A] block uppercase">CTA Label</span>
                  <input
                    type="text"
                    value={service.ctaLabel}
                    onChange={(e) => patch(service.id, { ctaLabel: e.target.value })}
                    className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[8px] font-mono font-bold text-[#71717A] block uppercase">Description</span>
                <textarea
                  rows={2}
                  value={service.description}
                  onChange={(e) => patch(service.id, { description: e.target.value })}
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500 resize-y"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[8px] font-mono font-bold text-[#71717A] block uppercase">
                  Features (comma separated)
                </span>
                <input
                  type="text"
                  value={service.features.join(', ')}
                  onChange={(e) =>
                    patch(service.id, {
                      features: e.target.value.split(',').map((f) => f.trim()).filter(Boolean),
                    })
                  }
                  className="w-full bg-[#111] border border-[#1A1A1A] text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {services.length === 0 && (
          <div className="text-center p-12 border border-dashed border-[#1A1A1A] rounded-xl bg-[#0A0A0A]/30">
            <Sparkles className="h-8 w-8 text-[#71717A] mx-auto mb-3" />
            <p className="text-xs text-[#71717A]">No services configured. Add your first service offer to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}