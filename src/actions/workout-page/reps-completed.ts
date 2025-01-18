"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";

const saveRepsSchema = z.object({
  workoutExerciseId: z.string(),
  userId: z.string(),
  completedReps: z.number().min(0),
  setNumber: z.number().min(1),
});

const getStatsSchema = z.object({
  userId: z.string(),
});

const getWorkoutStatsSchema = z.object({
  workoutId: z.string(),
  userId: z.string(),
});

export const saveCompletedReps = createSafeActionClient()
  .schema(saveRepsSchema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const completedSet = await prisma.completed_set.create({
        data: {
          workout_exercise_id: parsedInput.workoutExerciseId,
          user_id: parsedInput.userId,
          completed_reps: parsedInput.completedReps,
          set_number: parsedInput.setNumber,
        },
      });

      return {
        success: true,
        data: completedSet,
      };
    } catch (error) {
      console.error("Error saving completed reps:", error);
      return {
        success: false,
        error: "Failed to save completed reps",
      };
    }
  });

export const getCompletedStats = createSafeActionClient()
  .schema(getStatsSchema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const stats = await prisma.completed_set.findMany({
        where: {
          user_id: parsedInput.userId,
        },
        include: {
          workout_exercise: {
            include: {
              exercise: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      const totalReps = stats.reduce((sum, set) => sum + set.completed_reps, 0);
      const totalSets = stats.length;
      const exerciseCount = new Set(
        stats.map((set) => set.workout_exercise.exercise_id)
      ).size;

      return {
        success: true,
        data: {
          completedSets: stats,
          summary: {
            totalReps,
            totalSets,
            uniqueExercises: exerciseCount,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching completed stats:", error);
      return {
        success: false,
        error: "Failed to fetch completed stats",
      };
    }
  });

export const getWorkoutStats = createSafeActionClient()
  .schema(getWorkoutStatsSchema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const stats = await prisma.completed_set.findMany({
        where: {
          user_id: parsedInput.userId,
          workout_exercise: {
            workout_id: parsedInput.workoutId,
          },
        },
        include: {
          workout_exercise: {
            include: {
              exercise: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      const totalReps = stats.reduce((sum, set) => sum + set.completed_reps, 0);
      const totalSets = stats.length;
      const exerciseCount = new Set(
        stats.map((set) => set.workout_exercise.exercise_id)
      ).size;

      return {
        success: true,
        data: {
          completedSets: stats,
          summary: {
            totalReps,
            totalSets,
            uniqueExercises: exerciseCount,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching workout stats:", error);
      return {
        success: false,
        error: "Failed to fetch workout stats",
      };
    }
  });
