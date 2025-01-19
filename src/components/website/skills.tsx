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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div
          key={category}
          className="group bg-card/50 hover:bg-card/80 border border-border/50 hover:border-border/80 rounded-lg p-4 transition-all"
        >
          <div className="space-y-4">
            <h3 className="font-semibold text-lg capitalize flex items-center gap-2">
              <Hexagon className="h-4 w-4 text-blue-400" />
              {category.replace(/-/g, " ")}
            </h3>
            <div className="grid gap-2">
              {categorySkills.map((skill) => {
                const formattedSkill = skill.skill.replace(/-/g, " ");
                return (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between bg-secondary/30 rounded-lg p-3 hover:bg-secondary/50 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {formattedSkill}
                    </span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Hexagon
                          key={index}
                          className={`h-3 w-3 ${
                            index < skill.level
                              ? "text-blue-400 fill-blue-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
