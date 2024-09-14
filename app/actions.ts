"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function joinWaitlist(email: string) {
  try {
    // Check if the user is already on the waitlist
    const existingUser = await prisma.waitlist.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "You're already on the waitlist!" };
    }

    // If not, add the user to the waitlist
    await prisma.waitlist.create({
      data: {
        email,
      },
    });

    revalidatePath("/");
    return { success: true, message: "Waitlist successfully joined :)" };
  } catch (error) {
    console.error("Error joining waitlist:", error);
    return { success: false, message: "Something went wrong, please try again." };
  }
}

export async function getWaitlistCount() {
  try {
    const count = await prisma.waitlist.count();
    return count;
  } catch (error) {
    console.error("Error counting waitlist entries:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
