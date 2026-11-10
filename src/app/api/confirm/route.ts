import { isEmailConfigured, publicOrigin } from "@/lib/config";
import { sendWelcomeEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, isToken } from "@/lib/security";
import { confirmToken } from "@/lib/subscribe";
import { NextResponse } from "next/server";

function redirectTo(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, publicOrigin(request)), 303);
}

export function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const destination = new URL("/confirm", publicOrigin(request));
  if (isToken(token)) destination.searchParams.set("token", token);
  return NextResponse.redirect(destination, 303);
}

export async function POST(request: Request) {
  if (!rateLimit(`confirm:${clientIp(request)}`, 20, 60 * 60 * 1000)) {
    return redirectTo(request, "/link-expired");
  }
  const form = await request.formData();
  const token = String(form.get("token") ?? "");
  if (!isToken(token)) return redirectTo(request, "/link-expired");

  try {
    const result = await confirmToken(token);
    if (result === "confirmed") return redirectTo(request, "/confirmed");
    if (typeof result === "object") {
      if (isEmailConfigured()) {
        try {
          const origin = publicOrigin(request);
          await sendWelcomeEmail({
            to: result.subscriber.email,
            unsubscribeUrl: `${origin}/unsubscribe?token=${result.subscriber.unsubscribeToken}`,
          });
        } catch (error) {
          console.error(
            "[vela] welcome email failed",
            error instanceof Error ? error.message : "unknown",
          );
        }
      }
      return redirectTo(request, "/confirmed");
    }
  } catch (error) {
    console.error("[vela] confirm failed", error instanceof Error ? error.message : "unknown");
  }
  return redirectTo(request, "/link-expired");
}
