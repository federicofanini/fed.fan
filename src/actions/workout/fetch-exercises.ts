import { Cron } from "@/lib/cron";
import { prisma } from "@/lib/db";
import { EXERCISE_API_CONFIG } from "@/app/exercises/config";
import { appErrors } from "../types/errors";
import type { ActionResponse } from "../types/action-response";
import { createClient } from "@/utils/supabase/server";
import { getExercises } from "./get-exercises";
import { revalidateTag } from "next/cache";
import { getUser } from "@/utils/supabase/database/cached-queries";

// Create a cron job that runs at 12:00 PM CST every day
export const exerciseFetchCron = new Cron(
  "0 12 * * *",
  "America/Chicago",
  async (): Promise<ActionResponse> => {
    try {
      // Fetch data directly from the API
      const response = await fetch(
        `${EXERCISE_API_CONFIG.baseUrl}/exercises?limit=0`,
        {
          headers: EXERCISE_API_CONFIG.headers,
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const exercises = await response.json();

      // Process exercises in batches of 50
      const BATCH_SIZE = 50;
      for (let i = 0; i < exercises.length; i += BATCH_SIZE) {
        const batch = exercises.slice(i, i + BATCH_SIZE);

        await prisma.$transaction(
          batch.map((exercise: any) =>
            prisma.exercises.upsert({
              where: { id: exercise.id },
              update: {
                gif_url: exercise.gifUrl,
                updated_at: new Date(),
              },
              create: {
                id: crypto.randomUUID(),
                name: exercise.name,
                body_part: exercise.bodyPart,
                equipment: exercise.equipment,
                gif_url: exercise.gifUrl,
                target: exercise.target,
                secondary_muscles: exercise.secondaryMuscles,
                instructions: exercise.instructions,
              },
            })
          )
        );

        // Add delay between batches to prevent rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Update cached exercises
      const supabase = await createClient();
      const user = await getUser();
      await getExercises(supabase);
      revalidateTag("exercises");
      if (user) {
        revalidateTag(`workouts-by-day-${user.id}`);
      }

      return {
        success: true,
        data: exercises,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  }
);

// Start the cron job
exerciseFetchCron.start();
