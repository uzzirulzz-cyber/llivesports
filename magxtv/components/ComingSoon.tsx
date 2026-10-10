export default function ComingSoon({
  title,
  description,
  nextSteps
}: {
  title: string;
  description: string;
  nextSteps: string[];
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
        Phase 2 build
      </span>
      <h1 className="mt-5 font-display text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mt-3 text-slate-400">{description}</p>

      <div className="glass-panel mt-8 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white">What this page needs next</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          {nextSteps.map((step) => (
            <li key={step} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
