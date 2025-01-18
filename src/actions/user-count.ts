"use server";

import { createSafeActionClient } from "next-safe-action";
import type { ActionResponse } from "./types/action-response";
import { appErrors } from "./types/errors";
import { prisma } from "@/lib/db";

export const getUserCount = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
    try {
      const count = await prisma.user.count();

      return {
        success: true,
        data: count,
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  }
);
