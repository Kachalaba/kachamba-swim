import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { happyTriFriendsUrl, instagramUrl } from "./site-copy";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });
const siteUrl = "https://kachalaba.coach";
const title = "Микита Качалаба — персональне онлайн-ведення з плавання | Kachalaba Swim";
const description =
  "Персональне онлайн-ведення з плавання від Микити Качалаби: індивідуальні плани з плавання та залу, відеоаналіз техніки, чат і дзвінки. Від 4 500 грн/місяць. Online swim coaching in Ukrainian and English.";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Kachalaba Swim — персональне онлайн-ведення з плавання",
  serviceType: "Online swim coaching",
  url: siteUrl,
  description,
  availableLanguage: ["uk", "en"],
  areaServed: "Worldwide",
  provider: {
    "@type": "Person",
    name: "Mykyta Kachalaba",
    alternateName: "Микита Качалаба",
    url: siteUrl,
    sameAs: [instagramUrl, happyTriFriendsUrl],
  },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "3600",
    highPrice: "6300",
    priceCurrency: "UAH",
    description: "Місячне персональне ведення: план з плавання, силовий план, відеоаналіз, чат і дзвінки.",
  },
};

export const viewport: Viewport = {
  themeColor: "#06181d",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: "/",
    locale: "uk_UA",
    alternateLocale: "en_US",
    siteName: "Kachalaba Swim",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Mykyta Kachalaba — Personal Swim Coaching" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body className={geist.variable}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
