import { Badge } from "../ui/badge";

export interface Skill {
  id: string;
  skill: string;
  level: number;
}

export function Skills({ skills }: { skills: Skill[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <Badge key={skill.id} variant="secondary" className="rounded-md">
          {skill.skill}
          <span className="ml-1 text-xs text-muted-foreground">
            Lv.{skill.level}
          </span>
        </Badge>
      ))}
    </div>
  );
}
