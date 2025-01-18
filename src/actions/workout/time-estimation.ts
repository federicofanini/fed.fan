"use server";

import type { ActionResponse } from "../types/action-response";
import { appErrors } from "../types/errors";

// Constants for time calculations
const TIME_PER_REP = 5; // seconds
const REST_BETWEEN_SETS = 0; // seconds
const REST_BETWEEN_EXERCISES = 60; // seconds
const WARMUP_TIME = 0; // 5 minutes in seconds
const COOLDOWN_TIME = 0; // 5 minutes in seconds

interface Exercise {
  exercise_id: string;
  sets: number;
  reps: number;
  duration: number | null;
}

export async function estimateWorkoutTime(
  exercises: Exercise[]
): Promise<ActionResponse> {
  try {
    let totalTimeInSeconds = WARMUP_TIME + COOLDOWN_TIME;

    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];

      // If exercise has duration, use that directly
      if (exercise.duration) {
        totalTimeInSeconds += exercise.duration * exercise.sets;
      } else {
        // Calculate time based on reps and sets
        const timeForExercise = exercise.reps * TIME_PER_REP * exercise.sets;
        totalTimeInSeconds += timeForExercise;
      }

      // Add rest time between sets
      totalTimeInSeconds += REST_BETWEEN_SETS * (exercise.sets - 1);

      // Add rest time between exercises (except for last exercise)
      if (i < exercises.length - 1) {
        totalTimeInSeconds += REST_BETWEEN_EXERCISES;
      }
    }

    // Convert total seconds to a more readable format
    const hours = Math.floor(totalTimeInSeconds / 3600);
    const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
    const seconds = totalTimeInSeconds % 60;

    return {
      success: true,
      data: {
        totalTimeInSeconds,
        formatted: {
          hours,
          minutes,
          seconds,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: appErrors.UNEXPECTED_ERROR,
    };
  }
}
