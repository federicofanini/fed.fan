"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import prisma from "@/lib/db";
import type { ActionResponse } from "@/actions/types/action-response";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

const schema = z.object({
  email: z.string().email(),
  full_name: z.string(),
  avatar_url: z.string().nullable(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  website: z.string().nullable(),
  twitter: z.string().nullable(),
  linkedin: z.string().nullable(),
  github: z.string().nullable(),
  instagram: z.string().nullable(),
  youtube: z.string().nullable(),
  tiktok: z.string().nullable(),
  discord: z.string().nullable(),
  telegram: z.string().nullable(),
  bsky: z.string().nullable(),
  contactEmail: z.string().nullable(),
});

export const updateProfileAction = createSafeActionClient()
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

      // Update user profile in database
      const updatedProfile = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: input.parsedInput.email,
          full_name: input.parsedInput.full_name,
          avatar_url: input.parsedInput.avatar_url,
          bio: input.parsedInput.bio,
          location: input.parsedInput.location,
          website: input.parsedInput.website,
          twitter: input.parsedInput.twitter,
          linkedin: input.parsedInput.linkedin,
          github: input.parsedInput.github,
          instagram: input.parsedInput.instagram,
          youtube: input.parsedInput.youtube,
          tiktok: input.parsedInput.tiktok,
          discord: input.parsedInput.discord,
          telegram: input.parsedInput.telegram,
          bsky: input.parsedInput.bsky,
          contactEmail: input.parsedInput.contactEmail,
          updated_at: new Date(),
        },
      });

      return {
        success: true,
        data: updatedProfile,
      };
    } catch (error) {
      console.error("Profile update error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
