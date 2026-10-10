import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Sign up" };

export default function RegisterPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Create your account</h1>
      <p className="mt-2 text-sm text-slate-400">
        This form is UI only — no authentication backend is connected yet.
      </p>

      <form className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-slate-300">
            Username
          </label>
          <input
            id="name"
            type="text"
            autoComplete="username"
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-accent-cyan/50"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-accent-cyan/50"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-slate-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-accent-cyan/50"
          />
        </div>
        <button
          type="submit"
          disabled
          className="w-full cursor-not-allowed rounded-full bg-accent-gradient py-2.5 text-sm font-semibold text-white opacity-60"
        >
          Sign up (backend not connected)
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="text-accent-cyan hover:underline">
          Log in
        </Link>
      </p>
    </section>
  );
}
