import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { DuplicateEmailError, type SubscriberStore } from "@/lib/store";
import type { CorrectionMethod, DigFrequency, DogSize, Subscriber, SubscriberStatus } from "@/lib/types";

type Row = {
  id: string;
  email: string;
  status: SubscriberStatus;
  dog_size: DogSize | null;
  dig_frequency: DigFrequency | null;
  correction_methods: CorrectionMethod[] | null;
  message_variant: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
  confirm_token: string;
  unsubscribe_token: string;
  consent_at: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
};

function client(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function fromRow(row: Row): Subscriber {
  return {
    id: row.id,
    email: row.email,
    status: row.status,
    dogSize: row.dog_size,
    digFrequency: row.dig_frequency,
    correctionMethods: row.correction_methods ?? [],
    messageVariant: row.message_variant,
    utmSource: row.utm_source,
    utmMedium: row.utm_medium,
    utmCampaign: row.utm_campaign,
    utmContent: row.utm_content,
    utmTerm: row.utm_term,
    referrer: row.referrer,
    confirmToken: row.confirm_token,
    unsubscribeToken: row.unsubscribe_token,
    consentAt: row.consent_at,
    confirmedAt: row.confirmed_at,
    unsubscribedAt: row.unsubscribed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(subscriber: Subscriber): Row {
  return {
    id: subscriber.id,
    email: subscriber.email,
    status: subscriber.status,
    dog_size: subscriber.dogSize,
    dig_frequency: subscriber.digFrequency,
    correction_methods: subscriber.correctionMethods,
    message_variant: subscriber.messageVariant,
    utm_source: subscriber.utmSource,
    utm_medium: subscriber.utmMedium,
    utm_campaign: subscriber.utmCampaign,
    utm_content: subscriber.utmContent,
    utm_term: subscriber.utmTerm,
    referrer: subscriber.referrer,
    confirm_token: subscriber.confirmToken,
    unsubscribe_token: subscriber.unsubscribeToken,
    consent_at: subscriber.consentAt,
    confirmed_at: subscriber.confirmedAt,
    unsubscribed_at: subscriber.unsubscribedAt,
    created_at: subscriber.createdAt,
    updated_at: subscriber.updatedAt,
  };
}

function throwIf(error: { code?: string; message: string } | null) {
  if (!error) return;
  if (error.code === "23505") throw new DuplicateEmailError();
  throw new Error(error.message);
}

export const supabaseStore: SubscriberStore = {
  async findByEmail(email) {
    const { data, error } = await client()
      .from("subscribers")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    throwIf(error);
    return data ? fromRow(data as Row) : null;
  },
  async findByConfirmToken(token) {
    const { data, error } = await client()
      .from("subscribers")
      .select("*")
      .eq("confirm_token", token)
      .maybeSingle();
    throwIf(error);
    return data ? fromRow(data as Row) : null;
  },
  async findByUnsubscribeToken(token) {
    const { data, error } = await client()
      .from("subscribers")
      .select("*")
      .eq("unsubscribe_token", token)
      .maybeSingle();
    throwIf(error);
    return data ? fromRow(data as Row) : null;
  },
  async insert(subscriber) {
    const { error } = await client().from("subscribers").insert(toRow(subscriber));
    throwIf(error);
  },
  async update(subscriber) {
    const { error } = await client()
      .from("subscribers")
      .update(toRow(subscriber))
      .eq("id", subscriber.id);
    throwIf(error);
  },
  async list() {
    const { data, error } = await client()
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: true });
    throwIf(error);
    return (data as Row[] | null)?.map(fromRow) ?? [];
  },
  async deletePendingOlderThan(iso) {
    const { data, error } = await client()
      .from("subscribers")
      .delete()
      .eq("status", "pending")
      .lt("created_at", iso)
      .select("id");
    throwIf(error);
    return data?.length ?? 0;
  },
};
