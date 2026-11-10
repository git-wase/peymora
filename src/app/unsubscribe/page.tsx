import type { Metadata } from "next";
import { Suspense } from "react";
import { SimplePage } from "@/components/simple-page";
import { primaryButton } from "@/components/styles";
import { brand } from "@/content/site";
import { isToken } from "@/lib/security";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <SimplePage eyebrow={brand.name} title="Unsubscribe">
          <p>One moment.</p>
        </SimplePage>
      }
    >
      <UnsubscribeForm searchParams={searchParams} />
    </Suspense>
  );
}

async function UnsubscribeForm({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token || !isToken(token)) {
    return (
      <SimplePage eyebrow={brand.name} title="This link is not valid.">
        <p>
          If you still receive mail, write to {brand.contactEmail} and we will remove the address.
        </p>
      </SimplePage>
    );
  }

  return (
    <SimplePage eyebrow={brand.name} title="Leave the list.">
      <p>You will stop receiving early-access updates. You can join again later if you want to.</p>
      <form method="post" action="/api/unsubscribe">
        <input type="hidden" name="token" value={token} />
        <button type="submit" className={`${primaryButton} mt-2`}>
          Unsubscribe
        </button>
      </form>
    </SimplePage>
  );
}
