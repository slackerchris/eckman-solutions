import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SiteFrame } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "About",
  description:
    "One person, full-stack capability, and a genuine interest in helping small businesses get the technology they deserve.",
};

const stats = [
  { label: "Location",     value: "Cincinnati, OH"    },
  { label: "Background",   value: "Engineering & CS"  },
  { label: "Specialties",  value: "Full-stack & Data" },
  { label: "Focus",        value: "Small business"    },
  { label: "Service area", value: "Local + remote"    },
];

const values = [
  { title: "Flat pricing, no surprises",  desc: "I quote a price, I stick to it. If the scope changes, we talk about it before any extra work happens." },
  { title: "Honest recommendations",      desc: "If you don't need custom software and a $20/month tool will solve your problem, I'll tell you that." },
  { title: "You own your stuff",          desc: "Your code, your data, your domain. I don't hold anything hostage and I don't build vendor lock-in." },
  { title: "Plain English",               desc: "I'll explain what I'm doing and why in terms that make sense. No jargon walls." },
];

const S = {
  serif: { fontFamily: "var(--font-source-serif, 'Source Serif 4', Georgia, serif)" } as React.CSSProperties,
};

export default function AboutPage() {
  return (
    <SiteFrame>
      <PageHero
        eyebrow="About"
        title="About Eckman Solutions"
        description="One person, full-stack capability, and a genuine interest in helping small businesses get the technology they deserve."
      />

      <section style={{ padding: "72px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap about-grid">
          <div>
            {[
              "I'm Chris — a software developer, data analytics engineer, and IT generalist based in the Cincinnati area. I started Eckman Solutions because I kept seeing the same problem: small businesses getting overcharged for mediocre work by agencies that don't return phone calls.",
              "My background spans engineering and computer science, with professional experience in software development, data analytics, and healthcare data systems. I've spent years building everything from customer-facing web apps to SQL reporting pipelines to on-site hardware deployments.",
              "When you hire me, you're not getting a project manager who passes your work to a junior developer overseas. You're getting the person who actually does the work — and who's available when you have questions.",
              "I keep my client list small on purpose. That means I can give every project real attention and every client a direct line to the person building their stuff.",
            ].map((p, i) => (
              <p key={i} style={{ color: "var(--muted)", fontSize: ".95rem", lineHeight: 1.75, marginBottom: i < 3 ? "18px" : 0 }}>{p}</p>
            ))}
          </div>

          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "32px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>At a glance</h3>
            {stats.map((s, i) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i < stats.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span style={{ color: "var(--muted)", fontSize: ".88rem" }}>{s.label}</span>
                <span style={{ fontWeight: 700, fontSize: ".92rem" }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--subtle)", padding: "88px 0" }}>
        <div className="wrap">
          <span className="section-label">How I work</span>
          <h2 style={{ ...S.serif, fontSize: "clamp(1.7rem, 3.2vw, 2.3rem)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.22, color: "var(--ink)", marginTop: "8px" }}>
            A few things I believe in
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "36px" }}>
            {values.map(v => (
              <div key={v.title} className="why-item">
                <div style={{ width: 28, height: 28, borderRadius: "7px", background: "var(--paper)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: ".95rem", fontWeight: 700, marginBottom: "4px" }}>{v.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.6 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="wrap" style={{ maxWidth: "600px" }}>
          <span className="section-label">Want to work together?</span>
          <h2 className="section-title" style={{ ...S.serif, fontSize: "clamp(1.7rem, 3.2vw, 2.3rem)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.22, marginTop: "8px" }}>
            I&apos;d like to hear about your business
          </h2>
          <p className="section-desc" style={{ marginTop: "14px", fontSize: "1rem", lineHeight: 1.7 }}>
            No pressure, no pitch — just a conversation about what you need.
          </p>
          <div style={{ marginTop: "28px" }}>
            <Link href="/contact" className="btn-accent">Get in Touch</Link>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
