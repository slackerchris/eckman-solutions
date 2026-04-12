"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { getRequestPurposeDefinition } from "@/lib/portal-constants";

function normalizeSupportCategory(input: string | null | undefined): string {
  const category = (input ?? "").trim();
  return category || "General";
}

function mapRequestCategoryToProjectType(category: string): string {
  switch (category) {
    case "Websites":
      return "Website Build";
    case "Web Apps":
    case "Custom Software":
      return "Custom Development";
    case "Data Analytics":
      return "Consultation";
    case "Hardware & IT":
      return "Other";
    case "Not sure yet":
    case "General":
      return "Consultation";
    default:
      return "Other";
  }
}

function getAdminQueueRoute(
  queueCategory: string | null | undefined,
  projectId: string | null,
): string {
  const normalizedCategory = (queueCategory ?? "").trim().toUpperCase();

  if (normalizedCategory === "REQUEST") return "/portal/admin/requests";
  if (!projectId) return "/portal/admin/requests";
  if (normalizedCategory === "CHANGE") return "/portal/admin/changes";
  if (normalizedCategory === "SUPPORT") return "/portal/admin/support";
  return "/portal/admin/requests";
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function createProjectAction(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId") ?? "").trim() || null;
  try {
    await prisma.project.create({
      data: {
        name: String(formData.get("name") ?? "").trim(),
        type: String(formData.get("type") ?? "").trim(),
        status: String(formData.get("status") ?? "New").trim() || "New",
        notes: String(formData.get("notes") ?? "").trim(),
        url: String(formData.get("url") ?? "").trim(),
        userId,
      },
    });
  } catch (e) {
    console.error("createProjectAction failed:", e);
    throw e;
  }
  redirect("/portal/admin/projects");
}

export async function updateProjectAction(id: string, formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId") ?? "").trim() || null;
  try {
    await prisma.project.update({
      where: { id },
      data: {
        name: String(formData.get("name") ?? "").trim(),
        type: String(formData.get("type") ?? "").trim(),
        status: String(formData.get("status") ?? "").trim(),
        notes: String(formData.get("notes") ?? "").trim(),
        url: String(formData.get("url") ?? "").trim(),
        userId,
      },
    });
  } catch (e) {
    console.error("updateProjectAction failed:", e);
    throw e;
  }
  redirect("/portal/admin/projects");
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  try {
    await prisma.project.delete({ where: { id } });
  } catch (e) {
    console.error("deleteProjectAction failed:", e);
    throw e;
  }
  redirect("/portal/admin/projects");
}

// ─── Invoices ─────────────────────────────────────────────────────────────────

export async function createInvoiceAction(formData: FormData) {
  await requireAdmin();
  const projectId = String(formData.get("projectId") ?? "").trim() || null;
  const workstream = String(formData.get("workstream") ?? "").trim();
  try {
    await prisma.invoice.create({
      data: {
        label: String(formData.get("label") ?? "").trim(),
        workstream,
        amount: String(formData.get("amount") ?? "").trim(),
        status: String(formData.get("status") ?? "").trim(),
        projectId,
      },
    });
  } catch (e) {
    console.error("createInvoiceAction failed:", e);
    throw e;
  }
  redirect("/portal/admin/invoices");
}

export async function updateInvoiceAction(id: string, formData: FormData) {
  await requireAdmin();
  const projectId = String(formData.get("projectId") ?? "").trim() || null;
  const workstream = String(formData.get("workstream") ?? "").trim();
  try {
    await prisma.invoice.update({
      where: { id },
      data: {
        label: String(formData.get("label") ?? "").trim(),
        workstream,
        amount: String(formData.get("amount") ?? "").trim(),
        status: String(formData.get("status") ?? "").trim(),
        projectId,
      },
    });
  } catch (e) {
    console.error("updateInvoiceAction failed:", e);
    throw e;
  }
  redirect("/portal/admin/invoices");
}

export async function deleteInvoiceAction(id: string) {
  await requireAdmin();
  try {
    await prisma.invoice.delete({ where: { id } });
  } catch (e) {
    console.error("deleteInvoiceAction failed:", e);
    throw e;
  }
  redirect("/portal/admin/invoices");
}

// ─── Support Items ─────────────────────────────────────────────────────────────

export async function createSupportItemAction(formData: FormData) {
  await requireAdmin();
  const projectId = String(formData.get("projectId") ?? "").trim() || null;
  const category = normalizeSupportCategory(String(formData.get("category") ?? ""));
  const purposeInput = String(formData.get("purpose") ?? "").trim();
  const purposeIdInput = String(formData.get("purposeId") ?? "").trim();
  const purposeDef = getRequestPurposeDefinition(purposeIdInput, purposeInput);
  const status = String(formData.get("status") ?? "Open").trim() || "Open";
  const subStatusRaw = String(formData.get("subStatus") ?? "").trim();
  const subStatus = status === "Closed" || status === "On Hold" ? subStatusRaw : "";
  let userId: string | null = null;
  if (projectId) {
    const project = await prisma.project.findUnique({ where: { id: projectId }, select: { userId: true } });
    userId = project?.userId ?? null;
  }
  const returnTo = getAdminQueueRoute(purposeDef.queueCategory, projectId);
  try {
    await prisma.supportItem.create({
      data: {
        title: String(formData.get("title") ?? "").trim(),
        detail: String(formData.get("detail") ?? "").trim(),
        category,
        purpose: purposeDef.label,
        purposeId: purposeDef.id,
        queueCategory: purposeDef.queueCategory,
        status,
        subStatus,
        userId,
        projectId,
      },
    });
  } catch (e) {
    console.error("createSupportItemAction failed:", e);
    throw e;
  }
  redirect(returnTo);
}

export async function updateSupportItemAction(id: string, formData: FormData) {
  await requireAdmin();
  const projectId = String(formData.get("projectId") ?? "").trim() || null;
  const category = normalizeSupportCategory(String(formData.get("category") ?? ""));
  const purposeInput = String(formData.get("purpose") ?? "").trim();
  const purposeIdInput = String(formData.get("purposeId") ?? "").trim();
  const purposeDef = getRequestPurposeDefinition(purposeIdInput, purposeInput);
  const status = String(formData.get("status") ?? "Open").trim() || "Open";
  const subStatusRaw = String(formData.get("subStatus") ?? "").trim();
  const subStatus = status === "Closed" || status === "On Hold" ? subStatusRaw : "";
  const existing = await prisma.supportItem.findUnique({ where: { id }, select: { userId: true } });
  let userId = existing?.userId ?? null;
  if (projectId) {
    const project = await prisma.project.findUnique({ where: { id: projectId }, select: { userId: true } });
    userId = project?.userId ?? userId;
  }
  const returnTo = getAdminQueueRoute(purposeDef.queueCategory, projectId);
  try {
    await prisma.supportItem.update({
      where: { id },
      data: {
        title: String(formData.get("title") ?? "").trim(),
        detail: String(formData.get("detail") ?? "").trim(),
        category,
        purpose: purposeDef.label,
        purposeId: purposeDef.id,
        queueCategory: purposeDef.queueCategory,
        status,
        subStatus,
        userId,
        projectId,
      },
    });
  } catch (e) {
    console.error("updateSupportItemAction failed:", e);
    throw e;
  }
  redirect(returnTo);
}

export async function deleteSupportItemAction(id: string, returnTo?: string) {
  await requireAdmin();
  let resolvedReturnTo = returnTo;
  try {
    if (!resolvedReturnTo) {
      const existing = await prisma.supportItem.findUnique({ where: { id } });
      if (existing) {
        const purposeDef = getRequestPurposeDefinition(existing.purposeId, existing.purpose);
        resolvedReturnTo = getAdminQueueRoute(existing.queueCategory ?? purposeDef.queueCategory, existing.projectId);
      }
    }
    await prisma.supportItem.delete({ where: { id } });
  } catch (e) {
    console.error("deleteSupportItemAction failed:", e);
    throw e;
  }
  redirect(resolvedReturnTo ?? "/portal/admin/support");
}

export async function convertRequestToProjectAction(id: string) {
  await requireAdmin();

  const request = await prisma.supportItem.findUnique({ where: { id } });
  if (!request) {
    throw new Error("Request not found.");
  }

  if (request.projectId) {
    redirect(`/portal/admin/projects/${request.projectId}/edit`);
  }

  const category = normalizeSupportCategory(request.category);

  const project = await prisma.project.create({
    data: {
      name: request.title,
      type: mapRequestCategoryToProjectType(category),
      status: "New",
      notes: `Converted from request (${category} / ${request.purpose})\n\n${request.detail}`,
      userId: request.userId,
    },
  });

  await prisma.supportItem.update({
    where: { id: request.id },
    data: {
      projectId: project.id,
      status: "Closed",
      subStatus: "Converted to Project",
    },
  });

  redirect(`/portal/admin/projects/${project.id}/edit`);
}
