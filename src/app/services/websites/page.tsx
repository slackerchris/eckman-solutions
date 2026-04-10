import type { Metadata } from "next";
import { PageHero, SiteFrame } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Websites — Eckman Solutions",
  description:
    "Clean, fast, mobile-friendly websites that represent your business the way it deserves — without the agency price tag.",
};

const features = [
  {
    title: "Responsive design",
    body: "Looks great on phones, tablets, and desktops. No pinching, no sideways scrolling.",
  },
  {
    title: "SEO fundamentals",
    body: "Proper structure, meta tags, fast loading — so Google actually knows you exist.",
    delay: ".06s",
  },
  {
    title: "Easy to update",
    body: "I'll set you up with a CMS or teach you how to make changes yourself. No calling me for every typo.",
    delay: ".12s",
  },
  {
    title: "Hosting & domain setup",
    body: "I'll handle the technical setup so you don't have to figure out DNS records and SSL certificates.",
    delay: ".18s",
  },
  {
    title: "E-commerce ready",
    body: "Need to sell products online? I can integrate payment processing and inventory management.",
    delay: ".24s",
  },
  {
    title: "Ongoing support",
    body: "Sites need maintenance. I'll keep things updated, secure, and running smoothly after launch.",
    delay: ".3s",
  },
];

export default function WebsitesPage() {
  return (
    <SiteFrame>
      <PageHero
        eyebrow="Websites"
        title="Clean, fast, mobile-friendly websites that represent your business the way it deserves."
        description="Without the agency price tag."
        breadcrumb={[{ label: "Services", href: "/services" }]}
      />

      <section>
        <div className="wrap" style={{ padding: "72px 0" }}>
          <span className="section-label">What you get</span>
          <h2 className="section-title">A site that works as hard as you do</h2>
          <p className="section-desc">Every site I build is designed to load fast, look sharp on any device, and actually help you get business.</p>
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
          <span className="section-label">Ready for a new site?</span>
          <h2 className="section-title">Let's build something you're proud of</h2>
          <p className="section-desc">Tell me what you need and I'll put together a plan and flat-rate quote.</p>
          <a href="/contact" className="btn-accent" style={{ marginTop: "28px", display: "inline-block" }}>Get in Touch</a>
        </div>
      </section>
    </SiteFrame>
  );
}
