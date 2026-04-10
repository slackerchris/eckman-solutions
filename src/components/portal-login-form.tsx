"use client";

import { useActionState } from "react";

import { loginPortalAction, type LoginPortalState } from "@/app/portal/actions";

export function PortalLoginForm() {
  const [state, formAction, isPending] = useActionState<LoginPortalState, FormData>(
    loginPortalAction,
    {},
  );

  return (
    <form className="space-y-4" action={formAction}>
      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent-strong)]"
        >
          Client email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
          placeholder="you@business.com"
          defaultValue="client@eckman.solutions"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent-strong)]"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
          placeholder="Portal password"
          required
        />
      </div>
      {state.error ? (
        <p className="rounded-2xl border border-[#d97706]/30 bg-[#fff2db] px-4 py-3 text-sm text-[#9a3412]">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        className="w-full rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isPending}
      >
        {isPending ? "Signing in..." : "Sign in to portal"}
      </button>
      <p className="text-sm leading-7 text-[var(--muted)]">
        This login now uses a real server-side session. Create your first portal
        user with the CLI command documented in the README before deploying.
      </p>
    </form>
  );
}