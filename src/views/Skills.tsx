import { useState, useMemo, useEffect, ComponentType } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { 
  Cpu, Terminal, Check, Sparkles, Code, Database, Server, Settings, 
  GitBranch, Layers, Activity, Search, LayoutGrid, Network, Info
} from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';

// Map icon names to Lucide icon components
const iconMap: Record<string, ComponentType<any>> = {
  'React': Code,
  'TypeScript': BracesIcon,
  'Wind': Activity,
  'Zap': Sparkles,
  'Server': Server,
  'Cpu': Cpu,
  'Database': Database,
  'Settings': Settings,
  'GitBranch': GitBranch,
  'Layers': Layers
};

function BracesIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m18 16-4-4 4-4" />
      <path d="m6 8 4 4-4 4" />
      <path d="M14.5 4h.5c.6 0 1 .4 1 1v2c0 .6.4 1 1 1h1" />
      <path d="M9.5 20H9c-.6 0-1-.4-1-1v-2c0-.6-.4-1-1-1H6" />
    </svg>
  );
}

// Generate terminal log outputs for specific skill items to provide developer aesthetics
const getTelemetryLogs = (name: string): string[] => {
  if (name.includes('React')) {
    return [
      'SYS_INIT: Initializing React 19 concurrent reconciliation engine...',
      'SYS_HYDRATION: Triggering asynchronous server-component hydration...',
      'SYS_OPTIMIZATION: Fiber tree memory bounds strictly limited under 1.2ms SLA.',
      'STATUS_OK: Virtual DOM diff tree successfully reconciled without layout thrashing.'
    ];
  }
  if (name.includes('TypeScript')) {
    return [
      'TSC_INIT: Compiling 128 strict Abstract Syntax Trees...',
      'TSC_ANALYSIS: Resolving deep structural algebraic types and interfaces...',
      'TSC_STRICT: Enforcing strictNullChecks & zero implicit-any boundaries...',
      'STATUS_OK: Static type validation finished successfully (0 compilation errors).'
    ];
  }
  if (name.includes('Tailwind')) {
    return [
      'STYLE_COMPOSE: Bundling JIT Tailwind utility token registry...',
      'STYLE_OPTIMIZE: Purging unreferenced classes, bundling critical assets...',
      'STYLE_AAA: Verifying WCAG 2.2 color contrast guidelines (exceeds 7:1 ratio).',
      'STATUS_OK: Production stylesheet compiled down to 3.8KB (gzipped).'
    ];
  }
  if (name.includes('Motion')) {
    return [
      'MOTION_CLOCK: Initializing high-frequency physics spring solver...',
      'MOTION_HARDWARE: Requesting hardware accelerated GPU compositing layers...',
      'MOTION_FRAME: Rendering navigation enter transitions (0 dropped frames at 120Hz).',
      'STATUS_OK: Interpolation springs fully stabilized.'
    ];
  }
  if (name.includes('Node')) {
    return [
      'SERVER_BOOT: Establishing cluster of Express server worker instances...',
      'SERVER_SOCKET: Attaching stateful sub-protocol WebSockets on listener...',
      'SERVER_BENCH: Sub-5ms client network handshakes achieved in production clusters.',
      'STATUS_OK: Multi-threaded server bounds online on port 3000.'
    ];
  }
  if (name.includes('Assembly') || name.includes('WASM')) {
    return [
      'WASM_INIT: Allocating typed 8-bit linear memory buffer (64KB heap chunks)...',
      'WASM_DECODE: Demangling 16-bit binary opcodes from WASM MVP spec...',
      'WASM_JIT: Just-In-Time compiler compiling performance critical subroutines...',
      'STATUS_OK: Isolated memory sandbox established securely.'
    ];
  }
  if (name.includes('IndexedDB') || name.includes('Local')) {
    return [
      'DB_TRANSACTION: Opening ACID local IndexedDB transactional queue...',
      'DB_CRDT: Merging LWW-Element-Set clocks on transactional record lines...',
      'DB_SYNC: Resolving differential peer-to-peer sync protocols...',
      'STATUS_OK: Storage persistence initialized successfully (0 bytes stale).'
    ];
  }
  if (name.includes('Vite') || name.includes('esbuild')) {
    return [
      'VITE_COMPILER: Triggering Hot Module Replacement background server...',
      'VITE_TREE_SHAKE: Pruning redundant non-exported ES module tree paths...',
      'VITE_PARALLEL: Allocating multi-threaded compiler pools on local cores...',
      'STATUS_OK: App compiled in 42ms with zero allocation waste.'
    ];
  }
  if (name.includes('CI/CD')) {
    return [
      'CI_INTEGRATION: Spawning lint/audit virtual runners in isolated pods...',
      'CI_TEST: Triggering playwright suite and a11y telemetry analyzers...',
      'CI_DEPLOY: Streaming production static assets to global Cloud Run buckets...',
      'STATUS_OK: Integration pipeline validated successfully.'
    ];
  }
  if (name.includes('Docker')) {
    return [
      'DOCKER_ENGINE: Locating base multi-stage Alpine images...',
      'DOCKER_IMAGE: Building cached layers for minimized container distribution...',
      'DOCKER_NETWORK: Binding virtual ports and configuring ingress gateways...',
      'STATUS_OK: Secure container boundary initialized successfully.'
    ];
  }
  return [
    'SYSTEM_TELEMETRY: Accessing telemetry diagnostic streams...',
    'SYSTEM_VERIFY: Validating secure connection signature...',
    'SYSTEM_STATUS: Diagnostic bounds within normal operating parameters.',
    'STATUS_OK: Module active.'
  ];
};

export default function Skills() {
  const { data, loading } = usePortfolio();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'topology' | 'matrix'>('topology');
  const [selectedSkillId, setSelectedSkillId] = useState<string>('0-0');

  const skillGroups = useMemo(() => data?.skills || [], [data]);

  // Generate centers dynamically based on the number of groups
  const centers = useMemo(() => {
    const list: { id: string; category: string; x: number; y: number; color: string }[] = [];
    const n = skillGroups.length;
    if (n === 0) return list;

    skillGroups.forEach((group, idx) => {
      let x = 400;
      let y = 225;
      if (n === 1) {
        x = 400; y = 225;
      } else if (n === 2) {
        x = idx === 0 ? 250 : 550;
        y = 225;
      } else if (n === 3) {
        if (idx === 0) { x = 200; y = 150; }
        else if (idx === 1) { x = 600; y = 150; }
        else { x = 400; y = 320; }
      } else {
        const angle = (idx / n) * 2 * Math.PI - Math.PI / 2;
        x = 400 + 220 * Math.cos(angle);
        y = 225 + 100 * Math.sin(angle);
      }
      list.push({
        id: `group-${idx}`,
        category: group.category,
        x,
        y,
        color: '#10B981'
      });
    });
    return list;
  }, [skillGroups]);

  // Map flat node representation of skills with precise coordinates
  const skillsNodes = useMemo(() => {
    const nodes: {
      id: string;
      name: string;
      category: string;
      x: number;
      y: number;
      level: 'Expert' | 'Advanced' | 'Intermediate';
      years: number;
      useCase: string;
      iconName: string;
      groupIndex: number;
    }[] = [];

    if (centers.length === 0) return nodes;

    skillGroups.forEach((group, gIdx) => {
      const center = centers[gIdx];
      if (!center) return;
      const n = group.skills.length;
      group.skills.forEach((skill, sIdx) => {
        // Space nodes in a perfect circular orbit around their respective group hub center
        const angle = (sIdx / n) * 2 * Math.PI - Math.PI / 2;
        const radius = 95;
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + radius * Math.sin(angle);
        
        nodes.push({
          id: `${gIdx}-${sIdx}`,
          name: skill.name,
          category: group.category,
          x,
          y,
          level: skill.level,
          years: skill.years,
          useCase: skill.useCase,
          iconName: skill.iconName,
          groupIndex: gIdx
        });
      });
    });

    return nodes;
  }, [skillGroups, centers]);

  // Filter skills based on query input
  const filteredSkillsNodes = useMemo(() => {
    if (!search.trim()) return skillsNodes;
    const query = search.toLowerCase();
    return skillsNodes.filter(node => 
      node.name.toLowerCase().includes(query) ||
      node.category.toLowerCase().includes(query) ||
      node.useCase.toLowerCase().includes(query) ||
      node.level.toLowerCase().includes(query)
    );
  }, [search, skillsNodes]);

  // Find the currently selected skill object
  const currentSkill = useMemo(() => {
    if (skillsNodes.length === 0) return null;
    return skillsNodes.find(node => node.id === selectedSkillId) || skillsNodes[0];
  }, [selectedSkillId, skillsNodes]);

  // Terminal telemetry log display
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  
  useEffect(() => {
    if (currentSkill) {
      setTerminalLogs(getTelemetryLogs(currentSkill.name));
    }
  }, [currentSkill]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center font-mono text-xs text-(--text-muted) gap-2">
        <svg className="animate-spin h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Loading capabilities topology...</span>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 py-12 md:py-16"
    >
      
      {/* Title Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
          <Cpu className="h-4 w-4" />
          <span>CAPABILITIES MATRIX</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-(--text-1)">
          Technical Capabilities & Expertise
        </h1>
        <p className="text-sm sm:text-base text-(--text-mid) max-w-2xl font-sans">
          An interactive, telemetry-driven breakdown of technical networks and engineering layers. Toggle views to inspect deep production validation loops.
        </p>
      </div>

      {/* Toolbar Options */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-(--line) bg-(--surface)">
        
        {/* Live Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--text-muted)" />
          <input
            type="text"
            placeholder="Search capability or stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-(--bg) border border-(--line) rounded-lg text-sm text-(--text-1) placeholder-(--text-faint) focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            aria-label="Search skills"
          />
        </div>

        {/* Display Mode Toggles */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Visual representation type">
          <button
            role="tab"
            aria-selected={activeTab === 'topology'}
            onClick={() => setActiveTab('topology')}
            className={`px-4 py-2 text-[10px] font-mono font-bold tracking-tight uppercase rounded-md border transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              activeTab === 'topology'
                ? 'bg-(--cta-bg) text-(--cta-fg) border-white shadow-sm'
                : 'bg-(--surface-3) text-(--text-mid) border-(--line-strong) hover:text-(--text-1) hover:border-(--text-faint)'
            }`}
          >
            <Network className="h-3 w-3" />
            <span>Interactive Topology</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'matrix'}
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 text-[10px] font-mono font-bold tracking-tight uppercase rounded-md border transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-(--cta-bg) text-(--cta-fg) border-white shadow-sm'
                : 'bg-(--surface-3) text-(--text-mid) border-(--line-strong) hover:text-(--text-1) hover:border-(--text-faint)'
            }`}
          >
            <LayoutGrid className="h-3 w-3" />
            <span>Structured Bento</span>
          </button>
        </div>

      </div>

      {/* Main Dynamic Workspace Panel */}
      <AnimatePresence mode="wait">
        {activeTab === 'topology' ? (
          <motion.div
            key="topology-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Column: Interactive Topology Chart Canvas */}
            <div className="lg:col-span-7 p-6 rounded-xl border border-(--line) bg-(--surface) flex flex-col justify-between overflow-hidden relative min-h-[460px] select-none">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[10px] font-mono text-(--text-muted)">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>DETERMINISTIC INTERACTIVE GRAPH</span>
                </div>
                <div className="text-[9px] font-mono text-(--text-faint) hidden sm:block">
                  SELECT NODES FOR DIAGNOSTICS
                </div>
              </div>

              {/* Responsive SVG Graph Container */}
              <div className="w-full flex justify-center items-center overflow-auto py-4">
                {skillsNodes.length === 0 ? (
                  <div className="text-xs font-mono text-(--text-muted)">No skill nodes available. Populate in the CMS.</div>
                ) : (
                  <svg
                    viewBox="0 0 800 450"
                    className="w-full max-w-[680px] h-auto drop-shadow-2xl animate-fade-in"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                      </linearGradient>
                      <style>{`
                        @keyframes pulseLine {
                          to {
                            stroke-dashoffset: -20;
                          }
                        }
                        .line-pulse {
                          stroke-dasharray: 6, 4;
                          animation: pulseLine 1.5s linear infinite;
                        }
                      `}</style>
                    </defs>

                    {/* Inter-discipline system backbone connections (Dashed grid connections) */}
                    {centers.length > 1 && centers.map((c, idx) => {
                      const next = centers[(idx + 1) % centers.length];
                      return (
                        <line 
                          key={`backbone-${idx}`}
                          x1={c.x} y1={c.y} x2={next.x} y2={next.y} 
                          className="stroke-(--surface-3) stroke-1" 
                          strokeDasharray="4,4" 
                        />
                      );
                    })}

                    {/* Core connection lines to actual items */}
                    {filteredSkillsNodes.map((node) => {
                      const center = centers[node.groupIndex];
                      if (!center) return null;
                      const isSelected = node.id === selectedSkillId;
                      return (
                        <g key={`line-${node.id}`}>
                          <line
                            x1={center.x}
                            y1={center.y}
                            x2={node.x}
                            y2={node.y}
                            className={`transition-all duration-300 ${
                              isSelected 
                                ? 'stroke-emerald-500/60 stroke-2 line-pulse' 
                                : 'stroke-(--surface-3) stroke-[1.5px] hover:stroke-(--line-strong)'
                            }`}
                          />
                        </g>
                      );
                    })}

                    {/* Hub Centers Layer */}
                    {centers.map((center, index) => {
                      const hasActiveFilter = search.trim() && 
                        filteredSkillsNodes.some(node => node.groupIndex === index);
                      
                      return (
                        <g key={center.id} className="transition-all duration-300">
                          <circle
                            cx={center.x}
                            cy={center.y}
                            r="20"
                            className={`fill-(--bg) border transition-colors duration-300 ${
                              hasActiveFilter ? 'stroke-emerald-500' : 'stroke-(--line-strong)'
                            }`}
                            strokeWidth="2"
                          />
                          <circle
                            cx={center.x}
                            cy={center.y}
                            r="6"
                            className="fill-emerald-500"
                          />
                          <text
                            x={center.x}
                            y={center.y - 28}
                            textAnchor="middle"
                            className="fill-(--text-mid) text-[10px] font-mono font-bold tracking-wider uppercase"
                          >
                            {center.category.split(' ')[0].toUpperCase()} HUB
                          </text>
                        </g>
                      );
                    })}

                    {/* Skill Nodes Layer */}
                    {filteredSkillsNodes.map((node) => {
                      const isSelected = node.id === selectedSkillId;
                      
                      return (
                        <g
                          key={node.id}
                          onClick={() => setSelectedSkillId(node.id)}
                          className="cursor-pointer group"
                        >
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="18"
                            className={`transition-all duration-300 ${
                              isSelected 
                                ? 'fill-(--tint)/90 stroke-emerald-500 stroke-2' 
                                : 'fill-(--surface) stroke-(--line-strong) hover:stroke-(--line-strong) hover:fill-(--surface-2)'
                            }`}
                          />

                          <text
                            x={node.x}
                            y={node.y + 30}
                            textAnchor="middle"
                            className={`text-[9px] font-mono font-medium tracking-tight transition-all duration-300 ${
                              isSelected ? 'fill-white font-bold' : 'fill-(--text-muted) group-hover:fill-(--text-mid)'
                            }`}
                          >
                            {node.name.split(' ')[0]}
                          </text>

                          {node.level === 'Expert' && (
                            <circle
                              cx={node.x + 12}
                              cy={node.y - 12}
                              r="3"
                              className="fill-emerald-400 animate-pulse"
                            />
                          )}

                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="24"
                            className="fill-transparent"
                          />
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>

              {/* Map Footer Metadata */}
              <div className="flex items-center gap-4 text-[10px] text-(--text-faint) font-sans border-t border-(--line) pt-4">
                <Info className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
                <p>
                  Our interactive topology maps continuous orbital nodes based on operational domains. Select an orbital node to execute diagnostic traces.
                </p>
              </div>
            </div>

            {/* Right Column: Skill Statistics & Interactive Telemetry Terminal */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              
              {/* Telemetry Header Details Card */}
              {currentSkill ? (
                <div className="p-6 rounded-xl border border-(--line) bg-(--surface) space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase tracking-widest bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded">
                        {currentSkill.level.toUpperCase()} LEVEL
                      </span>
                      <h3 className="text-xl font-bold text-(--text-1) tracking-tight pt-1">
                        {currentSkill.name}
                      </h3>
                      <p className="text-[10px] text-(--text-muted) font-mono uppercase tracking-wider">
                        {currentSkill.category}
                      </p>
                    </div>
                    
                    <span className="h-10 w-10 rounded-lg bg-(--surface-2) border border-(--line-strong) flex items-center justify-center text-emerald-400">
                      {(() => {
                        const Icon = iconMap[currentSkill.iconName] || Code;
                        return <Icon className="h-5 w-5" />;
                      })()}
                    </span>
                  </div>

                  {/* Practical Use Cases Details */}
                  <div className="space-y-2 border-t border-(--line) pt-4">
                    <span className="text-[10px] font-mono text-(--text-faint) uppercase tracking-widest font-semibold block">
                      PRODUCTION DEPLOYMENT VALIDATION:
                    </span>
                    <p className="text-xs text-(--text-mid) leading-relaxed font-sans">
                      {currentSkill.useCase}
                    </p>
                  </div>

                  {/* Quantitative System Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-(--line)">
                    <div className="bg-(--bg) border border-(--line) p-3 rounded-lg text-center">
                      <span className="text-[9px] font-mono text-(--text-faint) uppercase block">DEPLOYED PERIOD</span>
                      <span className="text-lg font-mono font-bold text-(--text-1) mt-0.5 inline-block">
                        {currentSkill.years} Years
                      </span>
                    </div>
                    <div className="bg-(--bg) border border-(--line) p-3 rounded-lg text-center">
                      <span className="text-[9px] font-mono text-(--text-faint) uppercase block">PIPELINE VERIFY</span>
                      <span className="text-xs font-mono font-bold text-emerald-500 mt-1.5 flex items-center justify-center gap-1">
                        <Check className="h-3 w-3" /> SUCCESS
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-(--line) bg-(--surface) text-center text-xs font-mono text-(--text-muted)">
                  Select a skill node to view diagnostics telemetry.
                </div>
              )}

              {/* Developer Interactive Telemetry Terminal */}
              <div className="p-5 rounded-xl border border-(--line) bg-(--bg) flex-1 flex flex-col justify-between font-mono text-xs min-h-[220px]">
                <div className="flex items-center justify-between pb-3 border-b border-(--line)">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 text-(--text-faint)" />
                    <span className="text-[10px] text-(--text-muted) uppercase font-bold tracking-tight">TELEMETRY DIAGNOSTICS</span>
                  </div>
                  <span className="text-[9px] text-emerald-500 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-900/30 font-semibold animate-pulse">
                    ONLINE
                  </span>
                </div>

                {/* Interactive CLI typewritings */}
                <div className="py-4 space-y-2.5 flex-1 select-text">
                  {terminalLogs.map((log, i) => {
                    const isStatus = log.includes('STATUS_OK');
                    return (
                      <div key={i} className="leading-relaxed text-[11px]">
                        <span className="text-emerald-500 select-none mr-2">&gt;</span>
                        <span className={isStatus ? 'text-emerald-400 font-bold' : 'text-(--text-2)'}>
                          {log}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-(--line) text-[9px] text-(--text-faint) flex justify-between">
                  <span>FRAME BUFFER 60FPS</span>
                  <span>SHA256 STABLE</span>
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          /* Structured Bento Cards Matrix View (Optimized with responsive filters) */
          <motion.div
            key="matrix-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-12"
          >
            {skillGroups.length === 0 ? (
              <div className="p-12 text-center rounded-xl border border-dashed border-(--line) bg-(--surface) text-xs font-mono text-(--text-muted)">
                No skill groups present in CMS. Add new ones in the Admin panel!
              </div>
            ) : (
              skillGroups.map((group) => {
                const groupSkills = group.skills.filter(skill => {
                  if (!search.trim()) return true;
                  const q = search.toLowerCase();
                  return skill.name.toLowerCase().includes(q) || skill.useCase.toLowerCase().includes(q);
                });

                if (groupSkills.length === 0) return null;

                return (
                  <section key={group.category} className="space-y-6">
                    
                    {/* Group Title Section */}
                    <div className="space-y-1 border-b border-(--line) pb-3">
                      <h2 className="text-lg font-bold text-(--text-1) tracking-tighter flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>{group.category}</span>
                      </h2>
                      <p className="text-[10px] text-(--text-muted) font-mono tracking-wider uppercase">
                        {group.description}
                      </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupSkills.map((skill) => {
                        const Icon = iconMap[skill.iconName] || Code;
                        return (
                          <motion.div
                            key={skill.name}
                            variants={itemVariants}
                            whileHover={{ y: -2 }}
                            className="p-5 rounded-xl border border-(--line) bg-(--surface) hover:border-(--line-strong) flex flex-col justify-between transition duration-200"
                          >
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-0.5">
                                  <h3 className="font-bold text-sm text-(--text-1) tracking-tight flex items-center gap-2">
                                    <span>{skill.name}</span>
                                  </h3>
                                  <div className="flex items-center gap-2 text-[10px] font-mono text-(--text-muted)">
                                    <span>{skill.years} {skill.years === 1 ? 'Year' : 'Years'} Exp</span>
                                    <span>•</span>
                                    <span className="font-semibold text-emerald-500">
                                      {skill.level.toUpperCase()}
                                    </span>
                                  </div>
                                </div>

                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-(--surface-2) border border-(--line) text-emerald-400">
                                  <Icon className="h-4 w-4" />
                                </span>
                              </div>

                              <p className="text-xs text-(--text-mid) leading-relaxed font-sans border-t border-(--line) pt-3">
                                {skill.useCase}
                              </p>
                            </div>

                            <div className="pt-4 flex items-center gap-1.5 text-[9px] font-mono text-(--text-faint)">
                              <Sparkles className="h-3 w-3 text-emerald-500" />
                              <span>Validated in production pipeline</span>
                            </div>

                          </motion.div>
                        );
                      })}
                    </div>

                  </section>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Philosophy Section */}
      <motion.section 
        variants={itemVariants}
        className="p-6 sm:p-8 rounded-xl border border-(--line) bg-(--surface) space-y-4"
      >
        <h3 className="font-bold text-xs text-(--text-1) uppercase tracking-widest font-mono flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-500" />
          <span>My Approach to Technical Selection</span>
        </h3>
        <p className="text-xs sm:text-sm text-(--text-mid) leading-relaxed font-sans">
          I choose technologies based on standard engineering bounds (safety, payload weight, concurrency, and compliance) rather than passing visual trends. A pristine type system paired with robust automated pipeline verification is highly preferred over importing bloated boilerplate libraries. I aim to keep dependencies minimal to maintain long-term codebase health.
        </p>
      </motion.section>

    </motion.div>
  );
}
