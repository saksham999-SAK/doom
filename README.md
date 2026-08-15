# AETHER X-1 — Kinetic Hero & Avengers: Doomsday Voting Poll

A high-performance scroll-driven image sequence hero landing page combined with an **Avengers: Doomsday** hype section and live Supabase voting poll.

---

## ⚡ Supabase Setup Instructions

### 1. Database & Table Setup
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project and open the **SQL Editor** tab.
3. Copy the contents of [`supabase_setup.sql`](./supabase_setup.sql) and paste them into the editor.
4. Click **Run**.

This will:
- Create the `vote_counters` table.
- Seed initial counters for `doom` and `avengers`.
- Enable Row Level Security (RLS) with public `SELECT` access.
- Create an atomic Postgres function `increment_vote(option_name text)` with `SECURITY DEFINER` privileges to safely record votes without granting direct table edit access to anonymous clients.

---

## 🔑 Environment Variables Setup (Vercel & Local)

Add the following environment variables to your `.env.local` file for local development or in **Vercel Project Settings > Environment Variables** for production deployment:

```env
# For local Vite development:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# For Vercel / Next.js deployment:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev
```
