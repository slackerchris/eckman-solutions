"use client";

import { useActionState, useState } from "react";

import { submitRequestAction, type RequestActionState } from "@/app/portal/requests/actions";

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
  display: "block" as const,
  fontSize: ".825rem",
  fontWeight: 600 as const,
  color: "var(--muted)",
  marginBottom: "6px",
  textTransform: "uppercase" as const,
  letterSpacing: ".08em",
};

const CATEGORIES = [
  { value: "New website",       label: "New website" },
  { value: "New web app",       label: "New web app" },
  { value: "Custom software",   label: "Custom software" },
  { value: "Data analytics",    label: "Data analytics" },
  { value: "Hardware / IT",     label: "Hardware & IT support" },
  { value: "Support request",   label: "Support / update (existing project)" },
  { value: "Other",             label: "Other" },
] as const;

type Project = { id: string; name: string };

export function RequestForm({
  projects,
  defaultProjectId,
}: {
  projects: Project[];
  defaultProjectId?: string;
}) {
  const [state, action, pending] = useActionState<RequestActionState, FormData>(
    submitRequestAction,
    {},
  );

  const [category, setCategory] = useState<string>(
    defaultProjectId ? "Support request" : "",
  );

  const isSupport = category === "Support request";

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {state.error && (
        <p style={{ color: "#c0392b", fontSize: ".875rem", background: "rgba(192,57,43,.08)", border: "1px solid rgba(192,57,43,.2)", borderRadius: ".75rem", padding: "12px 16px" }}>
          {state.error}
        </p>
      )}

      {/* ── Request type ── */}
      <div>
        <label htmlFor="category" style={labelStyle}>Request type</label>
        <select
          id="category"
          name="category"
          required
          style={selectStyle}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" disabled>— Select a request type —</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* ── Existing project picker — only shown for Support requests ── */}
      {isSupport && (
        <div>
          <label htmlFor="projectId" style={labelStyle}>
            Which project?{" "}
            <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
          </label>
          <select
            id="projectId"
            name="projectId"
            style={selectStyle}
            defaultValue={defaultProjectId ?? ""}
          >
            <option value="">— Other / not listed —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {projects.length === 0 && (
            <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: "6px" }}>
              No projects are assigned to your account yet — we'll still receive your request.
            </p>
          )}
        </div>
      )}

      {/* ── Title ── */}
      <div>
        <label htmlFor="title" style={labelStyle}>Request title</label>
        <input
          id="title"
          name="title"
          required
          style={inputStyle}
          placeholder={
            category === "New website"     ? "e.g. New website for my business" :
            category === "New web app"     ? "e.g. Customer booking system" :
            category === "Custom software" ? "e.g. Inventory management tool" :
            category === "Data analytics"  ? "e.g. Sales dashboard for my Shopify store" :
            category === "Hardware / IT"   ? "e.g. Office network setup" :
            category === "Support request" ? "e.g. Update homepage hero text" :
                                             "Brief summary of your request"
          }
        />
      </div>

      {/* ── Description ── */}
      <div>
        <label htmlFor="detail" style={labelStyle}>Description</label>
        <textarea
          id="detail"
          name="detail"
          required
          rows={5}
          style={{ ...inputStyle, resize: "vertical" }}
          placeholder={
            category === "New website"     ? "Tell us about your business, goals, and any examples you like…" :
            category === "New web app"     ? "Describe the problem you're trying to solve and key features needed…" :
            category === "Custom software" ? "Describe the workflow or process you want to automate or improve…" :
            category === "Data analytics"  ? "What data do you have and what decisions do you want it to help you make…" :
            category === "Hardware / IT"   ? "Describe the hardware, network, or IT issue — location and any error messages help…" :
            category === "Support request" ? "Describe what needs changing or fixing in as much detail as possible…" :
                                             "Describe what you need in as much detail as possible…"
          }
        />
      </div>

      <div style={{ paddingTop: "4px" }}>
        <button
          type="submit"
          disabled={pending || !category}
          className="btn-primary"
          style={{ borderRadius: "999px", padding: "10px 28px", fontSize: ".875rem", opacity: (pending || !category) ? 0.5 : 1, cursor: !category ? "not-allowed" : "pointer" }}
        >
          {pending ? "Submitting…" : "Submit request"}
        </button>
      </div>
    </form>
  );
}
