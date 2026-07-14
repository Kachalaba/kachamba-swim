# Interactive Method Rail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static four-stage method rail with an accessible hover, focus, keyboard, and tap interaction that reveals one fixed-height expert explanation and moves a restrained waterline to the active stage.

**Architecture:** A focused `MethodRail` client component owns selection and keyboard navigation. Localized title/description pairs remain in `site-copy.ts`, `page.tsx` composes the component, and CSS renders the stable stacked panel plus responsive waterline without adding dependencies or changing the surrounding sections.

**Tech Stack:** React 19, TypeScript 5.9, native pointer and keyboard events, CSS Grid/custom properties, Node test runner, vinext.

## Global Constraints

- Keep one shared fixed-height expert panel; never expand individual rows.
- Stage 01 is selected by default.
- Hover, keyboard focus, and touch tap must select a stage.
- Use a 200–250 ms fade/slide with the existing `--ease` curve.
- Preserve Ukrainian and English content, pearl background, dark ink type, thin rules, and current section geometry.
- Add no animation library, WebGL, canvas, sound, cursor replacement, or continuous ambient motion.
- `prefers-reduced-motion: reduce` must preserve selection while disabling animated movement.
- Do not change pricing, offer, Instagram destination, hero, or surrounding content.

---

## File map

- Create `app/components/MethodRail.tsx`: selection state, pointer/focus/tap input, roving tab index, arrow/Home/End keyboard navigation, semantic tab contract.
- Modify `app/site-copy.ts`: replace method stage strings with localized `[title, description]` tuples.
- Modify `app/page.tsx`: render `MethodRail` for the method section while leaving `ProgressRail` for the coaching loop.
- Modify `app/globals.css`: desktop waterline, active/inactive states, stable stacked expert panel, mobile treatment, reduced-motion presentation.
- Modify `tests/rendered-html.test.mjs`: server-rendered copy and accessibility contract.
- Modify `tests/browser-qa.mjs`: pointer, keyboard, fixed-height, mobile tap, localization, and reduced-motion behavior.

---

### Task 1: Establish the localized semantic contract

**Files:**
- Create: `app/components/MethodRail.tsx`
- Modify: `app/site-copy.ts:31-32,113-114`
- Modify: `app/page.tsx:6,130-131`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `label: string` and `items: readonly (readonly [title: string, description: string])[]`.
- Produces: `[data-method-rail]`, four `[role="tab"]` buttons, and four stable stacked `[data-method-panel]` elements with one selected stage.

- [ ] **Step 1: Write the failing server-rendered contract test**

Add these assertions after the existing method-line assertion:

```js
assert.match(html, /data-method-rail/);
assert.match(html, /role="tablist"/);
assert.equal((html.match(/role="tab"/g) ?? []).length, 4);
assert.equal((html.match(/data-method-panel/g) ?? []).length, 4);
assert.match(html, /Прибираємо затримку й паніку: видих у воду стає ритмом руху\./);
assert.match(html, /Збираємо положення тіла, захват і ковзання без зайвої напруги\./);
assert.match(html, /Знаходимо швидкість, яку можна повторити — без боротьби з водою\./);
assert.match(html, /Дозуємо навантаження так, щоб наступне тренування додавало, а не ламало\./);
assert.doesNotMatch(html, /data-progress-mode="method"/);
```

- [ ] **Step 2: Run the rendered test and verify failure**

Run: `npm run build && node --test tests/rendered-html.test.mjs`

Expected: FAIL because the static `ProgressRail` does not expose the method interaction or expert copy.

- [ ] **Step 3: Add localized title/description tuples**

Replace the Ukrainian `methodSteps` value in `app/site-copy.ts` with:

```ts
methodSteps: [
  ["Дихання", "Прибираємо затримку й паніку: видих у воду стає ритмом руху."],
  ["Техніка", "Збираємо положення тіла, захват і ковзання без зайвої напруги."],
  ["Темп", "Знаходимо швидкість, яку можна повторити — без боротьби з водою."],
  ["Відновлення", "Дозуємо навантаження так, щоб наступне тренування додавало, а не ламало."],
],
```

Replace the English value with:

```ts
methodSteps: [
  ["Breathing", "We remove breath-holding and panic until exhaling into the water becomes the rhythm of the stroke."],
  ["Technique", "We align body position, catch and glide without adding unnecessary tension."],
  ["Pace", "We find a speed you can repeat, without fighting the water."],
  ["Recovery", "We dose the work so the next session builds you up instead of breaking you down."],
],
```

- [ ] **Step 4: Create the minimal semantic `MethodRail`**

Create `app/components/MethodRail.tsx`:

```tsx
"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";

type MethodItem = readonly [title: string, description: string];

type MethodRailProps = {
  label: string;
  items: readonly MethodItem[];
};

export function MethodRail({ label, items }: MethodRailProps) {
  const [activeStep, setActiveStep] = useState(0);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const selectAndFocus = (index: number) => {
    setActiveStep(index);
    buttonsRef.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % items.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    selectAndFocus(nextIndex);
  };

  const handlePointerEnter = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    if (event.pointerType !== "touch") setActiveStep(index);
  };

  return (
    <div
      className="method-rail"
      data-method-rail
      data-active-step={activeStep + 1}
      style={{ "--method-active": activeStep } as CSSProperties}
    >
      <span className="method-waterline" aria-hidden="true" />
      <ol role="tablist" aria-label={label}>
        {items.map(([title], index) => (
          <li key={title}>
            <button
              ref={(button) => { buttonsRef.current[index] = button; }}
              id={`method-tab-${index + 1}`}
              type="button"
              role="tab"
              aria-selected={activeStep === index}
              aria-controls={`method-panel-${index + 1}`}
              tabIndex={activeStep === index ? 0 : -1}
              data-active={activeStep === index}
              onPointerEnter={(event) => handlePointerEnter(event, index)}
              onFocus={() => setActiveStep(index)}
              onClick={() => setActiveStep(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <span aria-hidden="true">0{index + 1}</span>
              <strong>{title}</strong>
            </button>
          </li>
        ))}
      </ol>
      <div className="method-detail-stack">
        {items.map(([title, description], index) => (
          <article
            id={`method-panel-${index + 1}`}
            key={title}
            role="tabpanel"
            aria-labelledby={`method-tab-${index + 1}`}
            aria-hidden={activeStep !== index}
            data-method-panel
            data-active={activeStep === index}
          >
            <p className="method-detail-meta">
              <span>0{index + 1}</span>
              <strong>{title}</strong>
            </p>
            <p className="method-detail-copy">{description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Integrate the component**

In `app/page.tsx`, import `MethodRail` and replace:

```tsx
<ProgressRail label={t.methodLine} items={t.methodSteps} mode="method" />
```

with:

```tsx
<MethodRail label={t.methodLine} items={t.methodSteps} />
```

Keep the coaching-loop `ProgressRail` unchanged.

- [ ] **Step 6: Run the rendered test and verify pass**

Run: `npm run build && node --test tests/rendered-html.test.mjs`

Expected: PASS with four method tabs and all four Ukrainian descriptions in server-rendered HTML.

- [ ] **Step 7: Commit the semantic contract**

```bash
git add app/components/MethodRail.tsx app/site-copy.ts app/page.tsx tests/rendered-html.test.mjs
git commit -m "feat: add interactive method rail contract"
```

---

### Task 2: Render the waterline and fixed-height expert panel

**Files:**
- Modify: `app/globals.css:371-392,616-623,659-668`
- Test: `tests/browser-qa.mjs`

**Interfaces:**
- Consumes: `--method-active`, `[data-active]`, `.method-waterline`, and `.method-detail-stack` from Task 1.
- Produces: a quarter-width desktop waterline, stacked mobile row states, stable description height, and 240 ms motion using `--ease`.

- [ ] **Step 1: Add failing desktop interaction and stability assertions**

Replace the current method check in `tests/browser-qa.mjs` with:

```js
await evaluate(`document.querySelector('#method').scrollIntoView({ block: 'center' }); true`);
await delay(500);
const methodBefore = await evaluate(`(() => {
  const rail = document.querySelector('[data-method-rail]');
  const panel = rail.querySelector('.method-detail-stack');
  return {
    active: rail.dataset.activeStep,
    height: panel.getBoundingClientRect().height,
    visible: rail.querySelector('[data-method-panel][data-active="true"] .method-detail-copy').textContent,
  };
})()`);
assert.equal(methodBefore.active, "1");

const techniqueRect = await evaluate(`(() => {
  const rect = document.querySelector('#method-tab-2').getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
})()`);
await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...techniqueRect });
await delay(300);
const methodAfterHover = await evaluate(`(() => {
  const rail = document.querySelector('[data-method-rail]');
  return {
    active: rail.dataset.activeStep,
    height: rail.querySelector('.method-detail-stack').getBoundingClientRect().height,
    visible: rail.querySelector('[data-method-panel][data-active="true"] .method-detail-copy').textContent,
    transform: getComputedStyle(rail.querySelector('.method-waterline')).transform,
  };
})()`);
assert.equal(methodAfterHover.active, "2");
assert.equal(methodAfterHover.height, methodBefore.height);
assert.match(methodAfterHover.visible, /Збираємо положення тіла/);
assert.notEqual(methodAfterHover.transform, "none");
```

- [ ] **Step 2: Run browser QA and verify visual-contract failure**

Run the existing development server and then: `SITE_URL=http://localhost:3000/ npm run test:browser`

Expected: FAIL because the new component has no final rail or panel styling.

- [ ] **Step 3: Add desktop rail and panel styling**

In `app/globals.css`, replace the method-specific `.progress-rail` grid selector and add:

```css
.method .method-rail, .method .sequence-line { grid-column: 1 / -1; }
.method-rail {
  --method-active: 0;
  position: relative;
  margin-top: clamp(50px, 8vw, 118px);
  border-top: 1px solid rgba(6, 24, 29, .2);
}
.method-waterline {
  position: absolute;
  z-index: 2;
  top: -1px;
  left: 0;
  width: 25%;
  height: 2px;
  pointer-events: none;
  transform: translate3d(calc(var(--method-active) * 100%), 0, 0);
  background: linear-gradient(90deg, transparent, #2f8f89 20%, var(--ink) 68%, transparent);
  box-shadow: 0 8px 24px rgba(47, 143, 137, .22);
  transition: transform 240ms var(--ease);
}
.method-waterline::after {
  content: "";
  position: absolute;
  inset: 0 5% -9px;
  background: inherit;
  filter: blur(7px);
  opacity: .34;
}
.method-rail ol {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.method-rail li { min-width: 0; }
.method-rail button {
  width: 100%;
  min-height: 118px;
  border: 0;
  padding: 30px 0 28px;
  background: transparent;
  color: var(--ink);
  text-align: left;
  cursor: pointer;
  opacity: .38;
  transition: opacity 240ms var(--ease), transform 240ms var(--ease);
}
.method-rail button[data-active="true"] { opacity: 1; transform: translateY(-2px); }
.method-rail button > span {
  display: block;
  margin-bottom: 38px;
  font-size: 9px;
  letter-spacing: .14em;
}
.method-rail button strong {
  font-size: clamp(16px, 1.5vw, 22px);
  font-weight: 560;
  letter-spacing: -.04em;
}
.method-detail-stack {
  display: grid;
  margin-top: 8px;
  border-top: 1px solid rgba(6, 24, 29, .16);
  padding-top: clamp(26px, 3vw, 42px);
}
.method-detail-stack article {
  grid-area: 1 / 1;
  display: grid;
  grid-template-columns: minmax(150px, .65fr) minmax(0, 2.45fr);
  gap: clamp(28px, 5vw, 92px);
  align-items: start;
  visibility: hidden;
  opacity: 0;
  transform: translateY(7px);
  transition: opacity 220ms var(--ease), transform 240ms var(--ease), visibility 0s linear 240ms;
}
.method-detail-stack article[data-active="true"] {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0s;
}
.method-detail-meta {
  display: flex;
  gap: 16px;
  margin: 3px 0 0;
  font-size: 10px;
  font-weight: 620;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.method-detail-meta span { opacity: .42; }
.method-detail-meta strong { font: inherit; }
.method-detail-copy {
  max-width: 900px;
  margin: 0;
  font-size: clamp(24px, 2.55vw, 40px);
  font-weight: 470;
  letter-spacing: -.045em;
  line-height: 1.12;
  text-wrap: balance;
}
```

- [ ] **Step 4: Add the mobile active-row treatment**

Inside `@media (max-width: 760px)`, add:

```css
.method-rail { margin-top: 54px; border-top: 0; }
.method-waterline { display: none; }
.method-rail ol { grid-template-columns: 1fr; gap: 0; }
.method-rail li { border-top: 1px solid currentColor; }
.method-rail li:last-child { border-bottom: 1px solid currentColor; }
.method-rail button {
  position: relative;
  display: grid;
  grid-template-columns: 44px 1fr;
  min-height: 0;
  align-items: baseline;
  padding: 18px 0;
  overflow: hidden;
}
.method-rail button::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  transform: translateX(-18%);
  background: linear-gradient(90deg, rgba(47, 143, 137, .15), transparent 72%);
  transition: opacity 240ms var(--ease), transform 240ms var(--ease);
}
.method-rail button[data-active="true"] { transform: none; }
.method-rail button[data-active="true"]::before { opacity: 1; transform: translateX(0); }
.method-rail button > span { margin: 0; }
.method-rail button strong { font-size: 18px; }
.method-detail-stack { margin-top: 28px; padding-top: 0; }
.method-detail-stack article { grid-template-columns: 44px 1fr; gap: 0; }
.method-detail-meta {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 0;
  margin: 0;
}
.method-detail-meta span { grid-column: 1; margin-top: 2px; font-size: 9px; }
.method-detail-meta strong { grid-column: 2; }
.method-detail-copy {
  grid-column: 2;
  margin-top: 12px;
  font-size: clamp(22px, 6.7vw, 28px);
  line-height: 1.16;
  text-wrap: pretty;
}
```

- [ ] **Step 5: Run browser QA and verify desktop pass**

Run: `SITE_URL=http://localhost:3000/ npm run test:browser`

Expected: PASS for hover selection, visible Technique copy, transformed waterline, and identical panel height.

- [ ] **Step 6: Commit visual behavior**

```bash
git add app/globals.css tests/browser-qa.mjs
git commit -m "feat: animate the method waterline"
```

---

### Task 3: Verify keyboard, mobile, localization, and reduced motion

**Files:**
- Modify: `tests/browser-qa.mjs`
- Modify: `app/components/MethodRail.tsx` only if a validation failure reveals a behavior bug.
- Modify: `app/globals.css` only if a validation failure reveals clipping, contrast, or motion bugs.

**Interfaces:**
- Consumes: the semantic and visual contracts from Tasks 1–2.
- Produces: evidence that all input modes and both languages work without layout shift or overflow.

- [ ] **Step 1: Add failing keyboard assertions**

After the desktop hover assertions, add:

```js
await evaluate(`document.querySelector('#method-tab-2').focus(); true`);
await send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight", code: "ArrowRight" });
await send("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowRight", code: "ArrowRight" });
await delay(120);
const keyboardMethod = await evaluate(`(() => ({
  active: document.querySelector('[data-method-rail]').dataset.activeStep,
  focused: document.activeElement.id,
  visible: document.querySelector('[data-method-panel][data-active="true"] .method-detail-copy').textContent,
}))()`);
assert.deepEqual(keyboardMethod, {
  active: "3",
  focused: "method-tab-3",
  visible: "Знаходимо швидкість, яку можна повторити — без боротьби з водою.",
});
```

- [ ] **Step 2: Add mobile tap and fixed-height assertions**

Inside the existing 390×844 viewport case, add:

```js
await evaluate(`document.querySelector('#method').scrollIntoView({ block: 'start' }); true`);
await delay(180);
const mobilePanelHeight = await evaluate(`document.querySelector('.method-detail-stack').getBoundingClientRect().height`);
const recoveryRect = await evaluate(`(() => {
  const rect = document.querySelector('#method-tab-4').getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
})()`);
await send("Input.dispatchMouseEvent", { type: "mousePressed", button: "left", clickCount: 1, ...recoveryRect });
await send("Input.dispatchMouseEvent", { type: "mouseReleased", button: "left", clickCount: 1, ...recoveryRect });
await delay(180);
const mobileMethod = await evaluate(`(() => ({
  active: document.querySelector('[data-method-rail]').dataset.activeStep,
  height: document.querySelector('.method-detail-stack').getBoundingClientRect().height,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}))()`);
assert.equal(mobileMethod.active, "4");
assert.equal(mobileMethod.height, mobilePanelHeight);
assert.equal(mobileMethod.overflow, 0);
```

- [ ] **Step 3: Add English and reduced-motion assertions**

After switching to English, assert:

```js
assert.equal(
  await evaluate(`document.querySelector('[data-method-panel][data-active="true"] .method-detail-copy').textContent`),
  "We remove breath-holding and panic until exhaling into the water becomes the rhythm of the stroke.",
);
```

Inside the reduced-motion block, click method stage 02 and assert:

```js
await evaluate(`document.querySelector('#method-tab-2').click(); true`);
assert.equal(await evaluate(`document.querySelector('[data-method-rail]').dataset.activeStep`), "2");
assert.ok(Number.parseFloat(await evaluate(`getComputedStyle(document.querySelector('.method-waterline')).transitionDuration`)) <= 0.01);
```

- [ ] **Step 4: Run browser QA and fix only observed failures**

Run: `SITE_URL=http://localhost:3000/ npm run test:browser`

Expected: PASS for keyboard ArrowRight navigation, mobile recovery selection, fixed panel height, English copy, reduced-motion functionality, and zero browser errors.

- [ ] **Step 5: Run the full verification suite**

Run:

```bash
npm test
npm run lint
```

Expected: all tests pass, production build succeeds, and ESLint reports no errors.

- [ ] **Step 6: Perform live Browser-plugin QA**

The flow under test is: `/` → scroll to Method → hover/focus/tap stages 01–04 → the waterline and fixed-height expert panel update without layout shift.

Verify desktop and 390-pixel mobile states with the in-app Browser: page identity, nonblank content, no framework overlay, clean console, screenshot evidence, one desktop pointer interaction, one keyboard interaction, and one mobile tap interaction.

- [ ] **Step 7: Commit the completed interaction**

```bash
git add app/components/MethodRail.tsx app/site-copy.ts app/page.tsx app/globals.css tests/rendered-html.test.mjs tests/browser-qa.mjs
git commit -m "test: verify method rail interactions"
```

- [ ] **Step 8: Publish**

Push `main` to the configured GitHub remote, publish the validated Sites build, then verify the public URL renders the same interaction without console errors.
