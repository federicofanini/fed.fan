"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createUserProfile, getUserFullName } from "./actions";
import type { ActionResponse } from "@/actions/types/action-response";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch user's full name on component mount
    const fetchFullName = async () => {
      const name = await getUserFullName();
      if (name) {
        setFormData((prev) => ({ ...prev, fullName: name }));
      }
    };
    fetchFullName();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.fullName.trim()) {
        toast.error("Please enter your name");
        return;
      }

      const result = await createUserProfile({
        fullName: formData.fullName.trim(),
      });

      if (!result) {
        throw new Error("No response from server");
      }

      if (result.data) {
        const response = result.data as ActionResponse;
        if (response.success) {
          // Redirect immediately after successful save
          router.push("/blackboard");
          router.refresh(); // Refresh to ensure new data is loaded
        } else {
          toast.error(response.error || "Failed to update profile");
        }
      }
    } catch (error) {
      console.error("Error creating user profile:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Complete Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/*<div className="flex justify-center mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.avatarUrl} alt="Profile picture" />
                <AvatarFallback>
                  {formData.fullName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>*/}

            <div className="space-y-2">
              <Label htmlFor="fullName">How should we call you?</Label>
              <Input
                id="fullName"
                required
                placeholder="James Bond"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Complete profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
