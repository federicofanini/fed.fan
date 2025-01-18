"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { revalidateTag, revalidatePath } from "next/cache";

const schema = z.object({
  workoutId: z.string(),
});

export const selectWorkout = createSafeActionClient()
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

      // Get current workout state
      const currentWorkout = await prisma.workout.findUnique({
        where: {
          id: input.parsedInput.workoutId,
          user_id: user.id,
        },
        select: {
          selected: true,
        },
      });

      if (!currentWorkout) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      // Toggle the selected state
      await prisma.workout.update({
        where: {
          id: input.parsedInput.workoutId,
          user_id: user.id,
        },
        data: {
          selected: !currentWorkout.selected,
        },
      });

      // Revalidate the cache tag for this user's selected workout
      revalidateTag(`selected-workout-${user.id}`);
      revalidateTag(`workouts-by-day-${user.id}`);
      revalidatePath("/blackboard/workout");

      return {
        success: true,
        data: { selected: !currentWorkout.selected },
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
