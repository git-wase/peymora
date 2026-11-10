import { publicOrigin } from "@/lib/config";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, isToken } from "@/lib/security";
import { unsubscribeToken } from "@/lib/subscribe";
import { NextResponse } from "next/server";

function pageUrl(request: Request, token: string) {
  const destination = new URL("/unsubscribe", publicOrigin(request));
  if (isToken(token)) destination.searchParams.set("token", token);
  return destination;
}

export function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  return NextResponse.redirect(pageUrl(request, token), 303);
}

export async function POST(request: Request) {
  if (!rateLimit(`unsubscribe:${clientIp(request)}`, 20, 60 * 60 * 1000)) {
    return NextResponse.redirect(new URL("/link-expired", publicOrigin(request)), 303);
  }

  const form = await request.formData();
  const tokenFromBody = String(form.get("token") ?? "");
  const tokenFromUrl = new URL(request.url).searchParams.get("token") ?? "";
  const token = isToken(tokenFromBody) ? tokenFromBody : tokenFromUrl;
  const oneClick = form.get("List-Unsubscribe") === "One-Click";

  if (!isToken(token)) {
    if (oneClick) return Response.json({ ok: false }, { status: 400 });
    return NextResponse.redirect(new URL("/link-expired", publicOrigin(request)), 303);
  }

  try {
    const result = await unsubscribeToken(token);
    if (result !== "unsubscribed") {
      if (oneClick) return Response.json({ ok: false }, { status: 400 });
      return NextResponse.redirect(new URL("/link-expired", publicOrigin(request)), 303);
    }
  } catch (error) {
    console.error("[vela] unsubscribe failed", error instanceof Error ? error.message : "unknown");
    if (oneClick) return Response.json({ ok: false }, { status: 500 });
    return NextResponse.redirect(new URL("/link-expired", publicOrigin(request)), 303);
  }

  if (oneClick) return Response.json({ ok: true });
  return NextResponse.redirect(new URL("/unsubscribed", publicOrigin(request)), 303);
}
