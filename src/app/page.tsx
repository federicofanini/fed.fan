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
import { Profiles } from "@/components/sections/profiles";
import { getUserCount } from "@/actions/user-count";

export const revalidate = 900; // 15 minutes

export default async function Home() {
  const response = await getUserCount();
  const count = response?.data?.data;

  return (
    <main>
      <Header />
      <Hero count={count} />
      <Profiles />
      <Pricing />
      <Benefits />
      {/* <Testimonials />
      <Statistics /> */}
      <CTA />
      <Footer />
    </main>
  );
}
