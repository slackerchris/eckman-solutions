"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

import { clearSession, createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(8),
});

export type LoginPortalState = {
  error?: string;
};

export async function loginPortalAction(
  _previousState: LoginPortalState,
  formData: FormData,
): Promise<LoginPortalState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: "Enter a valid email address and password.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!user) {
    return {
      error:
        "No portal account was found for that email. Create a user first with npm run user:create.",
    };
  }

  const passwordMatches = await bcrypt.compare(
    parsed.data.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    return {
      error: "Incorrect email or password.",
    };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  redirect("/portal");
}

export async function logoutPortalAction() {
  await clearSession();
  redirect("/portal/login");
}