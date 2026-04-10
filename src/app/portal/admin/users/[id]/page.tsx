import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin, requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { SetPasswordForm } from "@/components/admin-user-forms";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import {
  adminGenerateResetLinkAndRedirectAction,
  adminToggleDisabledAction,
  adminDeleteUserAction,
} from "@/app/portal/admin/users/actions";

export const metadata: Metadata = { title: "Manage User — Admin — Eckman Solutions Portal" };

const sectionStyle = {
  border: "1px solid var(--border)",
  borderRadius: "1.5rem",
  background: "var(--card)",
  overflow: "hidden",
  marginBottom: "20px",
};

const sectionHeaderStyle = {
  padding: "18px 24px",
  borderBottom: "1px solid var(--line)",
};

const sectionBodyStyle = {
  padding: "24px",
};

export default async function AdminUserDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ resetLink?: string }>;
}) {
  await requireAdmin();
  const self = await requireSession();
  const { id } = await params;
  const { resetLink } = await searchParams;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      projects: { orderBy: { createdAt: "desc" }, select: { id: true, name: true, type: true, status: true } },
    },
  });

  if (!user) notFound();

  const isSelf = self.userId === id;

  // Resolve base URL for the reset link display
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return (
    <section style={{ maxWidth: "680px" }}>
      <Link
        href="/portal/admin/users"
        style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}
      >
        ← All users
      </Link>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginTop: "8px", marginBottom: "32px" }}>
        <div>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", margin: 0 }}>
            {user.name}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: ".9rem", marginTop: "4px" }}>{user.email}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
          <span
            style={{
              fontSize: ".7rem",
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: ".1em",
              color: user.role === "ADMIN" ? "var(--ink)" : "var(--accent)",
              border: "1px solid var(--border)",
              borderRadius: "999px",
              padding: "4px 12px",
            }}
          >
            {user.role}
          </span>
          {user.disabled && (
            <span style={{ fontSize: ".7rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: ".1em", color: "#c0392b", border: "1px solid #c0392b44", borderRadius: "999px", padding: "4px 12px" }}>
              Disabled
            </span>
          )}
        </div>
      </div>

      {/* Reset link flash banner */}
      {resetLink && (
        <div style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)", borderRadius: "1rem", padding: "16px 20px", marginBottom: "20px" }}>
          <p style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".14em", color: "var(--accent-strong)", marginBottom: "8px" }}>
            Password reset link (valid 24 hours) — copy and send to {user.name}:
          </p>
          <code
            style={{ display: "block", fontSize: ".8rem", background: "var(--surface-strong)", border: "1px solid var(--line)", borderRadius: ".5rem", padding: "10px 14px", wordBreak: "break-all", userSelect: "all", color: "var(--ink)" }}
          >
            {baseUrl}/portal/reset-password?token={resetLink}
          </code>
        </div>
      )}

      {/* Projects */}
      <article style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <p style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)", margin: 0 }}>
            Assigned projects — {user.projects.length}
          </p>
        </div>
        <div style={sectionBodyStyle}>
          {user.projects.length === 0 ? (
            <p style={{ fontSize: ".875rem", color: "var(--muted)", margin: 0 }}>No projects assigned.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {user.projects.map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: ".75rem", background: "var(--surface-strong)" }}>
                  <div>
                    <p style={{ fontSize: ".875rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>{p.name}</p>
                    <p style={{ fontSize: ".75rem", color: "var(--muted)", margin: "2px 0 0" }}>{p.type}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: ".75rem", color: "var(--muted)", border: "1px solid var(--line)", borderRadius: "999px", padding: "3px 10px" }}>{p.status}</span>
                    <Link href={`/portal/admin/projects/${p.id}/edit`} style={{ fontSize: ".75rem", color: "var(--accent-strong)", textDecoration: "none" }}>Edit</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Set password */}
      <article style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <p style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)", margin: 0 }}>
            Set new password
          </p>
          <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: "4px", marginBottom: 0 }}>
            Directly overwrite this account&apos;s password. The user will need to use the new password on next login.
          </p>
        </div>
        <div style={sectionBodyStyle}>
          <SetPasswordForm userId={id} />
        </div>
      </article>

      {/* Generate reset link */}
      <article style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <p style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)", margin: 0 }}>
            Generate reset link
          </p>
          <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: "4px", marginBottom: 0 }}>
            Generate a one-time link (valid 24 hours) that lets {user.name} choose their own password.
          </p>
        </div>
        <div style={sectionBodyStyle}>
          <form action={adminGenerateResetLinkAndRedirectAction.bind(null, id)}>
            <button
              type="submit"
              style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", fontWeight: 600, background: "transparent", color: "var(--ink)", cursor: "pointer" }}
            >
              Generate reset link
            </button>
          </form>
        </div>
      </article>

      {/* Account controls */}
      <article style={{ ...sectionStyle, border: "1px solid color-mix(in srgb, #c0392b 30%, transparent)" }}>
        <div style={{ ...sectionHeaderStyle, borderBottom: "1px solid color-mix(in srgb, #c0392b 20%, transparent)" }}>
          <p style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "#c0392b", margin: 0 }}>
            Account controls
          </p>
        </div>
        <div style={{ ...sectionBodyStyle, display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Disable / Enable */}
          {!isSelf && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
              <div>
                <p style={{ fontSize: ".9rem", fontWeight: 600, color: "var(--ink)", margin: 0 }}>
                  {user.disabled ? "Enable account" : "Disable account"}
                </p>
                <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: "2px", marginBottom: 0 }}>
                  {user.disabled
                    ? "Restore login access for this user."
                    : "Block this user from logging in. Their data is preserved."}
                </p>
              </div>
              <form action={adminToggleDisabledAction.bind(null, id, !user.disabled)}>
                <button
                  type="submit"
                  style={{ border: `1px solid ${user.disabled ? "var(--border)" : "#c0392b44"}`, borderRadius: "999px", padding: "9px 20px", fontSize: ".825rem", fontWeight: 600, background: "transparent", color: user.disabled ? "var(--ink)" : "#c0392b", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  {user.disabled ? "Enable account" : "Disable account"}
                </button>
              </form>
            </div>
          )}

          {/* Delete */}
          {!isSelf && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", paddingTop: "16px", borderTop: "1px solid color-mix(in srgb, #c0392b 15%, transparent)" }}>
              <div>
                <p style={{ fontSize: ".9rem", fontWeight: 600, color: "#c0392b", margin: 0 }}>Delete account</p>
                <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: "2px", marginBottom: 0 }}>
                  Permanently removes the user. Their projects will be unassigned, not deleted.
                </p>
              </div>
              <ConfirmDeleteButton
                action={adminDeleteUserAction.bind(null, id)}
                message={`Delete ${user.name}'s account? This cannot be undone.`}
                label="Delete account"
                style={{ border: "1px solid #c0392b", borderRadius: "999px", padding: "9px 20px", fontSize: ".825rem", fontWeight: 600, background: "#c0392b", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}
              />
            </div>
          )}

          {isSelf && (
            <p style={{ fontSize: ".875rem", color: "var(--muted)", margin: 0 }}>
              You cannot disable or delete your own account.
            </p>
          )}
        </div>
      </article>
    </section>
  );
}
