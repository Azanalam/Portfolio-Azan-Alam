import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHashRoute } from './hooks/useHashRoute';
import { usePortfolio } from './hooks/usePortfolio';

// Components
import Navigation from './components/Navigation';
import CommandPalette from './components/CommandPalette';

// Views
import Home from './views/Home';
import About from './views/About';
import Projects from './views/Projects';
import ProjectDetail from './views/ProjectDetail';
import Services from './views/Services';
import Skills from './views/Skills';
import Contact from './views/Contact';
import NotFound from './views/NotFound';
import AdminLogin from './views/AdminLogin';
import AdminDashboard from './views/AdminDashboard';

export default function App() {
  const { view, slug, navigate } = useHashRoute();
  const { data } = usePortfolio();
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  // Render view based on hash-state
  const renderView = () => {
    switch (view) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'about':
        return <About />;
      case 'projects':
        return <Projects onNavigate={navigate} />;
      case 'project-detail':
        return <ProjectDetail slug={slug} onNavigate={navigate} />;
      case 'services':
        return <Services onNavigate={navigate} />;
      case 'skills':
        return <Skills />;
      case 'contact':
        return <Contact />;
      case 'admin-login':
        return <AdminLogin />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      default:
        return <NotFound onNavigate={navigate} />;
    }
  };

  const isAdminView = view === 'admin-dashboard' || view === 'admin-login';

  if (isAdminView) {
    return (
      <div className="min-h-screen bg-[#070707] text-[#FAFAFA] font-sans selection:bg-white selection:text-black admin-mode">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-white selection:text-[#050505] flex flex-col justify-between">
      
      {/* Top Header Navigation */}
      <Navigation onOpenCommandPalette={() => setIsCmdOpen(true)} />

      {/* Global Interactive Command Palette */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />

      {/* Main Page Stage Grid */}
      <main className="flex-grow mx-auto max-w-7xl w-full px-6 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={view + (slug ? `-${slug}` : '')}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Minimal Editorial Footer */}
      <footer className="border-t border-[#1A1A1A] bg-[#050505] py-12 mt-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          {/* Copyright signature */}
          <div className="space-y-1.5">
            <div className="font-mono text-xs font-semibold text-white">
              {data?.settings?.copyright || 'DEVELOPER.PORTFOLIO // v1.2.0'}
            </div>
            <p className="text-[10px] text-[#52525B] uppercase tracking-tighter font-sans">
              {data?.settings?.footerText || 'Handcrafted with precision. Built for extreme resilience & technical compliance.'}
            </p>
          </div>

          {/* Quick links & Time telemetry */}
          <div className="flex flex-col sm:items-end gap-3 font-mono text-[11px] text-[#71717A]">
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/')} className="hover:text-white transition cursor-pointer">Home</button>
              <button onClick={() => navigate('/services')} className="hover:text-white transition cursor-pointer">Services</button>
              <button onClick={() => navigate('/projects')} className="hover:text-white transition cursor-pointer">Projects</button>
              <button onClick={() => navigate('/skills')} className="hover:text-white transition cursor-pointer">Skills</button>
              <button onClick={() => navigate('/about')} className="hover:text-white transition cursor-pointer">About</button>
              <button onClick={() => navigate('/contact')} className="hover:text-white transition cursor-pointer">Contact</button>
            </div>
            <div className="text-[#52525B]">
              SYSTEM_TIME: {new Date().getFullYear()}-07-15 // {data?.settings?.timezone || 'UTC-8'}
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
