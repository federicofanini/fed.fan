"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "@/actions/types/action-response";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

const schema = z.object({
  input: z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(1, "Description is required"),
    url: z.string().url("Must be a valid URL"),
    image_url: z.string(),
    category: z.string(),
    status: z.string(),
    tech_stack: z.string(),
    tags: z.string(),
  }),
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
        console.error("Authentication error:", authError);
        return {
          success: false,
          error: appErrors.UNAUTHORIZED,
        };
      }

      // Create new project in database
      const newProject = await prisma.projects.create({
        data: {
          user_id: user.id,
          name: input.parsedInput.input.name,
          description: input.parsedInput.input.description,
          url: input.parsedInput.input.url,
          image_url: input.parsedInput.input.image_url,
          category: input.parsedInput.input.category,
          status: input.parsedInput.input.status,
          tech_stack: input.parsedInput.input.tech_stack,
          tags: input.parsedInput.input.tags,
        },
      });

      return {
        success: true,
        data: newProject,
      };
    } catch (error) {
      console.error("Project creation error:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
