"use client";

import { BorderBeam } from "@/components/magicui/border-beam";
import TextShimmer from "@/components/magicui/text-shimmer";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { joinWaitlist } from "@/app/actions";
import { toast } from "sonner";

export default function HeroSectionWaitlist() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section
      id="hero-waitlist"
      className="relative mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8"
    >
      <h1 className="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
        Build in a weekend and 
        <br className="hidden md:block" /> make{" "}
        <span className="relative whitespace-nowrap text-black">
          <span className="absolute bg-[#37ecba] -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1 rounded-lg"></span>
          <span className="relative text-neutral">$$$ millions</span></span>
      </h1>
      <p className="mb-12 text-lg tracking-tight text-gray-400 md:text-xl text-balance translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
        Full directory of stunning SaaS ideas to kickstart your
        <br className="hidden md:block" /> next million-dollar startup venture
      </p>
      <div className="translate-y-[-1rem] animate-fade-in opacity-0 ease-in-out [--animation-delay:600ms] max-w-md mx-auto">
        <form onSubmit={async (e) => {
          e.preventDefault();
          const email = e.currentTarget.email.value;
          const result = await joinWaitlist(email);
          if (result.success) {
            toast.success(result.message, {
              icon: "✅",
            });
          } else if (result.message === "You're already on the waitlist!") {
            toast.success(result.message, {
              icon: "✅",
            });
          } else {
            toast.error(result.message, {
              icon: "❌",
            });
          }
        }} className="flex items-center gap-2backdrop-blur-sm p-1 rounded-full">
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="flex-grow bg-transparent text-sm text-primary placeholder-white/50 px-4 py-2 focus:outline-none rounded-full"
            required
          />
          <Button type="submit" className="rounded-full text-sm px-4 py-2 bg-white text-black hover:bg-[#37ecba]/90 transition-colors">
            Join Waitlist
          </Button>
        </form>
        <p className="text-xs text-black/60 mt-2">Join our waitlist for early access</p>
      </div>
      <div
        ref={ref}
        className="relative mt-[8rem] animate-fade-up opacity-0 [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_30%,transparent)]"
      >
       {/*  <div
          className={`rounded-xl border border-white/10 bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-0 before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom,var(--color-one),var(--color-one),transparent_40%)] ${
            inView ? "before:animate-image-glow" : ""
          }`}
        >
          <BorderBeam
            size={200}
            duration={12}
            delay={11}
            colorFrom="var(--color-one)"
            colorTo="var(--color-two)"
          /> */}

          {/* <Image
            src="/hero-dark.png"
            width={1000}
            height={1000}
            alt="Hero Image"
            className="hidden relative w-full h-full rounded-[inherit] border object-contain dark:block"
          />
          <Image
            src="/hero-light.png"
            width={1000}
            height={1000}
            alt="Hero Image"
            className="block relative w-full h-full  rounded-[inherit] border object-contain dark:hidden"
          /> 
        </div>*/}
      </div>
    </section>
  );
}
