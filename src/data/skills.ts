import { SkillGroup } from '../types';

export const skillGroups: SkillGroup[] = [
  {
    category: 'Frontend Engineering',
    description: 'Creating accessible, beautiful, high-performance web systems',
    skills: [
      { name: 'React 19 & Next.js', level: 'Expert', years: 6, iconName: 'React', useCase: 'Engineered high-frequency real-time rendering layers and custom state machines.' },
      { name: 'TypeScript', level: 'Expert', years: 7, iconName: 'TypeScript', useCase: 'Authored enterprise-grade design systems with zero use-any type assertions.' },
      { name: 'Tailwind CSS', level: 'Expert', years: 5, iconName: 'Wind', useCase: 'Designed modular responsive microstructures without touching bloated custom CSS files.' },
      { name: 'Framer Motion', level: 'Advanced', years: 4, iconName: 'Zap', useCase: 'Crafted smooth virtual navigation routes and physical physics transitions at 60 FPS.' }
    ]
  },
  {
    category: 'Systems & Architecture',
    description: 'Building robust background logic, compilation, and storage systems',
    skills: [
      { name: 'Node.js & Express', level: 'Expert', years: 6, iconName: 'Server', useCase: 'Engineered high-throughput proxy servers and WebSocket synchronization endpoints.' },
      { name: 'WebAssembly (WASM)', level: 'Intermediate', years: 2, iconName: 'Cpu', useCase: 'Built virtual stack decoders to process and execute compiled binaries.' },
      { name: 'IndexedDB & Local Storage', level: 'Advanced', years: 4, iconName: 'Database', useCase: 'Engineered offline-first transaction managers and logical syncing layers.' }
    ]
  },
  {
    category: 'Tooling & DevOps',
    description: 'Optimizing continuous integrations, build steps, and asset sizes',
    skills: [
      { name: 'Vite / esbuild / Rollup', level: 'Advanced', years: 4, iconName: 'Settings', useCase: 'Authored tree-shaking rules and parallel bundle compilers to optimize loading speed.' },
      { name: 'CI/CD Pipelines (GitHub Actions)', level: 'Advanced', years: 5, iconName: 'GitBranch', useCase: 'Built automated accessibility linter checks and performance auditing triggers.' },
      { name: 'Docker', level: 'Intermediate', years: 3, iconName: 'Layers', useCase: 'Containerized modular microservices to ensure matching local and staging bounds.' }
    ]
  }
];
