import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/quotes";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import {
  convertQuoteToInvoiceAction,
  convertQuoteToProjectAction,
  createQuoteShareLinkAction,
  deleteQuoteAction,
  emailQuoteShareLinkAction,
} from "@/app/portal/admin/quotes/actions";

export const metadata: Metadata = { title: "Quotes — Admin" };

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      project: { select: { id: true, name: true } },
      lineItems: { select: { id: true } },
      invoices: { select: { id: true } },
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
            Quotes
          </h2>
        </div>
        <Link href="/portal/admin/quotes/new" className="btn-primary" style={{ borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", textDecoration: "none", display: "inline-block" }}>
          + New quote
        </Link>
      </div>

      {params.message ? (
        <p style={{ marginBottom: "16px", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, .35)", background: "rgba(16, 185, 129, .12)", padding: "10px 12px", fontSize: ".85rem", color: "#047857", wordBreak: "break-word" }}>
          {params.message}
        </p>
      ) : null}

      {params.error ? (
        <p style={{ marginBottom: "16px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, .35)", background: "rgba(239, 68, 68, .12)", padding: "10px 12px", fontSize: ".85rem", color: "#b91c1c" }}>
          {params.error}
        </p>
      ) : null}

      {quotes.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: ".95rem" }}>No quotes yet. Add one above.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {quotes.map((quote) => (
            <article key={quote.id} style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "20px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)" }}>{quote.label}</p>
                <p style={{ fontSize: ".875rem", color: "var(--muted)", marginTop: "4px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span>{formatCents(quote.totalCents)}</span>
                  <span style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "2px 10px" }}>{quote.status}</span>
                  <span>{quote.lineItems.length} line item{quote.lineItems.length !== 1 ? "s" : ""}</span>
                </p>
                <p style={{ fontSize: ".78rem", color: "var(--muted)", marginTop: "6px" }}>
                  {quote.user ? `Client: ${quote.user.name}` : "No client linked"}
                  {quote.project ? ` • Project: ${quote.project.name}` : ""}
                  {quote.invoices.length > 0 ? " • Invoice created" : ""}
                </p>
                {quote.publicToken ? (
                  <p style={{ fontSize: ".74rem", marginTop: "6px", color: "var(--muted)", wordBreak: "break-all" }}>
                    Public link: <Link href={`/quote/${quote.publicToken}`} style={{ color: "var(--accent)" }}>{`${baseUrl}/quote/${quote.publicToken}`}</Link>
                  </p>
                ) : null}
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <Link href={`/portal/admin/quotes/${quote.id}/edit`} style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 14px", fontSize: ".8rem", color: "var(--ink)", background: "transparent", textDecoration: "none" }}>
                  Edit
                </Link>
                <form action={createQuoteShareLinkAction.bind(null, quote.id)}>
                  <button type="submit" style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 14px", fontSize: ".8rem", color: "var(--muted)", background: "transparent", cursor: "pointer" }}>
                    {quote.publicToken ? "Share link" : "Create link"}
                  </button>
                </form>
                <form action={emailQuoteShareLinkAction.bind(null, quote.id)}>
                  <button type="submit" style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 14px", fontSize: ".8rem", color: "var(--muted)", background: "transparent", cursor: "pointer" }}>
                    Email link
                  </button>
                </form>
                <form action={convertQuoteToProjectAction.bind(null, quote.id)}>
                  <button type="submit" style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 14px", fontSize: ".8rem", color: "var(--muted)", background: "transparent", cursor: "pointer" }}>
                    To project
                  </button>
                </form>
                <form action={convertQuoteToInvoiceAction.bind(null, quote.id)}>
                  <button type="submit" style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 14px", fontSize: ".8rem", color: "var(--muted)", background: "transparent", cursor: "pointer" }}>
                    To invoice
                  </button>
                </form>
                <ConfirmDeleteButton
                  action={deleteQuoteAction.bind(null, quote.id)}
                  message="Delete this quote?"
                  style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 14px", fontSize: ".8rem", color: "var(--muted)", background: "transparent", cursor: "pointer" }}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
