import type { Metadata } from "next";
import Link from "next/link";

import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata: Metadata = { title: "Reset Password — Eckman Solutions Portal" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <section style={{ maxWidth: "480px", margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)" }}>Invalid link</h2>
        <p style={{ color: "var(--muted)", marginTop: "12px" }}>
          This password reset link is missing or malformed.{" "}
          <Link href="/portal/login" style={{ color: "var(--accent)" }}>Back to login</Link>
        </p>
      </section>
    );
  }

  return (
    <section style={{ maxWidth: "480px", margin: "80px auto", padding: "0 20px" }}>
      <Link
        href="/portal/login"
        style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}
      >
        ← Login
      </Link>
      <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "8px", marginBottom: "8px" }}>
        Set new password
      </h2>
      <p style={{ color: "var(--muted)", fontSize: ".9rem", marginBottom: "28px", lineHeight: 1.6 }}>
        Choose a new password for your account. This link expires after 24 hours.
      </p>
      <ResetPasswordForm token={token} />
    </section>
  );
}
