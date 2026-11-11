# Vela

A prelaunch site for a smart dog collar in development. The job of the site is to explain the idea honestly and collect early-access emails. The collar is not for sale, and the page does not claim that detection, training results, safety certification, or a launch date already exist.

**Vela** is a temporary name. Change it in [`src/content/site.ts`](src/content/site.ts).

## Edit the site

- Copy, navigation, FAQ, and image paths live in `src/content/site.ts`.
- Replace the concept renders in `public/images/`. Keep the same filenames, or update the paths in `site.ts`. Captions on the page say these are concept images, not finished hardware.
- The contact address is `brand.contactEmail`. Replace `hello@example.com` before a public launch.

## Local development

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

`.env.local` turns on a file store at `data/subscribers.json`. That file is gitignored. Submissions are saved as **pending**. Because Resend is not configured, the form shows a development confirmation link instead of claiming an email was sent. Open that link and press **Confirm my email**.

## Production email collection

Use both of these. The form will not pretend a subscription succeeded if either one is missing.

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql).
3. In Project Settings → API, copy the project URL and the **service role** key.
4. Set these on the server only. Do not prefix the service role key with `NEXT_PUBLIC`.

```bash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Row level security is enabled and there is no public policy. The site talks to the table with the service role key from API routes.

### 2. Resend

1. Create an account at [resend.com](https://resend.com).
2. Verify the domain you will send from.
3. Create an API key.
4. Set:

```bash
RESEND_API_KEY=re_xxx
RESEND_FROM="Vela <updates@yourdomain.com>"
SITE_URL=https://yourdomain.com
```

`RESEND_FROM` must use a verified domain. `SITE_URL` is the public origin with no trailing slash. Confirmation and unsubscribe links are built from it.

### 3. Cloudflare Turnstile

1. Create a Turnstile widget for the public domain.
2. Set the site key and secret on the server:

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key
```

The form shows the check above the submit button and sends the token with the signup. The server verifies it before anything is saved. Production refuses signups when `TURNSTILE_SECRET_KEY` is missing. Local development with `USE_LOCAL_STORE=true` skips the check only when that secret is unset.

### What a signup does

1. The visitor submits an email and checks the consent box. Optional questions are not required.
2. The address is stored as `pending`, unless that email is already confirmed.
3. Resend sends one email with a confirmation link.
4. The link opens a page with a button. Opening the link does not subscribe anyone by itself, so mail scanners that only fetch the URL do not confirm the address.
5. After they confirm, status becomes `confirmed` and a short receipt is sent. That receipt is the same list, not a separate marketing program.
6. Every email includes an unsubscribe link and a one-click unsubscribe header for mail apps.
7. A daily job deletes `pending` rows older than 30 days.

Duplicate confirmed addresses are not subscribed twice. Someone who unsubscribed can join again, and must confirm again.

### Export

Only email people whose status is `confirmed`.

```bash
curl -H "Authorization: Bearer $ADMIN_EXPORT_SECRET" \
  https://yourdomain.com/api/export \
  -o vela-subscribers.csv
```

The file includes status, optional answers, message variant, and campaign tags. It does not include confirmation tokens.

Set `ADMIN_EXPORT_SECRET` to a long random string. The secret is sent as a header, not in the URL.

### Cleanup

Set `CRON_SECRET` to a long random string. On Vercel, [`vercel.json`](vercel.json) calls `/api/cron/cleanup` every day at 09:00 UTC. Vercel sends `Authorization: Bearer $CRON_SECRET` when that variable exists.

You can run it yourself:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://yourdomain.com/api/cron/cleanup
```

The local file store is refused on Vercel. The filesystem there is not durable.

## Deploy on Vercel

1. Push the project to a Git host and import it in Vercel.
2. Set the environment variables from [`.env.example`](.env.example). Do not set `USE_LOCAL_STORE` in production.
3. Deploy.
4. In the Vercel project, enable Web Analytics. The site already includes `@vercel/analytics`.
5. Optional: add the domain to [Plausible](https://plausible.io) and set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. Leave the script URL at the manual tagged-events script so page views can carry the message variant.

`SITE_URL` should be the public domain. It is also used for the canonical URL, sitemap, and social preview.

## Measuring interest

The number that matters is confirmed emails divided by unique visitors.

- Confirmed emails: count CSV rows with status `confirmed`, or `select count(*) from subscribers where status = 'confirmed'`.
- Visitors: Plausible or Vercel Web Analytics.
- Submitted-but-not-confirmed is a separate number. The `Email Signup` event fires when the form returns, including people who never confirm. `Email Confirmed` fires on the confirmation page.

Campaign tags on the link are stored with the subscriber: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term`. Plausible also reads those from the URL.

To compare messages, send people to:

- `/?m=yard`
- `/?m=cues`
- `/` for the default subheadline

The headline stays the same. The subheadline changes. Plausible page views include a `message` property. The CSV column is `message_variant`.

Events, when Plausible is configured:

- `CTA Click` with `location` (`nav`, `hero`, `how-it-works`, `signup`, `final`)
- `Email Signup` with status, message, dog size, dig frequency, and methods
- `Training Section View`
- `Email Confirmed`

Optional answers are also on the subscriber row. They are not required to join.

## Spam protection

The form uses a hidden field, a very short minimum time, and per-network and per-address rate limits. Double opt-in is the main filter. Rate limits are in memory, so on Vercel they apply per running instance. Put a firewall in front of the site if the form is abused.

## Analytics and privacy

Plausible, when configured, is loaded without cookies. Vercel Web Analytics is included for the hosted project. Neither event includes the email address. The privacy page describes this. There is no advertising tracker and no cookie banner, because these tools are not being used to profile people. If counsel wants a banner anyway, add one before launch.

Do not publish testimonials, customer counts, preorder numbers, or reviews. The product has no customers yet.
