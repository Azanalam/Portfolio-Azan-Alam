import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { createServer as createViteServer } from 'vite';
import { readDB, writeDB, getStorageSource } from './src/data/dbEngine';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'azan-biryani-secret-key-1337-3301';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Azanalam';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'azanlovesbiryani';

// Never boot production with fallback credentials: refuse to start instead.
if (NODE_ENV === 'production' && (!process.env.JWT_SECRET || !process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD)) {
  console.error('[CRITICAL] Production startup requires JWT_SECRET, ADMIN_USERNAME, and ADMIN_PASSWORD environment variables. Refusing to start with insecure defaults.');
  process.exit(1);
}

// Cookie options shared across set/clear: Secure + None in production, Lax on plain HTTP in dev.
const cookieOptions = (overrides: Record<string, unknown> = {}) => ({
  httpOnly: true,
  secure: NODE_ENV === 'production',
  sameSite: NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
  path: '/',
  ...overrides,
});

// Constant-time credential comparison to resist timing attacks.
const safeEqual = (a: string, b: string) => {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
};

// In-memory brute-force protection for the login endpoint.
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const loginRateLimiter = (req: any, res: any, next: any) => {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return next();
  }
  if (record.count >= LOGIN_MAX_ATTEMPTS) {
    const retryIn = Math.ceil((record.resetAt - now) / 1000);
    return res.status(429).json({ error: `Too many failed login attempts. Retry in ${retryIn} seconds.` });
  }
  record.count += 1;
  next();
};

// Ensure storage directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage engine configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  }
});
// Whitelist of accepted upload types: images for the media library, documents for the resume.
const ALLOWED_MIME_TYPES = new Set([
  'image/png', 'image/jpeg', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) return cb(null, true);
    cb(new Error('Unsupported file type. Allowed: PNG, JPG, GIF, WebP, PDF, DOC, DOCX.'));
  },
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Static uploads serving
app.use('/uploads', express.static(uploadsDir));

// Authentication check middleware
const requireAdmin = (req: any, res: any, next: any) => {
  const token = req.cookies.admin_token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing administrative session.' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.clearCookie('admin_token', cookieOptions());
    return res.status(401).json({ error: 'Unauthorized: Administrative session expired.' });
  }
};

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

// Fetch full editable portfolio config
app.get('/api/portfolio', async (req, res) => {
  try {
    const db = await readDB();
    const dataSource = getStorageSource();
    res.json({ ...db, dataSource });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read portfolio database.' });
  }
});

// Admin Auth Status
app.get('/api/admin/me', (req, res) => {
  const token = req.cookies.admin_token;
  if (!token) return res.json({ authenticated: false });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return res.json({ authenticated: true, username: decoded.username });
  } catch (err) {
    return res.json({ authenticated: false });
  }
});

// Admin Authenticate Login
app.post('/api/admin/login', loginRateLimiter, (req, res) => {
  const { username, password } = req.body;
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (safeEqual(username, ADMIN_USERNAME) && safeEqual(password, ADMIN_PASSWORD)) {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    loginAttempts.delete(ip);
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    res.cookie('admin_token', token, cookieOptions({ maxAge: 24 * 60 * 60 * 1000 }));
    return res.json({ success: true, username });
  }
  return res.status(401).json({ error: 'Invalid administrative credentials.' });
});

// Admin Log out
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token', cookieOptions());
  res.json({ success: true });
});

// ==========================================
// PROTECTED CMS API ENDPOINTS
// ==========================================

// Save General Settings
app.post('/api/admin/settings', requireAdmin, async (req, res) => {
  try {
    const db = await readDB();
    db.settings = req.body;
    await writeDB(db);
    res.json({ success: true, settings: db.settings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save general settings.' });
  }
});

// Save Hero Settings
app.post('/api/admin/hero', requireAdmin, async (req, res) => {
  try {
    const db = await readDB();
    db.hero = req.body;
    await writeDB(db);
    res.json({ success: true, hero: db.hero });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save hero specifications.' });
  }
});

// Save About Profile
app.post('/api/admin/about', requireAdmin, async (req, res) => {
  try {
    const db = await readDB();
    db.about = req.body;
    await writeDB(db);
    res.json({ success: true, about: db.about });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save profile about dossier.' });
  }
});

// Manage Experiences (Save / Delete)
app.post('/api/admin/experiences', requireAdmin, async (req, res) => {
  try {
    const { action, item } = req.body;
    const db = await readDB();
    if (action === 'save') {
      const index = db.experiences.findIndex(e => e.id === item.id || e.company === item.company);
      if (index > -1) {
        db.experiences[index] = item;
      } else {
        db.experiences.push(item);
      }
    } else if (action === 'delete') {
      db.experiences = db.experiences.filter(e => e.id !== item.id && e.company !== item.id);
    }
    await writeDB(db);
    res.json({ success: true, experiences: db.experiences });
  } catch (err) {
    res.status(500).json({ error: 'Failed to modify experiences table.' });
  }
});

// Manage Education (Save / Delete)
app.post('/api/admin/education', requireAdmin, async (req, res) => {
  try {
    const { action, item } = req.body;
    const db = await readDB();
    if (action === 'save') {
      const index = db.education.findIndex(e => e.id === item.id || e.school === item.school);
      if (index > -1) {
        db.education[index] = item;
      } else {
        db.education.push(item);
      }
    } else if (action === 'delete') {
      db.education = db.education.filter(e => e.id !== item.id && e.school !== item.id);
    }
    await writeDB(db);
    res.json({ success: true, education: db.education });
  } catch (err) {
    res.status(500).json({ error: 'Failed to modify education tables.' });
  }
});

// Save Skills Block
app.post('/api/admin/skills', requireAdmin, async (req, res) => {
  try {
    const db = await readDB();
    db.skills = req.body;
    await writeDB(db);
    res.json({ success: true, skills: db.skills });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save technical skills matrix.' });
  }
});

// Save Services Block
app.post('/api/admin/services', requireAdmin, async (req, res) => {
  try {
    const db = await readDB();
    db.services = req.body;
    await writeDB(db);
    res.json({ success: true, services: db.services });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save services catalog.' });
  }
});

// Manage Projects CRUD
app.post('/api/admin/projects', requireAdmin, async (req, res) => {
  try {
    const { action, item } = req.body;
    const db = await readDB();
    if (action === 'save') {
      const index = db.projects.findIndex(p => p.slug === item.slug);
      if (index > -1) {
        db.projects[index] = item;
      } else {
        db.projects.push(item);
      }
    } else if (action === 'delete') {
      db.projects = db.projects.filter(p => p.slug !== item.slug);
    }
    await writeDB(db);
    res.json({ success: true, projects: db.projects });
  } catch (err) {
    res.status(500).json({ error: 'Failed to modify projects directory.' });
  }
});

// Manage Blog CRUD
app.post('/api/admin/blog', requireAdmin, async (req, res) => {
  try {
    const { action, item } = req.body;
    const db = await readDB();
    if (action === 'save') {
      const index = db.blog.findIndex(b => b.id === item.id);
      if (index > -1) {
        db.blog[index] = item;
      } else {
        db.blog.push(item);
      }
    } else if (action === 'delete') {
      db.blog = db.blog.filter(b => b.id !== item.id);
    }
    await writeDB(db);
    res.json({ success: true, blog: db.blog });
  } catch (err) {
    res.status(500).json({ error: 'Failed to manage dynamic blogs.' });
  }
});

// Manage Testimonials CRUD
app.post('/api/admin/testimonials', requireAdmin, async (req, res) => {
  try {
    const { action, item } = req.body;
    const db = await readDB();
    if (action === 'save') {
      const index = db.testimonials.findIndex(t => t.id === item.id);
      if (index > -1) {
        db.testimonials[index] = item;
      } else {
        db.testimonials.push(item);
      }
    } else if (action === 'delete') {
      db.testimonials = db.testimonials.filter(t => t.id !== item.id);
    }
    await writeDB(db);
    res.json({ success: true, testimonials: db.testimonials });
  } catch (err) {
    res.status(500).json({ error: 'Failed to manage testimonials records.' });
  }
});

// Manage Certifications CRUD
app.post('/api/admin/certifications', requireAdmin, async (req, res) => {
  try {
    const { action, item } = req.body;
    const db = await readDB();
    if (action === 'save') {
      const index = db.certifications.findIndex(c => c.id === item.id);
      if (index > -1) {
        db.certifications[index] = item;
      } else {
        db.certifications.push(item);
      }
    } else if (action === 'delete') {
      db.certifications = db.certifications.filter(c => c.id !== item.id);
    }
    await writeDB(db);
    res.json({ success: true, certifications: db.certifications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to manage certifications listings.' });
  }
});

// Manage Awards CRUD
app.post('/api/admin/awards', requireAdmin, async (req, res) => {
  try {
    const { action, item } = req.body;
    const db = await readDB();
    if (action === 'save') {
      const index = db.awards.findIndex(a => a.id === item.id);
      if (index > -1) {
        db.awards[index] = item;
      } else {
        db.awards.push(item);
      }
    } else if (action === 'delete') {
      db.awards = db.awards.filter(a => a.id !== item.id);
    }
    await writeDB(db);
    res.json({ success: true, awards: db.awards });
  } catch (err) {
    res.status(500).json({ error: 'Failed to manage awards registry.' });
  }
});

// Save Homepage Layout Settings
app.post('/api/admin/layout', requireAdmin, async (req, res) => {
  try {
    const db = await readDB();
    db.layout = req.body;
    await writeDB(db);
    res.json({ success: true, layout: db.layout });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save custom homepage layout.' });
  }
});

// Media Library: List Uploads
app.get('/api/admin/media', requireAdmin, async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.media || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch media assets.' });
  }
});

// Media Library: Upload Asset File
app.post('/api/admin/media/upload', requireAdmin, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No dynamic file attachment discovered.' });
    
    const db = await readDB();
    const filename = file.filename;
    const url = `/uploads/${filename}`;
    const mediaItem = {
      filename,
      url,
      size: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date().toISOString()
    };
    db.media.push(mediaItem);
    await writeDB(db);
    res.json({ success: true, file: mediaItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to commit asset upload.' });
  }
});

// Media Library: Delete Asset File
app.delete('/api/admin/media/:filename', requireAdmin, async (req, res) => {
  try {
    const { filename } = req.params;
    // Reject anything that is not a plain filename: prevents path traversal outside the uploads dir.
    const safeName = path.basename(filename);
    if (safeName !== filename) {
      return res.status(400).json({ error: 'Invalid filename.' });
    }
    const db = await readDB();
    if (!db.media.some(m => m.filename === safeName)) {
      return res.status(404).json({ error: 'Asset not found in media registry.' });
    }
    const filePath = path.join(uploadsDir, safeName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    db.media = db.media.filter(m => m.filename !== safeName);
    await writeDB(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete assets from disk storage.' });
  }
});

// Upload CV/Resume Document
app.post('/api/admin/resume', requireAdmin, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No document discovered.' });
    const db = await readDB();
    db.resumeUrl = `/uploads/${file.filename}`;
    await writeDB(db);
    res.json({ success: true, resumeUrl: db.resumeUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload resume document.' });
  }
});

// ==========================================
// PUBLIC CONTACT SUBMISSIONS
// ==========================================
const CONTACT_MAX_PER_WINDOW = 3;
const CONTACT_WINDOW_MS = 15 * 60 * 1000;
const contactSubmissions = new Map<string, { count: number; resetAt: number }>();
const contactRateLimiter = (req: any, res: any, next: any) => {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const record = contactSubmissions.get(ip);
  if (!record || now > record.resetAt) {
    contactSubmissions.set(ip, { count: 1, resetAt: now + CONTACT_WINDOW_MS });
    return next();
  }
  if (record.count >= CONTACT_MAX_PER_WINDOW) {
    const retryIn = Math.ceil((record.resetAt - now) / 1000);
    return res.status(429).json({ error: `Too many messages. Retry in ${retryIn} seconds.` });
  }
  record.count += 1;
  next();
};

const inquiriesDir = path.join(process.cwd(), 'data');
const inquiriesFile = path.join(inquiriesDir, 'inquiries.json');

function appendInquiry(entry: Record<string, unknown>) {
  try {
    fs.mkdirSync(inquiriesDir, { recursive: true });
    let list: Record<string, unknown>[] = [];
    if (fs.existsSync(inquiriesFile)) {
      list = JSON.parse(fs.readFileSync(inquiriesFile, 'utf-8'));
    }
    list.push(entry);
    fs.writeFileSync(inquiriesFile, JSON.stringify(list, null, 2));
  } catch (err) {
    console.error('[contact] Failed to persist inquiry to disk:', err);
  }
}

let resendClient: Resend | null = null;
function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  resendClient = resendClient || new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

// Delivery destination priority: env override -> portfolio settings email -> known default.
async function resolveContactRecipients() {
  const from = process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';
  let to = process.env.CONTACT_TO_EMAIL || 'azanalam7@gmail.com';
  try {
    const db = await readDB();
    if (db?.settings?.email) to = db.settings.email;
  } catch {
    // Keep env/default recipient when the data source is unavailable.
  }
  return { from, to };
}

async function deliverInquiry(record: Record<string, string>) {
  try {
    const client = getResend();
    if (!client) {
      console.log('[contact] RESEND_API_KEY not set — inquiry saved to data/inquiries.json (email skipped).');
      return false;
    }
    const { from, to } = await resolveContactRecipients();
    const { error } = await client.emails.send({
      from,
      to: [to],
      replyTo: record.email,
      subject: `[Portfolio] ${record.subject} — ${record.name}`,
      text: [
        `Name: ${record.name}`,
        `Email: ${record.email}`,
        `Subject: ${record.subject}`,
        ``,
        record.message,
      ].join('\n'),
      headers: { 'X-Inquiry-Id': record.id },
    });
    if (error) {
      console.error('[contact] Resend delivery error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[contact] Failed to deliver via Resend:', err);
    return false;
  }
}

app.post('/api/contact', contactRateLimiter, async (req, res) => {
  try {
    const raw = req.body || {};
    const clean = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
    const name = clean(raw.name);
    const email = clean(raw.email);
    const subject = clean(raw.subject);
    const message = clean(raw.message);

    const problems: string[] = [];
    if (!name || name.length > 80) problems.push('Name is required (max 80 chars).');
    if (!email) problems.push('Email is required.');
    else if (!/^\S+@\S+\.\S+$/.test(email)) problems.push('Email must be valid.');
    else if (email.length > 120) problems.push('Email is too long.');
    if (!subject) problems.push('Subject selection is required.');
    if (message.length < 10) problems.push('Message must be at least 10 characters.');
    else if (message.length > 5000) problems.push('Message must be under 5000 characters.');
    if (problems.length > 0) {
      return res.status(400).json({ error: problems.join(' ') });
    }

    const record: Record<string, string> = {
      id: crypto.randomUUID(),
      name,
      email,
      subject,
      message,
      receivedAt: new Date().toISOString(),
      ip: req.ip || req.socket?.remoteAddress || 'unknown',
    };
    appendInquiry(record);
    const delivered = await deliverInquiry(record);

    if (delivered) {
      res.status(200).json({ success: true, recordId: record.id, queued: false, message: 'Message delivered.' });
    } else {
      res.status(202).json({ success: true, recordId: record.id, queued: true, message: 'Message queued. Email delivery pending configuration.' });
    }
  } catch (err) {
    console.error('[contact] Submission error:', err);
    res.status(500).json({ error: 'Failed to process message.' });
  }
});

// ==========================================
// ERROR HANDLING MIDDLEWARE
// ==========================================
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum allowed size is 10MB.' });
  }
  if (err && err.message && err.message.includes('Unsupported file type')) {
    return res.status(400).json({ error: err.message });
  }
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ==========================================
// CLIENT ROUTING & DEV SERVER MIDDLEWARE
// ==========================================
async function startServer() {
  const supabaseConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log(`[boot] NODE_ENV=${NODE_ENV} storage=${supabaseConfigured ? 'supabase' : 'local-file'} port=${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express Fullstack Server operational on: http://localhost:${PORT}`);
  });
}

export { app, startServer };
