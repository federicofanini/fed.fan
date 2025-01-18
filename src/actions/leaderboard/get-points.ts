"use server";

import { createSafeActionClient } from "next-safe-action";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";

export const getPoints = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
    try {
      // Get all users first
      const users = await prisma.user.findMany({
        select: {
          id: true,
          full_name: true,
          avatar_url: true,
          gamification: {
            select: {
              points: true,
              level: true,
              streak_days: true,
            },
          },
        },
      });

      // Map users and set default values if no gamification stats
      const leaderboard = users.map((user) => ({
        user_id: user.id,
        points: user.gamification?.points || 0,
        level: user.gamification?.level || 1,
        streak_days: user.gamification?.streak_days || 0,
        user: {
          full_name: user.full_name,
          avatar_url: user.avatar_url,
        },
      }));

      // Sort by points
      const sortedLeaderboard = leaderboard
        .sort((a, b) => b.points - a.points)
        .slice(0, 100);

      if (!sortedLeaderboard.length) {
        return {
          success: true,
          data: [],
        };
      }

      // Add rank to each entry
      const rankedLeaderboard = sortedLeaderboard.map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

      return {
        success: true,
        data: rankedLeaderboard,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  }
);
