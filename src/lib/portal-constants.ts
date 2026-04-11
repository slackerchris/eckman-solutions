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

export const SUPPORT_STATUSES = [
  "Open",
  "In progress",
  "Resolved",
  "Closed",
] as const;

export const REQUEST_PURPOSES = [
  "New Project",
  "Change Request",
  "Support Ticket",
  "General Question",
] as const;
