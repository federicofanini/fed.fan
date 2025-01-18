"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Calendar,
  Ruler,
  Weight,
  Cigarette,
  Wine,
  Cookie,
  Moon,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getHealthProfile } from "@/actions/profile/health-profile";

interface ProfileData {
  height: number | null;
  weight: number | null;
  sleep_hours: "less-6" | "6-7" | "7-8" | "more-8" | null;
  alcohol: "none" | "1-3" | "4-7" | "more" | null;
  sugar_intake: "low" | "moderate" | "high" | null;
  is_smoker: boolean | null;
}

export function ProfileSummary() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const result = await getHealthProfile();
      if (result.success && result.data) {
        setProfile(result.data);
      }
    }
    fetchProfile();
  }, []);

  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date("2024-01-01").getTime()) /
      (1000 * 3600 * 24)
  );

  if (!profile) {
    return null;
  }

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center justify-between gap-1.5 text-lg">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            Profile Summary
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {daysSinceStart}d
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid gap-2">
          {profile.is_smoker !== null && (
            <div className="flex justify-between items-center rounded-md bg-muted p-2 text-sm">
              <div className="flex items-center gap-1.5">
                {profile.is_smoker ? (
                  <Cigarette className="h-3.5 w-3.5" />
                ) : (
                  <Trophy className="h-3.5 w-3.5" />
                )}
                <span className="font-medium">
                  {profile.is_smoker ? "Smoker" : "Non-Smoker"}
                </span>
              </div>
              {!profile.is_smoker && (
                <Badge variant="secondary" className="text-xs">
                  Healthy!
                </Badge>
              )}
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            {profile.height !== null && (
              <div className="flex flex-col gap-0.5 rounded-md border p-2">
                <div className="flex items-center gap-1">
                  <Ruler className="h-3.5 w-3.5" />
                  <span className="text-xs text-muted-foreground">Height</span>
                </div>
                <div className="text-sm font-medium">{profile.height}cm</div>
              </div>
            )}

            {profile.weight !== null && (
              <div className="flex flex-col gap-0.5 rounded-md border p-2">
                <div className="flex items-center gap-1">
                  <Weight className="h-3.5 w-3.5" />
                  <span className="text-xs text-muted-foreground">Weight</span>
                </div>
                <div className="text-sm font-medium">{profile.weight}kg</div>
              </div>
            )}

            {profile.alcohol && (
              <div className="flex flex-col gap-0.5 rounded-md border p-2">
                <div className="flex items-center gap-1">
                  <Wine className="h-3.5 w-3.5" />
                  <span className="text-xs text-muted-foreground">Alcohol</span>
                </div>
                <div className="text-sm font-medium">{profile.alcohol}</div>
              </div>
            )}

            {profile.sugar_intake && (
              <div className="flex flex-col gap-0.5 rounded-md border p-2">
                <div className="flex items-center gap-1">
                  <Cookie className="h-3.5 w-3.5" />
                  <span className="text-xs text-muted-foreground">Sugar</span>
                </div>
                <div className="text-sm font-medium">
                  {profile.sugar_intake}
                </div>
              </div>
            )}
          </div>

          {profile.sleep_hours && (
            <div className="flex items-center gap-1.5 rounded-md border p-2">
              <Moon className="h-3.5 w-3.5" />
              <div className="text-xs text-muted-foreground">Sleep:</div>
              <div className="text-sm font-medium">{profile.sleep_hours}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
