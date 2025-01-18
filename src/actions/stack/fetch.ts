"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types/action-response";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

// Empty schema since we don't need input validation for fetch
const schema = z.object({});

export const fetchUserStackAction = createSafeActionClient()
  .schema(schema)
  .action(async (): Promise<ActionResponse> => {
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

      // Fetch user stack from database
      const userStack = await prisma.stack.findMany({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
          stack: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      return {
        success: true,
        data: userStack,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
