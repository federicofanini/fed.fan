import { Card } from "@/components/ui/card";
import {
  getCachedWorkoutsByDay,
  getCachedExercises,
} from "@/actions/workout/cached-workout";
import { WorkoutClient } from "@/components/blackboard/workout-page/workout-client";
import { getUser } from "@/utils/supabase/database/cached-queries";

interface Exercise {
  id: string;
  name: string;
  reps: number;
  sets: number;
  weight: number | null;
  duration: number | null;
  round: string;
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
  name: string;
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
  selected: boolean;
  created_at: Date;
  exercises: Exercise[];
}

// Define the type for the dynamic route params
type PageParams = { idWorkout: string } & Promise<any>;

export default async function WorkoutPage({ params }: { params: PageParams }) {
  const [workoutsResponse, exercisesResponse, user] = await Promise.all([
    getCachedWorkoutsByDay(),
    getCachedExercises(),
    getUser(),
  ]);

  if (!user) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Card className="p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Not authenticated</h1>
            <p className="text-muted-foreground">
              Please sign in to view this workout
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (
    !workoutsResponse.success ||
    !workoutsResponse.data ||
    !exercisesResponse.success ||
    !exercisesResponse.data
  ) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Card className="p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Error loading workout</h1>
            <p className="text-muted-foreground">Please try again later</p>
          </div>
        </Card>
      </div>
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

  // Find workout by ID from workoutsByDay and enrich with exercise details
  const workout = Object.values(workoutsByDay).find(
    (w) => w !== null && (w as Workout)?.id === params.idWorkout
  ) as Workout | undefined;

  if (!workout) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Card className="p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Workout not found</h1>
            <p className="text-muted-foreground">
              The requested workout could not be found
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Enrich workout exercises with cached exercise details
  const enrichedWorkout = {
    ...workout,
    exercises: workout.exercises.map((exercise) => {
      const cachedExercise = exerciseMap.get(exercise.exercise_id);
      if (!cachedExercise?.name) return exercise;

      return {
        ...exercise,
        name: cachedExercise.name, // Now guaranteed to be string
        body_part: cachedExercise.body_part,
        equipment: cachedExercise.equipment,
        target: cachedExercise.target,
        secondary_muscles: cachedExercise.secondary_muscles,
        instructions: cachedExercise.instructions,
        gif_url: cachedExercise.gif_url,
      };
    }),
  };

  return <WorkoutClient workout={enrichedWorkout} userId={user.id} />;
}
