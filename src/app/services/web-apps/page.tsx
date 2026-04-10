import type { Metadata } from "next";
import { PageHero, SiteFrame } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Web Apps — Eckman Solutions",
  description:
    "Full-featured web applications your customers and team can access from any browser — no app store, no installs.",
};

const features = [
  {
    title: "Customer portals",
    body: "Give your clients a self-service login to view orders, invoices, documents, or project status.",
  },
  {
    title: "Booking & scheduling",
    body: "Online appointment booking, availability management, and automated confirmations.",
    delay: ".06s",
  },
  {
    title: "Dashboards",
    body: "Real-time views of the numbers that matter — sales, inventory, performance — all in one place.",
    delay: ".12s",
  },
  {
    title: "Internal tools",
    body: "Admin panels, data entry forms, approval workflows — the operational backbone your team needs.",
    delay: ".18s",
  },
  {
    title: "Role-based access",
    body: "Different users see different things. Admins, staff, and customers each get exactly the access they need.",
    delay: ".24s",
  },
  {
    title: "Built to scale",
    body: "Start with what you need now. The architecture is designed so we can add features without starting over.",
    delay: ".3s",
  },
];

export default function WebAppsPage() {
  return (
    <SiteFrame>
      <PageHero
        eyebrow="Web Apps"
        title="More than a website — a working tool your team and customers can rely on."
        description="Full-featured web applications accessible from any browser. No app store, no installs."
        breadcrumb={[{ label: "Services", href: "/services" }]}
      />

      <section>
        <div className="wrap" style={{ padding: "72px 0" }}>
          <span className="section-label">What you get</span>
          <h2 className="section-title">More than a website — a working tool</h2>
          <p className="section-desc">Web apps handle real business logic: logins, data entry, workflows, and integrations.</p>
          <div className="features">
            {features.map((f) => (
              <div key={f.title} className="feature fade-up" style={f.delay ? { transitionDelay: f.delay } : undefined}>
                <div className="feature-check">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="wrap" style={{ maxWidth: 600, textAlign: "center" }}>
          <span className="section-label">Have an idea for an app?</span>
          <h2 className="section-title">Let's turn it into something real</h2>
          <p className="section-desc">I'll help you figure out what to build first and what can wait.</p>
          <a href="/contact" className="btn-accent" style={{ marginTop: "28px", display: "inline-block" }}>Get in Touch</a>
        </div>
      </section>
    </SiteFrame>
  );
}
