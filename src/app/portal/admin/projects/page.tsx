import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { deleteProjectAction } from "@/app/portal/admin/actions";

export const metadata: Metadata = { title: "Projects — Admin" };

export default async function AdminProjectsPage() {
  await requireAdmin();
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <section className="wrap" style={{ padding: "40px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
        <div>
          <Link href="/portal/admin" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
            ← Admin
          </Link>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px" }}>
            Projects
          </h2>
        </div>
        <Link
          href="/portal/admin/projects/new"
          className="btn-primary"
          style={{ borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", textDecoration: "none", display: "inline-block" }}
        >
          + New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: ".95rem" }}>No projects yet. Add one above.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {projects.map((p) => (
            <article
              key={p.id}
              style={{ border: "1px solid var(--border)", borderRadius: "1.25rem", background: "var(--card)", padding: "20px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}
            >
              <div>
                <p style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".16em", color: "var(--accent)" }}>{p.type}</p>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--ink)", marginTop: "4px" }}>{p.name}</h3>
                <p style={{ fontSize: ".825rem", color: "var(--muted)", marginTop: "4px" }}>
                  <span style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "2px 10px", marginRight: "8px" }}>{p.status}</span>
                  {p.url && <span>{p.url}</span>}
                </p>
                {p.notes && <p style={{ fontSize: ".825rem", color: "var(--muted)", marginTop: "6px" }}>{p.notes}</p>}
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <Link
                  href={`/portal/admin/projects/${p.id}/edit`}
                  style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 16px", fontSize: ".8rem", color: "var(--ink)", background: "transparent", textDecoration: "none" }}
                >
                  Edit
                </Link>
                <form action={deleteProjectAction.bind(null, p.id)}>
                  <button
                    type="submit"
                    style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 16px", fontSize: ".8rem", color: "var(--muted)", background: "transparent", cursor: "pointer" }}
                    onClick={(e) => { if (!confirm("Delete this project?")) e.preventDefault(); }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
