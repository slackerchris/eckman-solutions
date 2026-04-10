import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { updateProjectAction } from "@/app/portal/admin/actions";

export const metadata: Metadata = { title: "Edit Project — Admin" };

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  fontSize: "1rem",
  border: "1px solid var(--border)",
  borderRadius: ".75rem",
  background: "var(--paper)",
  color: "var(--ink)",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  display: "block",
  fontSize: ".825rem",
  fontWeight: 600,
  color: "var(--muted)",
  marginBottom: "6px",
  textTransform: "uppercase" as const,
  letterSpacing: ".08em",
};

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  const action = updateProjectAction.bind(null, project.id);

  return (
    <section className="wrap" style={{ padding: "40px 0", maxWidth: "640px" }}>
      <Link href="/portal/admin/projects" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
        ← Projects
      </Link>
      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px", marginBottom: "28px" }}>
        Edit project
      </h2>

      <form action={action} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label htmlFor="name" style={labelStyle}>Name</label>
          <input id="name" name="name" required defaultValue={project.name} style={inputStyle} />
        </div>
        <div>
          <label htmlFor="type" style={labelStyle}>Type</label>
          <input id="type" name="type" required defaultValue={project.type} style={inputStyle} />
        </div>
        <div>
          <label htmlFor="status" style={labelStyle}>Status</label>
          <input id="status" name="status" required defaultValue={project.status} style={inputStyle} />
        </div>
        <div>
          <label htmlFor="url" style={labelStyle}>URL (optional)</label>
          <input id="url" name="url" defaultValue={project.url} style={inputStyle} />
        </div>
        <div>
          <label htmlFor="notes" style={labelStyle}>Notes (optional)</label>
          <textarea id="notes" name="notes" rows={3} defaultValue={project.notes} style={{ ...inputStyle, resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", gap: "12px", paddingTop: "4px" }}>
          <button type="submit" className="btn-primary" style={{ borderRadius: "999px", padding: "10px 28px", fontSize: ".875rem" }}>
            Save changes
          </button>
          <Link href="/portal/admin/projects" style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", color: "var(--muted)", textDecoration: "none" }}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
