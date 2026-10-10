import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">About MAGXTV.CLICK</h1>
      <p className="mt-4 text-slate-400">
        MAGXTV.CLICK brings live scores, fixtures, match insights and community predictions
        for football, cricket, basketball, tennis and more into a single, fast platform.
      </p>
      <p className="mt-4 text-slate-400">
        Replace this copy with the real company story, mission and team details before launch.
      </p>
    </section>
  );
}
