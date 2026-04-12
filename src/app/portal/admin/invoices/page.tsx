import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { deleteInvoiceAction } from "@/app/portal/admin/actions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

export const metadata: Metadata = { title: "Invoices — Admin" };

export default async function AdminInvoicesPage() {
  await requireAdmin();
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      lineItems: { select: { id: true } },
      quote: { select: { id: true } },
    },
  });

  return (
    <section style={{ padding: "0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
        <div>
          <Link href="/portal/admin" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
            ← Admin
          </Link>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px" }}>
            Invoices
          </h2>
        </div>
        <Link
          href="/portal/admin/invoices/new"
          className="btn-primary"
          style={{ borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", textDecoration: "none", display: "inline-block" }}
        >
          + New invoice
        </Link>
      </div>

      {invoices.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: ".95rem" }}>No invoices yet. Add one above.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {invoices.map((inv) => (
            <article
              key={inv.id}
              style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "20px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}
            >
              <div>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)" }}>{inv.label}</p>
                <p style={{ fontSize: ".875rem", color: "var(--muted)", marginTop: "4px" }}>
                  {inv.amount} &mdash; <span style={{ color: "var(--accent)" }}>{inv.status}</span>
                </p>
                <p style={{ marginTop: "4px", fontSize: ".76rem", color: "var(--muted)" }}>
                  {inv.lineItems.length} item{inv.lineItems.length !== 1 ? "s" : ""}
                  {inv.quote ? " • from quote" : ""}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <Link
                  href={`/portal/admin/invoices/${inv.id}/edit`}
                  style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 16px", fontSize: ".8rem", color: "var(--ink)", background: "transparent", textDecoration: "none" }}
                >
                  Edit
                </Link>
                <ConfirmDeleteButton
                  action={deleteInvoiceAction.bind(null, inv.id)}
                  message="Delete this invoice?"
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
