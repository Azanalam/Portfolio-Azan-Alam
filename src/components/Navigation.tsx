import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Terminal, Search } from 'lucide-react';
import { useHashRoute } from '../hooks/useHashRoute';
import { usePortfolio } from '../hooks/usePortfolio';
import ThemeToggle from './ThemeToggle';

interface NavigationProps {
  onOpenCommandPalette: () => void;
}

export default function Navigation({ onOpenCommandPalette }: NavigationProps) {
  const { currentPath, navigate } = useHashRoute();
  const { data } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const brandLabel = data?.settings?.siteName && data.settings.siteName !== 'Developer Portfolio'
    ? data.settings.siteName
    : data?.hero?.name
      ? `${data.hero.name} // ${data.hero.jobTitle || 'STAFF ENGINEER'}`
      : 'Alex Rivers // STAFF ENGINEER';

  const brandLogo = data?.settings?.siteLogo || 'AR';

  const navItems = [
    { label: 'Home', hash: '#/', key: '1' },
    { label: 'Services', hash: '#/services', key: '6' },
    { label: 'Projects', hash: '#/projects', key: '2' },
    { label: 'Skills', hash: '#/skills', key: '3' },
    { label: 'About', hash: '#/about', key: '4' },
    { label: 'Contact', hash: '#/contact', key: '5' },
  ];

  // Track scroll progress for the top bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for navigation keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const item = navItems.find((n) => n.key === e.key);
      if (item) {
        e.preventDefault();
        navigate(item.hash.replace(/^#/, ''));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-emerald-500 z-50 origin-left transition-transform duration-75"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      <header className="sticky top-0 z-40 w-full border-b border-[#1A1A1A] bg-[#050505]/85 backdrop-blur-md text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          
          {/* Logo / Brand Signature */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 font-mono text-sm font-semibold tracking-tight text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#27272A] rounded px-1.5 py-1"
            aria-label="Developer Portfolio Home"
          >
            <div className="w-7 h-7 bg-white rounded-sm flex items-center justify-center shrink-0">
              <span className="text-black font-black text-xs">{brandLogo}</span>
            </div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#FAFAFA]">{brandLabel}</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = 
                item.hash === '#/' 
                  ? currentPath === '/' 
                  : currentPath.startsWith(item.hash.replace(/^#/, ''));
              
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.hash.replace(/^#/, ''))}
                  className={`relative px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors duration-200 rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#27272A] ${
                    isActive ? 'text-white' : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-[#1A1A1A] border border-[#27272A] rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.label}
                    <kbd className="hidden lg:inline-block px-1.5 py-0.2 text-[9px] font-mono text-[#71717A] bg-black border border-[#1A1A1A] rounded">
                      {item.key}
                    </kbd>
                  </span>
                </button>
              );
            })}

            <div className="h-4 w-px bg-[#1A1A1A] mx-2" aria-hidden="true" />

            {/* Quick Action: Search / Command Palette */}
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#A1A1AA] hover:text-white bg-[#1A1A1A] border border-[#27272A] rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#27272A]"
              title="Open Command Palette (Ctrl+K)"
              aria-label="Open command palette"
            >
              <Search className="h-3 w-3" />
              <span className="hidden lg:inline uppercase tracking-widest text-[10px] font-bold">Search</span>
              <kbd className="font-mono text-[9px] text-[#71717A]">
                ⌘K
              </kbd>
            </button>

            <ThemeToggle />

            {/* Available badge */}
            <div className="px-3 py-1 bg-[#1A1A1A] border border-[#27272A] rounded-full flex items-center gap-2 ml-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] uppercase font-bold text-emerald-500">Available</span>
            </div>
          </nav>

          {/* Mobile Actions Header */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={onOpenCommandPalette}
              className="p-2 text-[#A1A1AA] hover:text-white bg-[#1A1A1A] border border-[#27272A] rounded-full transition"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#A1A1AA] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#27272A] rounded-full"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-16 z-30 border-b border-[#1A1A1A] bg-[#050505]/95 backdrop-blur-lg px-6 py-8 md:hidden shadow-lg text-white"
          >
            <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
              {navItems.map((item, idx) => {
                const isActive = 
                  item.hash === '#/' 
                    ? currentPath === '/' 
                    : currentPath.startsWith(item.hash.replace(/^#/, ''));
                
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.hash.replace(/^#/, ''));
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all uppercase tracking-widest ${
                      isActive 
                        ? 'bg-[#1A1A1A] border border-[#27272A] text-white pl-6' 
                        : 'text-[#A1A1AA] hover:bg-[#1A1A1A]/50 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-xs text-[#71717A]">Shortcut {item.key}</span>
                  </button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
