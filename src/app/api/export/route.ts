import { subscribersToCsv } from "@/lib/csv";
import { bearerToken, safeEqual } from "@/lib/security";
import { getStore } from "@/lib/store";

export async function GET(request: Request) {
  const secret = process.env.ADMIN_EXPORT_SECRET;
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
    const csv = subscribersToCsv(await store.list());
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="vela-subscribers.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[vela] export failed", error instanceof Error ? error.message : "unknown");
    return Response.json({ ok: false, error: "export_failed" }, { status: 500 });
  }
}
