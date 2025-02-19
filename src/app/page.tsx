import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
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
      <Benefits />
      <CTA />
      <Footer />
    </main>
  );
}
