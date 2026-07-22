# Localized Pricing and HTF Affiliation Design

## Goal

Localize the Ukrainian offer in hryvnias without weakening the international English version, and acknowledge Mykyta's coaching role at Happy Tri Friends as an editorial affiliation rather than a commercial partnership or competing offer.

The result should preserve the approved **Water as Interface** direction: precise, restrained, and expressive enough for a progressive creative audience.

## Chosen direction

Use locale-specific fixed prices.

- The Ukrainian version uses rounded hryvnia prices.
- The English version keeps the existing dollar prices.
- Prices are editorial values, not a live currency conversion.
- Happy Tri Friends receives a quiet typographic affiliation in the hero and a contextual link in the coach biography.
- No HTF logo, subscription card, discount, referral language, or shared commercial offer is introduced.

## Pricing

The Ukrainian values are rounded from the existing dollar prices using the official NBU rate for 14 July 2026, then fixed as product prices:

- Swim plan, two weekly sessions: **3 600 грн/місяць**.
- Strength plan: **+900 грн/місяць**.
- Full coaching, two swim sessions plus strength: **4 500 грн/місяць**.
- Full coaching, three swim sessions plus strength: **від 6 300 грн/місяць**.

The Ukrainian hero and large pricing anchor use **Повне ведення — від 4 500 грн/місяць** and **Від 4 500 грн/місяць** respectively.

The English version retains:

- Swim plan, two weekly sessions: **$80/month**.
- Strength plan: **+$20/month**.
- Full coaching, two swim sessions plus strength: **from $100/month**.
- Full coaching, three swim sessions plus strength: **from $140/month**.

Add a short clarification beneath the pricing facts:

- Ukrainian: **Вартість персонального ведення. Басейн і клубні абонементи оплачуються окремо.**
- English: **Pricing covers personal coaching. Pool access and club memberships are paid separately.**

This separates personal online coaching from HTF's in-person club subscriptions without comparing or ranking the two products.

## Happy Tri Friends affiliation

### Hero annotation

Connect the HTF kit visible in the opening photograph to Mykyta's real coaching context through the existing right-side documentary rail.

- Add one external text link: **COACH AT HAPPY TRI FRIENDS ↗**.
- Link to `https://happytrifriends.com` in a new tab with `rel="noreferrer"`.
- Keep the default state quiet and pearl-toned.
- On pointer hover or keyboard focus, reveal a thin HTF-gold line and shift the text to a restrained gold accent derived from the club's visual identity.
- Do not add a filled yellow button, card, badge, floating logo, or additional hero animation.

### Coach biography

Keep the current biography, but render **Happy Tri Friends** as an inline external link instead of the unexplained abbreviation `HTF`.

- Ukrainian: identify Mykyta as a swimming coach and a coach at the Kyiv triathlon club Happy Tri Friends.
- English: identify Mykyta as a swimming coach and a coach at Happy Tri Friends, a Kyiv triathlon club.
- The link uses the existing editorial text-link language and the same restrained gold focus/hover accent.
- The existing Instagram link remains the primary conversion link; the club link is contextual, not a CTA.

## Component and copy boundaries

- `app/site-copy.ts` owns localized hryvnia and dollar prices, the pricing clarification, the hero affiliation label, and biography fragments around the club name.
- `app/page.tsx` renders the hero affiliation link, localized price values, clarification, and semantic inline club link.
- `app/globals.css` owns the restrained HTF-gold hover/focus treatment and responsive placement.
- No new component or dependency is required.

## Responsive behavior

- Desktop keeps the hero affiliation in the vertical documentary rail.
- Mobile moves the affiliation into a small horizontal line immediately after the hero facts and before the hero CTA; it must not become vertical, overlap copy, or reduce the CTA touch target.
- The coach biography link wraps naturally in both languages.
- Pricing lines remain readable without horizontal overflow at 333, 390, 1366, and 1470 pixel viewports.

## Accessibility and external-link safety

- Both HTF links are reachable by keyboard and receive a visible focus state.
- The gold accent is supplementary; the external-link arrow and text remain visible without color.
- External links use `target="_blank"` and `rel="noreferrer"`.
- Screen-reader labels identify Happy Tri Friends and the fact that the destination opens externally.
- Reduced-motion mode removes any line expansion while preserving the color and focus-state change.

## Validation

- Verify server-rendered Ukrainian markup contains `3 600`, `4 500`, `6 300`, the clarification, and the HTF URL.
- Verify server-rendered English markup retains `$80`, `$100`, and `$140`.
- Verify switching languages updates all price anchors without leaving mixed currencies in the active locale.
- Verify the hero and biography links both resolve to `https://happytrifriends.com` and use safe external-link attributes.
- Verify hover, keyboard focus, mobile placement, no horizontal overflow, and reduced-motion behavior in browser QA.
- Run the existing build, render tests, media-budget tests, lint, and desktop/mobile production checks.

## Out of scope

- Synchronizing prices with the HTF subscription catalogue.
- Discounts, referral tracking, member benefits, shared checkout, or HTF authentication.
- Live exchange-rate conversion or automatic price updates.
- Copying the HTF logo, photography, subscription UI, or yellow card treatment.
- Changing the approved Instagram conversion path.
