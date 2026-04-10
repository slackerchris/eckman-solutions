export const processSteps = [
  {
    title: "Assess the bottleneck",
    description:
      "Start with the actual problem: too much manual work, a weak site, poor reporting, scattered billing, or unreliable hardware.",
  },
  {
    title: "Design the smallest useful system",
    description:
      "Choose the right mix of website improvements, analytics, software, or hardware without dragging the business into unnecessary complexity.",
  },
  {
    title: "Launch with clear ownership",
    description:
      "Ship the work, document what matters, and keep the handoff clean so nothing important depends on tribal knowledge.",
  },
] as const;

export const portalStats = [
  { label: "Active projects", value: "03" },
  { label: "Invoices due", value: "01" },
  { label: "Sites monitored", value: "04" },
  { label: "Support SLA", value: "24 hrs" },
] as const;

export const portalProjects = [
  {
    name: "Main marketing website",
    type: "Website refresh",
    status: "In progress",
    updated: "Homepage approved, service pages in build",
    link: "https://eckman.solutions",
  },
  {
    name: "Lead intake dashboard",
    type: "Web app",
    status: "Planning",
    updated: "Requirements gathered for staff intake and quote workflow",
    link: "Internal portal module",
  },
  {
    name: "Monthly performance reporting",
    type: "Analytics",
    status: "Live",
    updated: "Traffic, form fills, and local search reporting updated automatically",
    link: "Client reporting workspace",
  },
] as const;

export const invoices = [
  {
    id: "INV-2409",
    label: "Website design and launch",
    amount: "$1,400",
    status: "Due Apr 18",
  },
  {
    id: "INV-2407",
    label: "Hosting and maintenance retainer",
    amount: "$180",
    status: "Paid",
  },
  {
    id: "INV-2406",
    label: "Analytics setup",
    amount: "$320",
    status: "Paid",
  },
] as const;

export const supportQueue = [
  {
    title: "Content update request",
    detail: "Swap winter promotion copy for spring campaign and update the CTA button.",
  },
  {
    title: "Hardware planning note",
    detail: "Review front desk workstation and display recommendations before the next quarter.",
  },
  {
    title: "SEO follow-up",
    detail: "Add city-specific service pages after the core website launch is complete.",
  },
] as const;