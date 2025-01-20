"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUserProfileAction } from "@/actions/profile/fetch";
import { updateProfileAction } from "@/actions/profile/update";
import { toast } from "sonner";
import { Dropzone } from "@/utils/pinata/upload-img";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  github: string | null;
  instagram: string | null;
  youtube: string | null;
  tiktok: string | null;
  discord: string | null;
  telegram: string | null;
  bsky: string | null;
  contactEmail: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const result = await fetchUserProfileAction({});
      if (result?.data?.success && result?.data?.data) {
        setProfile(result.data.data as UserProfile);
      } else {
        toast.error(result?.data?.error || "Failed to fetch profile");
      }
    }
    fetchProfile();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    if (profile) {
      setProfile({ ...profile, [name]: value });
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;

    setIsSubmitting(true);

    try {
      const result = await updateProfileAction({
        email: profile.email,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        twitter: profile.twitter,
        linkedin: profile.linkedin,
        github: profile.github,
        instagram: profile.instagram,
        youtube: profile.youtube,
        tiktok: profile.tiktok,
        discord: profile.discord,
        telegram: profile.telegram,
        bsky: profile.bsky,
        contactEmail: profile.contactEmail,
      });

      if (result?.data?.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result?.data?.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <Dropzone />
                </div>
                <div className="flex-1">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profile.bio || ""}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={profile.location || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={profile.website || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  name="github"
                  value={profile.github || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={profile.twitter || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={profile.linkedin || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={profile.contactEmail || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
