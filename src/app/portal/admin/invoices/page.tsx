import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { deleteInvoiceAction, setInvoiceStatusAction } from "@/app/portal/admin/actions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

export const metadata: Metadata = { title: "Invoices — Admin" };

function getQuickStatusActions(currentStatus: string): Array<{ label: string; status: string }> {
  const normalized = currentStatus.trim().toLowerCase();

  if (normalized === "draft") {
    return [{ label: "Mark sent", status: "Sent" }];
  }
  if (normalized === "sent") {
    return [
      { label: "Mark paid", status: "Paid" },
      { label: "Mark overdue", status: "Overdue" },
    ];
  }
  if (normalized === "overdue") {
    return [{ label: "Mark paid", status: "Paid" }];
  }
  if (normalized === "paid") {
    return [{ label: "Set sent", status: "Sent" }];
  }
  if (normalized === "cancelled") {
    return [{ label: "Reopen draft", status: "Draft" }];
  }

  return [{ label: "Set draft", status: "Draft" }];
}

export default async function AdminInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  await requireAdmin();
  const query = await searchParams;
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

      {query.message ? (
        <p style={{ marginBottom: "16px", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, .35)", background: "rgba(16, 185, 129, .12)", padding: "10px 12px", fontSize: ".85rem", color: "#047857" }}>
          {query.message}
        </p>
      ) : null}

      {query.error ? (
        <p style={{ marginBottom: "16px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, .35)", background: "rgba(239, 68, 68, .12)", padding: "10px 12px", fontSize: ".85rem", color: "#b91c1c" }}>
          {query.error}
        </p>
      ) : null}

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
                  {inv.workstream ? `Workstream: ${inv.workstream} • ` : ""}
                  {inv.lineItems.length} item{inv.lineItems.length !== 1 ? "s" : ""}
                  {inv.quote ? " • from quote" : ""}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {getQuickStatusActions(inv.status).map((action) => (
                  <form key={action.status} action={setInvoiceStatusAction.bind(null, inv.id, action.status)}>
                    <button
                      type="submit"
                      style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 14px", fontSize: ".78rem", color: "var(--muted)", background: "transparent", cursor: "pointer" }}
                    >
                      {action.label}
                    </button>
                  </form>
                ))}
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
