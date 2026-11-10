export type StoreMode = "supabase" | "local" | "unconfigured";

export function configuredSiteUrl() {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;
  return "http://localhost:3000";
}

export function publicOrigin(request: Request) {
  const configured = process.env.SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? url.host;
  const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  return `${proto}://${host}`;
}

export function getStoreMode(): StoreMode {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return "supabase";
  }
  if (process.env.USE_LOCAL_STORE === "true" && !process.env.VERCEL) {
    return "local";
  }
  return "unconfigured";
}

export function isEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.RESEND_FROM &&
      (process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL),
  );
}

export function isPlaceholderEmail(email: string) {
  return email.endsWith("@example.com") || email.endsWith("@example.org");
}
