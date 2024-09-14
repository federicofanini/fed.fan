import ClientSection from "@/components/landing/client-section";
import CallToActionSection from "@/components/landing/cta-section";
import HeroSectionWaitlist from "@/components/landing/hero-section-waitlist";
import PricingSection from "@/components/landing/pricing-section";
import Particles from "@/components/magicui/particles";
import { SphereMask } from "@/components/magicui/sphere-mask";

export default async function Page() {
  return (
    <>
      <HeroSectionWaitlist />
      <SphereMask />
      <ClientSection />
      <Particles
        className="absolute inset-0 -z-10"
        quantity={5000}
        ease={70}
        size={0.15}
        staticity={100}
        color={"#37ecba"}
      />
    </>
  );
}
