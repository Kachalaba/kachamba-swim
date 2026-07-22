function required(value, field) {
  const normalized = String(value ?? "").trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}

export function buildAnalysisBrief(input) {
  const language = input.language === "en" ? "en" : "uk";
  const name = required(input.name, "name");
  const goal = required(input.goal, "goal");
  const level = required(input.level, "level");
  const stroke = required(input.stroke, "stroke");
  const deadline = String(input.deadline ?? "").trim()
    || (language === "en" ? "not specified" : "не вказано");

  if (language === "en") {
    return [
      "Video Technique Audit",
      `Name: ${name}`,
      `Goal: ${goal}`,
      `Level: ${level}`,
      `Stroke: ${stroke}`,
      `Deadline: ${deadline}`,
      `Video ready: ${input.videoReady ? "yes" : "no"}`,
    ].join("\n");
  }

  return [
    "Розбір техніки за відео",
    `Ім'я: ${name}`,
    `Ціль: ${goal}`,
    `Рівень: ${level}`,
    `Стиль: ${stroke}`,
    `Термін: ${deadline}`,
    `Відео готове: ${input.videoReady ? "так" : "ні"}`,
  ].join("\n");
}

export function buildWhatsAppUrl(input, phone) {
  const normalizedPhone = String(phone ?? "").replace(/\D/g, "");
  if (!normalizedPhone) throw new Error("phone is required");
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(buildAnalysisBrief(input))}`;
}
