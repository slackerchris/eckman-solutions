"use server";

import { redirect } from "next/navigation";

import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/quotes";

function getActionErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

function canClientAcceptQuoteStatus(status: string): boolean {
  return !["Accepted", "Converted", "Rejected", "Expired"].includes(status);
}

export async function acceptQuoteAction(id: string) {
  const session = await requireSession();
  if (session.role !== "CLIENT") {
    redirect("/portal/admin/quotes");
  }

  let successRedirect = `/portal/invoices`;

  try {
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        project: { select: { userId: true } },
        lineItems: { orderBy: { position: "asc" } },
      },
    });

    if (!quote) {
      throw new Error("Quote not found.");
    }

    const ownsByUser = quote.userId === session.userId;
    const ownsByProject = Boolean(quote.project && quote.project.userId === session.userId);
    if (!ownsByUser && !ownsByProject) {
      throw new Error("You do not have access to this quote.");
    }

    if (!canClientAcceptQuoteStatus(quote.status)) {
      throw new Error("This quote can no longer be accepted.");
    }

    const existingInvoice = await prisma.invoice.findFirst({ where: { quoteId: id }, select: { id: true } });

    if (!existingInvoice) {
      const createdInvoiceId = await prisma.$transaction(async (tx) => {
        const createdInvoice = await tx.invoice.create({
          data: {
            label: `Quote: ${quote.label}`,
            amount: formatCents(quote.totalCents),
            status: "Draft",
            projectId: quote.projectId,
            quoteId: quote.id,
            lineItems: {
              create: quote.lineItems.map((item, index) => ({
                description: item.description,
                quantity: item.quantity,
                unitPriceCents: item.unitPriceCents,
                position: index,
              })),
            },
          },
        });

        await tx.quote.update({
          where: { id: quote.id },
          data: { status: "Accepted" },
        });

        return createdInvoice.id;
      });

      successRedirect = `/portal/invoices/${createdInvoiceId}`;
    } else {
      if (quote.status !== "Accepted") {
        await prisma.quote.update({
          where: { id: quote.id },
          data: { status: "Accepted" },
        });
      }

      successRedirect = `/portal/invoices/${existingInvoice.id}`;
    }
  } catch (error) {
    const message = getActionErrorMessage(error, "Failed to accept quote.");
    redirect(`/portal/quotes/${id}?error=${encodeURIComponent(message)}`);
  }

  redirect(successRedirect);
}
