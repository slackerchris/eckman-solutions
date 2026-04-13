"use server";

import nodemailer from "nodemailer";
import { z } from "zod";

import { WEBSITE_LEAD_MARKER } from "@/lib/contact-leads";
import { prisma } from "@/lib/prisma";
import { getRequestPurposeDefinition } from "@/lib/portal-constants";

const schema = z.object({
  name:    z.string().min(1, "Name is required").max(100),
  email:   z.string().email("Enter a valid email address"),
  phone:   z.string().max(30).optional(),
  service: z.string().max(80).optional(),
  message: z.string().min(10, "Please include a brief message").max(5000),
});

const CONTACT_PURPOSE = getRequestPurposeDefinition("GENERAL_QUESTION", null);

export type ContactState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name:    formData.get("name"),
    email:   formData.get("email"),
    phone:   formData.get("phone"),
    service: formData.get("service"),
    message: formData.get("message"),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
      fieldErrors[key] = msgs?.[0] ?? "Invalid";
    }
    return { success: false, fieldErrors };
  }

  const { name, email, phone, service, message } = parsed.data;

  const detail = [
    WEBSITE_LEAD_MARKER,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "Phone: (not provided)",
    service ? `Service: ${service}` : "Service: (not selected)",
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    await prisma.supportItem.create({
      data: {
        title: service ? `${service} inquiry from ${name}` : `Website inquiry from ${name}`,
        detail,
        category: service?.trim() || "General",
        purpose: CONTACT_PURPOSE.label,
        purposeId: CONTACT_PURPOSE.id,
        queueCategory: CONTACT_PURPOSE.queueCategory,
        status: "Open",
        subStatus: "",
      },
    });
  } catch (error) {
    console.error("submitContact supportItem create failed:", error);
    return {
      success: false,
      error: "Failed to submit message. Please try again.",
    };
  }

  // Only attempt email if SMTP env vars are configured
  const smtpHost = process.env.SMTP_HOST;
  if (smtpHost) {
    try {
      const transporter = nodemailer.createTransport({
        host:   smtpHost,
        port:   Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from:    `"Eckman Solutions Site" <${process.env.SMTP_USER}>`,
        to:      process.env.CONTACT_TO ?? "chris@eckman.solutions",
        replyTo: email,
        subject: `New contact from ${name}`,
        text: [
          `Name:    ${name}`,
          `Email:   ${email}`,
          phone ? `Phone:   ${phone}` : null,
          service ? `Service: ${service}` : null,
          ``,
          message,
        ].filter(Boolean).join("\n"),
      });
    } catch (error) {
      console.error("submitContact email failed:", error);
    }
  }

  return { success: true };
}
