import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { createSupportItemAction } from "@/app/portal/admin/actions";
import { REQUEST_PURPOSE_DEFINITIONS, SUPPORT_CLOSED_SUB_STATUSES, SUPPORT_ON_HOLD_SUB_STATUSES, SUPPORT_STATUSES } from "@/lib/portal-constants";
import { inputStyle, selectStyle, labelStyle } from "@/components/form-styles";

export const metadata: Metadata = { title: "New Support Item — Admin" };

const REQUEST_CATEGORIES = [
  "General",
  "Websites",
  "Web Apps",
  "Custom Software",
  "Data Analytics",
  "Hardware & IT",
  "Not sure yet",
] as const;

export default async function NewSupportItemPage() {
  await requireAdmin();
  const projects = await prisma.project.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <section style={{ maxWidth: "560px" }}>
      <Link href="/portal/admin/support" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
        ← Support items
      </Link>
      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px", marginBottom: "28px" }}>
        New support item
      </h2>

      <form action={createSupportItemAction} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label htmlFor="title" style={labelStyle}>Title</label>
          <input id="title" name="title" required style={inputStyle} placeholder="Content update request" />
        </div>
        <div>
          <label htmlFor="detail" style={labelStyle}>Detail</label>
          <textarea id="detail" name="detail" required rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder="Describe the support request..." />
        </div>
        <div>
          <label htmlFor="category" style={labelStyle}>Request type</label>
          <select id="category" name="category" required defaultValue="General" style={selectStyle}>
            {REQUEST_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" style={labelStyle}>Status</label>
          <select id="status" name="status" required style={selectStyle}>
            {SUPPORT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="subStatus" style={labelStyle}>Status sub-status (optional)</label>
          <select id="subStatus" name="subStatus" defaultValue="" style={selectStyle}>
            <option value="">— None —</option>
            <optgroup label="On Hold">
              {SUPPORT_ON_HOLD_SUB_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </optgroup>
            <optgroup label="Closed">
              {SUPPORT_CLOSED_SUB_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </optgroup>
          </select>
        </div>
        <div>
          <label htmlFor="purposeId" style={labelStyle}>Purpose</label>
          <select id="purposeId" name="purposeId" required defaultValue="SUPPORT_TICKET" style={selectStyle}>
            {REQUEST_PURPOSE_DEFINITIONS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="projectId" style={labelStyle}>Link to project (optional)</label>
          <select id="projectId" name="projectId" style={selectStyle}>
            <option value="">— No project —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: "12px", paddingTop: "4px" }}>
          <button type="submit" className="btn-primary" style={{ borderRadius: "999px", padding: "10px 28px", fontSize: ".875rem" }}>
            Create item
          </button>
          <Link href="/portal/admin/support" style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", color: "var(--muted)", textDecoration: "none" }}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
