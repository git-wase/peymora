"use client";

import { useEffect } from "react";

const KEY = "vela-attribution";

export type Attribution = {
  message: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  referrer: string;
};

const empty: Attribution = {
  message: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  utmTerm: "",
  referrer: "",
};

export function readAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return { ...empty };
    return { ...empty, ...(JSON.parse(raw) as Partial<Attribution>) };
  } catch {
    return { ...empty };
  }
}

export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const next = readAttribution();
    const fields = [
      ["utm_source", "utmSource"],
      ["utm_medium", "utmMedium"],
      ["utm_campaign", "utmCampaign"],
      ["utm_content", "utmContent"],
      ["utm_term", "utmTerm"],
    ] as const;
    for (const [param, key] of fields) {
      const value = params.get(param);
      if (value) next[key] = value.slice(0, 80);
    }
    const message = params.get("m");
    if (message) next.message = message.slice(0, 40);
    if (!next.referrer && document.referrer) next.referrer = document.referrer.slice(0, 300);
    sessionStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return { ...empty };
  }
}

export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
