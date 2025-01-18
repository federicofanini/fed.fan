"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "@/actions/types/action-response";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

const schema = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string(),
  image_url: z.string(),
});

export const updateProjectAction = createSafeActionClient()
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

      // Create new project in database
      const newProject = await prisma.projects.create({
        data: {
          user_id: user.id,
          name: input.parsedInput.name,
          description: input.parsedInput.description,
          url: input.parsedInput.url,
          image_url: input.parsedInput.image_url,
        },
      });

      return {
        success: true,
        data: newProject,
      };
    } catch (error) {
      console.error("Project creation error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
