import { getStoreMode } from "@/lib/config";
import { clientIp } from "@/lib/security";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function turnstileSecret() {
  return process.env.TURNSTILE_SECRET_KEY?.trim() ?? "";
}

/** Local development can skip the check only when no secret is configured. */
export function turnstileOptional() {
  return !turnstileSecret() && getStoreMode() === "local";
}

export async function verifyTurnstile(
  token: string | null,
  request: Request,
): Promise<"ok" | "failed" | "unconfigured"> {
  const secret = turnstileSecret();
  if (!secret) return turnstileOptional() ? "ok" : "unconfigured";
  if (!token?.trim()) return "failed";

  const body = new URLSearchParams({ secret, response: token.trim() });
  const ip = clientIp(request);
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    const response = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!response.ok) return "failed";
    const data = (await response.json()) as { success?: boolean };
    return data.success ? "ok" : "failed";
  } catch {
    return "failed";
  }
}
