import type { CSSProperties } from "react";

export const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: "1rem",
  border: "1px solid var(--border)",
  borderRadius: ".75rem",
  background: "var(--paper)",
  color: "var(--ink)",
  boxSizing: "border-box",
};

export const selectStyle: CSSProperties = {
  ...inputStyle,
  appearance: "none",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23888' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  backgroundSize: "20px",
  paddingRight: "40px",
  cursor: "pointer",
};

export const labelStyle: CSSProperties = {
  display: "block",
  fontSize: ".825rem",
  fontWeight: 600,
  color: "var(--muted)",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: ".08em",
};

export const compactInputStyle: CSSProperties = {
  ...inputStyle,
  padding: "10px 14px",
  fontSize: ".9rem",
};

export const compactLabelStyle: CSSProperties = {
  ...labelStyle,
  fontSize: ".75rem",
};

export const accentMonoLabelStyle: CSSProperties = {
  display: "block",
  fontFamily: "monospace",
  fontSize: ".72rem",
  textTransform: "uppercase",
  letterSpacing: ".16em",
  color: "var(--accent)",
  marginBottom: "8px",
};
