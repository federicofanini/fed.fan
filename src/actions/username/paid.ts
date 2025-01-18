"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { prisma } from "@/lib/db";
import type { ActionResponse } from "@/actions/types/action-response";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

const schema = z.object({});

export const checkPaidStatusAction = createSafeActionClient()
  .schema(schema)
  .action(async (): Promise<ActionResponse> => {
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

      const userData = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          paid: true,
          customer_id: true,
          plan_id: true,
        },
      });

      if (!userData) {
        return {
          success: false,
          error: "User not found",
        };
      }

      return {
        success: true,
        data: userData,
      };
    } catch (error) {
      console.error("Paid status check error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });
