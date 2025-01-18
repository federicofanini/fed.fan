"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dumbbell, Cigarette, Wine, Moon, Cookie } from "lucide-react";

export function AchievementsList() {
  const [achievements, setAchievements] = useState({
    workout: false,
    noSmoke: false,
    noAlcohol: false,
    sleep: false,
    noSugar: false,
  });

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleCheck = (achievement: keyof typeof achievements) => {
    setAchievements((prev) => {
      const newState = { ...prev, [achievement]: !prev[achievement] };

      // Only trigger confetti when checking, not unchecking
      if (newState[achievement]) {
        triggerConfetti();
      }

      return newState;
    });
  };

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle className="text-lg">Daily Achievements</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="workout"
            checked={achievements.workout}
            onCheckedChange={() => handleCheck("workout")}
          />
          <label
            htmlFor="workout"
            className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Dumbbell className="h-4 w-4" />
            Workout completed
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="noSmoke"
            checked={achievements.noSmoke}
            onCheckedChange={() => handleCheck("noSmoke")}
          />
          <label
            htmlFor="noSmoke"
            className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Cigarette className="h-4 w-4" />
            No smoking today
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="noAlcohol"
            checked={achievements.noAlcohol}
            onCheckedChange={() => handleCheck("noAlcohol")}
          />
          <label
            htmlFor="noAlcohol"
            className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Wine className="h-4 w-4" />
            No alcohol today
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="sleep"
            checked={achievements.sleep}
            onCheckedChange={() => handleCheck("sleep")}
          />
          <label
            htmlFor="sleep"
            className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Moon className="h-4 w-4" />8 hours of sleep
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="noSugar"
            checked={achievements.noSugar}
            onCheckedChange={() => handleCheck("noSugar")}
          />
          <label
            htmlFor="noSugar"
            className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Cookie className="h-4 w-4" />
            No sugar today
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
