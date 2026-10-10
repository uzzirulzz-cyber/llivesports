import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Privacy policy</h1>
      <p className="mt-4 text-slate-400">
        Replace this placeholder with your actual privacy policy, reviewed by counsel for every
        jurisdiction you operate in, before accepting real user sign-ups.
      </p>
    </section>
  );
}
