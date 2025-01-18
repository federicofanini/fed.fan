import { LeaderboardTable } from "@/components/blackboard/leaderboard/leaderboard-table";
import { Section } from "@/components/section";
import { Footer } from "@/components/sections/footer";
import { CTA } from "@/components/sections/cta";
import { Header } from "@/components/sections/header";

export const revalidate = 1800; // 30 minutes in seconds

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <Header />
      <Section title="Leaderboard">
        <LeaderboardTable />
      </Section>
      <CTA />
      <Footer />
    </div>
  );
}
