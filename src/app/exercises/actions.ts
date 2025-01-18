"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { BODY_PARTS } from "./config";
import type { ActionResponse } from "@/actions/types/action-response";

export interface ExercisesResponse {
  success: boolean;
  data?: {
    id: string;
    name: string;
    body_part: string;
    equipment: string;
    gif_url: string;
    target: string;
    secondary_muscles: string[];
    instructions: string[];
    created_at: Date;
    updated_at: Date;
  }[];
  metadata?: {
    total: number;
    hasMore: boolean;
  };
  error?: string;
}

const schema = z.object({
  bodyPart: z.string().default(BODY_PARTS.BACK),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

export const getExercises = createSafeActionClient()
  .schema(schema)
  .action(
    async ({
      parsedInput: { bodyPart, limit, offset },
    }): Promise<ActionResponse<ExercisesResponse>> => {
      try {
        const totalCount = await prisma.exercises.count({
          where: { body_part: bodyPart },
        });

        const exercises = await prisma.exercises.findMany({
          where: { body_part: bodyPart },
          select: {
            id: true,
            name: true,
            body_part: true,
            equipment: true,
            gif_url: true,
            target: true,
            secondary_muscles: true,
            instructions: true,
            created_at: true,
            updated_at: true,
          },
          orderBy: {
            name: "asc",
          },
          take: limit,
          skip: offset,
        });

        // Filter out any null values and provide defaults
        const sanitizedExercises = exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name ?? "",
          body_part: exercise.body_part ?? "",
          equipment: exercise.equipment ?? "",
          gif_url: exercise.gif_url ?? "",
          target: exercise.target ?? "",
          secondary_muscles: exercise.secondary_muscles,
          instructions: exercise.instructions,
          created_at: exercise.created_at,
          updated_at: exercise.updated_at,
        }));

        const hasMore = offset + limit < totalCount;

        return {
          success: true,
          data: {
            success: true,
            data: sanitizedExercises,
            metadata: {
              total: totalCount,
              hasMore,
            },
          },
        };
      } catch (error) {
        console.error("Error fetching exercises:", error);
        return {
          success: false,
          error: "Failed to fetch exercises",
        };
      }
    }
  );
