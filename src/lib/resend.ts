const ADMIN_NOTIFY_EMAIL = "wicxworld@gmail.com";
const ADMIN_URL = "https://appart-lilac.vercel.app/admin";

export type PaymentNotice = {
  memberName: string;
  memberEmail: string;
  memberPhone: string | null;
  memberId: string;
  plan: string;
  amountLabel: string;
  methodLabel: string;
  reference: string;
  payerNote: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function noticeLines(notice: PaymentNotice) {
  return [
    ["Member", notice.memberName],
    ["Email", notice.memberEmail],
    ["Phone", notice.memberPhone || "—"],
    ["Member ID", notice.memberId],
    ["Plan", notice.plan],
    ["Amount", notice.amountLabel],
    ["Method", notice.methodLabel],
    ["Reference", notice.reference],
    ["Note", notice.payerNote || "—"],
  ] as const;
}

export async function notifyPaymentSubmitted(notice: PaymentNotice) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "RESEND_API_KEY is not set; payment marked pending_review without email.",
    );
    return;
  }

  const from = process.env.RESEND_FROM || "Appart <onboarding@resend.dev>";
  const rows = noticeLines(notice);
  const subject = `Payment submitted: ${notice.plan} ${notice.amountLabel} via ${notice.methodLabel} (${notice.reference})`;
  const text = [
    "A member marked a membership payment as sent. Review it in admin.",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    `Admin: ${ADMIN_URL}`,
  ].join("\n");
  const html = `
    <div style="font-family:Georgia,serif;color:#1c1914;background:#fbf7f0;padding:32px">
      <p style="letter-spacing:0.28em;text-transform:uppercase;font-size:11px;color:#b08d57;margin:0">Appart</p>
      <h1 style="font-weight:500;font-size:28px;margin:12px 0 16px">Payment marked as sent</h1>
      <p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#6b6358">
        A member reported they have paid. Membership stays unpaid until an operator confirms.
      </p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;font-family:system-ui,sans-serif;font-size:14px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr>
                <td style="padding:8px 0;color:#6b6358;width:140px">${escapeHtml(label)}</td>
                <td style="padding:8px 0">${escapeHtml(value)}</td>
              </tr>`,
          )
          .join("")}
      </table>
      <p style="font-family:system-ui,sans-serif;font-size:14px">
        <a href="${ADMIN_URL}" style="color:#b08d57">Open admin to review</a>
      </p>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [ADMIN_NOTIFY_EMAIL],
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.warn(
        `Resend payment notice failed (${response.status}): ${body}`,
      );
    }
  } catch (error) {
    console.warn("Resend payment notice failed:", error);
  }
}
