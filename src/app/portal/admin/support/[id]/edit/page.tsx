import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { updateSupportItemAction } from "@/app/portal/admin/actions";

export const metadata: Metadata = { title: "Edit Support Item — Admin" };

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

export default async function EditSupportItemPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const item = await prisma.supportItem.findUnique({ where: { id } });
  if (!item) notFound();

  const action = updateSupportItemAction.bind(null, item.id);

  return (
    <section className="wrap" style={{ padding: "40px 0", maxWidth: "560px" }}>
      <Link href="/portal/admin/support" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
        ← Support items
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
