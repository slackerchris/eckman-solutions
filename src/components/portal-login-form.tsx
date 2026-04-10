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
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          style={{ width: "100%", borderRadius: "10px", border: "1px solid var(--border)", padding: "14px 16px", fontSize: "1rem", background: "var(--paper)", color: "var(--ink)", outline: "none", boxSizing: "border-box" }}
          placeholder="you@example.com"
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
        <p style={{ borderRadius: "10px", border: "1px solid rgba(220,38,38,.3)", padding: "14px 16px", fontSize: ".9rem", background: "rgba(220,38,38,.08)", color: "#dc2626" }}>
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
    </form>
  );
}