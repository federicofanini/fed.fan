"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "@/actions/types/action-response";
import prisma from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "@/actions/types/errors";
import { pinata } from "./pinata";

const schema = z.object({
  fileId: z.string(),
});

export const deleteImage = createSafeActionClient()
  .schema(schema)
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

      // Delete from Pinata
      await pinata.files.delete([parsedInput.fileId]);

      // Update user profile
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          avatar_url: null,
        },
      });

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      console.error("Delete error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
