"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const SERVICE_LINKS = [
  { href: "/services/websites",       label: "Websites"           },
  { href: "/services/web-apps",       label: "Web Apps"           },
  { href: "/services/custom-software", label: "Custom Software"   },
  { href: "/services/hardware",        label: "Hardware & IT"     },
];

const NAV = [
  { href: "/about",   label: "About"   },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      borderBottom: "1px solid var(--border)",
      boxShadow: scrolled ? "0 1px 16px rgba(0,0,0,.06)" : "none",
      transition: "box-shadow .3s",
    }} className="site-nav-bar">
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 0" }}>

        <Link href="/" style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-.03em", color: "var(--ink)", textDecoration: "none" }}>
          eckman<span style={{ color: "var(--muted)", fontWeight: 500 }}>.solutions</span>
        </Link>

        {/* Desktop */}
        <ul className="nav-desktop" style={{ display: "flex", gap: "28px", listStyle: "none", alignItems: "center", margin: 0, padding: 0 }}>

          {/* Services dropdown */}
          <li ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setServicesOpen(v => !v)}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: 0,
                color: "var(--muted)", fontSize: ".88rem", fontWeight: 500,
                display: "flex", alignItems: "center", gap: "4px",
              }}
            >
              Services
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginTop: "1px", transition: "transform .2s", transform: servicesOpen ? "rotate(180deg)" : "none" }}>
                <polyline points="2 4 6 8 10 4" />
              </svg>
            </button>

            {servicesOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)",
                background: "var(--card)", backdropFilter: "blur(14px)",
                border: "1px solid var(--border)", borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,.1)",
                padding: "8px", minWidth: "190px", zIndex: 200,
              }}>
                {SERVICE_LINKS.map(link => (
                  <Link key={link.href} href={link.href}
                    onClick={() => setServicesOpen(false)}
                    style={{
                      display: "block", padding: "9px 14px", borderRadius: "8px",
                      color: "var(--ink)", fontSize: ".88rem", fontWeight: 500,
                      textDecoration: "none", whiteSpace: "nowrap",
                      transition: "background .15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--subtle)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </li>

          {NAV.map(link => (
            <li key={link.href}>
              <Link href={link.href} style={{ color: "var(--muted)", fontSize: ".88rem", fontWeight: 500, textDecoration: "none" }}>
                {link.label}
              </Link>
            </li>
          ))}

          <li>
            <ThemeToggle />
          </li>

          <li>
            <Link href="/portal/login" style={{
              background: "var(--ink)", color: "var(--paper)", padding: "8px 18px",
              borderRadius: "7px", fontWeight: 600, fontSize: ".85rem", textDecoration: "none",
            }}>
              Client Login
            </Link>
          </li>
        </ul>

        {/* Mobile right-side controls */}
        <div className="nav-mobile-controls" style={{ display: "none", alignItems: "center", gap: "8px" }}>
          <ThemeToggle />
          <button
            onClick={() => setOpen(v => !v)}
            aria-label="Menu"
            style={{
              background: "none", border: "none", cursor: "pointer", padding: "4px",
              color: "var(--ink)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="site-nav-mobile" style={{ backdropFilter: "blur(14px)", borderBottom: "1px solid var(--border)", padding: "4px 24px 16px" }}>
          <p style={{ fontSize: ".75rem", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", padding: "12px 0 6px" }}>Services</p>
          {SERVICE_LINKS.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "10px 0 10px 12px", borderBottom: "1px solid var(--border)", color: "var(--muted)", fontWeight: 500, fontSize: ".9rem", textDecoration: "none" }}>
              {link.label}
            </Link>
          ))}
          {NAV.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "12px 0", borderBottom: "1px solid var(--border)", color: "var(--ink)", fontWeight: 500, fontSize: ".95rem", textDecoration: "none" }}>
              {link.label}
            </Link>
          ))}
          <Link href="/portal/login" onClick={() => setOpen(false)}
            style={{ display: "block", padding: "12px 0", color: "var(--accent)", fontWeight: 600, fontSize: ".95rem", textDecoration: "none" }}>
            Client Login
          </Link>
        </div>
      )}
    </nav>
  );
}
