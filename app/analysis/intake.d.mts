import type { Language } from "../site-copy";

export type AnalysisBriefInput = {
  language: Language;
  name: string;
  goal: string;
  level: string;
  stroke: string;
  deadline: string;
  videoReady: boolean;
};

export function buildAnalysisBrief(input: AnalysisBriefInput): string;
export function buildWhatsAppUrl(input: AnalysisBriefInput, phone: string): string;

