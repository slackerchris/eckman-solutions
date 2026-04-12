"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth/session";
import { getRequestPurposeDefinition } from "@/lib/portal-constants";

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
  const purposeInput = String(formData.get("purpose") ?? "").trim();
  const purposeIdInput = String(formData.get("purposeId") ?? "").trim();
  const purposeDef = getRequestPurposeDefinition(purposeIdInput, purposeInput);
  const projectId = String(formData.get("projectId") ?? "").trim() || null;

  if (!title) return { error: "Please enter a title for your request." };
  if (!detail) return { error: "Please describe your request." };
  if (purposeDef.id === "CHANGE_REQUEST" && !projectId) {
    return { error: "Please select a related project for a change request." };
  }

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
        purpose: purposeDef.label,
        purposeId: purposeDef.id,
        queueCategory: purposeDef.queueCategory,
        status: "Open",
        subStatus: "",
        userId: session.userId,
        projectId,
      },
    });
  } catch (e) {
    console.error("submitRequestAction failed:", e);

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2003") {
        return { error: "The selected project is no longer available. Please choose another project." };
      }
      if (e.code === "P2022") {
        return { error: "Portal database is updating. Please try again in a minute." };
      }
    }

    return { error: "Failed to submit your request. Please try again." };
  }

  redirect("/portal?submitted=1");
}
