import Link from "next/link";

import { logoutPortalAction } from "@/app/portal/actions";
import { getSession } from "@/lib/auth/session";
import { PortalExitLink } from "@/components/portal-exit-link";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <header style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
          <div>
            <p style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}>
              Eckman Solutions
            </p>
            <h1 style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-.025em", color: "var(--ink)", marginTop: "2px" }}>
              Client portal
            </h1>
            {session ? (
              <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: "2px" }}>
                Signed in as {session.name ?? session.email}
              </p>
            ) : null}
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: ".875rem", color: "var(--muted)", flexWrap: "wrap" }}>
            <PortalExitLink />
            {session ? <Link href="/portal">Dashboard</Link> : null}
            {session ? <Link href={session.role === "ADMIN" ? "/portal/admin/projects" : "/portal/projects"}>Projects</Link> : null}
            {session ? <Link href="/portal/invoices">Invoices</Link> : null}
            {session ? (
              <Link
                href="/portal/requests/new"
                style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 16px", fontSize: ".825rem", color: "var(--accent)", background: "transparent", textDecoration: "none", fontWeight: 600 }}
              >
                + Request
              </Link>
            ) : null}
            {session ? <Link href="/portal/profile">Profile</Link> : null}
            {session?.role === "ADMIN" ? (
              <Link href="/portal/admin" style={{ color: "var(--accent)", fontWeight: 600 }}>Admin</Link>
            ) : null}
            {session ? (
              <form action={logoutPortalAction}>
                <button
                  type="submit"
                  style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 16px", fontSize: ".875rem", color: "var(--ink)", background: "transparent", cursor: "pointer" }}
                >
                  Sign out
                </button>
              </form>
            ) : (
              <Link href="/portal/login">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main>
        <div className="wrap" style={{ paddingTop: "40px", paddingBottom: "60px" }}>
          {children}
        </div>
      </main>
      <footer style={{ borderTop: "1px solid var(--border)", padding: "14px 0" }}>
        <div className="wrap" style={{ display: "flex", justifyContent: "flex-end" }}>
          <p style={{ fontFamily: "monospace", fontSize: ".65rem", color: "var(--muted)", opacity: 0.45, letterSpacing: ".1em" }}>
            v{process.env.npm_package_version ?? require("../../../package.json").version}
          </p>
        </div>
      </footer>
    </div>
  );
}