import Link from "next/link";
import { upcomingFixtures } from "@/lib/demo-data";
import DemoBadge from "./DemoBadge";

export default function UpcomingFixtures() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Upcoming fixtures</h2>
            <DemoBadge />
          </div>
          <Link href="/matches" className="text-sm font-medium text-accent-cyan hover:underline">
            View all
          </Link>
        </div>

        <ul className="mt-5 divide-y divide-white/5">
          {upcomingFixtures.map((fixture) => (
            <li key={fixture.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium text-white">
                  {fixture.home} vs {fixture.away}
                </p>
                <p className="text-xs text-slate-500">{fixture.competition}</p>
              </div>
              <div className="text-right text-xs text-slate-400">
                <p>{fixture.date}</p>
                <p>{fixture.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
