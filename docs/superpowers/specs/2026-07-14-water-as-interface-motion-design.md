# Water as Interface: expressive motion design

## Purpose

Add one memorable, expressive editorial interaction to the existing Kachalaba Swim site without turning it into a sports-tech interface or a collection of unrelated effects. The motion should feel culturally current for a progressive creative audience while remaining calm, premium, and specific to swimming.

The chosen concept is **Water as Interface**: the hero behaves like a submerged editorial surface. Pointer and scroll movement reveal a controlled optical refraction, and the outlined headline appears to fill as a virtual waterline crosses it. Supporting section transitions echo that same waterline once, quietly, as the visitor moves through the page.

## Experience principles

- One signature interaction carries the “wow” effect; supporting motion remains subordinate.
- Water is represented through light, refraction, depth, and surface movement, not literal wave illustrations.
- The site keeps its current documentary photography, bilingual copy, premium dark palette, and Instagram conversion path.
- Motion communicates focus and coaching precision. It must not resemble a game, fitness dashboard, or template animation pack.
- The page remains completely readable and usable without pointer input, JavaScript, or animation.

## Signature hero interaction

### Refractive field

The hero gains a large, soft circular field that follows pointer movement within the hero. Inside the field, a duplicated crop of the existing hero photograph is offset by approximately 8–12 pixels, slightly brighter, and subtly shifted toward aqua. A feathered circular mask blends the altered crop into the base photograph, producing a restrained optical-refraction illusion without WebGL.

The field is decorative and never replaces the system cursor. It does not capture pointer events. Pointer coordinates are written to CSS custom properties at most once per animation frame. When the pointer leaves the hero, the field eases toward the current waterline focal point rather than disappearing abruptly.

### Typographic waterline

The outlined second line of the hero headline gains a duplicated filled layer. A soft horizontal mask reveals the filled layer from bottom to top. On desktop, the pointer’s vertical position influences the fill level while the visitor is interacting with the hero. Scroll progress provides the baseline, so the title still resolves intentionally when no pointer is present.

The filled state uses pearl with a restrained aqua edge, preserving the current type treatment and contrast. The text itself, line breaks, language switching, and semantic heading remain unchanged.

### Scroll release

During the first portion of the page scroll, the hero image and refractive field separate by a small amount of depth while the waterline completes its movement through the outlined title. The hero remains in normal document flow; there is no scroll locking, pinned multi-screen sequence, or hijacked wheel behavior.

## Supporting editorial motion

Each numbered scene receives one thin “surface pass” when it first enters the viewport: a translucent aqua-to-transparent plane travels horizontally across the section boundary, briefly revealing the scene number and heading with slightly higher contrast. The pass lasts under one second and runs once.

Existing content reveals, progress rails, documentary media, and button interactions remain. Their timings will be adjusted only where needed so they do not compete with the new surface pass. No additional continuous ambient effects are added below the hero.

## Input and responsive behavior

### Desktop and precise pointers

- Pointer movement controls the refractive field and gently influences headline fill.
- Scroll progress remains the stable baseline for both effects.
- The effect is strongest near the headline and quieter near navigation and CTA controls.

### Touch and mobile

- The hero uses scroll-driven headline fill and depth only.
- A touch drag inside non-interactive hero space briefly reveals the refractive field; tapping links and controls is never intercepted.
- There is no autonomous cursor simulation or permanent continuous animation on mobile.
- The existing mobile composition and headline line breaks remain the layout source of truth.

### Reduced motion and fallback

With `prefers-reduced-motion: reduce`, pointer tracking, depth movement, surface passes, and animated fill are disabled. The headline renders in a complete, high-contrast static state and the hero photograph uses its existing stable crop.

If JavaScript, `requestAnimationFrame`, or observers are unavailable, the base hero, all copy, navigation, language controls, and CTAs remain visible. Decorative duplicated layers are hidden by default and enabled only after the interaction is ready.

## Component boundaries

- Add a focused client component for the hero interaction. It owns pointer/scroll sampling, reduced-motion state, and CSS custom properties; it does not own copy or language state.
- Keep `app/page.tsx` responsible for content and composition. The current hero media, shade, headline, offer, facts, and CTA remain semantic children of the hero section.
- Keep the visual implementation in `app/globals.css`: duplicated media treatment, masks, waterline layers, depth transforms, surface-pass styling, responsive rules, and reduced-motion rules.
- Reuse the existing reveal infrastructure for one-shot section entry. Extend it with a small explicit variant or data attribute rather than creating a second general animation system.

## Performance constraints

- Do not add an animation library, canvas renderer, WebGL scene, custom cursor, or scroll-smoothing dependency.
- Animate CSS custom properties, transforms, opacity, and mask position. Avoid per-frame layout reads after the hero bounds are cached; refresh bounds on resize.
- Coalesce pointer and scroll work through one `requestAnimationFrame` update.
- Use one duplicated hero image only. Keep `will-change` scoped to the hero while it is interactive.
- Preserve the current image asset, responsive loading behavior, and below-the-fold video strategy.

## Accessibility and interaction safety

- The refractive field and surface passes are `aria-hidden` and non-interactive.
- Navigation, language controls, CTA focus states, contrast, and hit targets remain unchanged.
- Motion is strongest away from actionable controls and cannot obscure or distort CTA text.
- Keyboard users receive the complete static visual hierarchy without needing to trigger the pointer effect.
- The English and Ukrainian versions receive identical motion behavior, with masks adapting to the rendered text dimensions.

## Validation

- Run the existing test suite, production build, and lint.
- Add coverage for the hero interaction’s static markup contract and progressive-enhancement state.
- Verify pointer movement changes the refractive field without moving the system cursor or blocking CTA interaction.
- Verify scroll completes the headline fill when no pointer is used.
- Verify Ukrainian/English switching does not clip either headline.
- Verify desktop and 390-pixel mobile layouts have no horizontal overflow.
- Verify `prefers-reduced-motion: reduce` produces a complete static hero and disables decorative movement.
- Verify every Instagram CTA and navigation anchor still works.

## Out of scope

- Copy, pricing, audience, offer structure, and Instagram destination changes.
- New photography, video, testimonials, case studies, or coaching claims.
- WebGL water simulation, cursor replacement, audio, scroll locking, or site-wide continuous parallax.
- Redesigning sections that are unrelated to the motion concept.
