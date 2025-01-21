"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "@/actions/types/action-response";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

const schema = z.object({});

export const fetchUsernameAction = createSafeActionClient()
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

      // Fetch username from database
      const userData = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          username: true,
        },
        cacheStrategy: {
          ttl: 60, // 1 minute
        },
      });

      return {
        success: true,
        data: userData,
      };
    } catch (error) {
      console.error("Username fetch error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
