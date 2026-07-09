# Personal Swim Coaching Sales Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Kachamba Swim landing page around a limited-capacity personal online swimming coaching offer from $100 per month.

**Architecture:** Keep the current client-rendered, bilingual single-page architecture in `app/page.tsx`. Replace the existing adult-beginner-only narrative with a reusable translated offer model and semantic sections for audience paths, coaching system, transparent pricing, onboarding, coach context, and Instagram conversion. Keep the Deep Water palette and real selected public Instagram imagery, but adjust the CSS to support an editorial offer page rather than a local-lesson landing page.

**Tech Stack:** Vinext, React, TypeScript, CSS, Node built-in test runner, ESLint.

## Global Constraints

- Ukrainian is the default language and English is a complete, equal translation.
- Primary offer is `Personal Swim Coaching` / `Персональне онлайн-ведення з плавання` from `$100/month`, with capacity of up to 8–10 athletes.
- Entry pricing is explicit: two weekly swim workouts ($80/month) plus a quarterly gym plan ($60/quarter, shown as $20/month); three weekly swim workouts are from $140/month including the gym plan.
- Include individual swim plans, quarterly gym plan, video analysis, chat, and regular calls; do not state a response-time SLA, fixed call count, unlimited access, results guarantee, or current number of remaining places.
- Every conversion action opens `https://www.instagram.com/kachamba_swim/` in a new tab. No form, checkout, or collection of personal data is added.
- Preserve the Deep Water visual direction, responsive layout, reduced-motion support, accessible focus states, and only the existing selected real public-facing images.
- Do not add testimonials, case studies, invented proof, unsupported credentials, or outcome guarantees.

---

## File Structure

- Modify: `app/page.tsx` — bilingual copy model, page semantics, product sections, all Instagram conversion surfaces.
- Modify: `app/globals.css` — Deep Water editorial layout for the new offer; responsive and reduced-motion styling.
- Modify: `app/layout.tsx` — page title, description, Open Graph/Twitter description aligned to online coaching.
- Modify: `tests/rendered-html.test.mjs` — server-render contract for the offer, price, two audience routes, and conversion link.

### Task 1: Define the rendered offer contract

**Files:**
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: SSR output from `dist/server/index.js` after `npm run build`.
- Produces: A regression test that requires Ukrainian primary copy, both audience paths, transparent entry price, capacity statement, and the Instagram handle.

- [ ] **Step 1: Write the failing test**

Replace the current single-headline assertion with these service-specific assertions:

```js
assert.match(html, /Персональне онлайн-ведення з плавання/);
assert.match(html, /Від \$100\/місяць/);
assert.match(html, /Для дорослих, які починають/);
assert.match(html, /Для триатлетів-любителів/);
assert.match(html, /До 8–10 спортсменів одночасно/);
assert.match(html, /kachamba_swim/);
assert.match(html, /lang="uk"/);
assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: FAIL because the old page contains `Почніть плавати красиво.` and none of the new product-specific phrases.

- [ ] **Step 3: Commit the red test**

```bash
git add tests/rendered-html.test.mjs
git commit -m "test: define online coaching offer contract"
```

### Task 2: Replace page content and structure with the personal-coaching offer

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `Language = "uk" | "en"`, the Instagram URL, and the Task 1 rendered-page contract.
- Produces: A language-selected `<main>` containing sections with IDs `audiences`, `system`, `price`, `start`, and `coach`; all CTA anchors use the same Instagram URL and `target="_blank" rel="noreferrer"`.

- [ ] **Step 1: Add the new Ukrainian and English content model**

Make the Ukrainian hero explicit and give English equivalent meaning:

```ts
uk: {
  label: "Онлайн-ведення з плавання · Україна та світ",
  headline: "Плавання, яке підлаштоване під ваше життя.",
  offer: "Персональне онлайн-ведення з плавання",
  price: "Від $100/місяць",
  capacity: "До 8–10 спортсменів одночасно",
  cta: "Запитати про місце",
  audienceTitle: "Один процес. Дві різні стартові точки.",
  audiences: [
    ["Для дорослих, які починають", "Щоб вода перестала бути напругою, а техніка — чужою мовою."],
    ["Для триатлетів-любителів", "Щоб плисти економніше, впевненіше й берегти ресурс для решти дистанції."],
  ],
}
```

Translate every visible string into English, including price breakdown, system labels, first-week sequence, CTA instruction, and footer. Do not leave Ukrainian content in the English UI except the coach's name and `@kachamba_swim`.

- [ ] **Step 2: Render the offer sequence**

Use semantic sections in this order, retaining the language switch and wordmark:

```tsx
<section className="hero" id="top">...</section>
<section className="audiences section" id="audiences" aria-labelledby="audiences-title">...</section>
<section className="coaching-system section" id="system" aria-labelledby="system-title">...</section>
<section className="pricing section" id="price" aria-labelledby="price-title">...</section>
<section className="first-week section" id="start" aria-labelledby="start-title">...</section>
<section className="coach section" id="coach" aria-labelledby="coach-title">...</section>
<section className="final-cta">...</section>
```

Render the five coaching components as data-driven cards: personal swim plan, quarterly gym plan, video analysis, chat, and calls. Render price facts as plain visible text:

```tsx
<p className="price-main">{t.price}</p>
<p>2 тренування з плавання щотижня — $80/місяць</p>
<p>План для залу на квартал — $60 / $20 на місяць</p>
<p>3 тренування з плавання щотижня + зал — від $140/місяць</p>
```

Use English equivalents under `copy.en`. The final CTA must prompt a qualified Instagram message asking for goal, city/pool access, and available weekly sessions.

- [ ] **Step 3: Update document metadata**

Set title and descriptions in `app/layout.tsx` to describe the offer without claims:

```ts
title: "Mykyta Kachalaba — Personal Swim Coaching",
description: "Personal online swimming coaching with individual plans, video analysis, chat and calls. From $100 per month.",
```

Use the same accurate English description for Open Graph and Twitter metadata while retaining the existing `/og.png` image.

- [ ] **Step 4: Run the rendered-page test to verify it passes**

Run: `npm test`

Expected: PASS with one passing test and no starter-preview text in the HTML.

- [ ] **Step 5: Commit the content and metadata**

```bash
git add app/page.tsx app/layout.tsx tests/rendered-html.test.mjs
git commit -m "feat: sell personal swim coaching online"
```

### Task 3: Recompose the Deep Water visual system for conversion

**Files:**
- Modify: `app/globals.css`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: the section class names from Task 2: `audiences`, `coaching-system`, `pricing`, `first-week`, `coach`, and `final-cta`.
- Produces: a responsive, readable dark premium page that retains focus indicators and disables nonessential animation for `prefers-reduced-motion`.

- [ ] **Step 1: Add the new section layouts**

Add explicit grid rules rather than relying on the retired `recognition`, `method`, and `gallery` styles:

```css
.audience-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; margin-top:clamp(56px,8vw,108px); }
.audience-card { min-height:360px; padding:clamp(28px,4vw,56px); border:1px solid var(--line); background:linear-gradient(145deg,rgba(159,221,226,.12),transparent 60%); }
.system-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; margin-top:64px; }
.pricing { background:var(--pearl); color:var(--ink); }
.price-main { margin:0; font-size:clamp(62px,10vw,150px); letter-spacing:-.08em; line-height:.85; }
.first-week-list { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; margin-top:64px; }
```

Keep the existing navy, pearl, aqua, border, focus-visible, and reduced-motion tokens. Do not use gradients that reduce text contrast below readable levels.

- [ ] **Step 2: Add mobile rules for the new grids**

Within the existing `@media (max-width:760px)` block, collapse the audience and first-week layouts to one column and the system grid to two columns:

```css
@media (max-width:760px) {
  .audience-grid,.first-week-list { grid-template-columns:1fr; }
  .system-grid { grid-template-columns:repeat(2,1fr); }
  .audience-card { min-height:260px; }
  .price-main { font-size:clamp(58px,17vw,92px); }
}
```

- [ ] **Step 3: Run automated validation**

Run: `npm test && npm run lint`

Expected: one rendered-page test passes; lint has no errors. Existing `no-img-element` messages may remain warnings only.

- [ ] **Step 4: Commit the visual update**

```bash
git add app/globals.css
git commit -m "style: refocus deep water design on coaching"
```

### Task 4: Verify the complete conversion path

**Files:**
- Verify: `app/page.tsx`, `app/globals.css`, `app/layout.tsx`, `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: completed build and the local dev server.
- Produces: evidence that desktop/mobile pages render, language switching changes all visible content, and CTA links target Instagram.

- [ ] **Step 1: Run production checks**

Run: `npm run build && npm test && npm run lint`

Expected: build completes; test passes; lint exits zero with no errors.

- [ ] **Step 2: Review the desktop page**

Run: `npm run dev`

Open `http://localhost:3000/` at desktop width. Confirm the $100 price, both audience cards, five coaching components, capacity note, first-seven-days sequence, coach image, and final CTA have no clipping or horizontal scrollbar.

- [ ] **Step 3: Review the mobile page and English variant**

At 390px width, confirm the grids stack, CTA remains visible, and no text overlaps. Switch to English and confirm the hero, audience cards, price explanation, first-week sequence, and CTA are translated.

- [ ] **Step 4: Check conversion links**

Inspect all anchors whose visible label is a CTA. Confirm each has `href="https://www.instagram.com/kachamba_swim/"`, `target="_blank"`, and `rel="noreferrer"`.

- [ ] **Step 5: Commit any verification-driven fixes and push the branch**

```bash
git add app/page.tsx app/globals.css app/layout.tsx tests/rendered-html.test.mjs
git commit -m "fix: polish personal coaching conversion flow"
git push
```

Only create the final commit when verification requires a source change. If no source changes are required, run `git push` without creating an empty commit.

