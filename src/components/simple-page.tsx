import { Eyebrow } from "@/components/eyebrow";
import type { ReactNode } from "react";

export function SimplePage({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main id="content" className="mx-auto flex min-h-[80vh] w-full max-w-xl flex-col justify-center px-5 py-32">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight text-balance">{title}</h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">{children}</div>
    </main>
  );
}
