import type { Metadata } from "next";
import Link from "next/link";

import { requireSession } from "@/lib/auth/session";
import { ProfileForm, PasswordForm } from "@/components/profile-forms";

export const metadata: Metadata = { title: "Profile — Eckman Solutions Portal" };

const sectionStyle = {
  border: "1px solid var(--border)",
  borderRadius: "1.5rem",
  background: "var(--card)",
  padding: "28px 32px",
} as const;

export default async function ProfilePage() {
  const session = await requireSession();

  return (
    <section style={{ maxWidth: "600px" }}>
      <Link href="/portal" style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
        ← Dashboard
      </Link>
      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px", marginBottom: "32px" }}>
        Your profile
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={sectionStyle}>
          <p style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)", marginBottom: "18px" }}>
            Account details
          </p>
          <ProfileForm name={session.name} email={session.email} />
        </div>

        <div style={sectionStyle}>
          <p style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)", marginBottom: "18px" }}>
            Change password
          </p>
          <PasswordForm />
        </div>
      </div>
    </section>
  );
}
