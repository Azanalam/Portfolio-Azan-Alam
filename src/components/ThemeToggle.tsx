import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';

export default function ThemeToggle() {
  const { theme, toggleTheme } = usePortfolio();

  return (
    <button
      id="theme-toggle-button"
      onClick={toggleTheme}
      className="relative flex h-8 w-14 cursor-pointer items-center rounded-full bg-(--surface-3) p-1 border border-(--line-strong) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 hover:border-(--line-strong)"
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {/* Background Icons */}
      <div id="theme-toggle-bg-icons" className="absolute inset-0 flex justify-between items-center px-2 text-(--text-muted) pointer-events-none">
        <Sun className="h-3.5 w-3.5" />
        <Moon className="h-3.5 w-3.5" />
      </div>

      {/* Sliding Knob */}
      <motion.div
        id="theme-toggle-knob"
        className="flex h-6 w-6 items-center justify-center rounded-full bg-(--cta-bg) text-(--cta-fg) shadow-md z-10"
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          marginLeft: theme === 'dark' ? 'auto' : '0px',
        }}
      >
        <motion.div
          id="theme-toggle-active-icon-container"
          key={theme}
          initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'dark' ? (
            <Moon className="h-3.5 w-3.5 text-(--cta-fg)" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-amber-500" />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
}
