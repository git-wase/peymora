"use client";

import {
  correctionMethods,
  digFrequencies,
  dogSizes,
  signup,
} from "@/content/site";
import { captureAttribution } from "@/lib/attribution";
import { signupCopy, type SignupStatus } from "@/lib/signup-copy";
import { track } from "@/lib/track";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

type Props = {
  idPrefix: "early" | "final";
  variant?: "light" | "dark";
  /** Research questions. The closing form keeps email and consent only. */
  questions?: boolean;
};

export function SignupForm({ idPrefix, variant = "light", questions = true }: Props) {
  const dark = variant === "dark";
  const [startedAt, setStartedAt] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<SignupStatus | null>(null);
  const [devConfirmUrl, setDevConfirmUrl] = useState<string | null>(null);
  const [devNote, setDevNote] = useState<string | null>(null);
  const [dogSize, setDogSize] = useState("");
  const [digFrequency, setDigFrequency] = useState("");
  const [methods, setMethods] = useState<string[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setStartedAt(String(Date.now())), 0);
    if (process.env.NODE_ENV === "production") {
      return () => window.clearTimeout(timer);
    }
    let cancelled = false;
    fetch("/api/subscribe")
      .then((response) => response.json())
      .then((data: { store?: string; email?: boolean }) => {
        if (cancelled) return;
        if (data.store === "local" && !data.email) {
          setDevNote(
            "Development only. Addresses are saved in a local file. Confirmation email is not configured, so a confirmation link will appear here instead of being sent.",
          );
        } else if (data.store === "unconfigured") {
          setDevNote(
            "Development only. The database is not connected, so a submission will not be saved.",
          );
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  function toggleMethod(value: string) {
    setMethods((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const company = String(data.get("company") ?? "");
    if (company.trim()) {
      setStatus("check_email");
      return;
    }

    const email = String(data.get("email") ?? "").trim();
    const consent = data.get("consent") === "yes";
    const location = idPrefix === "early" ? "signup" : "final";
    track("CTA Click", { location });

    if (!email || !email.includes("@")) {
      setStatus("invalid_email");
      return;
    }
    if (!consent) {
      setStatus("consent_required");
      return;
    }

    const attribution = captureAttribution();
    setPending(true);
    setDevConfirmUrl(null);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent: true,
          company: "",
          startedAt: startedAt ? Number(startedAt) : null,
          dogSize: dogSize || null,
          digFrequency: digFrequency || null,
          correctionMethods: methods,
          message: attribution.message || null,
          utmSource: attribution.utmSource || null,
          utmMedium: attribution.utmMedium || null,
          utmCampaign: attribution.utmCampaign || null,
          utmContent: attribution.utmContent || null,
          utmTerm: attribution.utmTerm || null,
          referrer: attribution.referrer || null,
        }),
      });
      const result = (await response.json()) as { status?: SignupStatus; devConfirmUrl?: string };
      const next = result.status ?? "error";
      setStatus(next);
      setDevConfirmUrl(result.devConfirmUrl ?? null);
      track("Email Signup", {
        location,
        status: next,
        message: attribution.message || "default",
        dog_size: dogSize || "unspecified",
        dig_frequency: digFrequency || "unspecified",
        methods: methods.length ? [...methods].sort().join("+") : "unspecified",
      });
      if (next === "check_email" || next === "already_confirmed" || next === "saved_without_email") {
        form.reset();
        setDogSize("");
        setDigFrequency("");
        setMethods([]);
      }
    } catch {
      setStatus("error");
    } finally {
      setPending(false);
    }
  }

  const copy = status ? signupCopy[status] : null;
  const emailId = idPrefix === "early" ? "early-email" : "join-email";
  const field =
    dark
      ? "h-12 w-full rounded-full border border-white/15 bg-dark-2 px-5 text-foam outline-none"
      : "h-12 w-full rounded-full border border-line bg-foam px-5 text-ink outline-none";
  const quiet = dark ? "text-mist" : "text-muted";
  const ink = dark ? "text-foam" : "text-ink";
  const button = dark
    ? "inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-foam px-6 text-sm font-medium text-ink transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-60"
    : "inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-foam transition-colors hover:bg-ink-soft disabled:cursor-wait disabled:opacity-60";

  function pill(selected: boolean) {
    if (selected) {
      return dark
        ? "cursor-pointer rounded-full border border-foam bg-foam px-4 py-2 text-sm text-ink"
        : "cursor-pointer rounded-full border border-ink bg-ink px-4 py-2 text-sm text-foam";
    }
    return dark
      ? "cursor-pointer rounded-full border border-white/15 px-4 py-2 text-sm text-foam"
      : "cursor-pointer rounded-full border border-line px-4 py-2 text-sm text-ink";
  }

  return (
    <form onSubmit={onSubmit} className="relative text-left" noValidate>
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="started_at" value={startedAt} />

      <div>
        <label htmlFor={emailId} className="sr-only">
          {signup.emailLabel}
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          required
          placeholder="Email address"
          className={field}
        />
      </div>

      {questions ? (
      <fieldset className="mt-7">
        <legend className={`text-sm ${quiet}`}>
          <span className={`font-medium ${ink}`}>{signup.optionalTitle}.</span> {signup.optionalNote}
        </legend>
        <div className="mt-5">
          <p className={`text-xs font-medium uppercase tracking-[0.16em] ${quiet}`}>Dog size</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {dogSizes.map((option) => (
              <label key={option.value} className={pill(dogSize === option.value)}>
                <input
                  className="sr-only"
                  type="radio"
                  name={`${idPrefix}-dog-size`}
                  value={option.value}
                  checked={dogSize === option.value}
                  onChange={() => setDogSize(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <p className={`text-xs font-medium uppercase tracking-[0.16em] ${quiet}`}>
            How often does your dog dig?
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {digFrequencies.map((option) => (
              <label key={option.value} className={pill(digFrequency === option.value)}>
                <input
                  className="sr-only"
                  type="radio"
                  name={`${idPrefix}-dig`}
                  value={option.value}
                  checked={digFrequency === option.value}
                  onChange={() => setDigFrequency(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <p className={`text-xs font-medium uppercase tracking-[0.16em] ${quiet}`}>
            Which correction methods would you consider?
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {correctionMethods.map((option) => (
              <label key={option.value} className={pill(methods.includes(option.value))}>
                <input
                  className="sr-only"
                  type="checkbox"
                  name="correction_methods"
                  value={option.value}
                  checked={methods.includes(option.value)}
                  onChange={() => toggleMethod(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      </fieldset>
      ) : null}

      <button type="submit" className={`${button} mt-7`} disabled={pending}>
        {pending ? "Sending…" : signup.button}
      </button>

      <label className={`mt-6 flex items-start gap-3 text-sm leading-relaxed ${quiet}`}>
        <input
          name="consent"
          type="checkbox"
          value="yes"
          required
          className="mt-1 size-4 accent-ink"
        />
        <span>
          {signup.consent}{" "}
          <Link href="/privacy" className={`underline underline-offset-4 ${ink}`}>
            Privacy policy
          </Link>
          .
        </span>
      </label>
      <p className={`mt-4 text-sm leading-relaxed ${quiet}`}>{signup.finePrint}</p>

      {devNote ? (
        <p className={`mt-4 text-xs leading-relaxed ${quiet}`}>{devNote}</p>
      ) : null}

      {copy ? (
        <div
          role={copy.tone === "error" ? "alert" : "status"}
          className={`mt-6 rounded-2xl border px-5 py-4 ${dark ? "border-white/15" : "border-line"}`}
        >
          <p className={`font-medium ${ink}`}>{copy.title}</p>
          <p className={`mt-2 text-sm leading-relaxed ${quiet}`}>{copy.body}</p>
          {devConfirmUrl ? (
            <p className={`mt-3 text-sm leading-relaxed ${quiet}`}>
              Development link, because no email was sent.{" "}
              <a href={devConfirmUrl} className={`underline underline-offset-4 ${ink}`}>
                Confirm this address
              </a>
              .
            </p>
          ) : null}
          <button
            type="button"
            className={`mt-4 text-sm underline underline-offset-4 ${ink}`}
            onClick={() => {
              setStatus(null);
              setDevConfirmUrl(null);
            }}
          >
            Use a different email
          </button>
        </div>
      ) : null}
    </form>
  );
}
