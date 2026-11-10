import type { Metadata } from "next";
import { SimplePage } from "@/components/simple-page";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Link expired",
  robots: { index: false, follow: false },
};

export default function LinkExpiredPage() {
  return (
    <SimplePage eyebrow="Early access" title="This link is no longer valid.">
      <p>
        It may have expired, or the address may already have been removed. Unconfirmed addresses
        are deleted after 30 days. You can request a new email from the form.
      </p>
      <Link href="/#join" className="text-ink underline underline-offset-4">
        Back to the list
      </Link>
    </SimplePage>
  );
}
