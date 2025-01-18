import { Card } from "@/components/ui/card";
import { Check, Dumbbell, Flame, Snowflake } from "lucide-react";
import { categories } from "../workout/create-workout/exercises/exercises-list";
import { ExerciseCheckbox } from "./exercise-checkbox";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: number | null;
  category: string;
}

interface Workout {
  id: string;
  name: string;
  created_at: Date;
  exercises: Exercise[];
  selected: boolean;
  frequency: string;
}

interface WorkoutSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  exercises: Exercise[];
}

export async function DailyWorkout({ workoutData }: { workoutData?: Workout }) {
  if (!workoutData) {
    return null;
  }

  // Group exercises by category
  const warmupExercises = workoutData.exercises.filter(
    (e: Exercise) => e.category === categories.warmUp
  );
  const cooldownExercises = workoutData.exercises.filter(
    (e: Exercise) => e.category === categories.flexibilityMobility
  );
  const workoutExercises = workoutData.exercises.filter(
    (e: Exercise) =>
      ![categories.warmUp, categories.flexibilityMobility].includes(e.category)
  );

  // Create sections with exercises
  const sections = [
    {
      id: "warmup",
      title: "Warm Up",
      icon: <Flame className="h-4 w-4 text-orange-500" />,
      exercises: warmupExercises,
    },
    {
      id: "workout",
      title: "Workout",
      icon: <Dumbbell className="h-4 w-4" />,
      exercises: workoutExercises,
    },
    {
      id: "cooldown",
      title: "Flexibility & Mobility",
      icon: <Snowflake className="h-4 w-4 text-cyan-500" />,
      exercises: cooldownExercises,
    },
  ].filter((section) => section.exercises.length > 0);

  if (sections.length === 0) {
    return null;
  }

  return (
    <Card className="w-full p-4">
      <Carousel className="w-full">
        <CarouselContent>
          {sections.map((section) =>
            section.exercises.map((exercise) => (
              <CarouselItem key={exercise.id} className="mb-12">
                <div className="p-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {section.icon}
                    <h3 className="font-semibold text-center">
                      {section.title} ({section.exercises.length} exercises)
                    </h3>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={exercise.id}
                        className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {exercise.name}
                      </label>
                    </div>
                    {exercise.duration ? (
                      <Badge variant="secondary" className="w-fit">
                        {exercise.duration} min
                      </Badge>
                    ) : (
                      <div className="grid grid-cols-1 gap-1 mb-4">
                        <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Sets
                        </Label>
                        {Array.from({ length: exercise.sets }).map(
                          (_, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-4 items-center gap-2"
                            >
                              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                                <Checkbox id={`set-${exercise.id}-${index}`} />
                                <Badge variant="secondary" className="w-full">
                                  🎯 {index + 1} - {exercise.reps} reps
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                                <Input
                                  type="number"
                                  placeholder="Actual reps"
                                  className="w-32 h-6 text-xs"
                                  min={0}
                                  max={99}
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="w-12 h-6"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Card>
  );
}
