import type { Metadata } from "next";
import Link from "next/link";

import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { RequestForm } from "@/components/request-form";

export const metadata: Metadata = { title: "Submit a Request — Eckman Solutions Portal" };

export default async function NewRequestPage({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const params = await searchParams;
  const session = await requireSession();

  // Load projects assigned to this user (admin sees all)
  const isAdmin = session.role === "ADMIN";
  const projects = await prisma.project.findMany({
    where: isAdmin ? undefined : { userId: session.userId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <section className="wrap" style={{ padding: "40px 0", maxWidth: "640px" }}>
      <Link
        href="/portal"
        style={{ fontFamily: "monospace", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".18em", color: "var(--accent)" }}
      >
        ← Dashboard
      </Link>
      <h2
        style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", marginTop: "6px", marginBottom: "8px" }}
      >
        Submit a request
      </h2>
      <p style={{ fontSize: ".9rem", color: "var(--muted)", marginBottom: "28px", lineHeight: 1.6 }}>
        Use this form to submit content updates, support questions, or any other requests. We'll respond as soon as possible.
      </p>

      <RequestForm projects={projects} defaultProjectId={params.project} />
    </section>
  );
}
