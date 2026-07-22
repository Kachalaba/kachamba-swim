import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("seo-test", `${process.pid}-${Date.now()}-${Math.random()}`);
  return (await import(workerUrl.href)).default;
}

async function fetchRoute(path) {
  const worker = await loadWorker();
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

function jsonLdGraphs(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

test("serves Ukrainian home metadata and structured data", async () => {
  const response = await fetchRoute("/");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Тренер з плавання онлайн \| Микита Качалаба<\/title>/);
  assert.match(html, /<html lang="uk">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/kachalaba\.coach\/?"/);
  assert.match(html, /property="og:locale" content="uk_UA"/);
  assert.match(html, /property="og:site_name" content="Kachalaba Swim"/);
  assert.match(html, /property="og:image" content="https:\/\/kachalaba\.coach\/og\.jpg"/);
  assert.match(html, /name="robots" content="index, follow"/);
  assert.match(html, /name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/);

  const graphs = jsonLdGraphs(html);
  assert.equal(graphs.length, 1);
  assert.ok(graphs[0]["@graph"].some((item) => item["@type"] === "WebSite"));
  assert.ok(graphs[0]["@graph"].some((item) => item["@type"] === "Person"));
  assert.ok(graphs[0]["@graph"].some((item) => item["@type"] === "Service"));
});

test("gives the analysis offer its own canonical and social metadata", async () => {
  const response = await fetchRoute("/analysis");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Відеорозбір техніки плавання \| Kachalaba Swim<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/kachalaba\.coach\/analysis"/);
  assert.match(html, /property="og:url" content="https:\/\/kachalaba\.coach\/analysis"/);
  assert.match(html, /property="og:title" content="Відеорозбір техніки плавання \| Kachalaba Swim"/);
  assert.match(html, /Персональний відеорозбір техніки плавання за 48 годин/);
  assert.doesNotMatch(html, /<link rel="canonical" href="https:\/\/kachalaba\.coach"\/>/);

  const graphs = jsonLdGraphs(html);
  const graph = graphs.flatMap((item) => item["@graph"] ?? []);
  const service = graph.find((item) => item["@id"] === "https://kachalaba.coach/analysis#service");
  assert.equal(service?.offers?.price, "2490");
  assert.equal(service?.offers?.priceCurrency, "UAH");
  assert.ok(graph.some((item) => item["@type"] === "BreadcrumbList"));
  assert.ok(!graph.some((item) => item["@type"] === "WebSite"));
});

test("publishes crawl instructions and canonical URLs", async () => {
  const robotsResponse = await fetchRoute("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /User-Agent: \*/i);
  assert.match(robots, /Allow: \//i);
  assert.match(robots, /Sitemap: https:\/\/kachalaba\.coach\/sitemap\.xml/i);

  const sitemapResponse = await fetchRoute("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /<loc>https:\/\/kachalaba\.coach\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/kachalaba\.coach\/analysis<\/loc>/);
  assert.match(sitemap, /<lastmod>2026-07-22T20:30:00\.000Z<\/lastmod>/);
});

test("keeps the social preview lightweight", async () => {
  const image = await stat(new URL("../public/og.jpg", import.meta.url));
  assert.ok(image.size < 200 * 1024, `Expected og.jpg under 200 KB, received ${image.size}`);
});
