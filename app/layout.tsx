import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Mykyta Kachalaba — Personal Swim Coaching",
  description: "Personal online swimming coaching with individual plans, video analysis, chat and calls. From $100 per month.",
  openGraph: {
    title: "Mykyta Kachalaba — Personal Swim Coaching",
    description: "Personal online swimming coaching with individual plans, video analysis, chat and calls. From $100 per month.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Mykyta Kachalaba — Personal Swim Coaching" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mykyta Kachalaba — Personal Swim Coaching",
    description: "Personal online swimming coaching with individual plans, video analysis, chat and calls. From $100 per month.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uk"><body className={geist.variable}>{children}</body></html>;
}
