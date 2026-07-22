# Video Technique Audit — release and operating guide

Release date: 2026-07-22  
Public site: `https://kachalaba.coach`  
Product route: `https://kachalaba.coach/analysis`

## Commercial offer

- one-off Video Technique Audit: `₴2,490 / €59`;
- delivery within 48 hours after usable footage is received;
- evidence frames, three technique priorities, practical drills and a 20-minute
  follow-up call;
- professional coaching interpretation, not a medical diagnosis or guaranteed
  result;
- when the client upgrades to personal coaching, the audit price is credited
  toward the first month.

## Customer journey

1. A visitor reaches `/analysis` from the homepage hero, the compact audit panel
   or the final invitation.
2. The visitor completes the local form. The browser prepares a structured
   Ukrainian or English brief but sends and stores nothing.
3. The visitor explicitly copies the brief and opens Telegram or uses the
   prefilled WhatsApp link.
4. Mykyta confirms that the footage is usable, sends payment instructions
   manually and marks payment only after it is actually received.
5. The 48-hour delivery window starts after both usable footage and payment are
   confirmed.
6. Mykyta sends the evidence-led review, schedules the 20-minute call and offers
   personal coaching only when it fits the client's goal.

## Fulfilment checklist

- Confirm the client's name, goal, level, stroke and deadline.
- Confirm explicit permission to use the submitted video for a private coaching
  review.
- Check that the whole body and the requested stroke phase are visible.
- Confirm price and payment manually; never request card credentials in chat.
- Record the delivery deadline.
- Produce evidence frames, three ordered priorities and practical drills.
- Review the wording for medical claims, invented measurements and guarantees.
- Deliver within 48 hours and arrange the 20-minute follow-up.
- If coaching is accepted, credit the audit amount once and record the upgrade.

## Privacy and retention

- The website does not upload video or persist form data.
- Video is sent directly through the messenger chosen by the visitor.
- Keep only the material required to fulfil the review.
- Do not reuse footage in marketing, training data or public examples without a
  separate explicit permission.
- Delete local and messenger copies according to the agreed client retention
  window after fulfilment.

## Telegram operations handoff

The current fallback is the existing Telegram Business chat link. A connected
business bot may process selected chats and prepare drafts, but client-facing
messages remain approval-gated.

If direct bot intake is preferred later, set the public bot username in the
website deployment environment (without `@`):

```dotenv
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME="kachalaba_audit_bot"
```

With the variable absent, `/analysis` continues to open the existing personal
Telegram Business link. Bot tokens and AI API keys must never be added to the
website environment or client bundle.

## Launch verification

```bash
npm test
npm run lint
git diff --check
```

Before announcing the offer, verify both `/` and `/analysis`, submit one sample
brief in each language, check the WhatsApp prefill, and complete one real
Telegram approval flow from a non-admin test account.

