"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { type Language } from "../site-copy";
import { analysisCopy } from "./analysis-copy";
import { buildAnalysisBrief, buildWhatsAppUrl, type AnalysisBriefInput } from "./intake.mjs";

type Props = {
  telegramHref: string;
  whatsappHref: string;
};

export function AnalysisIntake({ telegramHref, whatsappHref }: Props) {
  const [language, setLanguage] = useState<Language>("uk");
  const [brief, setBrief] = useState("");
  const [whatsappMessageHref, setWhatsappMessageHref] = useState(whatsappHref);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const t = analysisCopy[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function prepareBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input: AnalysisBriefInput = {
      language,
      name: String(form.get("name") ?? ""),
      goal: String(form.get("goal") ?? ""),
      level: String(form.get("level") ?? ""),
      stroke: String(form.get("stroke") ?? ""),
      deadline: String(form.get("deadline") ?? ""),
      videoReady: form.get("videoReady") === "on",
    };

    const nextBrief = buildAnalysisBrief(input);
    setBrief(nextBrief);
    setWhatsappMessageHref(buildWhatsAppUrl(input, whatsappHref));
    setCopied(false);
  }

  async function copyBrief() {
    if (!brief) return;
    await navigator.clipboard.writeText(brief);
    setCopied(true);
  }

  function focusForm() {
    formRef.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
  }

  return (
    <main className="analysis-shell" lang={language}>
      <header className="analysis-topbar">
        <Link className="wordmark" href="/" aria-label="Kachalaba Swim">
          KACHALABA<span>SWIM</span>
        </Link>
        <Link className="analysis-back" href="/">← {t.back}</Link>
        <div className="language-switch" role="group" aria-label={t.languageLabel}>
          {(["uk", "en"] as Language[]).map((item) => (
            <button key={item} type="button" aria-pressed={language === item} onClick={() => setLanguage(item)}>
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <section className="analysis-hero" aria-labelledby="analysis-title">
        <div className="analysis-hero-copy">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 id="analysis-title">{t.title}</h1>
          <p className="analysis-lede">{t.intro}</p>
          <button className="button button-light" type="button" onClick={focusForm}>
            {t.cta}<span aria-hidden="true">↓</span>
          </button>
        </div>
        <aside className="analysis-price-card" aria-label={t.priceNote}>
          <p className="analysis-price">{t.price}</p>
          <p>{t.priceNote}</p>
          <ul>{t.proof.map((item) => <li key={item}>{item}</li>)}</ul>
        </aside>
      </section>

      <section className="analysis-section analysis-artifact" aria-labelledby="artifact-title">
        <div className="analysis-section-heading">
          <p className="eyebrow">{t.artifactLabel}</p>
          <h2 id="artifact-title">{t.artifactTitle}</h2>
        </div>
        <ol className="analysis-deliverables">
          {t.deliverables.map(([number, title, text]) => (
            <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></li>
          ))}
        </ol>
        <div className="evidence-sample" aria-label={t.sampleLabel}>
          <div className="evidence-frame" aria-hidden="true">
            <span className="evidence-axis" />
            <span className="evidence-shoulder" />
            <span className="evidence-arm" />
            <span className="evidence-marker">01</span>
          </div>
          <div className="evidence-copy">
            <p className="eyebrow">{t.sampleLabel}</p>
            <h3>{t.sampleTitle}</h3>
            {t.sampleItems.map((item, index) => <p key={item}><span>0{index + 1}</span>{item}</p>)}
          </div>
        </div>
      </section>

      <section className="analysis-section analysis-guide" aria-labelledby="guide-title">
        <div className="analysis-section-heading">
          <p className="eyebrow">{t.guideLabel}</p>
          <h2 id="guide-title">{t.guideTitle}</h2>
        </div>
        <ol className="analysis-guide-list">
          {t.guide.map((item, index) => <li key={item}><span>0{index + 1}</span><p>{item}</p></li>)}
        </ol>
      </section>

      <section className="analysis-section analysis-process" aria-labelledby="process-title">
        <div className="analysis-section-heading">
          <p className="eyebrow">{t.processLabel}</p>
          <h2 id="process-title">{language === "uk" ? "Три кроки від відео до наступної дії." : "Three steps from footage to your next action."}</h2>
        </div>
        <ol className="analysis-process-list">
          {t.process.map(([number, title, text]) => (
            <li key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></li>
          ))}
        </ol>
      </section>

      <section className="analysis-section analysis-form-section" aria-labelledby="form-title">
        <div className="analysis-form-intro">
          <p className="eyebrow">{t.formLabel}</p>
          <h2 id="form-title">{t.formTitle}</h2>
          <p>{t.handoff}</p>
        </div>
        <div className="analysis-form-column">
          <form ref={formRef} className="analysis-form" onSubmit={prepareBrief}>
            <label>
              <span>{t.fields.name}</span>
              <input name="name" required autoComplete="name" placeholder={t.fields.namePlaceholder} />
            </label>
            <label>
              <span>{t.fields.goal}</span>
              <textarea name="goal" required rows={3} placeholder={t.fields.goalPlaceholder} />
            </label>
            <div className="analysis-form-row">
              <label>
                <span>{t.fields.level}</span>
                <select name="level" required defaultValue="">
                  <option value="" disabled>{t.fields.selectPlaceholder}</option>
                  {t.levels.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>
                <span>{t.fields.stroke}</span>
                <select name="stroke" required defaultValue="">
                  <option value="" disabled>{t.fields.selectPlaceholder}</option>
                  {t.strokes.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
            <label>
              <span>{t.fields.deadline}</span>
              <input name="deadline" placeholder={t.fields.deadlinePlaceholder} />
            </label>
            <label className="analysis-checkbox">
              <input name="videoReady" type="checkbox" />
              <span>{t.fields.videoReady}</span>
            </label>
            <button className="analysis-submit" type="submit">{t.prepare}<span aria-hidden="true">→</span></button>
          </form>

          {brief ? (
            <div className="analysis-brief" aria-live="polite">
              <p className="eyebrow">{t.prepared}</p>
              <pre>{brief}</pre>
              <div className="analysis-handoff-actions">
                <button type="button" onClick={copyBrief}>{copied ? t.copied : t.copy}</button>
                <a href={telegramHref} target="_blank" rel="noreferrer">{t.telegram} ↗</a>
                <a href={whatsappMessageHref} target="_blank" rel="noreferrer">{t.whatsapp} ↗</a>
              </div>
            </div>
          ) : null}
          <p className="analysis-consent">{t.consent}</p>
          <p className="analysis-disclaimer">{t.disclaimer}</p>
        </div>
      </section>

      <section className="analysis-upgrade" aria-labelledby="upgrade-title">
        <p className="eyebrow">{t.upgradeLabel}</p>
        <h2 id="upgrade-title">{t.upgradeTitle}</h2>
        <p>{t.upgradeText}</p>
        <Link className="button button-light" href="/#price">{t.upgradeCta}<span aria-hidden="true">→</span></Link>
      </section>

      <footer>
        <p>© 2026 Mykyta Kachalaba · Video Technique Audit</p>
        <Link href="/">kachalaba.coach</Link>
      </footer>
    </main>
  );
}
