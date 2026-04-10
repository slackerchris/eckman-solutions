"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { createSession, requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export type ProfileActionState = {
  success?: string;
  error?: string;
};

export async function updateProfileAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await requireSession();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!name) return { error: "Name is required." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  // Check email uniqueness if it changed
  if (email !== session.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "That email address is already in use." };
  }

  const updated = await prisma.user.update({
    where: { id: session.userId },
    data: { name, email },
  }).catch((e) => {
    console.error("updateProfileAction: prisma.user.update failed:", e);
    return null;
  });

  if (!updated) return { error: "Failed to update profile. Please try again." };

  // Refresh the session cookie so the header picks up the new name/email
  await createSession({
    userId: updated.id,
    email: updated.email,
    name: updated.name,
    role: updated.role,
  });

  return { success: "Profile updated." };
}

export async function changePasswordAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await requireSession();

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!current) return { error: "Enter your current password." };
  if (next.length < 8) return { error: "New password must be at least 8 characters." };
  if (next !== confirm) return { error: "Passwords do not match." };

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/portal/login");

  const matches = await bcrypt.compare(current, user.passwordHash);
  if (!matches) return { error: "Current password is incorrect." };

  const hash = await bcrypt.hash(next, 12);
  const updated = await prisma.user.update({ where: { id: session.userId }, data: { passwordHash: hash } }).catch((e) => {
    console.error("changePasswordAction: prisma.user.update failed:", e);
    return null;
  });

  if (!updated) return { error: "Failed to change password. Please try again." };

  return { success: "Password changed." };
}
