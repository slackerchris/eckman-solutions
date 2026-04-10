"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export type ResetPasswordState = { error?: string };

export async function resetPasswordAction(
  _prev: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const confirm = String(formData.get("confirm") ?? "").trim();

  if (!token) return { error: "Invalid reset link." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  const user = await prisma.user.findUnique({ where: { resetToken: token } });

  if (!user || user.disabled) return { error: "This reset link is invalid or has expired." };
  if (!user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
    return { error: "This reset link has expired. Ask your administrator for a new one." };
  }

  const hash = await bcrypt.hash(password, 12);

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hash, resetToken: null, resetTokenExpiresAt: null },
    });
  } catch (e) {
    console.error("resetPasswordAction failed:", e);
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/portal/login?reset=1");
}
