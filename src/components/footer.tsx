import { brand, disclosure, nav } from "@/content/site";
import { SectionLink } from "@/components/tracked-link";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-[0.8rem] font-medium tracking-[0.28em] uppercase">{brand.name}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{disclosure}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm md:items-end">
          {nav.map((item) => (
            <SectionLink key={item.href} href={item.href} className="text-muted hover:text-ink">
              {item.label}
            </SectionLink>
          ))}
          <SectionLink href="/#join" className="text-muted hover:text-ink">
            Early access
          </SectionLink>
          <Link href="/privacy" className="text-muted hover:text-ink">
            Privacy
          </Link>
          <a href={`mailto:${brand.contactEmail}`} className="text-muted hover:text-ink">
            {brand.contactEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}
