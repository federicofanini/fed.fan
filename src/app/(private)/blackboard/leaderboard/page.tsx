import { LeaderboardTable } from "@/components/blackboard/leaderboard/leaderboard-table";

export const revalidate = 1800; // 30 minutes in seconds

export default function LeaderboardPage() {
  return (
    <div>
      <LeaderboardTable />
    </div>
  );
}
