import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Микита Качалаба — плавання для дорослих",
  description: "Плавання для дорослих у Києві та онлайн. Спокійний шлях до впевненості у воді з Микитою Качалабою.",
  openGraph: {
    title: "Микита Качалаба — плавання для дорослих",
    description: "Почніть плавати красиво.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Почніть плавати красиво." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Микита Качалаба — плавання для дорослих",
    description: "Почніть плавати красиво.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uk"><body className={geist.variable}>{children}</body></html>;
}
