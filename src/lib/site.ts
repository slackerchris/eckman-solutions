export const serviceGroups = [
  {
    tag: "Data analytics",
    title: "Reports that explain what the business is doing",
    description:
      "Turn sales, traffic, campaign, and operations data into dashboards that answer useful questions instead of producing noise.",
    bullets: [
      "KPI dashboards for revenue, leads, bookings, and operations",
      "Google Analytics, Search Console, ad platform, and spreadsheet reporting",
      "Simple executive summaries for owners and managers",
    ],
  },
  {
    tag: "Websites",
    title: "Fast, clear sites that look professional and convert",
    description:
      "Brochure sites, service sites, landing pages, and content updates built to communicate clearly and load quickly on real devices.",
    bullets: [
      "Service pages, contact flows, maps, reviews, and local SEO basics",
      "Content structures that are easy to maintain over time",
      "Hosting, updates, and ongoing technical cleanup",
    ],
  },
  {
    tag: "Web apps",
    title: "Internal tools and customer-facing apps that reduce admin work",
    description:
      "When spreadsheets and inboxes stop scaling, a focused web app can simplify intake, project tracking, quoting, or reporting.",
    bullets: [
      "Client portals, dashboards, forms, and internal admin tools",
      "Workflow automation for repetitive business tasks",
      "App structures that can grow without being rebuilt immediately",
    ],
  },
  {
    tag: "Custom software",
    title: "Bespoke tools built around your process, not generic templates",
    description:
      "Some businesses need a targeted system instead of another subscription. That means writing the right software for the actual workflow.",
    bullets: [
      "Business logic tailored to your team and service model",
      "Integrations with existing tools where it makes sense",
      "Long-term maintainability instead of one-off hacks",
    ],
  },
  {
    tag: "Hardware support",
    title: "Small business hardware solutions that work with the software",
    description:
      "Front desks, office workstations, local networking, signage, and practical hardware rollouts that fit the size of the business.",
    bullets: [
      "Device recommendations and setup for small teams",
      "Network, display, and office equipment guidance",
      "Hardware choices that support day-to-day operations",
    ],
  },
  {
    tag: "Ongoing support",
    title: "A single technical partner instead of five disconnected vendors",
    description:
      "The best outcomes usually come from steady support, clear priorities, and a short path from problem to fix.",
    bullets: [
      "Monthly support retainers or scoped project work",
      "Priority fixes, content updates, and performance improvements",
      "Clear next steps and plain-language communication",
    ],
  },
] as const;

export const stats = [
  {
    label: "Built for",
    value: "Local operators",
    detail: "Service businesses, offices, shops, contractors, and teams that need practical systems.",
  },
  {
    label: "Focus",
    value: "Low friction",
    detail: "Tools should save time, reduce confusion, and stay usable after handoff.",
  },
  {
    label: "Delivery",
    value: "One partner",
    detail: "Site, data, software, and infrastructure coordinated in one place.",
  },
  {
    label: "Domain",
    value: "eckman.solutions",
    detail: "Structured as a credible web presence with room to grow into a client platform.",
  },
] as const;

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

export const portalHighlights = [
  {
    title: "Project visibility",
    description: "Clients can see active websites, app work, due dates, and support requests in one place.",
  },
  {
    title: "Billing snapshot",
    description: "Invoices, retainers, due dates, and paid status are organized into a clear, readable dashboard.",
  },
  {
    title: "Service records",
    description: "Hosting details, update logs, and support notes give customers a cleaner history than email alone.",
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

export const faqs = [
  {
    question: "Do you only build websites?",
    answer:
      "No. Websites are one part of the offering. The broader focus is helping small businesses run better with a useful mix of web presence, analytics, apps, custom software, and hardware support.",
  },
  {
    question: "Can the client portal become a real customer account area?",
    answer:
      "Yes. This build includes the portal structure and dashboard experience. Production login, permissions, payments, and client-specific records can be connected next with a real auth and billing system.",
  },
  {
    question: "Do you handle ongoing support after launch?",
    answer:
      "Yes. Ongoing maintenance, content changes, reporting, software updates, and technical cleanup can all be handled as recurring support instead of one-off emergencies.",
  },
  {
    question: "Is this suited for local businesses rather than startups?",
    answer:
      "Yes. The messaging, service mix, and delivery model are aimed at practical businesses that need dependable systems, not venture-backed product complexity.",
  },
] as const;