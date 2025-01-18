"server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getPoints } from "./workout-points";
import { createClient } from "@/utils/supabase/server";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";

export const getCachedGamificationData = cache(
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

    const result = await unstable_cache(
      async () => {
        const points = await getPoints();
        return points?.data as ActionResponse;
      },
      [`gamification-data-${user.id}`],
      {
        tags: [`gamification-${user.id}`],
        revalidate: 300, // 5 minutes
      }
    )();

    return result;
  }
);
