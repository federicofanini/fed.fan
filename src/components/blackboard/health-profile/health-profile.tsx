"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Moon,
  Ruler,
  Scale,
  Wine,
  Cookie,
  Cigarette,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  updateHealthProfile,
  getHealthProfile,
} from "@/actions/profile/health-profile";
import { toast } from "sonner";
import { type ActionResponse } from "@/actions/types/action-response";

interface HealthProfileFormData {
  height: string;
  weight: string;
  sleep: "less-6" | "6-7" | "7-8" | "more-8" | null;
  alcohol: "none" | "1-3" | "4-7" | "more" | null;
  sugarIntake: "low" | "moderate" | "high" | null;
  isSmoker: boolean | null;
}

export function HealthProfile() {
  const [formData, setFormData] = useState<HealthProfileFormData>({
    height: "",
    weight: "",
    sleep: null,
    alcohol: null,
    sugarIntake: null,
    isSmoker: null,
  });

  useEffect(() => {
    async function fetchHealthProfile() {
      try {
        const result = await getHealthProfile();
        if (result.success && result.data) {
          setFormData({
            height: result.data.height?.toString() || "",
            weight: result.data.weight?.toString() || "",
            sleep:
              (result.data.sleep_hours as HealthProfileFormData["sleep"]) ||
              null,
            alcohol:
              (result.data.alcohol as HealthProfileFormData["alcohol"]) || null,
            sugarIntake:
              (result.data
                .sugar_intake as HealthProfileFormData["sugarIntake"]) || null,
            isSmoker: result.data.is_smoker,
          });
        }
      } catch (error) {
        console.error("Failed to fetch health profile:", error);
        toast.error("Failed to load health profile");
      }
    }

    fetchHealthProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await updateHealthProfile(formData);

      if (!result) {
        throw new Error("No response from server");
      }

      if (result.data) {
        const response = result.data as ActionResponse;
        if (response.success) {
          toast.success("Health profile updated successfully");
        } else {
          toast.error(response.error || "Failed to update health profile");
        }
      }
    } catch (error) {
      console.error("Health profile update error:", error);
      toast.error("Failed to update health profile");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Health Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Ruler className="h-5 w-5 text-primary" />
                </div>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                  placeholder="180"
                />
              </div>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Scale className="h-5 w-5 text-primary" />
                </div>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  placeholder="75"
                />
              </div>
            </div>

            {/* Sleep */}
            <div className="space-y-2">
              <Label htmlFor="sleep">Sleep Hours</Label>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Moon className="h-5 w-5 text-primary" />
                </div>
                <Select
                  value={formData.sleep || undefined}
                  onValueChange={(value: "less-6" | "6-7" | "7-8" | "more-8") =>
                    setFormData({ ...formData, sleep: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-6">Less than 6 hours</SelectItem>
                    <SelectItem value="6-7">6-7 hours</SelectItem>
                    <SelectItem value="7-8">7-8 hours</SelectItem>
                    <SelectItem value="more-8">More than 8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Alcohol */}
            <div className="space-y-2">
              <Label htmlFor="alcohol">Alcohol Consumption</Label>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Wine className="h-5 w-5 text-primary" />
                </div>
                <Select
                  value={formData.alcohol || undefined}
                  onValueChange={(value: "none" | "1-3" | "4-7" | "more") =>
                    setFormData({ ...formData, alcohol: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select consumption" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="1-3">1-3 drinks/week</SelectItem>
                    <SelectItem value="4-7">4-7 drinks/week</SelectItem>
                    <SelectItem value="more">
                      More than 7 drinks/week
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sugar */}
            <div className="space-y-2">
              <Label htmlFor="sugar">Sugar Intake</Label>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Cookie className="h-5 w-5 text-primary" />
                </div>
                <Select
                  value={formData.sugarIntake || undefined}
                  onValueChange={(value: "low" | "moderate" | "high") =>
                    setFormData({ ...formData, sugarIntake: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select intake" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Smoking Status */}
            <div className="space-y-2">
              <Label htmlFor="smoking">Smoking Status</Label>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Cigarette className="h-5 w-5 text-primary" />
                </div>
                <Select
                  value={
                    formData.isSmoker === null
                      ? undefined
                      : formData.isSmoker
                      ? "yes"
                      : "no"
                  }
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, isSmoker: value === "yes" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">Non-Smoker</SelectItem>
                    <SelectItem value="yes">Smoker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save Health Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
