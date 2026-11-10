import { faq } from "@/content/site";
import { Eyebrow } from "@/components/eyebrow";

export function Faq() {
  return (
    <section id="faq" className="pb-16 md:pb-20">
      <div className="mx-auto max-w-3xl px-5">
        <Eyebrow>{faq.eyebrow}</Eyebrow>
        <h2 className="mt-4 font-serif text-[clamp(2rem,3.6vw,3.1rem)] leading-[1.05] tracking-[-0.03em]">
          {faq.headline}
        </h2>
        <div className="mt-6 border-t border-line">
          {faq.items.map((item) => (
            <details key={item.question} className="group border-b border-line py-3.5">
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-lg">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="mt-1 text-muted transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-xl pt-4 leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
