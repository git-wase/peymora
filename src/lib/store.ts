import { getStoreMode } from "@/lib/config";
import type { Subscriber } from "@/lib/types";

export class DuplicateEmailError extends Error {
  constructor() {
    super("duplicate email");
    this.name = "DuplicateEmailError";
  }
}

export interface SubscriberStore {
  findByEmail(email: string): Promise<Subscriber | null>;
  findByConfirmToken(token: string): Promise<Subscriber | null>;
  findByUnsubscribeToken(token: string): Promise<Subscriber | null>;
  insert(subscriber: Subscriber): Promise<void>;
  update(subscriber: Subscriber): Promise<void>;
  list(): Promise<Subscriber[]>;
  deletePendingOlderThan(iso: string): Promise<number>;
}

export async function getStore(): Promise<SubscriberStore | null> {
  const mode = getStoreMode();
  if (mode === "supabase") {
    const { supabaseStore } = await import("@/lib/store-supabase");
    return supabaseStore;
  }
  if (mode === "local") {
    const { localStore } = await import("@/lib/store-local");
    return localStore;
  }
  return null;
}
