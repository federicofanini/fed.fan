"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";

const schema = z.object({
  workoutId: z.string(),
});

export const deleteWorkout = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return {
          success: false,
          error: appErrors.UNAUTHORIZED,
        };
      }

      // First verify the workout exists and belongs to user
      const workout = await prisma.workout.findFirst({
        where: {
          id: input.parsedInput.workoutId,
          user_id: user.id,
        },
      });

      if (!workout) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      // Delete all completed sets for the workout exercises
      await prisma.completed_set.deleteMany({
        where: {
          workout_exercise: {
            workout_id: input.parsedInput.workoutId,
          },
        },
      });

      // Delete all workout exercises
      await prisma.workout_exercise.deleteMany({
        where: {
          workout_id: input.parsedInput.workoutId,
        },
      });

      // Finally delete the workout
      await prisma.workout.delete({
        where: {
          id: input.parsedInput.workoutId,
          user_id: user.id,
        },
      });

      return {
        success: true,
        data: { success: true },
      };
    } catch (error) {
      console.error("Error deleting workout:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
