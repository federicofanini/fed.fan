import {
  LinkIcon,
  LucideLinkedin,
  LucideInstagram,
  LucideYoutube,
  LucideMusic2,
  LucideSend,
  LucideMail,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Founder } from "./founder-page";
import { Icons } from "../icons";

export function FounderProfile({
  founder,
  imgUrl,
}: {
  founder: Founder;
  imgUrl: string;
}) {
  return (
    <div className="relative w-full overflow-hidden border bg-gradient-to-b from-background via-secondary/5 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/20 via-background to-background opacity-40" />

      <div className="relative px-4 py-6 sm:p-8 md:p-12">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {imgUrl ? (
              <Image
                src={imgUrl}
                alt={founder.full_name || ""}
                className="size-24 border border-secondary/30 backdrop-blur-sm rounded-md"
                width={96}
                height={96}
              />
            ) : (
              founder.full_name && (
                <div className="size-24 flex items-center justify-center bg-gradient-to-br from-secondary/30 to-transparent border border-secondary/30 backdrop-blur-sm rounded-md">
                  <span className="text-4xl font-medium bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                    {founder.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )
            )}

            <div className="space-y-3 text-center sm:text-left">
              {founder.full_name && (
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                  {founder.full_name}
                </h1>
              )}

              {(founder.location || founder.website) && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  {founder.location && (
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {founder.location}
                    </span>
                  )}
                  {founder.website && (
                    <Link
                      href={`${founder.website}/?ref=fed.fan`}
                      target="_blank"
                      className="group"
                    >
                      <Badge variant="outline" className="rounded-md">
                        <LinkIcon className="size-3 mr-1" />
                        {founder.website.replace(/^https?:\/\//, "")}
                      </Badge>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {founder.bio && (
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mx-auto sm:mx-0 text-center sm:text-left">
              {founder.bio}
            </p>
          )}

          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {Object.entries({
              GitHub: { url: founder.github, icon: Icons.github },
              Twitter: { url: founder.twitter, icon: Icons.twitter },
              LinkedIn: { url: founder.linkedin, icon: LucideLinkedin },
              Instagram: { url: founder.instagram, icon: LucideInstagram },
              YouTube: { url: founder.youtube, icon: LucideYoutube },
              TikTok: { url: founder.tiktok, icon: LucideMusic2 },
              Discord: { url: founder.discord, icon: Icons.discord },
              Telegram: { url: founder.telegram, icon: LucideSend },
              BlueSky: { url: founder.bsky, icon: Icons.aria },
              Contact: { url: founder.contactEmail, icon: LucideMail },
            })
              .filter(([_, data]) => data.url)
              .map(([name, { url, icon: Icon }]) => (
                <Link
                  key={name}
                  href={
                    name === "Contact" ? `mailto:${url}` : `${url}/?ref=fed.fan`
                  }
                  target={name === "Contact" ? "_self" : "_blank"}
                >
                  <Badge
                    variant="secondary"
                    className="rounded-md flex items-center gap-1.5"
                  >
                    <Icon className="size-3" />
                    {name}
                  </Badge>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
