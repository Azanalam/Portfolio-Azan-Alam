import { Project } from '../types';

export const projects: Project[] = [
  {
    slug: 'aether-vm',
    title: 'Aether WASM engine',
    subtitle: 'High-performance WebAssembly compiler & interpreter in TypeScript',
    description: 'A sandboxed WASM runtime and parser supporting full-stack dynamic execution, memory isolation, and structural control flow visualization.',
    longDescription: 'Aether is an advanced WebAssembly interpreter and execution visualizer built to run directly inside modern browser environments. It decompiles compiled `.wasm` binaries, extracts their structural AST, validates the bytecode against the WASM core specification, and provides an isolated execution context. It was designed to solve the problem of client-side safe execution of untrusted computation with high visibility into stack operations, register allocations, and execution speed.',
    tags: ['WebAssembly', 'TypeScript', 'AST Parsing', 'Compilers', 'Performance'],
    category: 'systems',
    githubUrl: 'https://github.com/example/aether-vm',
    liveUrl: '#/projects/aether-vm',
    featured: true,
    problemStatement: 'Running heavy native computations on client devices is usually unsafe or opaque. Existing WebAssembly engines run in a native sandbox, but developers lack fine-grained, instruction-by-instruction visualization of the stack, registers, and execution overhead. This makes compiler debugging and security auditing of untrusted binaries extremely difficult.',
    goals: [
      'Parse standard WebAssembly binary format (MVP specification) with zero external dependencies.',
      'Provide an interactive, step-by-step visual interpreter showing stack states, local variables, and memory spaces.',
      'Achieve sub-millisecond execution times for standard algorithmic suites (Fibonacci, Matrix multiplication) inside the virtual interpreter.'
    ],
    solution: 'Designed and implemented an 8-bit instruction decoder and virtual stack machine entirely in TypeScript. The binary reader parses magic headers, type sections, function signatures, and code sections into a custom binary AST. The runtime engine uses an array buffer representing WASM linear memory and custom registers to track call frames, yielding an in-browser sandbox with 100% telemetry access.',
    architecture: 'The system uses an isolated, single-threaded pipeline divided into three layers: a Binary Decoder that maps byte streams to typed instruction nodes, a Code Validator that enforces WASM structural type-safety (type stack verification), and a Stack-Machine Interpreter that executes instruction payloads against simulated memory grids.',
    folderStructure: `aether-vm/
├── src/
│   ├── parser/
│   │   ├── binary-reader.ts   # Parses bytes into custom TS structures
│   │   └── section-parser.ts  # Decodes functions, globals, memory
│   ├── interpreter/
│   │   ├── virtual-machine.ts # Core stack execution engine
│   │   ├── instructions.ts    # Decodes opcodes (0x00 - 0xBF)
│   │   └── memory.ts          # Simulates isolated linear memory buffer
│   └── visualizer/
│       ├── stack-ui.tsx       # Real-time state visualization
│       └── AST-graph.tsx      # SVG representation of WASM code
└── package.json`,
    challenges: [
      {
        title: 'Decoding Multi-byte LEB128 Integers',
        description: 'WebAssembly uses Variable-Length Quantity (VLQ) encoding (LEB128) for variable-size numbers. Implementing a zero-allocation, fast bitwise decoder in JS was tricky because of sign extension issues on negative 32-bit and 64-bit bounds.'
      },
      {
        title: 'Handling Control Flow with Nested Labels',
        description: 'Implementing `block`, `loop`, and `br` instructions requires jump tables. Since the stack machine processes instructions linearly, loops required pre-computing branch destinations to achieve high execution performance.'
      }
    ],
    tradeoffs: [
      {
        title: 'ArrayBuffer vs Standard Objects for Memory',
        choice: 'Direct 8-bit typed array buffers (Uint8Array)',
        reason: 'Using objects for memory cells is easier to build but ruins CPU cache efficiency and causes massive GC pauses. Array buffers offer literal low-level memory layout control and near-instant slice/writes.'
      },
      {
        title: 'Static Jump Table Compilation vs Dynamic Loop Evaluation',
        choice: 'Static jump table indexing during compile phase',
        reason: 'Dynamic searching on every branch instruction (br, br_if) introduces O(N) lookup overhead. Pre-calculating branch indices during parsing yields O(1) jumps, making loops 8.4x faster.'
      }
    ],
    accessibility: [
      'Accessible stack table using standard HTML caption and tabular semantics.',
      'High-contrast visualization mode using pure Tailwind border patterns compatible with monochrome screens.',
      'Keyboard navigation mapping: Spacebar to step-execute, Escape to reset interpreter context.'
    ],
    performance: [
      { metric: 'Binary Decode Speed', before: '14.2ms', after: '1.1ms', technique: 'Avoided converting chunks to string, processed directly via Uint8Array bitmasks' },
      { metric: 'Memory Access Latency', before: '420ns', after: '12ns', technique: 'Replaced dynamic object-lookup addresses with direct typed index access' },
      { metric: 'AST Rendering FPS', before: '24 FPS', after: '60 FPS', technique: 'Virtualized nodes outside of the visible scroll viewport' }
    ],
    lessons: [
      'Never underestimate bitwise manipulation in modern engines. V8 optimizes typed-array bit operations down to native processor instructions.',
      'Telemetry and debugging state are highly valuable. The visuals of the VM stack make teaching compilers a delightful, spatial experience.'
    ]
  },
  {
    slug: 'quill-db',
    title: 'Quill Sync Database',
    subtitle: 'Offline-First local storage with CRDT real-time syncing',
    description: 'An indexedDB-powered key-value database featuring logical replication, LWW-Element-Set CRDTs, and differential sync protocols.',
    longDescription: 'QuillDB is a compact, transactional, offline-first client-side database with embedded conflict resolution algorithms. It operates as a local storage layer in the browser, storing documents securely inside IndexedDB. When internet connection is restored, QuillDB establishes a secure WebSocket handshake, evaluates logical vector clocks, resolves concurrent updates automatically using LWW-Element-Set CRDT algorithms, and replicates missing mutations with the remote backend.',
    tags: ['IndexedDB', 'CRDTs', 'WebSockets', 'Synchronization', 'Database Design'],
    category: 'fullstack',
    githubUrl: 'https://github.com/example/quill-db',
    liveUrl: '#/projects/quill-db',
    featured: true,
    problemStatement: 'Modern web applications frequently break or lose state when internet connectivity drops. Building collaborative apps that work offline requires complex conflict resolution. Developers are forced to either use massive, heavy database suites or build fragile, buggy custom sync timers.',
    goals: [
      'Support transactional reads and writes under 5ms, persisting permanently inside local IndexedDB.',
      'Achieve conflict-free replication with absolute convergence over unreliable, flaky, or high-latency networks.',
      'Keep the total bundle footprint under 20KB gzipped for seamless integration in performance-sensitive apps.'
    ],
    solution: 'Engineered a light IndexedDB transaction wrapper that executes operations in isolated queues. Integrated a Last-Write-Wins (LWW) element set CRDT to merge database rows on conflicting inputs. The sync layer implements delta-state replication rather than complete table pushes, transmitting only JSON-patch differences to save user bandwidth.',
    architecture: 'Built on a dual-store architecture. The Local Store coordinates ACID transactions with IndexedDB. The Sync Engine tracks a local transaction log containing vector clock timestamps. On connection triggers, it initiates a peer-to-peer differential sync with the server, negotiating a common ancestor state and sending only transaction logs since that common epoch.',
    folderStructure: `quill-db/
├── src/
│   ├── storage/
│   │   ├── idb-manager.ts     # Wrapper for raw browser IndexedDB
│   │   └── transaction.ts     # Handles write/read lock safety
│   ├── crdt/
│   │   ├── lww-set.ts         # Last-Write-Wins Element Set logic
│   │   └── vector-clock.ts    # Logical clocks tracking concurrency
│   └── replication/
│       ├── sync-manager.ts    # WebSocket handler & network listeners
│       └── delta-patcher.ts   # Computes differences between client/server
└── package.json`,
    challenges: [
      {
        title: 'Browser Tab Concurrency and Race Conditions',
        description: 'When users open multiple browser tabs of the same app, accessing IndexedDB simultaneously causes write locks. We resolved this by building a Mutex Coordinator using the Web Locks API to elect a "leader tab" that handles all DB modifications.'
      },
      {
        title: 'Handling Server Timestamp Drifts',
        description: 'Clients and servers rarely have perfectly aligned system clocks. Trusting the machine clock for CRDT conflict resolution causes silent data loss. We moved to hybrid logical clocks (HLC) that combine physical clocks with monotonic sequence counters.'
      }
    ],
    tradeoffs: [
      {
        title: 'LWW-Set CRDT vs Yjs-Style Tree CRDT',
        choice: 'LWW-Set CRDT (Last-Write-Wins)',
        reason: 'Yjs-style tree CRDTs are perfect for fine-grained rich text, but the overhead of tracking character-by-character histories is massive. LWW-Set provides perfect convergence for transactional document states with zero memory bloat.'
      },
      {
        title: 'Persistent WebSocket Handshake vs Polling/Fetch Protocol',
        choice: 'Sub-protocol WebSocket handshakes',
        reason: 'Polling wastes server resource and client battery. WebSockets provide a stateful channel, enabling server-to-client real-time pushes, cutting latency from 1.2 seconds down to 4ms.'
      }
    ],
    accessibility: [
      'Visual indicator of database status (Connected / Offline / Syncing) uses high-contrast text and ARIA-live alerts.',
      'Database logs are fully keyboard accessible with tab-focusable details.',
      'Supports high-contrast screen modes and uses color-independent glyphs (checkmarks, error crosses) for state indication.'
    ],
    performance: [
      { metric: 'Write Transaction Speed', before: '22ms', after: '1.9ms', technique: 'Batched individual writes into structured asynchronous IndexedDB transaction bulk operations' },
      { metric: 'Sync Payload Size', before: '148KB', after: '1.4KB', technique: 'Implemented JSON-diff delta compression, avoiding sending identical unchanged object headers' },
      { metric: 'Idle CPU Footprint', before: '2.4%', after: '0.01%', technique: 'Switched connection ping timers to requestIdleCallback when browser is unfocused' }
    ],
    lessons: [
      'Offline-first is a product design challenge, not just a technical one. Informing users that they are working safely offline establishes high trust.',
      'Vector clocks are mathematically robust. Trusting network sync logic to timestamps is a recipe for catastrophic data deletion.'
    ]
  },
  {
    slug: 'flux-ui',
    title: 'Flux Headless System',
    subtitle: 'Zero-JS accessible UI compiler and design primitive system',
    description: 'A React design framework focused on semantic HTML structure, compiling down to modern CSS grids, containing pristine screen-reader telemetry.',
    longDescription: 'FluxUI is a high-performance design primitive framework that generates ultra-lightweight, WCAG AA compliant interactive components. It replaces traditional heavy JavaScript layout engines with pure modern CSS custom properties, container queries, and subgrid features. The core philosophy of FluxUI is that visual structures should be built of clean semantic HTML markup that operates beautifully without a script tag, using JS solely to bridge state and handle advanced ARIA-role mutations.',
    tags: ['Design Systems', 'CSS Grid', 'Accessibility', 'Web Components', 'Tailwind'],
    category: 'frontend',
    githubUrl: 'https://github.com/example/flux-ui',
    liveUrl: '#/projects/flux-ui',
    featured: true,
    problemStatement: 'Most accessible React UI libraries (like HeadlessUI or Radix) require significant runtime JS payloads to handle layouts, keyboard navigation, and transitions. On low-end mobile devices, this causes bad First Input Delay (FID) and cumulative layout shifts.',
    goals: [
      'Provide fully accessible UI components with zero initial JS execution overhead for layout rendering.',
      'Compile custom components into pure modern CSS-driven state machines using Tailwind utility classes.',
      'Achieve strict WCAG AAA and Section 508 compliance across every basic component (Tabs, Dialogs, Selects).'
    ],
    solution: 'Designed a component structure leveraging native HTML elements (like details/summary for accordions, dialog for modals). Keyboard navigation is wired using zero-dependency lightweight focus traps. Component visuals are responsive entirely via CSS container queries, preventing layout shifting on slow networks.',
    architecture: 'A monorepo structure containing primitive components styled entirely via responsive CSS variables. Component behaviors (such as focus rings, aria-expanded states, and keyboard traps) are isolated into reusable React hooks. The visual presentation is highly decoupled, allowing developers to swap theme scales without modifying component logic.',
    folderStructure: `flux-ui/
├── src/
│   ├── primitives/
│   │   ├── dialog.tsx         # Uses native HTML <dialog> with focus hooks
│   │   ├── tabs.tsx           # Keyboard controllable tab loops
│   │   └── combobox.tsx       # Accessible search autocomplete menu
│   ├── hooks/
│   │   ├── use-focus-trap.ts  # Light keyboard focus bounding
│   │   └── use-aria-state.ts  # Updates attributes dynamically
│   └── theme/
│       ├── tailwind-preset.js # Accessible contrast color scale
│       └── subgrid.css        # Core alignment CSS grid configurations
└── package.json`,
    challenges: [
      {
        title: 'Building an Accessible Multiselect without JS Layouts',
        description: 'Dropdown overlays usually calculate their positions using Popper.js or Floating UI, adding 15KB of script. We utilized modern CSS anchor positioning and CSS nesting to anchor overlays natively with zero script overhead.'
      },
      {
        title: 'Restricting Tab Focus in Modal Dialogs',
        description: 'Focus trapping usually involves listening to every keypress and cycling active elements. On screen readers, this can disrupt virtual cursor modes. We integrated native `<dialog>` element behaviors with polyfills to support robust virtual cursor bounds.'
      }
    ],
    tradeoffs: [
      {
        title: 'CSS Anchor Positioning vs Floating UI JS Engine',
        choice: 'CSS Anchor Positioning with JS fallback',
        reason: 'Anchor positioning is fully native and runs on the browser main thread at 120 FPS. While older browsers need a small polyfill, modern platforms enjoy zero-cost layouts.'
      },
      {
        title: 'Dynamic Style Insertion vs Pure CSS Classes',
        choice: 'Strict CSS Variables mapped directly inside Tailwind classes',
        reason: 'Injecting inline dynamic styles breaks Content Security Policies (CSP) in safe finance-grade apps. Pure CSS variables keep the code safe and let users customize themes easily.'
      }
    ],
    accessibility: [
      'Strict WCAG 2.2 compliant contrast ratio exceeding 7:1 for all interactive state layers.',
      'Comprehensive ARIA tags, screen reader announcement hooks, and native role mapping.',
      'Dedicated keyboard shortcuts mapped specifically to navigate nested elements.'
    ],
    performance: [
      { metric: 'Initial Page Load JS', before: '45.4KB', after: '4.8KB', technique: 'Replaced PopperJS, Focus-Trap-React, and standard react-transition-group with native anchors and CSS transitions' },
      { metric: 'Cumulative Layout Shift', before: '0.14', after: '0.00', technique: 'Enforced explicit CSS grid slots and aspect ratios across all composite card primitives' },
      { metric: 'Keyboard Keydown Latency', before: '14ms', after: '0.1ms', technique: 'Direct event delegation at the list container instead of mounting event listeners on every item' }
    ],
    lessons: [
      'Browsers have matured enormously. Most interactions that once required JavaScript libraries can now be performed cleanly with modern CSS.',
      'Accessibility is not an add-on; it is the skeleton. Writing semantic HTML from the start automatically resolves 90% of screen reader challenges.'
    ]
  }
];
