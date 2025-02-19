import { AuroraText } from "@/components/aurora-text";
import { Section } from "@/components/section";
import { siteConfig, USERS_DISCOUNT_LIMIT } from "@/lib/config";
import Link from "next/link";
import OutlinedButton from "../ui/outlined-button";
import AvatarCircles from "../ui/avatar-circles";
import { Check, Gift } from "lucide-react";
import Image from "next/image";
import { DomainRating } from "./domain-rating";
import { GymbrahSponsor } from "./gymbrah-sponsor";

const getAvatarUrls = () => {
  const mockAvatars = [
    {
      imageUrl:
        "https://lh3.googleusercontent.com/a/ACg8ocK6l_e9CYaL93GQ294stuNDLrXlssOAy2-Bhj2vgMq3P1WIKlA=s96-c",
      profileUrl: "/federicofan",
    },
    {
      imageUrl:
        "https://lh3.googleusercontent.com/a/ACg8ocLi0vyVjWUjMK2c13ijA6oJsSHIVRL6bO_F4SeDC2Py0BUlcrc=s96-c",
      profileUrl: "/pontus",
    },
    {
      imageUrl: "https://avatars.githubusercontent.com/u/16581151?v=4",
      profileUrl: "/thomas",
    },
    {
      imageUrl: "/jupytergas.jpeg",
      profileUrl: "/jupytergas",
    },
    {
      imageUrl:
        "https://lh3.googleusercontent.com/a/ACg8ocKYuLPFQuXYRGgMOHysI4j5bZkNJshUHuDAePc38r_tGRmoVu34=s96-c",
      profileUrl: "/steellgold",
    },
    {
      imageUrl:
        "https://lh3.googleusercontent.com/a/ACg8ocLqoRn7LrTzJ_HjVtrGCtb59sMfs0eRkYvK3PpbfHYUeTivMVA=s96-c",
      profileUrl: "/jonas",
    },
    {
      imageUrl:
        "https://lh3.googleusercontent.com/a/ACg8ocIzO9qLXZIe93WNrDsbQ2rPqxn8A3cUlpswZEmp_kyxIvTW-tNA=s96-c",
      profileUrl: "/sebastianjanas",
    },
  ];

  return mockAvatars;
};

function HeroPill() {
  return (
    <Link
      href="#"
      className="flex items-center space-x-2 border border-secondary rounded-full px-4 py-1"
    >
      <p className="text-xs font-mono text-primary">Introducing GymBrah</p>
      <svg
        width="12"
        height="12"
        className="ml-1"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.78141 5.33312L5.20541 1.75712L6.14808 0.814453L11.3334 5.99979L6.14808 11.1851L5.20541 10.2425L8.78141 6.66645H0.666748V5.33312H8.78141Z"
          fill="hsl(var(--primary))"
        />
      </svg>
    </Link>
  );
}

function HeroTitles() {
  return (
    <div className="flex w-full max-w-3xl flex-col overflow-hidden pt-8 text-center">
      <h1 className="text-center text-4xl font-semibold leading-tighter text-foreground sm:text-4xl md:text-5xl tracking-tighter mb-8">
        <span className="inline-block text-balance">
          <AuroraText className="leading-normal">
            Build your brand. <br />
            Connect with your network.
          </AuroraText>
        </span>
      </h1>
      <ul className="flex flex-col gap-2 text-muted-foreground max-w-lg mx-auto sm:text-lg sm:leading-normal text-balance">
        <li className="flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          <span>
            <span className="font-semibold text-primary ">Build</span> a
            standout profile
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          <span>
            <span className="font-semibold text-primary ">Grow</span> your
            fanbase
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          <span>
            <span className="font-semibold text-primary ">Share</span> your
            journey
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          <span>
            <span className="font-semibold text-primary ">Create</span>{" "}
            meaningful connections
          </span>
        </li>
      </ul>
    </div>
  );
}

async function HeroCTA({ count }: { count: number }) {
  return (
    <div className="relative mt-6">
      <div className="flex w-full max-w-2xl flex-col items-center justify-center space-y-4 sm:flex-row  sm:space-y-0">
        <Link href="/login" className="text-sm text-secondary underline">
          <OutlinedButton>
            Build your{" "}
            <span className="font-semibold text-black underline underline-offset-2 decoration-wavy decoration-cyan-500">
              FREE
            </span>{" "}
            profile
          </OutlinedButton>
        </Link>
      </div>
      <p className="mt-8 text-sm text-muted-foreground text-center font-mono">
        Join
        <span className="font-semibold text-primary"> {count}</span> amazing
        people
      </p>
    </div>
  );
}

async function Avatars({ count }: { count: number }) {
  const avatarUrls = await getAvatarUrls();
  return (
    <div className="mt-4 flex flex-col items-center justify-center">
      <AvatarCircles numPeople={count} avatarUrls={avatarUrls} />
    </div>
  );
}

// <br />
// Get{" "}
// span className="font-semibold text-primary">
//  lifetime access for $49
// </span>*/}
// . <br />
// <br />

function UsernameInput() {
  return (
    <div className="relative mt-8 w-full max-w-xs mx-auto">
      <p className="text-sm text-muted-foreground font-mono mb-1">
        Choose your username:
      </p>
      <div className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-card/50">
        <div className="flex-shrink-0 text-sm text-muted-foreground font-mono">
          fed.fan/
        </div>
        <input
          type="text"
          placeholder="username"
          className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 focus:ring-0"
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
}

export async function Hero({ count }: { count: number }) {
  return (
    <Section id="hero">
      <div className="relative w-full p-6 lg:p-12 border-x overflow-hidden flex justify-center items-center">
        <div className="flex flex-col justify-center items-center max-w-4xl mx-auto">
          <HeroTitles />
          <DomainRating />
          <GymbrahSponsor />
          <UsernameInput />
          <HeroCTA count={count} />
          <Avatars count={count} />
        </div>
      </div>
    </Section>
  );
}
