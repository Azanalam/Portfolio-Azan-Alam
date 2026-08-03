import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, LayoutDashboard, Settings, Sparkles, BookOpen, Layers, Briefcase, Code, Image, LogOut, ArrowLeft, BarChart3 } from 'lucide-react';
import { useHashRoute } from '../hooks/useHashRoute';
import { DBStructure } from '../types';

// Module subcomponents
import SettingsManager from '../components/admin/SettingsManager';
import HeroManager from '../components/admin/HeroManager';
import AboutManager from '../components/admin/AboutManager';
import ProjectsManager from '../components/admin/ProjectsManager';
import ExperienceManager from '../components/admin/ExperienceManager';
import SkillsManager from '../components/admin/SkillsManager';
import ServicesManager from '../components/admin/ServicesManager';
import BlogManager from '../components/admin/BlogManager';
import MediaLibrary from '../components/admin/MediaLibrary';

export default function AdminDashboard() {
  const { navigate } = useHashRoute();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'hero' | 'about' | 'projects' | 'experience' | 'skills' | 'services' | 'blog' | 'media'>('overview');
  const [db, setDb] = useState<DBStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('Admin');

  // Validate session on load
  useEffect(() => {
    const fetchSessionAndDB = async () => {
      try {
        const sessionRes = await fetch('/api/admin/me');
        if (sessionRes.ok) {
          const session = await sessionRes.json();
          if (!session.authenticated) {
            navigate('/admin/login');
            return;
          }
          setUsername(session.username);
        }

        const dbRes = await fetch('/api/portfolio');
        if (dbRes.ok) {
          const data = await dbRes.json();
          setDb(data);
        }
      } catch (err) {
        console.error('Handshake failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessionAndDB();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        navigate('/admin/login');
        window.location.reload(); // Hard reload to fully flush administrative caches
      }
    } catch (err) {
      console.error(err);
    }
  };

  const syncDB = async (updatedDB: DBStructure) => {
    setDb(updatedDB);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex flex-col items-center justify-center font-mono text-xs gap-3">
        <svg className="animate-spin h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Authenticating admin handshake...</span>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'System Overview', icon: LayoutDashboard },
    { id: 'settings', label: 'Global Settings', icon: Settings },
    { id: 'hero', label: 'Hero Specs', icon: Sparkles },
    { id: 'about', label: 'About Dossier', icon: BookOpen },
    { id: 'skills', label: 'Skills Matrix', icon: Layers },
    { id: 'experience', label: 'Career Milestones', icon: Briefcase },
    { id: 'services', label: 'Services Catalog', icon: Sparkles },
    { id: 'projects', label: 'Case Studies', icon: Code },
    { id: 'blog', label: 'Technical Blogs', icon: BookOpen },
    { id: 'media', label: 'Media Library', icon: Image },
  ] as const;

  return (
    <div className="min-h-screen bg-[#070707] text-white font-sans flex">
      {/* Side Control Rail */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-[#1A1A1A] hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0">
        <div className="p-6 space-y-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 border-b border-[#1A1A1A] pb-5">
            <div className="h-8 w-8 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">CMS Controller</h1>
              <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest font-bold">Secure Root</p>
            </div>
          </div>

          {/* Nav Deck */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer text-left ${
                    activeTab === item.id
                      ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10'
                      : 'text-[#71717A] hover:text-white hover:bg-neutral-900/50 border border-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User context footer */}
        <div className="p-6 border-t border-[#1A1A1A] space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-[10px] font-mono text-emerald-400">
              AZ
            </div>
            <div className="min-w-0">
              <p className="text-xs text-white font-bold truncate">{username}</p>
              <p className="text-[9px] font-mono text-[#52525B] uppercase">Administrator</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('/')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 bg-[#111] hover:bg-neutral-900 text-[#A1A1AA] hover:text-white border border-[#1A1A1A] rounded text-[10px] uppercase font-bold tracking-wider transition cursor-pointer"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Exit</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-500/10 rounded text-[10px] uppercase font-bold tracking-wider transition cursor-pointer"
            >
              <LogOut className="h-3 w-3" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Canvas */}
      <main className="flex-grow min-w-0 p-6 md:p-10 space-y-8 overflow-y-auto max-h-screen">
        {/* Mobile Header controller */}
        <div className="flex md:hidden items-center justify-between bg-[#0A0A0A] border border-[#1A1A1A] p-4 rounded-xl mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-white">CMS controller</span>
          </div>

          <div className="flex gap-2">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="bg-[#111] border border-[#1A1A1A] text-white text-[11px] px-2 py-1 rounded focus:outline-none"
            >
              {navItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleLogout}
              className="p-1 text-red-400 hover:bg-red-950/10 rounded transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Canvas panels router */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full"
          >
            {activeTab === 'overview' && db && (
              <div className="space-y-8">
                {/* Brand Header */}
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-emerald-500" />
                    <span>Portfolio Telemetry Dashboard</span>
                  </h2>
                  <p className="text-xs text-[#71717A] mt-1 uppercase font-mono tracking-wider">
                    Core dashboard rendering dynamic statistics, node state indicators, and file metrics.
                  </p>
                </div>

                {/* Telemetry Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#222] transition-colors p-5 rounded-xl space-y-2">
                    <span className="text-[9px] font-mono font-bold uppercase text-[#52525B]">CASE_STUDIES_COUNT</span>
                    <p className="text-2xl font-bold text-white font-sans">{db.projects?.length || 0}</p>
                    <span className="text-[10px] text-emerald-400 font-bold block">Dynamic Projects</span>
                  </div>

                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#222] transition-colors p-5 rounded-xl space-y-2">
                    <span className="text-[9px] font-mono font-bold uppercase text-[#52525B]">CHRONO_MILESTONES</span>
                    <p className="text-2xl font-bold text-white font-sans">{db.experiences?.length || 0}</p>
                    <span className="text-[10px] text-emerald-400 font-bold block">Work Chronologies</span>
                  </div>

                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#222] transition-colors p-5 rounded-xl space-y-2">
                    <span className="text-[9px] font-mono font-bold uppercase text-[#52525B]">MATRIX_SKILL_ROWS</span>
                    <p className="text-2xl font-bold text-white font-sans">
                      {db.skills?.reduce((acc, curr) => acc + (curr.skills?.length || 0), 0) || 0}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-bold block">Nested Skills</span>
                  </div>

                  <div className="bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#222] transition-colors p-5 rounded-xl space-y-2">
                    <span className="text-[9px] font-mono font-bold uppercase text-[#52525B]">SYSTEM_MEDIA_ASSETS</span>
                    <p className="text-2xl font-bold text-white font-sans">{db.media?.length || 0}</p>
                    <span className="text-[10px] text-emerald-400 font-bold block">Uploaded media</span>
                  </div>
                </div>

                {/* Information Callout */}
                <div className="p-6 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-transparent to-transparent" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white font-sans">Administrative CMS Session State</h3>
                    <p className="text-xs text-[#71717A] leading-relaxed max-w-xl">
                      Welcome, <span className="text-white font-bold">{username}</span>. You can edit any section on your portfolio securely from the side navigation control. No source code modifications or redeployments required.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-100 text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer font-sans shrink-0"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>View Public Portfolio</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && db && (
              <SettingsManager data={db} onUpdate={syncDB} />
            )}

            {activeTab === 'hero' && db && (
              <HeroManager data={db} onUpdate={syncDB} />
            )}

            {activeTab === 'about' && db && (
              <AboutManager data={db} onUpdate={syncDB} />
            )}

            {activeTab === 'projects' && db && (
              <ProjectsManager data={db} onUpdate={syncDB} />
            )}

            {activeTab === 'experience' && db && (
              <ExperienceManager data={db} onUpdate={syncDB} />
            )}

            {activeTab === 'skills' && db && (
              <SkillsManager data={db} onUpdate={syncDB} />
            )}

            {activeTab === 'services' && db && (
              <ServicesManager data={db} onUpdate={syncDB} />
            )}

            {activeTab === 'blog' && db && (
              <BlogManager data={db} onUpdate={syncDB} />
            )}

            {activeTab === 'media' && (
              <MediaLibrary />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
