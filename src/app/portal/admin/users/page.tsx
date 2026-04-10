import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Users — Admin — Eckman Solutions Portal" };

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { projects: true } } },
  });

  const clients = users.filter((u) => u.role === "CLIENT");
  const admins = users.filter((u) => u.role === "ADMIN");

  const rowStyle = (disabled: boolean) => ({
    display: "grid",
    gridTemplateColumns: "1fr auto auto auto",
    gap: "12px",
    alignItems: "center",
    padding: "14px 20px",
    borderBottom: "1px solid var(--line)",
    opacity: disabled ? 0.5 : 1,
  });

  const UserRow = ({ user }: { user: (typeof users)[0] }) => (
    <div style={rowStyle(user.disabled)}>
      <div>
        <p style={{ fontWeight: 600, fontSize: ".95rem", color: "var(--ink)" }}>{user.name}</p>
        <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: "2px" }}>{user.email}</p>
      </div>
      <span style={{ fontSize: ".75rem", color: "var(--muted)", textAlign: "right" }}>
        {user._count.projects} project{user._count.projects !== 1 ? "s" : ""}
      </span>
      {user.disabled ? (
        <span style={{ fontSize: ".7rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: ".1em", color: "#c0392b", border: "1px solid #c0392b44", borderRadius: "999px", padding: "3px 10px" }}>
          Disabled
        </span>
      ) : (
        <span style={{ fontSize: ".7rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)", borderRadius: "999px", padding: "3px 10px" }}>
          Active
        </span>
      )}
      <Link
        href={`/portal/admin/users/${user.id}`}
        style={{ fontSize: ".8rem", color: "var(--accent-strong)", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}
      >
        Manage →
      </Link>
    </div>
  );

  return (
    <section className="wrap" style={{ padding: "40px 0", maxWidth: "860px" }}>
      <Link
        href="/portal/admin"
        style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}
      >
        ← Admin
      </Link>
      <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px", marginBottom: "32px" }}>
        Users
      </h2>

      {/* Clients */}
      <article style={{ border: "1px solid var(--border)", borderRadius: "1.5rem", background: "var(--card)", overflow: "hidden", marginBottom: "24px" }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--line)" }}>
          <p style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
            Clients — {clients.length}
          </p>
        </div>
        {clients.length === 0 ? (
          <p style={{ padding: "24px 20px", fontSize: ".875rem", color: "var(--muted)" }}>No clients yet.</p>
        ) : (
          clients.map((u) => <UserRow key={u.id} user={u} />)
        )}
      </article>

      {/* Admins */}
      <article style={{ border: "1px solid var(--border)", borderRadius: "1.5rem", background: "var(--card)", overflow: "hidden" }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--line)" }}>
          <p style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
            Admins — {admins.length}
          </p>
        </div>
        {admins.map((u) => <UserRow key={u.id} user={u} />)}
      </article>
    </section>
  );
}
