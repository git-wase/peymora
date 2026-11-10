import { signup } from "@/content/site";
import { Eyebrow } from "@/components/eyebrow";
import { SignupForm } from "@/components/signup-form";

export function SignupSection() {
  return (
    <section id="early-access" className="py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl items-start gap-8 px-5 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow>{signup.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-serif text-[clamp(2rem,3.6vw,3.1rem)] leading-[1.05] tracking-[-0.03em] text-balance">
            {signup.headline}
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{signup.subheadline}</p>
        </div>
        <SignupForm idPrefix="early" />
      </div>
    </section>
  );
}
