import type { Subscriber } from "@/lib/types";

function cell(value: string | null | undefined) {
  const raw = value ?? "";
  const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  if (/[",\n]/.test(safe)) return `"${safe.replaceAll('"', '""')}"`;
  return safe;
}

const columns: Array<{ header: string; value: (subscriber: Subscriber) => string }> = [
  { header: "email", value: (subscriber) => subscriber.email },
  { header: "status", value: (subscriber) => subscriber.status },
  { header: "dog_size", value: (subscriber) => subscriber.dogSize ?? "" },
  { header: "dig_frequency", value: (subscriber) => subscriber.digFrequency ?? "" },
  {
    header: "correction_methods",
    value: (subscriber) => subscriber.correctionMethods.join("|"),
  },
  { header: "message_variant", value: (subscriber) => subscriber.messageVariant ?? "" },
  { header: "utm_source", value: (subscriber) => subscriber.utmSource ?? "" },
  { header: "utm_medium", value: (subscriber) => subscriber.utmMedium ?? "" },
  { header: "utm_campaign", value: (subscriber) => subscriber.utmCampaign ?? "" },
  { header: "utm_content", value: (subscriber) => subscriber.utmContent ?? "" },
  { header: "utm_term", value: (subscriber) => subscriber.utmTerm ?? "" },
  { header: "referrer", value: (subscriber) => subscriber.referrer ?? "" },
  { header: "consent_at", value: (subscriber) => subscriber.consentAt },
  { header: "created_at", value: (subscriber) => subscriber.createdAt },
  { header: "confirmed_at", value: (subscriber) => subscriber.confirmedAt ?? "" },
  { header: "unsubscribed_at", value: (subscriber) => subscriber.unsubscribedAt ?? "" },
];

export function subscribersToCsv(subscribers: Subscriber[]) {
  const header = columns.map((column) => column.header).join(",");
  const rows = subscribers.map((subscriber) =>
    columns.map((column) => cell(column.value(subscriber))).join(","),
  );
  return `\uFEFF${[header, ...rows].join("\n")}\n`;
}
