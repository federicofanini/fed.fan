"use server";

import { Client } from "@/utils/supabase/type";
import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";
import { prisma } from "@/lib/db";

export async function getWorkouts(supabase: Client): Promise<ActionResponse> {
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

  const workouts = await prisma.workout.findMany({
    where: {
      user_id: user.id,
    },
    select: {
      id: true,
      name: true,
      selected: true,
      created_at: true,
      frequency: true,
      exercises: {
        select: {
          id: true,
          sets: true,
          reps: true,
          weight: true,
          duration: true,
          exercise: {
            select: {
              id: true,
              name: true,
              body_part: true,
              equipment: true,
              gif_url: true,
              target: true,
              secondary_muscles: true,
              instructions: true,
            },
          },
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const formattedWorkouts = workouts.map((workout) => ({
    id: workout.id,
    name: workout.name,
    selected: workout.selected,
    created_at: workout.created_at,
    frequency: workout.frequency,
    exercises: workout.exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      duration: exercise.duration,
      body_part: exercise.exercise.body_part,
      equipment: exercise.exercise.equipment,
      gif_url: exercise.exercise.gif_url,
      target: exercise.exercise.target,
      secondary_muscles: exercise.exercise.secondary_muscles,
      instructions: exercise.exercise.instructions,
      exercise_id: exercise.exercise.id,
      workout_id: workout.id,
    })),
  }));

  return {
    success: true,
    data: formattedWorkouts,
  };
}

export async function getSelectedWorkout(
  supabase: Client
): Promise<ActionResponse> {
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

  const workout = await prisma.workout.findFirst({
    where: {
      user_id: user.id,
      selected: true,
    },
    select: {
      id: true,
      name: true,
      selected: true,
      created_at: true,
      frequency: true,
      exercises: {
        select: {
          id: true,
          sets: true,
          reps: true,
          weight: true,
          duration: true,
          exercise: {
            select: {
              id: true,
              name: true,
              body_part: true,
              equipment: true,
              gif_url: true,
              target: true,
              secondary_muscles: true,
              instructions: true,
            },
          },
        },
      },
    },
  });

  if (!workout) {
    return {
      success: true,
      data: null,
    };
  }

  const formattedWorkout = {
    id: workout.id,
    name: workout.name,
    selected: workout.selected,
    created_at: workout.created_at,
    exercises: workout.exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      duration: exercise.duration,
      body_part: exercise.exercise.body_part,
      equipment: exercise.exercise.equipment,
      gif_url: exercise.exercise.gif_url,
      target: exercise.exercise.target,
      secondary_muscles: exercise.exercise.secondary_muscles,
      instructions: exercise.exercise.instructions,
      exercise_id: exercise.exercise.id,
      workout_id: workout.id,
    })),
  };

  return {
    success: true,
    data: formattedWorkout,
  };
}
