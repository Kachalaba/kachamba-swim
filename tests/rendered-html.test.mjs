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
  assert.match(html, /Повне ведення — від 4 500 грн\/місяць/);
  assert.match(html, /Для дорослих, які починають/);
  assert.match(html, /Для триатлетів-любителів/);
  assert.match(html, /До 8–10 спортсменів одночасно/);
  assert.match(html, /kachalaba_swim/);
  assert.match(html, /lang="uk"/);
  assert.match(html, /План → дія → відеозворотний зв’язок → корекція → безперервність/);
  assert.match(html, /Надсилаєте відео й отримуєте зворотний зв’язок/);
  assert.match(html, /Уточнюємо наступний блок/);
  assert.match(html, /7 років методики/);
  assert.match(html, /5000\+ годин персональної роботи/);
  assert.match(html, /Дихання → Техніка → Темп → Відновлення/);
  assert.match(html, /План → Дія → Відеорозбір → Корекція → Наступний блок/);
  assert.match(html, /data-video-src="\/media\/coaching-loop\.mp4"/);
  assert.match(html, /poster="\/media\/coaching-loop-poster\.webp"/);
  assert.match(html, /data-video-src="\/media\/coach-deck-loop\.mp4"/);
  assert.match(html, /poster="\/media\/coach-deck-poster\.webp"/);
  assert.doesNotMatch(html, /<video\b[^>]*\ssrc="\/media\/(?:coaching-loop|coach-deck-loop)\.mp4"/i);
  assert.equal((html.match(/<video\b[^>]*\bpreload="none"/gi) ?? []).length, 2);
  assert.doesNotMatch(html, /<video\b[^>]*\bautoplay(?:=""|(?=[\s>]))/i);
  assert.match(html, /<h1[^>]*id="hero-title"[^>]*>[\s\S]*class="hero-title-filled"[\s\S]*class="hero-title-outline"[\s\S]*<\/h1>/);
  assert.match(html, /Плавання, яке[\s\S]*підлаштоване під ваше життя\./);
  assert.match(html, /PERSONAL SWIM COACHING · UKRAINE · WORLDWIDE/);
  assert.match(html, /Обговорити формат/);
  assert.match(html, /Розбір техніки за відео/);
  assert.match(html, /₴2 490/);
  assert.match(html, /href="\/analysis"/);
  assert.match(html, /href="https:\/\/t\.me\/m\/mIj5epmcZGE6"/);
  assert.match(html, /href="https:\/\/wa\.me\/380970353470"/);
  assert.doesNotMatch(html, /Запитати про місце/);
  assert.match(html, /data-revealed="false"/);
  assert.match(html, /data-active-route="0"/);
  assert.match(html, /data-progress-mode="method"/);
  assert.match(html, /data-progress-mode="coaching"/);
  assert.match(html, /property="og:image" content="https:\/\/kachalaba\.coach\/og\.png"/);
  const conversionLinks = html.match(
    /href="https:\/\/www\.instagram\.com\/kachalaba_swim\/" target="_blank" rel="noreferrer"/g,
  ) ?? [];
  assert.equal(conversionLinks.length, 4);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
});
