# Interactive Method Rail Design

## Goal

Turn the four method stages — Breathing, Technique, Pace, and Recovery — into one precise editorial interaction that adds expert depth without making the section feel like an accordion, dashboard, or collection of effects.

The interaction extends the approved **Water as Interface** direction. It should feel like a controlled layer of knowledge surfacing through water: calm, exact, and culturally current for a progressive creative audience.

## Chosen direction

Use one shared, fixed-height expert panel beneath the four stages.

- Stage 01 is selected by default.
- Pointer hover, keyboard focus, and touch tap select a stage.
- Only one stage is active at a time.
- Selecting a stage updates the shared panel; individual rows never expand.
- A thin luminous waterline glides to the active stage in 200–250 ms.
- The expert sentence crossfades and moves upward by a few pixels in the same timing.
- The overall section height remains stable in both languages and at every viewport.

This is preferred over four accordions because the existing page already contains several detailed numbered sequences. A shared panel preserves the method block as an editorial spine while adding one intentional layer of expertise.

## Interaction model

### Desktop and precise pointers

- Hovering a stage previews and selects it immediately.
- Focusing a stage from the keyboard selects it.
- Clicking keeps the selected stage active after the pointer moves away.
- Left and right arrow keys move between the four stages.
- Home and End move to the first and last stages.

### Touch and mobile

- Each stage is a full-width tap target.
- A tap selects the stage and updates the same shared panel below the list.
- No hover-only state, horizontal carousel, hidden swipe gesture, or expanding row is introduced.

### Stable layout

All four expert descriptions occupy the same CSS grid area. Inactive descriptions remain in layout but are visually hidden and ignored by assistive technology. The shared panel therefore takes the height of the longest localized description and never jumps when the active stage changes.

## Visual treatment

- Preserve the current pearl background, dark ink type, thin rules, numbering, and typography.
- Convert the four stage labels into borderless semantic controls that visually remain part of the editorial rail.
- Dim inactive stages slightly; keep the active stage at full contrast.
- Add one aqua-to-ice waterline segment aligned to the active quarter of the desktop rail, with a restrained blurred reflection beneath it.
- On mobile, use a short luminous edge and a soft surface wash inside the active row rather than forcing a horizontal indicator into the stacked layout.
- The expert panel uses a small index and title followed by one sentence. It receives no card border, icon, arrow, radius, or drop shadow.
- Motion uses the existing `--ease` curve and stays subordinate to the hero refraction.

## Copy

### Ukrainian

1. **Дихання** — Прибираємо затримку й паніку: видих у воду стає ритмом руху.
2. **Техніка** — Збираємо положення тіла, захват і ковзання без зайвої напруги.
3. **Темп** — Знаходимо швидкість, яку можна повторити — без боротьби з водою.
4. **Відновлення** — Дозуємо навантаження так, щоб наступне тренування додавало, а не ламало.

### English

1. **Breathing** — We remove breath-holding and panic until exhaling into the water becomes the rhythm of the stroke.
2. **Technique** — We align body position, catch and glide without adding unnecessary tension.
3. **Pace** — We find a speed you can repeat, without fighting the water.
4. **Recovery** — We dose the work so the next session builds you up instead of breaking you down.

## Component boundary

Add a focused `MethodRail` client component for this interaction. It owns only the active stage, pointer/focus/tap handling, keyboard navigation, and the active-index CSS variable.

- `app/page.tsx` passes localized method items into `MethodRail`.
- `app/site-copy.ts` stores each method title together with its expert description.
- `app/components/ProgressRail.tsx` continues to own the scroll-driven coaching loop and is not burdened with a second interaction model.
- `app/globals.css` owns the rail, waterline, expert panel, responsive, focus, and reduced-motion presentation.

## Accessibility

- Use a labelled tab list with four real buttons and one tab panel.
- Expose the selected state with `aria-selected` and connect controls to the panel with `aria-controls` / `aria-labelledby`.
- Keep visible focus styling and a minimum practical touch target on mobile.
- Do not rely on color alone: the active stage also receives the waterline position and selected-state contrast.
- With `prefers-reduced-motion: reduce`, the state change remains functional but transitions and reflected movement are disabled.
- The base content remains readable in server-rendered HTML.

## Validation

- Add server-rendered markup coverage for the four localized expert descriptions and the tab / tabpanel contract.
- Verify pointer hover changes the active stage and visible expert sentence.
- Verify keyboard focus and arrow navigation change selection without scrolling the page unexpectedly.
- Verify touch tap changes the selected stage on a 390-pixel viewport.
- Measure the expert panel before and after selection and require identical height.
- Verify Ukrainian and English copy do not overflow the rail or panel.
- Verify reduced-motion mode preserves all selection behavior without animated movement.
- Run the existing unit/render tests, production build, lint, and live browser checks.

## Out of scope

- Changes to the hero, pricing, offer, Instagram destination, or surrounding content.
- Four independent accordions or expanding stage rows.
- New libraries, WebGL, canvas, sound, cursor replacement, or continuous ambient motion.
- New coaching claims beyond the four approved explanatory sentences.
