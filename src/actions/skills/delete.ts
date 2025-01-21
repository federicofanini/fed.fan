"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import prisma from "@/lib/db";
import type { ActionResponse } from "@/actions/types/action-response";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

const schema = z.object({
  id: z.string(),
});

export const deleteSkillAction = createSafeActionClient()
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

      // Verify skill belongs to user before deleting
      const skill = await prisma.skills.findFirst({
        where: {
          id: input.parsedInput.id,
          user_id: user.id,
        },
      });

      if (!skill) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      // Delete skill from database
      await prisma.skills.delete({
        where: {
          id: input.parsedInput.id,
        },
      });

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      console.error("Skill deletion error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
