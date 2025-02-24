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
import { checkUsernameAvailability } from "@/actions/username/checkUsername";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function WebsitePage() {
  const [storedUsername, setStoredUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [founderData, setFounderData] = useState<Founder | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  useEffect(() => {
    fetchUsername();
  }, []);

  useEffect(() => {
    if (storedUsername) {
      fetchFounderData();
    }
  }, [storedUsername]);

  // Debounced username availability check
  useEffect(() => {
    const username = form.watch("username");
    if (username.length < 2) {
      setIsUsernameAvailable(null);
      return;
    }

    const checkUsername = async () => {
      setIsCheckingUsername(true);
      try {
        const isAvailable = await checkUsernameAvailability(username);
        setIsUsernameAvailable(isAvailable);
      } catch (err) {
        setIsUsernameAvailable(false);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [form.watch("username")]);

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isUsernameAvailable) {
      toast.error("Please choose a different username");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateUsernameAction({ username: values.username });
      if (result?.data?.success) {
        toast.success("Username updated successfully!");
        form.reset();
        await fetchUsername();
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
              <div className="flex items-center justify-between">
                <CardTitle>Update Username</CardTitle>
                <div className="flex items-center justify-center font-bold text-lg">
                  <Link
                    href={`https://fed.fan/${storedUsername}`}
                    target="_blank"
                    className="text-primary hover:underline flex items-center justify-center"
                  >
                    <span className="text-muted-foreground font-semibold">
                      fed.fan/
                    </span>
                    {storedUsername ? (
                      storedUsername
                    ) : (
                      <span className="inline-block w-20 h-3 bg-muted-foreground animate-pulse rounded" />
                    )}
                    <ArrowUpRightIcon className="w-4 h-4 ml-1 text-muted-foreground" />
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder={
                                storedUsername || "Enter your username"
                              }
                              disabled={isSubmitting}
                              className={`${
                                isUsernameAvailable === true
                                  ? "border-green-500"
                                  : isUsernameAvailable === false
                                  ? "border-red-500"
                                  : ""
                              }`}
                              {...field}
                            />
                            {isCheckingUsername && (
                              <span className="absolute right-3 top-2 text-sm text-muted-foreground">
                                Checking...
                              </span>
                            )}
                            {!isCheckingUsername &&
                              isUsernameAvailable === true && (
                                <span className="absolute right-3 top-2 text-sm text-green-500">
                                  Available
                                </span>
                              )}
                            {!isCheckingUsername &&
                              isUsernameAvailable === false && (
                                <span className="absolute right-3 top-2 text-sm text-red-500">
                                  Taken
                                </span>
                              )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting || isCheckingUsername || !isUsernameAvailable
                    }
                  >
                    {isSubmitting ? "Updating..." : "Update Username"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
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
