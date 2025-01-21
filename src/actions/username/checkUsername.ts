"use server";

import prisma from "@/lib/db";

/**
 * Checks if a username is available in the database
 * @param username Username to check
 * @returns Boolean indicating if username is available
 */
export async function checkUsernameAvailability(username: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    // If no user found, username is available
    return !existingUser;
  } catch (error) {
    // In case of error, we'll assume username is taken to be safe
    console.error("Username check error:", error);
    return false;
  }
}
