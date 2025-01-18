"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "@/actions/types/action-response";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: number | null;
  category: string;
}

interface ExerciseCheckboxProps {
  sectionId: string;
  exercise: Exercise;
}

const schema = z.object({
  exerciseId: z.string(),
  sectionId: z.string(),
  completed: z.boolean(),
});

const toggleExerciseCompletion = createSafeActionClient()
  .schema(schema)
  .action(
    async ({
      parsedInput: { exerciseId, sectionId, completed },
    }): Promise<ActionResponse> => {
      try {
        // Here you would update the exercise completion status in your database
        // For example:
        // await db.exerciseProgress.upsert({
        //   where: { exerciseId },
        //   update: { completed },
        //   create: { exerciseId, completed }
        // });

        return {
          success: true,
          data: { exerciseId, completed },
        };
      } catch (error) {
        return {
          success: false,
          error: "Failed to update exercise completion status",
        };
      }
    }
  );

export function ExerciseCheckbox({
  sectionId,
  exercise,
}: ExerciseCheckboxProps) {
  const handleCheckedChange = async (checked: boolean) => {
    await toggleExerciseCompletion({
      exerciseId: exercise.id,
      sectionId,
      completed: checked,
    });
  };

  return (
    <Checkbox
      id={exercise.id}
      onCheckedChange={handleCheckedChange}
      className="data-[state=checked]:bg-green-500"
    />
  );
}
