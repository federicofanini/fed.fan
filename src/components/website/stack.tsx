import { Badge } from "../ui/badge";

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
    if (!acc[item.category]) {
      acc[item.category] = {};
    }
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
          <h3 className="text-lg font-medium capitalize">{category}</h3>
          {Object.entries(subcategories).map(([subcategory, items]) => (
            <div key={subcategory} className="space-y-2">
              <h4 className="text-sm text-muted-foreground capitalize">
                {subcategory}
              </h4>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <Badge
                    key={item.id}
                    variant="secondary"
                    className="rounded-md"
                  >
                    {item.item}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
