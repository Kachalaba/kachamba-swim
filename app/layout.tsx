import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://kachalaba.coach"),
  title: "Mykyta Kachalaba — Personal Swim Coaching",
  description: "Personal swim coaching and professional video technique analysis by Mykyta Kachalaba. Coaching from 4,500 UAH per month; video audit from 2,490 UAH.",
  openGraph: {
    title: "Mykyta Kachalaba — Personal Swim Coaching",
    description: "Personal swim coaching and professional video technique analysis. Coaching from 4,500 UAH per month; video audit from 2,490 UAH.",
    type: "website",
    url: "https://kachalaba.coach",
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
