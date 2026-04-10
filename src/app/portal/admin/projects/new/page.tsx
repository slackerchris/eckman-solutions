import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { createProjectAction } from "@/app/portal/admin/actions";

export const metadata: Metadata = { title: "New Project — Admin" };

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

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <section className="wrap" style={{ padding: "40px 0", maxWidth: "640px" }}>
      <Link href="/portal/admin/projects" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
        ← Projects
      </Link>
      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px", marginBottom: "28px" }}>
        New project
      </h2>

      <form action={createProjectAction} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label htmlFor="name" style={labelStyle}>Name</label>
          <input id="name" name="name" required style={inputStyle} placeholder="Main marketing website" />
        </div>
        <div>
          <label htmlFor="type" style={labelStyle}>Type</label>
          <input id="type" name="type" required style={inputStyle} placeholder="Website refresh" />
        </div>
        <div>
          <label htmlFor="status" style={labelStyle}>Status</label>
          <input id="status" name="status" required style={inputStyle} placeholder="In progress" />
        </div>
        <div>
          <label htmlFor="url" style={labelStyle}>URL (optional)</label>
          <input id="url" name="url" style={inputStyle} placeholder="https://example.com" />
        </div>
        <div>
          <label htmlFor="notes" style={labelStyle}>Notes (optional)</label>
          <textarea id="notes" name="notes" rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Any relevant notes..." />
        </div>
        <div style={{ display: "flex", gap: "12px", paddingTop: "4px" }}>
          <button type="submit" className="btn-primary" style={{ borderRadius: "999px", padding: "10px 28px", fontSize: ".875rem" }}>
            Create project
          </button>
          <Link href="/portal/admin/projects" style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", color: "var(--muted)", textDecoration: "none" }}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
