"use client";

import { useActionState } from "react";

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
  display: "block",
  fontSize: ".825rem",
  fontWeight: 600 as const,
  color: "var(--muted)",
  marginBottom: "6px",
  textTransform: "uppercase" as const,
  letterSpacing: ".08em",
};

type Project = { id: string; name: string };

export function RequestForm({ projects, defaultProjectId }: { projects: Project[]; defaultProjectId?: string }) {
  const [state, action, pending] = useActionState<RequestActionState, FormData>(
    submitRequestAction,
    {},
  );

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {state.error && (
        <p style={{ color: "var(--error, #c0392b)", fontSize: ".875rem", background: "rgba(192,57,43,.08)", border: "1px solid rgba(192,57,43,.2)", borderRadius: ".75rem", padding: "12px 16px" }}>
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="title" style={labelStyle}>Request title</label>
        <input
          id="title"
          name="title"
          required
          style={inputStyle}
          placeholder="e.g. Update homepage hero text"
        />
      </div>

      <div>
        <label htmlFor="detail" style={labelStyle}>Description</label>
        <textarea
          id="detail"
          name="detail"
          required
          rows={5}
          style={{ ...inputStyle, resize: "vertical" }}
          placeholder="Describe what you need in as much detail as possible..."
        />
      </div>

      {projects.length > 0 && (
        <div>
          <label htmlFor="projectId" style={labelStyle}>Related project (optional)</label>
          <select id="projectId" name="projectId" style={selectStyle} defaultValue={defaultProjectId ?? ""}>
            <option value="">— General request —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", paddingTop: "4px" }}>
        <button
          type="submit"
          disabled={pending}
          className="btn-primary"
          style={{ borderRadius: "999px", padding: "10px 28px", fontSize: ".875rem", opacity: pending ? 0.6 : 1 }}
        >
          {pending ? "Submitting…" : "Submit request"}
        </button>
      </div>
    </form>
  );
}
