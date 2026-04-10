import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin — Eckman Solutions Portal",
};

export default async function AdminPage() {
  await requireAdmin();

  const [projectCount, invoiceCount, supportCount, unusedInviteCount, userCount] = await Promise.all([
    prisma.project.count(),
    prisma.invoice.count(),
    prisma.supportItem.count(),
    prisma.invite.count({ where: { usedAt: null } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
  ]);

  const sections = [
    { label: "Users", href: "/portal/admin/users", count: userCount, description: "Manage client accounts — reset passwords, disable or remove users." },
    { label: "Projects", href: "/portal/admin/projects", count: projectCount, description: "Manage active and completed projects shown in the portal." },
    { label: "Invoices", href: "/portal/admin/invoices", count: invoiceCount, description: "Create and update invoice records for the billing section." },
    { label: "Support items", href: "/portal/admin/support", count: supportCount, description: "Manage the support queue shown on the dashboard." },
    { label: "Invites", href: "/portal/admin/invites", count: unusedInviteCount, description: "Generate single-use signup links to onboard new clients." },
  ];

  return (
    <section style={{ padding: "0" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px" }}>
          Admin
        </h2>
      </div>

      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {sections.map((s) => (
          <Link key={s.label} href={s.href} style={{ textDecoration: "none" }}>
            <article style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "24px", transition: "border-color .15s" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <p style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
                  {s.label}
                </p>
                <span style={{ fontFamily: "monospace", fontSize: "1.5rem", fontWeight: 700, color: "var(--ink)" }}>
                  {s.count}
                </span>
              </div>
              <p style={{ fontSize: ".875rem", color: "var(--muted)", lineHeight: 1.6 }}>{s.description}</p>
              <p style={{ marginTop: "16px", fontSize: ".8rem", color: "var(--accent)", fontWeight: 600 }}>Manage →</p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
