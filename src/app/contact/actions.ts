"use server";

import nodemailer from "nodemailer";
import { z } from "zod";

const schema = z.object({
  name:    z.string().min(1, "Name is required").max(100),
  email:   z.string().email("Enter a valid email address"),
  phone:   z.string().max(30).optional(),
  service: z.string().max(80).optional(),
  message: z.string().min(10, "Please include a brief message").max(5000),
});

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
    } catch {
      return { success: false, error: "Failed to send message. Please try again or email chris@eckman.solutions directly." };
    }
  }

  return { success: true };
}
