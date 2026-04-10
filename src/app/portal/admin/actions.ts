"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

// ─── Projects ────────────────────────────────────────────────────────────────

export async function createProjectAction(formData: FormData) {
  await requireAdmin();
  try {
    await prisma.project.create({
      data: {
        name: String(formData.get("name") ?? "").trim(),
        type: String(formData.get("type") ?? "").trim(),
        status: String(formData.get("status") ?? "").trim(),
        notes: String(formData.get("notes") ?? "").trim(),
        url: String(formData.get("url") ?? "").trim(),
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
  try {
    await prisma.project.update({
      where: { id },
      data: {
        name: String(formData.get("name") ?? "").trim(),
        type: String(formData.get("type") ?? "").trim(),
        status: String(formData.get("status") ?? "").trim(),
        notes: String(formData.get("notes") ?? "").trim(),
        url: String(formData.get("url") ?? "").trim(),
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
  try {
    await prisma.invoice.create({
      data: {
        label: String(formData.get("label") ?? "").trim(),
        amount: String(formData.get("amount") ?? "").trim(),
        status: String(formData.get("status") ?? "").trim(),
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
  try {
    await prisma.invoice.update({
      where: { id },
      data: {
        label: String(formData.get("label") ?? "").trim(),
        amount: String(formData.get("amount") ?? "").trim(),
        status: String(formData.get("status") ?? "").trim(),
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
  try {
    await prisma.supportItem.create({
      data: {
        title: String(formData.get("title") ?? "").trim(),
        detail: String(formData.get("detail") ?? "").trim(),
      },
    });
  } catch (e) {
    console.error("createSupportItemAction failed:", e);
    throw e;
  }
  redirect("/portal/admin/support");
}

export async function updateSupportItemAction(id: string, formData: FormData) {
  await requireAdmin();
  try {
    await prisma.supportItem.update({
      where: { id },
      data: {
        title: String(formData.get("title") ?? "").trim(),
        detail: String(formData.get("detail") ?? "").trim(),
      },
    });
  } catch (e) {
    console.error("updateSupportItemAction failed:", e);
    throw e;
  }
  redirect("/portal/admin/support");
}

export async function deleteSupportItemAction(id: string) {
  await requireAdmin();
  try {
    await prisma.supportItem.delete({ where: { id } });
  } catch (e) {
    console.error("deleteSupportItemAction failed:", e);
    throw e;
  }
  redirect("/portal/admin/support");
}
