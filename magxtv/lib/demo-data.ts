// -----------------------------------------------------------------------------
// DEMO DATA — no sports data provider is wired up yet.
// Every value here is sample content so the UI has something real to render.
// When a provider (API-Football, SportMonks, Sportradar, etc.) is connected,
// replace the three fetch functions at the bottom of this file and delete
// the arrays above them. Do not ship this file as-is to production.
// -----------------------------------------------------------------------------

export const IS_DEMO_DATA = true;

export type MatchStatus = "live" | "upcoming" | "finished" | "halftime";

export interface Team {
  name: string;
  short: string;
  colorFrom: string;
  colorTo: string;
}

export interface LiveMatch {
  id: string;
  sport: string;
  competition: string;
  home: Team;
  away: Team;
  homeScore: number;
  awayScore: number;
  clock: string;
  status: MatchStatus;
}

export interface Fixture {
  id: string;
  home: string;
  away: string;
  competition: string;
  date: string;
  time: string;
}

export interface SportCategory {
  slug: string;
  name: string;
  icon: string;
}

export interface LeagueSummary {
  slug: string;
  name: string;
  country: string;
  teamsCount: number;
}

export interface NewsItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  accuracy: string;
}

const T = (name: string, short: string, from: string, to: string): Team => ({
  name,
  short,
  colorFrom: from,
  colorTo: to
});

export const liveMatches: LiveMatch[] = [
  {
    id: "m-1001",
    sport: "Football",
    competition: "Premier League",
    home: T("Manchester City", "MCI", "#6CABDD", "#1C2C5B"),
    away: T("Arsenal", "ARS", "#EF0107", "#9C824A"),
    homeScore: 2,
    awayScore: 1,
    clock: "67'",
    status: "live"
  },
  {
    id: "m-1002",
    sport: "Football",
    competition: "Champions League",
    home: T("Real Madrid", "RMA", "#FEBE10", "#1A2A4A"),
    away: T("Barcelona", "BAR", "#A50044", "#004D98"),
    homeScore: 1,
    awayScore: 1,
    clock: "56'",
    status: "live"
  },
  {
    id: "m-1003",
    sport: "Basketball",
    competition: "NBA",
    home: T("Lakers", "LAL", "#552583", "#FDB927"),
    away: T("Celtics", "BOS", "#007A33", "#BA9653"),
    homeScore: 98,
    awayScore: 96,
    clock: "Q4 2:14",
    status: "live"
  },
  {
    id: "m-1004",
    sport: "Football",
    competition: "Ligue 1",
    home: T("PSG", "PSG", "#004170", "#DA291C"),
    away: T("Marseille", "OM", "#2FAEE0", "#ffffff"),
    homeScore: 3,
    awayScore: 0,
    clock: "72'",
    status: "live"
  }
];

export const upcomingFixtures: Fixture[] = [
  {
    id: "f-2001",
    home: "Tottenham",
    away: "Chelsea",
    competition: "Premier League",
    date: "Oct 14",
    time: "15:30"
  },
  {
    id: "f-2002",
    home: "Pakistan",
    away: "Australia",
    competition: "T20I Series",
    date: "Oct 14",
    time: "18:00"
  },
  {
    id: "f-2003",
    home: "Barcelona",
    away: "Getafe",
    competition: "La Liga",
    date: "Oct 15",
    time: "21:00"
  },
  {
    id: "f-2004",
    home: "Warriors",
    away: "Suns",
    competition: "NBA",
    date: "Oct 16",
    time: "02:30"
  }
];

export const popularSports: SportCategory[] = [
  { slug: "football", name: "Football", icon: "⚽" },
  { slug: "cricket", name: "Cricket", icon: "🏏" },
  { slug: "basketball", name: "Basketball", icon: "🏀" },
  { slug: "tennis", name: "Tennis", icon: "🎾" },
  { slug: "volleyball", name: "Volleyball", icon: "🏐" },
  { slug: "hockey", name: "Hockey", icon: "🏒" },
  { slug: "rugby", name: "Rugby", icon: "🏉" },
  { slug: "esports", name: "Esports", icon: "🎮" }
];

export const featuredLeagues: LeagueSummary[] = [
  { slug: "premier-league", name: "Premier League", country: "England", teamsCount: 20 },
  { slug: "la-liga", name: "La Liga", country: "Spain", teamsCount: 20 },
  { slug: "champions-league", name: "Champions League", country: "Europe", teamsCount: 36 },
  { slug: "nba", name: "NBA", country: "USA", teamsCount: 30 }
];

export const latestNews: NewsItem[] = [
  {
    slug: "city-arsenal-recap",
    title: "City edge Arsenal in five-goal thriller",
    excerpt: "A late header settled a chaotic title six-pointer at the Etihad.",
    category: "Football",
    publishedAt: "2 hours ago"
  },
  {
    slug: "clasico-preview",
    title: "El Clásico preview: form, injuries and the tactical picture",
    excerpt: "Both sides arrive with their strongest available XI for Sunday's clash.",
    category: "Football",
    publishedAt: "5 hours ago"
  },
  {
    slug: "t20-series-opener",
    title: "Pakistan name squad for the T20I series opener",
    excerpt: "Two uncapped seamers included as the selectors freshen the attack.",
    category: "Cricket",
    publishedAt: "1 day ago"
  }
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "pitchperfect", points: 4820, accuracy: "71%" },
  { rank: 2, username: "fulltimewhistle", points: 4615, accuracy: "68%" },
  { rank: 3, username: "clinicalfinish", points: 4490, accuracy: "66%" },
  { rank: 4, username: "lastmanstands", points: 4210, accuracy: "64%" },
  { rank: 5, username: "backpostheader", points: 4075, accuracy: "63%" }
];

// ---- Provider abstraction entry points -------------------------------------
// Swap these for real calls once a licensed sports data provider is configured.
// Keep the return shapes identical so components never need to change.

export async function fetchLiveMatches(): Promise<LiveMatch[]> {
  return liveMatches;
}

export async function fetchUpcomingFixtures(): Promise<Fixture[]> {
  return upcomingFixtures;
}
