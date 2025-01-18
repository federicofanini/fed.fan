import { Badge } from "../ui/badge";

export interface Stack {
  id: string;
  stack: string;
}

export function Stack({ stack }: { stack: Stack[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {stack.map((item) => (
        <Badge key={item.id} variant="secondary" className="rounded-md">
          {item.stack}
        </Badge>
      ))}
    </div>
  );
}
