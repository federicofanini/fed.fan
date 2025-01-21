"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types/action-response";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

const schema = z.object({});

export const fetchAvatarUrlAction = createSafeActionClient()
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

      const profile = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          avatar_url: true,
        },
        cacheStrategy: {
          ttl: 60 * 5, // 5 minutes
        },
      });

      if (!profile) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      return {
        success: true,
        data: profile.avatar_url,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
