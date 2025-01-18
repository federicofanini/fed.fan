"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types/action-response";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

// Empty schema since we don't need input validation for fetch
const schema = z.object({});

export const fetchUserProfileAction = createSafeActionClient()
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

      // Fetch user profile from database
      const userProfile = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          email: true,
          full_name: true,
          avatar_url: true,
          bio: true,
          location: true,
          website: true,
          twitter: true,
          linkedin: true,
          github: true,
          instagram: true,
          youtube: true,
          tiktok: true,
          discord: true,
          telegram: true,
          bsky: true,
          contactEmail: true,
          username: true,
        },
      });

      if (!userProfile) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      return {
        success: true,
        data: userProfile,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
