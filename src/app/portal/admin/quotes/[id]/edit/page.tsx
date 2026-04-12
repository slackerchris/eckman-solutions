import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { lineItemsToText } from "@/lib/quotes";
import { QUOTE_STATUSES } from "@/lib/portal-constants";
import { updateQuoteAction } from "@/app/portal/admin/quotes/actions";
import { QuoteLineItemsField } from "@/components/quote-line-items-field";
import { inputStyle, selectStyle, labelStyle } from "@/components/form-styles";

export const metadata: Metadata = { title: "Edit Quote — Admin" };

export default async function EditQuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const error = query.error;

  const [quote, clients, projects] = await Promise.all([
    prisma.quote.findUnique({
      where: { id },
      include: {
        lineItems: { orderBy: { position: "asc" } },
      },
    }),
    prisma.user.findMany({ where: { role: "CLIENT" }, orderBy: { name: "asc" }, select: { id: true, name: true, email: true } }),
    prisma.project.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!quote) notFound();

  const action = updateQuoteAction.bind(null, quote.id);
  const taxableBaseCents = Math.max(0, quote.subtotalCents - quote.discountCents);
  const taxPercent = taxableBaseCents > 0 ? (quote.taxCents / taxableBaseCents) * 100 : 0;

  return (
    <section style={{ maxWidth: "760px" }}>
      <Link href="/portal/admin/quotes" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
        ← Quotes
      </Link>
      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px", marginBottom: "28px" }}>
        Edit quote
      </h2>

      {error ? (
        <p
          style={{
            color: "#c0392b",
            fontSize: ".875rem",
            background: "rgba(192,57,43,.08)",
            border: "1px solid rgba(192,57,43,.2)",
            borderRadius: ".75rem",
            padding: "12px 16px",
            marginBottom: "16px",
          }}
        >
          {error}
        </p>
      ) : null}

      <form action={action} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label htmlFor="label" style={labelStyle}>Quote label</label>
          <input id="label" name="label" required defaultValue={quote.label} style={inputStyle} />
        </div>

        <div>
          <label htmlFor="workstream" style={labelStyle}>Workstream (optional)</label>
          <input id="workstream" name="workstream" defaultValue={quote.workstream} style={inputStyle} placeholder="Website" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          <div>
            <label htmlFor="status" style={labelStyle}>Status</label>
            <select id="status" name="status" required defaultValue={quote.status} style={selectStyle}>
              {!QUOTE_STATUSES.includes(quote.status as (typeof QUOTE_STATUSES)[number]) && (
                <option value={quote.status}>{quote.status}</option>
              )}
              {QUOTE_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="validUntil" style={labelStyle}>Valid until (optional)</label>
            <input
              id="validUntil"
              name="validUntil"
              type="date"
              defaultValue={quote.validUntil ? quote.validUntil.toISOString().slice(0, 10) : ""}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          <div>
            <label htmlFor="userId" style={labelStyle}>Client (optional)</label>
            <select id="userId" name="userId" defaultValue={quote.userId ?? ""} style={selectStyle}>
              <option value="">— No client —</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name} ({client.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="projectId" style={labelStyle}>Project (optional)</label>
            <select id="projectId" name="projectId" defaultValue={quote.projectId ?? ""} style={selectStyle}>
              <option value="">— No project —</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
        </div>

        <QuoteLineItemsField name="lineItems" initialText={lineItemsToText(quote.lineItems)} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          <div>
            <label htmlFor="discount" style={labelStyle}>Discount (optional)</label>
            <input id="discount" name="discount" defaultValue={(quote.discountCents / 100).toFixed(2)} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="tax" style={labelStyle}>Tax % (optional)</label>
            <input id="tax" name="tax" defaultValue={taxPercent.toFixed(2)} style={inputStyle} />
          </div>
        </div>

        <div>
          <label htmlFor="notes" style={labelStyle}>Notes (optional)</label>
          <textarea id="notes" name="notes" rows={3} defaultValue={quote.notes} style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        <div style={{ display: "flex", gap: "12px", paddingTop: "4px" }}>
          <button type="submit" className="btn-primary" style={{ borderRadius: "999px", padding: "10px 28px", fontSize: ".875rem" }}>
            Save changes
          </button>
          <Link href="/portal/admin/quotes" style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", color: "var(--muted)", textDecoration: "none" }}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
