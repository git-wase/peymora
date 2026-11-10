"use client";

import { useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

function Pageview({ enabled }: { enabled: boolean }) {
  const sent = useRef(false);

  useEffect(() => {
    if (!enabled || sent.current) return;
    const started = Date.now();
    let timer = 0;
    const send = () => {
      if (sent.current) return;
      if (typeof window.plausible === "function") {
        sent.current = true;
        const message = new URLSearchParams(window.location.search).get("m") || "default";
        window.plausible("pageview", { props: { message: message.slice(0, 40) } });
        return;
      }
      if (Date.now() - started < 5000) timer = window.setTimeout(send, 250);
    };
    send();
    return () => window.clearTimeout(timer);
  }, [enabled]);

  return null;
}

export function SiteAnalytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <>
      {domain ? (
        <Script
          src={
            process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ||
            "https://plausible.io/js/script.manual.tagged-events.js"
          }
          data-domain={domain}
          strategy="afterInteractive"
        />
      ) : null}
      <Analytics />
      <Pageview enabled={Boolean(domain)} />
    </>
  );
}
