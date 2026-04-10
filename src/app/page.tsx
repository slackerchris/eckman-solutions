import Link from "next/link";

import {
  faqs,
  portalHighlights,
  processSteps,
  serviceGroups,
  stats,
} from "@/lib/site";

export default function Home() {
  return (
    <main className="pb-20 pt-6 md:pb-28 md:pt-8">
      <div className="shell">
        <section className="grid-fade overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,250,243,0.94),rgba(255,255,255,0.72))] px-6 py-6 shadow-[var(--shadow)] sm:px-8 lg:px-10">
          <header className="relative z-10 flex flex-col gap-6 border-b border-[var(--line)] pb-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.22em] text-[var(--accent-strong)]">
                Eckman Solutions
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Practical technology for local businesses.
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
              <a href="#services">Services</a>
              <a href="#process">Process</a>
              <a href="#portal">Portal</a>
              <a href="#contact">Contact</a>
              <Link
                href="/portal/login"
                className="rounded-full border border-[var(--line)] px-4 py-2 text-[var(--foreground)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
              >
                Client login
              </Link>
            </nav>
          </header>

          <div className="relative z-10 grid gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-16">
            <div className="space-y-8">
              <span className="eyebrow">Analytics. Software. Sites. Systems.</span>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-[clamp(3.4rem,8vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.08em] text-[var(--foreground)]">
                  Clean digital systems for the businesses that keep a town moving.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] md:text-xl">
                  I build business-ready websites, web apps, analytics dashboards,
                  custom software, and small business hardware setups that are easy
                  to use and easier to maintain.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:hello@eckman.solutions?subject=Project%20Inquiry"
                  className="rounded-full bg-[var(--foreground)] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
                >
                  Start a project
                </a>
                <Link
                  href="/portal/login"
                  className="rounded-full border border-[var(--line)] px-6 py-3 text-center text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                >
                  Preview client portal
                </Link>
              </div>
            </div>

            <aside className="panel rounded-[1.75rem] p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-strong)]">
                    Service stack
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Built around reliability, clarity, and local support.
                  </p>
                </div>
                <span className="status-dot" aria-hidden="true" />
              </div>
              <div className="mt-5 space-y-4">
                {serviceGroups.slice(0, 3).map((service) => (
                  <article
                    key={service.title}
                    className="rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold">{service.title}</h2>
                        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                          {service.description}
                        </p>
                      </div>
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                        {service.tag}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.75)] px-5 py-5"
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                {stat.detail}
              </p>
            </article>
          ))}
        </section>

        <section id="services" className="pt-20">
          <span className="eyebrow">Services</span>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="section-title max-w-3xl">A focused set of services that fit how small businesses actually work.</h2>
            </div>
            <p className="section-copy">
              The goal is not to sell a pile of tools. It is to give you the right
              combination of website, software, reporting, and hardware support so
              the business runs with less friction.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {serviceGroups.map((service) => (
              <article
                key={service.title}
                className="panel rounded-[1.75rem] p-6"
              >
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                  {service.tag}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                  {service.description}
                </p>
                <ul className="mt-6 space-y-3 text-sm text-[var(--foreground)]">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-[var(--highlight)]" />
                      <span className="leading-7">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="pt-20">
          <span className="eyebrow">Process</span>
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="section-title">Simple delivery, clear ownership, no mystery invoices.</h2>
            </div>
            <div className="grid gap-4">
              {processSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.78)] p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                        Step 0{index + 1}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="portal" className="pt-20">
          <span className="eyebrow">Client portal</span>
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-5">
              <h2 className="section-title">Give clients one place to check project status, live sites, and billing.</h2>
              <p className="section-copy">
                The portal is set up as a clean dashboard experience so customers can
                review deliverables, log requests, and keep an eye on invoices
                without digging through email.
              </p>
              <Link
                href="/portal/login"
                className="inline-flex rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              >
                Open portal preview
              </Link>
            </div>
            <div className="panel rounded-[1.9rem] p-4 sm:p-6">
              <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                      Portal preview
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">eckman.solutions/portal</h3>
                  </div>
                  <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent-strong)]">
                    Read-only demo
                  </span>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {portalHighlights.map((item) => (
                    <article
                      key={item.title}
                      className="rounded-[1.25rem] border border-[var(--line)] bg-white/80 p-4"
                    >
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-20">
          <span className="eyebrow">Questions</span>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.78)] p-6"
              >
                <h3 className="text-xl font-semibold tracking-[-0.03em]">
                  {faq.question}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="mt-20 rounded-[2rem] border border-[var(--line)] bg-[var(--foreground)] px-6 py-10 text-white shadow-[var(--shadow)] sm:px-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[rgba(255,255,255,0.7)]">
                Ready when you are
              </p>
              <h2 className="mt-4 max-w-3xl text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[0.94] tracking-[-0.06em]">
                If the business has a bottleneck, I can usually turn it into a system.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:hello@eckman.solutions?subject=Project%20Inquiry"
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--highlight)]"
              >
                hello@eckman.solutions
              </a>
              <Link
                href="/portal/login"
                className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Client portal
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
