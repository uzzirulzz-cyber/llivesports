import Link from "next/link";
import { popularSports } from "@/lib/demo-data";

export default function PopularSports() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-2xl font-semibold">Popular sports</h2>
        <p className="mt-1 text-sm text-slate-400">Your favorite sports, all in one place.</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {popularSports.map((sport) => (
          <Link
            key={sport.slug}
            href={`/sports/${sport.slug}`}
            className="glass-panel flex flex-col items-center gap-2 rounded-xl px-3 py-6 text-center transition hover:border-accent-cyan/40 hover:bg-white/[0.07]"
          >
            <span className="text-2xl" aria-hidden="true">
              {sport.icon}
            </span>
            <span className="text-sm font-medium text-slate-200">{sport.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
