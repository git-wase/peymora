"use client";

import { track } from "@/lib/track";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SectionLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const hash = href.includes("#") ? href.slice(href.indexOf("#")) : href;
  const onHome = pathname === "/";
  if (onHome) {
    return (
      <a href={hash} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function JoinLink({
  location,
  className,
  children,
}: {
  location: string;
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const onHome = pathname === "/";

  function onClick(event: { preventDefault: () => void }) {
    track("CTA Click", { location });
    if (!onHome) return;
    event.preventDefault();
    const behavior = prefersReducedMotion() ? "auto" : "smooth";
    document.getElementById("join")?.scrollIntoView({ behavior });
    window.setTimeout(
      () => document.getElementById("join-email")?.focus({ preventScroll: true }),
      behavior === "smooth" ? 450 : 0,
    );
  }

  if (onHome) {
    return (
      <a href="#join" className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href="/#join" className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export function TrackedAnchor({
  href,
  location,
  className,
  children,
}: {
  href: string;
  location: string;
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const hash = href.includes("#") ? href.slice(href.indexOf("#")) : href;
  const onHome = pathname === "/";
  if (onHome) {
    return (
      <a href={hash} className={className} onClick={() => track("CTA Click", { location })}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={() => track("CTA Click", { location })}>
      {children}
    </Link>
  );
}
