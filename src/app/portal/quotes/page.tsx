import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/quotes";

export const metadata: Metadata = { title: "Your Quotes — Portal" };

export default async function ClientQuotesPage() {
  const session = await requireSession();
  if (session.role === "ADMIN") {
    redirect("/portal/admin/quotes");
  }

  const quotes = await prisma.quote.findMany({
    where: {
      status: { not: "Draft" },
      OR: [
        { userId: session.userId },
        { project: { userId: session.userId } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      project: { select: { id: true, name: true } },
      lineItems: { select: { id: true } },
    },
  });

  return (
    <section style={{ padding: "0" }}>
      <Link href="/portal" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
        ← Dashboard
      </Link>

      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px", marginBottom: "28px" }}>
        Your quotes
      </h2>

      {quotes.length === 0 ? (
        <div style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "40px 32px", textAlign: "center" }}>
          <p style={{ color: "var(--muted)", fontSize: ".95rem" }}>No quotes yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {quotes.map((quote) => (
            <Link
              key={quote.id}
              href={`/portal/quotes/${quote.id}`}
              style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "18px 22px", textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)" }}>{quote.label}</p>
                  <p style={{ fontSize: ".82rem", color: "var(--muted)", marginTop: "4px" }}>
                    {quote.project ? `Project: ${quote.project.name}` : "General quote"}
                    {quote.workstream ? ` • Workstream: ${quote.workstream}` : ""}
                    {quote.validUntil ? ` • Valid until ${quote.validUntil.toLocaleDateString()}` : ""}
                  </p>
                </div>
                <div style={{ textAlign: "right", minWidth: "170px" }}>
                  <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink)" }}>{formatCents(quote.totalCents)}</p>
                  <p style={{ fontSize: ".78rem", color: "var(--muted)", marginTop: "4px" }}>
                    {quote.status} • {quote.lineItems.length} line item{quote.lineItems.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
