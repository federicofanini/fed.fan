"use client";

import { Button } from "@/components/ui/button";
import { Circle, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { useState } from "react";
import { awardWorkoutPoints } from "@/actions/gamification/workout-points";
import { toast } from "sonner";

interface FinishButtonProps {
  onClick?: () => void;
  userId: string;
}

export function FinishButton({ onClick, userId }: FinishButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const result = await awardWorkoutPoints({ userId });

    if (result?.data?.success) {
      setIsCompleted(true);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
      });

      toast.success("Workout Complete!", {
        description: `You earned ${100} points and are now level ${
          result.data.data.level
        }!`,
      });

      onClick?.();
    } else {
      toast.error("Failed to record workout completion");
    }

    setIsLoading(false);
  };

  return (
    <Button
      className="w-full gap-2"
      size="lg"
      onClick={handleClick}
      variant={isCompleted ? "default" : "secondary"}
      disabled={isLoading || isCompleted}
    >
      {isCompleted ? (
        <CheckCircle className="h-5 w-5" />
      ) : (
        <Circle className="h-5 w-5" />
      )}
      {isLoading ? "Completing..." : "Complete Workout"}
    </Button>
  );
}
