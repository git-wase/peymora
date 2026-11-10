import type { Metadata } from "next";
import { SimplePage } from "@/components/simple-page";
import { brand } from "@/content/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribed",
  robots: { index: false, follow: false },
};

export default function UnsubscribedPage() {
  return (
    <SimplePage eyebrow={brand.name} title="You're off the list.">
      <p>We will not email this address about {brand.name} unless you join again and confirm.</p>
      <Link href="/" className="text-ink underline underline-offset-4">
        Back to {brand.name}
      </Link>
    </SimplePage>
  );
}
