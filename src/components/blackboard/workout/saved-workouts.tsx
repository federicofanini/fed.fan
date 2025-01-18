import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Dumbbell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getCachedWorkoutsByDay,
  getCachedExercises,
} from "@/actions/workout/cached-workout";
import { WorkoutActions } from "./create-workout/workout-actions";

interface Exercise {
  id: string;
  name: string;
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

interface CachedExercise {
  id: string;
  name: string | null;
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

interface WorkoutFromDB {
  id: string;
  name: string;
  created_at: Date;
  exercises: Array<Omit<Exercise, "name"> & { name: string | null }>;
  selected: boolean;
  frequency: string | null;
}

const dayMap: Record<string, string> = {
  "1": "Mon",
  "2": "Tue",
  "3": "Wed",
  "4": "Thu",
  "5": "Fri",
  "6": "Sat",
  "7": "Sun",
};

export async function SavedWorkouts() {
  const [workoutsResponse, exercisesResponse] = await Promise.all([
    getCachedWorkoutsByDay(),
    getCachedExercises(),
  ]);

  let workouts: Workout[] = [];

  if (
    !workoutsResponse.success ||
    !workoutsResponse.data ||
    !exercisesResponse.success ||
    !exercisesResponse.data
  ) {
    return (
      <Card className="sm:col-span-2 lg:col-span-3">
        <CardContent className="flex flex-col items-center gap-4 py-6 sm:py-8">
          <div className="space-y-1 sm:space-y-2 text-center px-4">
            <h3 className="font-semibold text-sm sm:text-base">
              Error loading workouts
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Please try again later
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const workoutsByDay = workoutsResponse.data;

  // Create a map of exercise details for quick lookup
  const exerciseMap = new Map<string, CachedExercise>(
    exercisesResponse.data.map((exercise: CachedExercise) => [
      exercise.id,
      exercise,
    ])
  );

  // Get all non-null workouts and enrich them with exercise details
  workouts = Object.values(workoutsByDay)
    .filter((w): w is WorkoutFromDB => w !== null)
    .map((workout) => ({
      ...workout,
      exercises: workout.exercises.map((exercise) => {
        const cachedExercise = exerciseMap.get(exercise.exercise_id);
        if (!cachedExercise?.name) {
          throw new Error(`Missing exercise name for ${exercise.exercise_id}`);
        }
        return {
          ...exercise,
          name: cachedExercise.name,
          body_part: cachedExercise.body_part,
          equipment: cachedExercise.equipment,
          target: cachedExercise.target,
          secondary_muscles: cachedExercise.secondary_muscles,
          instructions: cachedExercise.instructions,
          gif_url: cachedExercise.gif_url,
        };
      }),
    }));

  // Remove duplicates based on workout ID
  workouts = Array.from(new Map(workouts.map((w) => [w.id, w])).values());

  return (
    <div className="w-full px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Your workouts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {workouts.map((workout) => {
          // Group exercises by round
          const exercisesByRound = workout.exercises.reduce((acc, exercise) => {
            const round = exercise.round || "1";
            if (!acc[round]) {
              acc[round] = [];
            }
            acc[round].push(exercise);
            return acc;
          }, {} as Record<string, Exercise[]>);

          // Sort rounds numerically
          const sortedRounds = Object.keys(exercisesByRound).sort(
            (a, b) => parseInt(a) - parseInt(b)
          );

          if (sortedRounds.length === 0) {
            return null;
          }

          return (
            <Card key={workout.id} className="w-full">
              <CardHeader className="p-4">
                <div className="flex flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-base sm:text-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-fit text-xs flex flex-col gap-1 text-muted-foreground">
                        <span className="truncate text-sm sm:text-base text-primary uppercase">
                          {workout.name}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className="w-fit text-xs flex flex-row gap-1 items-center"
                        >
                          <Calendar className="h-3 w-3" />
                          {workout.frequency
                            ? workout.frequency
                                .split(",")
                                .map((day) => dayMap[day])
                                .join(", ")
                            : "No days set"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(workout.created_at)
                        .toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                        .replace(/(\d+)(?=(,\s\d{4}))/, (match) => {
                          const num = parseInt(match);
                          const suffix = ["th", "st", "nd", "rd"][
                            num % 10 > 3 || (num % 100) - (num % 10) == 10
                              ? 0
                              : num % 10
                          ];
                          return num + suffix;
                        })}
                    </div>
                  </CardTitle>
                  <WorkoutActions workout={workout} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-3">
                <div className="flex items-center gap-2 mb-4">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">
                    Workout ({workout.exercises.length} exercises)
                  </h3>
                </div>

                <div className="space-y-4">
                  {sortedRounds.map((round) => (
                    <div key={round} className="space-y-2">
                      {exercisesByRound[round].map((exercise) => (
                        <div
                          key={`${workout.id}-${exercise.id}`}
                          className="p-2 rounded-lg bg-card/50 border border-border/50 hover:border-primary/20 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={exercise.gif_url || ""}
                                alt={exercise.name || ""}
                                className="h-8 w-8 rounded-md object-cover"
                              />
                              <h4 className="font-medium text-base">
                                {exercise.name}
                              </h4>
                            </div>
                            <div className="flex gap-2">
                              {exercise.sets && exercise.reps && (
                                <Badge
                                  variant="secondary"
                                  className="font-mono"
                                >
                                  {exercise.sets} × {exercise.reps}
                                  {exercise.weight
                                    ? ` @ ${exercise.weight}kg`
                                    : ""}
                                </Badge>
                              )}
                              {exercise.duration && (
                                <Badge
                                  variant="secondary"
                                  className="font-mono"
                                >
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
        })}
        {workouts.length === 0 && (
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardContent className="flex flex-col items-center gap-4 py-6 sm:py-8">
              <div className="rounded-full bg-primary/10 p-3 sm:p-4">
                <Dumbbell className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-pulse" />
              </div>
              <div className="space-y-1 sm:space-y-2 text-center px-4">
                <h3 className="font-semibold text-sm sm:text-base">
                  No Workouts Yet
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Time to start your fitness journey! Create your first workout
                  and track your progress.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
