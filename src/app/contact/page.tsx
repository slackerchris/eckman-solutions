import type { Metadata } from "next";
import { PageHero, SiteFrame } from "@/components/site-chrome";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Eckman Solutions about websites, software, analytics, or IT support for your small business.",
};

const prompts = [
  { q: "What problem is slowing the business down?",             a: "Describe the bottleneck — a manual process, a broken system, or something you can't track." },
  { q: "What do you already have?",                              a: "Software, tools, a website, a database — whatever exists. I'll work with it or around it." },
  { q: "What would a better system make easier?",               a: "Think about your team, your customers, and the tasks that eat the most time." },
];

export default function ContactPage() {
  return (
    <SiteFrame>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about what your business needs."
        description="No sales pitch, no commitment. Just a conversation about what's not working and what might fix it."
      />

      {/* Form + context */}
      <section style={{ padding: "72px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap two-col-grid">

          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "24px", color: "var(--ink)" }}>Send a message</h2>
            <ContactForm />
          </div>

          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "20px", color: "var(--ink)" }}>Helpful things to include</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {prompts.map((item, i) => (
                <div key={i} style={{ padding: "16px 0", borderBottom: i < prompts.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <p style={{ fontWeight: 600, fontSize: ".9rem", color: "var(--ink)", marginBottom: "4px" }}>{item.q}</p>
                  <p style={{ fontSize: ".88rem", color: "var(--muted)", lineHeight: 1.6 }}>{item.a}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "32px", padding: "20px 24px", background: "var(--subtle)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
              <p style={{ fontWeight: 600, fontSize: ".88rem", marginBottom: "4px" }}>Already a client?</p>
              <p style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                Log in to the <a href="/portal/login" style={{ color: "var(--accent)", fontWeight: 600 }}>client portal</a> to view project updates, invoices, and support notes.
              </p>
            </div>
          </div>

        </div>
      </section>

    </SiteFrame>
  );
}
