"use client";

import { track as vercelTrack } from "@vercel/analytics";

export function track(
  name: string,
  props?: Record<string, string | number | boolean | null | undefined>,
) {
  const clean: Record<string, string | number | boolean | null> = {};
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value === undefined || value === "") continue;
      clean[key] = typeof value === "string" ? value.slice(0, 80) : value;
    }
  }

  try {
    vercelTrack(name, clean);
  } catch {
    // Analytics must never break the page.
  }

  const send = (attempt: number) => {
    if (!document.querySelector("script[data-domain]")) return;
    const plausible = window.plausible;
    if (typeof plausible === "function") {
      const stringProps = Object.fromEntries(
        Object.entries(clean).map(([key, value]) => [key, String(value)]),
      );
      plausible(name, { props: stringProps });
      return;
    }
    if (attempt < 8) window.setTimeout(() => send(attempt + 1), 400);
  };
  send(0);
}
