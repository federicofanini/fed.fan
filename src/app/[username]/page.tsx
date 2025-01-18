import { Metadata } from "next";
import {
  FounderPage,
  Founder as FounderType,
} from "@/components/website/founder-page";
import { getFounderProfile } from "@/actions/username/getFounderProfile";
import { JoinCTA } from "@/components/website/join-cta";

// Define the type for the dynamic route params
type PageParams = { username: string };

// The dynamic route component
export default async function Founder({ params }: { params: PageParams }) {
  const founderData = await getFounderProfile(params.username);

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
    projects: founderData.projects.map((project) => ({
      ...project,
      created_at: project.created_at.toISOString(),
      updated_at: project.updated_at.toISOString(),
    })),
    skills: founderData.skills.map((skill) => ({
      id: skill.id,
      skill: skill.skill,
      level: skill.level,
    })),
    education: founderData.education.map((education) => ({
      id: education.id,
      school: education.school,
      degree: education.degree,
      field_of_study: education.field_of_study,
      start_date: education.start_date.toISOString(),
      end_date: education.end_date.toISOString(),
    })),
    stack: founderData.stack.map((stack) => ({
      id: stack.id,
      stack: stack.stack,
    })),
  };

  return (
    <>
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
  const founder = await getFounderProfile(params.username);
  return {
    title: founder?.full_name || founder?.username || "Profile",
    description: founder?.bio || "Founder profile",
  };
}
