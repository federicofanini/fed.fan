"use server";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "../../types/action-response";
import { appErrors } from "../../types/errors";
import { getPoints } from "../workout-points";

export const getCompletedSetsAnalytics = cache(
  async (): Promise<ActionResponse> => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: appErrors.UNAUTHORIZED,
      };
    }

    return unstable_cache(
      async () => {
        try {
          // Get completed sets data
          const completedSets = await prisma.completed_set.findMany({
            where: {
              user_id: user.id,
              created_at: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
            select: {
              created_at: true,
              workout_exercise_id: true,
              completed_reps: true,
              workout_exercise: {
                select: {
                  weight: true,
                },
              },
            },
            orderBy: {
              created_at: "asc",
            },
          });

          // Get gamification data
          const gamificationData = await getPoints();

          // Process weekly data
          const weeklyData = Array(7)
            .fill(0)
            .map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - i);
              const dayStr = date.toLocaleDateString("en-US", {
                weekday: "short",
              });
              const dayCompletedSets = completedSets.filter(
                (set) => set.created_at.toDateString() === date.toDateString()
              );

              return {
                day: dayStr,
                completed: dayCompletedSets.length,
                total: 5, // Target sets per day
              };
            })
            .reverse();

          // Process monthly data
          const monthlyData = Array(4)
            .fill(0)
            .map((_, i) => {
              const weekStart = new Date();
              weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
              const weekEnd = new Date();
              weekEnd.setDate(weekEnd.getDate() - i * 7);

              const weekCompletedSets = completedSets.filter(
                (set) =>
                  set.created_at >= weekStart && set.created_at <= weekEnd
              );

              return {
                week: `W${4 - i}`,
                workouts: weekCompletedSets.length,
              };
            })
            .reverse();

          return {
            success: true,
            data: {
              weeklyProgress: weeklyData,
              monthlyTrend: monthlyData,
              gamification: gamificationData?.data,
            },
          };
        } catch (error) {
          return {
            success: false,
            error: appErrors.UNEXPECTED_ERROR,
          };
        }
      },
      [`analytics-${user.id}`],
      {
        tags: [`analytics-${user.id}`],
        revalidate: 300, // 5 minutes
      }
    )();
  }
);
