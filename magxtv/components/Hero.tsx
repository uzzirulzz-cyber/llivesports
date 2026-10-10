import Link from "next/link";
import { liveMatches } from "@/lib/demo-data";
import DemoBadge from "./DemoBadge";

export default function Hero() {
  const headline = liveMatches[0];

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-accent-blue/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-64 h-72 w-72 rounded-full bg-accent-magenta/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-live" />
            Live right now across 4 sports
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            Every match.
            <br />
            <span className="text-gradient">Every moment.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base text-slate-400 sm:text-lg">
            Live scores, match insights, fixtures and sports predictions in one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/matches"
              className="rounded-full bg-accent-gradient px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:opacity-90"
            >
              Explore Matches
            </Link>
            <Link
              href="/live"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Live Scores
            </Link>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div>
              <dt className="text-xs text-slate-500">Sports covered</dt>
              <dd className="mt-1 font-display text-2xl font-semibold">8+</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Leagues tracked</dt>
              <dd className="mt-1 font-display text-2xl font-semibold">40+</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Predictions made</dt>
              <dd className="mt-1 font-display text-2xl font-semibold">12k+</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="glass-panel rounded-2xl p-5 shadow-glow">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-live/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-live">
                Live
              </span>
              <DemoBadge />
            </div>

            <p className="mt-4 text-xs text-slate-500">{headline.competition}</p>
            <div className="mt-2 flex items-center justify-between">
              <TeamRow team={headline.home} />
              <span className="font-display text-2xl font-bold">
                {headline.homeScore} – {headline.awayScore}
              </span>
              <TeamRow team={headline.away} reverse />
            </div>
            <p className="mt-3 text-right text-xs text-slate-400">{headline.clock}</p>

            <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
              {liveMatches.slice(1, 3).map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-sm"
                >
                  <span className="text-slate-300">
                    {m.home.short} vs {m.away.short}
                  </span>
                  <span className="font-display font-semibold">
                    {m.homeScore}–{m.awayScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamRow({
  team,
  reverse = false
}: {
  team: { name: string; short: string; colorFrom: string; colorTo: string };
  reverse?: boolean
}) {
  return (
    <div className={`flex items-center gap-2 ${reverse ? "flex-row-reverse text-right" : ""}`}>
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ background: `linear-gradient(135deg, ${team.colorFrom}, ${team.colorTo})` }}
      >
        {team.short.slice(0, 2)}
      </span>
      <span className="text-xs font-medium text-slate-300">{team.short}</span>
    </div>
  );
}
