export const payouts = {
  btc: {
    id: "btc" as const,
    label: "Bitcoin",
    network: "Bitcoin on-chain",
    address: "bc1qxnpfz9gy09kcm6j2fzge0k2rwmmrxlnynl2657",
    warning:
      "Send only Bitcoin (BTC) on the Bitcoin network to this bc1 address. Do not send from Ethereum, USDT, Lightning, or any other network — wrong-network transfers cannot be recovered.",
  },
  bank: {
    id: "bank" as const,
    label: "Bank transfer",
    bankName: "Lead Bank",
    accountName: "Babatunde Michael Lawal",
    accountNumber: "218121800734",
  },
} as const;

export type PaymentMethod = keyof typeof payouts;

export const paymentMethods = ["btc", "bank"] as const;

export function isPaymentMethod(value: string | null | undefined): value is PaymentMethod {
  return value === "btc" || value === "bank";
}

export type PaymentStatus =
  | "awaiting_payment"
  | "pending_review"
  | "paid"
  | "rejected"
  | "cancelled";

export function isPaymentStatus(value: string | null | undefined): value is PaymentStatus {
  return (
    value === "awaiting_payment" ||
    value === "pending_review" ||
    value === "paid" ||
    value === "rejected" ||
    value === "cancelled"
  );
}

export function paymentStatusLabel(status: string) {
  switch (status) {
    case "awaiting_payment":
      return "Awaiting payment";
    case "pending_review":
      return "Pending review";
    case "paid":
      return "Paid";
    case "rejected":
      return "Rejected";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

export function methodLabel(method: string) {
  if (method === "btc") return "Bitcoin";
  if (method === "bank") return "Lead Bank";
  return method;
}

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createPaymentReference() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let code = "";
  for (const byte of bytes) {
    code += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length];
  }
  return `APPART-${code}`;
}
