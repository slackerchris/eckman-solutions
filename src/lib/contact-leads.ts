export const WEBSITE_LEAD_MARKER = "Website contact form submission";

export function isWebsiteLeadSupportItem(item: {
  detail: string;
  purposeId?: string | null;
  projectId?: string | null;
}): boolean {
  return (
    item.purposeId === "GENERAL_QUESTION" &&
    item.projectId == null &&
    item.detail.startsWith(WEBSITE_LEAD_MARKER)
  );
}
