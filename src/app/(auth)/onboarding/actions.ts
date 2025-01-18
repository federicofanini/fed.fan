"use server";

import { PrismaClient } from "@prisma/client";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "@/actions/types/action-response";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

const createProfileSchema = z.object({
  fullName: z.string().min(1),
});

export const createUserProfile = createSafeActionClient()
  .schema(createProfileSchema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      const { fullName } = parsedInput;
      const supabase = await createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return { success: false, error: "No authenticated user found" };
      }

      // First check if user exists
      const existingUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      const now = new Date();

      let profile;
      if (existingUser) {
        // Update existing user
        profile = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            full_name: fullName,
            updated_at: now,
          },
        });
      } else {
        // Insert new user
        profile = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email!,
            full_name: fullName,
            created_at: now,
            updated_at: now,
          },
        });
      }

      return { success: true, data: profile };
    } catch (error) {
      console.error("Error creating/updating user profile:", error);
      return { success: false, error: "Unexpected error occurred" };
    }
  });

export async function getUserFullName() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Not authenticated");
    }

    const profile = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        full_name: true,
      },
    });

    return profile?.full_name || null;
  } catch (error) {
    console.error("Error getting user full name:", error);
    return null;
  }
}
