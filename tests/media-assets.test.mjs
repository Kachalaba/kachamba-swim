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
