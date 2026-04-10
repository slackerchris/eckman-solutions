import type { Metadata } from "next";
import { PageHero, SiteFrame } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Custom Software — Eckman Solutions",
  description:
    "When off-the-shelf tools don't fit, I build software that matches the way your business actually operates.",
};

const features = [
  {
    title: "Process automation",
    body: "Repetitive tasks eating your day? I'll build tools that handle them automatically so your team can focus on real work.",
  },
  {
    title: "System integrations",
    body: "Connect the tools you already use — accounting, CRM, inventory — so data flows instead of getting retyped.",
    delay: ".06s",
  },
  {
    title: "Internal tools",
    body: "Employee portals, scheduling systems, approval workflows — tools your team will actually want to use.",
    delay: ".12s",
  },
  {
    title: "Database design",
    body: "Structured, reliable data storage that scales — not a folder full of Excel files named \"final_v3_REAL.\"",
    delay: ".18s",
  },
  {
    title: "API development",
    body: "Need your systems to talk to each other or to third-party services? I build clean, documented APIs.",
    delay: ".24s",
  },
  {
    title: "You own everything",
    body: "No vendor lock-in. The code is yours, the data is yours, and you can take it wherever you want.",
    delay: ".3s",
  },
];

export default function CustomSoftwarePage() {
  return (
    <SiteFrame>
      <PageHero
        eyebrow="Custom Software"
        title="Software shaped around the way your business actually operates."
        description="No more duct-taping spreadsheets together or paying monthly for tools that do 10% of what you need."
        breadcrumb={[{ label: "Services", href: "/services" }]}
      />

      <section>
        <div className="wrap" style={{ padding: "72px 0" }}>
          <span className="section-label">What you get</span>
          <h2 className="section-title">Software shaped around your workflow</h2>
          <p className="section-desc">No more duct-taping spreadsheets together or paying monthly for tools that do 10% of what you need.</p>
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
          <span className="section-label">Got a problem that needs solving?</span>
          <h2 className="section-title">Let's talk about what's slowing you down</h2>
          <p className="section-desc">Describe the pain point and I'll tell you what I'd build — no obligation.</p>
          <a href="/contact" className="btn-accent" style={{ marginTop: "28px", display: "inline-block" }}>Get in Touch</a>
        </div>
      </section>
    </SiteFrame>
  );
}
