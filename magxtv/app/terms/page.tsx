import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Terms of service</h1>
      <p className="mt-4 text-slate-400">
        Replace this placeholder with real terms, reviewed by counsel — especially before enabling
        predictions, accounts, or any monetary feature.
      </p>
    </section>
  );
}
