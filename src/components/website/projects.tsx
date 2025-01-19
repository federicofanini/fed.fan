import Link from "next/link";
import { Badge } from "../ui/badge";
import { ArrowUpRight, Link2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createElement } from "react";
import { techStackIcons } from "@/components/blackboard/projects/techStack_map";
import { ProjectStatus } from "@/components/blackboard/projects/status_map";

interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  status: ProjectStatus;
  tech_stack: string;
  tags: string;
}

export function Projects({
  projects,
  status,
}: {
  projects: Project[];
  status?: ProjectStatus;
}) {
  const statusColors = {
    active: "bg-green-500",
    inactive: "bg-cyan-500",
    building: "bg-yellow-500",
    sold: "bg-purple-500",
    abandoned: "bg-gray-500",
    failed: "bg-red-500",
  };

  const statusOrder = {
    active: 1,
    building: 2,
    sold: 3,
    abandoned: 4,
    inactive: 5,
    failed: 6,
  };

  const filteredProjects = status
    ? projects.filter((project) => project.status === status)
    : projects;

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    // First sort by status priority
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;

    // Then sort by category
    return a.category.localeCompare(b.category);
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedProjects.map((project) => (
          <div
            key={project.id}
            className="group bg-card/50 hover:bg-card/80 border border-border/50 hover:border-border/80 rounded-lg p-4 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2 w-full">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-4 h-4">
                        <AvatarImage
                          src={`https://www.google.com/s2/favicons?domain=${project.url}&sz=64`}
                          alt={`${project.name} favicon`}
                        />
                        <AvatarFallback>
                          <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      {project.name}
                    </div>
                    {project.url && (
                      <Link href={project.url} target="_blank">
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    )}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full animate-pulse ${
                        statusColors[project.status]
                      }`}
                    />
                    <p className="text-sm text-muted-foreground capitalize">
                      {project.status}
                    </p>
                  </div>
                </div>
                {project.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 py-1">
                    {project.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 items-center py-1">
                  {project.tech_stack &&
                    techStackIcons[
                      project.tech_stack as keyof typeof techStackIcons
                    ] && (
                      <div className="flex items-center gap-1">
                        {createElement(
                          techStackIcons[
                            project.tech_stack as keyof typeof techStackIcons
                          ],
                          {
                            className: "w-4 h-4",
                          }
                        )}
                      </div>
                    )}
                  {project.tags && (
                    <Badge variant="secondary" className="py-1 rounded-full">
                      {project.tags}
                    </Badge>
                  )}
                  <Badge variant="outline" className="py-1">
                    {project.category}
                  </Badge>
                  <Badge variant="outline" className="py-1">
                    {project.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
