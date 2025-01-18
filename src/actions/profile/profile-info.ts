"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "../types/action-response";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";

const profileInfoSchema = z.object({
  full_name: z.string().min(1),
  bio: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  twitter: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  github: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  youtube: z.string().optional().or(z.literal("")),
  tiktok: z.string().optional().or(z.literal("")),
  discord: z.string().optional().or(z.literal("")),
  telegram: z.string().optional().or(z.literal("")),
  bsky: z.string().optional().or(z.literal("")),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/),
});

export const getUserInfo = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
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

      const userData = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!userData) {
        return {
          success: false,
          error: appErrors.DATABASE_ERROR,
        };
      }

      return {
        success: true,
        data: userData,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  }
);

export const checkUsernameAvailability = createSafeActionClient()
  .schema(z.object({ username: z.string() }))
  .action(
    async ({
      parsedInput,
    }): Promise<ActionResponse<{ available: boolean }>> => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            username: parsedInput.username,
          },
        });

        return {
          success: true,
          data: { available: !user },
        };
      } catch (error) {
        return {
          success: false,
          error: appErrors.UNEXPECTED_ERROR,
        };
      }
    }
  );

export const updateProfileInfo = createSafeActionClient()
  .schema(profileInfoSchema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
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

      // Check username availability before update if username is changed
      const existingUser = await prisma.user.findFirst({
        where: {
          username: parsedInput.username,
          NOT: {
            id: user.id,
          },
        },
      });

      if (existingUser) {
        return {
          success: false,
          error: "Username is already taken",
        };
      }

      // Update profile information in the database
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          full_name: parsedInput.full_name || "",
          bio: parsedInput.bio || "",
          location: parsedInput.location || "",
          website: parsedInput.website || "",
          contactEmail: parsedInput.contactEmail || "",
          twitter: parsedInput.twitter || "",
          linkedin: parsedInput.linkedin || "",
          github: parsedInput.github || "",
          instagram: parsedInput.instagram || "",
          youtube: parsedInput.youtube || "",
          tiktok: parsedInput.tiktok || "",
          discord: parsedInput.discord || "",
          telegram: parsedInput.telegram || "",
          bsky: parsedInput.bsky || "",
          username: parsedInput.username,
          updated_at: new Date(),
        },
      });

      return {
        success: true,
        data: { message: "Profile updated successfully" },
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
