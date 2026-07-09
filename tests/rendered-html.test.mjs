import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Kachamba Swim premium landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Персональне онлайн-ведення з плавання/);
  assert.match(html, /Від \$100\/місяць/);
  assert.match(html, /Для дорослих, які починають/);
  assert.match(html, /Для триатлетів-любителів/);
  assert.match(html, /До 8–10 спортсменів одночасно/);
  assert.match(html, /kachamba_swim/);
  assert.match(html, /lang="uk"/);
  assert.match(html, /План → дія → відеозворотний зв’язок → корекція → безперервність/);
  assert.match(html, /Надсилаєте відео й отримуєте зворотний зв’язок/);
  assert.match(html, /Уточнюємо наступний блок/);
  const conversionLinks = html.match(
    /href="https:\/\/www\.instagram\.com\/kachamba_swim\/" target="_blank" rel="noreferrer"/g,
  ) ?? [];
  assert.equal(conversionLinks.length, 4);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
});
