import Link from "next/link";
import { NavBar } from "@/components/nav-bar";

const FOOTER_NAV = [
  { href: "/services",    label: "Services" },
  { href: "/about",       label: "About"    },
  { href: "/process",     label: "Process"  },
  { href: "/contact",     label: "Contact"  },
  { href: "/portal/login", label: "Portal"  },
];

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column", background: "var(--paper)" }}>
      <NavBar />
      <main className="site-content" style={{ flex: 1, paddingTop: "57px" }}>{children}</main>
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between", alignItems: "center", padding: "28px 0" }}>
        <p style={{ fontSize: ".82rem" }}>&copy; {new Date().getFullYear()} Eckman Solutions. Cincinnati, OH</p>
        <nav style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {FOOTER_NAV.map(link => (
            <Link key={link.href} href={link.href} style={{ fontSize: ".82rem", textDecoration: "none" }}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumb?: { label: string; href: string }[];
}) {
  return (
    <div className="page-header">
      <div className="wrap">
        <p className="breadcrumb">
          <a href="/">Home</a>
          {breadcrumb?.map((crumb) => (
            <span key={crumb.href}>&nbsp;/&nbsp;<a href={crumb.href}>{crumb.label}</a></span>
          ))}
          &nbsp;/&nbsp; {eyebrow}
        </p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}
