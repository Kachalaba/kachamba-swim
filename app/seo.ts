import { happyTriFriendsUrl, instagramUrl } from "./site-links";

export const siteUrl = "https://kachalaba.coach";
export const siteName = "Kachalaba Swim";
export const coachName = "Микита Качалаба";
export const defaultTitle = "Тренер з плавання онлайн | Микита Качалаба";
export const defaultDescription =
  "Персональний тренер з плавання для дорослих і триатлетів. Індивідуальний план, відеоаналіз техніки, чат і дзвінки. Україна та онлайн.";
export const analysisTitle = "Відеорозбір техніки плавання";
export const analysisDescription =
  "Персональний відеорозбір техніки плавання за 48 годин: стоп-кадри, три пріоритети, практичні вправи та короткий дзвінок із тренером.";

export const socialImage = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "Микита Качалаба, персональний тренер з плавання",
};

const coachId = `${siteUrl}/#coach`;
const websiteId = `${siteUrl}/#website`;

export const coachJsonLd = {
  "@type": "Person",
  "@id": coachId,
  name: coachName,
  alternateName: "Mykyta Kachalaba",
  url: `${siteUrl}/`,
  image: `${siteUrl}/media/coach-outdoor.webp`,
  jobTitle: "Персональний тренер з плавання",
  sameAs: [instagramUrl, happyTriFriendsUrl],
  knowsAbout: [
    "техніка плавання",
    "плавання для дорослих",
    "підготовка триатлетів",
    "відеоаналіз техніки плавання",
  ],
};

export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: `${siteUrl}/`,
      name: siteName,
      alternateName: [coachName, "Mykyta Kachalaba", "kachalaba.coach"],
      inLanguage: ["uk", "en"],
    },
    coachJsonLd,
    {
      "@type": "Service",
      "@id": `${siteUrl}/#online-coaching`,
      name: "Персональне онлайн-ведення з плавання",
      description: defaultDescription,
      url: `${siteUrl}/`,
      provider: { "@id": coachId },
      areaServed: [
        { "@type": "Country", name: "Україна" },
        { "@type": "Place", name: "Worldwide" },
      ],
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "UAH",
        lowPrice: "3600",
        highPrice: "6300",
        offerCount: "3",
        url: `${siteUrl}/#price`,
      },
    },
  ],
};

export const analysisJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    coachJsonLd,
    {
      "@type": "Service",
      "@id": `${siteUrl}/analysis#service`,
      name: analysisTitle,
      description: analysisDescription,
      url: `${siteUrl}/analysis`,
      provider: { "@id": coachId },
      areaServed: { "@type": "Place", name: "Worldwide" },
      serviceType: "Персональний відеоаналіз техніки плавання",
      offers: {
        "@type": "Offer",
        price: "2490",
        priceCurrency: "UAH",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/analysis`,
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: siteName,
          item: `${siteUrl}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: analysisTitle,
          item: `${siteUrl}/analysis`,
        },
      ],
    },
  ],
};
