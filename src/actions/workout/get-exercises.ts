"use server";

import { Client } from "@/utils/supabase/type";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";
import { EXERCISE_API_CONFIG } from "@/app/exercises/config";
import { createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";
import { getUser } from "@/utils/supabase/database/cached-queries";

export async function getExercises(supabase: Client): Promise<ActionResponse> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: appErrors.UNAUTHORIZED,
    };
  }

  try {
    const BATCH_SIZE = 100; // Process in smaller batches
    let allExercises: any[] = [];
    let skip = 0;

    // Get total count first
    const totalCount = await prisma.exercises.count();

    // Fetch data in batches
    while (skip < totalCount) {
      const batch = await prisma.exercises.findMany({
        select: {
          id: true,
          name: true,
          body_part: true,
          equipment: true,
          gif_url: true,
          target: true,
          secondary_muscles: true,
          instructions: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: {
          name: "asc",
        },
        take: BATCH_SIZE,
        skip: skip,
      });

      allExercises = [...allExercises, ...batch];
      skip += BATCH_SIZE;

      // Add small delay between batches to prevent rate limiting
      if (skip < totalCount) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return {
      success: true,
      data: allExercises,
    };
  } catch (error) {
    return {
      success: false,
      error: appErrors.UNEXPECTED_ERROR,
    };
  }
}

export async function seedExercises(): Promise<ActionResponse> {
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

    // Process exercises in batches of 100
    const BATCH_SIZE = 100;
    for (let i = 0; i < exercises.length; i += BATCH_SIZE) {
      const batch = exercises.slice(i, i + BATCH_SIZE);

      await prisma.$transaction(
        batch.map((exercise: any) =>
          prisma.exercises.create({
            data: {
              id: exercise.id,
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
