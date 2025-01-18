"use client";

import { useState } from "react";
import { seedExercises } from "@/actions/workout/get-exercises";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("");

  async function handleSeed() {
    setIsSeeding(true);
    setStatus("Starting seed process...");

    try {
      const result = await seedExercises();

      if (result.success) {
        setStatus("Successfully seeded exercises database!");
        setProgress(100);
      } else {
        setStatus("Failed to seed exercises database.");
      }
    } catch (error) {
      setStatus("An error occurred while seeding the database.");
    } finally {
      setIsSeeding(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Seed Exercise Database</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <Button onClick={handleSeed} disabled={isSeeding} className="w-fit">
              {isSeeding ? "Seeding..." : "Start Seeding"}
            </Button>

            {(isSeeding || status) && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">{status}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
