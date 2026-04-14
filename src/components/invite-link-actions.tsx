"use client";

import { useState } from "react";

type InviteLinkActionsProps = {
  link: string;
  disabled?: boolean;
};

function buildInviteMailto(link: string): string {
  const subject = encodeURIComponent("Your Eckman Solutions portal invite");
  const body = encodeURIComponent(
    [
      "Hi,",
      "",
      "Use this invite link to create your client portal account:",
      link,
      "",
      "This link is single-use.",
    ].join("\n"),
  );

  return `mailto:?subject=${subject}&body=${body}`;
}

export function InviteLinkActions({ link, disabled = false }: InviteLinkActionsProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (disabled) return;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  const commonStyle = {
    border: "1px solid var(--border)",
    borderRadius: "999px",
    padding: "6px 12px",
    fontSize: ".75rem",
    textDecoration: "none",
    whiteSpace: "nowrap" as const,
  };

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled}
        style={{
          ...commonStyle,
          background: "transparent",
          color: disabled ? "var(--muted)" : "var(--ink)",
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>

      <a
        href={disabled ? undefined : buildInviteMailto(link)}
        style={{
          ...commonStyle,
          color: disabled ? "var(--muted)" : "var(--ink)",
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        Email
      </a>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...commonStyle,
          color: "var(--accent)",
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        Open
      </a>
    </div>
  );
}
