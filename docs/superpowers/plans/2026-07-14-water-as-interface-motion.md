# Water as Interface Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a pointer- and scroll-responsive refractive hero, waterline headline fill, and one-shot editorial surface passes while preserving the existing content, conversion path, performance, and accessibility.

**Architecture:** A focused `WaterInterface` client component owns hero input sampling and writes a small set of CSS custom properties directly to its section element. The page keeps content and language state, while CSS renders the duplicated media, typographic fill, responsive states, and reduced-motion fallback. The existing `Reveal` observer receives one explicit `surface` variant so numbered scenes reuse the current entry lifecycle.

**Tech Stack:** React 19, TypeScript 5.9, CSS masks/custom properties, native Pointer Events, `requestAnimationFrame`, `IntersectionObserver`, Node test runner, vinext.

## Global Constraints

- Do not add an animation library, canvas renderer, WebGL scene, custom cursor, or scroll-smoothing dependency.
- Keep the existing documentary photography, bilingual copy, pricing, offer, and Instagram destination unchanged.
- The hero must remain readable without JavaScript and with `prefers-reduced-motion: reduce`.
- The effect must not capture pointer events or obstruct links, buttons, navigation, or language controls.
- Touch behavior must remain scroll-first; no autonomous cursor simulation or continuous mobile animation.
- Use one duplicated hero image and coalesce pointer/scroll work through `requestAnimationFrame`.

---

## File map

- Create `app/components/WaterInterface.tsx`: hero section wrapper, pointer/scroll sampling, reduced-motion state, and CSS custom-property contract.
- Modify `app/page.tsx`: compose the hero through `WaterInterface`, add the decorative headline fill, and mark one reveal per numbered scene for the surface pass.
- Modify `app/components/Reveal.tsx`: add the `surface?: boolean` variant and set the owning scene's one-shot data state when revealed.
- Modify `app/globals.css`: refraction mask, waterline fill, depth, surface pass, mobile, progressive enhancement, and reduced-motion rules.
- Modify `tests/rendered-html.test.mjs`: verify semantic/static markup and progressive-enhancement attributes.
- Modify `tests/browser-qa.mjs`: verify pointer response, scroll fill, CTA hit testing, bilingual layout, mobile overflow, and reduced-motion state.

---

### Task 1: Establish the server-rendered water interface contract

**Files:**
- Create: `app/components/WaterInterface.tsx`
- Modify: `app/page.tsx:72-99`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `children: ReactNode`, `headline: string`, and the existing hero image `/media/hero-pool.webp`.
- Produces: `WaterInterface` rendering `<section class="cinema-hero" data-water-interface="idle">`, `.water-refraction`, and initial custom properties `--water-x`, `--water-y`, `--water-fill`, `--water-depth`, `--water-shift-x`, and `--water-shift-y`.

- [ ] **Step 1: Write the failing markup test**

Add these assertions after the existing hero heading assertion:

```js
assert.match(html, /<section[^>]*class="cinema-hero"[^>]*data-water-interface="idle"/);
assert.match(html, /class="water-refraction" aria-hidden="true"/);
assert.match(html, /class="hero-title-outline-fill" aria-hidden="true"/);
assert.match(html, /class="hero-title-outline-fill"[^>]*>підлаштоване під ваше життя\.<\/span>/);
```

- [ ] **Step 2: Run the failing test**

Run: `npm run build && node --test tests/rendered-html.test.mjs`

Expected: FAIL because `data-water-interface`, `.water-refraction`, and `.hero-title-outline-fill` do not exist.

- [ ] **Step 3: Add the minimal server-rendered component contract**

Create the component with a semantic section and progressive-enhancement defaults:

```tsx
"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type WaterInterfaceProps = {
  children: ReactNode;
};

const initialStyle = {
  "--water-x": "68%",
  "--water-y": "42%",
  "--water-fill": "16%",
  "--water-depth": "0",
  "--water-shift-x": "-8px",
  "--water-shift-y": "5px",
} as CSSProperties;

export function WaterInterface({ children }: WaterInterfaceProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = ref.current;
    if (!hero) return;
    hero.dataset.waterInterface = "ready";
  }, []);

  return (
    <section
      ref={ref}
      className="cinema-hero"
      id="top"
      aria-labelledby="hero-title"
      data-water-interface="idle"
      style={initialStyle}
    >
      <div className="cinema-hero-media" aria-hidden="true">
        <img src="/media/hero-pool.webp" alt="" />
      </div>
      <div className="water-refraction" aria-hidden="true">
        <img src="/media/hero-pool.webp" alt="" />
      </div>
      {children}
    </section>
  );
}
```

Use `WaterInterface` in `app/page.tsx`, leaving the shade, copy, CTA, and documentary rail as its children. Change the outlined headline to:

```tsx
<span className="hero-title-outline">
  <span className="hero-title-outline-stroke">{t.headlineLines[1]}</span>
  <span className="hero-title-outline-fill" aria-hidden="true">
    {t.headlineLines[1]}
  </span>
</span>
```

- [ ] **Step 4: Run the markup test**

Run: `npm run build && node --test tests/rendered-html.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the contract**

```bash
git add app/components/WaterInterface.tsx app/page.tsx tests/rendered-html.test.mjs
git commit -m "feat: add water interface hero contract"
```

---

### Task 2: Implement pointer refraction and scroll-driven headline fill

**Files:**
- Modify: `app/components/WaterInterface.tsx`
- Modify: `app/globals.css:138-250`
- Test: `tests/browser-qa.mjs`

**Interfaces:**
- Consumes: the Task 1 data attribute and six CSS variables on `.cinema-hero`.
- Produces: `data-water-interface="ready|reduced"`, `data-water-pointer="active|idle"`, and live CSS variable values without React renders per frame.

- [ ] **Step 1: Add failing browser assertions**

After the first desktop navigation, capture the initial variables, dispatch a mouse move through CDP, and require movement plus safe hit testing:

```js
const waterInitial = await evaluate(`(() => {
  const hero = document.querySelector('.cinema-hero');
  return {
    state: hero.dataset.waterInterface,
    x: hero.style.getPropertyValue('--water-x'),
    fill: Number.parseFloat(hero.style.getPropertyValue('--water-fill')),
  };
})()`);
assert.equal(waterInitial.state, "ready");

await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 410, y: 280 });
await delay(180);
const waterMoved = await evaluate(`(() => {
  const hero = document.querySelector('.cinema-hero');
  const cta = document.querySelector('.cinema-hero .button');
  const rect = cta.getBoundingClientRect();
  const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
  return {
    x: hero.style.getPropertyValue('--water-x'),
    pointer: hero.dataset.waterPointer,
    ctaIsTopmost: hit === cta || cta.contains(hit),
  };
})()`);
assert.notEqual(waterMoved.x, waterInitial.x);
assert.equal(waterMoved.pointer, "active");
assert.equal(waterMoved.ctaIsTopmost, true);
```

Record `--water-fill`, scroll 240 pixels, and assert the numeric fill increases. In the existing reduced-motion block, require `data-water-interface === "reduced"`.

- [ ] **Step 2: Run browser QA to verify failure**

Start `npm run dev` in a retained terminal and use the exact local URL it prints. With the current default `http://localhost:3000/`, run: `SITE_URL=http://localhost:3000/ npm run test:browser`.

Expected: FAIL because pointer and scroll input do not update the custom properties and reduced motion is not exposed.

- [ ] **Step 3: Implement the requestAnimationFrame input sampler**

In `WaterInterface.tsx`, replace the minimal effect with one effect that:

```tsx
const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

// Inside useEffect:
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
let frame: number | null = null;
let bounds = hero.getBoundingClientRect();
let pageTop = window.scrollY + bounds.top;
let targetX = 0.68;
let targetY = 0.42;
let currentX = targetX;
let currentY = targetY;
let pointerActive = false;

const measure = () => {
  bounds = hero.getBoundingClientRect();
  pageTop = window.scrollY + bounds.top;
};

const paint = () => {
  frame = null;
  const progress = clamp((window.scrollY - pageTop) / (bounds.height * 0.72), 0, 1);
  currentX += (targetX - currentX) * 0.18;
  currentY += (targetY - currentY) * 0.18;
  const scrollFill = 16 + progress * 84;
  const pointerFill = clamp(100 - currentY * 100, 10, 94);
  const fill = pointerActive ? scrollFill * 0.55 + pointerFill * 0.45 : scrollFill;
  hero.style.setProperty("--water-x", `${(currentX * 100).toFixed(2)}%`);
  hero.style.setProperty("--water-y", `${(currentY * 100).toFixed(2)}%`);
  hero.style.setProperty("--water-fill", `${fill.toFixed(2)}%`);
  hero.style.setProperty("--water-depth", progress.toFixed(3));
  hero.style.setProperty("--water-shift-x", `${((0.5 - currentX) * 18).toFixed(2)}px`);
  hero.style.setProperty("--water-shift-y", `${((0.5 - currentY) * 14).toFixed(2)}px`);
  if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) requestPaint();
};
```

`requestPaint` schedules one frame. Pointer movement updates normalized targets when the event originates in non-interactive hero space; fine pointers stay active while inside the hero, while touch pointers activate only during a drag. Pointer leave/up returns the target to `0.68, 0.42`. Scroll schedules paint. Resize remeasures then paints. A motion-preference change switches the dataset to `reduced`, removes the active pointer state, and restores a complete static fill.

- [ ] **Step 4: Add the CSS rendering**

Implement:

```css
.water-refraction {
  position: absolute;
  z-index: -2;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
  -webkit-mask-image: radial-gradient(circle clamp(130px, 18vw, 260px) at var(--water-x) var(--water-y), #000 0 46%, rgba(0, 0, 0, .82) 62%, transparent 100%);
  mask-image: radial-gradient(circle clamp(130px, 18vw, 260px) at var(--water-x) var(--water-y), #000 0 46%, rgba(0, 0, 0, .82) 62%, transparent 100%);
  transition: opacity .7s var(--ease);
}
.cinema-hero[data-water-interface="ready"] .water-refraction { opacity: .78; }
.water-refraction img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 44%;
  filter: saturate(.9) contrast(1.08) brightness(.82) hue-rotate(8deg);
  transform: translate3d(var(--water-shift-x), var(--water-shift-y), 0) scale(1.055);
}
.hero-title-outline { position: relative; }
.hero-title-outline-stroke, .hero-title-outline-fill { display: block; }
.hero-title-outline-fill {
  position: absolute;
  inset: 0;
  color: var(--pearl);
  -webkit-text-stroke: 0;
  clip-path: inset(calc(100% - var(--water-fill)) 0 0);
  pointer-events: none;
}
.hero-title-outline-fill::before {
  content: "";
  position: absolute;
  top: calc(100% - var(--water-fill));
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--aqua) 18%, var(--ice) 55%, transparent);
  box-shadow: 0 0 18px rgba(126, 242, 226, .5);
}
```

Move the shade to `z-index: -1`, preserve text/CTA stacking, and express hero depth through a transform derived from `--water-depth`. Add mobile rules that hide the refractive duplicate unless touch input activates it; retain scroll-driven fill. In reduced motion, hide refraction, show a 100% filled headline, and remove depth transforms.

- [ ] **Step 5: Run the focused checks**

Run: `npm run build && npm run test:browser`

Expected: build and browser QA PASS with no console errors.

- [ ] **Step 6: Commit the interaction**

```bash
git add app/components/WaterInterface.tsx app/globals.css tests/browser-qa.mjs
git commit -m "feat: animate the water interface hero"
```

---

### Task 3: Add one-shot scene surface passes and complete verification

**Files:**
- Modify: `app/components/Reveal.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`
- Modify: `tests/browser-qa.mjs`

**Interfaces:**
- Consumes: `Reveal`'s existing observer and `surface?: boolean`.
- Produces: `data-surface="true"` on the selected reveal and `data-surface-pass="true"` on its closest `.scene` after first intersection.

- [ ] **Step 1: Add failing surface-pass assertions**

In the HTML test, assert five server-rendered surface variants:

```js
assert.equal((html.match(/data-surface="true"/g) ?? []).length, 5);
```

In browser QA after scrolling to `#method`, require:

```js
assert.equal(await evaluate(`document.querySelector('#method').dataset.surfacePass`), "true");
```

In reduced motion, require the computed `display` of `#method::after` to be `none`.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run build && node --test tests/rendered-html.test.mjs`

Expected: FAIL because the surface variant does not exist.

- [ ] **Step 3: Extend Reveal with the explicit surface variant**

Add `surface?: boolean` to `RevealProps`, emit `data-surface={surface || undefined}`, and when the observer reveals the element run:

```tsx
if (surface) element.closest<HTMLElement>(".scene")?.setAttribute("data-surface-pass", "true");
```

Apply `surface` to the first reveal in each numbered section: `#audiences`, `#method`, `#system`, `#practice`, and `#price`.

- [ ] **Step 4: Add the surface-pass CSS**

Use the existing `.scene` pseudo-layer:

```css
.scene::after {
  content: "";
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  pointer-events: none;
  transform: scaleX(0);
  transform-origin: left;
  background: linear-gradient(90deg, transparent, rgba(126, 242, 226, .9), rgba(217, 255, 248, .18), transparent);
  box-shadow: 0 0 22px rgba(126, 242, 226, .22);
}
.scene[data-surface-pass="true"]::after {
  animation: surface-pass .82s var(--ease) both;
}
@keyframes surface-pass {
  0% { transform: scaleX(0); opacity: 0; }
  28% { opacity: 1; }
  100% { transform: scaleX(1); opacity: 0; }
}
```

Hide `.scene::after` in reduced motion.

- [ ] **Step 5: Run the complete validation suite**

Run: `npm test`

Expected: all Node tests PASS after a successful production build.

Run: `npm run lint`

Expected: PASS with no ESLint errors.

Run with the local dev server: `npm run test:browser`

Expected: PASS for desktop, 390-pixel mobile, bilingual switching, media fallback, water interaction, surface pass, reduced motion, and no browser errors.

- [ ] **Step 6: Commit the completed motion system**

```bash
git add app/components/Reveal.tsx app/page.tsx app/globals.css tests/rendered-html.test.mjs tests/browser-qa.mjs
git commit -m "feat: add editorial surface transitions"
```

- [ ] **Step 7: Publish through Sites**

Push the verified `main` commit to the existing Sites source repository, save a new site version from that exact commit and build archive, request explicit production deployment approval because the site is public, deploy the saved version, and wait for a terminal deployment status. The final production URL must remain `https://kachalaba-personal-swim.kamamber.chatgpt.site`.
