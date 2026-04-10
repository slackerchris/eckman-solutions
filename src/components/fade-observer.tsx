"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function FadeObserver() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.add("js-ready");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [pathname]);
  return null;
}
