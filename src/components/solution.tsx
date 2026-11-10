import { solution } from "@/content/site";
import { Eyebrow } from "@/components/eyebrow";
import { Reveal } from "@/components/reveal";

export function Solution() {
  return (
    <section id="how-it-works" className="pb-16 md:pb-20">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <Eyebrow>{solution.eyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-3xl font-serif text-[clamp(2rem,3.6vw,3.1rem)] leading-[1.05] tracking-[-0.03em] text-balance">
            {solution.headline}
          </h2>
        </Reveal>
        <ol className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
          {solution.steps.map((step, index) => (
            <li key={step.number} className="bg-paper p-6 md:p-7">
              <Reveal delay={index * 0.06}>
                <p className="font-serif text-2xl tracking-tight text-muted">{step.number}</p>
                <h3 className="mt-4 text-lg">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">{solution.note}</p>
      </div>
    </section>
  );
}
