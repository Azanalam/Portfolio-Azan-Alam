import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, User, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { useHashRoute } from '../hooks/useHashRoute';

export default function AdminLogin() {
  const { navigate } = useHashRoute();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          const status = await res.json();
          if (status.authenticated) {
            navigate('/admin');
          }
        }
      } catch (err) {
        console.error('Error checking authentication status:', err);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Please provide administrative credentials.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // Success
        navigate('/admin');
        window.location.reload(); // Hard reload to clear client caches and sync session states
      } else {
        const data = await res.json();
        setError(data.error || 'Authentication handshake rejected.');
      }
    } catch (err) {
      setError('A connection error occurred. Verify that the fullstack server is operational.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#222] transition-colors rounded-2xl p-8 space-y-6 shadow-2xl relative"
      >
        {/* Top styling line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-emerald-600 to-transparent rounded-t-2xl" />

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs text-[#71717A] hover:text-white transition font-mono uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return Home</span>
        </button>

        {/* Header Branding */}
        <div className="space-y-2 text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">
            Administrative Access
          </h1>
          <p className="text-xs text-[#71717A] uppercase font-mono tracking-widest">
            CMS Core Controller
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3 bg-red-950/30 border border-red-500/30 rounded-lg flex items-start gap-2.5 text-xs text-red-400 font-sans"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">
              Administrative Identifier
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#52525B]">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-[#111111] border border-[#1A1A1A] text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider block">
              Security Key Phrase
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#52525B]">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                className="w-full bg-[#111111] border border-[#1A1A1A] text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-neutral-100 disabled:bg-[#1A1A1A] text-black disabled:text-[#52525B] font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-2 border border-white"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Validating Session...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Initialize Secure Control</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
