"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";

export async function joinWaitlist(email: string) {
  try {
    await prisma.waitlist.create({
      data: {
        email,
      },
    });

    revalidatePath("/");
    return { success: true, message: "Waitlist successfully joined" };
  } catch (error) {
    console.error("Error joining waitlist:", error);
    return { success: false, message: "ERROR: Please try again" };
  }
}
