"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Section } from "@/components/section";
import { FounderProfile } from "./profile";
import { Projects } from "./projects";
import { Project } from "@/app/(private)/blackboard/(profile-navbar)/projects/page";
import { Skill, Skills } from "./skills";
import { Education } from "./education";
import { Stack } from "./stack";

// Define interfaces based on schema.prisma
export interface Startup {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  opensource: boolean;
  status?: string;
  revenue?: string;
  funding?: string;
  teamSize?: string;
  industry?: string;
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
}

export interface Founder {
  full_name?: string;
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
  projects: Project[];
  skills: Skill[];
  education: Education[];
  stack: Stack[];
}

const tabs = {
  projects: {
    label: "projects",
    value: "projects",
  },
  skills: {
    label: "skills",
    value: "skills",
  },
  education: {
    label: "education",
    value: "education",
  },
  stack: {
    label: "stack",
    value: "stack",
  },
} as const;

export function FounderPage({
  founder,
  imgUrl,
}: {
  founder: Founder;
  imgUrl: string | null;
}) {
  if (!founder) {
    return null;
  }

  return (
    <Section>
      <div className="space-y-8 md:space-y-12 sm:mt-12 mt-6">
        <FounderProfile
          founder={founder}
          imgUrl={imgUrl || founder.avatar_url || ""}
        />

        <Tabs defaultValue={tabs.projects.value} className="w-full">
          <TabsList className="w-full justify-start h-auto space-x-6 bg-transparent border-b border-secondary/30 p-0">
            {Object.values(tabs).map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-secondary pb-4 px-0"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={tabs.projects.value} className="mt-6 md:mt-8">
            <Projects projects={founder.projects || []} />
          </TabsContent>
          <TabsContent value={tabs.skills.value} className="mt-6 md:mt-8">
            <Skills skills={founder.skills || []} />
          </TabsContent>
          <TabsContent value={tabs.education.value} className="mt-6 md:mt-8">
            <Education education={founder.education || []} />
          </TabsContent>
          <TabsContent value={tabs.stack.value} className="mt-6 md:mt-8">
            <Stack stack={founder.stack || []} />
          </TabsContent>
        </Tabs>
      </div>
    </Section>
  );
}
