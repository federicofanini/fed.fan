"use client";

import { Button } from "@/components/ui/button";
import { PlayCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface StartWorkoutProps {
  workoutId: string;
}

export function StartWorkout({ workoutId }: StartWorkoutProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    router.push(`/blackboard/${workoutId}`);
  };

  return (
    <Button
      className="w-full gap-2"
      size="lg"
      onClick={handleClick}
      variant="secondary"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <PlayCircle className="h-5 w-5" />
      )}
      {isLoading ? "Loading..." : "Start workout"}
    </Button>
  );
}
