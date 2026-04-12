"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/session";

export type RequestActionState = {
  error?: string;
};

export async function submitRequestAction(
  _prev: RequestActionState,
  formData: FormData,
): Promise<RequestActionState> {
  const session = await requireSession();

  const title = String(formData.get("title") ?? "").trim();
  const detail = String(formData.get("detail") ?? "").trim();
  const category = String(formData.get("category") ?? "General").trim();
  const purpose = String(formData.get("purpose") ?? "General Question").trim();
  const projectId = String(formData.get("projectId") ?? "").trim() || null;

  if (!title) return { error: "Please enter a title for your request." };
  if (!detail) return { error: "Please describe your request." };

  // If a projectId is provided, verify it belongs to this user (or they're admin)
  if (projectId && session.role !== "ADMIN") {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.userId !== session.userId) {
      return { error: "Invalid project selected." };
    }
  }

  try {
    await prisma.supportItem.create({
      data: {
        title,
        detail,
        category,
        purpose,
        status: "Open",
        userId: session.userId,
        projectId,
      },
    });
  } catch (e) {
    console.error("submitRequestAction failed:", e);
    return { error: "Failed to submit your request. Please try again." };
  }

  redirect("/portal?submitted=1");
}
