import { bearerToken, safeEqual } from "@/lib/security";
import { getStore } from "@/lib/store";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  }
  if (!safeEqual(bearerToken(request), secret)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const store = await getStore();
    if (!store) {
      return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
    }
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const deleted = await store.deletePendingOlderThan(cutoff);
    return Response.json({ ok: true, deleted });
  } catch (error) {
    console.error("[vela] cleanup failed", error instanceof Error ? error.message : "unknown");
    return Response.json({ ok: false, error: "cleanup_failed" }, { status: 500 });
  }
}
