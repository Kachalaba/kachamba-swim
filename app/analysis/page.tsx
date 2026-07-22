import type { Metadata } from "next";
import { JsonLd } from "../JsonLd";
import {
  analysisDescription,
  analysisJsonLd,
  analysisTitle,
  siteName,
  socialImage,
} from "../seo";
import { analysisTelegramUrl, whatsappUrl } from "../site-links";
import { AnalysisIntake } from "./AnalysisIntake";

export const metadata: Metadata = {
  title: analysisTitle,
  description: analysisDescription,
  alternates: {
    canonical: "/analysis",
  },
  openGraph: {
    title: `${analysisTitle} | ${siteName}`,
    description: analysisDescription,
    type: "website",
    url: "/analysis",
    siteName,
    locale: "uk_UA",
    alternateLocale: ["en_US"],
    images: [{ ...socialImage, alt: "Відеорозбір техніки плавання з Микитою Качалабою" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${analysisTitle} | ${siteName}`,
    description: analysisDescription,
    images: [socialImage.url],
  },
};

export default function AnalysisPage() {
  return (
    <>
      <JsonLd data={analysisJsonLd} />
      <AnalysisIntake telegramHref={analysisTelegramUrl()} whatsappHref={whatsappUrl} />
    </>
  );
}
