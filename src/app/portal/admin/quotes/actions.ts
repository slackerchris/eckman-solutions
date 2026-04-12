"use server";

import { randomUUID } from "node:crypto";

import nodemailer from "nodemailer";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { formatCents, parseCurrencyToCents, parseLineItemsText } from "@/lib/quotes";

function getActionErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

function buildPublicQuoteUrl(token: string): string {
  return `${getBaseUrl()}/quote/${token}`;
}

async function createUniqueQuoteToken(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const token = randomUUID().replace(/-/g, "");
    const existing = await prisma.quote.findUnique({ where: { publicToken: token }, select: { id: true } });
    if (!existing) return token;
  }

  throw new Error("Failed to create a unique share token. Try again.");
}

async function ensureQuotePublicToken(id: string): Promise<{ id: string; label: string; token: string }> {
  const quote = await prisma.quote.findUnique({ where: { id }, select: { id: true, label: true, publicToken: true } });
  if (!quote) {
    throw new Error("Quote not found.");
  }

  if (quote.publicToken) {
    return { id: quote.id, label: quote.label, token: quote.publicToken };
  }

  const token = await createUniqueQuoteToken();
  await prisma.quote.update({
    where: { id: quote.id },
    data: {
      publicToken: token,
      sharedAt: new Date(),
    },
  });

  return { id: quote.id, label: quote.label, token };
}

function parsePercentage(input: string): number {
  const cleaned = input.replace(/[%,\s]/g, "").trim();
  if (!cleaned) return 0;

  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error(`Invalid tax percentage: ${input}`);
  }

  return value;
}

function parseQuoteForm(formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const status = String(formData.get("status") ?? "Draft").trim() || "Draft";
  const notes = String(formData.get("notes") ?? "").trim();
  const userId = String(formData.get("userId") ?? "").trim() || null;
  const projectId = String(formData.get("projectId") ?? "").trim() || null;
  const lineItemsRaw = String(formData.get("lineItems") ?? "").trim();
  const validUntilRaw = String(formData.get("validUntil") ?? "").trim();

  const discountCents = parseCurrencyToCents(String(formData.get("discount") ?? "0"));
  const taxPercent = parsePercentage(String(formData.get("tax") ?? "0"));

  if (!label) {
    throw new Error("Quote label is required.");
  }

  const lineItems = parseLineItemsText(lineItemsRaw);
  const subtotalCents = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0);
  const taxableBaseCents = Math.max(0, subtotalCents - discountCents);
  const taxCents = Math.round(taxableBaseCents * (taxPercent / 100));
  const totalCents = taxableBaseCents + taxCents;

  const validUntil = validUntilRaw ? new Date(`${validUntilRaw}T23:59:59.000Z`) : null;

  return {
    label,
    status,
    notes,
    userId,
    projectId,
    lineItems,
    subtotalCents,
    discountCents,
    taxCents,
    totalCents,
    validUntil,
  };
}

export async function createQuoteAction(formData: FormData) {
  await requireAdmin();

  try {
    const parsed = parseQuoteForm(formData);

    await prisma.quote.create({
      data: {
        label: parsed.label,
        status: parsed.status,
        notes: parsed.notes,
        userId: parsed.userId,
        projectId: parsed.projectId,
        subtotalCents: parsed.subtotalCents,
        discountCents: parsed.discountCents,
        taxCents: parsed.taxCents,
        totalCents: parsed.totalCents,
        validUntil: parsed.validUntil,
        lineItems: {
          create: parsed.lineItems.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            unitPriceCents: item.unitPriceCents,
            position: index,
          })),
        },
      },
    });
  } catch (error) {
    const message = getActionErrorMessage(error, "Failed to create quote.");
    redirect(`/portal/admin/quotes/new?error=${encodeURIComponent(message)}`);
  }

  redirect("/portal/admin/quotes");
}

export async function updateQuoteAction(id: string, formData: FormData) {
  await requireAdmin();

  try {
    const parsed = parseQuoteForm(formData);

    await prisma.quote.update({
      where: { id },
      data: {
        label: parsed.label,
        status: parsed.status,
        notes: parsed.notes,
        userId: parsed.userId,
        projectId: parsed.projectId,
        subtotalCents: parsed.subtotalCents,
        discountCents: parsed.discountCents,
        taxCents: parsed.taxCents,
        totalCents: parsed.totalCents,
        validUntil: parsed.validUntil,
        lineItems: {
          deleteMany: {},
          create: parsed.lineItems.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            unitPriceCents: item.unitPriceCents,
            position: index,
          })),
        },
      },
    });
  } catch (error) {
    const message = getActionErrorMessage(error, "Failed to update quote.");
    redirect(`/portal/admin/quotes/${id}/edit?error=${encodeURIComponent(message)}`);
  }

  redirect("/portal/admin/quotes");
}

export async function deleteQuoteAction(id: string) {
  await requireAdmin();

  await prisma.invoice.updateMany({
    where: { quoteId: id },
    data: { quoteId: null },
  });

  await prisma.quote.delete({ where: { id } });
  redirect("/portal/admin/quotes");
}

export async function createQuoteShareLinkAction(id: string) {
  await requireAdmin();

  try {
    const quote = await ensureQuotePublicToken(id);
    const shareUrl = buildPublicQuoteUrl(quote.token);
    redirect(`/portal/admin/quotes?message=${encodeURIComponent(`Share link ready: ${shareUrl}`)}`);
  } catch (error) {
    const message = getActionErrorMessage(error, "Failed to create share link.");
    redirect(`/portal/admin/quotes?error=${encodeURIComponent(message)}`);
  }
}

export async function emailQuoteShareLinkAction(id: string) {
  await requireAdmin();

  try {
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    if (!quote) {
      throw new Error("Quote not found.");
    }

    if (!quote.user?.email) {
      throw new Error("Link a client to this quote before emailing.");
    }

    const smtpHost = process.env.SMTP_HOST;
    if (!smtpHost) {
      throw new Error("SMTP is not configured on the server.");
    }

    const tokenData = await ensureQuotePublicToken(id);
    const shareUrl = buildPublicQuoteUrl(tokenData.token);

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Eckman Solutions" <${process.env.SMTP_USER}>`,
      to: quote.user.email,
      subject: `Your quote: ${quote.label}`,
      text: [
        `Hi ${quote.user.name},`,
        "",
        "Your quote is ready. You can view it at this secure link:",
        shareUrl,
        "",
        "No login is required to view this quote link.",
        "",
        "- Eckman Solutions",
      ].join("\n"),
    });

    await prisma.quote.update({
      where: { id: quote.id },
      data: {
        status: quote.status === "Draft" ? "Sent" : quote.status,
        sharedAt: quote.sharedAt ?? new Date(),
      },
    });

    redirect(`/portal/admin/quotes?message=${encodeURIComponent(`Quote link emailed to ${quote.user.email}`)}`);
  } catch (error) {
    const message = getActionErrorMessage(error, "Failed to email quote link.");
    redirect(`/portal/admin/quotes?error=${encodeURIComponent(message)}`);
  }
}

export async function convertQuoteToInvoiceAction(id: string) {
  await requireAdmin();

  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) {
    throw new Error("Quote not found.");
  }

  const existingInvoice = await prisma.invoice.findFirst({ where: { quoteId: id } });
  if (existingInvoice) {
    redirect(`/portal/admin/invoices/${existingInvoice.id}/edit`);
  }

  const invoice = await prisma.invoice.create({
    data: {
      label: `Quote: ${quote.label}`,
      amount: formatCents(quote.totalCents),
      status: "Draft",
      projectId: quote.projectId,
      quoteId: quote.id,
    },
  });

  await prisma.quote.update({
    where: { id: quote.id },
    data: { status: "Converted" },
  });

  redirect(`/portal/admin/invoices/${invoice.id}/edit`);
}

export async function convertQuoteToProjectAction(id: string) {
  await requireAdmin();

  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) {
    throw new Error("Quote not found.");
  }

  if (quote.projectId) {
    await prisma.quote.update({ where: { id }, data: { status: "Accepted" } });
    redirect(`/portal/admin/projects/${quote.projectId}/edit`);
  }

  const project = await prisma.project.create({
    data: {
      name: quote.label,
      type: "Quoted Work",
      status: "New",
      notes: quote.notes,
      userId: quote.userId,
    },
  });

  await prisma.quote.update({
    where: { id: quote.id },
    data: {
      projectId: project.id,
      status: "Accepted",
    },
  });

  redirect(`/portal/admin/projects/${project.id}/edit`);
}
