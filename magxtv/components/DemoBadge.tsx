export default function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[11px] font-medium text-amber-300 ${className}`}
      title="No live sports data provider is connected yet — this is sample data."
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      Demo data
    </span>
  );
}
