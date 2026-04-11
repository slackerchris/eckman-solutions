import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Client Portal",
  description: "Eckman Solutions client portal — projects, billing, and support.",
};

export default async function PortalPage({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const params = await searchParams;
  const submitted = params.submitted === "1";
  const session = await requireSession();
  const isAdmin = session.role === "ADMIN";

  const [projects, invoices, workItems] = await Promise.all([
    prisma.project.findMany({
      where: isAdmin ? undefined : { userId: session.userId },
      orderBy: { createdAt: "desc" },
      include: {
        supportItems: { orderBy: { createdAt: "desc" } },
        user: { select: { name: true } },
      },
    }),
    prisma.invoice.findMany({
      where: isAdmin ? undefined : { project: { userId: session.userId } },
      orderBy: { createdAt: "desc" },
      include: { project: { select: { name: true } } },
    }),
    prisma.supportItem.findMany({
      where: isAdmin
        ? undefined
        : { project: { userId: session.userId } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const requestQueueItems = isAdmin
    ? workItems.filter((item) => !item.projectId)
    : [];
  const supportQueueItems = isAdmin
    ? workItems.filter((item) => Boolean(item.projectId))
    : workItems;

  const activeProjects = projects.filter(
    (p) => p.status.toLowerCase() !== "complete" && p.status.toLowerCase() !== "cancelled",
  );

  const stats = isAdmin
    ? [
        {
          label: "Active projects",
          value: activeProjects.length.toString().padStart(2, "0"),
          href: "/portal/admin/projects",
        },
        {
          label: "Invoices",
          value: invoices.length.toString().padStart(2, "0"),
          href: "/portal/admin/invoices",
        },
        {
          label: "Request queue",
          value: requestQueueItems.length.toString().padStart(2, "0"),
          href: "/portal/admin/requests",
        },
        {
          label: "Support queue",
          value: supportQueueItems.length.toString().padStart(2, "0"),
          href: "/portal/admin/support",
        },
      ]
    : [
        {
          label: "Active projects",
          value: activeProjects.length.toString().padStart(2, "0"),
          href: undefined,
        },
        {
          label: "Invoices",
          value: invoices.length.toString().padStart(2, "0"),
          href: undefined,
        },
        {
          label: "Support items",
          value: supportQueueItems.length.toString().padStart(2, "0"),
          href: undefined,
        },
      ];

  return (
    <section className="space-y-8">
      {/* Success banner */}
      {submitted && (
        <div style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)", borderRadius: "1rem", padding: "14px 20px", fontSize: ".875rem", color: "var(--accent-strong)" }}>
          Your request was submitted — we'll be in touch soon.
        </div>
      )}

      {/* Header */}
      <article className="panel rounded-[1.8rem] p-8 sm:p-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
              Dashboard
            </p>
            <h2 className="mt-3 text-[clamp(1.4rem,2.5vw,2rem)] font-semibold leading-[1.15] tracking-[-0.04em]">
              Welcome back, {session.name ?? session.email}.
            </h2>
          </div>
          {isAdmin ? (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link
                href="/portal/admin/projects/new"
                style={{ border: "1px solid var(--accent)", borderRadius: "999px", padding: "8px 20px", fontSize: ".875rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}
              >
                + New project
              </Link>
              <Link
                href="/portal/admin"
                style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "8px 20px", fontSize: ".875rem", color: "var(--muted)", textDecoration: "none" }}
              >
                Admin panel →
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link
                href="/portal/requests/new"
                style={{ border: "1px solid var(--accent)", borderRadius: "999px", padding: "8px 20px", fontSize: ".875rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}
              >
                + Submit request
              </Link>
              <Link
                href="/portal/projects"
                style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "8px 20px", fontSize: ".875rem", color: "var(--muted)", textDecoration: "none" }}
              >
                My projects
              </Link>
              <Link
                href="/portal/invoices"
                style={{ border: "1px solid var(--border)", borderRadius: "999px", padding: "8px 20px", fontSize: ".875rem", color: "var(--muted)", textDecoration: "none" }}
              >
                My invoices
              </Link>
            </div>
          )}
        </div>
      </article>

      {/* Stat cards */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const inner = (
            <>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">{item.label}</p>
              <p className="mt-5 text-2xl font-semibold tracking-[-0.04em]">{item.value}</p>
            </>
          );
          return item.href ? (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--card)] p-7 sm:p-8 block no-underline hover:border-[var(--accent-strong)] transition-colors"
            >
              {inner}
            </Link>
          ) : (
            <article key={item.label} className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--card)] p-7 sm:p-8">
              {inner}
            </article>
          );
        })}
      </section>

      {/* Main content */}
      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">

        {/* Projects */}
        <article className="panel rounded-[1.8rem] p-8 sm:p-10">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">Active work</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Current projects</h3>
            </div>
            <span className="status-dot" aria-hidden="true" />
          </div>
          <div className="mt-6 space-y-4">
            {projects.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">
                {isAdmin ? "No projects yet." : "No projects assigned to you yet."}
              </p>
            ) : (
              projects.map((project) => (
                <article key={project.id} className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent-strong)]">{project.type}</p>
                      <h4 className="mt-2 text-xl font-semibold">{project.name}</h4>
                      {isAdmin && project.user && (
                        <p className="mt-1 text-xs text-[var(--muted)]">{project.user.name}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 md:flex-col md:items-end">
                      <span className="rounded-full border border-[var(--line)] px-3 py-1 text-sm text-[var(--muted)]">{project.status}</span>
                      {isAdmin && (
                        <Link
                          href={`/portal/admin/projects/${project.id}/edit`}
                          className="text-xs text-[var(--accent-strong)] no-underline hover:underline"
                        >
                          Edit
                        </Link>
                      )}
                    </div>
                  </div>
                  {project.notes && <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{project.notes}</p>}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block text-sm font-medium text-[var(--accent-strong)] no-underline hover:underline"
                    >
                      {project.url} ↗
                    </a>
                  )}
                  {project.supportItems.length > 0 && (
                    <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-4">
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                        Requests ({project.supportItems.length})
                      </p>
                      {project.supportItems.map((req) => (
                        <div key={req.id} className="flex items-start justify-between gap-3 rounded-[0.75rem] border border-[var(--line)] p-3">
                          <p className="text-sm font-medium">{req.title}</p>
                          <Link
                            href={`/portal/requests/${req.id}`}
                            className="shrink-0 rounded-full border border-[var(--line)] px-2 py-0.5 text-xs text-[var(--muted)] no-underline hover:underline"
                          >
                            {req.status ?? "Open"}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </article>

        {/* Billing + Support */}
        <div className="space-y-6">
          <article className="panel rounded-[1.8rem] p-8 sm:p-10">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">Billing</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Invoice summary</h3>
              </div>
              {isAdmin && (
                <Link href="/portal/admin/invoices" className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--accent-strong)] no-underline hover:underline shrink-0">
                  Manage →
                </Link>
              )}
            </div>
            <div className="space-y-3">
              {invoices.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No invoices yet.</p>
              ) : (
                invoices.map((invoice) => (
                  <article key={invoice.id} className="rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{invoice.label}</p>
                        {invoice.project && (
                          <p className="mt-0.5 text-xs text-[var(--muted)]">{invoice.project.name}</p>
                        )}
                      </div>
                      <p className="text-sm font-semibold shrink-0">{invoice.amount}</p>
                    </div>
                    <p className="mt-2 text-sm text-[var(--accent-strong)]">{invoice.status}</p>
                  </article>
                ))
              )}
            </div>
          </article>

          <article className="panel rounded-[1.8rem] p-8 sm:p-10">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">Support queue</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Project support</h3>
              </div>
              {isAdmin && (
                <Link href="/portal/admin/support" className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--accent-strong)] no-underline hover:underline shrink-0">
                  Manage →
                </Link>
              )}
            </div>
            <div className="space-y-3">
              {supportQueueItems.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No support items yet.</p>
              ) : (
                supportQueueItems.map((item) => (
                  <article key={item.id} className="rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <span className="shrink-0 rounded-full border border-[var(--line)] px-2 py-0.5 text-xs text-[var(--muted)]">
                        {item.status ?? "Open"}
                      </span>
                    </div>
                    {item.detail && <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.detail}</p>}
                  </article>
                ))
              )}
            </div>
          </article>

          {isAdmin && (
            <article className="panel rounded-[1.8rem] p-8 sm:p-10">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">Request queue</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">New incoming requests</h3>
                </div>
                <Link href="/portal/admin/requests" className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--accent-strong)] no-underline hover:underline shrink-0">
                  Manage →
                </Link>
              </div>
              <div className="space-y-3">
                {requestQueueItems.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">No new requests yet.</p>
                ) : (
                  requestQueueItems.map((item) => (
                    <article key={item.id} className="rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold">{item.title}</p>
                        <span className="shrink-0 rounded-full border border-[var(--line)] px-2 py-0.5 text-xs text-[var(--muted)]">
                          {item.status ?? "Open"}
                        </span>
                      </div>
                      {item.detail && <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.detail}</p>}
                    </article>
                  ))
                )}
              </div>
            </article>
          )}
        </div>
      </section>
    </section>
  );
}
