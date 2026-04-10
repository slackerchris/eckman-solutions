import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { updateProjectAction } from "@/app/portal/admin/actions";
import { SERVICE_TYPES, PROJECT_STATUSES } from "@/lib/portal-constants";

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

const selectStyle = {
  ...inputStyle,
  appearance: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23888' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 12px center",
  backgroundSize: "20px",
  paddingRight: "40px",
  cursor: "pointer",
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
  const [project, clients] = await Promise.all([
    prisma.project.findUnique({ where: { id } }),
    prisma.user.findMany({ where: { role: "CLIENT" }, orderBy: { name: "asc" } }),
  ]);
  if (!project) notFound();

  const action = updateProjectAction.bind(null, project.id);

  return (
    <section style={{ maxWidth: "640px" }}>
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
          <label htmlFor="type" style={labelStyle}>Service type</label>
          <select id="type" name="type" required defaultValue={project.type} style={selectStyle}>
            {!SERVICE_TYPES.includes(project.type as (typeof SERVICE_TYPES)[number]) && (
              <option value={project.type}>{project.type}</option>
            )}
            {SERVICE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" style={labelStyle}>Status</label>
          <select id="status" name="status" required defaultValue={project.status} style={selectStyle}>
            {!PROJECT_STATUSES.includes(project.status as (typeof PROJECT_STATUSES)[number]) && (
              <option value={project.status}>{project.status}</option>
            )}
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="userId" style={labelStyle}>Assign to client (optional)</label>
          <select id="userId" name="userId" defaultValue={project.userId ?? ""} style={selectStyle}>
            <option value="">— Unassigned —</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
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
