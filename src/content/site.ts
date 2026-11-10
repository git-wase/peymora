/**
 * Edit this file to change the brand, copy, and image paths.
 * A short brand name works best in the navigation wordmark.
 */

export const brand = {
  name: "Vela",
  legalName: "Vela",
  /** Replace before launch. Shown in the footer, privacy page, and email reply-to. */
  contactEmail: "hello@example.com",
  description:
    "Vela is a temporary name for a smart dog collar in development. It is meant to recognize digging and respond with a training cue the owner has allowed.",
};

export const hero = {
  eyebrow: "In development",
  headline: "Less Digging. More Peace of Mind.",
  subheadline:
    "Meet the smart collar being developed to recognize digging behavior and respond automatically, with training cues you control.",
  primaryCta: "Join the Early Access List",
  secondaryCta: "See How It Works",
};

/** Alternate subheadlines for message tests. Visit /?m=yard or /?m=cues. */
export const messageVariants = [
  {
    id: "yard",
    subheadline:
      "A collar in development for the holes that appear when you are not in the yard.",
  },
  {
    id: "cues",
    subheadline:
      "Training cues you choose, ready for the moment you are not there to step in.",
  },
] as const;

export const images = {
  hero: {
    src: "/images/collar.jpg",
    width: 1280,
    height: 720,
    alt: "Concept render of a charcoal woven collar with a small matte-black module.",
  },
  garden: {
    src: "/images/yard-hole.jpg",
    width: 1000,
    height: 668,
    alt: "A golden retriever lying in a dug hole, head down in the dirt of a grassy yard.",
  },
  lifestyle: {
    src: "/images/lifestyle-yard.jpg",
    width: 1280,
    height: 720,
    alt: "Concept image of a dog standing in a backyard, wearing a slim collar. The collar is not finished hardware.",
  },
  dark: {
    src: "/images/collar-dark.jpg",
    width: 1280,
    height: 720,
    alt: "Concept render of the collar on a black background.",
  },
} as const;

export const statusItems = [
  { label: "Status", value: "In development" },
  { label: "For sale", value: "Not yet" },
  { label: "Launch date", value: "Not set" },
] as const;

export const problem = {
  eyebrow: "The problem",
  headline: "Your Dog Doesn't Wait Until You're Watching.",
  paragraphs: [
    "Digging usually starts when nobody is there. Vela is being built for those moments: a collar that reads movement and is answered with a corrective behavior cue you already chose.",
  ],
  note: "It will not replace supervision, a secure yard, or advice from a veterinarian or a qualified behavior professional. A collar is not a diagnosis.",
};

export const solution = {
  eyebrow: "The system",
  headline: "A Smarter Way to Address Digging.",
  steps: [
    {
      number: "01",
      title: "Detect",
      body: "Onboard motion sensors observe movement patterns associated with digging.",
    },
    {
      number: "02",
      title: "Recognize",
      body: "Machine-learning algorithms analyze those patterns to identify potential digging behavior.",
    },
    {
      number: "03",
      title: "Respond",
      body: "The collar delivers the owner's selected training cue when appropriate.",
    },
  ],
  note: "Detection and recognition are still being developed and validated. False detections are an open problem, not a solved one.",
};

export const training = {
  eyebrow: "Cues",
  headline: "Your Dog. Your Training Preferences.",
  intro: "You choose which cues are available.",
  cards: [
    {
      eyebrow: "Sound",
      title: "Audible Cue",
      body: "A simple sound designed to interrupt unwanted behavior.",
    },
    {
      eyebrow: "Touch",
      title: "Vibration Cue",
      body: "A configurable vibration provides another training option.",
    },
    {
      eyebrow: "Optional",
      title: "Optional Electrical Stimulation",
      body: "An additional owner-controlled option for those comfortable with it, subject to appropriate safety controls and product validation.",
    },
  ],
  note: "Electrical stimulation, if included, stays off until an owner enables it. It is not described as painless, harmless, or right for every dog.",
};

export const technology = {
  eyebrow: "Engineering",
  headline: "Intelligence Built Into Every Movement.",
  intro: "A small wearable that reads motion on the dog, then acts only within limits you set.",
  points: [
    {
      title: "Motion sensing",
      body: "Posture and the short, repeated movements associated with digging.",
    },
    {
      title: "Behavior recognition",
      body: "A model, still being trained, meant to separate those patterns from ordinary movement.",
    },
    {
      title: "On-device processing",
      body: "Recognition on the collar, without someone watching a screen.",
    },
    {
      title: "Configurable responses",
      body: "Sound, vibration, and electrical stimulation only if an owner turns it on.",
    },
    {
      title: "Compact electronics",
      body: "A low-profile module on a collar.",
    },
  ],
};

export const lifestyle = {
  eyebrow: "Everyday",
  headline: "There When You Are Not.",
  paragraphs: [
    "Choose the cues you are comfortable with. The collar is meant for the days you cannot stand and watch.",
  ],
};

export const signup = {
  eyebrow: "Early access",
  headline: "Be First to Know.",
  subheadline:
    "We're developing a smarter approach to digging prevention. Join our early-access list for product updates, development milestones, and launch information.",
  emailLabel: "Email address",
  button: "Join the Early Access List",
  optionalTitle: "Optional questions",
  optionalNote:
    "Help us understand who this is for. You can join with an email alone.",
  consent:
    "Email me about Vela's development and launch. I can unsubscribe at any time. This list is only for those updates.",
  finePrint:
    "We send one email to confirm your address. You are added only after you confirm. Unconfirmed addresses are deleted after 30 days.",
};

export const dogSizes = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
] as const;

export const digFrequencies = [
  { value: "occasionally", label: "Occasionally" },
  { value: "frequently", label: "Frequently" },
  { value: "daily", label: "Daily" },
] as const;

export const correctionMethods = [
  { value: "audible", label: "Audible" },
  { value: "vibration", label: "Vibration" },
  { value: "electrical", label: "Electrical stimulation" },
  { value: "unsure", label: "Unsure" },
] as const;

export const finalCta = {
  eyebrow: "Early access",
  headline: "Smarter Training Starts Here.",
  subheadline: "Help shape the future of intelligent dog training.",
};

export const faq = {
  eyebrow: "Questions",
  headline: "Plain answers.",
  items: [
    {
      question: "How does the collar recognize digging?",
      answer:
        "Motion sensors would capture how a dog moves. A model in development would look for digging patterns. Early indications show a strong correlation between digging behavior and successful detection.",
    },
    {
      question: "Does the collar require an owner to activate it?",
      answer:
        "A response is meant to happen without a button press in the moment. You would still choose, ahead of time, which cues are allowed.",
    },
    {
      question: "What types of corrections are planned?",
      answer:
        "An audible cue, a vibration cue, and optional electrical stimulation an owner would have to turn on. Effectiveness has not been established.",
    },
    {
      question: "Is electrical stimulation required?",
      answer:
        "No. It stays off unless you enable it. Sound, vibration, or neither are equally valid. It is not described as painless or harmless.",
    },
    {
      question: "How will false detections be handled?",
      answer:
        "False detections are an open problem. The collar is not claimed to already tell digging apart from play, scratching, or rolling.",
    },
    {
      question: "Is the collar available for purchase?",
      answer:
        "No. Vela is in development and is not for sale. Joining the list is not an order.",
    },
    {
      question: "When will the product launch?",
      answer: "There is no launch date. The list is how you hear if that changes.",
    },
    {
      question: "Can I join a beta test?",
      answer:
        "Yes. We are looking for owners who will collect motion data while their dog wears the collar. Dogs of different sizes and breeds will help validate the collar and the model.",
    },
  ],
};

export const disclosure =
  "Vela is a working name. The collar is in development and is not for sale. Concept imagery is not finished hardware. Nothing here is veterinary or behavioral advice, and the collar is not a substitute for supervision.";

export const nav = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#training", label: "Training" },
] as const;

export function subheadlineFor(message: string | null | undefined) {
  const match = messageVariants.find((variant) => variant.id === message);
  return match?.subheadline ?? hero.subheadline;
}

export function isKnownMessage(message: string | null | undefined) {
  return messageVariants.some((variant) => variant.id === message);
}
