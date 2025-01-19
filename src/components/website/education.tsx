import { GraduationCap } from "lucide-react";

export interface Education {
  id: string;
  school: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
}

export function Education({ education }: { education: Education[] }) {
  if (!education || education.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No education added yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {education.map((edu) => (
        <div
          key={edu.id}
          className="group bg-card/50 hover:bg-card/80 border border-border/50 hover:border-border/80 rounded-lg p-4 transition-all"
        >
          <div className="space-y-4">
            <h3 className="font-semibold text-lg capitalize flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-blue-400" />
              {edu.school}
            </h3>
            <div className="space-y-2">
              <div className="bg-secondary/30 rounded-lg p-3 hover:bg-secondary/50 transition-colors">
                <p className="text-sm font-medium">
                  {edu.degree} in {edu.field_of_study}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(edu.start_date).getFullYear()} -{" "}
                  {new Date(edu.end_date).getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
