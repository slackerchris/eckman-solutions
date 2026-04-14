import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/quotes";
import { acceptQuoteAction, declineQuoteAction } from "@/app/portal/quotes/actions";

export const metadata: Metadata = { title: "Quote Details — Portal" };

export default async function ClientQuoteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const session = await requireSession();
  if (session.role === "ADMIN") {
    redirect("/portal/admin/quotes");
  }

  const { id } = await params;
  const query = await searchParams;
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true } },
      project: { select: { id: true, name: true, userId: true } },
      lineItems: { orderBy: { position: "asc" } },
    },
  });

  if (!quote) {
    notFound();
  }

  const ownsByUser = quote.userId === session.userId;
  const ownsByProject = Boolean(quote.project && quote.project.userId === session.userId);
  if (!ownsByUser && !ownsByProject) {
    notFound();
  }

  if (quote.status === "Draft") {
    notFound();
  }

  const canRespond = quote.status === "Sent";

  return (
    <section style={{ maxWidth: "860px" }}>
      <Link href="/portal/quotes" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
        ← Quotes
      </Link>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginTop: "6px", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)" }}>
          {quote.label}
        </h2>
        <span style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "4px 12px", fontSize: ".8rem", color: "var(--muted)" }}>
          {quote.status}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "22px", color: "var(--muted)", fontSize: ".85rem" }}>
        <span>Issued {quote.createdAt.toLocaleDateString()}</span>
        {quote.validUntil ? <span>• Valid until {quote.validUntil.toLocaleDateString()}</span> : null}
        {quote.project ? <span>• Project: {quote.project.name}</span> : null}
        {quote.workstream ? <span>• Workstream: {quote.workstream}</span> : null}
        {quote.user ? <span>• Client: {quote.user.name}</span> : null}
      </div>

      {query.message ? (
        <p style={{ marginBottom: "14px", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, .35)", background: "rgba(16, 185, 129, .12)", padding: "10px 12px", fontSize: ".85rem", color: "#047857" }}>
          {query.message}
        </p>
      ) : null}

      {query.error ? (
        <p style={{ marginBottom: "14px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, .35)", background: "rgba(239, 68, 68, .12)", padding: "10px 12px", fontSize: ".85rem", color: "#b91c1c" }}>
          {query.error}
        </p>
      ) : null}

      {canRespond ? (
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "16px" }}>
          <form action={acceptQuoteAction.bind(null, quote.id)}>
            <button type="submit" className="btn-primary" style={{ borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem" }}>
              Accept quote
            </button>
          </form>
          <form action={declineQuoteAction.bind(null, quote.id)}>
            <button
              type="submit"
              style={{ border: "1px solid rgba(239, 68, 68, .4)", background: "rgba(239, 68, 68, .06)", color: "#b91c1c", borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", cursor: "pointer" }}
            >
              Decline quote
            </button>
          </form>
        </div>
      ) : null}

      <article style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "20px 22px" }}>
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
    </section>
  );
}
