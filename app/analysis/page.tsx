import type { Metadata } from "next";
import { analysisTelegramUrl, whatsappUrl } from "../site-links";
import { AnalysisIntake } from "./AnalysisIntake";

export const metadata: Metadata = {
  title: "Video Technique Audit | Kachalaba Swim",
  description:
    "Персональний розбір техніки плавання за відео: evidence-кадри, три пріоритети, вправи та дзвінок із тренером.",
};

export default function AnalysisPage() {
  return <AnalysisIntake telegramHref={analysisTelegramUrl()} whatsappHref={whatsappUrl} />;
}
