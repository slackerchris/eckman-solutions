import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PortalLoginForm } from "@/components/portal-login-form";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Client Login",
  description:
    "Portal access for Eckman Solutions clients to review projects, websites, and billing.",
};

export default async function PortalLoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/portal");
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-[1.8rem] border border-[var(--line)] bg-[var(--foreground)] p-6 text-white shadow-[var(--shadow)] sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">
          Portal access
        </p>
        <h2 className="mt-4 text-[clamp(2.3rem,4vw,3.6rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
          A cleaner way for clients to review projects and invoices.
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-8 text-white/75">
          Customers can log in to view project activity, active websites, billing,
          maintenance notes, and support requests without sorting through long
          email threads.
        </p>
        <div className="mt-8 space-y-4 rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
          <div>
            <p className="text-sm font-semibold">Included in the portal structure</p>
            <p className="mt-2 text-sm leading-7 text-white/70">
              Website status, deliverables, invoice history, and ongoing support
              notes.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Next production step</p>
            <p className="mt-2 text-sm leading-7 text-white/70">
              Wire this screen into real authentication and billing systems so each
              client sees only their own records.
            </p>
          </div>
        </div>
      </article>

      <article className="panel rounded-[1.8rem] p-6 sm:p-8">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
            Sign in
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
            Portal sign in
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Use the account you created with the CLI to access the protected
            portal dashboard.
          </p>
        </div>
        <div className="mt-8 rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 sm:p-6">
          <PortalLoginForm />
        </div>
      </article>
    </section>
  );
}