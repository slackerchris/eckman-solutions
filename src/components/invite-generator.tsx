"use client";

import { useActionState } from "react";

import { createInviteAction, type InviteActionState } from "@/app/portal/invite/actions";
import { inputStyle as baseInputStyle } from "@/components/form-styles";

const inviteLinkInputStyle = {
  ...baseInputStyle,
  flex: 1,
  fontSize: ".875rem",
  fontFamily: "monospace",
  minWidth: 0,
} as const;

export function InviteGenerator({ baseUrl }: { baseUrl: string }) {
  const [state, formAction, isPending] = useActionState<InviteActionState, FormData>(
    createInviteAction,
    {},
  );

  const link = state.token ? `${baseUrl}/portal/invite/${state.token}` : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <form action={formAction}>
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary"
          style={{ borderRadius: "999px", padding: "10px 28px", fontSize: ".875rem", opacity: isPending ? 0.6 : 1 }}
        >
          {isPending ? "Generating…" : "Generate invite link"}
        </button>
      </form>

      {link && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ fontSize: ".825rem", color: "var(--muted)" }}>
            Copy this link and send it. It can only be used once.
          </p>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <input readOnly value={link} style={inviteLinkInputStyle} onFocus={(e) => e.target.select()} />
            <button
              type="button"
              style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "10px 20px", fontSize: ".8rem", color: "var(--ink)", background: "transparent", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
              onClick={() => navigator.clipboard.writeText(link)}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
