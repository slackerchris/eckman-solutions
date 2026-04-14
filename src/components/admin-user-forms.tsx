"use client";

import { useActionState, useEffect, useRef } from "react";

import type { AdminUserActionState } from "@/app/portal/admin/users/actions";
import { adminSetPasswordAction, adminSetUserRoleAction } from "@/app/portal/admin/users/actions";
import { compactInputStyle, compactLabelStyle } from "@/components/form-styles";

export function SetPasswordForm({ userId, onSuccess }: { userId: string; onSuccess?: () => void }) {
  const boundAction = adminSetPasswordAction.bind(null, userId);
  const [state, action, pending] = useActionState<AdminUserActionState, FormData>(boundAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  return (
    <form ref={formRef} action={action} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {state.error && (
        <p style={{ color: "#c0392b", fontSize: ".825rem", background: "rgba(192,57,43,.08)", border: "1px solid rgba(192,57,43,.2)", borderRadius: ".75rem", padding: "10px 14px" }}>
          {state.error}
        </p>
      )}
      {state.success && (
        <p style={{ color: "var(--accent)", fontSize: ".825rem", background: "color-mix(in srgb, var(--accent) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)", borderRadius: ".75rem", padding: "10px 14px" }}>
          {state.success}
        </p>
      )}
      <div>
        <label style={compactLabelStyle}>New password</label>
        <input type="password" name="password" required minLength={8} autoComplete="new-password" style={compactInputStyle} />
      </div>
      <div>
        <label style={compactLabelStyle}>Confirm password</label>
        <input type="password" name="confirm" required minLength={8} autoComplete="new-password" style={compactInputStyle} />
      </div>
      <button
        type="submit"
        disabled={pending}
        style={{ border: "none", borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", fontWeight: 600, background: "var(--accent)", color: "#fff", cursor: "pointer", opacity: pending ? 0.6 : 1, alignSelf: "flex-start" }}
      >
        {pending ? "Saving…" : "Set password"}
      </button>
    </form>
  );
}

export function SetUserRoleForm({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: "ADMIN" | "CLIENT";
}) {
  const boundAction = adminSetUserRoleAction.bind(null, userId);
  const [state, action, pending] = useActionState<AdminUserActionState, FormData>(boundAction, {});

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {state.error && (
        <p style={{ color: "#c0392b", fontSize: ".825rem", background: "rgba(192,57,43,.08)", border: "1px solid rgba(192,57,43,.2)", borderRadius: ".75rem", padding: "10px 14px" }}>
          {state.error}
        </p>
      )}
      {state.success && (
        <p style={{ color: "var(--accent)", fontSize: ".825rem", background: "color-mix(in srgb, var(--accent) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)", borderRadius: ".75rem", padding: "10px 14px" }}>
          {state.success}
        </p>
      )}
      <div>
        <label style={compactLabelStyle}>User type</label>
        <select name="role" defaultValue={currentRole} required style={compactInputStyle}>
          <option value="CLIENT">CLIENT</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        style={{ border: "none", borderRadius: "999px", padding: "10px 24px", fontSize: ".875rem", fontWeight: 600, background: "var(--accent)", color: "#fff", cursor: "pointer", opacity: pending ? 0.6 : 1, alignSelf: "flex-start" }}
      >
        {pending ? "Saving..." : "Update user type"}
      </button>
    </form>
  );
}
