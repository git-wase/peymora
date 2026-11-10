import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { DuplicateEmailError, type SubscriberStore } from "@/lib/store";
import type { Subscriber } from "@/lib/types";

const filePath = path.join(process.cwd(), "data", "subscribers.json");

let chain: Promise<unknown> = Promise.resolve();

function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readAll() {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) throw new Error("Subscriber store is not a list.");
    return parsed as Subscriber[];
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeAll(subscribers: Subscriber[]) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(subscribers, null, 2)}\n`, "utf8");
}

export const localStore: SubscriberStore = {
  findByEmail(email) {
    return locked(async () => {
      const all = await readAll();
      return all.find((item) => item.email === email) ?? null;
    });
  },
  findByConfirmToken(token) {
    return locked(async () => {
      const all = await readAll();
      return all.find((item) => item.confirmToken === token) ?? null;
    });
  },
  findByUnsubscribeToken(token) {
    return locked(async () => {
      const all = await readAll();
      return all.find((item) => item.unsubscribeToken === token) ?? null;
    });
  },
  insert(subscriber) {
    return locked(async () => {
      const all = await readAll();
      if (all.some((item) => item.email === subscriber.email)) {
        throw new DuplicateEmailError();
      }
      all.push(subscriber);
      await writeAll(all);
    });
  },
  update(subscriber) {
    return locked(async () => {
      const all = await readAll();
      const index = all.findIndex((item) => item.id === subscriber.id);
      if (index === -1) throw new Error("Subscriber was not found.");
      all[index] = subscriber;
      await writeAll(all);
    });
  },
  list() {
    return locked(async () => readAll());
  },
  deletePendingOlderThan(iso) {
    return locked(async () => {
      const all = await readAll();
      const cutoff = new Date(iso).getTime();
      const kept = all.filter(
        (item) => !(item.status === "pending" && new Date(item.createdAt).getTime() < cutoff),
      );
      await writeAll(kept);
      return all.length - kept.length;
    });
  },
};
