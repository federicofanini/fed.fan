"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Dumbbell, Clock, List, Play } from "lucide-react";

const workouts = [
  {
    name: "Full Body HIIT",
    exercises: [
      { name: "Burpees", reps: 15 },
      { name: "Mountain Climbers", reps: 20 },
      { name: "Jump Squats", reps: 12 },
      { name: "Push-ups", reps: 10 },
    ],
    duration: "30 mins",
  },
  {
    name: "Upper Body Focus",
    exercises: [
      { name: "Push-ups", reps: 12 },
      { name: "Pull-ups", reps: 8 },
      { name: "Dips", reps: 10 },
      { name: "Diamond Push-ups", reps: 8 },
    ],
    duration: "45 mins",
  },
  {
    name: "Core Crusher",
    exercises: [
      { name: "Plank", reps: 60 },
      { name: "Russian Twists", reps: 20 },
      { name: "Leg Raises", reps: 15 },
      { name: "Bicycle Crunches", reps: 30 },
    ],
    duration: "25 mins",
  },
  {
    name: "Lower Body Blast",
    exercises: [
      { name: "Squats", reps: 15 },
      { name: "Lunges", reps: 12 },
      { name: "Calf Raises", reps: 20 },
      { name: "Box Jumps", reps: 10 },
    ],
    duration: "40 mins",
  },
];

export function WorkoutCarousel() {
  return (
    <Card className="w-full max-w-[395px]">
      <CardContent className="p-6">
        <Carousel className="w-full">
          <CarouselContent className="pb-8">
            {workouts.map((workout, index) => (
              <CarouselItem key={index}>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between gap-1.5 rounded-md bg-muted p-2">
                    <h3 className="text-lg font-medium">{workout.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {workout.duration}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {workout.exercises.map((exercise, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <div className="flex items-center gap-2">
                          <Dumbbell className="h-4 w-4" />
                          <span>{exercise.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {exercise.reps}{" "}
                          {exercise.name === "Plank" ? "sec" : "reps"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => console.log("Choose workout")}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start Workout
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => console.log("View all workouts")}
                      className="w-full"
                    >
                      <List className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
}
