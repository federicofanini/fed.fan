import { Suspense } from "react";
import { ExercisesTable } from "@/components/blackboard/workout/create-workout/exercises/exercises-table";
import { getExercises } from "@/app/exercises/actions";
import { BODY_PARTS } from "./config";

export async function generateMetadata() {
  return {
    title: "Exercise Database | Find Exercises by Body Part",
    description:
      "Browse and search exercises by body part. View exercise details including instructions, target muscles, and proper form.",
  };
}

export default async function ExercisesPage() {
  // Prefetch initial exercises for SEO
  const result = await getExercises({
    bodyPart: BODY_PARTS.BACK,
    limit: 20,
    offset: 0,
  });

  const initialExercises =
    result?.data?.data?.data?.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      body_part: exercise.body_part,
      target: exercise.target,
      equipment: exercise.equipment,
      gif_url: exercise.gif_url,
      secondary_muscles: exercise.secondary_muscles,
      instructions: exercise.instructions,
    })) ?? [];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Exercise Database</h1>
      <p className="text-muted-foreground mb-8">
        Browse exercises by body part. Click on an exercise to view detailed
        instructions and form tips.
      </p>

      <Suspense fallback={<div>Loading exercises...</div>}>
        <ExercisesTable exercises={initialExercises} />
      </Suspense>
    </div>
  );
}
