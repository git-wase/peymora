import { brand } from "@/content/site";
import { isPlaceholderEmail } from "@/lib/config";
import { Resend } from "resend";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function shell(text: string, htmlBody: string) {
  return {
    text,
    html: `<!doctype html><html><body style="margin:0;padding:32px;background:#f3efe8;color:#1a1916;font-family:Georgia,serif;">
      <div style="max-width:520px;margin:0 auto;background:#f7f4ef;padding:32px;border:1px solid #ddd6cb;">
        <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.22em;">${escapeHtml(brand.name.toUpperCase())}</p>
        ${htmlBody}
      </div>
    </body></html>`,
  };
}

async function send(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
  unsubscribeUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) throw new Error("Email delivery is not configured.");
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    replyTo: isPlaceholderEmail(brand.contactEmail) ? undefined : brand.contactEmail,
    headers: {
      "List-Unsubscribe": `<${input.unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
  if (error) throw new Error(error.message);
}

export async function sendConfirmEmail(input: {
  to: string;
  confirmUrl: string;
  unsubscribeUrl: string;
}) {
  const text = [
    `Confirm your email to join the ${brand.name} early-access list.`,
    "",
    `${brand.name} is a smart dog collar in development. If you confirm, we will email you about product updates, development milestones, and launch information. We will not add you to unrelated marketing.`,
    "",
    `Confirm: ${input.confirmUrl}`,
    "",
    "If you did not ask for this, ignore the email. Unconfirmed addresses are deleted after 30 days.",
    "",
    `Unsubscribe: ${input.unsubscribeUrl}`,
  ].join("\n");
  const { html } = shell(
    text,
    `<h1 style="font-weight:400;font-size:32px;line-height:1.1;margin:0 0 16px;">Confirm your email.</h1>
     <p style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5;">You asked to hear about ${escapeHtml(brand.name)}, a smart dog collar in development. We will email product updates, milestones, and launch information. Nothing unrelated.</p>
     <p style="margin:28px 0;"><a href="${escapeHtml(input.confirmUrl)}" style="display:inline-block;background:#1a1916;color:#f7f4ef;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;padding:14px 22px;border-radius:999px;">Confirm email</a></p>
     <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#5e5952;">If you did not ask for this, ignore the email. Unconfirmed addresses are deleted after 30 days. <a href="${escapeHtml(input.unsubscribeUrl)}" style="color:#1a1916;">Unsubscribe</a>.</p>`,
  );
  await send({
    to: input.to,
    subject: `Confirm your ${brand.name} email`,
    text,
    html,
    unsubscribeUrl: input.unsubscribeUrl,
  });
}

export async function sendWelcomeEmail(input: { to: string; unsubscribeUrl: string }) {
  const text = [
    `You're on the ${brand.name} early-access list.`,
    "",
    "We'll write when there is something to say about development or launch. The collar is not for sale.",
    "",
    `Unsubscribe: ${input.unsubscribeUrl}`,
  ].join("\n");
  const { html } = shell(
    text,
    `<h1 style="font-weight:400;font-size:32px;line-height:1.1;margin:0 0 16px;">You're on the list.</h1>
     <p style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5;">We'll write when there is something to say about development or launch. The collar is not for sale.</p>
     <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#5e5952;"><a href="${escapeHtml(input.unsubscribeUrl)}" style="color:#1a1916;">Unsubscribe</a>.</p>`,
  );
  await send({
    to: input.to,
    subject: `You're on the ${brand.name} list`,
    text,
    html,
    unsubscribeUrl: input.unsubscribeUrl,
  });
}
