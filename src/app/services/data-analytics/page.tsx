import type { Metadata } from "next";
import { PageHero, SiteFrame } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Data Analytics — Eckman Solutions",
  description:
    "Your business generates data every day. I help you actually use it — custom dashboards, automated reporting, and plain-English explanations.",
};

const features = [
  {
    title: "Custom dashboards",
    body: "Live views of the metrics that actually matter to your business — not a generic template with 40 charts nobody reads.",
  },
  {
    title: "SQL & data pipelines",
    body: "Automated queries that pull, clean, and transform data on a schedule so your reports are always current.",
    delay: ".06s",
  },
  {
    title: "Data cleanup & migration",
    body: "Messy spreadsheets, duplicate records, data spread across five systems — I'll consolidate and clean it up.",
    delay: ".12s",
  },
  {
    title: "Automated reporting",
    body: "Weekly, monthly, or real-time reports delivered to your inbox or a shared dashboard. No manual pulling.",
    delay: ".18s",
  },
  {
    title: "Business intelligence",
    body: "Spot trends, track KPIs, understand what's working and what isn't — with data, not gut feelings.",
    delay: ".24s",
  },
  {
    title: "Plain-English explanations",
    body: "I don't hand you a spreadsheet and walk away. I'll explain what the data means and what you should do about it.",
    delay: ".3s",
  },
];

export default function DataAnalyticsPage() {
  return (
    <SiteFrame>
      <PageHero
        eyebrow="Data Analytics"
        title="Your business generates data every day. Let's make it useful."
        description="I take messy data from wherever it lives and turn it into clear, actionable reporting."
        breadcrumb={[{ label: "Services", href: "/services" }]}
      />

      <section>
        <div className="wrap" style={{ padding: "72px 0" }}>
          <span className="section-label">What you get</span>
          <h2 className="section-title">Answers, not just numbers</h2>
          <p className="section-desc">Turn the data you already have into decisions you can actually act on.</p>
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
          <span className="section-label">Drowning in data?</span>
          <h2 className="section-title">Let's make it useful</h2>
          <p className="section-desc">Tell me what questions you wish you could answer and I'll show you how to get there.</p>
          <a href="/contact" className="btn-accent" style={{ marginTop: "28px", display: "inline-block" }}>Get in Touch</a>
        </div>
      </section>
    </SiteFrame>
  );
}
