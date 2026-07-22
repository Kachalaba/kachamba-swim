import assert from "node:assert/strict";
import test from "node:test";

async function renderAnalysisPage() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("analysis-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/analysis", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the paid Video Technique Audit funnel", async () => {
  const response = await renderAnalysisPage();
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Video Technique Audit/);
  assert.match(html, /₴2 490/);
  assert.match(html, /48 годин/);
  assert.match(html, /Професійна інтерпретація, не медичний діагноз/);
  assert.match(html, /<form/);
  assert.match(html, /Підготувати повідомлення/);
  assert.match(html, /Evidence-кадри/);
  assert.match(html, /href="\/"/);
});
