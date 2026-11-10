import { images, lifestyle } from "@/content/site";
import { Eyebrow } from "@/components/eyebrow";
import { Reveal } from "@/components/reveal";
import Image from "next/image";

export function Lifestyle() {
  return (
    <section id="everyday" className="py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 md:grid-cols-2 md:gap-14">
        <Reveal>
          <figure>
            <Image
              src={images.lifestyle.src}
              alt={images.lifestyle.alt}
              width={images.lifestyle.width}
              height={images.lifestyle.height}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[5/3] h-auto w-full rounded-3xl object-cover"
            />
          </figure>
        </Reveal>
        <Reveal delay={0.06}>
          <Eyebrow>{lifestyle.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-serif text-[clamp(2rem,3.6vw,3.1rem)] leading-[1.05] tracking-[-0.03em] text-balance">
            {lifestyle.headline}
          </h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
            {lifestyle.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
