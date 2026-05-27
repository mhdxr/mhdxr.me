# Deployment Guide

This document describes where and how to deploy `mhdxr.me`. The app is a
Next.js 15.x (Pages Router) site with SSR, API routes, ISR, NextAuth,
Prisma + PostgreSQL, and Firebase Realtime Database. Those features
constrain which platforms can host it without losing functionality.

## TL;DR

- **Primary:** Vercel
- **Secondary:** Netlify, Render, Koyeb
- **Experimental:** Railway, Fly.io, Cloudflare (Pages/Workers via OpenNext)
- **Not compatible:** GitHub Pages, Render Static Site, plain Cloudflare Pages

## Platform compatibility matrix

| Platform | Status | SSR | API Routes | ISR | next/image | Prisma + Postgres | NextAuth |
|---|---|---|---|---|---|---|---|
| Vercel | ✅ Recommended | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Netlify | ⚙️ Compatible w/ config | ✅ | ✅ | ⚠️ on-demand | ✅ | ✅ | ✅ |
| Render (Web Service) | ⚙️ Compatible | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Koyeb (Node service) | ⚙️ Compatible | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Railway | ⚠️ Experimental | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Fly.io | ⚠️ Experimental | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cloudflare Pages/Workers | ⚠️ Experimental | △ | △ | ❌ | △ | △ | △ |
| GitHub Pages | ❌ Not compatible | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Render Static Site | ❌ Not compatible | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

Legend: ✅ supported · ⚙️ supported with extra config · ⚠️ supported but
risky/limited · △ partial · ❌ unsupported.

## Universal environment variables

Set these on **every** platform (UI dashboard, never in git):

**Required**

```
DATABASE_URL
DIRECT_URL
NEXTAUTH_URL          # https://<your-domain>
NEXTAUTH_SECRET       # openssl rand -base64 32
SITE_URL              # used by next-sitemap; e.g. https://mhdxr.me
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_DB_URL
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
NEXT_PUBLIC_FIREBASE_CHAT_DB
```

**Optional** (degrade gracefully — see `src/common/libs/env.ts`):

```
NEXT_PUBLIC_OWNER_EMAIL
BLOG_API_URL          DEVTO_KEY            OPENAI_API_KEY
SPOTIFY_CLIENT_ID     SPOTIFY_CLIENT_SECRET SPOTIFY_REFRESH_TOKEN
WAKATIME_API_KEY
GITHUB_READ_USER_TOKEN_PERSONAL  GITHUB_READ_USER_TOKEN_WORK
CONTACT_FORM_API_KEY
GOOGLE_CLIENT_ID  GOOGLE_CLIENT_SECRET
GITHUB_ID  GITHUB_SECRET
```

> Build-time DB access is required because `getStaticProps` in
> `/projects` runs `prisma.findMany` during the build. The DB must be
> reachable from the build environment, not just at runtime.

---

## Vercel (Primary)

**Why:** Native Next.js host. SSR, API routes, ISR, and `next/image`
optimization all work without configuration.

- **Build command:** auto (`yarn build`)
- **Output:** auto (`.next`)
- **Start command:** N/A (serverless)
- **Config file:** `vercel.json` already pins `/api/chat` memory to 1024 MB
  and `maxDuration` to 10 s.

### Steps
1. Import repo on https://vercel.com/new.
2. Add every env var listed above under **Settings → Environment Variables**.
3. Deploy. Vercel runs `yarn install` (`postinstall: prisma generate`) then
   `yarn build` (which also runs `next-sitemap` via `postbuild`).
4. After first deploy, run migrations from your machine:
   ```bash
   npx prisma migrate deploy
   ```
5. Add custom domain. Update `NEXTAUTH_URL` and OAuth callback URLs.

---

## Netlify (Secondary)

**Why:** Officially supports Next.js via `@netlify/plugin-nextjs`, which
auto-installs when Netlify detects Next.js. SSR pages and API routes run
on Netlify Functions.

- **Build command:** `yarn build`
- **Publish directory:** `.next` (do **not** use `out` — this is not a
  static export)
- **Config file:** `netlify.toml` (already in repo)

### Steps
1. New site → Import from Git → connect repo.
2. Confirm Netlify detects the `netlify.toml`. Build command and publish
   dir will be filled in automatically.
3. Add all env vars under **Site settings → Environment variables**
   (Production scope). The plugin needs `NEXT_PUBLIC_*` at build time.
4. Trigger deploy. First deploy installs `@netlify/plugin-nextjs`.
5. Run `npx prisma migrate deploy` from your machine against
   `DIRECT_URL` after the first successful deploy.

### Risks
- ISR works as **on-demand** revalidation, not background. Pages with
  `revalidate: 1` will refresh on the next request after expiry — fine
  for this app.
- Netlify Functions cold-start can be slower than Vercel.
- `next/image` optimization works but counts against bandwidth quota.

---

## Render (Web Service, Secondary)

**Why:** Cheap Node hosting with a free tier, supports SSR/API/Prisma
without any adapter. The repo includes `render.yaml` (Blueprint) so the
service can be created with one click.

- **Service type:** Web Service (NOT Static Site)
- **Runtime:** Node 20
- **Build command:** `yarn install --frozen-lockfile && yarn build`
- **Start command:** `yarn start`
- **Health check path:** `/`

### Steps
1. New → Blueprint → connect repo. Render reads `render.yaml`.
2. Render prompts for every env var (all marked `sync: false`). Fill them
   in from the list above.
3. First build runs `prisma generate` automatically via `postinstall`.
4. After deploy, open the **Shell** tab and run:
   ```bash
   npx prisma migrate deploy
   ```
5. Set custom domain. Update `NEXTAUTH_URL` and OAuth callbacks.

### Risks
- Free plan instances spin down after 15 min idle → first request after
  inactivity is slow (~30s cold start).
- No native ISR background regeneration; on-demand only.
- `next/image` runs through the Node process (no edge optimizer).

---

## Koyeb (Secondary)

**Why:** Free Node service, no Dockerfile required. Similar profile to
Render but with always-on free instance (subject to plan changes).

- **Build command:** `yarn install --frozen-lockfile && yarn build`
- **Run command:** `yarn start`
- **Port:** Koyeb auto-detects from `PORT` env (Next.js honors it).
- **Config file:** None needed. Configure via Koyeb dashboard.

### Steps
1. New service → GitHub → select repo → "Buildpack" (no Dockerfile).
2. Set build/run commands as above.
3. Add env vars under **Environment variables** tab (mark sensitive
   ones as Secrets).
4. Deploy. Migrate the DB from local with `npx prisma migrate deploy`.

### Risks
- Free tier limits change periodically — verify current quota.
- No first-class ISR support beyond what Next.js handles in-process.

---

## Railway / Fly.io (Experimental)

Both can run this app as a generic Node service. **Free tiers are
limited or removed**:
- Railway: $5 trial credit, then paid.
- Fly.io: pay-as-you-go (small free allowance).

If you want to deploy:

- **Build:** `yarn install --frozen-lockfile && yarn build`
- **Start:** `yarn start`
- **Port:** bind `PORT` env (Next.js does this by default).
- **Fly.io:** add a `fly.toml` with `internal_port = 3000` and a
  `[http_service]` block. Not committed here — generate with `fly launch`.

Treat as backup options, not primary.

---

## Cloudflare Pages / Workers (Experimental)

Cloudflare Pages **static** mode does not work for this repo because of
SSR + API routes + NextAuth + Prisma.

The full-stack route requires the [OpenNext Cloudflare adapter]
(https://opennext.js.org/cloudflare). Known caveats:
- Prisma in Workers needs the Data Proxy or `@prisma/adapter-pg-worker`
  — the current `prisma.ts` won't work as-is.
- NextAuth on Workers needs the Edge runtime adapter and a KV-backed
  session store; current setup uses default JWT which works, but cookies
  domain handling differs.
- ISR is not supported in the same way as Vercel.

**Recommendation:** Skip unless you specifically need Cloudflare's edge.
Port the app to OpenNext only as a separate, opt-in branch.

---

## GitHub Pages (Not compatible)

GitHub Pages serves static files only. To use it you would have to:
- Remove all `getServerSideProps` (blog detail, project detail).
- Remove every API route (NextAuth, contact, chat, views, blog, etc.).
- Drop Prisma and NextAuth entirely.
- Switch to `output: 'export'` and rebuild.

That deletes core features of the site, so GitHub Pages is not a viable
target. Don't try to force it.

---

## Post-deployment checklist (any platform)

- [ ] All required env vars set
- [ ] `NEXTAUTH_SECRET` generated with `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` matches the deployed origin (no trailing slash)
- [ ] OAuth providers (Google/GitHub) updated with the new callback URL:
      `${NEXTAUTH_URL}/api/auth/callback/<provider>`
- [ ] Firebase console: add the deployed origin under
      **Authentication → Settings → Authorized domains**
- [ ] Firebase Realtime DB rules applied (use
      `firebase.rules.example.json` as starting point)
- [ ] `npx prisma migrate deploy` executed against the production DB
- [ ] `next/image` remote hosts are reachable (check `next.config.js`
      `remotePatterns`)
- [ ] Test: home, blog list, blog detail, projects list, projects
      detail, guestbook (signed-in + signed-out), API `/api/views?slug=...`

## Troubleshooting

**Build fails with `Can't reach database server`**
Either `DATABASE_URL` is missing during build, or the DB isn't reachable
from the build network. For Vercel/Netlify/Render the build runs in
their cloud; whitelist the platform's IPs or use a connection-pooled
URL (Supabase pooler, Neon serverless driver).

**`/projects` is empty after deploy**
`getStaticProps` ran with no DB access at build time. Check build logs
for Prisma errors. Re-deploy after the DB is reachable.

**NextAuth redirect loop**
Mismatch between `NEXTAUTH_URL` and the actual origin, or missing
`NEXTAUTH_SECRET` in production. Both must be set.

**Guestbook shows "not configured"**
At least one of the required `NEXT_PUBLIC_FIREBASE_*` vars is empty.
The full required set is enforced by `isFirebaseConfigured()` in
`src/common/libs/env.ts`.

**Spotify / WakaTime / DEV.to / GitHub widgets blank**
Optional integrations — set the relevant env vars or accept the empty
state. No action needed if you don't use them.
