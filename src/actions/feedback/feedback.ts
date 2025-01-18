"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { Client } from "@/utils/supabase/type";

const schema = z.object({
  message: z.string().min(10).max(1000),
  rating: z.number().min(1).max(5),
  category: z.enum([
    "bug",
    "feature-request",
    "general",
    "question",
    "performance",
  ]),
});

export const createFeedback = createSafeActionClient()
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

      const feedback = await prisma.feedback.create({
        data: {
          id: crypto.randomUUID(),
          user_id: user.id,
          message: input.parsedInput.message,
          rating: input.parsedInput.rating,
          category: input.parsedInput.category,
          status: "pending",
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Revalidate the feedback page after creating new feedback
      revalidatePath("/blackboard/feedback");

      return {
        success: true,
        data: feedback,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });

export async function getFeedbacks(supabase: Client): Promise<ActionResponse> {
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

  const feedbacks = await prisma.feedback.findMany({
    include: {
      user: {
        select: {
          full_name: true,
          avatar_url: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return {
    success: true,
    data: feedbacks,
  };
}

export async function revalidateFeedbackCache(): Promise<ActionResponse> {
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

    // Revalidate the cache tag for this user's feedbacks
    revalidateTag(`feedbacks_${user.id}`);
    revalidatePath("/blackboard/feedback");

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      error: appErrors.UNEXPECTED_ERROR,
    };
  }
}
