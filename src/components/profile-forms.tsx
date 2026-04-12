"use client";

import { useActionState } from "react";

import {
  changePasswordAction,
  updateProfileAction,
  type ProfileActionState,
} from "@/app/portal/profile/actions";
import { accentMonoLabelStyle, inputStyle } from "@/components/form-styles";

function Banner({ state }: { state: ProfileActionState }) {
  if (state.success) {
    return (
      <p style={{ padding: "12px 16px", borderRadius: ".75rem", background: "var(--accent-soft)", color: "var(--accent-strong)", fontSize: ".875rem" }}>
        {state.success}
      </p>
    );
  }
  if (state.error) {
    return (
      <p style={{ padding: "12px 16px", borderRadius: ".75rem", background: "rgba(220,38,38,.1)", color: "#dc2626", fontSize: ".875rem" }}>
        {state.error}
      </p>
    );
  }
  return null;
}

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [profileState, profileAction, profilePending] = useActionState<ProfileActionState, FormData>(
    updateProfileAction,
    {},
  );

  return (
    <form action={profileAction} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <Banner state={profileState} />
      <div>
        <label htmlFor="name" style={accentMonoLabelStyle}>Display name</label>
        <input id="name" name="name" required defaultValue={name} style={inputStyle} />
      </div>
      <div>
        <label htmlFor="email" style={accentMonoLabelStyle}>Email address</label>
        <input id="email" name="email" type="email" required defaultValue={email} style={inputStyle} />
      </div>
      <div>
        <button
          type="submit"
          disabled={profilePending}
          className="btn-primary"
          style={{ borderRadius: "999px", padding: "10px 28px", fontSize: ".875rem", opacity: profilePending ? 0.6 : 1 }}
        >
          {profilePending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [pwState, pwAction, pwPending] = useActionState<ProfileActionState, FormData>(
    changePasswordAction,
    {},
  );

  return (
    <form action={pwAction} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <Banner state={pwState} />
      <div>
        <label htmlFor="current" style={accentMonoLabelStyle}>Current password</label>
        <input id="current" name="current" type="password" required style={inputStyle} autoComplete="current-password" />
      </div>
      <div>
        <label htmlFor="password" style={accentMonoLabelStyle}>New password</label>
        <input id="password" name="password" type="password" required minLength={8} style={inputStyle} placeholder="8+ characters" autoComplete="new-password" />
      </div>
      <div>
        <label htmlFor="confirm" style={accentMonoLabelStyle}>Confirm new password</label>
        <input id="confirm" name="confirm" type="password" required minLength={8} style={inputStyle} autoComplete="new-password" />
      </div>
      <div>
        <button
          type="submit"
          disabled={pwPending}
          className="btn-primary"
          style={{ borderRadius: "999px", padding: "10px 28px", fontSize: ".875rem", opacity: pwPending ? 0.6 : 1 }}
        >
          {pwPending ? "Updating…" : "Update password"}
        </button>
      </div>
    </form>
  );
}
