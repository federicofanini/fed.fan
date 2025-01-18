import { Card, CardContent } from "../ui/card";

export interface Education {
  id: string;
  school: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
}

export function Education({ education }: { education: Education[] }) {
  return (
    <div className="space-y-4">
      {education.map((edu) => (
        <Card key={edu.id}>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{edu.school}</h3>
              <p className="text-muted-foreground">
                {edu.degree} in {edu.field_of_study}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(edu.start_date).getFullYear()} -{" "}
                {new Date(edu.end_date).getFullYear()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
