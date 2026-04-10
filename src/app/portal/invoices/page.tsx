import type { Metadata } from "next";
import Link from "next/link";

import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Invoices — Eckman Solutions Portal" };

export default async function ClientInvoicesPage() {
  const session = await requireSession();
  const isAdmin = session.role === "ADMIN";

  const invoices = await prisma.invoice.findMany({
    where: isAdmin ? undefined : { project: { userId: session.userId } },
    orderBy: { createdAt: "desc" },
    include: { project: { select: { name: true } } },
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
          {invoices.map((inv) => (
            <article
              key={inv.id}
              style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "18px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}
            >
              <div>
                <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)" }}>{inv.label}</p>
                {inv.project && (
                  <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: "2px" }}>{inv.project.name}</p>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
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
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
