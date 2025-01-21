"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import prisma from "@/lib/db";
import type { ActionResponse } from "@/actions/types/action-response";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

const schema = z.object({
  category: z.string(),
  subcategory: z.string(),
  item: z.string(),
});

export const updateStackAction = createSafeActionClient()
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

      // Create new stack entry in database
      const newStack = await prisma.stack.create({
        data: {
          user_id: user.id,
          category: input.parsedInput.category,
          subcategory: input.parsedInput.subcategory,
          item: input.parsedInput.item,
        },
      });

      return {
        success: true,
        data: newStack,
      };
    } catch (error) {
      console.error("Stack creation error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
