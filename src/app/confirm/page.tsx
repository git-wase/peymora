import type { Metadata } from "next";
import { Suspense } from "react";
import { SimplePage } from "@/components/simple-page";
import { primaryButton } from "@/components/styles";
import { isToken } from "@/lib/security";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Confirm your email",
  robots: { index: false, follow: false },
};

export default function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <SimplePage eyebrow="Early access" title="Confirm your email.">
          <p>One moment.</p>
        </SimplePage>
      }
    >
      <ConfirmForm searchParams={searchParams} />
    </Suspense>
  );
}

async function ConfirmForm({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token || !isToken(token)) {
    return (
      <SimplePage eyebrow="Early access" title="This link is not valid.">
        <p>Request a new confirmation email from the early-access form.</p>
        <Link href="/#join" className="text-ink underline underline-offset-4">
          Back to the list
        </Link>
      </SimplePage>
    );
  }

  return (
    <SimplePage eyebrow="Early access" title="Confirm your email.">
      <p>
        Confirming adds this address to the early-access list for product updates, development
        milestones, and launch information. Nothing else.
      </p>
      <form method="post" action="/api/confirm">
        <input type="hidden" name="token" value={token} />
        <button type="submit" className={`${primaryButton} mt-2`}>
          Confirm my email
        </button>
      </form>
    </SimplePage>
  );
}
