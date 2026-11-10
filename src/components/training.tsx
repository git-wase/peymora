import { training } from "@/content/site";
import { Eyebrow } from "@/components/eyebrow";
import { Seen } from "@/components/observe";
import { Reveal } from "@/components/reveal";

export function Training() {
  return (
    <Seen name="Training Section View">
      <section id="training" className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <Eyebrow>{training.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-3xl font-serif text-[clamp(2rem,3.6vw,3.1rem)] leading-[1.05] tracking-[-0.03em] text-balance">
              {training.headline}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{training.intro}</p>
          </Reveal>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {training.cards.map((card, index) => (
              <li key={card.title}>
                <Reveal delay={index * 0.06} className="h-full">
                  <article className="flex h-full flex-col rounded-3xl border border-line bg-foam p-6">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-4 font-serif text-2xl leading-tight tracking-tight">{card.title}</h3>
                    <p className="mt-4 leading-relaxed text-muted">{card.body}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted">{training.note}</p>
        </div>
      </section>
    </Seen>
  );
}
