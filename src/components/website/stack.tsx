import { techStack } from "./skills_stack_map";
import { techStackIcons } from "@/components/blackboard/projects/techStack_map";
import { createElement } from "react";
import { Hexagon } from "lucide-react";

export interface Stack {
  id: string;
  category: string;
  subcategory: string;
  item: string;
}

// Map tech stack names to their icon components
const techStackIconMap = Object.entries(techStackIcons).reduce(
  (acc, [key, Icon]) => {
    acc[key.toLowerCase()] = createElement(Icon, { className: "w-4 h-4" });
    return acc;
  },
  {} as Record<string, JSX.Element>
);

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(groupedStack).map(([category, subcategories]) => (
        <div
          key={category}
          className="group bg-card/50 hover:bg-card/80 border border-border/50 hover:border-border/80 rounded-lg p-4 transition-all"
        >
          <div className="space-y-4">
            <h3 className="font-semibold text-lg capitalize flex items-center gap-2">
              <Hexagon className="h-4 w-4 text-blue-400" />
              {category.replace(/-/g, " ")}
            </h3>
            <div className="space-y-4">
              {Object.entries(subcategories).map(([subcategory, items]) => (
                <div key={subcategory} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground capitalize">
                    {subcategory.replace(/_/g, " ")}
                  </h4>
                  <div className="grid gap-2">
                    {items.map((item) => {
                      const formattedItem = item.item
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ");

                      const iconKey = item.item
                        .toLowerCase()
                        .replace(/[^a-z]/g, "");
                      const iconElement = techStackIconMap[iconKey] || null;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-secondary/30 rounded-lg p-3 hover:bg-secondary/50 transition-colors"
                        >
                          <span className="text-sm font-medium flex items-center gap-2">
                            {iconElement}
                            {formattedItem}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
