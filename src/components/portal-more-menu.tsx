"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutPortalAction } from "@/app/portal/actions";

type PortalMoreMenuProps = {
  role: "ADMIN" | "CLIENT";
};

export function PortalMoreMenu({ role }: PortalMoreMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          border: "1px solid var(--border)",
          borderRadius: "999px",
          padding: "6px 12px",
          color: "var(--muted)",
          background: "transparent",
          cursor: "pointer",
          userSelect: "none",
          fontSize: ".85rem",
        }}
      >
        More
      </button>

      {open ? (
        <div
          role="menu"
          style={{
            position: "absolute",
            right: 0,
            marginTop: "6px",
            minWidth: "180px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "8px",
            display: "grid",
            gap: "4px",
            zIndex: 30,
          }}
        >
          {role === "ADMIN" ? (
            <Link
              href="/portal/admin/quotes"
              onClick={() => setOpen(false)}
              style={{ padding: "8px 10px", borderRadius: "8px", color: "var(--muted)", textDecoration: "none" }}
            >
              Quotes
            </Link>
          ) : null}

          {role === "ADMIN" ? (
            <Link
              href="/portal/admin/leads"
              onClick={() => setOpen(false)}
              style={{ padding: "8px 10px", borderRadius: "8px", color: "var(--muted)", textDecoration: "none" }}
            >
              Leads
            </Link>
          ) : null}

          <Link
            href="/portal/profile"
            onClick={() => setOpen(false)}
            style={{ padding: "8px 10px", borderRadius: "8px", color: "var(--muted)", textDecoration: "none" }}
          >
            Profile
          </Link>

          {role === "ADMIN" ? (
            <Link
              href="/portal/admin"
              onClick={() => setOpen(false)}
              style={{ padding: "8px 10px", borderRadius: "8px", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}
            >
              Admin
            </Link>
          ) : null}

          <form action={logoutPortalAction}>
            <button
              type="submit"
              onClick={() => setOpen(false)}
              style={{
                width: "100%",
                textAlign: "left",
                border: "none",
                borderRadius: "8px",
                padding: "8px 10px",
                color: "var(--ink)",
                background: "transparent",
                cursor: "pointer",
                fontSize: ".85rem",
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
