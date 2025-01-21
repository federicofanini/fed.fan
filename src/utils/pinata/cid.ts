"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getImgUrl } from "./img-url";
import { prisma } from "@/lib/db";

/**
 * Updates an image URL in the specified table and column
 * @param id Record ID to update
 * @param cid CID string to store
 * @throws Error if database update fails
 */
export async function updateCid(cid: string) {
  try {
    const supabase = await createClient();

    // Get the current user's ID
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("Not authenticated");

    // Get the full image URL from the CID
    const imageUrl = await getImgUrl(cid);

    // Update the specified table using Prisma
    await prisma.user.update({
      where: { id: user.id },
      data: {
        avatar_url: imageUrl,
        updated_at: new Date(),
      },
    });

    revalidatePath("/blackboard/profile");
  } catch (error) {
    console.error(`Failed to update image URL:`, error);
    throw new Error(`Failed to update image URL`);
  }
}
