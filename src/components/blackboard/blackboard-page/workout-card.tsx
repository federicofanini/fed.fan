import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Dumbbell, PersonStanding, Zap } from "lucide-react";
import { estimateWorkoutTime } from "@/actions/workout/time-estimation";

interface Exercise {
  id: string;
  name: string | null;
  reps: number | null;
  sets: number | null;
  weight: number | null;
  duration: number | null;
  round: string | null;
  workout_id: string;
  exercise_id: string;
  body_part: string | null;
  equipment: string | null;
  target: string | null;
  secondary_muscles: string[];
  instructions: string[];
  gif_url: string | null;
}

interface Workout {
  id: string;
  name: string;
  created_at: Date;
  exercises: Exercise[];
  selected: boolean;
  frequency: string | null;
}

export async function WorkoutCard({
  workoutData,
}: {
  workoutData?: Workout | null;
}) {
  if (!workoutData) {
    return null;
  }

  // Estimate workout time
  const timeResponse = await estimateWorkoutTime(
    workoutData.exercises.map((e) => ({
      exercise_id: e.exercise_id,
      sets: e.sets || 0,
      reps: e.reps || 0,
      duration: e.duration || null,
    }))
  );

  let estimatedTime = "";
  if (timeResponse.success && timeResponse.data) {
    const { hours, minutes } = timeResponse.data.formatted;
    estimatedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  const points = 100;

  // Get unique muscle groups from target and secondary muscles
  const muscleGroups = Array.from(
    new Set([
      ...workoutData.exercises.map((e) => e.target).filter(Boolean),
      ...workoutData.exercises.flatMap((e) => e.secondary_muscles),
    ])
  ) as string[];

  // Get unique equipment
  const equipment = Array.from(
    new Set(
      workoutData.exercises
        .map((exercise) => exercise.equipment)
        .filter(Boolean)
    )
  ).join(", ");

  return (
    <Card className="w-full p-2.5 sm:p-4 space-y-2.5 sm:space-y-4 bg-[#1a2e35] text-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-3 flex justify-between gap-2 items-center">
          <h2 className="text-base sm:text-2xl font-semibold line-clamp-2 uppercase">
            {workoutData.name}
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-4 text-[11px] sm:text-sm text-gray-300">
            <div className="flex items-center gap-1 sm:gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              {estimatedTime}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              {points} points
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-3">
        <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm">
          <PersonStanding className="h-3 w-3 sm:h-4 sm:w-4" />
          <ScrollArea className="w-full">
            <div className="flex gap-1 sm:gap-2">
              {muscleGroups.map((group, index) => (
                <span key={index} className="whitespace-nowrap">
                  {index > 0 && "-  "}
                  {group}
                </span>
              ))}
            </div>
          </ScrollArea>
        </div>

        {equipment && (
          <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm">
            <Dumbbell className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            {equipment}
          </div>
        )}
      </div>
    </Card>
  );
}
