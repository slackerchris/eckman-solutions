import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { updateInvoiceAction } from "@/app/portal/admin/actions";
import { INVOICE_STATUSES } from "@/lib/portal-constants";
import { inputStyle, selectStyle, labelStyle } from "@/components/form-styles";

export const metadata: Metadata = { title: "Edit Invoice — Admin" };

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [invoice, projects] = await Promise.all([
    prisma.invoice.findUnique({
      where: { id },
      include: {
        lineItems: { orderBy: { position: "asc" } },
      },
    }),
    prisma.project.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!invoice) notFound();

  const action = updateInvoiceAction.bind(null, invoice.id);

  return (
    <section style={{ maxWidth: "560px" }}>
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
          <label htmlFor="workstream" style={labelStyle}>Workstream (optional)</label>
          <input id="workstream" name="workstream" defaultValue={invoice.workstream} style={inputStyle} placeholder="Website" />
        </div>
        <div>
          <label htmlFor="amount" style={labelStyle}>Amount (before discount)</label>
          <input id="amount" name="amount" required defaultValue={invoice.amount} style={inputStyle} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          <div>
            <label htmlFor="discount" style={labelStyle}>Discount (optional)</label>
            <input id="discount" name="discount" style={inputStyle} placeholder="0.00 or 10" />
          </div>
          <div>
            <label htmlFor="discountType" style={labelStyle}>Discount type</label>
            <select id="discountType" name="discountType" defaultValue="AMOUNT" style={selectStyle}>
              <option value="AMOUNT">Dollar amount ($)</option>
              <option value="PERCENT">Percentage (%)</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="status" style={labelStyle}>Status</label>
          <select id="status" name="status" required defaultValue={invoice.status} style={selectStyle}>
            {!INVOICE_STATUSES.includes(invoice.status as (typeof INVOICE_STATUSES)[number]) && (
              <option value={invoice.status}>{invoice.status}</option>
            )}
            {INVOICE_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="projectId" style={labelStyle}>Link to project (optional)</label>
          <select id="projectId" name="projectId" defaultValue={invoice.projectId ?? ""} style={selectStyle}>
            <option value="">— No project —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {invoice.lineItems.length > 0 ? (
          <div style={{ border: "1px solid var(--border)", borderRadius: ".9rem", padding: "12px 14px", background: "var(--card)" }}>
            <p style={{ ...labelStyle, marginBottom: "10px" }}>Line items copied from quote</p>
            <div style={{ display: "grid", gap: "8px" }}>
              {invoice.lineItems.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: ".86rem", color: "var(--muted)" }}>
                  <span>{item.description} ({item.quantity} x ${(item.unitPriceCents / 100).toFixed(2)})</span>
                  <span style={{ color: "var(--ink)", fontWeight: 600 }}>${((item.quantity * item.unitPriceCents) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

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
