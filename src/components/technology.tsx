import { technology } from "@/content/site";
import { Eyebrow } from "@/components/eyebrow";
import { Reveal } from "@/components/reveal";

export function Technology() {
  return (
    <section id="technology" className="dark-section bg-dark py-16 text-foam md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <Eyebrow className="text-mist">{technology.eyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-3xl font-serif text-[clamp(2rem,3.6vw,3.1rem)] leading-[1.05] tracking-[-0.03em] text-balance">
            {technology.headline}
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-mist">{technology.intro}</p>
        </Reveal>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {technology.points.map((point) => (
            <li key={point.title} className="bg-dark p-5">
              <h3 className="text-base">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{point.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
