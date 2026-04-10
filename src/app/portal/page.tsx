import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Client Portal",
  description: "Eckman Solutions client portal — projects, billing, and support.",
};

export default async function PortalPage() {
  const session = await requireSession();

  const [projects, invoices, supportItems] = await Promise.all([
    prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.invoice.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.supportItem.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const stats = [
    { label: "Active projects", value: projects.filter((p) => p.status.toLowerCase() !== "complete" && p.status.toLowerCase() !== "completed").length.toString().padStart(2, "0") },
    { label: "Invoices", value: invoices.length.toString().padStart(2, "0") },
    { label: "Support items", value: supportItems.length.toString().padStart(2, "0") },
  ];

  return (
    <section className="space-y-6">
      <article className="panel rounded-[1.8rem] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
              Dashboard
            </p>
            <h2 className="mt-3 text-[clamp(1.4rem,2.5vw,2rem)] font-semibold leading-[1.15] tracking-[-0.04em]">
              Welcome back, {session.name ?? session.email}.
            </h2>
          </div>

        </div>
      </article>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <article
            key={item.label}
            className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--card)] p-5"
          >
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
              {item.label}
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
              {item.value}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="panel rounded-[1.8rem] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                Active work
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                Current projects
              </h3>
            </div>
            <span className="status-dot" aria-hidden="true" />
          </div>
          <div className="mt-5 space-y-4">
            {projects.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No projects yet.</p>
            ) : (
              projects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent-strong)]">
                        {project.type}
                      </p>
                      <h4 className="mt-2 text-xl font-semibold">{project.name}</h4>
                    </div>
                    <span className="rounded-full border border-[var(--line)] px-3 py-1 text-sm text-[var(--muted)]">
                      {project.status}
                    </span>
                  </div>
                  {project.notes && (
                    <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{project.notes}</p>
                  )}
                  {project.url && (
                    <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{project.url}</p>
                  )}
              </article>
              ))
            )}
          </div>
        </article>

        <div className="space-y-6">
          <article className="panel rounded-[1.8rem] p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
              Billing
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              Invoice summary
            </h3>
            <div className="mt-5 space-y-3">
              {invoices.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No invoices yet.</p>
              ) : (
                invoices.map((invoice) => (
                  <article
                    key={invoice.id}
                    className="rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-semibold">{invoice.label}</p>
                      <p className="text-sm font-semibold">{invoice.amount}</p>
                    </div>
                    <p className="mt-3 text-sm text-[var(--accent-strong)]">
                      {invoice.status}
                    </p>
                  </article>
                ))
              )}
            </div>
          </article>

          <article className="panel rounded-[1.8rem] p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
              Support queue
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              Current requests
            </h3>
            <div className="mt-5 space-y-3">
              {supportItems.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No support items yet.</p>
              ) : (
                supportItems.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4"
                  >
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                      {item.detail}
                    </p>
                  </article>
                ))
              )}
            </div>
          </article>
        </div>
      </section>
    </section>
  );
}