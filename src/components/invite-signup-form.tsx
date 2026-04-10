"use client";

import { useActionState } from "react";

import { signupWithInviteAction, type SignupActionState } from "@/app/portal/invite/actions";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  fontSize: "1rem",
  border: "1px solid var(--border)",
  borderRadius: ".75rem",
  background: "var(--paper)",
  color: "var(--ink)",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  display: "block",
  fontFamily: "monospace",
  fontSize: ".72rem",
  textTransform: "uppercase" as const,
  letterSpacing: ".16em",
  color: "var(--accent)",
  marginBottom: "8px",
};

export function InviteSignupForm({ token }: { token: string }) {
  const action = signupWithInviteAction.bind(null, token);
  const [state, formAction, isPending] = useActionState<SignupActionState, FormData>(action, {});

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {state.error && (
        <p style={{ padding: "12px 16px", borderRadius: ".75rem", background: "var(--error-soft, rgba(220,38,38,.1))", color: "var(--error, #dc2626)", fontSize: ".875rem" }}>
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="name" style={labelStyle}>Your name</label>
        <input id="name" name="name" required style={inputStyle} placeholder="Jane Smith" autoComplete="name" />
      </div>
      <div>
        <label htmlFor="email" style={labelStyle}>Email address</label>
        <input id="email" name="email" type="email" required style={inputStyle} placeholder="you@example.com" autoComplete="email" />
      </div>
      <div>
        <label htmlFor="password" style={labelStyle}>Password</label>
        <input id="password" name="password" type="password" required minLength={8} style={inputStyle} placeholder="8+ characters" autoComplete="new-password" />
      </div>
      <div>
        <label htmlFor="confirm" style={labelStyle}>Confirm password</label>
        <input id="confirm" name="confirm" type="password" required minLength={8} style={inputStyle} placeholder="Re-enter password" autoComplete="new-password" />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary"
        style={{ borderRadius: "999px", padding: "12px 28px", fontSize: ".9rem", opacity: isPending ? 0.6 : 1 }}
      >
        {isPending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
