import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { createInvoiceAction } from "@/app/portal/admin/actions";

export const metadata: Metadata = { title: "New Invoice — Admin" };

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

export default async function NewInvoicePage() {
  await requireAdmin();

  return (
    <section className="wrap" style={{ padding: "40px 0", maxWidth: "560px" }}>
      <Link href="/portal/admin/invoices" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
        ← Invoices
      </Link>
      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px", marginBottom: "28px" }}>
        New invoice
      </h2>

      <form action={createInvoiceAction} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label htmlFor="label" style={labelStyle}>Label</label>
          <input id="label" name="label" required style={inputStyle} placeholder="Website design and launch" />
        </div>
        <div>
          <label htmlFor="amount" style={labelStyle}>Amount</label>
          <input id="amount" name="amount" required style={inputStyle} placeholder="$1,400" />
        </div>
        <div>
          <label htmlFor="status" style={labelStyle}>Status</label>
          <input id="status" name="status" required style={inputStyle} placeholder="Due Apr 18 · Paid" />
        </div>
        <div style={{ display: "flex", gap: "12px", paddingTop: "4px" }}>
          <button type="submit" className="btn-primary" style={{ borderRadius: "999px", padding: "10px 28px", fontSize: ".875rem" }}>
            Create invoice
          </button>
          <Link href="/portal/admin/invoices" style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", color: "var(--muted)", textDecoration: "none" }}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
