"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const exerciseParamsSchema = z.object({
  bodyPart: z.string(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

interface Exercise {
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
}

type ExercisesByBodyPart = Record<string, Exercise[]>;

//Handles GET requests to fetch exercises based on query parameters.
//
// @param {Request} request - The incoming request object.

// Query Parameters:
// - `bodyPart` (string): The body part to filter exercises by. Example: `back`.
// - `limit` (number): The maximum number of exercises to return. Default is 10. Must be between 1 and 100.
// - `offset` (number): The number of exercises to skip before starting to collect the result set. Default is 0.

// @returns {NextResponse} JSON response containing:
// - `success` (boolean): Indicates if the request was successful.
// - `data` (object): An object of exercises organized by body parts.
// - `metadata` (object): Contains `total` (total number of exercises) and `hasMore` (boolean indicating if more exercises are available).

// Example usage:
// ```
// fetch('/api/exercises?bodyPart=back&limit=10&offset=0')
//   .then(response => response.json())
//   .then(data => console.log(data));
// ```

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const bodyPart = url.searchParams.get("bodyPart") || "";
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    const input = exerciseParamsSchema.parse({ bodyPart, limit, offset });

    const totalCount = await prisma.exercises.count({
      where: { body_part: input.bodyPart },
    });

    const exercises = await prisma.exercises.findMany({
      where: { body_part: input.bodyPart },
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
      take: input.limit,
      skip: input.offset,
    });

    const hasMore = input.offset + input.limit < totalCount;

    // Return exercises directly instead of grouping by body part
    return NextResponse.json({
      success: true,
      data: exercises,
      metadata: {
        total: totalCount,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      { success: false, error: "Error fetching exercises" },
      { status: 500 }
    );
  }
}
