import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

const debugOrigin = process.env.CHROME_DEBUG_ORIGIN ?? "http://127.0.0.1:9223";
const siteUrl = process.env.SITE_URL ?? "http://localhost:3000/";
const pages = await fetch(`${debugOrigin}/json/list`).then((response) => response.json());
const page = pages.find((entry) => entry.type === "page");
assert.ok(page, "Chrome must expose one page target");

const socket = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
const listeners = new Map();
const browserErrors = [];
let nextId = 0;

socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) {
    const request = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) request?.reject(new Error(message.error.message));
    else request?.resolve(message.result);
    return;
  }
  if (message.method === "Runtime.exceptionThrown") browserErrors.push(message.params.exceptionDetails.text);
  if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
    browserErrors.push(message.params.args.map((arg) => arg.value ?? arg.description).join(" "));
  }
  for (const resolve of listeners.get(message.method) ?? []) resolve(message.params);
  listeners.delete(message.method);
});

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

function send(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

function once(method) {
  return new Promise((resolve) => listeners.set(method, [...(listeners.get(method) ?? []), resolve]));
}

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function evaluate(expression) {
  const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
  return response.result.value;
}

async function setViewport(width, height) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 760,
    screenWidth: width,
    screenHeight: height,
  });
}

async function navigate() {
  const loaded = once("Page.loadEventFired");
  await send("Page.navigate", { url: siteUrl });
  await Promise.race([loaded, delay(8_000)]);
  await delay(1_100);
}

async function screenshot(path) {
  const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await writeFile(path, Buffer.from(data, "base64"));
}

await send("Page.enable");
await send("Runtime.enable");

await setViewport(1470, 705);
await navigate();
const desktop = await evaluate(`(() => {
  const hero = document.querySelector('.cinema-hero').getBoundingClientRect();
  const required = [...document.querySelectorAll('.cinema-hero-copy > *')].map((node) => {
    const rect = node.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom };
  });
  return {
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    heroFits: required.every((rect) => rect.top >= hero.top - 1 && rect.bottom <= hero.bottom + 1),
    videos: [...document.querySelectorAll('video')].map((video) => ({
      hasSrc: video.hasAttribute('src'), paused: video.paused, preload: video.preload,
    })),
  };
})()`);
assert.equal(desktop.overflow, 0);
assert.equal(desktop.heroFits, true);
assert.ok(desktop.videos.every((video) => !video.hasSrc && video.paused && video.preload === "none"));
await screenshot("/tmp/kachamba-desktop.png");

await evaluate(`document.querySelector('#method').scrollIntoView({ block: 'center' }); true`);
await delay(1_800);
const method = await evaluate(`(() => ({
  complete: document.querySelector('[data-progress-mode="method"]').dataset.complete,
  routesRevealed: [...document.querySelectorAll('.route')].every((route) => route.dataset.revealed === 'true'),
}))()`);
assert.equal(method.complete, "true");
assert.equal(method.routesRevealed, true);
await screenshot("/tmp/kachamba-method.png");

await evaluate(`document.querySelector('[data-progress-mode="coaching"]').scrollIntoView({ block: 'center' }); true`);
await delay(700);
const coachingStart = await evaluate(`(() => {
  const rail = document.querySelector('[data-progress-mode="coaching"]');
  return { progress: Number(rail.dataset.progress), active: Number(rail.dataset.activeStep) };
})()`);
await evaluate(`window.scrollBy({ top: 520, behavior: 'instant' }); true`);
await delay(500);
const coachingLater = await evaluate(`(() => {
  const rail = document.querySelector('[data-progress-mode="coaching"]');
  return { progress: Number(rail.dataset.progress), active: Number(rail.dataset.activeStep) };
})()`);
assert.ok(coachingLater.progress > coachingStart.progress);
assert.ok(coachingLater.active >= coachingStart.active);
assert.equal(await evaluate(`document.querySelector('#system video').hasAttribute('src')`), true);
await screenshot("/tmp/kachamba-system.png");

await evaluate(`document.querySelector('#apply').scrollIntoView({ block: 'center' }); true`);
await delay(500);
assert.equal(await evaluate(`document.querySelector('#system video').paused`), true);

await evaluate(`([...document.querySelectorAll('.language-switch button')].find((button) => button.textContent === 'EN')).click(); true`);
await delay(200);
const english = await evaluate(`({
  lang: document.documentElement.lang,
  filled: document.querySelector('.hero-title-filled').textContent,
  outline: document.querySelector('.hero-title-outline').textContent,
  instagram: [...document.querySelectorAll('a[href="https://www.instagram.com/kachamba_swim/"]')].length,
})`);
assert.deepEqual(english, { lang: "en", filled: "Swimming that", outline: "adapts to your life.", instagram: 4 });

for (const [width, height, path] of [[390, 844, "/tmp/kachamba-mobile.png"], [390, 667, null]]) {
  await setViewport(width, height);
  await navigate();
  const mobile = await evaluate(`(() => {
    const hero = document.querySelector('.cinema-hero').getBoundingClientRect();
    const copy = document.querySelector('.cinema-hero-copy').getBoundingClientRect();
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      heroFits: copy.top >= hero.top - 1 && copy.bottom <= hero.bottom + 1,
      outlineRight: document.querySelector('.hero-title-outline').getBoundingClientRect().right,
      viewport: document.documentElement.clientWidth,
    };
  })()`);
  assert.equal(mobile.overflow, 0);
  assert.equal(mobile.heroFits, true);
  assert.ok(mobile.outlineRight <= mobile.viewport + 1);
  if (path) await screenshot(path);
}

await send("Emulation.setEmulatedMedia", {
  media: "screen",
  features: [{ name: "prefers-reduced-motion", value: "reduce" }],
});
await setViewport(1470, 705);
await navigate();
await evaluate(`document.querySelector('#system').scrollIntoView({ block: 'center' }); true`);
await delay(700);
const reduced = await evaluate(`(() => ({
  videos: [...document.querySelectorAll('video')].map((video) => ({ hasSrc: video.hasAttribute('src'), paused: video.paused })),
  rails: [...document.querySelectorAll('[data-progress-rail]')].map((rail) => rail.dataset.complete),
}))()`);
assert.ok(reduced.videos.every((video) => !video.hasSrc && video.paused));
assert.ok(reduced.rails.every((complete) => complete === "true"));
assert.deepEqual(browserErrors, []);

await send("Emulation.setEmulatedMedia", { media: "screen", features: [] });
socket.close();

console.log(JSON.stringify({ desktop, method, coachingStart, coachingLater, english, reduced }, null, 2));
