import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { InviteGenerator } from "@/components/invite-generator";

export const metadata: Metadata = { title: "Invites — Admin" };

export default async function AdminInvitesPage() {
  await requireAdmin();

  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${proto}://${host}`;

  const invites = await prisma.invite.findMany({ orderBy: { createdAt: "desc" }, take: 20 });

  return (
    <section className="wrap" style={{ padding: "40px 0" }}>
      <div style={{ marginBottom: "32px" }}>
        <Link href="/portal/admin" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
          ← Admin
        </Link>
        <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px", marginBottom: "8px" }}>
          Invite links
        </h2>
        <p style={{ fontSize: ".9rem", color: "var(--muted)", marginBottom: "28px" }}>
          Generate a single-use link. Send it to the person — they set their own name, email, and password.
        </p>
        <InviteGenerator baseUrl={baseUrl} />
      </div>

      {invites.length > 0 && (
        <div>
          <p style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)", marginBottom: "14px" }}>
            Recent invites
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {invites.map((inv) => (
              <div
                key={inv.id}
                style={{ border: "1px solid var(--border)", borderRadius: "1rem", background: "var(--card)", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}
              >
                <code style={{ fontSize: ".75rem", color: "var(--muted)", wordBreak: "break-all" }}>
                  {inv.token.slice(0, 16)}…
                </code>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: ".7rem",
                    textTransform: "uppercase",
                    letterSpacing: ".1em",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    border: "1px solid var(--border)",
                    color: inv.usedAt ? "var(--muted)" : "var(--accent)",
                  }}
                >
                  {inv.usedAt
                    ? `Used ${new Date(inv.usedAt).toLocaleDateString()}`
                    : `Created ${new Date(inv.createdAt).toLocaleDateString()}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
