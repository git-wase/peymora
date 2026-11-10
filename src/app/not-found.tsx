import { brand } from "@/content/site";
import { primaryButton } from "@/components/styles";
import Link from "next/link";

export default function NotFound() {
  return (
    <main id="content" className="mx-auto flex min-h-[80vh] w-full max-w-xl flex-col justify-center px-5 py-32">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">404</p>
      <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight">This page is not here.</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        The collar is still in development. The page you asked for is not part of this site.
      </p>
      <Link href="/" className={`${primaryButton} mt-8 self-start`}>
        Back to {brand.name}
      </Link>
    </main>
  );
}
