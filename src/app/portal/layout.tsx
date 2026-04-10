import Link from "next/link";

import { logoutPortalAction } from "@/app/portal/actions";
import { getSession } from "@/lib/auth/session";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <div className="min-h-screen pb-12 pt-6">
      <div className="shell">
        <header className="panel flex flex-col gap-4 rounded-[1.75rem] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
              Eckman Solutions
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              Client portal
            </h1>
            {session ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                Signed in as {session.name ?? session.email}
              </p>
            ) : null}
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
            <Link href="/">Back to website</Link>
            {session ? <Link href="/portal">Dashboard</Link> : null}
            {session ? (
              <form action={logoutPortalAction}>
                <button
                  type="submit"
                  className="rounded-full border border-[var(--line)] px-4 py-2 text-[var(--foreground)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                >
                  Sign out
                </button>
              </form>
            ) : (
              <Link href="/portal/login">Login</Link>
            )}
          </nav>
        </header>
        <div className="pt-6">{children}</div>
      </div>
    </div>
  );
}