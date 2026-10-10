import Link from "next/link";
import { liveMatches } from "@/lib/demo-data";
import DemoBadge from "./DemoBadge";

export default function LiveMatchesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">Live matches</h2>
          <DemoBadge />
        </div>
        <Link href="/live" className="text-sm font-medium text-accent-cyan hover:underline">
          View all
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {liveMatches.map((match) => (
          <Link
            key={match.id}
            href={`/matches/${match.id}`}
            className="glass-panel group rounded-xl p-4 transition hover:border-accent-violet/40"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {match.sport} · {match.competition}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-live/15 px-2 py-0.5 font-semibold text-live">
                <span className="h-1.5 w-1.5 rounded-full bg-live" />
                Live
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <TeamLine name={match.home.name} score={match.homeScore} colorFrom={match.home.colorFrom} colorTo={match.home.colorTo} />
              <TeamLine name={match.away.name} score={match.awayScore} colorFrom={match.away.colorFrom} colorTo={match.away.colorTo} />
            </div>

            <p className="mt-4 text-right text-xs text-slate-500">{match.clock}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TeamLine({
  name,
  score,
  colorFrom,
  colorTo
}: {
  name: string;
  score: number;
  colorFrom: string;
  colorTo: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
        />
        <span className="text-sm text-slate-200">{name}</span>
      </div>
      <span className="font-display text-lg font-semibold">{score}</span>
    </div>
  );
}
