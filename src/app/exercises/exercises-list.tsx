"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getExercises } from "./actions";
import {
  ExercisesTable,
  type Exercise,
} from "@/components/blackboard/workout/create-workout/exercises/exercises-table";
import { useQueryState } from "nuqs";
import { BODY_PARTS } from "./config";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 20;

export function ExercisesList({
  initialExercises,
}: {
  initialExercises: Exercise[];
}) {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [bodyPart, setBodyPart] = useQueryState("bodyPart", {
    defaultValue: BODY_PARTS.BACK,
  });
  const offset = useRef(0);

  const loadExercises = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const result = await getExercises({
        bodyPart,
        limit: ITEMS_PER_PAGE,
        offset: offset.current,
      });

      if (!result?.data?.success || !result.data?.data) {
        throw new Error(result?.data?.error || "Failed to load exercises");
      }

      const { data, metadata } = result?.data.data;

      const transformedExercises = data?.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        body_part: exercise.body_part,
        target: exercise.target,
        equipment: exercise.equipment,
        gif_url: exercise.gif_url,
        secondary_muscles: exercise.secondary_muscles,
        instructions: exercise.instructions,
      }));

      setExercises((prev) => [...prev, ...(transformedExercises ?? [])]);
      setHasMore(metadata?.hasMore ?? false);
      offset.current += ITEMS_PER_PAGE;
    } catch (error) {
      console.error("Error loading exercises:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load exercises"
      );
    } finally {
      setIsLoading(false);
    }
  }, [bodyPart, isLoading, hasMore]);

  const refreshExercises = useCallback(async () => {
    setExercises([]);
    setHasMore(true);
    offset.current = 0;
    await loadExercises();
  }, [loadExercises]);

  useEffect(() => {
    refreshExercises();
  }, [bodyPart, refreshExercises]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.values(BODY_PARTS).map((part) => (
          <Button
            key={part}
            variant={bodyPart === part ? "default" : "outline"}
            onClick={() => setBodyPart(part)}
            className="capitalize"
          >
            {part.replace("_", " ")}
          </Button>
        ))}
      </div>

      <div id="scrollableDiv" className="h-[600px] overflow-auto">
        <InfiniteScroll
          dataLength={exercises.length}
          next={loadExercises}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
          loader={
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
          endMessage={
            exercises.length > 0 && (
              <p className="text-center py-4 text-muted-foreground">
                You&apos;ve seen all exercises for this body part
              </p>
            )
          }
        >
          <ExercisesTable exercises={exercises} selectedExercises={[]} />
        </InfiniteScroll>
      </div>
    </div>
  );
}
