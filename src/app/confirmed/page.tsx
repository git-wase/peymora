import type { Metadata } from "next";
import { SimplePage } from "@/components/simple-page";
import { TrackOnce } from "@/components/observe";
import { brand } from "@/content/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You're confirmed",
  robots: { index: false, follow: false },
};

export default function ConfirmedPage() {
  return (
    <SimplePage eyebrow={brand.name} title="You're on the list.">
      <TrackOnce name="Email Confirmed" />
      <p>
        This address is confirmed for early-access updates about development and launch. The collar
        is not for sale. We will not add you to unrelated marketing.
      </p>
      <Link href="/" className="text-ink underline underline-offset-4">
        Back to {brand.name}
      </Link>
    </SimplePage>
  );
}
