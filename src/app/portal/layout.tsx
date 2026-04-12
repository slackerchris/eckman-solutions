import Link from "next/link";
import Image from "next/image";

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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Image src="/brand/eckman-mark.svg" alt="Eckman Solutions" width={34} height={34} priority />
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
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
            <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>
              <PortalExitLink />
            </div>
            <nav style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", flexWrap: "wrap", fontSize: ".85rem" }}>
              {session ? (
                <Link href="/portal" style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 12px", color: "var(--muted)", textDecoration: "none" }}>
                  Dashboard
                </Link>
              ) : null}
              {session ? (
                <Link href={session.role === "ADMIN" ? "/portal/admin/projects" : "/portal/projects"} style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 12px", color: "var(--muted)", textDecoration: "none" }}>
                  Projects
                </Link>
              ) : null}
              {session ? (
                <Link href="/portal/invoices" style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 12px", color: "var(--muted)", textDecoration: "none" }}>
                  Invoices
                </Link>
              ) : null}

              {session ? (
                <Link
                  href="/portal/requests/new"
                  style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 14px", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}
                >
                  + Request
                </Link>
              ) : null}

              {session ? (
                <details style={{ position: "relative" }}>
                  <summary style={{ listStyle: "none", border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 12px", color: "var(--muted)", cursor: "pointer", userSelect: "none" }}>
                    More
                  </summary>
                  <div style={{ position: "absolute", right: 0, marginTop: "6px", minWidth: "180px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "8px", display: "grid", gap: "4px", zIndex: 30 }}>
                    <Link href={session.role === "ADMIN" ? "/portal/admin/quotes" : "/portal/quotes"} style={{ padding: "8px 10px", borderRadius: "8px", color: "var(--muted)", textDecoration: "none" }}>
                      Quotes
                    </Link>
                    <Link href="/portal/profile" style={{ padding: "8px 10px", borderRadius: "8px", color: "var(--muted)", textDecoration: "none" }}>
                      Profile
                    </Link>
                    {session.role === "ADMIN" ? (
                      <Link href="/portal/admin" style={{ padding: "8px 10px", borderRadius: "8px", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                        Admin
                      </Link>
                    ) : null}
                    <form action={logoutPortalAction}>
                      <button
                        type="submit"
                        style={{ width: "100%", textAlign: "left", border: "none", borderRadius: "8px", padding: "8px 10px", color: "var(--ink)", background: "transparent", cursor: "pointer", fontSize: ".85rem" }}
                      >
                        Sign out
                      </button>
                    </form>
                  </div>
                </details>
              ) : (
                <Link href="/portal/login" style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "6px 12px", color: "var(--muted)", textDecoration: "none" }}>
                  Login
                </Link>
              )}
            </nav>
          </div>
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