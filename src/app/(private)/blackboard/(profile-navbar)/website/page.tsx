"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateUsernameAction } from "@/actions/username/update";
import { fetchUsernameAction } from "@/actions/username/fetch";
import { toast } from "sonner";

export default function WebsitePage() {
  const [username, setUsername] = useState("");
  const [storedUsername, setStoredUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsername();
  }, []);

  async function fetchUsername() {
    const result = await fetchUsernameAction({});
    if (result?.data?.success && result?.data?.data) {
      setStoredUsername(result.data.data.username || "");
    } else {
      toast.error(result?.data?.error || "Failed to fetch username");
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
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Username"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Website Preview */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Website Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[200px] flex items-center justify-center text-gray-500">
              {storedUsername ? `fed.fan/${storedUsername}` : "No username set"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
