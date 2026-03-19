# InterviewAI Deployment Guide

Deploy your InterviewAI app on **Netlify** (frontend) + **Vercel** (backend API) with **Supabase** (database).

---

## Architecture

| Component | Platform | Purpose |
|-----------|----------|---------|
| **Frontend** (React) | Netlify | SPA hosting, CDN |
| **Backend API** (Express) | Vercel | Serverless API |
| **Database** | Supabase | PostgreSQL + Auth |

---

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → create a project (or use existing)
2. Run the SQL schema: **SQL Editor** → paste contents of `schema.sql` from project root → Run
3. **Project Settings** → **API** → copy:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY` (service_role key, not anon)

---

## 2. Deploy Backend (Vercel)

### Option A: Connect via Git (recommended)
1. Push your code to **GitHub** / **GitLab** / **Bitbucket**
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. **Root Directory**: leave as `.` (project root, not frontend)
5. **Framework Preset**: Other (or Node.js)
6. **Build Command**: leave empty (backend has no build step)
7. **Output Directory**: leave empty
8. Add **Environment Variables**:
   | Variable | Value |
   |----------|-------|
   | `SUPABASE_URL` | Your Supabase project URL |
   | `SUPABASE_SERVICE_KEY` | Supabase service_role key |
   | `JWT_SECRET` | Random secret (e.g. `openssl rand -hex 32`) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `OPENAI_API_KEY` | Your OpenAI API key |
   | `FRONTEND_URL` | `https://your-netlify-site.netlify.app` (add after Netlify deploy) |
9. Deploy → copy your API URL (e.g. `https://your-project.vercel.app`)

### Option B: Vercel CLI
```bash
cd "Project 2"
npm i -g vercel
vercel
# Follow prompts, add env vars in dashboard
```

---

## 3. Deploy Frontend (Netlify)

### Option A: Connect via Git
1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Connect your repo
3. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Environment Variables**:
     | Variable | Value |
     |----------|-------|
     | `VITE_API_URL` | `https://your-vercel-app.vercel.app/api` |
4. Deploy

### Option B: Netlify CLI
```bash
cd "Project 2/frontend"
npm run build
npx netlify deploy
# For production: npx netlify deploy --prod
```

---

## 4. Redeploy / Updates

### Netlify
- **Auto**: Push to your linked Git branch → Netlify rebuilds automatically
- **Manual**: Netlify Dashboard → **Deploys** → **Trigger deploy**

### Vercel
- **Auto**: Push to Git → Vercel rebuilds automatically
- **Manual**: Vercel Dashboard → **Deployments** → **Redeploy**

---

## 5. Environment Variables Quick Reference

### Vercel (Backend)
| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | ✅ | Supabase service_role key |
| `JWT_SECRET` | ✅ | Secret for JWT signing |
| `JWT_EXPIRES_IN` | | Default: `7d` |
| `OPENAI_API_KEY` | ✅ | OpenAI API key |
| `FRONTEND_URL` | ✅ | Netlify URL for CORS (e.g. `https://xxx.netlify.app`) |

### Netlify (Frontend)
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Full API base URL (e.g. `https://xxx.vercel.app/api`) |

---

## 6. CORS & FRONTEND_URL

Ensure `FRONTEND_URL` on Vercel matches your Netlify URL exactly (including `https://`).  
For multiple domains (e.g. preview deployments), you may need to update the CORS `origin` in `server.js` to accept an array.

---

## 7. Troubleshooting

| Issue | Check |
|-------|--------|
| CORS errors | `FRONTEND_URL` on Vercel matches Netlify URL |
| 401 / Auth fails | `JWT_SECRET` same across deploys; token in localStorage |
| Supabase errors | `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` correct |
| API 404 | `VITE_API_URL` ends with `/api` (e.g. `https://xxx.vercel.app/api`) |
