"use client";

import { useRouter } from "next/navigation";

export function PortalExitLink() {
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    const confirmed = window.confirm("Leave the portal and return to the website?");
    if (confirmed) router.push("/");
  }

  return (
    <a href="/" onClick={handleClick} style={{ color: "inherit", textDecoration: "none" }}>
      {typeof window !== "undefined" ? window.location.hostname : "eckman.solutions"}
    </a>
  );
}
