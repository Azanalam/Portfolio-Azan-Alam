import React, { useState, useEffect, ReactNode } from 'react';
import { PortfolioContext } from '../hooks/usePortfolio';
import { DBStructure } from '../types';

interface PortfolioProviderProps {
  children: ReactNode;
}

export default function PortfolioProvider({ children }: PortfolioProviderProps) {
  const [data, setData] = useState<DBStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');

  const fetchPortfolio = async (retries = 2) => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLoading(false);
      } else if (retries > 0) {
        setTimeout(() => fetchPortfolio(retries - 1), 1000);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load dynamic portfolio config:', err);
      if (retries > 0) {
        setTimeout(() => fetchPortfolio(retries - 1), 1000);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'dark' || saved === 'light') {
      setCurrentTheme(saved);
    } else if (data?.settings?.theme) {
      setCurrentTheme(data.settings.theme);
    }
  }, [data]);

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
  };

  const getDynamicStyles = () => {
    if (!data) return '';
    const brandColor = data.settings?.brandColors?.primary || 'emerald';
    const theme = currentTheme;

    // Map brand colors to hex
    const colorMap: Record<string, { primary: string; rgb: string; hover: string; dim: string }> = {
      emerald: { primary: '#10b981', rgb: '16, 185, 129', hover: '#34d399', dim: '#022c22' },
      cyan: { primary: '#06b6d4', rgb: '6, 182, 212', hover: '#22d3ee', dim: '#083344' },
      indigo: { primary: '#6366f1', rgb: '99, 102, 241', hover: '#818cf8', dim: '#1e1b4b' },
      amber: { primary: '#f59e0b', rgb: '245, 158, 11', hover: '#fbbf24', dim: '#451a03' },
      rose: { primary: '#f43f5e', rgb: '244, 63, 94', hover: '#fb7185', dim: '#4c0519' },
    };

    const colors = colorMap[brandColor] || colorMap.emerald;

    let css = `
      :root {
        --primary-color: ${colors.primary};
        --primary-color-rgb: ${colors.rgb};
        --primary-color-hover: ${colors.hover};
        --primary-color-dim: ${colors.dim};
      }
      
      /* Accent overrides */
      .text-emerald-500, .text-emerald-400 {
        color: var(--primary-color) !important;
      }
      .bg-emerald-500 {
        background-color: var(--primary-color) !important;
      }
      .bg-emerald-950, .bg-emerald-950\\/20, .bg-emerald-950\\/40 {
        background-color: var(--primary-color-dim) !important;
      }
      .bg-emerald-500\\/10 {
        background-color: rgba(var(--primary-color-rgb), 0.1) !important;
      }
      .border-emerald-500\\/10 {
        border-color: rgba(var(--primary-color-rgb), 0.1) !important;
      }
      .border-emerald-500\\/20 {
        border-color: rgba(var(--primary-color-rgb), 0.2) !important;
      }
      .border-emerald-500\\/30 {
        border-color: rgba(var(--primary-color-rgb), 0.3) !important;
      }
      .hover\\:bg-emerald-400:hover {
        background-color: var(--primary-color-hover) !important;
      }
      .focus-visible\\:ring-emerald-500:focus-visible, .focus\\:ring-emerald-500:focus {
        --tw-ring-color: var(--primary-color) !important;
      }
      .focus\\:border-emerald-500:focus {
        border-color: var(--primary-color) !important;
      }
    `;

    if (theme === 'light') {
      css += `
        /* Light mode core overrides (excluding admin-mode elements) */
        body:not(.admin-mode), 
        .min-h-screen:not(.admin-mode) {
          background-color: #fafafa !important;
          color: #18181b !important;
        }
        
        .min-h-screen:not(.admin-mode) .text-white, 
        .min-h-screen:not(.admin-mode) .text-\\[\\#FAFAFA\\], 
        .min-h-screen:not(.admin-mode) .text-zinc-100 {
          color: #18181b !important;
        }
        
        .min-h-screen:not(.admin-mode) .text-\\[\\#A1A1AA\\], 
        .min-h-screen:not(.admin-mode) .text-zinc-400 {
          color: #52525b !important;
        }
        
        .min-h-screen:not(.admin-mode) .text-\\[\\#71717A\\], 
        .min-h-screen:not(.admin-mode) .text-zinc-500 {
          color: #71717a !important;
        }
        
        /* Background overrides */
        .min-h-screen:not(.admin-mode) .bg-black, 
        .min-h-screen:not(.admin-mode) .bg-\\[\\#050505\\], 
        .min-h-screen:not(.admin-mode) .bg-\\[\\#050505\\]\\/85, 
        .min-h-screen:not(.admin-mode) .bg-\\[\\#050505\\]\\/95 {
          background-color: #f4f4f5 !important;
        }
        
        .min-h-screen:not(.admin-mode) .bg-\\[\\#070707\\] {
          background-color: #f4f4f5 !important;
        }
        
        .min-h-screen:not(.admin-mode) .bg-\\[\\#0a0a0a\\], 
        .min-h-screen:not(.admin-mode) .bg-\\[\\#0A0A0A\\], 
        .min-h-screen:not(.admin-mode) .bg-zinc-900 {
          background-color: #ffffff !important;
        }
        
        .min-h-screen:not(.admin-mode) .bg-\\[\\#111111\\], 
        .min-h-screen:not(.admin-mode) .bg-\\[\\#111\\] {
          background-color: #f4f4f5 !important;
        }
        
        .min-h-screen:not(.admin-mode) .bg-\\[\\#1a1a1a\\], 
        .min-h-screen:not(.admin-mode) .bg-\\[\\#1A1A1A\\], 
        .min-h-screen:not(.admin-mode) .bg-zinc-800 {
          background-color: #e4e4e7 !important;
        }
        
        /* Border overrides */
        .min-h-screen:not(.admin-mode) .border-\\[\\#1A1A1A\\], 
        .min-h-screen:not(.admin-mode) .border-zinc-800 {
          border-color: #e4e4e7 !important;
        }
        
        .min-h-screen:not(.admin-mode) .border-\\[\\#27272A\\], 
        .min-h-screen:not(.admin-mode) .border-zinc-700 {
          border-color: #d4d4d8 !important;
        }
        
        .min-h-screen:not(.admin-mode) .hover\\:border-\\[\\#27272A\\]:hover {
          border-color: #a1a1aa !important;
        }
        
        /* Command palette specific overrides */
        .min-h-screen:not(.admin-mode) .bg-black\\/80 {
          background-color: rgba(255, 255, 255, 0.8) !important;
        }
        
        /* Selection colors */
        ::selection {
          background-color: var(--primary-color) !important;
          color: #ffffff !important;
        }
      `;
    }

    return css;
  };

  return (
    <PortfolioContext.Provider value={{ data, loading, refresh: fetchPortfolio, theme: currentTheme, toggleTheme }}>
      <style>{getDynamicStyles()}</style>
      {children}
    </PortfolioContext.Provider>
  );
}
