# Localized Pricing, HTF Affiliation, and Vercel Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved hryvnia pricing and restrained Happy Tri Friends affiliation, while making the same repository deploy cleanly to both OpenAI Sites/vinext and Vercel/Next.js.

**Architecture:** Keep localized product copy in `app/site-copy.ts`, render only semantic links and copy structure in `app/page.tsx`, and keep all responsive/editorial treatment in `app/globals.css`. Preserve the existing vinext build for Sites, but add a separate native Next.js build target selected by `vercel.json`; use a Next-specific TypeScript config so Cloudflare worker-only modules do not contaminate the Vercel application build.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, vinext/Vite for Sites, native `next build` for Vercel, Node test runner, Chrome DevTools Protocol browser QA, ESLint.

## Global Constraints

- Preserve the approved **Water as Interface** interaction and the existing full-bleed hero behavior.
- Keep Ukrainian prices fixed in UAH and English prices fixed in USD; do not perform live currency conversion.
- Present Happy Tri Friends as a respectful editorial affiliation, not a partnership, discount, referral, or competing offer.
- Keep Instagram as the primary conversion path.
- Preserve keyboard access, visible focus, reduced-motion behavior, and zero horizontal overflow at 333, 390, 1366, and 1470 pixels.
- Keep `npm run build` as the Sites/vinext build; Vercel must opt into its own native Next.js command.
- Do not suppress TypeScript build errors globally.

---

## Task 1: Lock the localized pricing and affiliation contract in render tests

**Files:**

- Modify: `tests/rendered-html.test.mjs`

- [ ] **Step 1: Replace the obsolete Ukrainian dollar assertions with the approved UAH contract**

Replace the current hero, anchor, and pricing assertions with explicit checks for:

```js
assert.match(html, /Повне ведення — від 4 500 грн\/місяць/);
assert.match(html, /Від 4 500 грн\/місяць/);
assert.match(html, /2 тренування щотижня — 3 600 грн\/місяць/);
assert.match(html, /Силовий план — \+900 грн\/місяць/);
assert.match(html, /від 6 300 грн\/місяць/);
assert.match(
  html,
  /Вартість персонального ведення\. Басейн і клубні абонементи оплачуються окремо\./,
);
```

- [ ] **Step 2: Add semantic and safety assertions for Happy Tri Friends**

Assert that the rendered Ukrainian document contains the full club name, three HTF links (desktop hero, responsive hero duplicate, and coach biography), and safe external-link attributes:

```js
const htfLinks = html.match(
  /href="https:\/\/happytrifriends\.com" target="_blank" rel="noreferrer"/g,
) ?? [];
assert.equal(htfLinks.length, 3);
assert.match(html, /COACH AT HAPPY TRI FRIENDS/);
assert.match(html, /київського триатлонного клубу[\s\S]*Happy Tri Friends/);
```

- [ ] **Step 3: Add a source-level locale contract for the English prices**

Because the server initially renders Ukrainian and language switching is client-side, import the source copy or read `app/site-copy.ts` in the test and verify that the English locale retains `$80`, `$100`, `$140`, plus the English clarification. The test should also assert that the Ukrainian price fields contain no `$` and the English price fields contain no `грн`.

- [ ] **Step 4: Run the focused test and confirm the new assertions fail for the intended reason**

Run:

```bash
npm run build
node --test tests/rendered-html.test.mjs
```

Expected: the build succeeds, then the render test fails because the old dollar copy and missing HTF links do not satisfy the new contract.

- [ ] **Step 5: Commit the red contract**

```bash
git add tests/rendered-html.test.mjs
git commit -m "test: define localized pricing and HTF contract"
```

---

## Task 2: Implement locale-owned prices and semantic HTF links

**Files:**

- Modify: `app/site-copy.ts`
- Modify: `app/page.tsx`
- Test: `tests/rendered-html.test.mjs`

- [ ] **Step 1: Add one shared external destination**

Near `instagramUrl`, add:

```ts
export const happyTriFriendsUrl = "https://happytrifriends.com";
```

- [ ] **Step 2: Replace the Ukrainian price values and add localized clarification**

Use these exact Ukrainian values:

```ts
heroPrice: "Повне ведення — від 4 500 грн/місяць",
price: "Від 4 500 грн/місяць",
priceFacts: [
  "План з плавання: 2 тренування щотижня — 3 600 грн/місяць",
  "Силовий план — +900 грн/місяць; разом із двома плаваннями — від 4 500 грн/місяць",
  "Повне ведення: 3 тренування з плавання + зал — від 6 300 грн/місяць",
],
pricingClarification:
  "Вартість персонального ведення. Басейн і клубні абонементи оплачуються окремо.",
```

Keep the current English dollar values and add:

```ts
pricingClarification:
  "Pricing covers personal coaching. Pool access and club memberships are paid separately.",
```

- [ ] **Step 3: Split the coach biography around the semantic club link**

Replace the monolithic `coachText` field in both locales with matching fields:

```ts
coachTextBeforeClub: "Тренер з плавання та тренер київського триатлонного клубу ",
coachTextAfterClub:
  ". Допомагаю дорослим збудувати техніку й тренувальний ритм, які витримують звичайне життя.",
```

```ts
coachTextBeforeClub: "Swimming coach and coach at ",
coachTextAfterClub:
  ", a Kyiv triathlon club. I help adults build technique and a training rhythm that can hold up in everyday life.",
```

Add matching localized fields for the hero annotation and accessible name:

```ts
affiliationLabel: "COACH AT HAPPY TRI FRIENDS",
affiliationAriaLabel: "Happy Tri Friends — відкрити сайт клубу в новій вкладці",
```

```ts
affiliationLabel: "COACH AT HAPPY TRI FRIENDS",
affiliationAriaLabel: "Happy Tri Friends — open the club website in a new tab",
```

- [ ] **Step 4: Render desktop and mobile hero affiliations with safe external-link semantics**

Import `happyTriFriendsUrl`. Add a desktop link inside `.documentary-rail` and a mobile link immediately after `.hero-facts` and before the primary CTA. Both use:

```tsx
<a
  className="htf-affiliation ..."
  href={happyTriFriendsUrl}
  target="_blank"
  rel="noreferrer"
  aria-label={t.affiliationAriaLabel}
>
  {t.affiliationLabel}<span aria-hidden="true">↗</span>
</a>
```

Use distinct modifier classes so only one duplicate is displayed and focusable at each responsive breakpoint.

- [ ] **Step 5: Render the contextual inline biography link and pricing clarification**

Replace `{t.coachText}` with a paragraph that joins the two localized fragments around:

```tsx
<a
  className="htf-inline-link"
  href={happyTriFriendsUrl}
  target="_blank"
  rel="noreferrer"
  aria-label={t.affiliationAriaLabel}
>
  Happy Tri Friends
</a>
```

Render `t.pricingClarification` immediately after `.price-facts` and before the existing `.offer-note`.

- [ ] **Step 6: Rebuild and make the render contract green**

Run:

```bash
npm run build
node --test tests/rendered-html.test.mjs
```

Expected: both commands pass.

- [ ] **Step 7: Commit the copy and semantic markup**

```bash
git add app/site-copy.ts app/page.tsx tests/rendered-html.test.mjs
git commit -m "feat: localize pricing and credit Happy Tri Friends"
```

---

## Task 3: Add the restrained HTF visual language and responsive placement

**Files:**

- Modify: `app/globals.css`
- Modify: `tests/browser-qa.mjs`

- [ ] **Step 1: Define a restrained club-gold accent**

Add a local custom property derived from the club identity without copying its UI:

```css
:root { --htf-gold: #fbbf24; }
```

If `:root` already exists, add the property there instead of creating a second block.

- [ ] **Step 2: Style the desktop documentary affiliation**

The desktop link stays pearl-toned by default and uses a thin pseudo-element line:

```css
.htf-affiliation {
  position: relative;
  color: rgba(247, 243, 234, .72);
  text-decoration: none;
  transition: color 240ms var(--ease);
}
.htf-affiliation::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: -6px;
  left: 0;
  height: 1px;
  background: var(--htf-gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 240ms var(--ease);
}
.htf-affiliation:hover,
.htf-affiliation:focus-visible { color: var(--htf-gold); }
.htf-affiliation:hover::after,
.htf-affiliation:focus-visible::after { transform: scaleX(1); }
```

Keep a visible outline or equivalent focus indicator in addition to the color change.

- [ ] **Step 3: Style the coach biography link as editorial context**

Use an inline underline and the same gold hover/focus accent, without badge, fill, or button padding. Preserve natural wrapping in Ukrainian and English.

- [ ] **Step 4: Place the mobile affiliation between facts and CTA**

Hide `.htf-affiliation-mobile` on desktop and show it at the existing mobile breakpoint. Hide the rail version when `.documentary-rail` is hidden. Give the mobile line a compact horizontal layout and enough vertical separation without reducing the CTA touch target.

- [ ] **Step 5: Respect reduced motion**

Inside the existing `prefers-reduced-motion: reduce` block, remove pseudo-element transform animation/transition while preserving the gold color and visible focus treatment.

- [ ] **Step 6: Extend browser QA for both locales, responsive placement, and external-link safety**

Add checks that:

- Ukrainian initially shows `4 500 грн/місяць` and no `$` in the price section.
- English shows `$80`, `$100`, `$140` and no `грн` in the price section after the language switch.
- At desktop width, the rail affiliation is displayed and the mobile duplicate is not.
- At mobile widths 390 and 333, the mobile affiliation is displayed before the CTA and the rail duplicate is not.
- Both visible HTF destinations equal `https://happytrifriends.com/` and have `_blank` plus `noreferrer`.
- Keyboard focus reaches a visible gold-accent state.
- Reduced motion removes the line transition.
- No viewport has horizontal overflow.

- [ ] **Step 7: Run browser QA against the production build**

Use the project’s established preview and Chrome debug commands, then run:

```bash
npm run test:browser
```

Inspect the generated desktop, mobile, and English screenshots, not only the assertions.

- [ ] **Step 8: Commit the visual treatment and QA**

```bash
git add app/globals.css tests/browser-qa.mjs
git commit -m "style: add editorial HTF affiliation treatment"
```

---

## Task 4: Make the application type-safe under native Next.js

**Files:**

- Modify: `app/components/CinematicMedia.tsx`
- Modify: `app/components/WaterInterface.tsx`
- Create: `tsconfig.next.json`
- Modify: `next.config.ts`

- [ ] **Step 1: Preserve the diagnostic failure as the baseline**

Run:

```bash
npm exec -- next build
```

Expected before fixes: the code compiles, then strict type-checking fails at `CinematicMedia.tsx` because the `"IntersectionObserver" in window` fallback narrows `window` to `never`; `tsc` also reports nullable closure access in `WaterInterface.tsx` and Cloudflare-only types from `db/` and `worker/`.

- [ ] **Step 2: Fix feature detection without impossible type narrowing**

In `CinematicMedia.tsx`, replace the `in`-operator branch with a runtime constructor check that does not narrow `window`:

```ts
const supportsIntersectionObserver = typeof window.IntersectionObserver === "function";
if (!supportsIntersectionObserver) {
  visibleRef.current = true;
  const frame = window.requestAnimationFrame(() => setShouldLoad(true));
  // existing cleanup
}
```

Keep the fallback behavior unchanged.

- [ ] **Step 3: Capture a non-null hero element for every callback closure**

In `WaterInterface.tsx`, explicitly stabilize the narrowed ref before defining event callbacks:

```ts
const heroElement = ref.current;
if (heroElement === null) return;
const hero: HTMLElement = heroElement;
```

Continue using the local `hero` throughout the effect. Do not add non-null assertions to every access.

- [ ] **Step 4: Isolate the Next.js application type-check from Cloudflare worker modules**

Create `tsconfig.next.json`:

```json
{
  "extends": "./tsconfig.json",
  "include": [
    "next-env.d.ts",
    "app/**/*.ts",
    "app/**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules", "build", "db", "worker", "vite.config.ts", "drizzle.config.ts"]
}
```

Point Next.js at it without disabling errors:

```ts
const nextConfig: NextConfig = {
  typescript: {
    tsconfigPath: "tsconfig.next.json",
  },
};
```

- [ ] **Step 5: Verify both strict app types and the native production build**

Run:

```bash
npm exec -- tsc --project tsconfig.next.json --noEmit --pretty false
npm exec -- next build
test -f .next/routes-manifest.json
```

Expected: all commands pass and `.next/routes-manifest.json` exists.

- [ ] **Step 6: Re-run the Sites/vinext build to prove target isolation**

Run:

```bash
npm run build
test -f dist/server/index.js
```

Expected: both the native Next `.next` output and vinext `dist/server/index.js` can be produced from the same source tree.

- [ ] **Step 7: Commit the cross-target type fixes**

```bash
git add app/components/CinematicMedia.tsx app/components/WaterInterface.tsx tsconfig.next.json next.config.ts
git commit -m "fix: make app type-safe for native Next builds"
```

---

## Task 5: Select the native Next.js target on Vercel

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json` only if npm updates the root package metadata
- Create: `vercel.json`

- [ ] **Step 1: Add an explicit Vercel build script without changing the Sites build**

Keep the current `build` script intact and add:

```json
"build:vercel": "next build"
```

Pin the existing open-ended engine range to the current supported major to avoid automatic major upgrades:

```json
"node": "^22.13.0"
```

- [ ] **Step 2: Override only Vercel’s build command**

Create `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build:vercel"
}
```

Do not set `outputDirectory`: with the Next.js framework preset, Vercel should consume the native `.next` output automatically.

- [ ] **Step 3: Reproduce the Vercel-facing command locally**

Run:

```bash
npm run build:vercel
test -f .next/routes-manifest.json
```

Expected: native Next.js build succeeds and the manifest Vercel previously could not find is present.

- [ ] **Step 4: Verify the Vercel project configuration if the CLI is already linked**

If `.vercel/project.json` exists and credentials are available, run `vercel build` and confirm it executes `npm run build:vercel`. If the project is not linked, do not create or relink an external Vercel project implicitly; rely on the repository-owned `vercel.json` and the next GitHub deployment.

- [ ] **Step 5: Commit the deployment target**

```bash
git add package.json package-lock.json vercel.json
git commit -m "fix: select native Next build on Vercel"
```

---

## Task 6: Full regression, visual sign-off, and main-branch delivery

**Files:**

- Verify all modified files
- Update: `docs/superpowers/plans/2026-07-14-localized-pricing-htf-vercel.md` checkbox state as tasks complete

- [ ] **Step 1: Run the complete automated gate**

Run:

```bash
npm run build
node --test tests/*.test.mjs
npm run lint
npm run build:vercel
```

Expected: both builds and all tests pass; lint has no errors. Record any pre-existing warnings separately instead of hiding them.

- [ ] **Step 2: Run production browser QA at all required viewports**

Validate 1470×705, 1366×768, 390×844, 390×667, and 333×720. Check Ukrainian and English pricing, the desktop/mobile HTF placement, keyboard focus, reduced motion, the hero water edge fade, and the primary Instagram CTA.

- [ ] **Step 3: Inspect final screenshots**

Review the hero and pricing section in Ukrainian and English on desktop and mobile. Reject the result if the HTF treatment reads like a yellow promotion, if the mobile link competes with the CTA, or if any price wraps into an unreadable fragment.

- [ ] **Step 4: Review the final diff and repository state**

Run:

```bash
git diff --check
git status --short
git log --oneline --decorate -8
```

Expected: no whitespace errors, only intended files changed, and all implementation commits are present on `main`.

- [ ] **Step 5: Push the approved work to GitHub main**

Run:

```bash
git push origin main
```

Confirm the remote branch includes the final commit. The connected Vercel project should then start a new Git-based deployment using `npm run build:vercel`.

- [ ] **Step 6: Verify the resulting deployments**

Check that:

- GitHub `main` contains the pricing, HTF, and Vercel commits.
- Vercel no longer reports a missing `.next` directory.
- The Vercel deployment loads successfully at its production URL if the URL is available.
- The existing Sites deployment still builds from the vinext path; publish it through the Sites workflow only if that workflow is available and authorized in the current environment.

