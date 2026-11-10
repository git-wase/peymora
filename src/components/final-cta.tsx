import { finalCta } from "@/content/site";
import { Eyebrow } from "@/components/eyebrow";
import { SignupForm } from "@/components/signup-form";

export function FinalCta() {
  return (
    <section id="join" className="dark-section bg-dark py-16 text-foam md:py-20">
      <div className="mx-auto max-w-xl px-5">
        <Eyebrow className="text-mist">{finalCta.eyebrow}</Eyebrow>
        <h2 className="mt-4 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] tracking-[-0.03em] text-balance">
          {finalCta.headline}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-mist">{finalCta.subheadline}</p>
        <div className="mt-7">
          <SignupForm idPrefix="final" variant="dark" />
        </div>
      </div>
    </section>
  );
}
