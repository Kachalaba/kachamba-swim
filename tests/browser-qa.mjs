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
  await send("Emulation.setTouchEmulationEnabled", {
    enabled: width <= 760,
    maxTouchPoints: width <= 760 ? 5 : 1,
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
await send("Network.enable");

await setViewport(1470, 705);
await navigate();
const desktop = await evaluate(`(() => {
  const hero = document.querySelector('.cinema-hero').getBoundingClientRect();
  const filledTitle = document.querySelector('.hero-title-filled').getBoundingClientRect();
  const outlineTitle = document.querySelector('.hero-title-outline').getBoundingClientRect();
  const required = [...document.querySelectorAll('.cinema-hero-copy > *')].map((node) => {
    const rect = node.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom };
  });
  return {
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    heroFits: required.every((rect) => rect.top >= hero.top - 1 && rect.bottom <= hero.bottom + 1),
    heroFrame: { left: hero.left, top: hero.top, right: hero.right, bottom: hero.bottom },
    viewport: { width: window.innerWidth, height: window.innerHeight },
    headlineGap: outlineTitle.top - filledTitle.bottom,
    routeActive: document.querySelector('.route-pair').dataset.activeRoute,
    videos: [...document.querySelectorAll('video')].map((video) => ({
      hasSrc: video.hasAttribute('src'), paused: video.paused, preload: video.preload,
    })),
  };
})()`);
assert.equal(desktop.overflow, 0);
assert.equal(desktop.heroFits, true);
assert.deepEqual(desktop.heroFrame, { left: 0, top: 0, right: desktop.viewport.width, bottom: desktop.viewport.height });
assert.ok(desktop.headlineGap >= 0);
assert.equal(desktop.routeActive, "0");
assert.ok(desktop.videos.every((video) => !video.hasSrc && video.paused && video.preload === "none"));

const waterInitial = await evaluate(`(() => {
  const hero = document.querySelector('.cinema-hero');
  return {
    state: hero.dataset.waterInterface,
    x: hero.style.getPropertyValue('--water-x'),
    fill: Number.parseFloat(hero.style.getPropertyValue('--water-fill')),
  };
})()`);
assert.equal(waterInitial.state, "ready");

await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 410, y: 280 });
await delay(180);
const waterMoved = await evaluate(`(() => {
  const hero = document.querySelector('.cinema-hero');
  const cta = document.querySelector('.cinema-hero .button');
  const rect = cta.getBoundingClientRect();
  const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
  return {
    x: hero.style.getPropertyValue('--water-x'),
    pointer: hero.dataset.waterPointer,
    ctaIsTopmost: hit === cta || cta.contains(hit),
  };
})()`);
assert.notEqual(waterMoved.x, waterInitial.x);
assert.equal(waterMoved.pointer, "active");
assert.equal(waterMoved.ctaIsTopmost, true);

await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 4, y: 200 });
await delay(180);
const waterAtEdge = await evaluate(`(() => {
  const hero = document.querySelector('.cinema-hero');
  return {
    edgeOpacity: Number.parseFloat(hero.style.getPropertyValue('--water-edge-opacity')),
    pointer: hero.dataset.waterPointer,
  };
})()`);
assert.equal(waterAtEdge.pointer, "active");
assert.ok(Number.isFinite(waterAtEdge.edgeOpacity));
assert.ok(waterAtEdge.edgeOpacity <= 0.1, `Water edge opacity stayed at ${waterAtEdge.edgeOpacity}`);

await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 410, y: 280 });
await delay(180);
const waterAwayFromEdge = await evaluate(
  `Number.parseFloat(document.querySelector('.cinema-hero').style.getPropertyValue('--water-edge-opacity'))`,
);
assert.ok(Number.isFinite(waterAwayFromEdge));
assert.ok(waterAwayFromEdge >= 0.95);

await evaluate(`window.scrollBy({ top: 240, behavior: 'instant' }); true`);
await delay(180);
const waterScrolledFill = await evaluate(
  `Number.parseFloat(document.querySelector('.cinema-hero').style.getPropertyValue('--water-fill'))`,
);
assert.ok(waterScrolledFill > waterInitial.fill);
await evaluate(`window.scrollTo({ top: 0, behavior: 'instant' }); true`);
await screenshot("/tmp/kachamba-desktop.png");

await evaluate(`document.querySelector('[data-method-rail]').scrollIntoView({ block: 'center' }); true`);
await delay(500);
const methodBefore = await evaluate(`(() => {
  const rail = document.querySelector('[data-method-rail]');
  const panel = rail.querySelector('.method-detail-stack');
  return {
    active: rail.dataset.activeStep,
    height: panel.getBoundingClientRect().height,
    visible: rail.querySelector('[data-method-panel][data-active="true"] .method-detail-copy').textContent,
    routesRevealed: [...document.querySelectorAll('.route')].every((route) => route.dataset.revealed === 'true'),
    routeActive: document.querySelector('.route-pair').dataset.activeRoute,
  };
})()`);
assert.equal(methodBefore.active, "1");
assert.equal(methodBefore.routesRevealed, true);
assert.equal(methodBefore.routeActive, "1");

const techniqueRect = await evaluate(`(() => {
  const rect = document.querySelector('#method-tab-2').getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
})()`);
await send("Input.dispatchMouseEvent", { type: "mouseMoved", ...techniqueRect });
await delay(300);
const methodAfterHover = await evaluate(`(() => {
  const rail = document.querySelector('[data-method-rail]');
  return {
    active: rail.dataset.activeStep,
    height: rail.querySelector('.method-detail-stack').getBoundingClientRect().height,
    visible: rail.querySelector('[data-method-panel][data-active="true"] .method-detail-copy').textContent,
    transform: getComputedStyle(rail.querySelector('.method-waterline')).transform,
  };
})()`);
assert.equal(methodAfterHover.active, "2");
assert.equal(methodAfterHover.height, methodBefore.height);
assert.match(methodAfterHover.visible, /Збираємо положення тіла/);
assert.notEqual(methodAfterHover.transform, "none");

await evaluate(`document.querySelector('#method-tab-2').focus(); true`);
await send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight", code: "ArrowRight" });
await send("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowRight", code: "ArrowRight" });
await delay(120);
const keyboardMethod = await evaluate(`(() => ({
  active: document.querySelector('[data-method-rail]').dataset.activeStep,
  focused: document.activeElement.id,
  visible: document.querySelector('[data-method-panel][data-active="true"] .method-detail-copy').textContent,
}))()`);
assert.deepEqual(keyboardMethod, {
  active: "3",
  focused: "method-tab-3",
  visible: "Знаходимо швидкість, яку можна повторити — без боротьби з водою.",
});
assert.equal(await evaluate(`document.querySelector('#method').dataset.surfacePass`), "true");
await screenshot("/tmp/kachamba-method.png");

const method = { before: methodBefore, afterHover: methodAfterHover, keyboard: keyboardMethod };

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

await send("Network.clearBrowserCache");
await send("Network.setBlockedURLs", { urls: ["*coaching-loop.mp4*"] });
await navigate();
await evaluate(`document.querySelector('#system').scrollIntoView({ block: 'center' }); true`);
await delay(1_200);
assert.equal(await evaluate(`document.querySelector('#system .cinematic-media img')?.getAttribute('src') === '/media/coaching-loop-poster.webp'`), true);
await send("Network.setBlockedURLs", { urls: [] });
await navigate();

await evaluate(`([...document.querySelectorAll('.language-switch button')].find((button) => button.textContent === 'EN')).click(); true`);
await delay(200);
const english = await evaluate(`({
  lang: document.documentElement.lang,
  filled: document.querySelector('.hero-title-filled').textContent,
  outline: document.querySelector('.hero-title-outline').textContent,
  instagram: [...document.querySelectorAll('a[href="https://www.instagram.com/kachamba_swim/"]')].length,
})`);
assert.deepEqual(english, { lang: "en", filled: "Swimming that", outline: "adapts to your life.", instagram: 4 });
assert.equal(
  await evaluate(`document.querySelector('[data-method-panel][data-active="true"] .method-detail-copy').textContent`),
  "We remove breath-holding and panic until exhaling into the water becomes the rhythm of the stroke.",
);

for (const [width, height, path] of [
  [1470, 768, null],
  [1366, 768, null],
  [390, 844, "/tmp/kachamba-mobile.png"],
  [390, 667, null],
]) {
  await setViewport(width, height);
  await navigate();
  const mobile = await evaluate(`(() => {
    const hero = document.querySelector('.cinema-hero').getBoundingClientRect();
    const copy = document.querySelector('.cinema-hero-copy').getBoundingClientRect();
    const filledTitle = document.querySelector('.hero-title-filled').getBoundingClientRect();
    const outlineTitle = document.querySelector('.hero-title-outline').getBoundingClientRect();
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      heroFits: copy.top >= hero.top - 1 && copy.bottom <= hero.bottom + 1,
      outlineRight: document.querySelector('.hero-title-outline').getBoundingClientRect().right,
      headlineGap: outlineTitle.top - filledTitle.bottom,
      viewport: document.documentElement.clientWidth,
    };
  })()`);
  assert.equal(mobile.overflow, 0);
  assert.equal(mobile.heroFits, true);
  assert.ok(mobile.outlineRight <= mobile.viewport + 1);
  assert.ok(mobile.headlineGap >= 0);
  if (path) {
    await screenshot("/tmp/kachamba-mobile-hero.png");
    const cornerTouch = { x: 30, y: 140 };
    await send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [cornerTouch],
    });
    await delay(80);
    const tapWaterState = await evaluate(`document.querySelector('.cinema-hero').dataset.waterPointer`);
    await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    assert.equal(tapWaterState, "idle");

    await send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [cornerTouch],
    });
    await send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 56, y: 140 }],
    });
    await delay(80);
    const dragWaterState = await evaluate(`document.querySelector('.cinema-hero').dataset.waterPointer`);
    await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    assert.equal(dragWaterState, "active");

    await evaluate(`document.querySelector('#method-tab-4').scrollIntoView({ block: 'center', behavior: 'instant' }); true`);
    await delay(180);
    const mobilePanelHeight = await evaluate(`document.querySelector('.method-detail-stack').getBoundingClientRect().height`);
    const recoveryRect = await evaluate(`(() => {
      const rect = document.querySelector('#method-tab-4').getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`);
    const recoveryHit = await evaluate(`(() => {
      const rect = document.querySelector('#method-tab-4').getBoundingClientRect();
      return document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)?.closest('button')?.id;
    })()`);
    assert.equal(recoveryHit, "method-tab-4");
    await send("Emulation.setTouchEmulationEnabled", { enabled: false, maxTouchPoints: 1 });
    await send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      button: "left",
      clickCount: 1,
      ...recoveryRect,
    });
    await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      button: "left",
      clickCount: 1,
      ...recoveryRect,
    });
    await delay(180);
    const mobileMethod = await evaluate(`(() => ({
      active: document.querySelector('[data-method-rail]').dataset.activeStep,
      height: document.querySelector('.method-detail-stack').getBoundingClientRect().height,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }))()`);
    assert.equal(mobileMethod.active, "4");
    assert.equal(mobileMethod.height, mobilePanelHeight);
    assert.equal(mobileMethod.overflow, 0);
    await screenshot(path);
  }
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
  waterState: document.querySelector('.cinema-hero').dataset.waterInterface,
  surfaceDisplay: getComputedStyle(document.querySelector('#method'), '::after').display,
  videos: [...document.querySelectorAll('video')].map((video) => ({ hasSrc: video.hasAttribute('src'), paused: video.paused })),
  rails: [...document.querySelectorAll('[data-progress-rail]')].map((rail) => rail.dataset.complete),
}))()`);
assert.equal(reduced.waterState, "reduced");
assert.equal(reduced.surfaceDisplay, "none");
assert.ok(reduced.videos.every((video) => !video.hasSrc && video.paused));
assert.ok(reduced.rails.every((complete) => complete === "true"));
await evaluate(`document.querySelector('#method-tab-2').click(); true`);
assert.equal(await evaluate(`document.querySelector('[data-method-rail]').dataset.activeStep`), "2");
assert.ok(
  Number.parseFloat(
    await evaluate(`getComputedStyle(document.querySelector('.method-waterline')).transitionDuration`),
  ) <= 0.01,
);
assert.deepEqual(browserErrors, []);

await send("Emulation.setEmulatedMedia", { media: "screen", features: [] });
socket.close();

console.log(JSON.stringify({ desktop, method, coachingStart, coachingLater, english, reduced }, null, 2));
