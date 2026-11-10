import { statusItems } from "@/content/site";

export function StatusStrip() {
  return (
    <section aria-label="Development status" className="border-y border-line">
      <dl className="mx-auto grid max-w-6xl md:grid-cols-3">
        {statusItems.map((item) => (
          <div
            key={item.label}
            className="border-b border-line px-5 py-4 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:last:border-r-0"
          >
            <dt className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{item.label}</dt>
            <dd className="mt-1 text-base">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
