import { logger, task } from "@trigger.dev/sdk/v3";

const NEXTJS_APP_URL = process.env.NEXT_PUBLIC_APP_URL!; // e.g. "http://localhost:3000" or "https://my-nextjs-app.vercel.app"
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET!; // Create a REVALIDATION_SECRET and set it in your environment variables

export const revalidatePath = task({
  id: "revalidate-path",
  run: async (payload: { path: string }) => {
    const { path } = payload;

    try {
      const response = await fetch(`${NEXTJS_APP_URL}/api/revalidate/path`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: `${NEXTJS_APP_URL}/${path}`,
          secret: REVALIDATION_SECRET,
        }),
      });

      if (response.ok) {
        logger.log("Path revalidation successful", { path });
        return { success: true };
      } else {
        logger.error("Path revalidation failed", {
          path,
          statusCode: response.status,
          statusText: response.statusText,
        });
        return {
          success: false,
          error: `Revalidation failed with status ${response.status}: ${response.statusText}`,
        };
      }
    } catch (error) {
      logger.error("Path revalidation encountered an error", {
        path,
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        error: `Failed to revalidate path due to an unexpected error`,
      };
    }
  },
});
