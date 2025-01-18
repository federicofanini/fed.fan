"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import {
  updateProfileInfo,
  getUserInfo,
  checkUsernameAvailability,
} from "@/actions/profile/profile-info";
import { toast } from "sonner";
import { type ActionResponse } from "@/actions/types/action-response";
import { useDebounce } from "@/hooks/use-debounce";

interface ProfileFormData {
  full_name: string;
  bio: string;
  location: string;
  website: string;
  contactEmail: string;
  twitter: string;
  linkedin: string;
  github: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  discord: string;
  telegram: string;
  bsky: string;
  username: string;
}

interface UserData extends ProfileFormData {}

export function ProfileInfo() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
    bio: "",
    location: "",
    website: "",
    contactEmail: "",
    twitter: "",
    linkedin: "",
    github: "",
    instagram: "",
    youtube: "",
    tiktok: "",
    discord: "",
    telegram: "",
    bsky: "",
    username: "",
  });

  const [usernameError, setUsernameError] = useState("");
  const debouncedUsername = useDebounce(formData.username, 500);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const result = await getUserInfo();
        if (result?.data) {
          const response = result.data as ActionResponse;
          if (response.success && response.data) {
            const userData = response.data as UserData;
            setFormData({
              full_name: userData.full_name || "",
              bio: userData.bio || "",
              location: userData.location || "",
              website: userData.website || "",
              contactEmail: userData.contactEmail || "",
              twitter: userData.twitter || "",
              linkedin: userData.linkedin || "",
              github: userData.github || "",
              instagram: userData.instagram || "",
              youtube: userData.youtube || "",
              tiktok: userData.tiktok || "",
              discord: userData.discord || "",
              telegram: userData.telegram || "",
              bsky: userData.bsky || "",
              username: userData.username || "",
            });
          } else {
            toast.error("Failed to get user data");
            console.error("Failed to get user data:", response.error);
          }
        }
      } catch (error) {
        toast.error("Failed to fetch user info");
        console.error("Error fetching user info:", error);
      }
    }
    fetchUserInfo();
  }, []);

  useEffect(() => {
    async function checkUsername() {
      if (debouncedUsername && debouncedUsername !== formData.username) {
        try {
          const result = await checkUsernameAvailability({
            username: debouncedUsername,
          });
          if (result?.data) {
            const response = result.data as ActionResponse<{
              available: boolean;
            }>;
            if (response.success && response.data) {
              const { available } = response.data;
              setUsernameError(available ? "" : "Username is already taken");
            }
          }
        } catch (error) {
          console.error("Username check error:", error);
          setUsernameError("Error checking username availability");
        }
      }
    }
    checkUsername();
  }, [debouncedUsername, formData.username]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameError) {
      toast.error("Please fix the username error before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const sanitizedFormData = {
        ...formData,
        website: formData.website.trim() || "",
        contactEmail: formData.contactEmail.trim() || "",
        twitter: formData.twitter.trim() || "",
        linkedin: formData.linkedin.trim() || "",
        github: formData.github.trim() || "",
        instagram: formData.instagram.trim() || "",
        youtube: formData.youtube.trim() || "",
        tiktok: formData.tiktok.trim() || "",
        discord: formData.discord.trim() || "",
        telegram: formData.telegram.trim() || "",
        bsky: formData.bsky.trim() || "",
      };

      const result = await updateProfileInfo(sanitizedFormData);

      if (!result) {
        throw new Error("No response from server");
      }

      if (result.data) {
        const response = result.data as ActionResponse;
        if (response.success) {
          toast.success("Profile updated successfully");
        } else {
          toast.error(response.error || "Failed to update profile");
        }
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              className={usernameError ? "border-red-500" : ""}
            />
            {usernameError && (
              <p className="text-sm text-red-500">{usernameError}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                name="github"
                value={formData.github}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tiktok">TikTok</Label>
              <Input
                id="tiktok"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discord">Discord</Label>
              <Input
                id="discord"
                name="discord"
                value={formData.discord}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="telegram">Telegram</Label>
              <Input
                id="telegram"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bsky">Bluesky</Label>
              <Input
                id="bsky"
                name="bsky"
                value={formData.bsky}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
