"use client";

import { brand, nav } from "@/content/site";
import { JoinLink, SectionLink } from "@/components/tracked-link";
import { primaryButton } from "@/components/styles";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="text-[0.8rem] font-medium tracking-[0.28em] uppercase">
          {brand.name}
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex" aria-label="Sections">
          {nav.map((item) => (
            <SectionLink key={item.href} href={item.href} className="transition-colors hover:text-ink">
              {item.label}
            </SectionLink>
          ))}
        </nav>
        <JoinLink location="nav" className={`${primaryButton} h-10 px-4`}>
          <span className="md:hidden">Join</span>
          <span className="hidden md:inline">Join the list</span>
        </JoinLink>
      </div>
    </header>
  );
}
