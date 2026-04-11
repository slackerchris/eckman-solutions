import Link from "next/link";
import { SiteFrame } from "@/components/site-chrome";

const services = [
  {
    name: "Websites",
    desc: "Clean, fast, mobile-friendly sites that represent your business properly.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    name: "Custom Software",
    desc: "Workflow automation and bespoke tools built around how your team actually works.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    name: "Web Apps",
    desc: "Portals, booking systems, dashboards — full-featured apps that scale with you.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    name: "Data Analytics",
    desc: "Dashboards and reporting that show what your business is actually doing.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="12" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="12" rx="1"/><rect x="17" y="4" width="4" height="16" rx="1"/>
      </svg>
    ),
  },
  {
    name: "Hardware & IT Support",
    desc: "Device setup, networking, and office hardware — set up right and supported long-term.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M22 12H18L15 21L9 3L6 12H2"/>
      </svg>
    ),
  },
];

const processSteps = [
  { num: "01", title: "Discovery Call",    desc: "We talk about what you need, what you have, and what makes sense. No commitment." },
  { num: "02", title: "Plan & Quote",      desc: "Clear scope, flat price, realistic timeline. No hidden fees." },
  { num: "03", title: "Build & Review",    desc: "I build, you review along the way. Changes are easy because you're involved from day one." },
  { num: "04", title: "Launch & Support",  desc: "We go live, I make sure everything's solid, and I stick around." },
];

const whyItems = [
  { title: "One person, start to finish",   desc: "No getting passed around. You work directly with me — the person who writes the code, runs the cables, and answers your calls." },
  { title: "Fast, honest communication",    desc: "I respond quickly, explain things plainly, and tell you upfront if something isn't worth the money." },
  { title: "Full-stack capability",         desc: "Websites, apps, databases, servers, networking — I handle the full picture so your systems work together." },
  { title: "Built for small business",      desc: "Tight budgets, wearing multiple hats, needing things that just work — that's exactly who I build for." },
];

const S = {
  serif: { fontFamily: "var(--font-source-serif, 'Source Serif 4', Georgia, serif)" } as React.CSSProperties,
};

export default function Home() {
  return (
    <SiteFrame>

      {/* ── HERO ── */}
      <section style={{ background: "var(--paper)", padding: "80px 0 72px", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap hero-grid">
          <div>
            <h1 style={{ ...S.serif, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.18, letterSpacing: "-.025em", fontWeight: 700, color: "var(--ink)" }}>
              Technology that <em style={{ fontStyle: "italic", color: "var(--accent)" }}>actually works</em> for your business
            </h1>
            <p style={{ marginTop: "18px", fontSize: "1.05rem", color: "var(--muted)", maxWidth: "460px", lineHeight: 1.7 }}>
              Websites, systems, and data solutions for small businesses , without the tech headaches — built by someone who actually picks up the phone.
            </p>
            <div style={{ marginTop: "28px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn-primary">
                Start a Project
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </Link>
              <Link href="/services" className="btn-secondary">See Services</Link>
            </div>
          </div>

          {/* Graphic card */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "360px", boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 12px 40px rgba(0,0,0,.04)" }}>
              {[
                { color: "#f0fdf4", tc: "#16a34a", label: "New Website",    sub: "Design & Development",     badge: "Live"      },
                { color: "#fef9ee", tc: "#b45309", label: "Inventory App",  sub: "Custom Web Application",   badge: "Building"  },
                { color: "#f0f4ff", tc: "#4361ee", label: "Network Setup",  sub: "Hardware & Configuration",  badge: "Scheduled" },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "13px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "9px", background: row.color, color: row.tc, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: ".9rem" }}>{row.label}</div>
                    <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>{row.sub}</div>
                  </div>
                  <span style={{ fontSize: ".72rem", fontWeight: 700, padding: "3px 9px", borderRadius: "5px", background: row.color, color: row.tc, letterSpacing: ".02em" }}>{row.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ background: "var(--subtle)", padding: "88px 0" }}>
        <div className="wrap">
          <span className="section-label">Services</span>
          <h2 className="section-title">Everything your small business needs, one person</h2>
          <p className="section-desc">No agencies, no runaround. You work directly with me from start to finish.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginTop: "44px" }}>
            {services.map(s => (
              <div key={s.name} className="service-card">
                <div style={{ width: 46, height: 46, borderRadius: "10px", background: "var(--subtle)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px", color: "var(--ink)" }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>{s.name}</h3>
                <p style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "32px" }}>
            <Link href="/services" className="btn-secondary" style={{ fontSize: ".88rem" }}>Full service details →</Link>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section id="process" style={{ background: "var(--paper)", padding: "88px 0", borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <span className="section-label">How it works</span>
          <h2 className="section-title">Simple, straightforward, no surprises</h2>
          <p className="section-desc">Every project follows the same honest process.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "28px", marginTop: "44px" }}>
            {processSteps.map(step => (
              <div key={step.num}>
                <div style={{ ...S.serif, fontSize: "2.4rem", fontWeight: 700, color: "var(--border)", lineHeight: 1, marginBottom: "10px" }}>{step.num}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "6px" }}>{step.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "32px" }}>
            <Link href="/process" className="btn-secondary" style={{ fontSize: ".88rem" }}>More about our process →</Link>
          </div>
        </div>
      </section>

      {/* ── WHY ── */}
      <section id="why" style={{ background: "var(--subtle)", padding: "88px 0", borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <span className="section-label">Why work with me</span>
          <h2 className="section-title">Big-agency skills, small-business heart</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "44px" }}>
            {whyItems.map(item => (
              <div key={item.title} className="why-item">
                <div style={{ width: 28, height: 28, borderRadius: "7px", background: "var(--paper)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: ".95rem", fontWeight: 700, marginBottom: "4px" }}>{item.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "32px" }}>
            <Link href="/about" className="btn-secondary" style={{ fontSize: ".88rem" }}>About →</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-banner">
        <div className="wrap" style={{ maxWidth: "600px" }}>
          <span className="section-label">Let&apos;s talk</span>
          <h2 className="section-title" style={{ ...S.serif, fontSize: "clamp(1.7rem, 3.2vw, 2.3rem)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.22, marginTop: "8px" }}>
            Ready to get started?
          </h2>
          <p className="section-desc" style={{ marginTop: "14px", fontSize: "1rem", lineHeight: 1.7 }}>
            Drop me a line and I&apos;ll get back to you within 24 hours. No sales pitch — just a conversation about what you need.
          </p>
          <div style={{ marginTop: "28px" }}>
            <Link href="/contact" className="btn-accent">
              Get in Touch
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
          </div>
        </div>
      </section>

    </SiteFrame>
  );
}
