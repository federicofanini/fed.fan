"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";

const schema = z.object({
  frequency: z.string(),
});

export const setWorkoutFrequency = createSafeActionClient()
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

      await prisma.workout_frequency.upsert({
        where: {
          user_id: user.id,
        },
        update: {
          frequency: input.parsedInput.frequency,
        },
        create: {
          user_id: user.id,
          frequency: input.parsedInput.frequency,
        },
      });

      // Revalidate the cache for the user's workout frequency
      revalidateTag(`workout-frequency-${user.id}`);

      return {
        success: true,
        data: { success: true },
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
