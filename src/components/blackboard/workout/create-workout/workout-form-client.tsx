"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import type { ActionResponse } from "@/actions/types/action-response";
import { ExercisesTable } from "./exercises/exercises-table";
import type { Exercise } from "./exercises/exercises-table";
import { WorkoutInstructions } from "./workout-instructions";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createWorkout } from "@/actions/workout/workout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface WorkoutFormClientProps {
  exercises: Exercise[];
  uniqueCategories: string[];
}

interface SelectedExercise extends Exercise {
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
}

interface WorkoutExercise {
  exercise_id: string;
  sets: number;
  reps: number;
  weight?: number | null;
  duration?: number | null;
  round: string;
}

export function WorkoutFormClient({
  exercises,
  uniqueCategories,
}: WorkoutFormClientProps) {
  const [rounds, setRounds] = useState<SelectedExercise[][]>([[]]);
  const [workoutName, setWorkoutName] = useState("");
  const [frequency, setFrequency] = useState<string[]>([]);

  const handleExerciseSelect = (exercise: Exercise, roundIndex: number) => {
    const updatedRounds = [...rounds];
    const currentRound = updatedRounds[roundIndex];
    if (!currentRound.some((e) => e.id === exercise.id)) {
      updatedRounds[roundIndex] = [
        ...currentRound,
        { ...exercise, sets: 1, reps: 10 },
      ];
      setRounds(updatedRounds);
    }
  };

  const handleRemoveExercise = (roundIndex: number, exerciseIndex: number) => {
    const updatedRounds = [...rounds];
    updatedRounds[roundIndex] = updatedRounds[roundIndex].filter(
      (_, i) => i !== exerciseIndex
    );
    setRounds(updatedRounds);
  };

  const handleExerciseUpdate = (
    roundIndex: number,
    exerciseIndex: number,
    field: keyof SelectedExercise,
    value: number
  ) => {
    const updatedRounds = [...rounds];
    updatedRounds[roundIndex][exerciseIndex] = {
      ...updatedRounds[roundIndex][exerciseIndex],
      [field]: value,
    };
    setRounds(updatedRounds);
  };

  const addNewRound = () => {
    setRounds([...rounds, []]);
  };

  const removeRound = (roundIndex: number) => {
    const updatedRounds = rounds.filter((_, index) => index !== roundIndex);
    setRounds(updatedRounds);
  };

  const handleSaveWorkout = async () => {
    try {
      if (!workoutName) {
        toast.error("Please enter a workout name");
        return;
      }

      if (frequency.length === 0) {
        toast.error("Please select workout frequency");
        return;
      }

      if (rounds.some((round) => round.length === 0)) {
        toast.error("Please add at least one exercise to each round");
        return;
      }

      const exercises: WorkoutExercise[] = rounds.flatMap((round, roundIndex) =>
        round.map((exercise) => ({
          exercise_id: exercise.id,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight || null,
          duration: exercise.duration || null,
          round: String(roundIndex + 1),
        }))
      );

      const result = await createWorkout({
        name: workoutName,
        frequency: frequency.join(","),
        exercises: exercises as any,
      });

      if (!result?.data?.success) {
        toast.error(result?.data?.error || "Failed to save workout");
        return;
      }

      toast.success("Workout saved successfully");

      // Reset form
      setWorkoutName("");
      setFrequency([]);
      setRounds([[]]);
    } catch (error) {
      console.error("Save workout error:", error);
      toast.error("Failed to save workout");
    }
  };

  return (
    <div className="space-y-3 md:space-y-6 max-w-full px-4 md:px-6">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Give your workout a name"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          className="w-full p-3 border rounded text-base md:text-lg"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Workout Frequency</label>
          <ToggleGroup
            type="multiple"
            value={frequency}
            onValueChange={setFrequency}
            className="justify-start"
          >
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
              <ToggleGroupItem
                key={i}
                value={String(i + 1)}
                aria-label={`Day ${day}`}
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {day}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-base md:text-lg font-medium">
          Rounds: {rounds.length}
        </span>
        <Button onClick={addNewRound} className="text-sm md:text-base">
          Add Round
        </Button>
      </div>

      {rounds.map((round, roundIndex) => (
        <Card key={roundIndex} className="border-none">
          <CardContent className="p-3 md:p-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <span className="text-base md:text-lg font-medium">
                  Round {roundIndex + 1}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeRound(roundIndex)}
                  className="w-full md:w-auto"
                >
                  Remove Round
                </Button>
              </div>

              <ExercisesTable
                exercises={exercises}
                selectedExercises={round}
                onExerciseSelect={(exercise: Exercise & { gif_url?: string }) =>
                  handleExerciseSelect(exercise, roundIndex)
                }
                roundIndex={roundIndex}
              />

              {round.length > 0 && (
                <div className="w-full">
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[120px]">
                            Exercise
                          </TableHead>
                          <TableHead className="w-20">Sets</TableHead>
                          <TableHead className="w-20">Reps</TableHead>
                          <TableHead className="w-24">Weight</TableHead>
                          <TableHead className="w-24">Duration</TableHead>
                          <TableHead className="w-32"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {round.map((exercise, exerciseIndex) => (
                          <TableRow key={exerciseIndex}>
                            <TableCell className="min-w-[120px]">
                              <div className="space-y-1">
                                <div className="font-medium text-sm md:text-base">
                                  {exercise.name}
                                </div>
                                <div className="text-xs md:text-sm text-muted-foreground">
                                  {exercise.target}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {exercise.secondary_muscles.map((muscle) => (
                                    <Badge
                                      key={muscle}
                                      variant="outline"
                                      className="text-xs whitespace-nowrap"
                                    >
                                      {muscle}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={exercise.sets}
                                onChange={(e) =>
                                  handleExerciseUpdate(
                                    roundIndex,
                                    exerciseIndex,
                                    "sets",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-16 md:w-20 text-sm"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={exercise.reps}
                                onChange={(e) =>
                                  handleExerciseUpdate(
                                    roundIndex,
                                    exerciseIndex,
                                    "reps",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-16 md:w-20 text-sm"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={exercise.weight || ""}
                                onChange={(e) =>
                                  handleExerciseUpdate(
                                    roundIndex,
                                    exerciseIndex,
                                    "weight",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-16 md:w-20 text-sm"
                                placeholder="kg"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={exercise.duration || ""}
                                onChange={(e) =>
                                  handleExerciseUpdate(
                                    roundIndex,
                                    exerciseIndex,
                                    "duration",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-16 md:w-20 text-sm"
                                placeholder="sec"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleRemoveExercise(
                                    roundIndex,
                                    exerciseIndex
                                  )
                                }
                                className="text-xs whitespace-nowrap"
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="md:hidden space-y-4">
                    {round.map((exercise, exerciseIndex) => (
                      <Card key={exerciseIndex}>
                        <CardContent className="p-4 space-y-4">
                          <div className="space-y-2">
                            <div className="font-medium">{exercise.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {exercise.target}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {exercise.secondary_muscles.map((muscle) => (
                                <Badge
                                  key={muscle}
                                  variant="outline"
                                  className="text-xs whitespace-nowrap"
                                >
                                  {muscle}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Sets
                              </label>
                              <Input
                                type="number"
                                value={exercise.sets}
                                onChange={(e) =>
                                  handleExerciseUpdate(
                                    roundIndex,
                                    exerciseIndex,
                                    "sets",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-full text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Reps
                              </label>
                              <Input
                                type="number"
                                value={exercise.reps}
                                onChange={(e) =>
                                  handleExerciseUpdate(
                                    roundIndex,
                                    exerciseIndex,
                                    "reps",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-full text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Weight (kg)
                              </label>
                              <Input
                                type="number"
                                value={exercise.weight || ""}
                                onChange={(e) =>
                                  handleExerciseUpdate(
                                    roundIndex,
                                    exerciseIndex,
                                    "weight",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-full text-sm"
                                placeholder="kg"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Duration (sec)
                              </label>
                              <Input
                                type="number"
                                value={exercise.duration || ""}
                                onChange={(e) =>
                                  handleExerciseUpdate(
                                    roundIndex,
                                    exerciseIndex,
                                    "duration",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-full text-sm"
                                placeholder="sec"
                              />
                            </div>
                          </div>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleRemoveExercise(roundIndex, exerciseIndex)
                            }
                            className="w-full text-xs"
                          >
                            Remove
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        className="w-full py-4 text-base md:text-lg font-medium"
        onClick={handleSaveWorkout}
      >
        Save Workout
      </Button>
    </div>
  );
}
