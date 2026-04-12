import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { QUOTE_STATUSES } from "@/lib/portal-constants";
import { createQuoteAction } from "@/app/portal/admin/quotes/actions";

export const metadata: Metadata = { title: "New Quote — Admin" };

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

export default async function NewQuotePage() {
  await requireAdmin();

  const [clients, projects] = await Promise.all([
    prisma.user.findMany({ where: { role: "CLIENT" }, orderBy: { name: "asc" }, select: { id: true, name: true, email: true } }),
    prisma.project.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <section style={{ maxWidth: "760px" }}>
      <Link href="/portal/admin/quotes" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
        ← Quotes
      </Link>
      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px", marginBottom: "28px" }}>
        New quote
      </h2>

      <form action={createQuoteAction} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label htmlFor="label" style={labelStyle}>Quote label</label>
          <input id="label" name="label" required style={inputStyle} placeholder="Website redesign and analytics setup" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          <div>
            <label htmlFor="status" style={labelStyle}>Status</label>
            <select id="status" name="status" required defaultValue="Draft" style={selectStyle}>
              {QUOTE_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="validUntil" style={labelStyle}>Valid until (optional)</label>
            <input id="validUntil" name="validUntil" type="date" style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          <div>
            <label htmlFor="userId" style={labelStyle}>Client (optional)</label>
            <select id="userId" name="userId" style={selectStyle}>
              <option value="">— No client —</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name} ({client.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="projectId" style={labelStyle}>Project (optional)</label>
            <select id="projectId" name="projectId" style={selectStyle}>
              <option value="">— No project —</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="lineItems" style={labelStyle}>Line items</label>
          <textarea
            id="lineItems"
            name="lineItems"
            required
            rows={8}
            style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: ".9rem" }}
            placeholder={`Design and planning | 1 | 850.00\nWebsite implementation | 1 | 2400.00\nAnalytics dashboard setup | 1 | 600.00`}
          />
          <p style={{ marginTop: "6px", fontSize: ".78rem", color: "var(--muted)" }}>
            One item per line: Description | Qty | Unit price
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          <div>
            <label htmlFor="discount" style={labelStyle}>Discount (optional)</label>
            <input id="discount" name="discount" style={inputStyle} defaultValue="0" placeholder="0.00" />
          </div>
          <div>
            <label htmlFor="tax" style={labelStyle}>Tax % (optional)</label>
            <input id="tax" name="tax" style={inputStyle} defaultValue="0" placeholder="8.25" />
          </div>
        </div>

        <div>
          <label htmlFor="notes" style={labelStyle}>Notes (optional)</label>
          <textarea id="notes" name="notes" rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Payment terms, scope notes, assumptions..." />
        </div>

        <div style={{ display: "flex", gap: "12px", paddingTop: "4px" }}>
          <button type="submit" className="btn-primary" style={{ borderRadius: "999px", padding: "10px 28px", fontSize: ".875rem" }}>
            Create quote
          </button>
          <Link href="/portal/admin/quotes" style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", color: "var(--muted)", textDecoration: "none" }}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
