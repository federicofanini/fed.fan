"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Play,
  Pause,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useCallback } from "react";
import { Progress } from "@/components/ui/progress";
import { FinishButton } from "@/components/blackboard/blackboard-page/finish-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { saveCompletedReps } from "@/actions/workout-page/reps-completed";
import { toast } from "sonner";
import { WorkoutStats } from "./workout-stats";
import Image from "next/image";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
  duration: number | null;
  body_part: string | null;
  equipment: string | null;
  target: string | null;
  secondary_muscles: string[];
  instructions: string[];
  gif_url: string | null;
  exercise_id: string;
  workout_id: string;
  round: string;
}

interface WorkoutProps {
  userId: string;
  workout: {
    id: string;
    name: string;
    exercises: Exercise[];
    selected: boolean;
    created_at: Date;
  };
}

export function WorkoutClient({ workout, userId }: WorkoutProps) {
  const router = useRouter();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [completedReps, setCompletedReps] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const exercise = workout.exercises[currentExercise];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeLeft && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => (prev ?? 0) - 1);
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      setIsTimerRunning(false);
      handleNextSet();
    }
    return () => clearTimeout(timer);
  }, [isTimerRunning, timeLeft]);

  const handleSetComplete = async () => {
    if (!exercise.duration && completedReps === 0) {
      toast.error("Please enter completed reps");
      return;
    }

    const result = await saveCompletedReps({
      workoutExerciseId: exercise.id,
      userId: userId,
      completedReps: exercise.duration ? 1 : completedReps,
      setNumber: currentSet,
    });

    if (result?.data?.success) {
      handleNextSet();
    } else {
      toast.error("Error saving completed reps", {
        description: result?.data?.error,
      });
    }
  };

  const handleNextSet = useCallback(() => {
    if (currentSet < exercise.sets) {
      setCurrentSet((prev) => prev + 1);
    } else if (currentExercise < workout.exercises.length - 1) {
      setCurrentExercise((prev) => prev + 1);
      setCurrentSet(1);
    } else {
      setIsWorkoutComplete(true);
    }
    setCompletedReps(0);
    setTimeLeft(null);
    setIsTimerRunning(false);
  }, [currentExercise, currentSet, exercise.sets, workout.exercises.length]);

  const handleStartTimer = () => {
    if (exercise.duration) {
      setTimeLeft(exercise.duration);
      setIsTimerRunning(true);
    }
  };

  const handleToggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  return (
    <div className="h-[calc(100vh-4rem)] p-4">
      {!isWorkoutComplete ? (
        <div className="h-full grid lg:grid-cols-2 gap-8">
          {/* Left Column - Exercise Preview */}
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-muted">
            <Image
              src={exercise.gif_url || "/placeholder-exercise.png"}
              alt="Exercise tutorial"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Right Column - Exercise Details */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{workout.name}</h1>
              <Button variant="destructive" onClick={() => router.back()}>
                <LogOut className="h-4 w-4 mr-1" />
                Finish workout
              </Button>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <h2 className="text-3xl font-bold mb-2">{exercise.name}</h2>
                <Badge variant="secondary" className="text-md">
                  {exercise.body_part}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 p-4 rounded-lg text-center">
                  <div className="text-sm font-medium mb-1">Set</div>
                  <div className="text-3xl font-bold">
                    {currentSet}/{exercise.sets}
                  </div>
                </div>
                {exercise.duration ? (
                  <div className="bg-secondary/50 p-4 rounded-lg text-center">
                    <div className="text-sm font-medium mb-1">Duration</div>
                    <div className="text-3xl font-bold">
                      {timeLeft ?? exercise.duration}s
                    </div>
                  </div>
                ) : (
                  <div className="bg-secondary/50 p-4 rounded-lg text-center">
                    <div className="text-sm font-medium mb-1">Target Reps</div>
                    <div className="text-3xl font-bold">{exercise.reps}</div>
                  </div>
                )}
              </div>

              <div className="mt-auto space-y-4">
                {exercise.duration ? (
                  <>
                    {!isTimerRunning && timeLeft === null && (
                      <Button
                        size="lg"
                        className="w-full text-lg h-16"
                        onClick={handleStartTimer}
                      >
                        <Play className="h-6 w-6 mr-2" />
                        Start Timer
                      </Button>
                    )}
                    {timeLeft !== null && (
                      <Button
                        size="lg"
                        className="w-full text-lg h-16"
                        onClick={handleToggleTimer}
                      >
                        {isTimerRunning ? (
                          <>
                            <Pause className="h-6 w-6 mr-2" />
                            Pause Timer
                          </>
                        ) : (
                          <>
                            <Play className="h-6 w-6 mr-2" />
                            Resume Timer
                          </>
                        )}
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <Input
                      type="number"
                      value={completedReps || ""}
                      onChange={(e) => setCompletedReps(Number(e.target.value))}
                      className="text-lg h-12"
                      placeholder="Enter completed reps"
                    />
                  </div>
                )}
                <Button
                  size="lg"
                  className="w-full text-lg h-16"
                  onClick={handleSetComplete}
                >
                  <CheckCircle className="h-6 w-6 mr-2" />
                  Complete Set
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="w-full max-w-md space-y-6 text-center">
            <h2 className="text-3xl font-bold">Workout Complete!</h2>
            <p className="text-muted-foreground">
              Great job! You&apos;ve completed all exercises.
            </p>
            <WorkoutStats workoutId={workout.id} userId={userId} />
            <FinishButton
              onClick={() => router.push("/blackboard")}
              userId={userId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
