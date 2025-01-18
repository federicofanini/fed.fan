"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/actions/types/action-response";
import { appErrors } from "@/actions/types/errors";
import { prisma } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
});

export const subscribeAction = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      // Check if email already exists
      const existingSubscriber = await prisma.waitlist.findFirst({
        where: {
          email: input.parsedInput.email,
        },
      });

      if (existingSubscriber) {
        return {
          success: false,
          error: "This email is already subscribed",
        };
      }

      const waitlistEntry = await prisma.waitlist.create({
        data: {
          id: crypto.randomUUID(),
          email: input.parsedInput.email,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      revalidatePath("/");

      return {
        success: true,
        data: waitlistEntry,
      };
    } catch (error) {
      console.error("Subscribe error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
