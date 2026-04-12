import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin — Eckman Solutions Portal",
};

export default async function AdminPage() {
  await requireAdmin();

  const [projectCount, quoteCount, invoiceCount, requestCount, changeCount, supportCount, unusedInviteCount, userCount] = await Promise.all([
    prisma.project.count(),
    prisma.quote.count(),
    prisma.invoice.count(),
    prisma.supportItem.count({ where: { projectId: null } }),
    prisma.supportItem.count({ where: { projectId: { not: null }, purpose: "Change Request" } }),
    prisma.supportItem.count({ where: { projectId: { not: null }, purpose: { not: "Change Request" } } }),
    prisma.invite.count({ where: { usedAt: null } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
  ]);

  const sections = [
    { label: "Users", href: "/portal/admin/users", count: userCount, description: "Manage client accounts — reset passwords, disable or remove users." },
    { label: "Projects", href: "/portal/admin/projects", count: projectCount, description: "Manage active and completed projects shown in the portal." },
    { label: "Quotes", href: "/portal/admin/quotes", count: quoteCount, description: "Create estimates with line items and convert approved quotes into projects/invoices." },
    { label: "Invoices", href: "/portal/admin/invoices", count: invoiceCount, description: "Create and update invoice records for the billing section." },
    { label: "Request queue", href: "/portal/admin/requests", count: requestCount, description: "Review incoming requests that are not linked to a project yet." },
    { label: "Change queue", href: "/portal/admin/changes", count: changeCount, description: "Review project-linked change requests for existing project additions." },
    { label: "Support queue", href: "/portal/admin/support", count: supportCount, description: "Manage project-linked support requests shown in the support queue." },
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
