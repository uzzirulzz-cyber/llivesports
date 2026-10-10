# MAGXTV.CLICK

Live scores, fixtures and match-prediction platform. This repo is **Phase 1** of the
build: the frontend, design system and route map. It is not yet connected to a
database, a real sports data provider, or authentication.

## Status report

**Fully implemented**
- Next.js 14 (App Router) + TypeScript + Tailwind, production build passes
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
- Database (PostgreSQL + Prisma), API routes, and real sports-data provider integration
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

## Project structure

```
app/            route segments (one folder per page)
components/     shared UI (Header, Footer, Hero, section components)
lib/demo-data.ts   typed sample data + the two functions to replace with real API calls
```
