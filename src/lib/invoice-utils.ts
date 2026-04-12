export const INVOICE_DISCOUNT_LINE_DESCRIPTION = "__INVOICE_DISCOUNT__";

type InvoiceLineItemLike = {
  description: string;
};

type InvoiceLineItemWithAmountLike = {
  description: string;
  quantity: number;
  unitPriceCents: number;
};

export function isInvoiceDiscountLine(item: InvoiceLineItemLike): boolean {
  return item.description === INVOICE_DISCOUNT_LINE_DESCRIPTION;
}

export function getInvoiceDiscountCentsFromLineItems(items: InvoiceLineItemWithAmountLike[]): number {
  return items
    .filter(isInvoiceDiscountLine)
    .reduce((sum, item) => sum + Math.max(0, -(item.quantity * item.unitPriceCents)), 0);
}

export function getInvoiceLineItemDisplayDescription(description: string): string {
  if (description === INVOICE_DISCOUNT_LINE_DESCRIPTION) {
    return "Discount";
  }
  return description;
}
