export const signupStatuses = [
  "check_email",
  "already_confirmed",
  "saved_without_email",
  "not_configured",
  "email_not_configured",
  "email_failed",
  "invalid_email",
  "consent_required",
  "rate_limited",
  "stale_form",
  "captcha_required",
  "captcha_unconfigured",
  "error",
] as const;

export type SignupStatus = (typeof signupStatuses)[number];

export const signupCopy: Record<
  SignupStatus,
  { tone: "ok" | "warn" | "error"; title: string; body: string }
> = {
  check_email: {
    tone: "ok",
    title: "Check your email.",
    body: "We sent a link to confirm your address. You are added to the early-access list only after you confirm. If it is not in your inbox, look in spam.",
  },
  already_confirmed: {
    tone: "ok",
    title: "You're already on the list.",
    body: "This email is confirmed. We did not create a second subscription.",
  },
  saved_without_email: {
    tone: "warn",
    title: "Saved here as pending. No email was sent.",
    body: "Email delivery is not configured, so we could not send a confirmation message. You are not on the mailing list until you confirm.",
  },
  not_configured: {
    tone: "error",
    title: "Signups are not being stored yet.",
    body: "The database is not connected. Nothing was saved. Add Supabase credentials, or enable the local development store, then try again.",
  },
  email_not_configured: {
    tone: "error",
    title: "Confirmation email is not set up.",
    body: "We did not save this address, because we cannot complete double opt-in without email delivery. Nothing was subscribed.",
  },
  email_failed: {
    tone: "error",
    title: "We could not send the confirmation email.",
    body: "You are not subscribed yet. Please try again in a little while.",
  },
  invalid_email: {
    tone: "error",
    title: "That email does not look valid.",
    body: "Check the address and try again. Nothing was saved.",
  },
  consent_required: {
    tone: "error",
    title: "Consent is required.",
    body: "Check the box to agree to early-access emails. We will not subscribe you without it.",
  },
  rate_limited: {
    tone: "error",
    title: "Too many attempts.",
    body: "Please wait a while, then try again. Nothing new was saved.",
  },
  stale_form: {
    tone: "error",
    title: "This page has been open for a while.",
    body: "Refresh it, then submit again. Nothing was saved.",
  },
  captcha_required: {
    tone: "error",
    title: "Complete the check above the button.",
    body: "That confirms a person is sending the form. Nothing was saved.",
  },
  captcha_unconfigured: {
    tone: "error",
    title: "The bot check is not set up.",
    body: "Signups are paused until that check is configured. Nothing was saved.",
  },
  error: {
    tone: "error",
    title: "Something went wrong.",
    body: "Nothing was saved. Please try again.",
  },
};

export function isSignupStatus(value: string | undefined): value is SignupStatus {
  return signupStatuses.some((status) => status === value);
}

export function statusCode(status: SignupStatus) {
  switch (status) {
    case "check_email":
    case "already_confirmed":
    case "saved_without_email":
      return 200;
    case "invalid_email":
    case "consent_required":
    case "stale_form":
    case "captcha_required":
      return 400;
    case "captcha_unconfigured":
      return 503;
    case "rate_limited":
      return 429;
    case "email_failed":
      return 502;
    case "not_configured":
    case "email_not_configured":
      return 503;
    default:
      return 500;
  }
}
