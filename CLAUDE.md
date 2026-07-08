# CLAUDE.md — fotobox.tirol

## Project Overview

Fotobox rental website for Tirol. Next.js 14 (App Router) with TypeScript. File-based CMS via a single JSON file. Deployed on Railway via GitHub.

**Live site:** https://fotobox.tirol  
**GitHub:** https://github.com/Blitzi9188/fotobox.tirol.git  
**Branch:** `main` → Railway auto-deploys on push

---

## Local Development

```bash
npm run dev        # Start server on localhost:3000
npm run build      # Production build
npm run lint       # ESLint
```

Admin CMS: http://localhost:3000/admin  
Default login: `admin@fotoboxtirol.at` / `admin1234`

---

## Architecture

### Tech Stack
- **Next.js 14** (App Router), React 18, TypeScript 5
- **No CSS framework** — custom CSS in `src/app/globals.css`
- **Email:** Resend API via Nodemailer
- **Forms:** reCAPTCHA v3
- **Auth:** Session-based (simple email/password)

### Content (File-Based CMS)
All content lives in one file: `data/cms-content.json` (128KB)

Edit via admin UI at `/admin`, or directly in the JSON.

**CMS sections:**
| Section | Purpose |
|---------|---------|
| `hero` | Headline, subtitle, CTA, background image |
| `features` | 3 feature items |
| `ai` | AI Fotobox section |
| `gallery` | Photo gallery |
| `occasions` | Weddings, birthdays, etc. |
| `pricing` | Plans + pricing page |
| `reviews` | Customer testimonials |
| `setup` | Technical specs |
| `footer` | Links, social |
| `legal` | Impressum, privacy, T&C |

**Storage paths:**
- Dev: `./data/`
- Production: `CMS_DATA_DIR=/app/storage/data` (Railway Volume)

### Pages
- `/` — Homepage
- `/preise` — Pricing
- `/kontakt` — Contact form
- `/fotobox-anlaesse` — Occasions
- `/ki-fotobox-tirol` — AI Fotobox
- `/fotobox-mieten-tirol` — Equipment rental
- `/technische-daten-aufbau` — Technical specs
- `/layout-gestaltung` — Layout design
- `/preisgestaltung` — Pricing details
- `/admin` — CMS admin dashboard

### Key Files
```
src/app/page.tsx                    ← Homepage
src/app/layout.tsx                  ← Root layout + global meta
src/components/site/SiteShell.tsx   ← Header/Footer wrapper
src/app/globals.css                 ← Global styles
src/lib/cms.ts                      ← CMS read/write logic
src/lib/types.ts                    ← TypeScript types
data/cms-content.json               ← ALL content (source of truth)
```

### API Routes
- `GET/PUT /api/admin/content` — CMS data (auth required)
- `POST /api/admin/upload` — Image upload (max 30MB)
- `POST /api/contact` — Contact form
- `POST /api/captcha` — reCAPTCHA verification

---

## Deployment

```bash
git add .
git commit -m "Your message"
git push origin main
```

Railway detects push and auto-deploys within ~2 minutes.

### Railway Environment Variables
- `CMS_DATA_DIR=/app/storage/data` — persistent CMS storage
- `CMS_UPLOADS_DIR=/app/storage/uploads`
- `CMS_UPLOADS_PUBLIC_BASE=/uploads`
- `RESEND_API_KEY` — email sending
- `RECAPTCHA_SECRET_KEY` — reCAPTCHA
- `ADMIN_PASSWORD` — admin login password
- `SESSION_SECRET` — session encryption

---

## Common Tasks

**Change hero content:**  
Edit `data/cms-content.json` → `hero` section, or use `/admin` UI

**Add/change page content:**  
Most content is in `data/cms-content.json`. Page-specific static structure is in `src/app/[page]/page.tsx`

**Change styles:**  
Edit `src/app/globals.css`

**Add a new page:**  
Create `src/app/[slug]/page.tsx` following existing pattern
