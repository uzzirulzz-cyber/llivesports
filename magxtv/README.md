# MAGXTV.CLICK

Live scores, fixtures and match-prediction platform. This repo is **Phase 1** of the
build: the frontend, design system and route map. It is not yet connected to a
database, a real sports data provider, or authentication.

## Status report

**Implemented**
- Next.js 15 (App Router) + TypeScript + Tailwind, production build passes
- Design system: navy/ink background, blue → violet → magenta accent gradient,
  glass panels, Rajdhani (display) + Inter (body)
- Homepage: hero, live matches, popular sports, upcoming fixtures, news, leaderboard
- Full navigation and footer across every route named in the spec
- Responsive layout (mobile → desktop), visible focus states, `prefers-reduced-motion` respected
- SEO basics: metadata, Open Graph, `robots.txt`, `sitemap.ts`

**Demo data — clearly labeled in the UI**
All scores, fixtures, news and leaderboard entries come from `lib/demo-data.ts`.
Every section that shows this data carries a visible "Demo data" badge, per the
spec's own requirement to never present sample data as live. Swap `fetchLiveMatches`
and `fetchUpcomingFixtures` in that file for real provider calls when ready — the
component props are already shaped for it.

**Not built yet (flagged in the UI with a "Phase 2 build" badge on each page)**
- Database (PostgreSQL + Prisma) and real sports scores/fixtures provider integration
- Authentication (the `/login` and `/register` forms are UI only — submit is disabled)
- Match detail pages, team/league detail pages, standings
- Predictions submission/validation, prediction history, accuracy tracking
- Admin dashboard and every `/admin/*` route
- The optional real-money betting module

## Running it

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

```bash
npm run lint       # eslint
npm run typecheck   # tsc --noEmit
npm run build       # production build
npm run preview     # Cloudflare Workers preview via OpenNext
npm run deploy      # deploy to Cloudflare Workers
```

## On the betting module

The original spec correctly scopes real-money betting as optional, disabled by
default, and gated behind licensing, age verification, payment compliance and
responsible-gambling controls in every jurisdiction you operate in — it does not
ship here. Online sports betting is tightly restricted in Pakistan specifically,
so if that's your base of operations, get local legal advice before enabling
any real-money feature, independent of where else the platform is available.
The non-monetary predictions/leaderboard flow (Phase 2 above) is the safe next
step and is what the homepage is already wired to lead users toward.

## Final streaming platform

The root route opens the supplied final platform UI from `public/platform.html`. Its sports feed is explicitly preview content. Plan cards are design previews only: no paid upgrade, checkout, subscription, or account request is enabled. The two user-supplied Adsterra page scripts are included in the static platform. Login and signup are browser-only demo profiles that ask only for a name and email; they do not create accounts or connect OAuth providers. OAuth cannot be enabled until a provider client ID and callback configuration are supplied.

The separate `worker/` directory contains the Cloudflare stream proxy. Its production origin allowlist contains only `https://magxtv.click`. The website API URL is blank and `PUBLIC_PLAYBACK_ENABLED` is false by default. Provider credentials belong in Worker secrets, never in the browser or repository. The upstream is HTTP and does not encrypt credentials in transit. Public stream relay must remain disabled unless the provider permits public redistribution of the selected channels.

The supplied M3U4U sports backup is stored as sanitized metadata in `lib/sports-channel-catalog.json` (2,251 records across 38 groups); credential-bearing playlist URLs were excluded.

No paid package or Cloudflare plan upgrade is required for this source configuration. Free plan quotas still apply.

## Project structure

```
app/            route segments (one folder per page)
components/     shared UI (Header, Footer, Hero, section components)
lib/demo-data.ts   typed sample data + the two functions to replace with real API calls
```
