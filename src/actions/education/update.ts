"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import prisma from "@/lib/db";
import type { ActionResponse } from "@/actions/types/action-response";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

const schema = z.object({
  school: z.string(),
  degree: z.string(),
  field_of_study: z.string(),
  start_date: z.string(),
  end_date: z.string().optional(),
  description: z.string().optional(),
});

export const updateEducationAction = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();

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

      // Create new education entry in database
      const newEducation = await prisma.education.create({
        data: {
          user_id: user.id,
          school: input.parsedInput.school,
          degree: input.parsedInput.degree,
          field_of_study: input.parsedInput.field_of_study,
          start_date: new Date(input.parsedInput.start_date),
          end_date: new Date(input.parsedInput.end_date || ""),
        },
      });

      return {
        success: true,
        data: newEducation,
      };
    } catch (error) {
      console.error("Education creation error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
