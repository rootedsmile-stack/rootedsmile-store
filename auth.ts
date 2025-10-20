
export function currency(amountCents?: number, currency = 'USD') {
  if (amountCents == null) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format((amountCents/100));
}
