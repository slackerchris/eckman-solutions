"use client";

import { useActionState } from "react";

import { resetPasswordAction, type ResetPasswordState } from "@/app/portal/reset-password/actions";

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
  display: "block" as const,
  fontSize: ".825rem",
  fontWeight: 600 as const,
  color: "var(--muted)",
  marginBottom: "6px",
  textTransform: "uppercase" as const,
  letterSpacing: ".08em",
};

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ResetPasswordState, FormData>(resetPasswordAction, {});

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <input type="hidden" name="token" value={token} />

      {state.error && (
        <p style={{ color: "#c0392b", fontSize: ".875rem", background: "rgba(192,57,43,.08)", border: "1px solid rgba(192,57,43,.2)", borderRadius: ".75rem", padding: "12px 16px" }}>
          {state.error}
        </p>
      )}

      <div>
        <label style={labelStyle}>New password</label>
        <input type="password" name="password" required minLength={8} autoComplete="new-password" style={inputStyle} />
      </div>

      <div>
        <label style={labelStyle}>Confirm password</label>
        <input type="password" name="confirm" required minLength={8} autoComplete="new-password" style={inputStyle} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary"
        style={{ borderRadius: "999px", padding: "12px 28px", fontSize: ".9rem", opacity: pending ? 0.6 : 1 }}
      >
        {pending ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
