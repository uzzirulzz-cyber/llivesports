import Link from "next/link";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { href: "/live", label: "Live scores" },
      { href: "/matches", label: "Matches" },
      { href: "/leagues", label: "Leagues" },
      { href: "/predictions", label: "Predictions" }
    ]
  },
  {
    title: "Community",
    links: [
      { href: "/leaderboard", label: "Leaderboard" },
      { href: "/news", label: "News" },
      { href: "/favorites", label: "Favorites" }
    ]
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" }
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-gradient font-display text-xs font-bold">
                M
              </span>
              <span className="font-display text-base font-semibold">
                MAGXTV<span className="text-gradient">.CLICK</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-400">Every match. Every moment.</p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MAGXTV.CLICK. All rights reserved.</p>
          <p>Predictions are for entertainment only and carry no guarantee of accuracy.</p>
        </div>
      </div>
    </footer>
  );
}
