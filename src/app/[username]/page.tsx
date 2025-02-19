import { Metadata } from "next";
import {
  FounderPage,
  Founder as FounderType,
} from "@/components/website/founder-page";
import { getFounderProfile } from "@/actions/username/getFounderProfile";
import { JoinCTA } from "@/components/website/join-cta";
import { ThemeToggle } from "@/components/theme-toggle";

// Define the type for the dynamic route params
type PageParams = { username: string } & Promise<any>;

// The dynamic route component
export default async function Founder({ params }: { params: PageParams }) {
  const result = await getFounderProfile({ username: params.username });

  if (!result?.data?.success || !result?.data?.data) {
    return <div>Profile not found</div>;
  }

  const founderData = result.data.data;

  // Transform dates to strings for projects and handle null values
  const founder: FounderType = {
    full_name: founderData.full_name || undefined,
    avatar_url: founderData.avatar_url || undefined,
    bio: founderData.bio || undefined,
    location: founderData.location || undefined,
    website: founderData.website || undefined,
    twitter: founderData.twitter || undefined,
    linkedin: founderData.linkedin || undefined,
    github: founderData.github || undefined,
    instagram: founderData.instagram || undefined,
    youtube: founderData.youtube || undefined,
    tiktok: founderData.tiktok || undefined,
    discord: founderData.discord || undefined,
    telegram: founderData.telegram || undefined,
    bsky: founderData.bsky || undefined,
    contactEmail: founderData.contactEmail || undefined,
    projects:
      founderData.projects?.map((project: any) => ({
        ...project,
        created_at: project.created_at.toISOString(),
        updated_at: project.updated_at.toISOString(),
      })) || [],
    skills:
      founderData.skills?.map((skill: any) => ({
        id: skill.id,
        skill: skill.skill_id,
        level: skill.level,
        category: skill.category,
      })) || [],
    education:
      founderData.education?.map((education: any) => ({
        id: education.id,
        school: education.school,
        degree: education.degree,
        field_of_study: education.field_of_study,
        start_date: education.start_date?.toISOString() || "",
        end_date: education.end_date?.toISOString() || "",
      })) || [],
    stack:
      founderData.stack?.map((stack: any) => ({
        id: stack.id,
        category: stack.category,
        subcategory: stack.subcategory,
        item: stack.item,
      })) || [],
  };

  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <FounderPage founder={founder} imgUrl={founderData.avatar_url || ""} />
      <JoinCTA />
    </>
  );
}

// The metadata generation function
export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  try {
    const result = await getFounderProfile({ username: params.username });

    if (!result?.data?.success || !result?.data?.data) {
      return {
        title: "Profile Not Found | Founder Platform",
        description: "This founder profile could not be found.",
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const founderData = result.data.data;
    const fullName = founderData.full_name || founderData.username;
    const location = founderData.location
      ? ` from ${founderData.location}`
      : "";
    const skills = founderData.skills?.map((s: any) => s.skill_id).join(", ");

    return {
      title: `${fullName} | Founder Profile`,
      description:
        founderData.bio ||
        `${fullName}${location} - Founder profile showcasing projects, skills, and experience. ${
          skills ? `Skilled in ${skills}.` : ""
        }`,
      openGraph: {
        title: `${fullName} | Founder Profile`,
        description: founderData.bio || `View ${fullName}'s founder profile`,
        images: founderData.avatar_url ? [{ url: founderData.avatar_url }] : [],
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title: `${fullName} | Founder Profile`,
        description: founderData.bio || `View ${fullName}'s founder profile`,
        images: founderData.avatar_url ? [founderData.avatar_url] : [],
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `/${params.username}`,
      },
    };
  } catch (error) {
    return {
      title: "Profile Error | Founder Platform",
      description: "There was an error loading this founder profile.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}
