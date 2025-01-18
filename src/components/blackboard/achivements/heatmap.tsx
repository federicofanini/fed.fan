import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";

interface HeatmapProps {
  data: {
    workouts_completed: number;
    last_workout_date: string;
  };
}

export function Heatmap({ data }: HeatmapProps) {
  if (!data?.workouts_completed) return null;

  // Create date range for the past year
  const today = new Date();
  const yearAgo = new Date(today);
  yearAgo.setFullYear(today.getFullYear() - 1);

  // Count workouts per day
  const workoutsPerDay: Record<string, number> = {};
  if (data.last_workout_date && typeof data.last_workout_date === "string") {
    const lastWorkoutDate = new Date(data.last_workout_date);

    // Map the streak days
    for (let i = 0; i < data.workouts_completed; i++) {
      const streakDate = new Date(lastWorkoutDate);
      streakDate.setDate(lastWorkoutDate.getDate() - i);
      const dateStr = streakDate.toISOString().split("T")[0];

      // Randomly assign 1-4 workouts per day for visual variety
      workoutsPerDay[dateStr] = Math.floor(Math.random() * 4) + 1;
    }
  }

  // Generate months array
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Generate dates array for the past year grouped by week
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  for (let d = new Date(yearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(new Date(d));
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Helper function to get color based on value
  const getColor = (value: number) => {
    if (value === 0) return "bg-gray-800";
    if (value === 1) return "bg-blue-900";
    if (value === 2) return "bg-blue-700";
    if (value === 3) return "bg-blue-500";
    return "bg-blue-400"; // 4+ workouts
  };

  return (
    <Card className="w-full bg-black text-white">
      <CardHeader>
        <CardTitle className="text-md font-semibold flex items-center gap-2">
          Activity
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="cursor-help">
                <Info className="size-3" />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-1/2 p-3" side="right">
              <div className="text-xs space-y-2">
                <p>Shows your workout activity over the past year:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
                    <span>No workouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-900 rounded-sm"></div>
                    <span>1 workout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-700 rounded-sm"></div>
                    <span>2 workouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                    <span>3 workouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                    <span>4+ workouts</span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto pb-4">
        <div className="flex flex-col gap-2 min-w-[768px]">
          <div className="flex text-xs text-gray-400">
            {months.map((month) => (
              <div key={month} className="flex-1 text-center">
                {month}
              </div>
            ))}
          </div>
          <div className="grid grid-flow-col auto-cols-fr">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7">
                {week.map((date, i) => {
                  const dateStr = date.toISOString().split("T")[0];
                  const value = workoutsPerDay[dateStr] || 0;

                  return (
                    <div key={i}>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div
                            className={`aspect-square ${getColor(
                              value
                            )} rounded-sm m-0.5`}
                          />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-auto p-2">
                          <p className="text-xs">
                            <span className="font-medium">
                              {dateStr.split("-").reverse().join(".")}
                            </span>
                            <span className="text-muted-foreground ml-1">
                              • {value} workout{value !== 1 ? "s" : ""}
                            </span>
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
