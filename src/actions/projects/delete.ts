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

export const deleteProjectAction = createSafeActionClient()
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

      // Verify project belongs to user before deleting
      const project = await prisma.projects.findFirst({
        where: {
          id: input.parsedInput.id,
          user_id: user.id,
        },
      });

      if (!project) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      // Delete project from database
      await prisma.projects.delete({
        where: {
          id: input.parsedInput.id,
        },
      });

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      console.error("Project deletion error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
