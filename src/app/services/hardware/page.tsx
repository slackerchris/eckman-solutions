import type { Metadata } from "next";
import { PageHero, SiteFrame } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Hardware & IT Support — Eckman Solutions",
  description:
    "On-site setup, troubleshooting, and ongoing support for the physical tech that keeps your business running.",
};

const features = [
  {
    title: "Computer setup & configuration",
    body: "New machines, imaging, user accounts, software installation — ready for your team on day one.",
  },
  {
    title: "Networking",
    body: "Wi-Fi, switches, routers, cabling — reliable connectivity so your team isn't fighting dead zones and slow speeds.",
    delay: ".06s",
  },
  {
    title: "Printers & peripherals",
    body: "Setup, drivers, network printing — yes, printers are still terrible, but I'll make them as painless as possible.",
    delay: ".12s",
  },
  {
    title: "Point-of-sale systems",
    body: "POS hardware installation, configuration, and integration with your payment processing and inventory.",
    delay: ".18s",
  },
  {
    title: "Troubleshooting",
    body: "Something broken? I'll diagnose it, explain what happened in plain English, and get you back up and running.",
    delay: ".24s",
  },
  {
    title: "Ongoing support",
    body: "Not a one-and-done visit. I'm a phone call away when something goes wrong or you need to add new equipment.",
    delay: ".3s",
  },
];

export default function HardwarePage() {
  return (
    <SiteFrame>
      <PageHero
        eyebrow="Hardware & IT Support"
        title="Someone who shows up, fixes things, and explains it in plain English."
        description="On-site setup, troubleshooting, and ongoing support for the physical tech that keeps your business running."
        breadcrumb={[{ label: "Services", href: "/services" }]}
      />

      <section>
        <div className="wrap" style={{ padding: "72px 0" }}>
          <span className="section-label">What you get</span>
          <h2 className="section-title">Someone who shows up and fixes things</h2>
          <p className="section-desc">I come to your location, handle the hardware, and make sure everything actually works before I leave.</p>
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
          <span className="section-label">Need hands-on help?</span>
          <h2 className="section-title">I'll come to you</h2>
          <p className="section-desc">On-site service in the greater Cincinnati area. Tell me what's going on and we'll get it sorted.</p>
          <a href="/contact" className="btn-accent" style={{ marginTop: "28px", display: "inline-block" }}>Get in Touch</a>
        </div>
      </section>
    </SiteFrame>
  );
}
