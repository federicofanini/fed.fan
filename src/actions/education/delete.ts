"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "@/actions/types/action-response";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

const schema = z.object({
  id: z.string(),
});

export const deleteEducationAction = createSafeActionClient()
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

      // Verify education belongs to user before deleting
      const education = await prisma.education.findFirst({
        where: {
          id: input.parsedInput.id,
          user_id: user.id,
        },
      });

      if (!education) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      // Delete education from database
      await prisma.education.delete({
        where: {
          id: input.parsedInput.id,
        },
      });

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      console.error("Education deletion error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
