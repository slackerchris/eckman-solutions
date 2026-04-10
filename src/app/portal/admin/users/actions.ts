"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

// ─── Set password directly ────────────────────────────────────────────────────

export type AdminUserActionState = { error?: string; success?: string; resetLink?: string };

export async function adminSetPasswordAction(
  userId: string,
  _prev: AdminUserActionState,
  formData: FormData,
): Promise<AdminUserActionState> {
  await requireAdmin();

  const password = String(formData.get("password") ?? "").trim();
  const confirm = String(formData.get("confirm") ?? "").trim();

  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  try {
    const hash = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hash, resetToken: null, resetTokenExpiresAt: null },
    });
  } catch (e) {
    console.error("adminSetPasswordAction failed:", e);
    return { error: "Failed to update password. Please try again." };
  }

  return { success: "Password updated successfully." };
}

// ─── Generate one-time reset link ─────────────────────────────────────────────

export async function adminGenerateResetLinkAction(
  userId: string,
): Promise<AdminUserActionState> {
  await requireAdmin();

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { resetToken: token, resetTokenExpiresAt: expiresAt },
    });
  } catch (e) {
    console.error("adminGenerateResetLinkAction failed:", e);
    return { error: "Failed to generate reset link. Please try again." };
  }

  return { resetLink: token };
}

// ─── Toggle disabled ──────────────────────────────────────────────────────────

export async function adminToggleDisabledAction(userId: string, disable: boolean) {
  await requireAdmin();
  try {
    await prisma.user.update({ where: { id: userId }, data: { disabled: disable } });
  } catch (e) {
    console.error("adminToggleDisabledAction failed:", e);
    throw e;
  }
  redirect(`/portal/admin/users/${userId}`);
}

// ─── Delete user ──────────────────────────────────────────────────────────────

export async function adminDeleteUserAction(userId: string) {
  await requireAdmin();
  try {
    // Unlink projects before deleting so they aren't orphaned
    await prisma.project.updateMany({
      where: { userId },
      data: { userId: null },
    });
    await prisma.user.delete({ where: { id: userId } });
  } catch (e) {
    console.error("adminDeleteUserAction failed:", e);
    throw e;
  }
  redirect("/portal/admin/users");
}
