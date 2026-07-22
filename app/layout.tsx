import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });
const siteUrl = "https://kachalaba.coach";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mykyta Kachalaba — Personal Swim Coaching",
  description: "Personal swim coaching and professional video technique analysis by Mykyta Kachalaba. Coaching from 4,500 UAH per month; video audit from 2,490 UAH.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Mykyta Kachalaba — Personal Swim Coaching",
    description: "Personal swim coaching and professional video technique analysis. Coaching from 4,500 UAH per month; video audit from 2,490 UAH.",
    type: "website",
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Mykyta Kachalaba — Personal Swim Coaching" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mykyta Kachalaba — Personal Swim Coaching",
    description: "Personal swim coaching and professional video technique analysis. Coaching from 4,500 UAH per month; video audit from 2,490 UAH.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uk"><body className={geist.variable}>{children}</body></html>;
}
