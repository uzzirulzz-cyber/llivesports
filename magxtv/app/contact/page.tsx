import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Contact us</h1>
      <p className="mt-4 text-slate-400">
        Add your real contact details and a working contact form here before launch.
      </p>
    </section>
  );
}
