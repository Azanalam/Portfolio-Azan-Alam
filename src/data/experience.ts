import { Experience } from '../types';

export const experiences: Experience[] = [
  {
    company: 'Synergy Systems',
    role: 'Staff Software Engineer',
    period: '2024 - Present',
    description: [
      'Led architectural redesign of a core micro-frontend orchestration engine, reducing initial bundle weight by 42% and raising Lighthouse performance score across all suites from 74 to 98.',
      'Designed and deployed a distributed client-side syncing system supporting local IndexedDB storage and peer-to-peer real-time convergence via Hybrid Logical Clocks.',
      'Chaired the engineering-wide accessibility guild; mentored 14 junior developers on semantic HTML and keyboard navigation standards, achieving WCAG AA conformance.'
    ],
    tags: ['Micro-frontends', 'Distributed Systems', 'TypeScript', 'Web Performance', 'React Core']
  },
  {
    company: 'Vector Tech',
    role: 'Senior UI/UX Engineer',
    period: '2021 - 2024',
    description: [
      'Engineered an enterprise design system used across 8 application pipelines. Built 40+ highly reusable accessible headless primitives.',
      'Implemented WebGL-driven data visualizations that mapped high-frequency telemetry logs, supporting 60 FPS rendering of 100,000 active nodes.',
      'Authored custom esbuild and Vite configuration plugins to support optimized tree-shaking, cutting client download sizes from 1.4MB to 310KB.'
    ],
    tags: ['Design Systems', 'WebGL', 'Vite & esbuild', 'Data Visualization', 'A11y Standards']
  },
  {
    company: 'CoreStack Software',
    role: 'Frontend Engineer',
    period: '2019 - 2021',
    description: [
      'Pioneered offline mode capabilities for the flagship core SaaS platform, implementing Service Worker network strategies and client-side transaction queues.',
      'Refactored legacy React class architectures into robust custom React Hooks, optimizing state layouts and preventing unnecessary multi-thread UI re-renders.'
    ],
    tags: ['Offline-First', 'Service Workers', 'React Hook Design', 'Web Performance']
  }
];
