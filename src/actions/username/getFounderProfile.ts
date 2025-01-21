"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import prisma from "@/lib/db";
import { appErrors } from "../types/errors";
import type { ActionResponse } from "../types/action-response";

const schema = z.object({
  username: z.string(),
});

export const getFounderProfile = createSafeActionClient()
  .schema(schema)
  .action(async ({ parsedInput }): Promise<ActionResponse> => {
    try {
      // Fetch user profile and all related data in a single query
      const userData = await prisma.user.findUnique({
        where: {
          username: parsedInput.username,
        },
        select: {
          id: true,
          full_name: true,
          avatar_url: true,
          bio: true,
          location: true,
          website: true,
          twitter: true,
          linkedin: true,
          github: true,
          instagram: true,
          youtube: true,
          tiktok: true,
          discord: true,
          telegram: true,
          bsky: true,
          contactEmail: true,
          username: true,
          skills: {
            select: {
              id: true,
              category: true,
              skill_id: true,
              level: true,
            },
            orderBy: {
              created_at: "desc",
            },
          },
          education: {
            select: {
              id: true,
              school: true,
              degree: true,
              field_of_study: true,
              start_date: true,
              end_date: true,
            },
            orderBy: {
              created_at: "desc",
            },
          },
          projects: {
            select: {
              id: true,
              name: true,
              description: true,
              url: true,
              image_url: true,
              tech_stack: true,
              category: true,
              status: true,
              tags: true,
              created_at: true,
              updated_at: true,
            },
            orderBy: {
              created_at: "desc",
            },
          },
          stack: {
            select: {
              id: true,
              category: true,
              subcategory: true,
              item: true,
            },
            orderBy: {
              created_at: "desc",
            },
          },
        },
        cacheStrategy: {
          ttl: 60 * 5, // 5 minutes
        },
      });

      if (!userData) {
        return { success: false, error: appErrors.NOT_FOUND };
      }

      const { skills, education, projects, stack, ...user } = userData;

      // Return combined profile data
      return {
        success: true,
        data: {
          ...user,
          skills,
          education,
          projects,
          stack,
        },
      };
    } catch (error) {
      console.error("Error fetching founder profile:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? appErrors.NOT_FOUND
            : appErrors.UNEXPECTED_ERROR,
      };
    }
  });
