import { Badge } from "../ui/badge";
import { skillsMap } from "./skills_stack_map";
import { Hexagon } from "lucide-react";

export interface Skill {
  id: string;
  skill: string;
  level: number;
  category: string;
}

export function Skills({ skills }: { skills: Skill[] }) {
  if (!skills || skills.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No skills added yet
      </div>
    );
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category =
      skillsMap.categories.find((c) => c.id === skill.category)?.name || "";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-medium capitalize">
            {category.replace(/-/g, " ")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorySkills.map((skill) => {
              const formattedSkill = skill.skill.replace(/-/g, " ");
              return (
                <div key={skill.id} className="flex-1">
                  <Badge
                    variant="outline"
                    className="w-full rounded-md flex items-center justify-between p-2"
                  >
                    <span className="truncate">{formattedSkill}</span>
                    <span className="flex gap-1 flex-shrink-0 ml-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Hexagon
                          key={index}
                          className={`h-3 w-3 ${
                            index < skill.level
                              ? "text-blue-400 fill-blue-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </span>
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
