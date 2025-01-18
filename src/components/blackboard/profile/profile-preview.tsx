"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  MessageCircle,
  AtSign,
  Music,
} from "lucide-react";
import { getUserInfo } from "@/actions/profile/profile-info";
import { useEffect, useState } from "react";
import { type ActionResponse } from "@/actions/types/action-response";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface UserData {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  discord?: string;
  telegram?: string;
  bsky?: string;
  contactEmail?: string;
  username?: string;
  paid: boolean;
  customer_id?: string;
  plan_id?: string;
  created_at: Date;
  updated_at: Date;
}

export function ProfilePreview() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const result = await getUserInfo();
        if (result?.data) {
          const response = result.data as ActionResponse;
          if (response.success && response.data) {
            setUserData(response.data as UserData);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="h-[300px] flex items-center justify-center">
          Loading...
        </CardContent>
      </Card>
    );
  }

  if (!userData) {
    return (
      <Card>
        <CardContent>Failed to load profile data</CardContent>
      </Card>
    );
  }

  const daysSinceMember = Math.floor(
    (new Date().getTime() - new Date(userData.created_at).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Card>
      <CardContent className="space-y-6 mt-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20 rounded-lg">
            <AvatarFallback className="rounded-lg bg-gradient-to-br from-green-500 via-teal-500 to-green-800">
              <span className="text-white text-4xl">
                {userData.full_name[0]?.toUpperCase() || "U"}
              </span>
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{userData.full_name}</h2>
              {userData.username && (
                <Link
                  href={`/${userData.username}`}
                  className="text-muted-foreground hover:underline"
                >
                  @{userData.username}
                </Link>
              )}
            </div>

            <Badge className="text-sm text-muted-foreground" variant="outline">
              Member for {daysSinceMember}d
            </Badge>
            {userData.location && (
              <div className="flex items-center text-muted-foreground text-xs my-2">
                <MapPin className="mr-1 h-3 w-3" />
                <span>{userData.location}</span>
              </div>
            )}
          </div>
        </div>

        {userData.bio && (
          <p className="text-muted-foreground">{userData.bio}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {userData.website && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={userData.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="mr-2 h-4 w-4" />
                Website
              </Link>
            </Button>
          )}

          {userData.contactEmail && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`mailto:${userData.contactEmail}`}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Link>
            </Button>
          )}

          {userData.twitter && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`${userData.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Link>
            </Button>
          )}

          {userData.linkedin && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`${userData.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Link>
            </Button>
          )}

          {userData.github && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`${userData.github}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
          )}

          {userData.instagram && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`${userData.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="mr-2 h-4 w-4" />
                Instagram
              </Link>
            </Button>
          )}

          {userData.youtube && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`${userData.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="mr-2 h-4 w-4" />
                YouTube
              </Link>
            </Button>
          )}

          {userData.tiktok && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`${userData.tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Music className="mr-2 h-4 w-4" />
                TikTok
              </Link>
            </Button>
          )}

          {userData.discord && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`${userData.discord}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Discord
              </Link>
            </Button>
          )}

          {userData.telegram && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`https://t.me/${userData.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Telegram
              </Link>
            </Button>
          )}

          {userData.bsky && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`${userData.bsky}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AtSign className="mr-2 h-4 w-4" />
                Bluesky
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
