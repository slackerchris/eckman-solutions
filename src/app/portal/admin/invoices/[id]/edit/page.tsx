import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { updateInvoiceAction } from "@/app/portal/admin/actions";

export const metadata: Metadata = { title: "Edit Invoice — Admin" };

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  fontSize: "1rem",
  border: "1px solid var(--border)",
  borderRadius: ".75rem",
  background: "var(--paper)",
  color: "var(--ink)",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  display: "block",
  fontSize: ".825rem",
  fontWeight: 600,
  color: "var(--muted)",
  marginBottom: "6px",
  textTransform: "uppercase" as const,
  letterSpacing: ".08em",
};

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) notFound();

  const action = updateInvoiceAction.bind(null, invoice.id);

  return (
    <section className="wrap" style={{ padding: "40px 0", maxWidth: "560px" }}>
      <Link href="/portal/admin/invoices" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
        ← Invoices
      </Link>
      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px", marginBottom: "28px" }}>
        Edit invoice
      </h2>

      <form action={action} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label htmlFor="label" style={labelStyle}>Label</label>
          <input id="label" name="label" required defaultValue={invoice.label} style={inputStyle} />
        </div>
        <div>
          <label htmlFor="amount" style={labelStyle}>Amount</label>
          <input id="amount" name="amount" required defaultValue={invoice.amount} style={inputStyle} />
        </div>
        <div>
          <label htmlFor="status" style={labelStyle}>Status</label>
          <input id="status" name="status" required defaultValue={invoice.status} style={inputStyle} />
        </div>
        <div style={{ display: "flex", gap: "12px", paddingTop: "4px" }}>
          <button type="submit" className="btn-primary" style={{ borderRadius: "999px", padding: "10px 28px", fontSize: ".875rem" }}>
            Save changes
          </button>
          <Link href="/portal/admin/invoices" style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", color: "var(--muted)", textDecoration: "none" }}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
