import type { Metadata } from "next";
import { brand } from "@/content/site";
import { Eyebrow } from "@/components/eyebrow";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${brand.name} handles early-access emails and site measurement.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="content" className="mx-auto w-full max-w-2xl px-5 py-32">
      <Eyebrow>Privacy</Eyebrow>
      <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight">Privacy policy</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        {brand.legalName} runs this site to explain a collar that is still in development and to
        collect interest from people who want updates. This page describes what that collection
        involves. It is not a substitute for legal advice.
      </p>

      <div className="mt-14 space-y-12 text-base leading-relaxed text-muted">
        <section>
          <h2 className="font-serif text-3xl tracking-tight text-ink">What we collect</h2>
          <p className="mt-4">
            The early-access form asks for an email address. That is the only required field. You
            can also tell us, if you want to, your dog&apos;s size, how often your dog digs, and
            which training cues you would consider. We store the page variant and campaign tags
            from the link that brought you here, and the referring site, so we can see which
            messages create interest.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl tracking-tight text-ink">How we use it</h2>
          <p className="mt-4">
            We use the address to send product updates, development milestones, and launch
            information about {brand.name}. We do not add it to unrelated marketing. We use the
            optional answers to understand who the collar might be for. Joining the list is not an
            order and does not reserve a product.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl tracking-tight text-ink">Confirmation and retention</h2>
          <p className="mt-4">
            We send one email asking you to confirm the address. You are subscribed only after you
            confirm. If you do not confirm, we delete the address after 30 days. After you confirm,
            we send a short note that you are on the list, with a way to leave.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl tracking-tight text-ink">Unsubscribe and deletion</h2>
          <p className="mt-4">
            Every email includes an unsubscribe link. You can also use the unsubscribe control in
            your mail app. If you unsubscribe, we keep the address only so we do not email you
            again. To ask for deletion, write to{" "}
            <a className="text-ink underline underline-offset-4" href={`mailto:${brand.contactEmail}`}>
              {brand.contactEmail}
            </a>
            .
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl tracking-tight text-ink">Who can see the list</h2>
          <p className="mt-4">
            Subscriber records are stored in a private database, or, during local development, in a
            file on the machine running the site. Email is sent through Resend when that service is
            configured. We do not sell the list. A protected export lets the site owner download it
            as a spreadsheet. That export is not public.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl tracking-tight text-ink">Bot check</h2>
          <p className="mt-4">
            The signup form uses Cloudflare Turnstile before an address is saved. It asks the
            browser to complete a check so automated submissions are rejected. That check is not
            used to build an advertising profile, and it is not stored with the subscriber record.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl tracking-tight text-ink">Measurement</h2>
          <p className="mt-4">
            When the site owner turns them on, the site may load Plausible and Vercel Web Analytics.
            They count visitors and record events such as a call-to-action click or a signup,
            including optional answers like dog size. Those events do not include your email
            address. They are used to see which messages and sections draw interest, not to build an
            advertising profile. Until those tools are configured, they are not loaded.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl tracking-tight text-ink">Images</h2>
          <p className="mt-4">
            Pictures on this site are concept renders and concept scenes. They are not photographs
            of finished hardware, customers, or test results.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-3xl tracking-tight text-ink">Contact</h2>
          <p className="mt-4">
            Questions about this policy go to{" "}
            <a className="text-ink underline underline-offset-4" href={`mailto:${brand.contactEmail}`}>
              {brand.contactEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
