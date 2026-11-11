import {
  correctionMethods,
  digFrequencies,
  dogSizes,
  isKnownMessage,
} from "@/content/site";
import type { CorrectionMethod, DigFrequency, DogSize, Submission } from "@/lib/types";

function cleanShort(value: unknown, max = 80) {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max);
  return cleaned || null;
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return allowed.find((item) => item === normalized) ?? null;
}

function cleanReferrer(value: unknown) {
  const raw = cleanShort(value, 300);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString().slice(0, 300);
  } catch {
    return null;
  }
}

function asList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

export function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  if (!email || email.length > 254) return false;
  const [local, domain, extra] = email.split("@");
  if (!local || !domain || extra !== undefined) return false;
  if (local.length > 64 || domain.length > 253) return false;
  if (local.startsWith(".") || local.endsWith(".") || domain.startsWith(".") || domain.endsWith(".")) {
    return false;
  }
  if (!domain.includes(".")) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function startedAtFrom(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function consentFrom(value: unknown) {
  return value === true || value === "yes" || value === "on";
}

export function submissionFromRecord(record: Record<string, unknown>): Submission {
  const methods = asList(record.correctionMethods ?? record.correction_methods)
    .map((item) => oneOf(item, correctionMethods.map((method) => method.value)))
    .filter((item): item is CorrectionMethod => item !== null);
  const uniqueMethods = [...new Set(methods)].slice(0, correctionMethods.length);
  const message = cleanShort(record.message, 40);

  return {
    email: normalizeEmail(record.email),
    consent: consentFrom(record.consent),
    company: typeof record.company === "string" ? record.company : "",
    startedAt: startedAtFrom(record.startedAt ?? record.started_at),
    dogSize: oneOf<DogSize>(record.dogSize ?? record.dog_size, dogSizes.map((item) => item.value)),
    digFrequency: oneOf<DigFrequency>(
      record.digFrequency ?? record.dig_frequency,
      digFrequencies.map((item) => item.value),
    ),
    correctionMethods: uniqueMethods,
    message: message && isKnownMessage(message) ? message : null,
    utmSource: cleanShort(record.utmSource ?? record.utm_source),
    utmMedium: cleanShort(record.utmMedium ?? record.utm_medium),
    utmCampaign: cleanShort(record.utmCampaign ?? record.utm_campaign),
    utmContent: cleanShort(record.utmContent ?? record.utm_content),
    utmTerm: cleanShort(record.utmTerm ?? record.utm_term),
    referrer: cleanReferrer(record.referrer),
  };
}

function turnstileTokenFrom(value: unknown) {
  return cleanShort(value, 2048);
}

export async function submissionFromRequest(
  request: Request,
): Promise<{ submission: Submission; turnstileToken: string | null }> {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    const body = (await request.json()) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return { submission: submissionFromRecord({}), turnstileToken: null };
    }
    const record = body as Record<string, unknown>;
    return {
      submission: submissionFromRecord(record),
      turnstileToken: turnstileTokenFrom(record.turnstileToken ?? record.turnstile_token),
    };
  }

  const form = await request.formData();
  return {
    submission: submissionFromRecord({
      email: form.get("email"),
      consent: form.get("consent"),
      company: form.get("company"),
      started_at: form.get("started_at"),
      dog_size: form.get("dog_size"),
      dig_frequency: form.get("dig_frequency"),
      correction_methods: form.getAll("correction_methods"),
      message: form.get("message"),
      utm_source: form.get("utm_source"),
      utm_medium: form.get("utm_medium"),
      utm_campaign: form.get("utm_campaign"),
      utm_content: form.get("utm_content"),
      utm_term: form.get("utm_term"),
      referrer: form.get("referrer"),
    }),
    turnstileToken: turnstileTokenFrom(form.get("cf-turnstile-response")),
  };
}
