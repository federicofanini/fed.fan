import { getCachedGamificationData } from "@/actions/gamification/fetch-points";
import { Card } from "@/components/ui/card";
import { Trophy, Flame, Star, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export async function PointsDisplay() {
  const data = await getCachedGamificationData();

  // Return empty component structure if no data
  if (!data?.success || !data?.data) {
    return (
      <div className="flex gap-1">
        <Card className="flex items-center gap-1.5 px-2 py-1">
          <Trophy className="h-4 w-4" />
          <span className="text-sm font-bold">0</span>
        </Card>

        <Card className="flex items-center gap-1.5 px-2 py-1">
          <Star className="h-4 w-4" />
          <span className="text-sm font-bold">1</span>
        </Card>

        <Card className="flex items-center gap-1.5 px-2 py-1">
          <Flame className="h-4 w-4" />
          <span className="text-sm font-bold">0</span>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      <Card className="flex items-center gap-1.5 px-2 py-1">
        <Trophy className="h-4 w-4" />
        <span className="text-sm font-bold">{data.data.points}</span>
      </Card>

      <Card className="flex items-center gap-1.5 px-2 py-1">
        <Star className="h-4 w-4" />
        <span className="text-sm font-bold">{data.data.level}</span>
      </Card>

      <Card className="flex items-center gap-1.5 px-2 py-1">
        <Flame className="h-4 w-4" />
        <span className="text-sm font-bold">{data.data.streak_days}</span>
      </Card>
    </div>
  );
}
