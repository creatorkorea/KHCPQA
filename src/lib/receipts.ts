export function formatInquiryReceipt(id: string, createdAt: string | Date = new Date()) {
  const year = new Date(createdAt).getFullYear();
  return `KHCPQA-${year}-${id}`;
}

export function parseInquiryReceipt(receipt: string) {
  return receipt.trim().replace(/^KHCPQA-\d{4}-/i, "").toLowerCase();
}
