import { getStoreMode, isEmailConfigured, publicOrigin } from "@/lib/config";
import { sendConfirmEmail } from "@/lib/email";
import { isValidEmail } from "@/lib/parse";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, newId, newToken } from "@/lib/security";
import { DuplicateEmailError, getStore } from "@/lib/store";
import type { SignupStatus } from "@/lib/signup-copy";
import type { Submission, Subscriber } from "@/lib/types";

const HOUR = 60 * 60 * 1000;

export type SubscribeResult = {
  status: SignupStatus;
  devConfirmUrl?: string;
};

function mergeResearch(existing: Subscriber, incoming: Submission, now: string) {
  if (incoming.dogSize) existing.dogSize = incoming.dogSize;
  if (incoming.digFrequency) existing.digFrequency = incoming.digFrequency;
  if (incoming.correctionMethods.length) existing.correctionMethods = incoming.correctionMethods;
  if (!existing.messageVariant && incoming.message) existing.messageVariant = incoming.message;
  if (!existing.utmSource && incoming.utmSource) existing.utmSource = incoming.utmSource;
  if (!existing.utmMedium && incoming.utmMedium) existing.utmMedium = incoming.utmMedium;
  if (!existing.utmCampaign && incoming.utmCampaign) existing.utmCampaign = incoming.utmCampaign;
  if (!existing.utmContent && incoming.utmContent) existing.utmContent = incoming.utmContent;
  if (!existing.utmTerm && incoming.utmTerm) existing.utmTerm = incoming.utmTerm;
  if (!existing.referrer && incoming.referrer) existing.referrer = incoming.referrer;
  existing.updatedAt = now;
}

function createSubscriber(incoming: Submission, now: string): Subscriber {
  return {
    id: newId(),
    email: incoming.email,
    status: "pending",
    dogSize: incoming.dogSize,
    digFrequency: incoming.digFrequency,
    correctionMethods: incoming.correctionMethods,
    messageVariant: incoming.message,
    utmSource: incoming.utmSource,
    utmMedium: incoming.utmMedium,
    utmCampaign: incoming.utmCampaign,
    utmContent: incoming.utmContent,
    utmTerm: incoming.utmTerm,
    referrer: incoming.referrer,
    confirmToken: newToken(),
    unsubscribeToken: newToken(),
    consentAt: now,
    confirmedAt: null,
    unsubscribedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

async function deliver(subscriber: Subscriber, request: Request): Promise<SubscribeResult> {
  const origin = publicOrigin(request);
  const confirmUrl = `${origin}/confirm?token=${subscriber.confirmToken}`;
  const unsubscribeUrl = `${origin}/unsubscribe?token=${subscriber.unsubscribeToken}`;
  if (!isEmailConfigured()) {
    return { status: "saved_without_email", devConfirmUrl: confirmUrl };
  }
  try {
    await sendConfirmEmail({ to: subscriber.email, confirmUrl, unsubscribeUrl });
  } catch (error) {
    console.error(
      "[vela] confirmation email failed",
      error instanceof Error ? error.message : "unknown",
    );
    return { status: "email_failed" };
  }
  return { status: "check_email" };
}

export async function subscribe(incoming: Submission, request: Request): Promise<SubscribeResult> {
  const elapsed = incoming.startedAt === null ? null : Date.now() - incoming.startedAt;
  const tooFast = elapsed !== null && elapsed >= 0 && elapsed < 200;
  if (incoming.company.trim() || tooFast) {
    return { status: "check_email" };
  }

  if (incoming.startedAt !== null && Date.now() - incoming.startedAt > 12 * HOUR) {
    return { status: "stale_form" };
  }

  if (!isValidEmail(incoming.email)) return { status: "invalid_email" };
  if (!incoming.consent) return { status: "consent_required" };

  const ip = clientIp(request);
  if (!rateLimit(`ip:${ip}`, 20, HOUR)) return { status: "rate_limited" };
  if (!rateLimit(`email:${incoming.email}`, 5, HOUR)) return { status: "rate_limited" };

  const mode = getStoreMode();
  if (mode === "unconfigured") return { status: "not_configured" };
  if (!isEmailConfigured() && mode !== "local") return { status: "email_not_configured" };

  const store = await getStore();
  if (!store) return { status: "not_configured" };

  const now = new Date().toISOString();
  const existing = await store.findByEmail(incoming.email);

  if (!existing) {
    const created = createSubscriber(incoming, now);
    try {
      await store.insert(created);
    } catch (error) {
      if (!(error instanceof DuplicateEmailError)) throw error;
      const raced = await store.findByEmail(incoming.email);
      if (!raced) throw error;
      return finishExisting(raced, incoming, request, store, now);
    }
    return deliver(created, request);
  }

  return finishExisting(existing, incoming, request, store, now);
}

async function finishExisting(
  existing: Subscriber,
  incoming: Submission,
  request: Request,
  store: NonNullable<Awaited<ReturnType<typeof getStore>>>,
  now: string,
): Promise<SubscribeResult> {
  if (existing.status === "confirmed") {
    mergeResearch(existing, incoming, now);
    await store.update(existing);
    return { status: "already_confirmed" };
  }

  if (existing.status === "unsubscribed") {
    existing.status = "pending";
    existing.confirmToken = newToken();
    existing.unsubscribeToken = newToken();
    existing.consentAt = now;
    existing.confirmedAt = null;
    existing.unsubscribedAt = null;
  }

  mergeResearch(existing, incoming, now);
  await store.update(existing);
  return deliver(existing, request);
}

export async function confirmToken(token: string) {
  const store = await getStore();
  if (!store) return "unconfigured" as const;
  const subscriber = await store.findByConfirmToken(token);
  if (!subscriber || subscriber.status === "unsubscribed") return "invalid" as const;
  if (subscriber.status === "confirmed") return "confirmed" as const;

  subscriber.status = "confirmed";
  subscriber.confirmedAt = new Date().toISOString();
  subscriber.updatedAt = subscriber.confirmedAt;
  await store.update(subscriber);
  return { kind: "confirmed" as const, subscriber };
}

export async function unsubscribeToken(token: string) {
  const store = await getStore();
  if (!store) return "unconfigured" as const;
  const subscriber = await store.findByUnsubscribeToken(token);
  if (!subscriber) return "invalid" as const;
  if (subscriber.status !== "unsubscribed") {
    subscriber.status = "unsubscribed";
    subscriber.unsubscribedAt = new Date().toISOString();
    subscriber.updatedAt = subscriber.unsubscribedAt;
    await store.update(subscriber);
  }
  return "unsubscribed" as const;
}
