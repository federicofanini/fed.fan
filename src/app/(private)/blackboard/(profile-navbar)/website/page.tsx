"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateUsernameAction } from "@/actions/username/update";
import { fetchUsernameAction } from "@/actions/username/fetch";
import { toast } from "sonner";
import { FounderPage, Founder } from "@/components/website/founder-page";
import { getFounderProfile } from "@/actions/username/getFounderProfile";
import { PayToShare } from "@/components/blackboard/website/payToShare";
import { checkPaidStatusAction } from "@/actions/username/paid";

export default function WebsitePage() {
  const [username, setUsername] = useState("");
  const [storedUsername, setStoredUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [founderData, setFounderData] = useState<Founder | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    fetchUsername();
    checkPaidStatus();
  }, []);

  useEffect(() => {
    if (storedUsername) {
      fetchFounderData();
    }
  }, [storedUsername]);

  async function checkPaidStatus() {
    const result = await checkPaidStatusAction({});
    if (result?.data?.success) {
      setIsPaid(result.data.data.paid);
    }
  }

  async function fetchUsername() {
    const result = await fetchUsernameAction({});
    if (result?.data?.success && result?.data?.data) {
      setStoredUsername(result.data.data.username || "");
    } else {
      toast.error(result?.data?.error || "Failed to fetch username");
    }
  }

  async function fetchFounderData() {
    const result = await getFounderProfile({ username: storedUsername });
    if (result?.data?.success && result?.data?.data) {
      const data = result.data.data;
      const founder: Founder = {
        full_name: data.full_name || undefined,
        avatar_url: data.avatar_url || undefined,
        bio: data.bio || undefined,
        location: data.location || undefined,
        website: data.website || undefined,
        twitter: data.twitter || undefined,
        linkedin: data.linkedin || undefined,
        github: data.github || undefined,
        instagram: data.instagram || undefined,
        youtube: data.youtube || undefined,
        tiktok: data.tiktok || undefined,
        discord: data.discord || undefined,
        telegram: data.telegram || undefined,
        bsky: data.bsky || undefined,
        contactEmail: data.contactEmail || undefined,
        projects:
          data.projects?.map((project: any) => ({
            ...project,
            created_at: project.created_at.toISOString(),
            updated_at: project.updated_at.toISOString(),
          })) || [],
        skills:
          data.skills?.map((skill: any) => ({
            id: skill.id,
            skill: skill.skill_id,
            level: skill.level,
            category: skill.category,
          })) || [],
        education:
          data.education?.map((education: any) => ({
            id: education.id,
            school: education.school,
            degree: education.degree,
            field_of_study: education.field_of_study,
            start_date: education.start_date?.toISOString() || "",
            end_date: education.end_date?.toISOString() || "",
          })) || [],
        stack:
          data.stack?.map((stack: any) => ({
            id: stack.id,
            category: stack.category,
            subcategory: stack.subcategory,
            item: stack.item,
          })) || [],
      };
      setFounderData(founder);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateUsernameAction({ username });
      if (result?.data?.success) {
        toast.success("Username updated successfully!");
        setUsername("");
        await fetchUsername(); // Refresh the displayed username
      } else {
        toast.error(result?.data?.error || "Failed to update username");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Username Update Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Update Username</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={storedUsername || "Enter your username"}
                    disabled={isSubmitting || !isPaid}
                  />
                </div>
                <Button type="submit" disabled={isSubmitting || !isPaid}>
                  {isSubmitting ? "Updating..." : "Update Username"}
                </Button>
              </form>
            </CardContent>
          </Card>
          <PayToShare />
        </div>

        {/* Website Preview */}
        <div>
          <Card className="border-none">
            <CardContent>
              {founderData ? (
                <div className="border rounded-lg p-4">
                  <FounderPage
                    founder={founderData}
                    imgUrl={founderData.avatar_url || ""}
                  />
                </div>
              ) : (
                <div className="min-h-[200px] flex items-center justify-center text-gray-500">
                  {storedUsername
                    ? "Loading preview..."
                    : "Set a username to see preview"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
