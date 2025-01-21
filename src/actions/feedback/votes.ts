"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";

const schema = z.object({
  feedbackId: z.string().uuid(),
  voteType: z.enum(["upvote", "downvote"]),
});

export const voteFeedback = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();

      // Get current user
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

      // Get the feedback
      const feedback = await prisma.feedback.findUnique({
        where: {
          id: input.parsedInput.feedbackId,
        },
      });

      if (!feedback) {
        return {
          success: false,
          error: "Feedback not found",
        };
      }

      // Check if the user is trying to vote on their own feedback
      if (feedback.user_id === user.id) {
        return {
          success: false,
          error: "Cannot vote on your own feedback",
        };
      }

      const isUpvote = input.parsedInput.voteType === "upvote";

      // Update feedback using Prisma
      const updatedFeedback = await prisma.feedback.update({
        where: {
          id: input.parsedInput.feedbackId,
        },
        data: {
          upvotes: isUpvote ? feedback.upvotes + 1 : feedback.upvotes - 1,
        },
      });

      return {
        success: true,
        data: updatedFeedback,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
