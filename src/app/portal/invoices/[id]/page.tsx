import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/quotes";

export const metadata: Metadata = { title: "Invoice Details — Portal" };

export default async function ClientInvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const paymentBaseUrl = process.env.NEXT_PUBLIC_CLIENT_PAYMENT_URL?.trim();
  const session = await requireSession();
  if (session.role === "ADMIN") {
    redirect("/portal/admin/invoices");
  }

  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, name: true, userId: true } },
      quote: {
        select: {
          id: true,
          userId: true,
          subtotalCents: true,
          discountCents: true,
          taxCents: true,
          totalCents: true,
        },
      },
      lineItems: { orderBy: { position: "asc" } },
    },
  });

  if (!invoice) {
    notFound();
  }

  const ownsByProject = Boolean(invoice.project && invoice.project.userId === session.userId);
  const ownsByQuote = Boolean(invoice.quote && invoice.quote.userId === session.userId);
  if (!ownsByProject && !ownsByQuote) {
    notFound();
  }

  const lineSubtotal = invoice.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0);
  const statusLower = invoice.status.toLowerCase();

  return (
    <section style={{ maxWidth: "860px" }}>
      <Link href="/portal/invoices" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
        ← Invoices
      </Link>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginTop: "6px", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)" }}>
          {invoice.label}
        </h2>
        <span style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "4px 12px", fontSize: ".8rem", color: statusLower === "paid" ? "#27ae60" : statusLower === "overdue" ? "#c0392b" : "var(--muted)" }}>
          {invoice.status}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "16px", color: "var(--muted)", fontSize: ".85rem" }}>
        <span>Issued {invoice.createdAt.toLocaleDateString()}</span>
        {invoice.project ? <span>• Project: {invoice.project.name}</span> : null}
        {invoice.workstream ? <span>• Workstream: {invoice.workstream}</span> : null}
        {invoice.quote ? (
          <Link href={`/portal/quotes/${invoice.quote.id}`} style={{ color: "var(--accent)", textDecoration: "none" }}>
            View quote
          </Link>
        ) : null}
      </div>

      {["sent", "overdue"].includes(statusLower) ? (
        paymentBaseUrl ? (
          <a
            href={`${paymentBaseUrl}${paymentBaseUrl.includes("?") ? "&" : "?"}invoice=${encodeURIComponent(invoice.id)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ marginBottom: "16px", borderRadius: "999px", padding: "10px 22px", fontSize: ".86rem", display: "inline-block", textDecoration: "none" }}
          >
            Pay now
          </a>
        ) : (
          <a
            href="#"
            className="btn-primary"
            style={{ marginBottom: "16px", borderRadius: "999px", padding: "10px 22px", fontSize: ".86rem", display: "inline-block", textDecoration: "none" }}
          >
            Pay now
          </a>
        )
      ) : null}

      <article style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "20px 22px" }}>
        {invoice.lineItems.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>No line items on this invoice.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {invoice.lineItems.map((item) => (
              <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: "10px" }}>
                <div>
                  <p style={{ fontSize: ".95rem", color: "var(--ink)" }}>{item.description}</p>
                  <p style={{ fontSize: ".78rem", color: "var(--muted)", marginTop: "4px" }}>
                    {item.quantity} x {formatCents(item.unitPriceCents)}
                  </p>
                </div>
                <p style={{ fontWeight: 700, color: "var(--ink)" }}>{formatCents(item.quantity * item.unitPriceCents)}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "18px", marginLeft: "auto", width: "min(320px, 100%)", display: "grid", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: ".86rem" }}>
            <span>Line item subtotal</span>
            <span>{formatCents(lineSubtotal)}</span>
          </div>

          {invoice.quote ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: ".86rem" }}>
                <span>Discount</span>
                <span>-{formatCents(invoice.quote.discountCents)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: ".86rem" }}>
                <span>Tax</span>
                <span>{formatCents(invoice.quote.taxCents)}</span>
              </div>
              <div style={{ borderTop: "1px solid var(--border)", marginTop: "2px", paddingTop: "10px", display: "flex", justifyContent: "space-between", fontWeight: 700, color: "var(--ink)" }}>
                <span>Total</span>
                <span>{formatCents(invoice.quote.totalCents)}</span>
              </div>
            </>
          ) : (
            <div style={{ borderTop: "1px solid var(--border)", marginTop: "2px", paddingTop: "10px", display: "flex", justifyContent: "space-between", fontWeight: 700, color: "var(--ink)" }}>
              <span>Total</span>
              <span>{invoice.amount}</span>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
