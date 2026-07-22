import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const siteCopySource = await readFile(
  new URL("../app/site-copy.ts", import.meta.url),
  "utf8",
);
const nextConfigSource = await readFile(
  new URL("../next.config.ts", import.meta.url),
  "utf8",
);

function localeSource(language, nextLanguage) {
  const end = nextLanguage
    ? `\\n  \\},\\n  ${nextLanguage}:\\s*\\{`
    : "\\n  \\},\\n\\} as const;";
  const match = siteCopySource.match(
    new RegExp(`\\n  ${language}:\\s*\\{([\\s\\S]*?)${end}`),
  );
  assert.ok(match, `Expected to find the ${language} locale in app/site-copy.ts`);
  return match[1];
}

function pricingFields(source) {
  const scalarFields = [...source.matchAll(
    /\b(?:heroPrice|price|pricingText|pricingClarification):\s*"([^"]*)"/g,
  )].map((match) => match[1]);
  const priceFacts = source.match(/\bpriceFacts:\s*\[([\s\S]*?)\n\s*\],/);
  assert.ok(priceFacts, "Expected to find priceFacts in locale source");

  return [
    ...scalarFields,
    ...[...priceFacts[1].matchAll(/"([^"]*)"/g)].map((match) => match[1]),
  ];
}

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
  assert.match(html, /Від 4 500 грн\/місяць/);
  assert.match(html, /2 тренування щотижня — 3 600 грн\/місяць/);
  assert.match(html, /Силовий план — \+900 грн\/місяць/);
  assert.match(html, /від 6 300 грн\/місяць/);
  assert.match(
    html,
    /Вартість персонального ведення\. Басейн і клубні абонементи оплачуються окремо\./,
  );
  assert.match(html, /Для дорослих, які починають/);
  assert.match(html, /Для триатлетів-любителів/);
  assert.match(html, /До 8–10 спортсменів одночасно/);
  assert.match(html, /kachalaba_swim/);
  assert.doesNotMatch(html, /kachamba_swim/);
  assert.match(html, /lang="uk"/);
  assert.match(html, /План → дія → відеозворотний зв’язок → корекція → безперервність/);
  assert.match(html, /Надсилаєте відео й отримуєте зворотний зв’язок/);
  assert.match(html, /Уточнюємо наступний блок/);
  assert.match(html, /7 років методики/);
  assert.match(html, /5000\+ годин персональної роботи/);
  assert.match(html, /Команда на старті/);
  assert.doesNotMatch(html, /Команда HTF на старті/);
  assert.match(html, /Дихання → Техніка → Темп → Відновлення/);
  assert.match(html, /data-method-rail/);
  assert.match(html, /role="tablist"/);
  assert.equal((html.match(/role="tab"/g) ?? []).length, 4);
  assert.equal((html.match(/<li role="presentation">/g) ?? []).length, 4);
  assert.equal((html.match(/data-method-panel/g) ?? []).length, 4);
  assert.match(html, /Прибираємо затримку й паніку: видих у воду стає ритмом руху\./);
  assert.match(html, /Збираємо положення тіла, захват і ковзання без зайвої напруги\./);
  assert.match(html, /Знаходимо швидкість, яку можна повторити — без боротьби з водою\./);
  assert.match(html, /Дозуємо навантаження так, щоб наступне тренування додавало, а не ламало\./);
  assert.doesNotMatch(html, /data-progress-mode="method"/);
  assert.match(html, /План → Дія → Відеорозбір → Корекція → Наступний блок/);
  assert.match(html, /data-video-src="\/media\/coaching-loop\.mp4"/);
  assert.match(html, /poster="\/media\/coaching-loop-poster\.webp"/);
  assert.match(html, /data-video-src="\/media\/coach-deck-loop\.mp4"/);
  assert.match(html, /poster="\/media\/coach-deck-poster\.webp"/);
  assert.doesNotMatch(html, /<video\b[^>]*\ssrc="\/media\/(?:coaching-loop|coach-deck-loop)\.mp4"/i);
  assert.equal((html.match(/<video\b[^>]*\bpreload="none"/gi) ?? []).length, 2);
  assert.doesNotMatch(html, /<video\b[^>]*\bautoplay(?:=""|(?=[\s>]))/i);
  assert.match(html, /<h1[^>]*id="hero-title"[^>]*>[\s\S]*class="hero-title-filled"[\s\S]*class="hero-title-outline"[\s\S]*<\/h1>/);
  assert.match(html, /<section[^>]*class="cinema-hero"[^>]*data-water-interface="idle"/);
  assert.match(html, /class="water-refraction" aria-hidden="true"/);
  assert.match(html, /class="hero-title-outline-fill" aria-hidden="true"/);
  assert.match(html, /class="hero-title-outline-fill"[^>]*data-text="підлаштоване під ваше життя\."/);
  assert.match(html, /Плавання, яке[\s\S]*підлаштоване під ваше життя\./);
  assert.match(html, /PERSONAL SWIM COACHING · UKRAINE · WORLDWIDE/);
  assert.match(html, /Обговорити формат/);
  assert.match(html, /Розбір техніки за відео/);
  assert.match(html, /₴2 490/);
  assert.match(html, /Менший перший крок/);
  assert.match(html, /Розбір без підписки/);
  assert.ok((html.match(/href="\/analysis"/g) ?? []).length >= 3);
  assert.match(
    html,
    /class="hero-analysis-offer"[\s\S]*href="\/analysis"[\s\S]*class="analysis-price-note">Відеорозбір · ₴2 490 · готовність до 48 годин/,
  );
  assert.doesNotMatch(html, /Запитати про місце/);
  assert.match(html, /data-revealed="false"/);
  assert.match(html, /data-active-route="0"/);
  assert.match(html, /data-progress-mode="coaching"/);
  assert.equal((html.match(/data-surface="true"/g) ?? []).length, 5);
  assert.match(html, /<link rel="canonical" href="https:\/\/kachalaba\.coach\/"/);
  assert.match(html, /property="og:url" content="https:\/\/kachalaba\.coach\/"/);
  assert.match(html, /property="og:image" content="https:\/\/kachalaba\.coach\/og\.png"/);
  assert.match(html, /<link[^>]*rel="icon"[^>]*href="[^"]*\/favicon\.svg"/);
  const conversionLinks = html.match(
    /href="https:\/\/www\.instagram\.com\/kachalaba_swim\/" target="_blank" rel="noreferrer"/g,
  ) ?? [];
  assert.equal(conversionLinks.length, 4);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
});

test("server-renders the Happy Tri Friends affiliation with safe external links", async () => {
  const response = await render();
  assert.equal(response.status, 200);

  const html = await response.text();
  const htfLinks = html.match(
    /href="https:\/\/happytrifriends\.com" target="_blank" rel="noreferrer"/g,
  ) ?? [];
  assert.equal(htfLinks.length, 3);
  assert.match(html, /COACH AT HAPPY TRI FRIENDS/);
  assert.match(html, /київського триатлонного клубу[\s\S]*Happy Tri Friends/);
});

test("server-renders Telegram and WhatsApp as quiet alternative contact channels", async () => {
  const response = await render();
  assert.equal(response.status, 200);

  const html = await response.text();
  const telegramLinks = html.match(
    /href="https:\/\/t\.me\/m\/mIj5epmcZGE6" target="_blank" rel="noreferrer"/g,
  ) ?? [];
  const whatsappLinks = html.match(
    /href="https:\/\/wa\.me\/380970353470" target="_blank" rel="noreferrer"/g,
  ) ?? [];

  assert.equal(telegramLinks.length, 2);
  assert.equal(whatsappLinks.length, 2);
  assert.match(html, /Зручніше в месенджері\?/);
  assert.doesNotMatch(html, />\+380970353470</);
});

test("redirects the www host to the canonical domain permanently", () => {
  assert.match(nextConfigSource, /type:\s*"host"/);
  assert.match(nextConfigSource, /value:\s*"www\.kachalaba\.coach"/);
  assert.match(nextConfigSource, /destination:\s*"https:\/\/kachalaba\.coach\/:path\*"/);
  assert.match(nextConfigSource, /permanent:\s*true/);
});

test("keeps pricing localized by language in the source copy", () => {
  const ukrainianSource = localeSource("uk", "en");
  const englishSource = localeSource("en");

  assert.match(englishSource, /\$80\/month/);
  assert.match(englishSource, /\$100/);
  assert.match(englishSource, /\$140\/month/);
  assert.match(
    englishSource,
    /Pricing covers personal coaching\. Pool access and club memberships are paid separately\./,
  );

  for (const field of pricingFields(ukrainianSource)) {
    assert.doesNotMatch(field, /\$/);
  }
  for (const field of pricingFields(englishSource)) {
    assert.doesNotMatch(field, /грн/);
  }
});

test("keeps the documentary team caption neutral in both languages", () => {
  const ukrainianSource = localeSource("uk", "en");
  const englishSource = localeSource("en");

  assert.match(ukrainianSource, /"Команда на старті"/);
  assert.doesNotMatch(ukrainianSource, /"Команда HTF на старті"/);
  assert.match(englishSource, /"Team at the start"/);
  assert.doesNotMatch(englishSource, /"HTF team at a race"/);
});
