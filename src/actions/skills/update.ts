"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import prisma from "@/lib/db";
import type { ActionResponse } from "@/actions/types/action-response";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

const schema = z.object({
  skill_id: z.string(),
  level: z.number().min(1).max(5),
  category: z.string(),
});

export const updateSkillAction = createSafeActionClient()
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

      // Create new skill in database
      const newSkill = await prisma.skills.create({
        data: {
          user_id: user.id,
          skill_id: input.parsedInput.skill_id,
          level: input.parsedInput.level,
          category: input.parsedInput.category,
        },
      });

      return {
        success: true,
        data: newSkill,
      };
    } catch (error) {
      console.error("Skill creation error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
