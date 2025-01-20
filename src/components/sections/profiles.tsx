import { Section } from "@/components/section";
import { getFounderProfile } from "@/actions/username/getFounderProfile";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

async function getRandomProfiles() {
  const usernames = [
    "federicofan",
    "pontus",
    "thomas",
    "JamesS",
    "steellgold",
    "jupytergas",
    "jonas",
    "rshivam",
    "dave",
    "valtest",
  ];

  const profiles = await Promise.all(
    usernames.map(async (username) => {
      const result = await getFounderProfile({ username });
      return result?.data?.success ? result.data : null;
    })
  );

  return profiles.filter(Boolean);
}

export async function Profiles() {
  const profiles = await getRandomProfiles();

  return (
    <Section id="profiles" title="Featured Profiles">
      <div className="border-t">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-0 lg:bg-grid-3 border-r pb-12 sm:bg-grid-2 relative bg-grid-1">
          {profiles.map((profile) => (
            <Link
              href={`/${profile?.data?.username}`}
              key={profile?.data?.id}
              className={cn(
                "flex flex-col border-b break-inside-avoid border-l",
                "transition-colors hover:bg-secondary/20"
              )}
            >
              <div className="px-4 py-5 sm:p-6 flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  {profile?.data?.avatar_url && (
                    <Image
                      src={profile?.data?.avatar_url}
                      alt={profile?.data?.full_name || profile?.data?.username}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-foreground">
                      {profile?.data?.full_name || profile?.data?.username}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {profile?.data?.location}
                    </p>
                  </div>
                </div>
                <p className="line-clamp-3">{profile?.data?.bio}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}

// Add revalidation for 6 hours (21600 seconds)
export const revalidate = 21600;
