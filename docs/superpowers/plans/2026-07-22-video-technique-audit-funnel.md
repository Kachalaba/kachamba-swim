# Video Technique Audit Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn kachalaba.coach into a two-step revenue funnel that sells a ₴2,490 / €59 Video Technique Audit and upgrades qualified buyers into the existing monthly coaching offer.

**Architecture:** Keep the existing Deep Water editorial site and add a static, bilingual `/analysis` route. The route collects a structured brief locally in the browser, prepares a messenger-ready message without storing personal data, and routes the visitor to Mykyta's existing Telegram or WhatsApp contact. The homepage adds a clear lower-commitment CTA while personal coaching remains the primary recurring offer.

**Tech Stack:** Next.js 16, React 19, vinext, TypeScript, plain ESM helpers, Node test runner, Cloudflare Sites.

## Global Constraints

- Work only in the existing linked worktree on branch `feat/kachamba-premium-site`.
- Preserve Ukrainian and English copy for every new visible string.
- Preserve the approved Deep Water visual language, documentary media, and `prefers-reduced-motion` behavior.
- Advertise the audit as professional coaching analysis, not autonomous diagnosis or a guaranteed performance outcome.
- Price hypothesis: `₴2 490 / €59`; delivery promise: within 48 hours after usable footage is received.
- Do not add automated payment, user accounts, uploads, or a database in this phase.
- Do not transmit a video or health data from the website. The visitor chooses the messenger and sends the material directly.
- Keep the current Telegram and WhatsApp contacts as fallbacks until `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` is configured.

---

### Task 1: Lock the commercial copy and contact contract

**Files:**
- Create: `app/site-links.ts`
- Modify: `app/site-copy.ts`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Produces: `instagramUrl`, `telegramUrl`, `whatsappUrl`, `analysisPath`, and `analysisTelegramUrl()`.
- Produces: bilingual `analysisCta`, `analysisPrice`, and messenger labels in `copy`.

- [ ] **Step 1: Write the failing homepage contract**

```js
assert.match(html, /Розбір техніки за відео/);
assert.match(html, /₴2 490/);
assert.match(html, /href="\/analysis"/);
assert.match(html, /https:\/\/t\.me\/m\/mIj5epmcZGE6/);
assert.match(html, /https:\/\/wa\.me\/380970353470/);
```

- [ ] **Step 2: Run the rendered HTML test and verify RED**

Run: `npm test`

Expected: FAIL because the audit CTA, UAH pricing, and messenger links do not exist in the current branch.

- [ ] **Step 3: Add the shared link module**

```ts
export const instagramUrl = "https://www.instagram.com/kachalaba_swim/";
export const telegramUrl = "https://t.me/m/mIj5epmcZGE6";
export const whatsappUrl = "https://wa.me/380970353470";
export const analysisPath = "/analysis";

export function analysisTelegramUrl() {
  const username = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.trim();
  return username ? `https://t.me/${username}?start=analysis` : telegramUrl;
}
```

- [ ] **Step 4: Update bilingual copy and metadata**

Use these exact offer anchors:

```ts
analysisCta: "Розбір техніки за відео",
analysisPrice: "₴2 490 · відповідь до 48 годин",
analysisCta: "Video technique audit",
analysisPrice: "€59 · delivered within 48 hours",
```

Update the root metadata to `https://kachalaba.coach` and describe coaching plus video analysis without medical claims.

Render one secondary hero link to `analysisPath` and the Telegram/WhatsApp contact alternatives so the new commercial contract is visible in server-rendered HTML. Task 3 expands the same entry point into the price and final-invitation sections.

- [ ] **Step 5: Run tests and verify GREEN**

Run: `npm test`

Expected: 3 tests pass after the analysis route test from Task 2 exists; until then the existing suite remains green.

- [ ] **Step 6: Commit the commercial contract**

```bash
git add app/site-links.ts app/site-copy.ts app/layout.tsx app/page.tsx tests/rendered-html.test.mjs
git commit -m "feat: define video audit offer contract"
```

---

### Task 2: Build the bilingual audit page and local intake brief

**Files:**
- Create: `app/analysis/page.tsx`
- Create: `app/analysis/AnalysisIntake.tsx`
- Create: `app/analysis/intake.mjs`
- Create: `app/analysis/analysis-copy.ts`
- Create: `tests/analysis-page.test.mjs`
- Create: `tests/intake-message.test.mjs`

**Interfaces:**
- Consumes: contact URLs from `app/site-links.ts`.
- Produces: `buildAnalysisBrief(input)`, where `input` contains `name`, `goal`, `level`, `stroke`, `deadline`, and `videoReady`.
- Produces: static route `/analysis` with an accessible form and no server-side persistence.

- [ ] **Step 1: Write the failing message-builder tests**

```js
import { buildAnalysisBrief } from "../app/analysis/intake.mjs";

test("builds a structured Ukrainian audit brief", () => {
  const brief = buildAnalysisBrief({
    language: "uk",
    name: "Олена",
    goal: "Підготуватися до 1.9 км",
    level: "Триатлет-аматор",
    stroke: "Кроль",
    deadline: "Старт через 8 тижнів",
    videoReady: true,
  });
  assert.match(brief, /Олена/);
  assert.match(brief, /Підготуватися до 1\.9 км/);
  assert.match(brief, /Відео готове: так/);
});
```

- [ ] **Step 2: Run the unit test and verify RED**

Run: `node --test tests/intake-message.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement the pure brief builder**

```js
export function buildAnalysisBrief(input) {
  const labels = input.language === "en"
    ? { title: "Video Technique Audit", ready: "Video ready" }
    : { title: "Розбір техніки за відео", ready: "Відео готове" };
  return [
    labels.title,
    `Ім'я / Name: ${input.name.trim()}`,
    `Ціль / Goal: ${input.goal.trim()}`,
    `Рівень / Level: ${input.level}`,
    `Стиль / Stroke: ${input.stroke}`,
    `Термін / Deadline: ${input.deadline.trim() || "—"}`,
    `${labels.ready}: ${input.videoReady ? (input.language === "en" ? "yes" : "так") : (input.language === "en" ? "no" : "ні")}`,
  ].join("\n");
}
```

- [ ] **Step 4: Run the unit test and verify GREEN**

Run: `node --test tests/intake-message.test.mjs`

Expected: 2 tests pass for Ukrainian and English.

- [ ] **Step 5: Write the failing route test**

Render `/analysis` through `dist/server/index.js` and assert:

```js
assert.equal(response.status, 200);
assert.match(html, /Video Technique Audit/);
assert.match(html, /₴2 490/);
assert.match(html, /48 годин/);
assert.match(html, /Професійна інтерпретація, не медичний діагноз/);
assert.match(html, /<form/);
assert.match(html, /Підготувати повідомлення/);
```

- [ ] **Step 6: Run the route test and verify RED**

Run: `npm run build && node --test tests/analysis-page.test.mjs`

Expected: FAIL with route `/analysis` missing.

- [ ] **Step 7: Implement the route and intake component**

The page must render:

1. outcome-led hero;
2. `₴2 490 / €59` price;
3. deliverables: evidence frames, three priorities, drills, 20-minute call;
4. filming guide;
5. three-step process;
6. accessible intake form;
7. Telegram and WhatsApp handoff;
8. consent note and non-diagnosis disclaimer;
9. coaching upgrade with audit credit.

The client component must validate required fields, build the brief, copy it on explicit user action, and create a prefilled WhatsApp URL with `encodeURIComponent(brief)`. It must never submit data to a server.

- [ ] **Step 8: Run route and unit tests and verify GREEN**

Run: `npm run build && node --test tests/analysis-page.test.mjs tests/intake-message.test.mjs`

Expected: all tests pass.

- [ ] **Step 9: Commit the audit route**

```bash
git add app/analysis tests/analysis-page.test.mjs tests/intake-message.test.mjs
git commit -m "feat: add paid video technique audit funnel"
```

---

### Task 3: Integrate the audit into the existing homepage

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `analysisPath`, `telegramUrl`, and `whatsappUrl`.
- Produces: a visible audit CTA in the hero, price section, and final invitation.

- [ ] **Step 1: Extend the failing homepage assertions**

```js
assert.ok((html.match(/href="\/analysis"/g) ?? []).length >= 2);
assert.match(html, /Розбір техніки за відео/);
assert.match(html, /Менший перший крок/);
```

- [ ] **Step 2: Run the homepage test and verify RED**

Run: `npm run build && node --test tests/rendered-html.test.mjs`

Expected: FAIL because the audit entry points are absent.

- [ ] **Step 3: Add the homepage entry points**

Add:

- a secondary hero button linking to `/analysis`;
- a compact audit panel immediately before the monthly coaching price section;
- a final secondary CTA for visitors not ready for monthly coaching;
- Telegram and WhatsApp alternatives in the footer/invitation.

Do not replace the primary coaching story or turn the homepage into a software landing page.

- [ ] **Step 4: Add responsive styles**

Use existing tokens and typography. The audit panel must:

- use a quiet cyan measurement accent;
- stay one column below 760px;
- keep touch targets at least 44px;
- avoid glow, gradients, and autoplay animation;
- remain readable with reduced motion.

- [ ] **Step 5: Run tests, lint, and build**

Run:

```bash
npm test
npm run lint
```

Expected: tests pass, build exits 0, lint exits 0.

- [ ] **Step 6: Commit homepage integration**

```bash
git add app/page.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: route coaching leads through paid audit"
```

---

### Task 4: Release and publish the funnel

**Files:**
- Create: `docs/releases/2026-07-22-video-technique-audit.md`
- Modify: `README.md`

**Interfaces:**
- Produces: launch checklist, manual fulfillment workflow, and Telegram-bot handoff requirements.

- [ ] **Step 1: Document the manual operating workflow**

The release note must specify:

1. how a visitor reaches `/analysis`;
2. how the brief is copied and sent;
3. manual payment and confirmation;
4. 48-hour delivery;
5. consent and retention rules;
6. coaching upgrade credit;
7. the future bot env variable `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`.

- [ ] **Step 2: Run the full release verification**

Run:

```bash
npm test
npm run lint
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 3: Start the production preview**

Run: `npm run start`

Expected: the exact local URL is printed and both `/` and `/analysis` respond with HTTP 200.

- [ ] **Step 4: Publish through Sites**

Save a new version for the existing project in `.openai/hosting.json`, deploy it, poll until the deployment reaches a terminal state, and verify `https://kachalaba.coach/` plus `https://kachalaba.coach/analysis`.

- [ ] **Step 5: Commit release documentation**

```bash
git add docs/releases/2026-07-22-video-technique-audit.md README.md
git commit -m "docs: publish video audit operating guide"
```

## Self-Review

- Spec coverage: paid entry offer, two languages, structured intake, privacy boundary, messenger handoff, coaching upgrade, testing, and publishing each have a task.
- Placeholder scan: no implementation step relies on TBD/TODO or unspecified error handling.
- Type consistency: `analysisTelegramUrl()`, `buildAnalysisBrief(input)`, and `analysisPath` are defined once and consumed consistently.
