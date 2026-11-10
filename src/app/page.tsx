import type { Metadata } from "next";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Hero } from "@/components/hero";
import { Lifestyle } from "@/components/lifestyle";
import { Problem } from "@/components/problem";
import { Solution } from "@/components/solution";
import { StatusStrip } from "@/components/status-strip";
import { Training } from "@/components/training";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main id="content">
      <Hero />
      <StatusStrip />
      <Problem />
      <Solution />
      <Training />
      <Lifestyle />
      <Faq />
      <FinalCta />
    </main>
  );
}
