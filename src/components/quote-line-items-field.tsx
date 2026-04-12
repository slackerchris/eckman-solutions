"use client";

import { useMemo, useState } from "react";

const CUSTOM_OPTION = "__custom__";

const LINE_ITEM_OPTIONS = [
  "Discovery and planning",
  "Design",
  "Development",
  "QA and testing",
  "Deployment",
  "Training",
  "Analytics setup",
  "Integration work",
  "Monthly maintenance",
] as const;

type LineItemRow = {
  id: number;
  choice: string;
  customDescription: string;
  quantity: string;
  unitPrice: string;
};

const rowCardStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: "1rem",
  background: "var(--card)",
  padding: "14px",
  display: "grid",
  gap: "12px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  fontSize: ".95rem",
  border: "1px solid var(--border)",
  borderRadius: ".7rem",
  background: "var(--paper)",
  color: "var(--ink)",
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23888' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  backgroundSize: "18px",
  paddingRight: "36px",
};

function defaultRow(id: number): LineItemRow {
  return {
    id,
    choice: LINE_ITEM_OPTIONS[0],
    customDescription: "",
    quantity: "1",
    unitPrice: "0.00",
  };
}

function parseInitialRows(initialText: string | undefined): LineItemRow[] {
  const text = (initialText ?? "").trim();
  if (!text) return [defaultRow(1)];

  const rows = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [descriptionRaw = "", qtyRaw = "1", priceRaw = "0"] = line.split("|").map((part) => part.trim());
      const knownChoice = LINE_ITEM_OPTIONS.find((option) => option === descriptionRaw);
      const parsedPrice = Number(priceRaw.replace(/[$,\s]/g, ""));

      return {
        id: index + 1,
        choice: knownChoice ?? CUSTOM_OPTION,
        customDescription: knownChoice ? "" : descriptionRaw,
        quantity: qtyRaw || "1",
        unitPrice: Number.isFinite(parsedPrice) ? parsedPrice.toFixed(2) : "0.00",
      } satisfies LineItemRow;
    });

  return rows.length > 0 ? rows : [defaultRow(1)];
}

function sanitizeQuantity(raw: string): string {
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return "1";
  return String(Math.floor(value));
}

function sanitizeUnitPrice(raw: string): string {
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return "0.00";
  return value.toFixed(2);
}

function toLineItemText(rows: LineItemRow[]): string {
  return rows
    .map((row) => {
      const description = row.choice === CUSTOM_OPTION ? row.customDescription.trim() : row.choice;
      const quantity = sanitizeQuantity(row.quantity);
      const unitPrice = sanitizeUnitPrice(row.unitPrice);
      return `${description} | ${quantity} | ${unitPrice}`;
    })
    .join("\n");
}

export function QuoteLineItemsField({
  name,
  initialText,
}: {
  name: string;
  initialText?: string;
}) {
  const [rows, setRows] = useState<LineItemRow[]>(() => parseInitialRows(initialText));

  const serializedValue = useMemo(() => toLineItemText(rows), [rows]);

  const updateRow = (id: number, patch: Partial<LineItemRow>) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const addRow = () => {
    setRows((current) => [...current, defaultRow(Math.max(...current.map((r) => r.id), 0) + 1)]);
  };

  const removeRow = (id: number) => {
    setRows((current) => {
      if (current.length <= 1) return current;
      return current.filter((row) => row.id !== id);
    });
  };

  return (
    <div>
      <input type="hidden" name={name} value={serializedValue} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", gap: "12px", flexWrap: "wrap" }}>
        <label style={{ display: "block", fontSize: ".825rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".08em" }}>
          Line items
        </label>
        <button
          type="button"
          onClick={addRow}
          style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 14px", fontSize: ".8rem", color: "var(--accent)", background: "transparent", cursor: "pointer", fontWeight: 600 }}
        >
          + Add line item
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {rows.map((row, index) => (
          <div key={row.id} style={rowCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
              <p style={{ fontSize: ".78rem", color: "var(--muted)", fontFamily: "monospace", letterSpacing: ".08em" }}>Item {index + 1}</p>
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                disabled={rows.length <= 1}
                style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "4px 12px", fontSize: ".75rem", color: rows.length <= 1 ? "var(--muted)" : "#b33", opacity: rows.length <= 1 ? 0.5 : 1, background: "transparent", cursor: rows.length <= 1 ? "not-allowed" : "pointer" }}
              >
                Remove
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "minmax(210px, 1fr) minmax(130px, 1fr) minmax(140px, 1fr)", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: ".74rem", color: "var(--muted)", marginBottom: "5px", textTransform: "uppercase", letterSpacing: ".08em" }}>
                  Description
                </label>
                <select
                  value={row.choice}
                  onChange={(e) => updateRow(row.id, { choice: e.target.value })}
                  style={selectStyle}
                >
                  {LINE_ITEM_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                  <option value={CUSTOM_OPTION}>Custom (enter text)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: ".74rem", color: "var(--muted)", marginBottom: "5px", textTransform: "uppercase", letterSpacing: ".08em" }}>
                  Qty
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={row.quantity}
                  onChange={(e) => updateRow(row.id, { quantity: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: ".74rem", color: "var(--muted)", marginBottom: "5px", textTransform: "uppercase", letterSpacing: ".08em" }}>
                  Unit price
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={row.unitPrice}
                  onChange={(e) => updateRow(row.id, { unitPrice: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            {row.choice === CUSTOM_OPTION ? (
              <div>
                <label style={{ display: "block", fontSize: ".74rem", color: "var(--muted)", marginBottom: "5px", textTransform: "uppercase", letterSpacing: ".08em" }}>
                  Custom description
                </label>
                <input
                  value={row.customDescription}
                  onChange={(e) => updateRow(row.id, { customDescription: e.target.value })}
                  style={inputStyle}
                  placeholder="Enter custom line item description"
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <p style={{ marginTop: "8px", fontSize: ".78rem", color: "var(--muted)" }}>
        Choose a template per item or select Custom to type your own description.
      </p>
    </div>
  );
}
