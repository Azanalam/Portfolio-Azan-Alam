import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { app } from '../server';

vi.mock('../src/data/dbEngine', () => ({
  readDB: vi.fn(),
  writeDB: vi.fn(),
}));

import { readDB, writeDB } from '../src/data/dbEngine';

const baseDB: any = {
  settings: {
    siteName: 'Test Portfolio', siteLogo: 'T', favicon: '',
    brandColors: { primary: 'emerald', accent: 'emerald' }, theme: 'dark',
    footerText: '', copyright: '', email: '', phone: '', address: '',
    timezone: 'UTC', socialLinks: {},
  },
  hero: {
    name: '', jobTitle: '', headline: '', description: '',
    heroImage: '', backgroundImage: '', ctaButtons: [], statistics: [],
    statusBadge: '', availability: true,
  },
  about: {
    biography: '', introduction: '', story: '', careerGoals: '',
    interests: '', personalImage: '', principles: [],
  },
  experiences: [
    { id: 'exp-1', company: 'Synergy Systems', role: 'Staff', period: '2024', description: [], tags: [], order: 0 },
    { id: 'exp-2', company: 'Vector Tech', role: 'Senior', period: '2021', description: [], tags: [], order: 1 },
  ],
  education: [],
  skills: [],
  projects: [],
  services: [],
  blog: [],
  testimonials: [],
  certifications: [],
  awards: [],
  media: [],
  layout: { sectionOrder: [], hiddenSections: [] },
  resumeUrl: '',
};

const DEV_USER = { username: 'Azanalam', password: 'azanlovesbiryani' };

beforeEach(() => {
  (readDB as any).mockReset();
  (writeDB as any).mockReset();
  (readDB as any).mockResolvedValue(JSON.parse(JSON.stringify(baseDB)));
  (writeDB as any).mockResolvedValue(undefined);
});

describe('public API', () => {
  it('GET /api/portfolio returns the stored database', async () => {
    const res = await request(app).get('/api/portfolio');
    expect(res.status).toBe(200);
    expect(res.body.settings.siteName).toBe('Test Portfolio');
    expect(res.body.experiences).toHaveLength(2);
  });
});

describe('admin auth', () => {
  it('unauthenticated /api/admin/me reports false', async () => {
    const res = await request(app).get('/api/admin/me');
    expect(res.status).toBe(200);
    expect(res.body.authenticated).toBe(false);
  });

  it('rejects wrong credentials with 401', async () => {
    const res = await request(app).post('/api/admin/login').send({ username: 'x', password: 'y' });
    expect(res.status).toBe(401);
  });

  it('accepts correct credentials and sets an httpOnly session cookie', async () => {
    const res = await request(app).post('/api/admin/login').send(DEV_USER);
    expect(res.status).toBe(200);
    const setCookie = res.headers['set-cookie'] as unknown as string[];
    const token = setCookie.find((c) => c.startsWith('admin_token='));
    expect(token).toBeTruthy();
    expect(token).toContain('HttpOnly');
    expect(res.body.authenticated).toBeUndefined();
  });

  it('blocked for an authenticated session', async () => {
    const agent = request.agent(app);
    await agent.post('/api/admin/login').send(DEV_USER);
    const res = await agent.get('/api/admin/me');
    expect(res.status).toBe(200);
    expect(res.body.authenticated).toBe(true);
    expect(res.body.username).toBe(DEV_USER.username);
  });

  it('rejects protected writes without a session', async () => {
    const res = await request(app).post('/api/admin/hero').send({ name: 'Hacker' });
    expect(res.status).toBe(401);
  });

  it('accepts protected writes with a session and persists via writeDB', async () => {
    const agent = request.agent(app);
    await agent.post('/api/admin/login').send(DEV_USER);
    const res = await agent.post('/api/admin/hero').send({ name: 'Alex Rivers' });
    expect(res.status).toBe(200);
    expect(writeDB).toHaveBeenCalledTimes(1);
    const saved = (writeDB as any).mock.calls[0][0];
    expect(saved.hero.name).toBe('Alex Rivers');
  });
});

describe('services CRUD', () => {
  it('rejects writes without a session', async () => {
    const res = await request(app).post('/api/admin/services').send([{ id: 'x', title: 'Hacked' }]);
    expect(res.status).toBe(401);
  });

  it('persists the services catalog with a session', async () => {
    const agent = request.agent(app);
    await agent.post('/api/admin/login').send(DEV_USER);
    const catalog = [
      { id: 'svc-1', icon: 'Code', title: 'Websites', description: 'Fast responsive sites', features: ['SEO'], price: 'Custom', ctaLabel: 'Start', highlight: true },
    ];
    const res = await agent.post('/api/admin/services').send(catalog);
    expect(res.status).toBe(200);
    expect(writeDB).toHaveBeenCalledTimes(1);
    const saved = (writeDB as any).mock.calls[0][0];
    expect(saved.services).toEqual(catalog);
    expect(res.body.services).toHaveLength(1);
  });
});

describe('experiences CRUD', () => {
  it('deletes by company name when the record has no id', async () => {
    (readDB as any).mockResolvedValue({
      ...baseDB,
      experiences: [
        { id: 'exp-1', company: 'Synergy Systems', role: 'Staff', period: '2024', description: [], tags: [], order: 0 },
        { company: 'Vector Tech', role: 'Senior', period: '2021', description: [], tags: [], order: 1 },
      ],
    });
    const agent = request.agent(app);
    await agent.post('/api/admin/login').send(DEV_USER);
    const res = await agent.post('/api/admin/experiences').send({ action: 'delete', item: { id: 'Vector Tech' } });
    expect(res.status).toBe(200);
    expect(res.body.experiences).toHaveLength(1);
    expect(res.body.experiences[0].id).toBe('exp-1');
  });

  it('deletes by id', async () => {
    const agent = request.agent(app);
    await agent.post('/api/admin/login').send(DEV_USER);
    const res = await agent.post('/api/admin/experiences').send({ action: 'delete', item: { id: 'exp-1' } });
    expect(res.status).toBe(200);
    expect(res.body.experiences.map((e: any) => e.id)).toEqual(['exp-2']);
  });
});

describe('media security', () => {
  it('rejects path traversal in delete', async () => {
    const agent = request.agent(app);
    await agent.post('/api/admin/login').send(DEV_USER);
    const res = await agent.delete('/api/admin/media/a%2Fb.png');
    expect(res.status).toBe(400);
  });

  it('rejects deleting an asset not in the media registry', async () => {
    const agent = request.agent(app);
    await agent.post('/api/admin/login').send(DEV_USER);
    const res = await agent.delete('/api/admin/media/missing.png');
    expect(res.status).toBe(404);
  });

  it('rejects disallowed file types on upload', async () => {
    const agent = request.agent(app);
    await agent.post('/api/admin/login').send(DEV_USER);
    const res = await agent
      .post('/api/admin/media/upload')
      .attach('file', Buffer.from('MZ...'), 'evil.exe');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Unsupported file type');
  });

  it('accepts allowed uploads and registers them', async () => {
    const agent = request.agent(app);
    await agent.post('/api/admin/login').send(DEV_USER);
    const res = await agent
      .post('/api/admin/media/upload')
      .attach('file', Buffer.from('fake-png'), 'photo.png');
    expect(res.status).toBe(200);
    expect(writeDB).toHaveBeenCalled();
    const saved = (writeDB as any).mock.calls[0][0];
    expect(saved.media).toHaveLength(1);
    fs.rmSync(path.join(process.cwd(), 'public', 'uploads', saved.media[0].filename), { force: true });
  });
});

describe('rate limiting', () => {
  it('returns 429 after 5 consecutive failed logins', async () => {
    let last = 0;
    for (let i = 0; i < 6; i++) {
      const res = await request(app).post('/api/admin/login').send({ username: 'x', password: 'y' });
      last = res.status;
    }
    expect(last).toBe(429);
  });
});

describe('contact submissions', () => {
  const validPayload = { name: 'Jane Doe', email: 'jane@example.com', subject: 'Hiring', message: 'I would like to discuss a project with you.' };

  beforeEach(() => {
    vi.stubEnv('RESEND_API_KEY', '');
  });

  afterAll(() => {
    vi.unstubAllEnvs();
    fs.rmSync(path.join(process.cwd(), 'data', 'inquiries.json'), { force: true });
  });

  it('rejects invalid payloads with 400', async () => {
    const res = await request(app).post('/api/contact').send({ name: '', email: 'nope', subject: '', message: 'short' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Name is required');
  });

  it('accepts a valid message and queues it (no email transport configured)', async () => {
    const res = await request(app).post('/api/contact').send(validPayload);
    expect(res.status).toBe(202);
    expect(res.body.success).toBe(true);
    expect(res.body.queued).toBe(true);
    expect(res.body.recordId).toBeTruthy();
    const saved = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'inquiries.json'), 'utf-8'));
    expect(saved).toHaveLength(1);
    expect(saved[0].email).toBe('jane@example.com');
    expect(saved[0].id).toBe(res.body.recordId);
  });

  it('rate-limits repeated submissions to 3 per window', async () => {
    let last = 0;
    for (let i = 0; i < 4; i++) {
      const res = await request(app).post('/api/contact').send(validPayload);
      last = res.status;
    }
    expect(last).toBe(429);
  });
});
