# Submerged Cinema Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Kachamba Swim sales page as a premium, bilingual sports-documentary experience using real Instagram material, restrained cinematic motion, and the approved personal-coaching offer.

**Architecture:** Keep the current Vinext/React single route and language state, but split media, reveal behavior, progress presentation, and translated content into focused modules. Motion is progressive enhancement built with CSS transforms, the Web Animations API, and `IntersectionObserver`; static content remains complete before JavaScript attaches. Current archive clips are transcoded behind stable semantic filenames so higher-quality replacements can be swapped in later without layout changes.

**Tech Stack:** Vinext, React 19, TypeScript, CSS, Node built-in test runner, FFmpeg for media derivatives, ESLint.

## Global Constraints

- Use the selected **A · Submerged Cinema** direction with deep ink `#06181D`, deep water `#08232B`, refracted aqua `#7EF2E2`, ice `#D9FFF8`, and warm pearl `#F5F0E6`.
- Ukrainian remains the default language; English must translate every visible string and accessible label, and `<html lang>` must follow the selected language.
- Preserve `Personal Swim Coaching`, `Від $100/місяць`, capacity `До 8–10 спортсменів`, the explicit `$80 + $20` entry composition, the `$140` three-session example, and the Instagram application flow.
- Use the approved public proof point `7 років методики · 5000+ годин персональної роботи`; do not invent testimonials, results, guarantees, awards, or remaining-place counts.
- Use only public-facing Instagram assets supplied by Mykyta. Do not read or use private messages, private interaction data, or embedded location metadata.
- Keep content visible before motion; do not hide required copy behind JavaScript or opacity-zero initial states.
- Do not add an animation dependency, custom cursor, scroll hijacking, decorative SVG illustration, generic fitness gradient, or SaaS-style card grid.
- Videos must be muted, looped, inline, poster-backed, and capable of falling back to their poster when loading or autoplay fails.
- `prefers-reduced-motion: reduce` must disable continuous drift, parallax, rails, and reveal movement while preserving a complete page.
- All primary CTA links must use `https://www.instagram.com/kachamba_swim/`, `target="_blank"`, and `rel="noreferrer"`.

---

## File Structure

- Create: `app/site-copy.ts` — `Language`, `SiteCopy`, `copy`, and the shared Instagram URL.
- Create: `app/components/CinematicMedia.tsx` — poster-backed video/image window with runtime fallback.
- Create: `app/components/Reveal.tsx` — progressive, observer-triggered Web Animations reveal.
- Create: `app/components/ProgressRail.tsx` — semantic method/coaching sequence.
- Modify: `app/page.tsx` — seven-scene page composition and language state.
- Modify: `app/globals.css` — Submerged Cinema layout, typography, motion, responsive, and reduced-motion rules.
- Modify: `app/layout.tsx` — finished metadata and regenerated social card reference.
- Create: `public/media/coaching-loop.mp4` — optimized pool-training loop.
- Create: `public/media/coaching-loop-poster.webp` — static fallback for the loop.
- Create: `public/media/coach-deck-loop.mp4` — optimized coach-on-deck loop.
- Create: `public/media/coach-deck-poster.webp` — static fallback for the deck loop.
- Create: `public/media/open-water.webp` — authentic open-water photograph.
- Replace: `public/og.png` — one new finished social card matching Submerged Cinema.
- Create: `tests/media-assets.test.mjs` — media existence and size budget.
- Modify: `tests/rendered-html.test.mjs` — product, proof, scene, media, language, and CTA contract.
- Modify: `package.json` — run every Node test file.

### Task 1: Prepare stable documentary media assets

**Files:**
- Create: `public/media/coaching-loop.mp4`
- Create: `public/media/coaching-loop-poster.webp`
- Create: `public/media/coach-deck-loop.mp4`
- Create: `public/media/coach-deck-poster.webp`
- Create: `public/media/open-water.webp`
- Create: `tests/media-assets.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: current public Instagram exports in `/Users/nikita/Documents/Codex/2026-07-09/sites-plugin-sites-openai-bundled/work/insta-review/`.
- Produces: stable URLs `/media/coaching-loop.mp4`, `/media/coaching-loop-poster.webp`, `/media/coach-deck-loop.mp4`, `/media/coach-deck-poster.webp`, and `/media/open-water.webp` used by later tasks.

- [ ] **Step 1: Create optimized video and poster derivatives**

Run these exact commands from the site worktree:

```bash
ffmpeg -i /Users/nikita/Documents/Codex/2026-07-09/sites-plugin-sites-openai-bundled/work/insta-review/reels/18089011301476716.mp4 -an -vf "scale=720:-2:flags=lanczos" -c:v libx264 -preset slow -crf 26 -movflags +faststart public/media/coaching-loop.mp4 -y
ffmpeg -ss 8 -i /Users/nikita/Documents/Codex/2026-07-09/sites-plugin-sites-openai-bundled/work/insta-review/reels/18089011301476716.mp4 -frames:v 1 -vf "scale=720:-2:flags=lanczos" -c:v libwebp -quality 82 public/media/coaching-loop-poster.webp -y
ffmpeg -i /Users/nikita/Documents/Codex/2026-07-09/sites-plugin-sites-openai-bundled/work/insta-review/reels/18037291493252096.mp4 -an -vf "scale=720:-2:flags=lanczos" -c:v libx264 -preset slow -crf 26 -movflags +faststart public/media/coach-deck-loop.mp4 -y
ffmpeg -ss 8 -i /Users/nikita/Documents/Codex/2026-07-09/sites-plugin-sites-openai-bundled/work/insta-review/reels/18037291493252096.mp4 -frames:v 1 -vf "scale=720:-2:flags=lanczos" -c:v libwebp -quality 82 public/media/coach-deck-poster.webp -y
cp /Users/nikita/Documents/Codex/2026-07-09/sites-plugin-sites-openai-bundled/work/insta-review/photos/18001889242748788.webp public/media/open-water.webp
```

- [ ] **Step 2: Add the media budget test**

Create `tests/media-assets.test.mjs`:

```js
import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";

const assets = [
  ["coaching-loop.mp4", 6_000_000],
  ["coaching-loop-poster.webp", 500_000],
  ["coach-deck-loop.mp4", 6_000_000],
  ["coach-deck-poster.webp", 500_000],
  ["open-water.webp", 500_000],
];

test("documentary media exists within the page budget", async () => {
  for (const [name, maximumBytes] of assets) {
    const info = await stat(new URL(`../public/media/${name}`, import.meta.url));
    assert.ok(info.size > 10_000, `${name} should contain real media`);
    assert.ok(info.size < maximumBytes, `${name} exceeds ${maximumBytes} bytes`);
  }
});
```

Update the `test` script in `package.json`:

```json
"test": "npm run build && node --test tests/*.test.mjs"
```

- [ ] **Step 3: Run the asset and existing render tests**

Run: `npm test`

Expected: two tests pass; the production build completes; each media asset is below its budget.

- [ ] **Step 4: Commit the media pipeline**

```bash
git add package.json public/media tests/media-assets.test.mjs
git commit -m "feat: add cinematic coaching media"
```

### Task 2: Build progressive motion primitives and the seven-scene page

**Files:**
- Create: `app/site-copy.ts`
- Create: `app/components/CinematicMedia.tsx`
- Create: `app/components/Reveal.tsx`
- Create: `app/components/ProgressRail.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- `CinematicMedia({ videoSrc, posterSrc, imageSrc, alt, caption, className })` renders a video when `videoSrc` is healthy and a complete `<img>` fallback otherwise.
- `Reveal({ children, className, delay })` renders children immediately and applies one observer-triggered Web Animation when motion is allowed.
- `ProgressRail({ label, items })` renders an ordered list with `data-progress-rail` for CSS choreography.
- `site-copy.ts` exports `Language`, `copy`, and `instagramUrl` for `page.tsx`.

- [ ] **Step 1: Expand the failing rendered contract**

Add these assertions to `tests/rendered-html.test.mjs`:

```js
assert.match(html, /7 років методики/);
assert.match(html, /5000\+ годин персональної роботи/);
assert.match(html, /Дихання → Техніка → Темп → Відновлення/);
assert.match(html, /План → Дія → Відеорозбір → Корекція → Наступний блок/);
assert.match(html, /src="\/media\/coaching-loop\.mp4"/);
assert.match(html, /poster="\/media\/coaching-loop-poster\.webp"/);
assert.match(html, /src="\/media\/coach-deck-loop\.mp4"/);
assert.match(html, /poster="\/media\/coach-deck-poster\.webp"/);
```

Run: `npm test`

Expected: FAIL because the current page does not contain the proof, method scene, stable video URLs, or new coaching-loop copy.

- [ ] **Step 2: Create the progressive reveal component**

Create `app/components/Reveal.tsx`:

```tsx
"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.animate(
        [{ opacity: 0.78, transform: "translateY(24px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 760, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" },
      );
      observer.disconnect();
    }, { threshold: 0.18 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  return <div ref={ref} className={`reveal ${className}`.trim()}>{children}</div>;
}
```

- [ ] **Step 3: Create the poster-backed media component**

Create `app/components/CinematicMedia.tsx`:

```tsx
"use client";

import { useState } from "react";

type Props = {
  videoSrc?: string;
  posterSrc: string;
  imageSrc?: string;
  alt: string;
  caption?: string;
  className?: string;
};

export function CinematicMedia({ videoSrc, posterSrc, imageSrc, alt, caption, className = "" }: Props) {
  const [videoFailed, setVideoFailed] = useState(false);
  const fallback = imageSrc ?? posterSrc;
  return (
    <figure className={`cinematic-media ${className}`.trim()}>
      {videoSrc && !videoFailed ? (
        <video src={videoSrc} poster={posterSrc} autoPlay muted loop playsInline preload="metadata" aria-label={alt} onError={() => setVideoFailed(true)} />
      ) : (
        <img src={fallback} alt={alt} loading="lazy" />
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
```

- [ ] **Step 4: Create the semantic progress rail**

Create `app/components/ProgressRail.tsx`:

```tsx
export function ProgressRail({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div className="progress-rail" data-progress-rail aria-label={label}>
      <span className="progress-rail-line" aria-hidden="true" />
      <ol>{items.map((item, index) => <li key={item}><span>0{index + 1}</span><strong>{item}</strong></li>)}</ol>
    </div>
  );
}
```

- [ ] **Step 5: Move and extend the bilingual content model**

Create `app/site-copy.ts` by moving the current `Language`, `instagramUrl`, and `copy` declarations out of `page.tsx`. Add exact Ukrainian and English fields for:

```ts
proof: ["7 років методики", "5000+ годин персональної роботи"],
methodLabel: "Методика без пафосу",
methodTitle: "Точність починається не з темпу.",
methodSteps: ["Дихання", "Техніка", "Темп", "Відновлення"],
methodLine: "Дихання → Техніка → Темп → Відновлення",
loopLabel: "Живий цикл ведення",
loopSteps: ["План", "Дія", "Відеорозбір", "Корекція", "Наступний блок"],
loopLine: "План → Дія → Відеорозбір → Корекція → Наступний блок",
practiceLabel: "Практика, не презентація",
practiceTitle: "Робота видно у воді.",
```

Use full English equivalents: `7 years of methodology`, `5,000+ hours of personal coaching`, `Breathing`, `Technique`, `Pace`, `Recovery`, `Plan`, `Action`, `Video review`, `Adjustment`, and `Next block`.

- [ ] **Step 6: Recompose `app/page.tsx` into seven semantic scenes**

Import the three components and shared copy. Render sections in this exact order:

```tsx
<section className="cinema-hero" id="top">...</section>
<section className="routes scene" id="audiences">...</section>
<section className="method scene" id="method">...</section>
<section className="coaching-loop scene" id="system">...</section>
<section className="practice scene" id="practice">...</section>
<section className="offer scene" id="price">...</section>
<section className="invitation" id="apply">...</section>
```

The hero keeps the headline, price, capacity, and Instagram CTA above the fold. Add a `documentary-rail`. Use `ProgressRail` for method and coaching steps. Use both videos:

```tsx
<CinematicMedia videoSrc="/media/coaching-loop.mp4" posterSrc="/media/coaching-loop-poster.webp" alt={language === "uk" ? "Плавець виконує тренувальний відрізок" : "Swimmer completing a training interval"} />
<CinematicMedia videoSrc="/media/coach-deck-loop.mp4" posterSrc="/media/coach-deck-poster.webp" alt={language === "uk" ? "Микита веде тренування біля басейну" : "Mykyta coaching on the pool deck"} />
```

Within the coaching-loop scene, preserve and render the existing five-step first-week sequence after the loop and offer components: introduction, starting point, first plan, video feedback, and refined next block. Use existing `hero-pool.webp`, `coach-outdoor.webp`, `htf-team.webp`, and the new `open-water.webp` in the documentary gallery. Retain four Instagram links: hero CTA, coach/practice link, final CTA, and footer handle.

- [ ] **Step 7: Run tests and commit the page architecture**

Run: `npm test`

Expected: the build and both tests pass; SSR contains the proof, method, coaching loop, media sources/posters, and four protected Instagram links.

```bash
git add app/page.tsx app/site-copy.ts app/components tests/rendered-html.test.mjs
git commit -m "feat: build submerged cinema page narrative"
```

### Task 3: Implement the Submerged Cinema visual and motion system

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: Task 2 class names `cinema-hero`, `routes`, `method`, `coaching-loop`, `practice`, `offer`, `invitation`, `cinematic-media`, `reveal`, `progress-rail`, and `documentary-rail`.
- Produces: the selected palette, full responsive composition, progressive motion, poster fallback presentation, and reduced-motion behavior.

- [ ] **Step 1: Replace old page-specific rules with the selected tokens and base system**

Keep Tailwind import, box sizing, focus styles, and semantic defaults. Define:

```css
:root {
  --ink:#06181d;
  --water:#08232b;
  --aqua:#7ef2e2;
  --ice:#d9fff8;
  --pearl:#f5f0e6;
  --mist:rgba(245,240,230,.68);
  --line:rgba(217,255,248,.18);
  --ease:cubic-bezier(.22,1,.36,1);
}
```

Use `var(--font-geist-sans), Arial, sans-serif`, large negative-tracking headlines, 10–12px uppercase metadata, and warm pearl body copy.

- [ ] **Step 2: Build the cinematic hero and route scenes**

Implement a full-height image hero, 32px editorial frame on large screens, vertical documentary rail, filled/outlined headline treatment, glass offer facts, and these ambient keyframes:

```css
@keyframes hero-drift { to { transform:scale(1.055) translate3d(-.5%,.4%,0); } }
@keyframes light-sweep { 0%,100% { transform:translate3d(-10%,0,0); opacity:.22; } 50% { transform:translate3d(12%,2%,0); opacity:.52; } }
@keyframes water-breathe { to { transform:scale(1.08); opacity:.58; } }
```

Replace the current audience card grid with two large route panels whose emphasis changes through image crop, rule, and typography rather than card shadows.

- [ ] **Step 3: Style the method, loop, media, gallery, offer, and invitation scenes**

Use alternating deep-water and warm-pearl scenes. The method rail gets a single aqua line animation; the coaching scene uses asymmetric video windows; the practice scene uses an editorial masonry-like grid; the offer uses one large price statement and no tariff matrix. Style video/image fallback uniformly:

```css
.cinematic-media { position:relative; margin:0; overflow:hidden; background:var(--water); }
.cinematic-media video,.cinematic-media img { width:100%; height:100%; display:block; object-fit:cover; transform:scale(1.015); transition:transform 1.2s var(--ease); }
.cinematic-media:hover video,.cinematic-media:hover img { transform:scale(1.045); }
.cinematic-media figcaption { position:absolute; left:18px; bottom:16px; color:var(--pearl); font-size:10px; letter-spacing:.12em; text-transform:uppercase; }
```

- [ ] **Step 4: Add responsive and reduced-motion contracts**

At `max-width: 760px`, remove the editorial frame, keep the hero text within 390px without clipping, stack route panels and documentary gallery, and keep video windows at `aspect-ratio: 4 / 5`. Add:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior:auto; }
  *,*::before,*::after { animation:none !important; transition-duration:.01ms !important; }
  .cinematic-media video,.cinematic-media img,.cinema-hero-media img { transform:none !important; }
}
```

- [ ] **Step 5: Run tests, lint, and commit**

Run: `npm test && npm run lint`

Expected: build and both tests pass; lint exits zero. Raw `<img>` recommendations may remain warnings only if they are the existing Vinext-compatible media implementation.

```bash
git add app/globals.css
git commit -m "style: add submerged cinema art direction"
```

### Task 4: Regenerate the social preview and finish metadata

**Files:**
- Replace: `public/og.png`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: the stable Submerged Cinema headline, palette, pool imagery, and offer facts.
- Produces: one 1200×630 social preview and metadata matching the finished site.

- [ ] **Step 1: Generate exactly one cohesive social card**

Use the image-generation skill once with a 1200×630 landscape brief: Mykyta seen from behind at a real indoor pool, deep ink and refracted aqua palette, warm pearl condensed typography, exact text `Пливи точніше.` and `Mykyta Kachalaba · Personal Swim Coaching · від $100/місяць`, no extra logo, no watermark, no invented achievement.

- [ ] **Step 2: Inspect and install the card**

Confirm every word is correct and legible at thumbnail size. Save the accepted result as `public/og.png`. If the single card is unusable, omit `og:image` rather than shipping incorrect text; do not create parallel alternatives.

- [ ] **Step 3: Update metadata copy**

Keep the existing title and set the description consistently in Open Graph and Twitter:

```ts
description: "Personal online swim coaching by Mykyta Kachalaba: individual swim and strength plans, video review, chat and calls. From $100 per month.",
```

Retain `summary_large_image`, correct 1200×630 dimensions, and alt text `Mykyta Kachalaba — Personal Swim Coaching` when the new card is installed.

- [ ] **Step 4: Build and commit**

Run: `npm run build`

Expected: production build succeeds with the final metadata and social card.

```bash
git add app/layout.tsx public/og.png
git commit -m "feat: update submerged cinema social preview"
```

### Task 5: Verify the complete premium experience

**Files:**
- Verify: `app/page.tsx`, `app/site-copy.ts`, `app/components/*`, `app/globals.css`, `app/layout.tsx`, `public/media/*`, `tests/*.test.mjs`

**Interfaces:**
- Consumes: the completed local build and development server.
- Produces: acceptance evidence for desktop, mobile, language, motion, fallback, CTAs, and performance-safe layout.

- [ ] **Step 1: Run final automated checks**

Run: `npm run build && npm test && npm run lint`

Expected: build succeeds; both tests pass; lint exits zero.

- [ ] **Step 2: Review desktop visual behavior**

Open or reload `http://localhost:3000/`. Confirm the hero, two routes, method proof, coaching videos, practice gallery, offer, and invitation have no clipping or horizontal overflow. Confirm reveal animations run once and required content is visible before and after motion.

- [ ] **Step 3: Review mobile and reduced motion**

At 390×844, confirm the hero headline fits, route panels stack, video windows retain aspect ratio, price remains readable, and the page has no horizontal overflow. Emulate reduced motion and confirm ambient/reveal movement stops while all content remains visible.

- [ ] **Step 4: Verify language, media fallback, and conversion**

Switch to English and confirm `<html lang="en">`, every visible section, media labels, and CTA labels translate. Confirm all four Instagram links use the required URL and attributes. Temporarily block one video URL in browser tooling or inspect the error state to confirm its poster remains visible.

- [ ] **Step 5: Push only verified changes**

If browser verification requires a source fix, commit it after rerunning the covering checks:

```bash
git add app public tests package.json
git commit -m "fix: polish submerged cinema experience"
```

Then run:

```bash
git push
```
