# Personal Swim Coaching: sales-site redesign

## Purpose

Turn the existing Kachamba Swim landing page into a premium sales page for a limited-capacity online coaching service. The page must sell a personal working relationship with Mykyta Kachalaba, not generic workout plans or a local pool lesson.

The primary conversion is a qualified Instagram conversation with `@kachamba_swim`. There is no on-site payment or form in this release.

## Audience and positioning

The offer has two entry points, but one coaching model:

- **Adult beginner:** wants to become calm, technically capable, and consistent in the water.
- **Amateur triathlete:** wants a more economical, confident swim leg that supports the rest of their race.

The common promise is a personal process: understand the current starting point, train with a plan, receive feedback, and adjust without guessing alone. The site must not promise a particular race time, body change, medical outcome, or guaranteed result.

## Product

### Primary offer

**Personal Swim Coaching** — from **$100/month**. Current capacity: **up to 8–10 athletes** at one time.

The entry configuration is deliberately transparent:

- two individual swim workouts per week (eight per month): $80/month;
- a gym plan prepared for a quarter: $60 per quarter, presented as $20/month;
- entry total: $100/month.

A three-swim-workout week is presented as an example of a larger scope: from $140/month including the gym plan. The final weekly frequency is chosen after the initial conversation; no hidden fees or false urgency.

### What is included

- individual swim-workout planning;
- a quarterly gym plan;
- video technique analysis;
- chat communication;
- regular calls for alignment and adjustments.

The page must describe these as personal support, but must not invent response-time guarantees, a fixed number of calls, or "unlimited" access that the coach has not confirmed.

## Page narrative and information architecture

1. **Hero — a selective invitation.**
   Headline presents personal online swimming coaching, not an online course. It pairs the price from $100/month, capacity of 8–10 people, and CTA: "Запитати про місце" / "Ask about a place".

2. **Two starting points.**
   Parallel cards distinguish the beginner and triathlete motivations, while explicitly leading to the same personal-coaching framework.

3. **What changes when someone is guided.**
   Contrast "random workouts and guessing" with a coach-led loop of plan, action, video feedback, adjustment, and continuity. The emphasis is on confidence and decision clarity rather than exaggerated transformations.

4. **The coaching system.**
   Show five tangible ingredients: swimming plan, strength plan, video analysis, chat, calls. The visual treatment is an editorial service blueprint rather than a generic features grid.

5. **Price and capacity.**
   Explain the $100 entry composition and the $140 three-swim-workout example in clear monthly terms. Include the real capacity limit and show that availability is confirmed in conversation; do not claim only a specific number of places remain unless that is verified at publishing time.

6. **First seven days.**
   A short sequence: first conversation → clarify goal and current level → receive first plan → send video / receive feedback → refine the next block. This resolves the fear of paying for an abandoned PDF.

7. **Coach point of view.**
   Preserve Mykyta's human tone: adult learning, technique, calm confidence, and progress without intimidation. Keep the existing real public-facing Instagram imagery.

8. **Final CTA.**
   The user goes to Instagram, where the prompt asks them to send three pieces of information: goal, city/pool access, and how many times per week they can train. This makes the conversation qualified from the first message.

## Tone and visual direction

Keep the approved **Deep Water** design language: deep navy, pearl, restrained aqua highlights, editorial whitespace, premium Apple-like restraint. The copy should be direct, quiet, and specific. Avoid cliché phrases such as "unlock your potential", "dream body", "best version", or generic motivational slogans.

The Ukrainian version remains primary. English is an equal, full translation, selected by the existing language control. The price uses USD in both languages.

## Trust and evidence rules

- Use only material supplied by Mykyta or public Instagram content already selected for the page.
- No invented testimonials, results, credentials, student counts, availability, or before/after claims.
- Do not add a case-study or testimonial section until real, permissioned evidence is supplied.
- A future video-analysis example may be added only after Mykyta chooses a clip that can be shown publicly.

## Conversion behavior

Every primary CTA opens `https://www.instagram.com/kachamba_swim/` in a new tab. CTA labels and the final instruction make the next action explicit. No payment, sign-up, or data collection is introduced in this release.

## Technical boundaries and validation

- Rework the existing `app/page.tsx`, styles, metadata, and rendered-page test; preserve the local images and social preview unless a new social card is intentionally created.
- Maintain responsive desktop and mobile layouts, reduced-motion support, Ukrainian and English content, and accessible language controls.
- Update tests to assert the product name, entry price, two audience paths, Instagram conversion, and absence of starter preview UI.
- Validate with `npm test`, production build, lint, and desktop/mobile browser review including both language variants and every CTA.
