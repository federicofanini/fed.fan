import Image from "next/image";
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
    <div className="flex flex-col gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-gradient-to-br from-secondary/10 via-background to-background backdrop-blur-sm p-4 border border-secondary/30 hover:border-secondary/50 transition-all hover:shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-secondary/5"
        >
          <div className="flex items-center gap-4">
            <Avatar className="size-8 flex-shrink-0">
              <AvatarImage
                src={`https://www.google.com/s2/favicons?domain=${project.url}&sz=32`}
                alt={`${project.name} favicon`}
              />
              <AvatarFallback>
                <Link2 className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold tracking-tight truncate">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-muted-foreground text-sm line-clamp-1">
                  {project.description}
                </p>
              )}
            </div>

            {project.url && (
              <Link
                href={project.url}
                target="_blank"
                className="flex-shrink-0"
              >
                <Badge
                  variant="outline"
                  className="rounded-md whitespace-nowrap"
                >
                  <Link2 className="size-3 mr-1" />
                  {project.url.replace(/^https?:\/\//, "")}
                </Badge>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
