"use client";

import { useEffect, useState } from "react";
import { CinematicMedia } from "./components/CinematicMedia";
import { ProgressRail } from "./components/ProgressRail";
import { Reveal } from "./components/Reveal";
import { copy, instagramUrl, type Language } from "./site-copy";

export default function Home() {
  const [language, setLanguage] = useState<Language>("uk");
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const mediaAlt = {
    swimmer:
      language === "uk"
        ? "Плавець виконує тренувальний відрізок"
        : "Swimmer completing a training interval",
    coach:
      language === "uk"
        ? "Микита веде тренування біля басейну"
        : "Mykyta coaching on the pool deck",
    hero:
      language === "uk"
        ? "Плавець тренується у басейні"
        : "Swimmer training in a pool",
    outdoors:
      language === "uk"
        ? "Микита Качалаба на спортивному старті"
        : "Mykyta Kachalaba at a sports event",
    team:
      language === "uk"
        ? "Команда триатлонного клубу HTF"
        : "HTF triathlon club team",
    openWater:
      language === "uk"
        ? "Плавання у відкритій воді"
        : "Open-water swimming",
  };

  return (
    <main className="site-shell" lang={language}>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Kachalaba Swim">
          KACHALABA<span>SWIM</span>
        </a>
        <nav aria-label={t.primaryNavigation}>
          <a href="#audiences">{t.nav[0]}</a>
          <a href="#method">{t.nav[1]}</a>
          <a href="#system">{t.nav[2]}</a>
          <a href="#practice">{t.nav[3]}</a>
          <a href="#price">{t.nav[4]}</a>
        </nav>
        <div className="language-switch" role="group" aria-label={t.languageLabel}>
          {(["uk", "en"] as Language[]).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={language === item}
              onClick={() => setLanguage(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <section className="cinema-hero" id="top" aria-labelledby="hero-title">
        <div className="cinema-hero-media" aria-hidden="true">
          <img src="/media/hero-pool.webp" alt="" />
        </div>
        <div className="cinema-hero-shade" aria-hidden="true" />
        <Reveal className="cinema-hero-copy">
          <p className="eyebrow">{t.label}</p>
          <h1 id="hero-title">{t.headline}</h1>
          <p className="hero-offer">{t.offer}</p>
          <p className="hero-intro">{t.heroText}</p>
          <div className="hero-facts">
            <p>{t.price}</p>
            <p>{t.capacity}</p>
          </div>
          <a className="button button-light" href={instagramUrl} target="_blank" rel="noreferrer">
            {t.cta}<span aria-hidden="true">↗</span>
          </a>
        </Reveal>
        <div className="documentary-rail" aria-label={t.documentaryLabel}>
          <p>{t.documentaryLabel}</p>
          <ul>
            {t.proof.map((fact) => <li key={fact}>{fact}</li>)}
          </ul>
        </div>
      </section>

      <section className="routes scene" id="audiences" aria-labelledby="audiences-title">
        <p className="scene-number" aria-hidden="true">01</p>
        <Reveal className="scene-heading">
          <p className="eyebrow">{t.audienceLabel}</p>
          <h2 id="audiences-title">{t.audienceTitle}</h2>
        </Reveal>
        <div className="route-pair">
          {t.audiences.map(([title, text], index) => (
            <Reveal className="route" delay={index * 90} key={title}>
              <span aria-hidden="true">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="method scene" id="method" aria-labelledby="method-title">
        <p className="scene-number" aria-hidden="true">02</p>
        <Reveal className="method-copy">
          <p className="eyebrow">{t.methodLabel}</p>
          <h2 id="method-title">{t.methodTitle}</h2>
          <p>{t.methodText}</p>
        </Reveal>
        <Reveal className="method-proof" delay={100}>
          {t.proof.map((fact) => <p key={fact}>{fact}</p>)}
        </Reveal>
        <ProgressRail label={t.methodLine} items={t.methodSteps} />
        <p className="sequence-line">{t.methodLine}</p>
      </section>

      <section className="coaching-loop scene" id="system" aria-labelledby="loop-title">
        <p className="scene-number" aria-hidden="true">03</p>
        <div className="coaching-loop-lead">
          <Reveal className="scene-heading">
            <p className="eyebrow">{t.loopLabel}</p>
            <h2 id="loop-title">{t.loopTitle}</h2>
            <p>{t.loopText}</p>
          </Reveal>
          <CinematicMedia
            videoSrc="/media/coaching-loop.mp4"
            posterSrc="/media/coaching-loop-poster.webp"
            alt={mediaAlt.swimmer}
            className="coaching-loop-film"
          />
        </div>

        <ProgressRail label={t.loopLine} items={t.loopSteps} />
        <p className="sequence-line">{t.loopLine}</p>

        <div className="guided-narrative" aria-label={t.guidedLabel}>
          <Reveal className="guided-copy">
            <p className="eyebrow">{t.guidedLabel}</p>
            <h3>{t.guidedTitle}</h3>
            <p>{t.guidedText}</p>
          </Reveal>
          <div className="guided-contrast">
            <article>
              <p className="eyebrow">{t.guidedGuessing[0]}</p>
              <p>{t.guidedGuessing[1]}</p>
            </article>
            <article>
              <p className="eyebrow">{t.guidedSupport[0]}</p>
              <p>{t.guidedSupport[1]}</p>
            </article>
          </div>
          <p className="guided-loop-line">{t.guidedLoop}</p>
        </div>

        <div className="coaching-offer" aria-labelledby="coaching-offer-title">
          <Reveal className="scene-heading">
            <p className="eyebrow">{t.systemLabel}</p>
            <h3 id="coaching-offer-title">{t.systemTitle}</h3>
          </Reveal>
          <ol className="coaching-offer-list">
            {t.system.map(([title, text], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <div><h4>{title}</h4><p>{text}</p></div>
              </li>
            ))}
          </ol>
        </div>

        <div className="first-week" aria-labelledby="start-title">
          <Reveal className="scene-heading">
            <p className="eyebrow">{t.startLabel}</p>
            <h3 id="start-title">{t.startTitle}</h3>
          </Reveal>
          <ol className="first-week-list">
            {t.firstWeek.map(([number, title, text]) => (
              <li key={number}>
                <span>{number}</span>
                <div><h4>{title}</h4><p>{text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="practice scene" id="practice" aria-labelledby="practice-title">
        <p className="scene-number" aria-hidden="true">04</p>
        <Reveal className="scene-heading">
          <p className="eyebrow">{t.practiceLabel}</p>
          <h2 id="practice-title">{t.practiceTitle}</h2>
          <p>{t.practiceText}</p>
        </Reveal>
        <div className="practice-film-pair">
          <CinematicMedia
            videoSrc="/media/coach-deck-loop.mp4"
            posterSrc="/media/coach-deck-poster.webp"
            alt={mediaAlt.coach}
            caption={t.practiceCaptions[1]}
            className="coach-deck-film"
          />
          <Reveal className="coach-note" delay={120}>
            <p className="eyebrow">{t.coachLabel}</p>
            <h3>{t.coachTitle}</h3>
            <p>{t.coachText}</p>
            <a className="text-link" href={instagramUrl} target="_blank" rel="noreferrer">
              {t.coachLink}<span aria-hidden="true">↗</span>
            </a>
          </Reveal>
        </div>
        <div className="documentary-gallery">
          {[
            ["/media/hero-pool.webp", mediaAlt.hero, t.practiceCaptions[0]],
            ["/media/coach-outdoor.webp", mediaAlt.outdoors, t.practiceCaptions[1]],
            ["/media/htf-team.webp", mediaAlt.team, t.practiceCaptions[2]],
            ["/media/open-water.webp", mediaAlt.openWater, t.practiceCaptions[3]],
          ].map(([src, alt, caption]) => (
            <figure key={src}>
              <img src={src} alt={alt} loading="lazy" />
              <figcaption>{caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="offer scene" id="price" aria-labelledby="price-title">
        <p className="scene-number" aria-hidden="true">05</p>
        <Reveal className="offer-heading">
          <p className="eyebrow">{t.pricingLabel}</p>
          <h2 id="price-title">{t.pricingTitle}</h2>
          <p className="offer-price">{t.price}</p>
        </Reveal>
        <div className="offer-detail">
          <div>
            {t.priceFacts.map((fact) => <p key={fact}>{fact}</p>)}
          </div>
          <p className="offer-note">{t.pricingText}</p>
        </div>
      </section>

      <section className="invitation" id="apply" aria-labelledby="invitation-title">
        <Reveal>
          <p className="eyebrow">KACHALABA SWIM</p>
          <h2 id="invitation-title">{t.finalTitle}</h2>
          <p>{t.finalText}</p>
          <a className="button button-light" href={instagramUrl} target="_blank" rel="noreferrer">
            {t.cta}<span aria-hidden="true">↗</span>
          </a>
        </Reveal>
      </section>

      <footer>
        <span>{t.footer}</span>
        <a href={instagramUrl} target="_blank" rel="noreferrer">@kachamba_swim</a>
      </footer>
    </main>
  );
}
