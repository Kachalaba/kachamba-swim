# Kachamba Swim Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and privately publish a bilingual, boutique-premium landing page that routes adult swimming beginners in Kyiv to Mykyta Kachalaba's Instagram.

**Architecture:** Use the provided vinext starter as a single responsive React page. Keep copy in a typed Ukrainian/English content map selected by local React state; CSS owns the Deep Water visual system, animation, responsiveness, and reduced-motion behavior. The page contains no backend state or form handling.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, vinext / Cloudflare Worker-compatible build.

## Global Constraints

- Default language is Ukrainian; the UA / EN control switches all on-page copy without routes or persistence.
- Every conversion action links to `https://www.instagram.com/kachamba_swim/` in a new tab.
- Use only user-supplied Instagram media selected from public-facing export folders; do not read or ship direct-message assets.
- Use the Deep Water system: midnight blue, pearl text, muted ice aqua, sparse premium composition, and reduced-motion support.
- Copy must be specific, human, and beginner-aware; do not use generic fitness slogans, invented credentials, testimonials, or unsupported quantitative claims.
- Remove the starter skeleton, `codex-preview` metadata, and `react-loading-skeleton` before release.

---

## File structure

- `app/page.tsx` — client-rendered bilingual page, content map, semantic sections, and language toggle.
- `app/globals.css` — Deep Water tokens, responsive layout, accessible focus states, decorative water treatment, and motion preferences.
- `app/layout.tsx` — Ukrainian document language, production metadata, and social-preview metadata.
- `public/media/*.webp|jpg` — selected user-owned visual assets from public-facing export folders only.
- `public/og.png` — bespoke Deep Water social card generated from the final headline and palette.
- `tests/rendered-html.test.mjs` — production HTML smoke test for the new brand and removal of starter markers.
- `package.json` / `package-lock.json` — remove the starter-only skeleton dependency.

### Task 1: Initialize the Site Surface and Select Safe Media

**Files:**
- Create: starter files generated in the repository root.
- Create: `public/media/hero.*`, `public/media/training-01.*`, `public/media/training-02.*`, `public/media/training-03.*`.
- Modify: `.gitignore`.

**Interfaces:**
- Consumes: `/Users/nikita/Desktop/инста/instagram-kachamba_swim-2026-07-03-76pRmZFH.zip`.
- Produces: four display-ready assets at stable `/media/*` paths for `app/page.tsx`.

- [ ] **Step 1: Stage the approved specification outside the initializer's empty-root check**

Run:

```bash
mkdir -p work/spec-staging
git mv docs work/spec-staging/docs
```

Expected: the root contains only `.git`, `work`, `outputs`, and disposable brainstorming state before starter initialization.

- [ ] **Step 2: Initialize and start the starter**

Run:

```bash
bash /Users/nikita/.codex/plugins/cache/openai-bundled/sites/0.1.27/scripts/init-site.sh "$PWD"
npm run dev
```

Expected: dependencies install once and the development page responds at the printed local URL.

- [ ] **Step 3: Restore the specification and ignore brainstorming state**

Run:

```bash
git mv work/spec-staging/docs docs
printf '\n.superpowers/\nwork/\n' >> .gitignore
```

Expected: the approved spec and plan return to `docs/superpowers/`; temporary brainstorming files do not appear in `git status`.

- [ ] **Step 4: Select only public-facing media**

Run:

```bash
unzip -l /Users/nikita/Desktop/инста/instagram-kachamba_swim-2026-07-03-76pRmZFH.zip | rg '^.*media/(other|stories)/'
```

Copy only reviewed images or stills from those locations into `public/media/`; do not extract or inspect `your_instagram_activity/messages/**`.

- [ ] **Step 5: Verify the assets**

Run:

```bash
find public/media -maxdepth 1 -type f | sort
```

Expected: exactly the reviewed hero and three gallery assets, with no message paths.

- [ ] **Step 6: Commit the initialized surface and selected media**

```bash
git add .gitignore public/media package.json package-lock.json app tests .openai
git commit -m "chore: initialize Kachamba Swim site"
```

### Task 2: Build the Bilingual Deep Water Experience

**Files:**
- Modify: `app/page.tsx`.
- Modify: `app/globals.css`.
- Modify: `app/layout.tsx`.

**Interfaces:**
- Consumes: `/media/hero.*`, `/media/training-01.*`, `/media/training-02.*`, `/media/training-03.*`.
- Produces: a `Home` page with a `Language` union (`"uk" | "en"`) and a single external Instagram destination.

- [ ] **Step 1: Replace the starter smoke test with the failing production expectations**

Replace the starter assertions with:

```js
test("server-renders the Kachamba Swim premium landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Почніть плавати красиво\./);
  assert.match(html, /kachamba_swim/);
  assert.match(html, /lang="uk"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
});
```

- [ ] **Step 2: Run the test to verify it fails against the starter**

Run:

```bash
npm run test
```

Expected: FAIL because the starter title and skeleton are still present.

- [ ] **Step 3: Implement the page with a complete content contract**

In `app/page.tsx`, start with the client boundary and language model:

```tsx
"use client";

import { useState } from "react";

type Language = "uk" | "en";
const instagramUrl = "https://www.instagram.com/kachamba_swim/";
const copy = {
  uk: { headline: "Почніть плавати красиво.", cta: "Написати в Instagram" },
  en: { headline: "Start swimming beautifully.", cta: "Message on Instagram" },
} as const;
```

Render semantic `header`, `main`, `section`, and `footer` elements for the Hero, Recognition, Method, Coach, Gallery, and final CTA. Attach `aria-pressed` to the language buttons and use `target="_blank" rel="noreferrer"` on every Instagram link. Write concrete copy around first calm exhalations, deep-water confidence, and completing a length without panic; avoid templates such as “unlock your potential.”

- [ ] **Step 4: Implement the Deep Water visual system**

Define the root tokens in `app/globals.css`:

```css
:root { --ink:#071522; --pearl:#f4f5f2; --aqua:#a7e4ea; --line:rgba(244,245,242,.16); }
html { background:var(--ink); scroll-behavior:smooth; }
body { margin:0; background:var(--ink); color:var(--pearl); }
```

Build the premium composition with restrained gradients, hairlines, a `backdrop-filter` glass panel, strong keyboard focus indicators, mobile breakpoints, and:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration:.01ms !important; transition-duration:.01ms !important; }
}
```

- [ ] **Step 5: Replace metadata and starter artifacts**

Set the site title, Ukrainian description, Open Graph / X metadata, and `lang="uk"` in `app/layout.tsx`. Delete `app/_sites-preview`, remove all imports, remove `react-loading-skeleton` from both dependency files, and remove unused starter SVG assets.

- [ ] **Step 6: Run the test to verify it passes**

Run:

```bash
npm run test
```

Expected: PASS with the rendered Ukrainian headline, Instagram URL, language marker, and no starter preview marker.

- [ ] **Step 7: Commit the page**

```bash
git add app public package.json package-lock.json tests
git commit -m "feat: build premium bilingual coach landing page"
```

### Task 3: Finalize Social Preview, Validate, and Publish Privately

**Files:**
- Create: `public/og.png`.
- Modify: `app/layout.tsx`.
- Modify: `.openai/hosting.json`.

**Interfaces:**
- Consumes: completed page visual system and finalized primary headline.
- Produces: private deployed Sites URL with a verified production build.

- [ ] **Step 1: Generate and inspect the social card**

Create one landscape social card using the exact Deep Water palette and the headline “Почніть плавати красиво.” Inspect text for errors, save the accepted card as `public/og.png`, and reference `/og.png` through host-derived absolute metadata URLs.

- [ ] **Step 2: Verify release behaviour**

Run:

```bash
npm run build
npm run lint
npm run test
```

Expected: all commands exit 0.

- [ ] **Step 3: Perform browser acceptance checks**

At desktop and mobile widths, verify: no horizontal overflow; the default page is Ukrainian; switching to English updates hero and CTA; keyboard focus reaches the language control and CTA; all CTAs open the Instagram profile; images have meaningful alt text; motion is reduced when requested.

- [ ] **Step 4: Commit the release source**

```bash
git add app public .openai tests package.json package-lock.json
git commit -m "chore: finalize Kachamba Swim release"
```

- [ ] **Step 5: Save and privately deploy the validated build**

Create or reuse the Sites project, persist its opaque `project_id` in `.openai/hosting.json`, push the exact HEAD, package the built site, save a version, deploy it privately, poll until successful, and open the final URL.

## Plan self-review

- Spec coverage: Tasks 1–3 cover authentic media, Deep Water visual direction, bilingual interaction, Instagram-only conversion, metadata, motion/accessibility, validation, and private hosting.
- Placeholder scan: no deferred requirements or unspecified feature areas remain.
- Consistency: `Language`, `instagramUrl`, `/media/*`, `public/og.png`, and the page/test contract use the same paths and names throughout.
