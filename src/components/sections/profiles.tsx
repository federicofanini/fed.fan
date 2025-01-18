import { Section } from "@/components/section";
import { getFounderProfile } from "@/actions/username/getFounderProfile";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const revalidate = 10800; // 3 hours

async function getRandomProfiles() {
  // Always include federicofan first
  const fedProfile = await getFounderProfile({ username: "federicofan" });

  // Get list of usernames and randomly select 8 more
  const profiles = [];
  if (fedProfile?.data?.success) {
    profiles.push(fedProfile.data);
  }

  // Fetch random usernames from the database
  const usernames = await prisma.user
    .findMany({
      where: {
        NOT: {
          username: "federicofan", // Exclude federicofan since we already have it
        },
      },
      select: {
        username: true,
      },
      orderBy: {
        // Random order
        id: "asc",
      },
      take: 8,
    })
    .then((profiles) => profiles.map((p) => p.username));

  // Get 8 random profiles
  const randomProfiles = await Promise.all(
    usernames.slice(0, 8).map(async (username) => {
      const profile = await getFounderProfile({ username: username as string });
      return profile?.data?.success ? profile.data : null;
    })
  );

  return [...profiles, ...randomProfiles.filter(Boolean)];
}

export async function Profiles() {
  const profiles = await getRandomProfiles();

  return (
    <Section id="profiles" title="Featured Profiles">
      <div className="border-t">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-0 lg:bg-grid-3 border-r pb-12 sm:bg-grid-2 relative bg-grid-1">
          {profiles.map((profile, index) => (
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
