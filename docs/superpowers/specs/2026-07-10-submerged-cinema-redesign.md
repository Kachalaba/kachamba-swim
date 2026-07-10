# Submerged Cinema Redesign

## Purpose

Transform the existing Kachamba Swim sales page from a polished but static landing page into a distinctive premium digital experience for Mykyta Kachalaba's personal online swimming coaching.

The redesign must feel like a restrained sports documentary: expensive because of art direction, rhythm, real material, and precision—not because of decorative effects. It must preserve the approved product offer, bilingual content, transparent pricing, capacity limit, and Instagram conversion path.

## Source material and brand findings

The design is informed by public-facing posts, stories, reels, and media from the Instagram export supplied by Mykyta. Private messages and private interaction data are explicitly excluded.

Recurring brand signals in the public material:

- practical coaching without hype or miracle promises;
- breathing → technique → pace → recovery as a clear training logic;
- real pool-deck work, video feedback, team culture, starts, and open water;
- a human, self-aware voice rather than an impersonal expert persona;
- a public claim of more than 5,000 hours of personal coaching and seven years of developed methodology.

The page may use the `7 років / 5000+ годин` proof point because Mykyta explicitly approved it for the site. It must not invent testimonials, athlete results, guarantees, awards, or remaining-place counts.

## Selected visual direction

**A · Submerged Cinema**

Palette:

- deep ink: `#06181D`;
- deep water: `#08232B`;
- refracted aqua: `#7EF2E2`;
- ice: `#D9FFF8`;
- warm pearl: `#F5F0E6`.

The page combines full-bleed pool imagery, oversized condensed Ukrainian typography, fine editorial rules, translucent water-glass surfaces, and deliberate negative space. The visual language must avoid generic fitness gradients, neon cyberpunk, SaaS-style card grids, stock icons, and decorative SVG illustrations.

## Experience principles

1. **Content is visible before motion.** Animations enhance an already complete layout; they never hide essential content until JavaScript runs.
2. **One strong motion idea per scene.** No section receives multiple competing effects.
3. **Real material over decoration.** Pool footage and authentic photographs carry the atmosphere.
4. **Slow confidence.** Primary motion is fluid and controlled; fast cuts appear only in short process sequences.
5. **Performance is part of luxury.** The page remains responsive, stable, and readable on mobile networks.

## Page narrative

### Scene 1 — Cinematic entry

- Full-height hero using the existing high-resolution pool photograph.
- Oversized headline with a filled first line and an outlined secondary line.
- Product name, `Від $100/місяць`, capacity `До 8–10 спортсменів`, and one Instagram CTA remain visible without scrolling.
- A slow background crop drift, refracted-light sweep, and subtle water-texture breathing create depth.
- A small vertical documentary rail establishes `PERSONAL SWIM COACHING · UKRAINE · WORLDWIDE`.

### Scene 2 — Two starting routes

- Adult beginner and amateur triathlete are shown as two cinematic routes, not boxed feature cards.
- Each route uses one large typographic statement and a restrained image or water surface.
- Scroll changes emphasis from one route to the other without hiding either route.

### Scene 3 — Method without hype

- Present the method as an editorial sequence: `Дихання → Техніка → Темп → Відновлення`.
- Add the approved proof point `7 років методики · 5000+ годин персональної роботи`.
- Use a thin animated waterline that travels through the sequence once as it enters the viewport.

### Scene 4 — The coaching loop

- Show `План → Дія → Відеорозбір → Корекція → Наступний блок` as a living loop.
- Use real vertical pool footage inside large editorial media windows.
- A quiet progress rail follows the active step during scrolling.
- The five offer components remain explicit: swim plan, quarterly gym plan, video analysis, chat, calls.

### Scene 5 — Practice, not presentation

- Build an asymmetric documentary gallery from Mykyta, HTF, pool work, starts, and open water.
- Mix still images with one or two short muted video loops.
- Captions identify the context without making performance claims.

### Scene 6 — The offer

- Keep one premium offer rather than a tariff matrix.
- Explain the transparent entry composition: two weekly swim workouts `$80/month` plus quarterly gym plan `$60/quarter` or `$20/month`.
- Preserve the three-swim-workout example from `$140/month`.
- Pricing uses large editorial typography and substantial negative space.

### Scene 7 — Qualified invitation

- Final CTA asks for goal, city/pool access, and realistic weekly availability.
- CTA goes to `https://www.instagram.com/kachamba_swim/` in a new tab with `noreferrer`.
- The closing atmosphere returns to deep water and a slow light field.

## Motion system

### Initial load

- Masthead and language control are immediately visible.
- Hero eyebrow, headline lines, offer facts, and CTA settle in with a short stagger.
- The hero image begins fully visible; no opacity-zero flash.

### Scroll motion

- Native `IntersectionObserver` adds a single reveal state to scene elements.
- CSS custom properties drive translation, crop, and light position.
- Media windows use subtle scale/crop drift; content blocks use short vertical reveals.
- The method waterline and coaching progress rail animate once per viewport entry.
- No external animation library is required for the first implementation.

### Continuous ambient motion

- Hero crop drift: approximately 18 seconds.
- Refracted-light sweep: approximately 12 seconds.
- Water texture breathing: approximately 11 seconds.
- Continuous effects use transforms and opacity only.

### Reduced motion and failure behavior

- `prefers-reduced-motion: reduce` disables parallax, continuous drift, animated rails, and staggered movement.
- All copy and CTAs remain visible when JavaScript is disabled or observers are unavailable.
- Videos use `muted`, `loop`, `playsInline`, and poster images.
- If a video fails or autoplay is blocked, the poster remains the complete visual state.

## Media strategy

Use the current archive media to build and validate the layout now. The current vertical clips are suitable for editorial windows but not for a full-width hero because of resolution, orientation, and story overlays.

When Mykyta supplies higher-quality Instagram exports later:

- replace media files behind stable semantic filenames;
- preserve aspect-ratio wrappers and poster contracts;
- avoid changing layout or animation code;
- prefer clean original clips without Instagram text overlays;
- generate lightweight WebM/MP4 derivatives and static posters for the site.

## Content and language

- Ukrainian remains the default language.
- English is a complete translation of every visible string and accessible label.
- The document `lang` value follows the selected language.
- Copy remains direct, adult, and specific; avoid phrases such as “unlock your potential,” “best version,” or guaranteed transformations.

## Component boundaries

- `app/page.tsx`: page composition, language state, translated copy, and semantic section order.
- `app/components/CinematicMedia.tsx`: video/image media window, poster fallback, and accessible labeling.
- `app/components/Reveal.tsx`: progressive enhancement wrapper using `IntersectionObserver`.
- `app/components/ProgressRail.tsx`: method/coaching progress presentation driven by section state.
- `app/globals.css`: palette, typography, layout, motion choreography, responsive behavior, reduced-motion rules.
- `app/layout.tsx`: metadata and social preview.

Components must render meaningful static HTML before client-side motion attaches.

## Performance and accessibility

- Preserve semantic headings, section labels, focus-visible states, and keyboard-accessible language buttons.
- Do not create a custom cursor or scroll hijacking.
- Lazy-load below-the-fold video and images where compatible with stable layout.
- Preload only the hero photograph; do not preload all documentary media.
- Reserve media aspect ratios to prevent layout shift.
- Ensure text contrast remains readable over moving imagery.

## Validation

- Update the rendered-page test for the method proof point, cinematic scene copy, offer pricing, both audiences, and Instagram link contract.
- Run `npm test`, production build, and lint.
- Review desktop and 390px mobile layouts in the browser.
- Verify Ukrainian/English switching, document language, every CTA, video poster fallback, and no horizontal overflow.
- Verify reduced-motion mode leaves a complete, readable page.

