"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";

const schema = z.object({
  height: z.string().transform((val) => parseFloat(val) || null),
  weight: z.string().transform((val) => parseFloat(val) || null),
  sleep: z.enum(["less-6", "6-7", "7-8", "more-8"]).nullable(),
  alcohol: z.enum(["none", "1-3", "4-7", "more"]).nullable(),
  sugarIntake: z.enum(["low", "moderate", "high"]).nullable(),
  isSmoker: z.boolean().nullable(),
});

export async function getHealthProfile(): Promise<ActionResponse> {
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

    const healthProfile = await prisma.health_profile.findUnique({
      where: {
        user_id: user.id,
      },
    });

    return {
      success: true,
      data: healthProfile,
    };
  } catch (error) {
    return {
      success: false,
      error: appErrors.UNEXPECTED_ERROR,
    };
  }
}

export const updateHealthProfile = createSafeActionClient()
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

      const healthProfile = await prisma.health_profile.upsert({
        where: {
          user_id: user.id,
        },
        update: {
          height: input.parsedInput.height,
          weight: input.parsedInput.weight,
          sleep_hours: input.parsedInput.sleep,
          alcohol: input.parsedInput.alcohol,
          sugar_intake: input.parsedInput.sugarIntake,
          is_smoker: input.parsedInput.isSmoker,
          updated_at: new Date(),
        },
        create: {
          id: crypto.randomUUID(),
          user_id: user.id,
          height: input.parsedInput.height,
          weight: input.parsedInput.weight,
          sleep_hours: input.parsedInput.sleep,
          alcohol: input.parsedInput.alcohol,
          sugar_intake: input.parsedInput.sugarIntake,
          is_smoker: input.parsedInput.isSmoker,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      return {
        success: true,
        data: healthProfile,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
