"use client";

import { useState } from "react";

type Language = "uk" | "en";

const instagramUrl = "https://www.instagram.com/kachamba_swim/";

const copy = {
  uk: {
    nav: ["Підхід", "Про мене", "Instagram"],
    label: "Плавання для дорослих · Київ та онлайн",
    headline: "Почніть плавати красиво.",
    intro:
      "Не через силу. Не з сорому. А в той момент, коли вода перестає бути чужою — і стає вашим місцем.",
    cta: "Написати в Instagram",
    note: "Перше повідомлення — вже достатній початок.",
    recognitionTitle: "Можливо, ви впізнаєте себе.",
    recognition: [
      "Ви тримаєтесь за бортик довше, ніж хочете зізнатися.",
      "На другому басейні дихання збивається — і ви думаєте, що це «не ваше».",
      "Глибина не лякає логічно. Але тіло все одно напружується.",
      "Ви давно хотіли почати. Просто не хотіли виглядати новачком.",
    ],
    methodEyebrow: "Без зайвого шуму",
    methodTitle: "Три тихі кроки до впевненості.",
    steps: [
      ["01", "Звикнути до води", "Спершу — безпека, опора й спокійний видих. Тіло має зрозуміти: тут можна бути."],
      ["02", "Знайти свій ритм", "Дихання, положення тіла, перші зв’язки рухів. Не «правильно за будь-яку ціну», а зрозуміло для вас."],
      ["03", "Плисти далі", "Довжина за довжиною — без боротьби з водою. А коли захочеться, наступною точкою можуть стати й старти."],
    ],
    coachEyebrow: "Ваш тренер",
    coachTitle: "Микита Качалаба",
    coachText:
      "Тренер з плавання та тренер HTF — київського триатлонного клубу. Працюю з дорослими, які приходять не за красивою історією, а за реальним відчуттям контролю у воді.",
    coachLink: "Дивитися живі тренування",
    galleryEyebrow: "Справжній процес",
    galleryTitle: "Вода не потребує ролі. Вона любить присутність.",
    galleryText:
      "Тренування, старти й люди, які одного разу просто написали в директ. Усе інше — у моєму Instagram.",
    finalTitle: "Ваш перший спокійний видих — ближче, ніж здається.",
    finalText: "Напишіть мені. Розберемося, з чого почати саме вам.",
    footer: "© 2026 Микита Качалаба · Плавання для дорослих",
  },
  en: {
    nav: ["Approach", "About", "Instagram"],
    label: "Adult swimming · Kyiv & online",
    headline: "Start swimming beautifully.",
    intro:
      "Not by forcing it. Not by feeling behind. But at the moment water stops feeling unfamiliar — and starts feeling like your place.",
    cta: "Message on Instagram",
    note: "One message is already a beginning.",
    recognitionTitle: "You may recognise this.",
    recognition: [
      "You hold on to the wall longer than you want to admit.",
      "By the second length your breathing slips, and you decide swimming is not for you.",
      "Depth does not scare you logically. Your body still tightens anyway.",
      "You have wanted to begin for a long time. You just did not want to look new.",
    ],
    methodEyebrow: "No unnecessary noise",
    methodTitle: "Three calm steps towards confidence.",
    steps: [
      ["01", "Settle into water", "First comes safety, support and an unhurried exhale. Your body needs to learn that it can be here."],
      ["02", "Find your rhythm", "Breath, body position, first connected movements. Not correct at any cost — clear and natural for you."],
      ["03", "Go further", "Length by length, without fighting the water. And when you want it, a first start can become the next point."],
    ],
    coachEyebrow: "Your coach",
    coachTitle: "Mykyta Kachalaba",
    coachText:
      "Swimming coach and coach at HTF, a Kyiv triathlon club. I work with adults who are not looking for a polished story, but for real control in the water.",
    coachLink: "See real training",
    galleryEyebrow: "The real process",
    galleryTitle: "Water does not need a performance. It likes presence.",
    galleryText:
      "Training, starts and people who once simply sent a direct message. The rest is on Instagram.",
    finalTitle: "Your first calm exhale is closer than it seems.",
    finalText: "Send me a message. We will find the right beginning for you.",
    footer: "© 2026 Mykyta Kachalaba · Adult swimming",
  },
} as const;

export default function Home() {
  const [language, setLanguage] = useState<Language>("uk");
  const t = copy[language];

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Kachalaba Swim">
          KACHALABA<span>SWIM</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#approach">{t.nav[0]}</a>
          <a href="#coach">{t.nav[1]}</a>
          <a href={instagramUrl} target="_blank" rel="noreferrer">{t.nav[2]}</a>
        </nav>
        <div className="language-switch" aria-label="Language">
          {(["uk", "en"] as Language[]).map((item) => (
            <button key={item} type="button" aria-pressed={language === item} onClick={() => setLanguage(item)}>
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-media" aria-hidden="true"><img src="/media/hero-pool.webp" alt="" /></div>
        <div className="hero-aura" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">{t.label}</p>
          <h1>{t.headline}</h1>
          <p className="hero-intro">{t.intro}</p>
          <a className="button button-light" href={instagramUrl} target="_blank" rel="noreferrer">{t.cta}<span>↗</span></a>
          <p className="hero-note">{t.note}</p>
        </div>
        <p className="hero-index">01 / 04</p>
      </section>

      <section className="recognition section" aria-labelledby="recognition-title">
        <p className="section-count">01</p>
        <h2 id="recognition-title">{t.recognitionTitle}</h2>
        <div className="recognition-list">
          {t.recognition.map((item, index) => <p key={item}><span>0{index + 1}</span>{item}</p>)}
        </div>
      </section>

      <section className="method section" id="approach" aria-labelledby="method-title">
        <p className="section-count">02</p>
        <div className="section-heading"><p className="eyebrow">{t.methodEyebrow}</p><h2 id="method-title">{t.methodTitle}</h2></div>
        <div className="steps">
          {t.steps.map(([number, title, text]) => (
            <article className="step" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className="coach section" id="coach" aria-labelledby="coach-title">
        <p className="section-count">03</p>
        <div className="coach-image"><img src="/media/coach-outdoor.webp" alt="Микита Качалаба на спортивному старті" /></div>
        <div className="coach-copy"><p className="eyebrow">{t.coachEyebrow}</p><h2 id="coach-title">{t.coachTitle}</h2><p>{t.coachText}</p><a className="text-link" href={instagramUrl} target="_blank" rel="noreferrer">{t.coachLink}<span>↗</span></a></div>
      </section>

      <section className="gallery section" aria-labelledby="gallery-title">
        <p className="section-count">04</p>
        <div className="gallery-copy"><p className="eyebrow">{t.galleryEyebrow}</p><h2 id="gallery-title">{t.galleryTitle}</h2><p>{t.galleryText}</p></div>
        <div className="gallery-grid">
          <img className="gallery-wide" src="/media/htf-team.webp" alt="Команда після старту з медалями" />
          <img src="/media/coach-gym.webp" alt="Микита Качалаба з учнем у спортивному просторі" />
        </div>
      </section>

      <section className="final-cta"><div><p className="eyebrow">KACHALABA SWIM</p><h2>{t.finalTitle}</h2><p>{t.finalText}</p><a className="button button-light" href={instagramUrl} target="_blank" rel="noreferrer">{t.cta}<span>↗</span></a></div></section>
      <footer><span>{t.footer}</span><a href={instagramUrl} target="_blank" rel="noreferrer">@kachamba_swim</a></footer>
    </main>
  );
}
