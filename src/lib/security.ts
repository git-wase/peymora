import { createHash, randomBytes, randomUUID, timingSafeEqual } from "crypto";

export function newId() {
  return randomUUID();
}

export function newToken() {
  return randomBytes(32).toString("hex");
}

export function isToken(value: string) {
  return /^[a-f0-9]{64}$/.test(value);
}

export function safeEqual(a: string, b: string) {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 80);
  }
  return (request.headers.get("x-real-ip") || "unknown").slice(0, 80);
}

export function bearerToken(request: Request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? "";
}
