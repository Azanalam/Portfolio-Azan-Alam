# Developer Portfolio

A full-stack developer portfolio with a built-in content management system (CMS). The frontend is a React 19 SPA; the backend is an Express server that serves content from a local `database.json` cache synced with Supabase (Postgres).

## Stack

- **Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS 4, `motion` (animations), `lucide-react` (icons)
- **Backend:** Express 4, JWT admin authentication (httpOnly cookies), Multer file uploads
- **Data:** local `database.json` cache plus Supabase Postgres (single JSONB row in the `portfolio` table), synced on read/write
- **Routing:** hash-based SPA routes (`#/`, `#/projects/:slug`, `#/admin`)

## Getting Started

Prerequisites: Node.js 18+

```bash
npm install
npm run dev
```

Open http://localhost:3000.

In production:

```bash
npm run build
npm start
```

## Environment Variables

Copy `.env.example` to `.env` and set the admin credentials:

| Variable                    | Required  | Purpose                                    |
| --------------------------- | --------- | ------------------------------------------ |
| `ADMIN_USERNAME`            | production | Admin CMS username                         |
| `ADMIN_PASSWORD`            | production | Admin CMS password                         |
| `JWT_SECRET`                | production | Secret used to sign admin session tokens   |
| `SUPABASE_URL`              | optional  | Supabase project URL (https://<ref>.supabase.co) |
| `SUPABASE_SERVICE_ROLE_KEY` | optional  | Server-only key (bypasses RLS; never expose to the client) |

The server **refuses to start in production** (`NODE_ENV=production`) without the three admin variables. In development the defaults defined in `server.ts` are used.

Without Supabase credentials the server falls back to local `database.json` storage only.

## Setting up Supabase

1. Create a project at https://supabase.com and note the project URL.
2. Run the schema in `supabase/migrations/001_init.sql` (SQL editor or `supabase db push`). It creates the `portfolio` table with RLS enabled and no policies, so only the server (service role) can access it.
3. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your environment. Keep the service-role key server-side only.
4. The first request seeds the table with the default content.

## Scripts

| Script      | Description                              |
| ----------- | ---------------------------------------- |
| `npm run dev`  | Start dev server (tsx, Vite middleware)  |
| `npm run build` | Build the client and bundle the server |
| `npm start` | Run the production server from `dist/`    |
| `npm run lint`  | Type-check with `tsc --noEmit`            |
| `npm run clean` | Remove `dist/`                           |

## Admin CMS

Visit `#/admin/login` and sign in to manage Settings, Hero, About, Skills, Experience, Projects, Blog, and the Media Library. All content changes are written to Supabase and cached locally; no redeploys required.

## Project Structure

```
├── server.ts                       # Express server, auth, uploads, CMS API
├── supabase/
│   └── migrations/                 # SQL schema (portfolio table, RLS)
├── src/
│   ├── data/dbEngine.ts           # Supabase + local DB read/write
│   ├── data/                      # Seed content (skills, projects, experience)
│   ├── components/                # UI components + admin CMS managers
│   ├── hooks/                     # useHashRoute, usePortfolio
│   ├── views/                     # Home, About, Projects, Skills, Contact, Admin
│   └── types.ts                   # Shared TypeScript interfaces
├── assets/                        # Static assets
└── index.html
```
