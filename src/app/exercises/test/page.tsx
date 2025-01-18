"use client";

import { useEffect, useState } from "react";
import { BODY_PARTS } from "../config";
import { getExercises } from "../actions";
import { toast } from "sonner";

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
}

export default function TestExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const result = await getExercises({
          bodyPart: BODY_PARTS.BACK,
          limit: 10,
          offset: 0,
        });

        if (!result) {
          throw new Error("No response from server");
        }

        if (result.data?.data?.data) {
          const transformedExercises: Exercise[] = result.data.data.data.map(
            (exercise) => ({
              id: exercise.id,
              name: exercise.name,
              bodyPart: exercise.body_part,
              target: exercise.target,
              equipment: exercise.equipment,
              gifUrl: exercise.gif_url,
              secondaryMuscles: exercise.secondary_muscles,
              instructions: exercise.instructions,
            })
          );
          setExercises(transformedExercises);
        } else {
          const errorMessage =
            result?.data?.error || "Failed to load exercises";
          toast.error(errorMessage);
          setError(errorMessage);
        }
      } catch (error) {
        console.error("Error fetching exercises: ", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load exercises";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchExercises();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Test Exercises</h1>
      <p className="text-muted-foreground mb-8">
        Displaying 10 exercises fetched from the API.
      </p>

      {isLoading ? (
        <div>Loading exercises...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ul className="space-y-4">
          {exercises.map((exercise) => (
            <li key={exercise.id} className="border p-4 rounded">
              <h2 className="text-xl font-semibold">{exercise.name}</h2>
              <p>Target: {exercise.target}</p>
              <p>Equipment: {exercise.equipment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
