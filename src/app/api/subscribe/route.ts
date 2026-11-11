import { getStoreMode, isEmailConfigured, publicOrigin } from "@/lib/config";
import { submissionFromRequest } from "@/lib/parse";
import { subscribe, type SubscribeResult } from "@/lib/subscribe";
import { statusCode } from "@/lib/signup-copy";
import { NextResponse } from "next/server";

function wantsJson(request: Request) {
  return (request.headers.get("content-type") || "").includes("application/json");
}

function respond(request: Request, result: SubscribeResult) {
  if (wantsJson(request)) {
    return Response.json(
      {
        status: result.status,
        devConfirmUrl: result.devConfirmUrl,
      },
      { status: statusCode(result.status) },
    );
  }
  const url = new URL("/subscribe/result", publicOrigin(request));
  url.searchParams.set("status", result.status);
  return NextResponse.redirect(url, 303);
}

export function GET() {
  return Response.json({
    store: getStoreMode(),
    email: isEmailConfigured(),
  });
}

export async function POST(request: Request) {
  try {
    const { submission, turnstileToken } = await submissionFromRequest(request);
    const result = await subscribe(submission, request, turnstileToken);
    return respond(request, result);
  } catch (error) {
    console.error("[vela] subscribe failed", error instanceof Error ? error.message : "unknown");
    return respond(request, { status: "error" });
  }
}
