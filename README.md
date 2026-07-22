# Kachalaba Swim

Premium bilingual sales site for Mykyta Kachalaba’s personal online swim coaching. The experience is built around documentary pool footage, a seven-scene editorial narrative, Ukrainian and English copy, and accessible motion.

The site now sells two connected offers: recurring personal coaching and a
one-off [Video Technique Audit](docs/releases/2026-07-22-video-technique-audit.md)
at `/analysis`. The audit prepares a messenger-ready brief locally in the
browser and does not upload or persist client data.

## Local development

```bash
npm install
npm run dev
```

The local site runs at `http://localhost:3000/`.

## Verification

```bash
npm run build
npm test
npm run lint
```

`npm test` validates the homepage and `/analysis` production renders, local
intake-message builder, documentary-media budget, offer and conversion links,
lazy video contract, bilingual hero structure, and absolute social metadata.

For a dependency-free runtime browser pass, start Chrome with the DevTools protocol and run:

```bash
npm run test:browser
```

The browser pass checks desktop and mobile bounds, initial media loading, scroll progress, English switching, reduced motion, CTA count, and horizontal overflow.

## Replacing Instagram media

The layout and motion system use stable semantic filenames. Higher-quality exports can replace the matching files without changing React or CSS:

- `public/media/coaching-loop.mp4`
- `public/media/coaching-loop-poster.webp`
- `public/media/coach-deck-loop.mp4`
- `public/media/coach-deck-poster.webp`
- `public/media/open-water.webp`
- `public/media/hero-pool.webp`
- `public/media/coach-outdoor.webp`
- `public/media/htf-team.webp`

Keep video files muted, H.264-compatible, optimized for web playback, and within the limits enforced by `tests/media-assets.test.mjs`. Update each poster from the same final clip.

## Deployment

The project builds with vinext for OpenAI Sites. Hosting metadata is stored in `.openai/hosting.json`; production social metadata points to the deployed Sites origin.
