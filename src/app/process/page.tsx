import type { Metadata } from "next";

import { PageHero, SiteFrame } from "@/components/site-chrome";
import { processSteps } from "@/lib/site";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How Eckman Solutions scopes, builds, launches, and supports projects for local businesses.",
};

const supportNotes = [
  "Projects start by identifying the bottleneck clearly before choosing tools.",
  "Scope stays focused so the work solves a real problem instead of growing into a vague wishlist.",
  "After launch, support can continue through maintenance, reporting, or iterative improvements.",
];

export default function ProcessPage() {
  return (
    <SiteFrame>
      <PageHero
        eyebrow="Process"
        title="Clear scope, clear delivery, and no mystery steps."
        description="The work is handled in a small number of stages so you know what is being solved, what is being built, and what comes next."
      />

      <section>
        <div className="wrap" style={{ padding: "72px 0" }}>
          {processSteps.map((step, index) => (
            <article
              key={step.title}
              style={{
                display: "flex",
                gap: "48px",
                padding: "36px 0",
                borderTop: index === 0 ? "none" : "1px solid var(--border)",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flexShrink: 0, width: "160px" }}>
                <p style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--accent)" }}>
                  Step {String(index + 1).padStart(2, "0")}
                </p>
                <h2 style={{ marginTop: "8px", fontSize: "1rem", fontWeight: 700, color: "var(--ink)", lineHeight: 1.35 }}>
                  {step.title}
                </h2>
              </div>
              <p style={{ fontSize: ".9rem", lineHeight: 1.75, color: "var(--muted)", paddingTop: "24px" }}>
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--subtle)", borderTop: "1px solid var(--border)" }}>
        <div className="wrap" style={{ padding: "64px 0" }}>
          <span className="section-label">After launch</span>
          <h2 className="section-title" style={{ maxWidth: "500px" }}>Support that keeps things running</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "24px", marginTop: "32px" }}>
            {supportNotes.map((note) => (
              <p key={note} style={{ fontSize: ".9rem", lineHeight: 1.75, color: "var(--muted)" }}>
                {note}
              </p>
            ))}
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
