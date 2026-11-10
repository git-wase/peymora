import type { correctionMethods, digFrequencies, dogSizes } from "@/content/site";

export type DogSize = (typeof dogSizes)[number]["value"];
export type DigFrequency = (typeof digFrequencies)[number]["value"];
export type CorrectionMethod = (typeof correctionMethods)[number]["value"];

export type SubscriberStatus = "pending" | "confirmed" | "unsubscribed";

export type Subscriber = {
  id: string;
  email: string;
  status: SubscriberStatus;
  dogSize: DogSize | null;
  digFrequency: DigFrequency | null;
  correctionMethods: CorrectionMethod[];
  messageVariant: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  referrer: string | null;
  confirmToken: string;
  unsubscribeToken: string;
  consentAt: string;
  confirmedAt: string | null;
  unsubscribedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Submission = {
  email: string;
  consent: boolean;
  company: string;
  startedAt: number | null;
  dogSize: DogSize | null;
  digFrequency: DigFrequency | null;
  correctionMethods: CorrectionMethod[];
  message: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  referrer: string | null;
};
