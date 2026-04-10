"use server";

import { randomBytes } from "crypto";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { createSession, requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export type InviteActionState = {
  token?: string;
  error?: string;
};

export async function createInviteAction(): Promise<InviteActionState> {
  await requireAdmin();

  const token = randomBytes(32).toString("hex");
  await prisma.invite.create({ data: { token } });

  return { token };
}

export type SignupActionState = {
  error?: string;
};

export async function signupWithInviteAction(
  token: string,
  _prev: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  const invite = await prisma.invite.findUnique({ where: { token } });

  if (!invite || invite.usedAt) {
    return { error: "This invite link is invalid or has already been used." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!name) return { error: "Name is required." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with that email already exists." };

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: "CLIENT" },
  });

  // Mark invite as used
  await prisma.invite.update({
    where: { token },
    data: { usedAt: new Date() },
  });

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  redirect("/portal");
}
