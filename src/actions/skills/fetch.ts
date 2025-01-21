"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types/action-response";
import prisma from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

// Empty schema since we don't need input validation for fetch
const schema = z.object({});

export const fetchUserSkillsAction = createSafeActionClient()
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

      // Fetch user skills from database
      const userSkills = await prisma.skills.findMany({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
          category: true,
          skill_id: true,
          level: true,
        },
        orderBy: {
          created_at: "desc",
        },
        cacheStrategy: {
          ttl: 60, // 1 minute
        },
      });

      return {
        success: true,
        data: userSkills,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
