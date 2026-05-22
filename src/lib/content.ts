export const BOOK_CALL_URL = "/book";
export const TALLY_FORM_URL = "https://tally.so/r/XxegxV";
export const YOUTUBE_VIDEO_ID = "jgdmsjppcio";

export const services = [
  {
    title: "Revenue Infrastructure",
    description:
      "End-to-end sales architecture from lead capture to close.",
    icon: "revenue",
  },
  {
    title: "Offer & Positioning Strategy",
    description:
      "Refining your offer, pricing, and positioning to attract high-quality buyers.",
    icon: "offer",
  },
  {
    title: "Pipeline Systems",
    description:
      "Structured pipeline workflows, stages, and follow-up systems that keep deals moving.",
    icon: "pipeline",
  },
  {
    title: "Performance Management",
    description:
      "Clear KPIs, reporting systems, and accountability frameworks.",
    icon: "performance",
  },
  {
    title: "Scale Strategy",
    description:
      "Systems for capacity planning, team expansion, and handling increased volume.",
    icon: "scale",
  },
  {
    title: "Sales Team Buildout",
    description:
      "Recruiting, onboarding, and structuring setters and closers.",
    icon: "team",
  },
  {
    title: "Automation Stack",
    description:
      "Integrated systems that eliminate manual bottlenecks and increase efficiency.",
    icon: "automation",
  },
  {
    title: "Sales Process Framework",
    description:
      "Proven call structures, scripts, and objection-handling systems.",
    icon: "process",
  },
] as const;

export const partnerships = [
  {
    id: "build-manage",
    tabLabel: "Build + Manage",
    title: "Build + Manage",
    summary:
      "We design, implement, and take ownership of your revenue systems, then stay on to manage, optimise, and scale them over time.",
    theme: "blue" as const,
    sections: [
      {
        heading: "How it works:",
        body: "An upfront implementation phase to build your full sales infrastructure, followed by ongoing management and optimisation on a fixed monthly retainer.",
      },
      {
        heading: "What's Included:",
        body: "End-to-end system build (CRM, pipeline, automation) · Sales process design and team structure · Ongoing performance tracking, optimisation, and support",
      },
      {
        heading: "Best Suited For:",
        body: "High-ticket businesses looking for a hands-on partner to build and run a scalable sales operation.",
      },
    ],
  },
  {
    id: "revenue-partnership",
    tabLabel: "Revenue Partnership",
    title: "Revenue Partnership",
    summary:
      "We partner on performance: building and scaling your revenue engine in exchange for a share of the revenue it generates.",
    theme: "frost" as const,
    sections: [
      {
        heading: "How it works:",
        body: "We design and implement your core sales systems, then stay embedded to run and optimise them, aligned to the revenue they produce rather than a fixed fee alone.",
      },
      {
        heading: "What's Included:",
        body: "Full system design and implementation · Sales team structure and oversight · Ongoing optimisation tied to revenue performance",
      },
      {
        heading: "Best Suited For:",
        body: "Coaching, education, and digital product businesses with strong margins and scalable offers.",
      },
    ],
  },
] as const;

export const team = [
  {
    name: "Daniel Barnard",
    role: "Founder & Operations Manager",
    bio: "Creative professional with a background in design, marketing, and sales. Now specialising in growth operations.",
    image: "/team/daniel.png",
    socials: [
      {
        type: "linkedin",
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/danielbarnardux",
      },
      {
        type: "instagram",
        label: "Instagram",
        url: "https://www.instagram.com/danbarnardx",
      },
      {
        type: "facebook",
        label: "Facebook",
        url: "https://www.facebook.com/danzie.bee",
      },
    ],
  },
  {
    name: "James Rice",
    role: "Sales Manager",
    bio: "A killer blend of experience in real estate, high-ticket sales, and live events. Driving premium revenue growth.",
    image: "/team/james.png",
    socials: [
      {
        type: "instagram",
        label: "Instagram",
        url: "https://www.instagram.com/james.ops_",
      },
    ],
  },
] as const;
