"use client";

import { useActionState } from "react";

import { loginPortalAction, type LoginPortalState } from "@/app/portal/actions";

export function PortalLoginForm() {
  const [state, formAction, isPending] = useActionState<LoginPortalState, FormData>(
    loginPortalAction,
    {},
  );

  return (
    <form style={{ display: "flex", flexDirection: "column", gap: "20px" }} action={formAction}>
      <div>
        <label
          htmlFor="email"
          style={{ display: "block", fontFamily: "monospace", fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".16em", color: "var(--accent)", marginBottom: "8px" }}
        >
          Client email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          style={{ width: "100%", borderRadius: "10px", border: "1px solid var(--border)", padding: "14px 16px", fontSize: "1rem", background: "var(--paper)", color: "var(--ink)", outline: "none", boxSizing: "border-box" }}
          placeholder="you@business.com"
          defaultValue="client@eckman.solutions"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          style={{ display: "block", fontFamily: "monospace", fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".16em", color: "var(--accent)", marginBottom: "8px" }}
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          style={{ width: "100%", borderRadius: "10px", border: "1px solid var(--border)", padding: "14px 16px", fontSize: "1rem", background: "var(--paper)", color: "var(--ink)", outline: "none", boxSizing: "border-box" }}
          placeholder="Portal password"
          required
        />
      </div>
      {state.error ? (
        <p style={{ borderRadius: "10px", border: "1px solid var(--border)", padding: "14px 16px", fontSize: ".9rem", background: "var(--accent-soft)", color: "var(--ink)" }}>
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        className="btn-primary"
        style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: "1rem" }}
        disabled={isPending}
      >
        {isPending ? "Signing in…" : "Sign in to portal"}
      </button>
      <p style={{ fontSize: ".82rem", color: "var(--muted)", lineHeight: 1.6 }}>
        This login uses a real server-side session. Create your first portal
        user with the CLI command in the README before deploying.
      </p>
    </form>
  );
}