import { Badge } from "../ui/badge";

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
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-medium capitalize">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <Badge key={skill.id} variant="secondary" className="rounded-md">
                {skill.skill}
                <span className="ml-1 text-xs text-muted-foreground">
                  Lv.{skill.level}
                </span>
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
