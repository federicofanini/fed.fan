import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for PicYards platform.",
};

export default async function Layout({ children }: MarketingLayoutProps) {
  return (
    <>
      <Header />
      <main className="my-4">{children}</main>
      <CTA />
      <Footer />
    </>
  );
}
