import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { updateSupportItemAction } from "@/app/portal/admin/actions";
import { REQUEST_PURPOSE_DEFINITIONS, getRequestPurposeDefinition, SUPPORT_CLOSED_SUB_STATUSES, SUPPORT_ON_HOLD_SUB_STATUSES, SUPPORT_STATUSES } from "@/lib/portal-constants";
import { inputStyle, selectStyle, labelStyle } from "@/components/form-styles";

export const metadata: Metadata = { title: "Edit Support Item — Admin" };

const REQUEST_CATEGORIES = [
  "General",
  "Websites",
  "Web Apps",
  "Custom Software",
  "Data Analytics",
  "Hardware & IT",
  "Not sure yet",
] as const;

export default async function EditSupportItemPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [item, projects] = await Promise.all([
    prisma.supportItem.findUnique({ where: { id } }),
    prisma.project.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!item) notFound();

  const action = updateSupportItemAction.bind(null, item.id);
  const purposeDef = getRequestPurposeDefinition(item.purposeId, item.purpose);
  const queueCategory = (item.queueCategory ?? purposeDef.queueCategory).trim().toUpperCase();
  const backHref = queueCategory === "CHANGE"
    ? "/portal/admin/changes"
    : queueCategory === "REQUEST"
      ? "/portal/admin/requests"
      : "/portal/admin/support";

  return (
    <section style={{ maxWidth: "560px" }}>
      <Link href={backHref} style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
        ← Queue items
      </Link>
      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px", marginBottom: "28px" }}>
        Edit support item
      </h2>

      <form action={action} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label htmlFor="title" style={labelStyle}>Title</label>
          <input id="title" name="title" required defaultValue={item.title} style={inputStyle} />
        </div>
        <div>
          <label htmlFor="detail" style={labelStyle}>Detail</label>
          <textarea id="detail" name="detail" required rows={4} defaultValue={item.detail} style={{ ...inputStyle, resize: "vertical" }} />
        </div>
        <div>
          <label htmlFor="category" style={labelStyle}>Request type</label>
          <select id="category" name="category" required defaultValue={item.category ?? "General"} style={selectStyle}>
            {!REQUEST_CATEGORIES.includes((item.category ?? "General") as (typeof REQUEST_CATEGORIES)[number]) ? (
              <option value={item.category}>{item.category}</option>
            ) : null}
            {REQUEST_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" style={labelStyle}>Status</label>
          <select id="status" name="status" required defaultValue={item.status ?? "Open"} style={selectStyle}>
            {!SUPPORT_STATUSES.includes((item.status ?? "Open") as (typeof SUPPORT_STATUSES)[number]) && (
              <option value={item.status ?? "Open"}>{item.status ?? "Open"}</option>
            )}
            {SUPPORT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="subStatus" style={labelStyle}>Status sub-status (optional)</label>
          <select id="subStatus" name="subStatus" defaultValue={item.subStatus ?? ""} style={selectStyle}>
            <option value="">— None —</option>
            {item.subStatus && !SUPPORT_CLOSED_SUB_STATUSES.includes(item.subStatus as (typeof SUPPORT_CLOSED_SUB_STATUSES)[number]) && !SUPPORT_ON_HOLD_SUB_STATUSES.includes(item.subStatus as (typeof SUPPORT_ON_HOLD_SUB_STATUSES)[number]) ? (
              <option value={item.subStatus}>{item.subStatus}</option>
            ) : null}
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
          <select id="purposeId" name="purposeId" required defaultValue={purposeDef.id} style={selectStyle}>
            {REQUEST_PURPOSE_DEFINITIONS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="projectId" style={labelStyle}>Link to project (optional)</label>
          <select id="projectId" name="projectId" defaultValue={item.projectId ?? ""} style={selectStyle}>
            <option value="">— No project —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: "12px", paddingTop: "4px" }}>
          <button type="submit" className="btn-primary" style={{ borderRadius: "999px", padding: "10px 28px", fontSize: ".875rem" }}>
            Save changes
          </button>
          <Link href="/portal/admin/support" style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", color: "var(--muted)", textDecoration: "none" }}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
