import type { Metadata } from "next";
import Link from "next/link";

import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Projects — Eckman Solutions Portal" };

export default async function ClientProjectsPage() {
  const session = await requireSession();
  const isAdmin = session.role === "ADMIN";

  const projects = await prisma.project.findMany({
    where: isAdmin ? undefined : { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: {
      invoices: { orderBy: { createdAt: "desc" } },
      supportItems: { orderBy: { createdAt: "desc" } },
    },
  });

  return (
    <section className="wrap" style={{ padding: "40px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
        <div>
          <Link href="/portal" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
            ← Dashboard
          </Link>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px" }}>
            {isAdmin ? "All projects" : "Your projects"}
          </h2>
        </div>
        <Link
          href="/portal/requests/new"
          className="btn-primary"
          style={{ borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", textDecoration: "none", display: "inline-block" }}
        >
          + New request
        </Link>
      </div>

      {projects.length === 0 ? (
        <div style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "40px 32px", textAlign: "center" }}>
          <p style={{ color: "var(--muted)", fontSize: ".95rem" }}>No projects have been assigned yet.</p>
          <p style={{ color: "var(--muted)", fontSize: ".875rem", marginTop: "8px" }}>
            Have a question?{" "}
            <Link href="/portal/requests/new" style={{ color: "var(--accent)" }}>Submit a request</Link>
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {projects.map((project) => (
            <article
              key={project.id}
              style={{ border: "1px solid var(--border)", borderRadius: "1.5rem", background: "var(--card)", padding: "24px 28px" }}
            >
              {/* Project header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <p style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".16em", color: "var(--accent)" }}>
                    {project.type}
                  </p>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--ink)", marginTop: "4px" }}>{project.name}</h3>
                </div>
                <span style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "4px 14px", fontSize: ".825rem", color: "var(--muted)", whiteSpace: "nowrap" as const }}>
                  {project.status}
                </span>
              </div>

              {project.notes && (
                <p style={{ fontSize: ".875rem", color: "var(--muted)", marginTop: "12px", lineHeight: 1.7 }}>{project.notes}</p>
              )}
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block", marginTop: "8px", fontSize: ".875rem", color: "var(--accent)", textDecoration: "none" }}
                >
                  {project.url} ↗
                </a>
              )}

              {/* Invoices */}
              {project.invoices.length > 0 && (
                <div style={{ marginTop: "20px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                  <p style={{ fontFamily: "monospace", fontSize: ".65rem", textTransform: "uppercase", letterSpacing: ".16em", color: "var(--muted)", marginBottom: "10px" }}>
                    Invoices
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {project.invoices.map((inv) => (
                      <div
                        key={inv.id}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", border: "1px solid var(--border)", borderRadius: ".875rem", padding: "10px 14px" }}
                      >
                        <p style={{ fontSize: ".875rem", fontWeight: 600, color: "var(--ink)" }}>{inv.label}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                          <span style={{ fontSize: ".875rem", fontWeight: 600 }}>{inv.amount}</span>
                          <span style={{ fontSize: ".8rem", color: "var(--accent)" }}>{inv.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Support requests */}
              <div style={{ marginTop: "20px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <p style={{ fontFamily: "monospace", fontSize: ".65rem", textTransform: "uppercase", letterSpacing: ".16em", color: "var(--muted)" }}>
                    Requests {project.supportItems.length > 0 ? `(${project.supportItems.length})` : ""}
                  </p>
                  <Link
                    href={`/portal/requests/new?project=${project.id}`}
                    style={{ fontFamily: "monospace", fontSize: ".65rem", textTransform: "uppercase", letterSpacing: ".12em", color: "var(--accent)", textDecoration: "none" }}
                  >
                    + Add request
                  </Link>
                </div>
                {project.supportItems.length === 0 ? (
                  <p style={{ fontSize: ".825rem", color: "var(--muted)" }}>No requests for this project yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {project.supportItems.map((req) => (
                      <div
                        key={req.id}
                        style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", border: "1px solid var(--border)", borderRadius: ".875rem", padding: "10px 14px" }}
                      >
                        <div>
                          <p style={{ fontSize: ".875rem", fontWeight: 600, color: "var(--ink)" }}>{req.title}</p>
                          {req.detail && <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: "2px", lineHeight: 1.5 }}>{req.detail}</p>}
                        </div>
                        <span style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "2px 10px", fontSize: ".75rem", color: "var(--muted)", whiteSpace: "nowrap" as const, flexShrink: 0 }}>
                          {req.status ?? "Open"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
