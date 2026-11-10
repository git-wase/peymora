"use client";

import { hero, images, messageVariants } from "@/content/site";
import { primaryButton, secondaryButton } from "@/components/styles";
import { JoinLink, TrackedAnchor } from "@/components/tracked-link";
import Image from "next/image";
import { useSyncExternalStore } from "react";

function subscribeToLocation(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function messageFromLocation() {
  return new URLSearchParams(window.location.search).get("m") ?? "";
}

export function Hero() {
  const message = useSyncExternalStore(subscribeToLocation, messageFromLocation, () => "");
  const subheadline =
    messageVariants.find((variant) => variant.id === message)?.subheadline ?? hero.subheadline;

  return (
    <section id="top" className="overflow-hidden pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="mx-auto max-w-6xl px-5">
        <h1 className="max-w-5xl font-serif text-[clamp(2.5rem,5.6vw,4.6rem)] leading-[0.94] tracking-[-0.035em]">
          Less Digging.
          <span className="block italic">More Peace of Mind.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{subheadline}</p>
      </div>
      <figure className="mx-auto mt-8 max-w-4xl px-5 md:mt-10">
        <div className="overflow-hidden">
          <Image
            src={images.hero.src}
            alt={images.hero.alt}
            width={images.hero.width}
            height={images.hero.height}
            priority
            sizes="(min-width: 896px) 896px, 100vw"
            className="mx-auto -mb-6 h-auto max-h-[42vh] w-auto md:-mb-10"
          />
        </div>
        <figcaption className="text-center text-xs tracking-wide text-muted">Concept render.</figcaption>
        <div className="mx-auto mt-4 flex w-full max-w-sm flex-col gap-2 sm:max-w-none sm:flex-row sm:justify-center">
          <JoinLink location="hero" className={`${primaryButton} sm:min-w-56`}>
            {hero.primaryCta}
          </JoinLink>
          <TrackedAnchor
            href="/#how-it-works"
            location="how-it-works"
            className={`${secondaryButton} sm:min-w-56`}
          >
            {hero.secondaryCta}
          </TrackedAnchor>
        </div>
      </figure>
    </section>
  );
}
