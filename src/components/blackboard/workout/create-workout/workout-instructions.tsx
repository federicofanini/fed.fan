"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

export function WorkoutInstructions() {
  return (
    <Card className="border-none">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-2">
          <span>Create your workout</span>
          <HoverCard openDelay={0}>
            <HoverCardTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0 hover:bg-transparent focus-visible:ring-0"
              >
                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                <span className="sr-only">Workout creation guide</span>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-[280px] sm:w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">
                  Workout creation guide
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="flex-shrink-0">🎯</span>
                    <span>
                      <strong>Select:</strong> pick exercises from the table
                      below
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex-shrink-0">⚙️</span>
                    <span>
                      <strong>Configure:</strong> set reps, weight & order
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex-shrink-0">💾</span>
                    <span>
                      <strong>Save:</strong> save your workout
                    </span>
                  </li>
                </ul>
              </div>
            </HoverCardContent>
          </HoverCard>
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
