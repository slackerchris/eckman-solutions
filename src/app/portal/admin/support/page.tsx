import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { deleteSupportItemAction } from "@/app/portal/admin/actions";

export const metadata: Metadata = { title: "Support Items — Admin" };

export default async function AdminSupportPage() {
  await requireAdmin();
  const items = await prisma.supportItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <section style={{ padding: "0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
        <div>
          <Link href="/portal/admin" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
            ← Admin
          </Link>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px" }}>
            Support items
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
        <p style={{ color: "var(--muted)", fontSize: ".95rem" }}>No support items yet. Add one above.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {items.map((item) => (
            <article
              key={item.id}
              style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "20px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}
            >
              <div>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)" }}>{item.title}</p>
                <p style={{ fontSize: ".875rem", color: "var(--muted)", marginTop: "6px", lineHeight: 1.6 }}>{item.detail}</p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <Link
                  href={`/portal/admin/support/${item.id}/edit`}
                  style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 16px", fontSize: ".8rem", color: "var(--ink)", background: "transparent", textDecoration: "none" }}
                >
                  Edit
                </Link>
                <form action={deleteSupportItemAction.bind(null, item.id)}>
                  <button
                    type="submit"
                    style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 16px", fontSize: ".8rem", color: "var(--muted)", background: "transparent", cursor: "pointer" }}
                    onClick={(e) => { if (!confirm("Delete this support item?")) e.preventDefault(); }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
