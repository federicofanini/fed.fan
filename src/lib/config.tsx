import { Icons } from "@/components/icons";
import {
  AudioLines,
  BrainIcon,
  CodeIcon,
  Dumbbell,
  GlobeIcon,
  Handshake,
  Loader,
  PlugIcon,
  SmilePlus,
  Timer,
  UsersIcon,
  ZapIcon,
} from "lucide-react";

export const BLUR_FADE_DELAY = 0.15;

export const USERS_DISCOUNT_LIMIT = 30;

export const siteConfig = {
  name: "fed.fan",
  description:
    "Redefines personal branding. It’s where the builders of tomorrow turn connections into collaborations. This isn’t just another profile—it’s your story, and the world is watching.",
  cta: "Start now",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  keywords: [
    "personal branding",
    "personal website",
    "personal website builder",
    "link in bio",
    "linktree alternative",
    "beacons.ai alternative",
    "backlink your startup",
    "backlink your business",
    "backlink your product",
    "backlink your service",
    "backlink your project",
    "backlink your idea",
    "cv builder",
    "resume builder",
  ],
  links: {
    email: "hello@fed.fan",
    twitter: "https://twitter.com/fedfan",
    discord: "https://discord.gg/fedfan",
    github: "https://github.com/fedfan",
    instagram: "https://instagram.com/fedfan",
  },
  hero: {
    title: "Redefines personal branding",
    description:
      "builders of tomorrow turn connections into collaborations. This isn’t just another profile — it’s your story, and the world is watching.",
    cta: "Start now",
    ctaDescription: "10+ founders are showing up",
  },
  features: [
    {
      name: "Fitness Tracking",
      description: (
        <span>
          Track your{" "}
          <span className="font-semibold text-primary">workouts</span>, set{" "}
          <span className="font-semibold text-primary">goals</span>, and monitor
          your <span className="font-semibold text-primary">progress</span>{" "}
          across multiple metrics — whether it&apos;s{" "}
          <span className="font-semibold text-primary">strength</span>,{" "}
          <span className="font-semibold text-primary">endurance</span>, or
          overall fitness.
        </span>
      ),
      icon: <AudioLines className="h-6 w-6" />,
    },
    {
      name: "Progress Insights",
      description: (
        <span>
          Set{" "}
          <span className="font-semibold text-primary">
            personalized fitness goals
          </span>{" "}
          and get insights into your performance. Celebrate{" "}
          <span className="font-semibold text-primary">milestones</span> in your
          fitness journey to stay{" "}
          <span className="font-semibold text-primary">motivated</span> and on
          track.
        </span>
      ),
      icon: <Loader className="h-6 w-6" />,
    },
    {
      name: "Customizable Workouts",
      description: (
        <span>
          Create your own{" "}
          <span className="font-semibold text-primary">workouts</span>, follow
          predefined{" "}
          <span className="font-semibold text-primary">fitness plans</span>, or
          customize routines to fit your needs. Adapts to your{" "}
          <span className="font-semibold text-primary">
            personal fitness level
          </span>{" "}
          and evolves with your goals.
        </span>
      ),
      icon: <Dumbbell className="h-6 w-6" />,
    },
    {
      name: "Real-Time Accountability",
      description: (
        <span>
          Stay <span className="font-semibold text-primary">accountable</span>{" "}
          to your fitness goals with regular{" "}
          <span className="font-semibold text-primary">updates</span>,
          <span className="font-semibold text-primary">reminders</span>, and{" "}
          <span className="font-semibold text-primary">progress tracking</span>.
          Gymbrah ensures you&apos;re always moving forward with encouragement
          at every step.
        </span>
      ),
      icon: <Timer className="h-6 w-6" />,
    },
    {
      name: "Community Support",
      description: (
        <span>
          Connect with{" "}
          <span className="font-semibold text-primary">
            like-minded individuals
          </span>{" "}
          in the Gymbrah community. Share your progress,{" "}
          <span className="font-semibold text-primary">cheer on others</span>,
          and get inspired to push harder as you grow alongside a{" "}
          <span className="font-semibold text-primary">supportive network</span>
          .
        </span>
      ),
      icon: <Handshake className="h-6 w-6" />,
    },
    {
      name: "Community Driven",
      description: (
        <span>
          Gymbrah is built with{" "}
          <span className="font-semibold text-primary">transparency</span> in
          mind. Share your experience with the growing{" "}
          <span className="font-semibold text-primary">Gymbrah community</span>.
        </span>
      ),
      icon: <SmilePlus className="h-6 w-6" />,
    },
  ],
  pricing: [
    {
      id: "prod_6r8TMIsqelGNJRyHw6lV6X", // test mode prod_3Ig5H7S7MJsXE6nTYlzcAu
      name: "Monthly",
      price_anchor: "$9",
      price: { monthly: "$9", yearly: "$5" },
      frequency: { monthly: "month", yearly: "month" },
      description: "Perfect for testing your website before launching it.",
      features: [
        "Link in bio",
        "Project section",
        "Skills section",
        "Education section",
        "Stack section",
        "24/7 support",
        "Lifetime updates",
      ],
      cta: "Launch your website",
    },
    {
      id: "prod_1yBt3p2qkG3Z9sREp6PsH8",
      name: "Lifetime",
      price_anchor: "$59",
      price: { monthly: "$29", yearly: "$29" },
      frequency: { monthly: "month", yearly: "lifetime" },
      description: "Ideal for professionals and growing businesses.",
      features: ["All in monthly plan", "Pay once, your forever"],
      popular: true,
      cta: "Launch your website",
    },
    {
      id: "prod_1V9nuXXP2y2gGCHKaOP4vW",
      name: "Source Code",
      price_anchor: "$199",
      price: { monthly: "$999", yearly: "$99" },
      frequency: { monthly: "month", yearly: "lifetime" },
      description: "Tailored solutions for self-hosted websites.",
      features: [
        "All in other plans",
        "Access to source code",
        "Totally customizable",
        "Lifetime updates",
      ],
      cta: "Deploy your website",
    },
  ],
  footer: {
    socialLinks: [
      {
        icon: <Icons.twitter className="size-4" />,
        url: "https://x.com/FedericoFan",
      },
    ],
    links: [
      { text: "Terms", url: "/terms" },
      { text: "Privacy", url: "/privacy" },
    ],
    bottomText: "All rights reserved.",
    brandText: "fed.fan",
  },

  testimonials: [
    {
      id: 1,
      text: "The AI Agent SDK has revolutionized how we build intelligent systems. It's incredibly intuitive and powerful.",
      name: "Alice Johnson",
      company: "OpenMind Labs",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 2,
      text: "We've significantly reduced development time for our AI projects using this SDK. The multi-agent feature is a game-changer.",
      name: "Bob Brown",
      company: "NeuralForge",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 3,
      text: "The cross-language support allowed us to seamlessly integrate AI agents into our existing tech stack.",
      name: "Charlie Davis",
      company: "CodeHarbor",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 4,
      text: "The AI Agent SDK's tool integration feature has streamlined our workflow automation processes.",
      name: "Diana Evans",
      company: "AutomateX",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 5,
      text: "The customizable agent behaviors have allowed us to create highly specialized AI solutions for our clients.",
      name: "Ethan Ford",
      company: "AICore",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 6,
      text: "The AI Agent SDK's efficiency features have significantly improved our system's performance and scalability.",
      name: "Fiona Grant",
      company: "ScaleAI",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 7,
      text: "The SDK's intuitive APIs have made it easy for our team to quickly prototype and deploy AI agent systems.",
      name: "George Harris",
      company: "RapidAI",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 8,
      text: "The AI Agent SDK's multi-agent system has enabled us to build complex, collaborative AI solutions with ease.",
      name: "Hannah Irving",
      company: "CollabAI",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 9,
      text: "The SDK's flexibility in integrating external tools has expanded our AI agents' capabilities tremendously.",
      name: "Ian Johnson",
      company: "FlexAI",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 10,
      text: "The AI Agent SDK's documentation and support have made our learning curve much smoother.",
      name: "Julia Kim",
      company: "DevAI",
      image:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 11,
      text: "We've seen a significant boost in our AI's decision-making capabilities thanks to the AI Agent SDK.",
      name: "Kevin Lee",
      company: "DecisionTech",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 12,
      text: "The SDK's multi-agent system has revolutionized our approach to complex problem-solving.",
      name: "Laura Martinez",
      company: "SolveX",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzZ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 13,
      text: "The customization options in the AI Agent SDK have allowed us to create truly unique AI solutions.",
      name: "Michael Chen",
      company: "UniqueAI",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 14,
      text: "The efficiency of the AI Agent SDK has significantly reduced our development time and costs.",
      name: "Natalie Wong",
      company: "FastTrackAI",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODh8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 15,
      text: "The cross-language support has made it easy for our diverse team to collaborate on AI projects.",
      name: "Oliver Smith",
      company: "GlobalAI",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
  ],
};

export type SiteConfig = typeof siteConfig;
