import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SiteFrame } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Services — Eckman Solutions",
  description:
    "Websites, web apps, custom software, and hardware support for small businesses in Cincinnati.",
};

const services = [
  {
    href: "/services/websites",
    label: "Websites",
    desc: "Clean, fast, mobile-friendly sites that represent your business without the agency price tag.",
  },
  {
    href: "/services/web-apps",
    label: "Web Apps",
    desc: "Full-featured web applications your customers and team can use from any browser.",
  },
  {
    href: "/services/custom-software",
    label: "Custom Software",
    desc: "When off-the-shelf tools don't fit, I build software shaped around your workflow.",
  },
  {
    href: "/services/data-analytics",
    label: "Data Analytics",
    desc: "Dashboards, automated reporting, and plain-English insights from the data you already have.",
  },
  {
    href: "/services/hardware",
    label: "Hardware & IT Support",
    desc: "On-site setup, troubleshooting, and ongoing support for the tech that keeps you running.",
  },
];

export default function ServicesPage() {
  return (
    <SiteFrame>
      <PageHero
        eyebrow="Services"
        title="Practical tech help for businesses that want systems — not overhead."
        description="From a new website to custom software to fixing the printer. Pick what fits."
      />

      <section>
        <div className="wrap" style={{ padding: "72px 0" }}>
          <div className="card-grid">
            {services.map((s) => (
              <Link key={s.href} href={s.href} style={{ textDecoration: "none" }}>
                <article className="card" style={{ height: "100%", cursor: "pointer" }}>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--ink)", marginBottom: "10px" }}>{s.label}</h2>
                  <p style={{ fontSize: ".9rem", color: "var(--muted)", lineHeight: 1.7 }}>{s.desc}</p>
                  <p style={{ marginTop: "16px", fontSize: ".85rem", fontWeight: 600, color: "var(--accent)" }}>Learn more →</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
