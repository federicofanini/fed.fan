import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

export async function WorkoutSummary({
  workoutData,
}: {
  workoutData?: Workout | null;
}) {
  if (!workoutData) {
    return null;
  }

  // Group exercises by round
  const exercisesByRound = workoutData.exercises.reduce<
    Record<string, Exercise[]>
  >((acc, exercise) => {
    const round = exercise.round || "1";
    if (!acc[round]) {
      acc[round] = [];
    }
    acc[round].push(exercise);
    return acc;
  }, {});

  // Sort rounds numerically
  const sortedRounds = Object.keys(exercisesByRound).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  if (sortedRounds.length === 0) {
    return null;
  }

  return (
    <Card className="w-full bg-gradient-to-br from-background to-muted/50">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-4">
          <Dumbbell className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">
            Workout ({workoutData.exercises.length} exercises)
          </h3>
        </div>

        <div className="space-y-4">
          {sortedRounds.map((round) => (
            <div key={round} className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                Round {round}
              </h4>

              {exercisesByRound[round].map((exercise) => (
                <div
                  key={exercise.id}
                  className="p-2 rounded-lg bg-card/50 border border-border/50 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={exercise.gif_url || ""}
                        className="h-8 w-8 rounded-sm object-cover"
                      />
                      <h4 className="font-medium text-base">{exercise.name}</h4>
                    </div>
                    <div className="flex gap-2">
                      {exercise.sets && exercise.reps && (
                        <Badge variant="secondary" className="font-mono">
                          {exercise.sets} × {exercise.reps}
                          {exercise.weight ? ` @ ${exercise.weight}kg` : ""}
                        </Badge>
                      )}
                      {exercise.duration && (
                        <Badge variant="secondary" className="font-mono">
                          {exercise.duration} sec
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
