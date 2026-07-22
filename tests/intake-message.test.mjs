import assert from "node:assert/strict";
import test from "node:test";
import { buildAnalysisBrief, buildWhatsAppUrl } from "../app/analysis/intake.mjs";

const input = {
  language: "uk",
  name: "  Олена  ",
  goal: "Підготуватися до 1.9 км",
  level: "Триатлет-аматор",
  stroke: "Кроль",
  deadline: "Старт через 8 тижнів",
  videoReady: true,
};

test("builds a structured Ukrainian audit brief", () => {
  const brief = buildAnalysisBrief(input);
  assert.match(brief, /^Розбір техніки за відео/);
  assert.match(brief, /Ім'я: Олена/);
  assert.match(brief, /Підготуватися до 1\.9 км/);
  assert.match(brief, /Відео готове: так/);
});

test("builds an English audit brief", () => {
  const brief = buildAnalysisBrief({ ...input, language: "en" });
  assert.match(brief, /^Video Technique Audit/);
  assert.match(brief, /Name: Олена/);
  assert.match(brief, /Video ready: yes/);
});

test("requires a name and goal", () => {
  assert.throws(() => buildAnalysisBrief({ ...input, name: "" }), /name is required/);
  assert.throws(() => buildAnalysisBrief({ ...input, goal: "" }), /goal is required/);
});

test("builds a prefilled WhatsApp handoff without exposing a bot token", () => {
  const url = buildWhatsAppUrl(input, "380970353470");
  assert.match(url, /^https:\/\/wa\.me\/380970353470\?text=/);
  assert.match(decodeURIComponent(url), /Підготуватися до 1\.9 км/);
  assert.doesNotMatch(url, /token/i);
});
