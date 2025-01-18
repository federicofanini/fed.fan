"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "@/actions/types/action-response";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

const schema = z.object({
  username: z.string().min(3).max(30),
});

export const updateUsernameAction = createSafeActionClient()
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

      // Check if username is already taken
      const existingUser = await prisma.user.findUnique({
        where: {
          username: input.parsedInput.username,
        },
      });

      if (existingUser) {
        return {
          success: false,
          error: "Username is already taken",
        };
      }

      // Update username in database
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          username: input.parsedInput.username,
        },
      });

      return {
        success: true,
        data: updatedUser,
      };
    } catch (error) {
      console.error("Username update error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
