export const PAYMENT_NOTIFY_TO = "wicxworld@gmail.com";
export const ADMIN_PAYMENTS_URL = "https://appart-lilac.vercel.app/admin";

const DEFAULT_FROM = "Appart <onboarding@resend.dev>";

export type PaymentNotifyInput = {
  memberEmail: string;
  memberName: string;
  memberPhone: string | null;
  memberId: string;
  plan: string;
  amountUsd: string;
  method: string;
  reference: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function noticeRows(input: PaymentNotifyInput) {
  return [
    ["Member", input.memberName],
    ["Email", input.memberEmail],
    ["Phone", input.memberPhone || "—"],
    ["Member ID", input.memberId],
    ["Plan", input.plan],
    ["Amount", input.amountUsd],
    ["Method", input.method],
    ["Reference", input.reference],
  ] as const;
}

function renderText(input: PaymentNotifyInput) {
  return [
    "A member marked a membership payment as sent.",
    "",
    ...noticeRows(input).map(([label, value]) => `${label}: ${value}`),
    "",
    "Review it in Admin:",
    ADMIN_PAYMENTS_URL,
  ].join("\n");
}

function renderHtml(input: PaymentNotifyInput) {
  const table = noticeRows(input)
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 0;color:#6b6358;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;width:140px;font-family:ui-sans-serif,system-ui,sans-serif;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;color:#1c1914;font-size:15px;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f4efe6;padding:32px;">
    <div style="max-width:560px;margin:0 auto;background:#fbf7f0;border:1px solid #e4d8c4;padding:36px;">
      <p style="margin:0;font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#b08d57;">Appart</p>
      <h1 style="margin:16px 0 0;font-family:Georgia,serif;font-weight:normal;font-size:32px;color:#1c1914;">Payment marked sent</h1>
      <p style="margin:16px 0 0;font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.6;color:#6b6358;">
        A member says they have paid. Confirm or reject it in Admin. Membership stays unpaid until you confirm.
      </p>
      <table style="width:100%;margin-top:28px;border-collapse:collapse;">${table}</table>
      <p style="margin:32px 0 0;">
        <a href="${ADMIN_PAYMENTS_URL}" style="display:inline-block;background:#1c1914;color:#f4efe6;padding:14px 22px;text-decoration:none;letter-spacing:0.2em;text-transform:uppercase;font-size:11px;font-family:ui-sans-serif,system-ui,sans-serif;">Open Admin</a>
      </p>
      <p style="margin:20px 0 0;font-family:ui-sans-serif,system-ui,sans-serif;font-size:12px;color:#6b6358;">
        ${ADMIN_PAYMENTS_URL}
      </p>
    </div>
  </body>
</html>`;
}

export async function sendPaymentMarkedEmail(
  input: PaymentNotifyInput,
): Promise<{ sent: boolean; warning?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn(
      "[appart] RESEND_API_KEY is not set. Payment is pending_review but no email was sent to",
      PAYMENT_NOTIFY_TO,
      "— set RESEND_API_KEY (and optional RESEND_FROM) on Vercel.",
    );
    return {
      sent: false,
      warning:
        "Payment recorded. Operator email was skipped because RESEND_API_KEY is not set.",
    };
  }

  const from = process.env.RESEND_FROM?.trim() || DEFAULT_FROM;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [PAYMENT_NOTIFY_TO],
        subject: `Appart payment to review · ${input.reference}`,
        html: renderHtml(input),
        text: renderText(input),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(
        "[appart] Resend rejected the payment email:",
        response.status,
        body.slice(0, 500),
      );
      return {
        sent: false,
        warning:
          "Payment recorded, but the operator email could not be sent. Check Resend and RESEND_API_KEY on Vercel.",
      };
    }

    return { sent: true };
  } catch (error) {
    console.error("[appart] Resend payment email failed:", error);
    return {
      sent: false,
      warning: "Payment recorded, but the operator email could not be sent.",
    };
  }
}
