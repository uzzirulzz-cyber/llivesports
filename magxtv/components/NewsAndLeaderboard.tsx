import Link from "next/link";
import { latestNews, leaderboard, featuredLeagues } from "@/lib/demo-data";
import DemoBadge from "./DemoBadge";

export default function NewsAndLeaderboard() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest news</h2>
            <Link href="/news" className="text-sm font-medium text-accent-cyan hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-5 space-y-4">
            {latestNews.map((item) => (
              <li key={item.slug}>
                <Link href={`/news/${item.slug}`} className="group block">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-white/5 px-2 py-0.5">{item.category}</span>
                    <span>{item.publishedAt}</span>
                  </div>
                  <p className="mt-1 font-medium text-white group-hover:text-accent-cyan">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{item.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Featured leagues</h3>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {featuredLeagues.map((league) => (
                <Link
                  key={league.slug}
                  href={`/leagues/${league.slug}`}
                  className="rounded-lg bg-white/[0.03] px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <p className="font-medium text-white">{league.name}</p>
                  <p className="text-slate-500">{league.country}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Leaderboard</h2>
            <DemoBadge />
          </div>
          <ol className="mt-5 space-y-3">
            {leaderboard.map((entry) => (
              <li key={entry.rank} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-xs font-semibold text-slate-300">
                    {entry.rank}
                  </span>
                  <span className="text-slate-200">{entry.username}</span>
                </div>
                <div className="text-right">
                  <p className="font-display font-semibold text-white">{entry.points.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{entry.accuracy} accuracy</p>
                </div>
              </li>
            ))}
          </ol>
          <Link
            href="/leaderboard"
            className="mt-5 block rounded-full border border-white/15 py-2 text-center text-sm font-medium text-white transition hover:bg-white/10"
          >
            Full leaderboard
          </Link>
        </div>
      </div>
    </section>
  );
}
