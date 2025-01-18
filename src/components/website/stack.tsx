import { Badge } from "../ui/badge";
import { techStack } from "./skills_stack_map";

export interface Stack {
  id: string;
  category: string;
  subcategory: string;
  item: string;
}

export function Stack({ stack }: { stack: Stack[] }) {
  if (!stack || stack.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No stack items added yet
      </div>
    );
  }

  // Group items by category and subcategory
  const groupedStack = stack.reduce((acc, item) => {
    const category = techStack.find((c) => c.category === item.category);
    if (!category) return acc;

    if (!acc[item.category]) {
      acc[item.category] = {};
    }

    const subcategory = category.subcategories.find(
      (s) => s.name === item.subcategory
    );
    if (!subcategory) return acc;

    if (!acc[item.category][item.subcategory]) {
      acc[item.category][item.subcategory] = [];
    }

    acc[item.category][item.subcategory].push(item);
    return acc;
  }, {} as Record<string, Record<string, Stack[]>>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedStack).map(([category, subcategories]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-medium capitalize">
            {category.replace(/-/g, " ")}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(subcategories).map(([subcategory, items]) => (
              <div key={subcategory} className="space-y-2">
                <h4 className="text-sm text-muted-foreground capitalize">
                  {subcategory.replace(/_/g, " ")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {items.map((item) => (
                    <Badge
                      key={item.id}
                      variant="outline"
                      className="w-full rounded-md flex items-center justify-between p-2"
                    >
                      <span className="truncate">{item.item}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
