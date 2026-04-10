import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { InviteSignupForm } from "@/components/invite-signup-form";

export const metadata: Metadata = {
  title: "Create your account — Eckman Solutions",
};

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const invite = await prisma.invite.findUnique({ where: { token } });

  if (!invite || invite.usedAt) {
    notFound();
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <p style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)", marginBottom: "6px" }}>
          Eckman Solutions
        </p>
        <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginBottom: "8px" }}>
          Create your account
        </h1>
        <p style={{ fontSize: ".9rem", color: "var(--muted)", marginBottom: "32px" }}>
          You&rsquo;ve been invited to the client portal. Set up your login below.
        </p>
        <InviteSignupForm token={token} />
      </div>
    </div>
  );
}
