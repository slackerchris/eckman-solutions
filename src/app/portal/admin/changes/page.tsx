import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { deleteSupportItemAction } from "@/app/portal/admin/actions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

export const metadata: Metadata = { title: "Change Queue — Admin" };

export default async function AdminChangesPage() {
  await requireAdmin();
  const items = await prisma.supportItem.findMany({
    where: {
      projectId: { not: null },
      purpose: "Change Request",
    },
    orderBy: { createdAt: "desc" },
    include: { project: { select: { name: true } } },
  });

  return (
    <section style={{ padding: "0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
        <div>
          <Link href="/portal/admin" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
            ← Admin
          </Link>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px" }}>
            Change queue
          </h2>
        </div>
        <Link
          href="/portal/admin/support/new"
          className="btn-primary"
          style={{ borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", textDecoration: "none", display: "inline-block" }}
        >
          + New item
        </Link>
      </div>

      {items.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: ".95rem" }}>No change requests yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {items.map((item) => (
            <article
              key={item.id}
              style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "20px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}
            >
              <div>
                <p style={{ fontFamily: "monospace", fontSize: ".68rem", textTransform: "uppercase", letterSpacing: ".14em", color: "var(--accent)", marginBottom: "4px" }}>
                  {item.category ?? "General"}_
                  <span style={{ marginLeft: "8px", color: "var(--muted)", letterSpacing: ".1em" }}>{item.status}</span>
                  <span style={{ marginLeft: "8px", color: "var(--muted)", letterSpacing: ".1em" }}>{item.purpose}</span>
                </p>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)" }}>{item.title}</p>
                {item.project && (
                  <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: "4px" }}>Project: {item.project.name}</p>
                )}
                <p style={{ fontSize: ".875rem", color: "var(--muted)", marginTop: "6px", lineHeight: 1.6 }}>{item.detail}</p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <Link
                  href={`/portal/admin/support/${item.id}/edit`}
                  style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 16px", fontSize: ".8rem", color: "var(--ink)", background: "transparent", textDecoration: "none" }}
                >
                  Edit
                </Link>
                <ConfirmDeleteButton
                  action={deleteSupportItemAction.bind(null, item.id, "/portal/admin/changes")}
                  message="Delete this change request?"
                  style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 16px", fontSize: ".8rem", color: "var(--muted)", background: "transparent", cursor: "pointer" }}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
