export type ParsedQuoteLineItem = {
  description: string;
  quantity: number;
  unitPriceCents: number;
};

export function parseCurrencyToCents(input: string): number {
  const cleaned = input.replace(/[$,\s]/g, "").trim();
  if (!cleaned) return 0;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Invalid currency value: ${input}`);
  }
  return Math.round(value * 100);
}

export function formatCents(cents: number): string {
  return `$${(Math.max(0, cents) / 100).toFixed(2)}`;
}

export function parseLineItemsText(text: string): ParsedQuoteLineItem[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error("Add at least one line item.");
  }

  return lines.map((line, index) => {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length !== 3) {
      throw new Error(`Line ${index + 1} must be: Description | Qty | Unit price`);
    }

    const [description, qtyRaw, priceRaw] = parts;
    const quantity = Number(qtyRaw);
    if (!description) {
      throw new Error(`Line ${index + 1} is missing a description.`);
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`Line ${index + 1} has invalid quantity.`);
    }

    const unitPriceCents = parseCurrencyToCents(priceRaw);
    return { description, quantity, unitPriceCents };
  });
}

export function lineItemsToText(items: Array<{ description: string; quantity: number; unitPriceCents: number }>): string {
  return items
    .map((item) => `${item.description} | ${item.quantity} | ${(item.unitPriceCents / 100).toFixed(2)}`)
    .join("\n");
}
