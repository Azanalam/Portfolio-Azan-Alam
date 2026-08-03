import { useState, useEffect, useRef, ComponentType } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, CornerDownLeft, Terminal, FileCode, ShieldAlert, Cpu, LayoutTemplate, X } from 'lucide-react';
import { useHashRoute } from '../hooks/useHashRoute';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  action: () => void;
  icon: ComponentType<{ className?: string }>;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const { navigate } = useHashRoute();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'nav-home',
      title: 'Go to Home',
      subtitle: 'Introduction, featured projects, and career highpoints',
      category: 'Navigation',
      action: () => { navigate('/'); onClose(); },
      icon: Terminal,
    },
    {
      id: 'nav-services',
      title: 'Explore Services',
      subtitle: 'Client offers, deliverables, and engagement options',
      category: 'Navigation',
      action: () => { navigate('/services'); onClose(); },
      icon: LayoutTemplate,
    },
    {
      id: 'nav-projects',
      title: 'View All Projects',
      subtitle: 'Deep-dive technical case studies',
      category: 'Navigation',
      action: () => { navigate('/projects'); onClose(); },
      icon: FileCode,
    },
    {
      id: 'nav-skills',
      title: 'Explore Skills Matrix',
      subtitle: 'Practical technology capabilities and use cases',
      category: 'Navigation',
      action: () => { navigate('/skills'); onClose(); },
      icon: Cpu,
    },
    {
      id: 'nav-about',
      title: 'Read About Profile',
      subtitle: 'Engineering mindset, principles, and philosophy',
      category: 'Navigation',
      action: () => { navigate('/about'); onClose(); },
      icon: Terminal,
    },
    {
      id: 'nav-contact',
      title: 'Get in Touch',
      subtitle: 'Contact form, social channels, and channels',
      category: 'Navigation',
      action: () => { navigate('/contact'); onClose(); },
      icon: ShieldAlert,
    },
  ];

  // Filter commands
  const filteredCommands = commands.filter((cmd) => {
    const term = search.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(term) ||
      cmd.subtitle.toLowerCase().includes(term) ||
      cmd.category.toLowerCase().includes(term)
    );
  });

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setSearch('');
    }
  }, [isOpen]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle palette: Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
          
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15 }}
            ref={containerRef}
            className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] shadow-2xl text-white"
            role="combobox"
            aria-expanded={isOpen}
            aria-owns="cmd-listbox"
            aria-haspopup="listbox"
          >
            {/* Input Bar */}
            <div className="flex items-center border-b border-[#1A1A1A] px-4 py-3.5">
              <Search className="h-5 w-5 text-[#71717A] mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search sections..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-sm text-[#FAFAFA] placeholder-[#71717A] focus:outline-none"
                aria-autocomplete="list"
                aria-controls="cmd-listbox"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-md text-[#71717A] hover:text-white hover:bg-[#1A1A1A] transition"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results Grid */}
            <div 
              id="cmd-listbox" 
              role="listbox" 
              className="max-h-[360px] overflow-y-auto p-2"
              aria-label="Suggestions"
            >
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-sm text-[#71717A]">
                  No commands or projects found matching "<span className="font-semibold text-[#A1A1AA]">{search}</span>"
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => cmd.action()}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[#1A1A1A] text-white border border-[#27272A]' 
                          : 'text-[#A1A1AA] hover:bg-[#111] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-md ${isSelected ? 'bg-white text-black shadow-sm' : 'bg-[#111] text-[#71717A]'}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <div className={`text-[9px] font-mono tracking-wider uppercase mb-0.5 text-[#71717A]`}>
                            {cmd.category}
                          </div>
                          <div className="text-sm font-semibold text-white">
                            {cmd.title}
                          </div>
                          <div className="text-xs text-[#A1A1AA] line-clamp-1">
                            {cmd.subtitle}
                          </div>
                        </div>
                      </div>

                      {/* Enter Indicator */}
                      {isSelected && (
                        <kbd className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-[#A1A1AA] bg-black border border-[#27272A] px-2 py-0.5 rounded shadow-sm">
                          <span>Enter</span>
                          <CornerDownLeft className="h-2.5 w-2.5" />
                        </kbd>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Help info */}
            <div className="flex justify-between items-center bg-black px-4 py-2 text-[10px] text-[#71717A] border-t border-[#1A1A1A] font-mono">
              <div className="flex gap-3">
                <span><kbd className="bg-[#1A1A1A] border border-[#27272A] rounded px-1 text-[9px] text-[#A1A1AA] shadow-sm">↑↓</kbd> Navigate</span>
                <span><kbd className="bg-[#1A1A1A] border border-[#27272A] rounded px-1 text-[9px] text-[#A1A1AA] shadow-sm">Enter</kbd> Select</span>
                <span><kbd className="bg-[#1A1A1A] border border-[#27272A] rounded px-1 text-[9px] text-[#A1A1AA] shadow-sm">Esc</kbd> Close</span>
              </div>
              <div className="hidden sm:block">
                <span>DEVELOPER PORTFOLIO CLI</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
