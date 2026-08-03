import { motion } from 'motion/react';
import { Terminal, ShieldAlert, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  onNavigate: (path: string) => void;
}

export default function NotFound({ onNavigate }: NotFoundProps) {
  return (
    <div className="py-20 max-w-md mx-auto text-center space-y-8 flex flex-col justify-center min-h-[60vh]">
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-6 rounded-xl border border-ink-200 bg-ink-50/50 space-y-4 font-mono text-xs"
      >
        <div className="flex items-center gap-2 text-red-500 font-bold border-b border-ink-200 pb-2">
          <ShieldAlert className="h-4 w-4" />
          <span>404 SEGMENTATION FAULT</span>
        </div>
        
        <p className="text-ink-600 text-left leading-relaxed">
          The routing index pointer address is out of bounds. The requested virtual segment does not contain any compiled assets.
        </p>

        <div className="text-left bg-ink-950 text-ink-300 p-4 rounded-md space-y-1 text-[10px]">
          <div>$ route --inspect {window.location.hash}</div>
          <div className="text-red-400">Error: PAGE_NOT_FOUND (0x404)</div>
          <div>$ pointer_restruct --origin</div>
        </div>
      </motion.div>

      <div>
        <button
          onClick={() => onNavigate('/')}
          className="group inline-flex items-center gap-2 bg-ink-950 hover:bg-ink-900 text-white font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Reset Pointer Origin (Go Home)</span>
        </button>
      </div>

    </div>
  );
}
