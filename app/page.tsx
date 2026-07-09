"use client";

import { useEffect, useState } from "react";

type Language = "uk" | "en";

const instagramUrl = "https://www.instagram.com/kachamba_swim/";

const copy = {
  uk: {
    nav: ["Кому підійде", "Система", "Вартість", "Про тренера"],
    languageLabel: "Мова",
    label: "Онлайн-ведення з плавання · Україна та світ",
    headline: "Плавання, яке підлаштоване під ваше життя.",
    offer: "Персональне онлайн-ведення з плавання",
    price: "Від $100/місяць",
    capacity: "До 8–10 спортсменів одночасно",
    cta: "Запитати про місце",
    heroText:
      "Для дорослих, які хочуть рухатися у воді впевненіше — від перших довжин до сильнішого плавального етапу в триатлоні.",
    audienceTitle: "Один процес. Дві різні стартові точки.",
    audiences: [
      ["Для дорослих, які починають", "Щоб вода перестала бути напругою, а техніка — чужою мовою."],
      ["Для триатлетів-любителів", "Щоб плисти економніше, впевненіше й берегти ресурс для решти дистанції."],
    ],
    guidedLabel: "Ведення замість здогадок",
    guidedTitle: "Не вгадуєте, що змінити після тренування — рухаєтесь за зрозумілим циклом.",
    guidedText:
      "Випадкові тренування залишають вас наодинці з питанням, що справді працює. У веденні кожне наступне рішення спирається на те, що ви зробили й побачили у воді.",
    guidedGuessing: ["Навмання", "Ви самі вирішуєте, що залишити, а що змінити після кожної сесії."],
    guidedSupport: ["З веденням", "План і наступний крок уточнюються навколо вашої реальної роботи, а не припущень."],
    guidedLoop: "План → дія → відеозворотний зв’язок → корекція → безперервність",
    systemLabel: "Як працює ведення",
    systemTitle: "План, який живе разом із вашим графіком.",
    systemText:
      "Ми збираємо робочий тиждень навколо вашої цілі, доступу до басейну та часу на відновлення — і коригуємо його за фактом, а не за шаблоном.",
    system: [
      ["Персональний план з плавання", "Два або три тренування щотижня з чітким фокусом на техніку, витривалість і темп."],
      ["Квартальний план для залу", "Силова робота, що підтримує плавання та не забирає ресурс у води."],
      ["Відеоаналіз", "Розбираємо вашу техніку за відео, щоб бачити конкретні зміни від тижня до тижня."],
      ["Чат", "Швидкий зв’язок щодо тренувань, самопочуття й адаптацій у реальному житті."],
      ["Дзвінки", "Регулярно звіряємо курс, цілі та наступний крок у вашому прогресі."],
    ],
    pricingLabel: "Вартість",
    pricingTitle: "Зрозумілі формати без прихованих умов.",
    priceFacts: [
      "2 тренування з плавання щотижня — $80/місяць",
      "План для залу на квартал — $60 / $20 на місяць",
      "3 тренування з плавання щотижня + зал — від $140/місяць",
    ],
    pricingText: "Фінальний формат залежить від вашого досвіду, цілі та кількості тренувань, які реально помістяться у тиждень.",
    startLabel: "Перший тиждень",
    startTitle: "Починаємо з реального контексту, а не з випадкової програми.",
    firstWeek: [
      ["01", "Коротко знайомимось", "Ви описуєте ціль, досвід у воді, доступ до басейну й звичний ритм тижня."],
      ["02", "Визначаємо старт", "Дивимось на техніку у відео або домовляємось, як її зняти без зайвого стресу."],
      ["03", "Складаємо перший тиждень", "Ви отримуєте зрозумілий план і канал зв’язку для запитань по ходу."],
      ["04", "Надсилаєте відео й отримуєте зворотний зв’язок", "Після перших тренувань дивимось, що вже спрацьовує і що варто підкоригувати."],
      ["05", "Уточнюємо наступний блок", "Наступні заняття спираються на реальний досвід першого тижня, а не на припущення."],
    ],
    coachLabel: "Тренер",
    coachTitle: "Микита Качалаба",
    coachText:
      "Тренер з плавання та тренер HTF — київського триатлонного клубу. Допомагаю дорослим збудувати техніку й тренувальний ритм, які витримують звичайне життя.",
    coachLink: "Дивитися тренування в Instagram",
    finalTitle: "Готові зрозуміти, чи є для вас місце?",
    finalText: "Напишіть в Instagram: ваша ціль, місто або доступ до басейну та скільки тренувань на тиждень вам реально доступно. Я відповім, з якого формату краще почати.",
    footer: "© 2026 Микита Качалаба · Персональне онлайн-ведення з плавання",
  },
  en: {
    nav: ["Who it is for", "System", "Pricing", "About the coach"],
    languageLabel: "Language",
    label: "Online swim coaching · Ukraine and worldwide",
    headline: "Swimming that adapts to your life.",
    offer: "Personal online swim coaching",
    price: "From $100/month",
    capacity: "Up to 8–10 athletes at a time",
    cta: "Ask about a place",
    heroText:
      "For adults who want to move through water with more confidence — from their first lengths to a stronger swim leg in triathlon.",
    audienceTitle: "One process. Two different starting points.",
    audiences: [
      ["For adults getting started", "So water stops feeling tense and technique stops sounding like a foreign language."],
      ["For amateur triathletes", "So you can swim more efficiently and confidently while saving energy for the rest of the race."],
    ],
    guidedLabel: "Guidance instead of guessing",
    guidedTitle: "You do not have to guess what to change after a session — you move through a clear loop.",
    guidedText:
      "Random workouts leave you alone with the question of what is actually working. In coaching, each next decision comes from what you did and saw in the water.",
    guidedGuessing: ["Guessing alone", "You decide on your own what to keep and what to change after every session."],
    guidedSupport: ["With guidance", "The plan and next step are refined around your real work, not assumptions."],
    guidedLoop: "Plan → action → video feedback → adjustment → continuity",
    systemLabel: "How coaching works",
    systemTitle: "A plan that moves with your schedule.",
    systemText:
      "We build a working week around your goal, pool access and recovery time — then adjust it based on what actually happens, not a template.",
    system: [
      ["Personal swim plan", "Two or three weekly sessions with a clear focus on technique, endurance and pace."],
      ["Quarterly gym plan", "Strength work that supports your swimming without taking energy away from the water."],
      ["Video analysis", "We review your technique on video so you can see specific changes from week to week."],
      ["Chat", "Quick support around sessions, how you feel and real-life adjustments."],
      ["Calls", "We regularly align on your direction, goals and the next step in your progress."],
    ],
    pricingLabel: "Pricing",
    pricingTitle: "Clear formats, with no hidden conditions.",
    priceFacts: [
      "2 swim sessions per week — $80/month",
      "Quarterly gym plan — $60 / $20 per month",
      "3 swim sessions per week + gym — from $140/month",
    ],
    pricingText: "Your final format depends on your experience, goal and the number of sessions that genuinely fit into your week.",
    startLabel: "Your first week",
    startTitle: "We start with your real context, not a random programme.",
    firstWeek: [
      ["01", "A short introduction", "You share your goal, water experience, pool access and usual weekly rhythm."],
      ["02", "We define your starting point", "We review your technique on video or agree on a simple, low-stress way to record it."],
      ["03", "We build your first week", "You receive a clear plan and a direct channel for questions as you go."],
      ["04", "You send video and receive feedback", "After your first sessions, we look at what is already working and what is worth adjusting."],
      ["05", "We refine the next block", "Your next sessions build on the real experience of the first week, not assumptions."],
    ],
    coachLabel: "Coach",
    coachTitle: "Mykyta Kachalaba",
    coachText:
      "Swimming coach and coach at HTF, a Kyiv triathlon club. I help adults build technique and a training rhythm that can hold up in everyday life.",
    coachLink: "See training on Instagram",
    finalTitle: "Ready to see whether there is a place for you?",
    finalText: "Message me on Instagram with your goal, city or pool access, and the number of weekly sessions you can realistically make. I will reply with the best format to start with.",
    footer: "© 2026 Mykyta Kachalaba · Personal online swim coaching",
  },
} as const;

export default function Home() {
  const [language, setLanguage] = useState<Language>("uk");
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <main className="site-shell" lang={language}>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Kachalaba Swim">
          KACHALABA<span>SWIM</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#audiences">{t.nav[0]}</a>
          <a href="#system">{t.nav[1]}</a>
          <a href="#price">{t.nav[2]}</a>
          <a href="#coach">{t.nav[3]}</a>
        </nav>
        <div className="language-switch" aria-label={t.languageLabel}>
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
          <p className="hero-offer">{t.offer}</p>
          <p className="hero-intro">{t.heroText}</p>
          <div className="hero-facts"><p>{t.price}</p><p>{t.capacity}</p></div>
          <a className="button button-light" href={instagramUrl} target="_blank" rel="noreferrer">{t.cta}<span>↗</span></a>
        </div>
      </section>

      <section className="audiences section" id="audiences" aria-labelledby="audiences-title">
        <p className="section-count">01</p>
        <div className="section-heading"><h2 id="audiences-title">{t.audienceTitle}</h2></div>
        <div className="audience-grid">
          {t.audiences.map(([title, text]) => <article className="audience-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="coaching-system section" id="system" aria-labelledby="system-title">
        <p className="section-count">02</p>
        <div className="section-heading"><p className="eyebrow">{t.systemLabel}</p><h2 id="system-title">{t.systemTitle}</h2><p>{t.systemText}</p></div>
        <div className="guided-narrative" aria-label={t.guidedLabel}>
          <div><p className="eyebrow">{t.guidedLabel}</p><h3>{t.guidedTitle}</h3><p>{t.guidedText}</p></div>
          <div className="guided-contrast">
            <article><p className="eyebrow">{t.guidedGuessing[0]}</p><p>{t.guidedGuessing[1]}</p></article>
            <article><p className="eyebrow">{t.guidedSupport[0]}</p><p>{t.guidedSupport[1]}</p></article>
          </div>
          <p className="guided-loop">{t.guidedLoop}</p>
        </div>
        <div className="system-grid">
          {t.system.map(([title, text], index) => <article className="system-card" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="pricing section" id="price" aria-labelledby="price-title">
        <p className="section-count">03</p>
        <div className="section-heading"><p className="eyebrow">{t.pricingLabel}</p><h2 id="price-title">{t.pricingTitle}</h2></div>
        <div className="price-card">
          <p className="price-main">{t.price}</p>
          {t.priceFacts.map((fact) => <p key={fact}>{fact}</p>)}
          <p className="price-note">{t.pricingText}</p>
        </div>
      </section>

      <section className="first-week section" id="start" aria-labelledby="start-title">
        <p className="section-count">04</p>
        <div className="section-heading"><p className="eyebrow">{t.startLabel}</p><h2 id="start-title">{t.startTitle}</h2></div>
        <ol className="first-week-list">
          {t.firstWeek.map(([number, title, text]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}
        </ol>
      </section>

      <section className="coach section" id="coach" aria-labelledby="coach-title">
        <p className="section-count">05</p>
        <div className="coach-image"><img src="/media/coach-outdoor.webp" alt={language === "uk" ? "Микита Качалаба на спортивному старті" : "Mykyta Kachalaba at a sports event"} /></div>
        <div className="coach-copy"><p className="eyebrow">{t.coachLabel}</p><h2 id="coach-title">{t.coachTitle}</h2><p>{t.coachText}</p><a className="text-link" href={instagramUrl} target="_blank" rel="noreferrer">{t.coachLink}<span>↗</span></a></div>
      </section>

      <section className="final-cta"><div><p className="eyebrow">KACHALABA SWIM</p><h2>{t.finalTitle}</h2><p>{t.finalText}</p><a className="button button-light" href={instagramUrl} target="_blank" rel="noreferrer">{t.cta}<span>↗</span></a></div></section>
      <footer><span>{t.footer}</span><a href={instagramUrl} target="_blank" rel="noreferrer">@kachamba_swim</a></footer>
    </main>
  );
}
