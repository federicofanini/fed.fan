import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Zap } from "lucide-react";
import { getPoints } from "@/actions/leaderboard/get-points";
import { getUser } from "@/utils/supabase/database/cached-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeaderboardEntry {
  user_id: string;
  points: number;
  level: number;
  streak_days: number;
  rank: number;
  user: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export async function LeaderboardTable() {
  const response = await getPoints();

  if (!response?.data?.success || !response?.data?.data) {
    return <div>Failed to load leaderboard</div>;
  }

  // Map users and set default values if no gamification stats
  const leaderboardData = response.data.data.map((entry: LeaderboardEntry) => ({
    ...entry,
    points: entry.points || 0,
    level: entry.level || 1,
    streak_days: entry.streak_days || 0,
  }));

  // Sort by points and add rank
  const sortedLeaderboard = leaderboardData
    .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.points - a.points)
    .map((entry: LeaderboardEntry, index: number) => ({
      ...entry,
      rank: index + 1,
    }));

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return rank;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Global Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 px-2 sm:px-4">Rank</TableHead>
                <TableHead className="px-2 sm:px-4">User</TableHead>
                <TableHead className="hidden sm:table-cell">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    Level
                  </div>
                </TableHead>
                <TableHead className="px-2 sm:px-4">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    <span className=" sm:inline">Points</span>
                  </div>
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  <div className="flex items-center gap-1">
                    <Medal className="h-4 w-4" />
                    Streak
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLeaderboard.map((entry: LeaderboardEntry) => (
                <TableRow key={entry.user_id}>
                  <TableCell className="font-medium px-2 sm:px-4">
                    {getRankEmoji(entry.rank)}
                  </TableCell>
                  <TableCell className="px-2 sm:px-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                        <AvatarImage src={entry.user.avatar_url || undefined} />
                        <AvatarFallback>
                          {(entry.user.full_name || "Anonymous")
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">
                        {entry.user.full_name || "Anonymous"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {entry.level}
                  </TableCell>
                  <TableCell className="px-2 sm:px-4">{entry.points}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {entry.streak_days} days
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
