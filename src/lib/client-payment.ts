type PaymentLinkContext = {
  invoiceId: string;
  amount?: string;
  status?: string;
  label?: string;
  workstream?: string | null;
  projectName?: string | null;
};

function normalizeAmountToCents(amount: string | undefined): string {
  if (!amount) return "";

  const cleaned = amount.replace(/[^0-9.-]/g, "").trim();
  if (!cleaned) return "";

  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return "";

  return String(Math.round(value * 100));
}

export function buildClientPaymentUrl(
  baseUrl: string | undefined,
  context: PaymentLinkContext,
): string | null {
  const resolvedBase = baseUrl?.trim();
  if (!resolvedBase) {
    return null;
  }

  const values: Record<string, string> = {
    invoice: context.invoiceId,
    invoiceId: context.invoiceId,
    amount: context.amount?.trim() ?? "",
    amountCents: normalizeAmountToCents(context.amount),
    status: context.status?.trim() ?? "",
    label: context.label?.trim() ?? "",
    workstream: context.workstream?.trim() ?? "",
    project: context.projectName?.trim() ?? "",
  };

  // If a tokenized URL is configured, replace placeholders directly.
  if (/\{(invoice|invoiceId|amount|amountCents|status|label|workstream|project)\}/.test(resolvedBase)) {
    return resolvedBase.replace(
      /\{(invoice|invoiceId|amount|amountCents|status|label|workstream|project)\}/g,
      (_match, key: keyof typeof values) => encodeURIComponent(values[key] ?? ""),
    );
  }

  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  if (!params.toString()) {
    return resolvedBase;
  }

  try {
    const url = new URL(resolvedBase);
    params.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  } catch {
    const separator = resolvedBase.includes("?") ? "&" : "?";
    return `${resolvedBase}${separator}${params.toString()}`;
  }
}
