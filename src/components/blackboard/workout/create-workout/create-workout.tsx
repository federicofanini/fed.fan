"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, MoveUp, MoveDown } from "lucide-react";
import { createWorkout } from "@/actions/workout/workout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscles: string[];
  outcomes: string[];
}

interface SelectedExercise extends Exercise {
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  round?: string;
}

interface ConfigureWorkoutProps {
  selectedExercises: SelectedExercise[];
  workoutName: string;
  onWorkoutNameChange: (name: string) => void;
  onExerciseUpdate: (
    index: number,
    field: keyof SelectedExercise,
    value: number
  ) => void;
  onRemoveExercise: (index: number) => void;
  onMoveExercise: (index: number, direction: "up" | "down") => void;
  onBack: () => void;
  onSave: () => void;
}

export function ConfigureWorkout({
  selectedExercises,
  workoutName,
  onWorkoutNameChange,
  onExerciseUpdate,
  onRemoveExercise,
  onMoveExercise,
  onBack,
  onSave,
}: ConfigureWorkoutProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(["1"]);
  const [rounds, setRounds] = useState(1);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const exercisesWithRounds = selectedExercises.map((exercise, index) => ({
        exercise_id: exercise.id,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight || null,
        duration: exercise.duration || null,
        round: Math.floor(
          index / (selectedExercises.length / rounds)
        ).toString(),
      }));

      const result = await createWorkout({
        name: workoutName,
        exercises: exercisesWithRounds,
        frequency: selectedDays.join(",") as
          | "1"
          | "2"
          | "3"
          | "4"
          | "5"
          | "6"
          | "7",
      });

      if (!result?.data?.success) {
        toast.error("Failed to save workout");
        return;
      }

      toast.success("Workout saved successfully");
      router.push("/blackboard/workouts");
      router.refresh();
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="workout-name">Workout Name</Label>
              <Input
                id="workout-name"
                value={workoutName}
                onChange={(e) => onWorkoutNameChange(e.target.value)}
                placeholder="Enter workout name"
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="rounds">Number of Rounds</Label>
              <Input
                id="rounds"
                type="number"
                min={1}
                value={rounds}
                onChange={(e) =>
                  setRounds(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full"
              />
            </div>

            <div>
              <Label>Workout Days</Label>
              <ToggleGroup
                type="multiple"
                value={selectedDays}
                onValueChange={setSelectedDays}
                className="justify-start"
              >
                {[
                  { label: "M", value: "1" },
                  { label: "T", value: "2" },
                  { label: "W", value: "3" },
                  { label: "T", value: "4" },
                  { label: "F", value: "5" },
                  { label: "S", value: "6" },
                  { label: "S", value: "7" },
                ].map((day) => (
                  <ToggleGroupItem
                    key={day.value}
                    value={day.value}
                    aria-label={`${day.label}`}
                    className="w-10"
                  >
                    {day.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Configure Exercises</h3>
          <div className="space-y-4">
            {selectedExercises.map((exercise, index) => (
              <div
                key={`${exercise.id}-${index}`}
                className="grid grid-cols-1 sm:grid-cols-6 gap-4 border p-4 rounded-lg"
              >
                {/* Col 1: Exercise name and move controls */}
                <div className="w-full grid grid-cols-6 justify-between items-center sm:flex sm:items-center sm:gap-2 sm:justify-start sm:col-span-1">
                  <div className="flex justify-start col-span-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onMoveExercise(index, "up")}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onMoveExercise(index, "down")}
                      disabled={index === selectedExercises.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="font-medium text-center col-span-4">
                    {exercise.name}
                    <span className="ml-2 text-sm text-muted-foreground">
                      (Round{" "}
                      {Math.floor(index / (selectedExercises.length / rounds)) +
                        1}
                      )
                    </span>
                  </span>
                  <div className="flex justify-end sm:hidden col-span-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveExercise(index)}
                      className="text-red-500 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Col 2: Exercise configuration */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 col-span-4">
                  <div className="flex flex-col gap-2">
                    <Label>Sets</Label>
                    <Input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) =>
                        onExerciseUpdate(
                          index,
                          "sets",
                          parseInt(e.target.value)
                        )
                      }
                      min={1}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Reps</Label>
                    <Input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) =>
                        onExerciseUpdate(
                          index,
                          "reps",
                          parseInt(e.target.value)
                        )
                      }
                      min={1}
                    />
                  </div>

                  {exercise.category !== "Cardio" && (
                    <div className="flex flex-col gap-2">
                      <Label>Weight (kg)</Label>
                      <Input
                        type="number"
                        value={exercise.weight || ""}
                        onChange={(e) =>
                          onExerciseUpdate(
                            index,
                            "weight",
                            parseInt(e.target.value)
                          )
                        }
                        placeholder="Optional"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <Label>Duration (s)</Label>
                    <Input
                      type="number"
                      value={exercise.duration || ""}
                      onChange={(e) =>
                        onExerciseUpdate(
                          index,
                          "duration",
                          parseInt(e.target.value)
                        )
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>

                {/* Col 3: Remove button */}
                <div className=" justify-end hidden sm:flex sm:col-span-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveExercise(index)}
                    className="text-red-500 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="w-full sm:w-auto"
              >
                Back
              </Button>
              <Button
                className="w-full sm:flex-1"
                onClick={handleSave}
                disabled={
                  !workoutName || selectedExercises.length === 0 || isSaving
                }
              >
                {isSaving ? "Saving..." : "Save Workout"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
