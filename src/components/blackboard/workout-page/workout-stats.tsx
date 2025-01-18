"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getWorkoutStats } from "@/actions/workout-page/reps-completed";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
  duration: number | null;
  category: string;
  muscles: string[];
  outcomes: string[];
  exercise_id: string;
  workout_id: string;
}

interface WorkoutStatsProps {
  workoutId: string;
  userId: string;
}

interface CompletedSet {
  completed_reps: number;
  set_number: number;
  workout_exercise: {
    exercise: Exercise;
    sets: number;
    reps: number;
  };
}

interface Stats {
  completedSets: CompletedSet[];
  summary: {
    totalReps: number;
    totalSets: number;
    uniqueExercises: number;
  };
}

export function WorkoutStats({ workoutId, userId }: WorkoutStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await getWorkoutStats({
          workoutId,
          userId,
        });

        if (!response?.data?.success || !response?.data?.data) {
          setError("Failed to load workout stats");
          return;
        }

        setStats(response.data.data);
      } catch (err) {
        setError("An error occurred while fetching stats");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [workoutId, userId]);

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-sm text-destructive">{error}</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-4 space-y-4">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[180px]" />
      </Card>
    );
  }

  if (!stats || !stats.completedSets) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">No stats available</p>
      </Card>
    );
  }

  // Group completed sets by exercise
  const exerciseStats = stats.completedSets.reduce((acc, set) => {
    const exerciseId = set.workout_exercise.exercise.id;
    if (!acc[exerciseId]) {
      acc[exerciseId] = {
        exercise: set.workout_exercise.exercise,
        completedReps: 0,
        targetReps: set.workout_exercise.reps * set.workout_exercise.sets,
        completedSets: 0,
        targetSets: set.workout_exercise.sets,
      };
    }
    acc[exerciseId].completedReps += set.completed_reps;
    acc[exerciseId].completedSets += 1;
    return acc;
  }, {} as Record<string, { exercise: Exercise; completedReps: number; targetReps: number; completedSets: number; targetSets: number }>);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-4">Workout Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <div className="text-sm text-muted-foreground mb-1">
                Total Reps
              </div>
              <div className="text-2xl font-bold">
                {stats.summary.totalReps}
              </div>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <div className="text-sm text-muted-foreground mb-1">
                Sets Done
              </div>
              <div className="text-2xl font-bold">
                {stats.summary.totalSets}
              </div>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <div className="text-sm text-muted-foreground mb-1">
                Exercises
              </div>
              <div className="text-2xl font-bold">
                {stats.summary.uniqueExercises}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Exercise Details</h3>
          <div className="space-y-4">
            {Object.values(exerciseStats).map(
              ({
                exercise,
                completedReps,
                targetReps,
                completedSets,
                targetSets,
              }) => (
                <div key={exercise.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{exercise.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {completedSets}/{targetSets} sets
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span>
                        {completedReps}/{targetReps} reps
                      </span>
                    </div>
                    <Progress value={(completedReps / targetReps) * 100} />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
