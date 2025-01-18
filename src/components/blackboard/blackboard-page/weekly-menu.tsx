import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "../../ui/separator";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkoutCard } from "./workout-card";
import { SetFrequencyDialog } from "./set-frequency-dialog";
import { EditScheduleButton } from "./set-frequency-dialog";
import {
  getCachedWorkoutFrequency,
  getCachedWorkoutsByDay,
  getCachedExercises,
} from "@/actions/workout/cached-workout";
import { format, startOfWeek, addDays } from "date-fns";
import { WorkoutSummary } from "./workout-summary";
import { StartWorkout } from "./start-workout";

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
  exercises: Array<{
    id: string;
    exercise_id: string;
    reps: number | null;
    sets: number | null;
    weight: number | null;
    duration: number | null;
    round: string | null;
    workout_id: string;
  }>;
  selected: boolean;
  frequency: string | null;
}

const today = new Date();
const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday

const WEEKDAYS = [
  { name: "Monday", shortName: "Mon", value: "1", date: weekStart },
  {
    name: "Tuesday",
    shortName: "Tue",
    value: "2",
    date: addDays(weekStart, 1),
  },
  {
    name: "Wednesday",
    shortName: "Wed",
    value: "3",
    date: addDays(weekStart, 2),
  },
  {
    name: "Thursday",
    shortName: "Thu",
    value: "4",
    date: addDays(weekStart, 3),
  },
  { name: "Friday", shortName: "Fri", value: "5", date: addDays(weekStart, 4) },
  {
    name: "Saturday",
    shortName: "Sat",
    value: "6",
    date: addDays(weekStart, 5),
  },
  { name: "Sunday", shortName: "Sun", value: "7", date: addDays(weekStart, 6) },
];

export async function WeeklyMenu() {
  const [frequencyResponse, workoutsResponse, exercisesResponse] =
    await Promise.all([
      getCachedWorkoutFrequency(),
      getCachedWorkoutsByDay(),
      getCachedExercises(),
    ]);

  if (!frequencyResponse.success || !frequencyResponse.data) {
    return <SetFrequencyDialog />;
  }

  const userDays = frequencyResponse.data.frequency?.split(",") || [];
  const hasFrequency = userDays.length > 0;

  const defaultDay =
    WEEKDAYS.find(
      (day) => format(day.date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
    )?.name || WEEKDAYS[0].name;

  if (!hasFrequency) {
    return <SetFrequencyDialog />;
  }

  if (
    !workoutsResponse.success ||
    !workoutsResponse.data ||
    !exercisesResponse.success ||
    !exercisesResponse.data
  ) {
    return (
      <Card className="w-full">
        <div className="p-4 text-center">
          <p>Error loading workouts</p>
        </div>
      </Card>
    );
  }

  // Create a map of exercise details for quick lookup
  const exerciseMap = new Map<string, CachedExercise>(
    exercisesResponse.data.map((exercise: CachedExercise) => [
      exercise.id,
      exercise,
    ])
  );

  // Enrich workouts with exercise details
  const enrichedWorkoutsByDay = Object.entries(workoutsResponse.data).reduce<
    Record<string, Workout | null>
  >((acc, [day, workout]) => {
    if (!workout) {
      acc[day] = null;
      return acc;
    }

    const typedWorkout = workout as WorkoutFromDB;

    acc[day] = {
      id: typedWorkout.id,
      name: typedWorkout.name,
      created_at: typedWorkout.created_at,
      selected: typedWorkout.selected,
      frequency: typedWorkout.frequency,
      exercises: typedWorkout.exercises.map((exercise) => {
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
    };
    return acc;
  }, {});

  return (
    <Card className="w-full max-w-[100vw] px-2 sm:px-4 border-none">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-3 lg:mt-8">
          <Tabs defaultValue={defaultDay} className="w-full">
            <TabsList className="w-full flex justify-between px-1">
              {WEEKDAYS.map((day) => (
                <TabsTrigger
                  key={day.name}
                  value={day.name}
                  disabled={!userDays.includes(day.value)}
                  className="flex-shrink-0 min-w-[calc(100vw/7-0.5rem)] sm:min-w-[4.5rem] lg:min-w-[5.5rem] px-0.5 sm:px-2 relative"
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[10px] sm:text-sm lg:text-base font-medium truncate">
                      <span className="hidden sm:inline font-semibold">
                        {day.name}
                      </span>
                      <span className="sm:hidden font-semibold">
                        {day.shortName}
                      </span>
                    </span>
                    <span className="text-[8px] sm:text-xs lg:text-sm text-muted-foreground">
                      {format(day.date, "MM/dd")}
                    </span>
                    {format(day.date, "yyyy-MM-dd") ===
                      format(today, "yyyy-MM-dd") && (
                      <div className="absolute top-0.5 right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-4">
              {WEEKDAYS.filter((day) => userDays.includes(day.value)).map(
                (day) => (
                  <TabsContent
                    key={day.name}
                    value={day.name}
                    className="text-xs sm:text-sm space-y-4 rounded-md p-2 sm:p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-semibold">
                        {day.name} - {format(day.date, "MMM dd, yyyy")}
                      </span>
                      <EditScheduleButton />
                    </div>
                    <Separator className="my-2" />
                    <div className="space-y-4">
                      <Suspense fallback={<Skeleton className="w-full h-32" />}>
                        <WorkoutCard
                          workoutData={enrichedWorkoutsByDay[day.value]}
                        />
                      </Suspense>
                      <Suspense fallback={<Skeleton className="w-full h-24" />}>
                        <WorkoutSummary
                          workoutData={enrichedWorkoutsByDay[day.value]}
                        />
                      </Suspense>
                      <Suspense fallback={<Skeleton className="w-full h-10" />}>
                        <StartWorkout
                          workoutId={enrichedWorkoutsByDay[day.value]?.id ?? ""}
                        />
                      </Suspense>
                    </div>
                  </TabsContent>
                )
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </Card>
  );
}
