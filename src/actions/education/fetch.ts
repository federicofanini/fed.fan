"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types/action-response";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

// Empty schema since we don't need input validation for fetch
const schema = z.object({});

export const fetchUserEducationAction = createSafeActionClient()
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

      // Fetch user education from database
      const userEducation = await prisma.education.findMany({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
          school: true,
          degree: true,
          field_of_study: true,
          start_date: true,
          end_date: true,
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
        data: userEducation,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
