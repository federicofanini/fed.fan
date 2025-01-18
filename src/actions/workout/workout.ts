"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

const exerciseSchema = z.object({
  exercise_id: z.string(),
  sets: z.number().min(1),
  reps: z.number().min(1),
  weight: z.number().nullable(),
  duration: z.number().nullable(),
  round: z.string().nullable(),
});

const schema = z.object({
  name: z.string().min(1, "Workout name is required"),
  exercises: z
    .array(exerciseSchema)
    .min(1, "At least one exercise is required"),
  frequency: z.string(),
});

export async function getWorkouts(): Promise<ActionResponse> {
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

    const workouts = await prisma.workout.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      success: true,
      data: workouts,
    };
  } catch (error) {
    return {
      success: false,
      error: appErrors.UNEXPECTED_ERROR,
    };
  }
}

export const createWorkout = createSafeActionClient()
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

      const workout = await prisma.workout.create({
        data: {
          id: crypto.randomUUID(),
          user_id: user.id,
          name: input.parsedInput.name,
          frequency: input.parsedInput.frequency,
          selected: true,
          created_at: new Date(),
          updated_at: new Date(),
          exercises: {
            create: input.parsedInput.exercises.map((exercise) => ({
              id: crypto.randomUUID(),
              exercise_id: exercise.exercise_id,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight,
              round: exercise.round || null,
              duration: exercise.duration,
              created_at: new Date(),
              updated_at: new Date(),
            })),
          },
        },
        include: {
          exercises: {
            include: {
              exercise: true,
            },
          },
        },
      });

      // Revalidate the cache for the user's selected workout
      revalidateTag(`selected-workout-${user.id}`);
      revalidateTag(`workouts-by-day-${user.id}`);
      revalidatePath("/blackboard/workout");

      return {
        success: true,
        data: workout,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
