import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Request Details — Portal" };

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;
  const isAdmin = session.role === "ADMIN";

  const item = await prisma.supportItem.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, name: true, userId: true } },
    },
  });

  if (!item) notFound();

  if (!isAdmin) {
    const ownsByProject = Boolean(item.project && item.project.userId === session.userId);
    const ownsByRequest = item.userId === session.userId;
    if (!ownsByProject && !ownsByRequest) {
      notFound();
    }
  }

  return (
    <section style={{ maxWidth: "760px" }}>
      <Link
        href={isAdmin ? (item.projectId ? "/portal/admin/support" : "/portal/admin/requests") : (item.projectId ? "/portal/projects" : "/portal")}
        style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}
      >
        ← {isAdmin ? "Queue" : (item.projectId ? "Projects" : "Dashboard")}
      </Link>

      <h2
        style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px", marginBottom: "16px" }}
      >
        {item.title}
      </h2>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <span style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "4px 12px", fontSize: ".75rem", color: "var(--muted)" }}>
          {item.status ?? "Open"}
        </span>
        <span style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "4px 12px", fontSize: ".75rem", color: "var(--muted)" }}>
          {item.purpose ?? "General Question"}
        </span>
        <span style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "4px 12px", fontSize: ".75rem", color: "var(--muted)" }}>
          {item.category ?? "General"}
        </span>
        <span style={{ fontSize: ".75rem", color: "var(--muted)" }}>
          Created {new Date(item.createdAt).toLocaleDateString()}
        </span>
      </div>

      {item.project ? (
        <p style={{ fontSize: ".875rem", color: "var(--muted)", marginBottom: "16px" }}>
          Linked project: <strong style={{ color: "var(--ink)" }}>{item.project.name}</strong>
        </p>
      ) : null}

      <article style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "20px 24px" }}>
        <p style={{ fontSize: ".95rem", color: "var(--muted)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{item.detail}</p>
      </article>

      {isAdmin ? (
        <div style={{ marginTop: "18px" }}>
          <Link
            href={`/portal/admin/support/${item.id}/edit`}
            className="btn-primary"
            style={{ borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", textDecoration: "none", display: "inline-block" }}
          >
            Edit request
          </Link>
        </div>
      ) : null}
    </section>
  );
}
