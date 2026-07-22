import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import {
  coachName,
  defaultDescription,
  defaultTitle,
  siteName,
  siteUrl,
  socialImage,
} from "./seo";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  authors: [{ name: coachName, url: siteUrl }],
  creator: coachName,
  publisher: siteName,
  category: "sports",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    type: "website",
    url: "/",
    siteName,
    locale: "uk_UA",
    alternateLocale: ["en_US"],
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [socialImage.url],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#06181d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body className={geist.variable}>
        {children}
      </body>
    </html>
  );
}
