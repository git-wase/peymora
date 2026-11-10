import { images, problem } from "@/content/site";
import { Eyebrow } from "@/components/eyebrow";
import { Reveal } from "@/components/reveal";
import Image from "next/image";

export function Problem() {
  return (
    <section id="problem" className="py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 md:grid-cols-2 md:gap-14">
        <Reveal>
          <Eyebrow>{problem.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-serif text-[clamp(2rem,3.6vw,3.1rem)] leading-[1.05] tracking-[-0.03em] text-balance">
            {problem.headline}
          </h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
            {problem.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted">{problem.note}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <figure>
            <Image
              src={images.garden.src}
              alt={images.garden.alt}
              width={images.garden.width}
              height={images.garden.height}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[3/2] h-auto w-full rounded-3xl object-cover"
            />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
