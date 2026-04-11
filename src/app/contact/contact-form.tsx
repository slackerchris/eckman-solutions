"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "./actions";

const initial: ContactState = { success: false };

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid var(--border)",
  borderRadius: "8px",
  fontSize: ".95rem",
  background: "var(--paper)",
  color: "var(--ink)",
  outline: "none",
  transition: "border-color .2s",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  fontSize: ".88rem",
  marginBottom: "6px",
  color: "var(--ink)",
};

const errorStyle: React.CSSProperties = {
  color: "var(--accent)",
  fontSize: ".82rem",
  marginTop: "4px",
};

const serviceOptions = [
  "Websites",
  "Web Apps",
  "Custom Software",
  "Data Analytics",
  "Hardware & IT",
  "Not sure yet",
] as const;

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.success) {
    return (
      <div style={{ padding: "28px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", textAlign: "center" }}>
        <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--ink)" }}>Message sent!</p>
        <p style={{ marginTop: "6px", fontSize: ".9rem", color: "var(--muted)" }}>
          Thanks — I&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {state.error && (
        <div style={{ padding: "12px 16px", background: "var(--accent-soft)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--ink)", fontSize: ".88rem" }}>
          {state.error}
        </div>
      )}

      <div className="form-row">
        <div>
          <label htmlFor="name" style={labelStyle}>Name <span style={{ color: "var(--accent)" }}>*</span></label>
          <input id="name" name="name" type="text" autoComplete="name" required style={inputStyle} />
          {state.fieldErrors?.name && <p style={errorStyle}>{state.fieldErrors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" style={labelStyle}>Email <span style={{ color: "var(--accent)" }}>*</span></label>
          <input id="email" name="email" type="email" autoComplete="email" required style={inputStyle} />
          {state.fieldErrors?.email && <p style={errorStyle}>{state.fieldErrors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="phone" style={labelStyle}>Phone <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" style={inputStyle} />
      </div>

      <div>
        <label htmlFor="service" style={labelStyle}>Service <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
        <select id="service" name="service" defaultValue="" style={inputStyle}>
          <option value="">Select a service</option>
          {serviceOptions.map((service) => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
        {state.fieldErrors?.service && <p style={errorStyle}>{state.fieldErrors.service}</p>}
      </div>

      <div>
        <label htmlFor="message" style={labelStyle}>Message <span style={{ color: "var(--accent)" }}>*</span></label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="Describe what you're working on, what's broken, or what you need built..."
          style={{ ...inputStyle, resize: "vertical" }}
        />
        {state.fieldErrors?.message && <p style={errorStyle}>{state.fieldErrors.message}</p>}
      </div>

      <div>
        <button type="submit" disabled={pending} className="btn-primary" style={{ opacity: pending ? .6 : 1 }}>
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
