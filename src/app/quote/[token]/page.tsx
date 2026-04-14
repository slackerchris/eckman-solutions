import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/quotes";

export const metadata: Metadata = {
  title: "Quote",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PublicQuotePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const quote = await prisma.quote.findUnique({
    where: { publicToken: token },
    include: {
      user: { select: { name: true } },
      project: { select: { name: true } },
      lineItems: { orderBy: { position: "asc" } },
    },
  });

  if (!quote) {
    notFound();
  }

  if (quote.status === "Draft") {
    notFound();
  }

  const isExpired = Boolean(quote.validUntil && quote.validUntil < new Date());

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)", padding: "40px 18px" }}>
      <section style={{ maxWidth: "840px", margin: "0 auto", border: "1px solid var(--border)", borderRadius: "1.5rem", background: "var(--card)", padding: "28px 24px" }}>
        <p style={{ fontFamily: "monospace", fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".16em", color: "var(--accent)" }}>
          Eckman Solutions
        </p>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginTop: "8px" }}>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)" }}>
            {quote.label}
          </h1>
          <span style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "5px 12px", fontSize: ".8rem", color: "var(--muted)" }}>
            {quote.status}
          </span>
        </div>

        <p style={{ marginTop: "10px", color: "var(--muted)", fontSize: ".86rem" }}>
          This secure quote link can be viewed without logging in.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginTop: "12px", color: "var(--muted)", fontSize: ".84rem" }}>
          <span>Issued {quote.createdAt.toLocaleDateString()}</span>
          {quote.validUntil ? <span>• Valid until {quote.validUntil.toLocaleDateString()}</span> : null}
          {quote.user ? <span>• For {quote.user.name}</span> : null}
          {quote.project ? <span>• Project: {quote.project.name}</span> : null}
          {quote.workstream ? <span>• Workstream: {quote.workstream}</span> : null}
        </div>

        {isExpired ? (
          <p style={{ marginTop: "12px", border: "1px solid rgba(245, 158, 11, .35)", background: "rgba(245, 158, 11, .14)", color: "#b45309", borderRadius: ".8rem", padding: "10px 12px", fontSize: ".85rem" }}>
            This quote is past its validity date.
          </p>
        ) : null}

        <article style={{ marginTop: "20px", border: "1px solid var(--border)", borderRadius: "1rem", padding: "16px 18px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {quote.lineItems.map((item) => (
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

          <div style={{ marginTop: "18px", marginLeft: "auto", width: "min(320px, 100%)", display: "grid", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: ".86rem" }}>
              <span>Subtotal</span>
              <span>{formatCents(quote.subtotalCents)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: ".86rem" }}>
              <span>Discount</span>
              <span>-{formatCents(quote.discountCents)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: ".86rem" }}>
              <span>Tax</span>
              <span>{formatCents(quote.taxCents)}</span>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", marginTop: "2px", paddingTop: "10px", display: "flex", justifyContent: "space-between", fontWeight: 700, color: "var(--ink)" }}>
              <span>Total</span>
              <span>{formatCents(quote.totalCents)}</span>
            </div>
          </div>

          {quote.notes ? (
            <div style={{ marginTop: "20px", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
              <p style={{ fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)", marginBottom: "8px" }}>
                Notes
              </p>
              <p style={{ fontSize: ".9rem", color: "var(--muted)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{quote.notes}</p>
            </div>
          ) : null}
        </article>

        <p style={{ marginTop: "18px", fontSize: ".8rem", color: "var(--muted)" }}>
          Questions? Contact us through the portal or by email.
        </p>

        <Link href="/portal/login" style={{ marginTop: "14px", display: "inline-block", color: "var(--accent)", textDecoration: "none", fontSize: ".85rem", fontWeight: 600 }}>
          Portal login
        </Link>
      </section>
    </main>
  );
}
