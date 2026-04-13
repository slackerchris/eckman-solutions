import type { Metadata } from "next";
import Link from "next/link";

import { deleteSupportItemAction } from "@/app/portal/admin/actions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { requireAdmin } from "@/lib/auth/session";
import { isWebsiteLeadSupportItem } from "@/lib/contact-leads";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Website Leads — Admin" };

export default async function AdminLeadsPage() {
  await requireAdmin();

  const rawItems = await prisma.supportItem.findMany({
    where: {
      projectId: null,
      purposeId: "GENERAL_QUESTION",
    },
    orderBy: { createdAt: "desc" },
  });

  const items = rawItems.filter(isWebsiteLeadSupportItem);

  return (
    <section style={{ padding: "0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
        <div>
          <Link href="/portal/admin" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
            ← Admin
          </Link>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px" }}>
            Website leads
          </h2>
        </div>
        <Link
          href="/portal/admin/requests"
          style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", color: "var(--muted)", textDecoration: "none", display: "inline-block" }}
        >
          Request queue
        </Link>
      </div>

      {items.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: ".95rem" }}>No website leads yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {items.map((item) => (
            <article
              key={item.id}
              style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "20px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}
            >
              <div>
                <p style={{ fontFamily: "monospace", fontSize: ".68rem", textTransform: "uppercase", letterSpacing: ".14em", color: "var(--accent)", marginBottom: "4px" }}>
                  {item.category ?? "General"}
                  <span style={{ marginLeft: "8px", color: "var(--muted)", letterSpacing: ".1em" }}>{item.status}</span>
                </p>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)" }}>{item.title}</p>
                <p style={{ fontSize: ".875rem", color: "var(--muted)", marginTop: "6px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{item.detail}</p>
                <p style={{ fontSize: ".78rem", color: "var(--muted)", marginTop: "8px" }}>
                  Submitted {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <Link
                  href={`/portal/admin/support/${item.id}/edit`}
                  style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 16px", fontSize: ".8rem", color: "var(--ink)", background: "transparent", textDecoration: "none" }}
                >
                  Triage
                </Link>
                <ConfirmDeleteButton
                  action={deleteSupportItemAction.bind(null, item.id, "/portal/admin/leads")}
                  message="Delete this website lead?"
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
