"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { seedExercises } from "@/actions/workout/get-exercises";
import { type ActionResponse } from "@/actions/types/action-response";

export function BulkAddExercisesButton() {
  async function handleBulkAdd() {
    try {
      const result = await seedExercises();

      if (!result.success) {
        toast.error(result.error || "Failed to add exercises");
        return;
      }

      toast.success("Successfully added all exercises to the database");
    } catch (error) {
      console.error("Bulk add exercises error:", error);
      toast.error("Failed to add exercises");
    }
  }

  return (
    <Button onClick={handleBulkAdd} className="w-full">
      Bulk Add All Exercises
    </Button>
  );
}
