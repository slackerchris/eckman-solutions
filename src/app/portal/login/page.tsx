import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";

import { PortalLoginForm } from "@/components/portal-login-form";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Client Login",
  description:
    "Portal access for Eckman Solutions clients to review projects, websites, and billing.",
};

export default async function PortalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/portal");

  const { reset } = await searchParams;

  return (
    <section style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", padding: "48px 24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {reset === "1" && (
          <div style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)", borderRadius: "1rem", padding: "14px 18px", marginBottom: "20px", fontSize: ".875rem", color: "var(--accent-strong)" }}>
            Password updated — you can now sign in with your new password.
          </div>
        )}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
            <Image src="/brand/eckman-mark.svg" alt="Eckman Solutions" width={52} height={52} priority />
          </div>
          <p style={{ fontFamily: "monospace", fontSize: ".72rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
            Portal access
          </p>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-.035em", color: "var(--ink)", marginTop: "8px" }}>
            Sign in to your portal
          </h2>
        </div>
        <div className="panel" style={{ borderRadius: "16px", padding: "36px" }}>
          <PortalLoginForm />
        </div>
      </div>
    </section>
  );
}