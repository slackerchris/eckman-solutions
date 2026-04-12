import type { Metadata } from "next";
import Link from "next/link";

import { requireSession } from "@/lib/auth/session";
import { buildClientPaymentUrl } from "@/lib/client-payment";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Invoices — Eckman Solutions Portal" };

export default async function ClientInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const query = await searchParams;
  const paymentBaseUrl = process.env.NEXT_PUBLIC_CLIENT_PAYMENT_URL?.trim();
  const session = await requireSession();
  const isAdmin = session.role === "ADMIN";

  const invoices = await prisma.invoice.findMany({
    where: isAdmin
      ? undefined
      : {
          status: { notIn: ["Draft", "draft"] },
          OR: [
            { project: { userId: session.userId } },
            { quote: { userId: session.userId } },
          ],
        },
    orderBy: { createdAt: "desc" },
    include: {
      project: { select: { name: true } },
      quote: { select: { id: true } },
      lineItems: { select: { id: true } },
    },
  });

  const totalPaid = invoices
    .filter((i) => i.status.toLowerCase() === "paid")
    .length;
  const totalDue = invoices
    .filter((i) => ["sent", "overdue"].includes(i.status.toLowerCase()))
    .length;

  return (
    <section style={{ padding: "0" }}>
      <Link href="/portal" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
        ← Dashboard
      </Link>
      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px", marginBottom: "28px" }}>
        {isAdmin ? "All invoices" : "Your invoices"}
      </h2>

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

      {invoices.length > 0 && (
        <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
          <div style={{ border: "1px solid var(--border)", borderRadius: "1rem", background: "var(--card)", padding: "16px 20px", minWidth: "140px" }}>
            <p style={{ fontFamily: "monospace", fontSize: ".65rem", textTransform: "uppercase", letterSpacing: ".16em", color: "var(--muted)" }}>Paid</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "4px" }}>{totalPaid}</p>
          </div>
          <div style={{ border: "1px solid var(--border)", borderRadius: "1rem", background: "var(--card)", padding: "16px 20px", minWidth: "140px" }}>
            <p style={{ fontFamily: "monospace", fontSize: ".65rem", textTransform: "uppercase", letterSpacing: ".16em", color: "var(--muted)" }}>Outstanding</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "4px", color: totalDue > 0 ? "var(--accent)" : "inherit" }}>{totalDue}</p>
          </div>
        </div>
      )}

      {invoices.length === 0 ? (
        <div style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "40px 32px", textAlign: "center" }}>
          <p style={{ color: "var(--muted)", fontSize: ".95rem" }}>No invoices yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {invoices.map((inv) => {
            const payUrl = buildClientPaymentUrl(paymentBaseUrl, {
              invoiceId: inv.id,
              amount: inv.amount,
              status: inv.status,
              label: inv.label,
              workstream: inv.workstream,
              projectName: inv.project?.name,
            });

            return (
            <article
              key={inv.id}
              style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "18px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}
            >
              <div>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)" }}>{inv.label}</p>
                {inv.project && (
                  <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: "2px" }}>{inv.project.name}</p>
                )}
                {inv.workstream && (
                  <p style={{ fontSize: ".78rem", color: "var(--muted)", marginTop: "2px" }}>Workstream: {inv.workstream}</p>
                )}
                <p style={{ marginTop: "4px", fontSize: ".76rem", color: "var(--muted)" }}>
                  {inv.lineItems.length} item{inv.lineItems.length !== 1 ? "s" : ""}
                </p>
                {!isAdmin && (
                  <Link href={`/portal/invoices/${inv.id}`} style={{ marginTop: "6px", display: "inline-block", fontSize: ".78rem", color: "var(--accent)", textDecoration: "none" }}>
                    View invoice details
                  </Link>
                )}
                {!isAdmin && inv.quote && (
                  <Link href={`/portal/quotes/${inv.quote.id}`} style={{ marginTop: "6px", display: "inline-block", fontSize: ".78rem", color: "var(--accent)", textDecoration: "none" }}>
                    View linked quote
                  </Link>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <p style={{ fontSize: ".95rem", fontWeight: 700 }}>{inv.amount}</p>
                <span
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "999px",
                    padding: "3px 12px",
                    fontSize: ".8rem",
                    color: inv.status.toLowerCase() === "paid" ? "#27ae60" : inv.status.toLowerCase() === "overdue" ? "#c0392b" : "var(--muted)",
                  }}
                >
                  {inv.status}
                </span>
                {!isAdmin && ["sent", "overdue"].includes(inv.status.toLowerCase()) ? (
                  payUrl ? (
                    <a
                      href={payUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 12px", fontSize: ".78rem", color: "var(--muted)", background: "transparent", textDecoration: "none" }}
                    >
                      Pay now
                    </a>
                  ) : (
                    <a
                      href="#"
                      style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 12px", fontSize: ".78rem", color: "var(--muted)", background: "transparent", textDecoration: "none" }}
                    >
                      Pay now
                    </a>
                  )
                ) : null}
              </div>
            </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
