import type { Metadata } from "next";
import { Suspense } from "react";
import { SimplePage } from "@/components/simple-page";
import { isSignupStatus, signupCopy } from "@/lib/signup-copy";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Early access",
  robots: { index: false, follow: false },
};

export default function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <SimplePage eyebrow="Early access" title="One moment.">
          <p>Checking that submission.</p>
        </SimplePage>
      }
    >
      <Result searchParams={searchParams} />
    </Suspense>
  );
}

async function Result({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const copy = isSignupStatus(status) ? signupCopy[status] : signupCopy.error;
  return (
    <SimplePage eyebrow="Early access" title={copy.title}>
      <p>{copy.body}</p>
      <Link href="/#join" className="text-ink underline underline-offset-4">
        Back to the list
      </Link>
    </SimplePage>
  );
}
