import { Blog } from "@/components/sections/blog";
import { Community } from "@/components/sections/community";
import { CTA } from "@/components/sections/cta";
import { DemoVideo } from "@/components/sections/demo-video";
import { Examples } from "@/components/sections/examples";
import { Features } from "@/components/sections/features";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Logos } from "@/components/sections/logos";
import { OldNew } from "@/components/sections/old-new";
import { Pricing } from "@/components/sections/pricing";
import { Statistics } from "@/components/sections/statistics";
import { Testimonials } from "@/components/sections/testimonials";
import { UseCases } from "@/components/sections/use-cases";
import { Benefits } from "@/components/sections/benefits";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <DemoVideo />
      <OldNew />
      <Pricing />
      <Benefits />
      {/* <Testimonials />
      <Statistics /> */}
      <Blog />
      <CTA />
      <Footer />
    </main>
  );
}
