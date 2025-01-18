"use server";

import { prisma } from "@/lib/db";
import { appErrors } from "../types/errors";

export async function getFounderProfile(username: string) {
  try {
    // Fetch user profile by username
    const user = await prisma.user.findUnique({
      where: {
        username: username,
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
      },
    });

    if (!user) {
      throw appErrors.NOT_FOUND;
    }

    // Fetch all related data in parallel
    const [skills, education, projects, stack] = await Promise.all([
      prisma.skills.findMany({
        where: { user_id: user.id },
        select: {
          id: true,
          skill: true,
          level: true,
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.education.findMany({
        where: { user_id: user.id },
        select: {
          id: true,
          school: true,
          degree: true,
          field_of_study: true,
          start_date: true,
          end_date: true,
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.projects.findMany({
        where: { user_id: user.id },
        select: {
          id: true,
          name: true,
          description: true,
          url: true,
          image_url: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.stack.findMany({
        where: { user_id: user.id },
        select: {
          id: true,
          stack: true,
        },
        orderBy: { created_at: "desc" },
      }),
    ]);

    // Return combined profile data
    return {
      ...user,
      skills,
      education,
      projects,
      stack,
    };
  } catch (error) {
    console.error("Error fetching founder profile:", error);
    throw error;
  }
}
