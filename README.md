This is a Next.js Appart project.

## Membership checkout

Plan buttons on `/plans` create a payment intent and open the method-choice page.

- `/plans` — choose Essential, Priority, or Executive (creates the payment, then continues)
- `/plans/pay/[id]` — choose Bank transfer or Bitcoin (one method only)
- `/plans/pay/[id]/bank` — Lead Bank details, reference, copy, **I've paid**
- `/plans/pay/[id]/btc` — BTC address, reference, network warning, copy, **I've paid**

**I've paid** sets the payment to `pending_review` and emails `wicxworld@gmail.com`. Membership stays unpaid until an operator confirms in Admin → Payments.

## Vercel environment

William must set these on the Appart Vercel project (Production and Preview). Do not commit keys.

- `RESEND_API_KEY` — required for operator email
- `RESEND_FROM` — optional; defaults to `Appart <onboarding@resend.dev>`

If `RESEND_API_KEY` is missing, members can still mark paid. The server logs a warning and skips the email.

Also used in production: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `ADMIN_EMAILS`.

## Getting Started

```bash
npm run dev
```

Open http://localhost:3000
