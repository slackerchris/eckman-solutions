"use server";

import { redirect } from "next/navigation";

import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

function getActionErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export async function markInvoicePaidAction(id: string) {
  const session = await requireSession();
  if (session.role !== "CLIENT") {
    redirect("/portal/admin/invoices");
  }

  let successRedirect = "/portal/invoices?message=" + encodeURIComponent("Invoice marked as paid.");

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        project: { select: { userId: true } },
        quote: { select: { userId: true } },
      },
    });

    if (!invoice) {
      throw new Error("Invoice not found.");
    }

    const ownsByProject = Boolean(invoice.project && invoice.project.userId === session.userId);
    const ownsByQuote = Boolean(invoice.quote && invoice.quote.userId === session.userId);
    if (!ownsByProject && !ownsByQuote) {
      throw new Error("You do not have access to this invoice.");
    }

    const status = invoice.status.toLowerCase();
    if (!["sent", "overdue"].includes(status)) {
      throw new Error("Only sent or overdue invoices can be marked paid.");
    }

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: "Paid" },
    });

    successRedirect = `/portal/invoices?message=${encodeURIComponent(`Marked ${invoice.label} as paid.`)}`;
  } catch (error) {
    const message = getActionErrorMessage(error, "Failed to update invoice.");
    redirect(`/portal/invoices?error=${encodeURIComponent(message)}`);
  }

  redirect(successRedirect);
}
