import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const SUCCESS_EVENT_TYPES = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "payment_intent.succeeded",
  "charge.succeeded",
  "invoice.payment_succeeded",
]);

function pickInvoiceIdFromMetadata(metadata: Stripe.Metadata | null | undefined): string | null {
  if (!metadata) return null;

  const invoiceId = (metadata.invoiceId ?? metadata.invoice_id ?? metadata.invoice ?? "").trim();
  return invoiceId || null;
}

async function pickInvoiceIdFromPaymentIntent(
  stripe: Stripe,
  paymentIntentId: string | null | undefined,
): Promise<string | null> {
  const normalizedId = (paymentIntentId ?? "").trim();
  if (!normalizedId) return null;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(normalizedId);
    return pickInvoiceIdFromMetadata(paymentIntent.metadata);
  } catch (error) {
    console.error("stripe webhook: failed to retrieve payment intent", error);
    return null;
  }
}

async function resolveInvoiceIdFromEvent(stripe: Stripe, event: Stripe.Event): Promise<string | null> {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      const fromClientReference = (session.client_reference_id ?? "").trim();
      if (fromClientReference) return fromClientReference;

      const fromSessionMetadata = pickInvoiceIdFromMetadata(session.metadata);
      if (fromSessionMetadata) return fromSessionMetadata;

      const paymentIntentId =
        typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
      return pickInvoiceIdFromPaymentIntent(stripe, paymentIntentId);
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      return pickInvoiceIdFromMetadata(paymentIntent.metadata);
    }

    case "charge.succeeded": {
      const charge = event.data.object as Stripe.Charge;
      const fromChargeMetadata = pickInvoiceIdFromMetadata(charge.metadata);
      if (fromChargeMetadata) return fromChargeMetadata;

      const paymentIntentId =
        typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
      return pickInvoiceIdFromPaymentIntent(stripe, paymentIntentId);
    }

    case "invoice.payment_succeeded": {
      const stripeInvoice = event.data.object as Stripe.Invoice;
      return pickInvoiceIdFromMetadata(stripeInvoice.metadata);
    }

    default:
      return null;
  }
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripeSecretKey || !stripeWebhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = new Stripe(stripeSecretKey);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature.";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  if (!SUCCESS_EVENT_TYPES.has(event.type)) {
    return NextResponse.json({ received: true, ignored: true, eventType: event.type });
  }

  const invoiceId = await resolveInvoiceIdFromEvent(stripe, event);
  if (!invoiceId) {
    return NextResponse.json({
      received: true,
      ignored: true,
      eventType: event.type,
      reason: "No invoice identifier found in Stripe event metadata.",
    });
  }

  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId }, select: { id: true, status: true } });
  if (!invoice) {
    return NextResponse.json({
      received: true,
      ignored: true,
      eventType: event.type,
      invoiceId,
      reason: "Invoice not found.",
    });
  }

  if (invoice.status.toLowerCase() !== "paid") {
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: "Paid" },
    });
  }

  return NextResponse.json({
    received: true,
    eventType: event.type,
    invoiceId,
    status: "Paid",
  });
}
