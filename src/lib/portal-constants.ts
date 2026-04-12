export const SERVICE_TYPES = [
  "Website Design",
  "Website Build",
  "E-commerce",
  "SEO / Marketing",
  "Maintenance",
  "Custom Development",
  "Consultation",
  "Other",
] as const;

export const PROJECT_STATUSES = [
  "New",
  "Accepted",
  "Scheduled",
  "In Progress",
  "In Review",
  "Complete",
  "On Hold",
  "Cancelled",
] as const;

export const INVOICE_STATUSES = [
  "Draft",
  "Sent",
  "Paid",
  "Overdue",
  "Cancelled",
] as const;

export const QUOTE_STATUSES = [
  "Draft",
  "Sent",
  "Accepted",
  "Rejected",
  "Expired",
  "Converted",
] as const;

export const SUPPORT_STATUSES = [
  "Open",
  "In progress",
  "On Hold",
  "Resolved",
  "Closed",
] as const;

export const SUPPORT_CLOSED_SUB_STATUSES = [
  "Completed",
  "Converted to Project",
  "Cancelled",
  "Duplicate",
  "No Response",
  "Not Needed",
] as const;

export const SUPPORT_ON_HOLD_SUB_STATUSES = [
  "Awaiting Client",
  "Awaiting Access",
  "Awaiting Third Party",
  "Scheduled",
  "Blocked",
] as const;

export const REQUEST_QUEUE_CATEGORIES = [
  "REQUEST",
  "CHANGE",
  "SUPPORT",
] as const;

export type RequestQueueCategory = (typeof REQUEST_QUEUE_CATEGORIES)[number];

export const REQUEST_PURPOSE_IDS = [
  "NEW_PROJECT",
  "CHANGE_REQUEST",
  "SUPPORT_TICKET",
  "GENERAL_QUESTION",
] as const;

export type RequestPurposeId = (typeof REQUEST_PURPOSE_IDS)[number];

export type RequestPurposeDefinition = {
  id: RequestPurposeId;
  label: string;
  queueCategory: RequestQueueCategory;
};

export const REQUEST_PURPOSE_DEFINITIONS: RequestPurposeDefinition[] = [
  { id: "NEW_PROJECT", label: "New Project", queueCategory: "REQUEST" },
  { id: "CHANGE_REQUEST", label: "Change Request", queueCategory: "CHANGE" },
  { id: "SUPPORT_TICKET", label: "Support Ticket", queueCategory: "SUPPORT" },
  { id: "GENERAL_QUESTION", label: "General Question", queueCategory: "SUPPORT" },
];

export const REQUEST_PURPOSES = REQUEST_PURPOSE_DEFINITIONS.map((p) => p.label) as ReadonlyArray<string>;

const PURPOSE_LABEL_TO_ID: Record<string, RequestPurposeId> = {
  "new project": "NEW_PROJECT",
  "change request": "CHANGE_REQUEST",
  "support ticket": "SUPPORT_TICKET",
  "general question": "GENERAL_QUESTION",
};

export function getRequestPurposeDefinitionFromId(input: string | null | undefined): RequestPurposeDefinition {
  const id = (input ?? "").trim().toUpperCase();
  return REQUEST_PURPOSE_DEFINITIONS.find((p) => p.id === id) ?? REQUEST_PURPOSE_DEFINITIONS[3];
}

export function getRequestPurposeDefinitionFromLabel(input: string | null | undefined): RequestPurposeDefinition {
  const key = (input ?? "").trim().toLowerCase();
  const mappedId = PURPOSE_LABEL_TO_ID[key];
  if (!mappedId) return REQUEST_PURPOSE_DEFINITIONS[3];
  return getRequestPurposeDefinitionFromId(mappedId);
}

export function getRequestPurposeDefinition(
  purposeId: string | null | undefined,
  purposeLabel: string | null | undefined,
): RequestPurposeDefinition {
  const normalizedId = (purposeId ?? "").trim().toUpperCase();
  if (REQUEST_PURPOSE_DEFINITIONS.some((p) => p.id === normalizedId)) {
    return getRequestPurposeDefinitionFromId(normalizedId);
  }
  return getRequestPurposeDefinitionFromLabel(purposeLabel);
}
