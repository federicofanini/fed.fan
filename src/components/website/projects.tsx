import Link from "next/link";
import { Badge } from "../ui/badge";
import { Link2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
}

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="group bg-card/50 hover:bg-card/80 border border-border/50 hover:border-border/80 rounded-lg p-4 transition-all"
        >
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border border-border/50">
              <AvatarImage
                src={`https://www.google.com/s2/favicons?domain=${project.url}&sz=64`}
                alt={`${project.name} favicon`}
                className="bg-white"
              />
              <AvatarFallback className="bg-muted">
                <Link2 className="h-4 w-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold tracking-tight truncate">
                  {project.name}
                </h3>
                {project.url && (
                  <Link
                    href={project.url}
                    target="_blank"
                    className="flex-shrink-0"
                  >
                    <Badge
                      variant="secondary"
                      className="text-xs font-normal hover:bg-secondary/80"
                    >
                      <Link2 className="size-3 mr-1.5" />
                      {project.url.replace(/^https?:\/\//, "")}
                    </Badge>
                  </Link>
                )}
              </div>
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {project.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
