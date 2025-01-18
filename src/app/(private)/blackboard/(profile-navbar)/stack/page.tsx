"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUserStackAction } from "@/actions/stack/fetch";
import { updateStackAction } from "@/actions/stack/update";
import { deleteStackAction } from "@/actions/stack/delete";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { techStack } from "@/components/website/skills_stack_map";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Stack {
  id: string;
  category: string;
  subcategory: string;
  item: string;
}

export default function StackPage() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newStack, setNewStack] = useState<Partial<Stack>>({
    category: "",
    subcategory: "",
    item: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchStacks();
  }, []);

  async function fetchStacks() {
    const result = await fetchUserStackAction({});
    if (result?.data?.success && result?.data?.data) {
      setStacks(result.data.data as Stack[]);
    } else {
      toast.error(result?.data?.error || "Failed to fetch tech stack");
    }
  }

  async function handleDelete(stackId: string) {
    setIsDeleting(stackId);
    try {
      const result = await deleteStackAction({ id: stackId });
      if (result?.data?.success) {
        toast.success("Tech stack item deleted successfully!");
        await fetchStacks();
      } else {
        toast.error(result?.data?.error || "Failed to delete tech stack item");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateStackAction({
        category: newStack.category || "",
        subcategory: newStack.subcategory || "",
        item: newStack.item || "",
      });

      if (result?.data?.success) {
        toast.success("Tech stack item added successfully!");
        setNewStack({
          category: newStack.category,
          subcategory: "",
          item: "",
        });
        await fetchStacks();
      } else {
        toast.error(result?.data?.error || "Failed to add tech stack item");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredStacks = selectedCategory
    ? stacks.filter((stack) => stack.category === selectedCategory)
    : stacks;

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Tech Stack</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Tech Stack Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add new tech stack item</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newStack.category}
                      onValueChange={(value) =>
                        setNewStack((prev) => ({
                          ...prev,
                          category: value,
                          subcategory: "",
                          item: "",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {techStack.map((category) => (
                          <SelectItem
                            key={category.category}
                            value={category.category}
                          >
                            {category.category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select
                      value={newStack.subcategory}
                      onValueChange={(value) =>
                        setNewStack((prev) => ({
                          ...prev,
                          subcategory: value,
                          item: "",
                        }))
                      }
                      disabled={!newStack.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {newStack.category &&
                          techStack
                            .find((c) => c.category === newStack.category)
                            ?.subcategories.map((sub) => (
                              <SelectItem key={sub.name} value={sub.name}>
                                {sub.name}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="item">Technology</Label>
                    <Select
                      value={newStack.item}
                      onValueChange={(value) =>
                        setNewStack((prev) => ({ ...prev, item: value }))
                      }
                      disabled={!newStack.subcategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a technology" />
                      </SelectTrigger>
                      <SelectContent>
                        {newStack.category &&
                          newStack.subcategory &&
                          techStack
                            .find((c) => c.category === newStack.category)
                            ?.subcategories.find(
                              (s) => s.name === newStack.subcategory
                            )
                            ?.items.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !newStack.item}
                    className="w-full"
                  >
                    {isSubmitting ? "Adding..." : "Add Technology"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Tech Stack List */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your Tech Stack</CardTitle>
                  <Select
                    value={selectedCategory || "all"}
                    onValueChange={(value) =>
                      setSelectedCategory(value === "all" ? null : value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {techStack.map((category) => (
                        <SelectItem
                          key={category.category}
                          value={category.category}
                        >
                          {category.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStacks.length === 0 ? (
                    <p className="text-center text-gray-500">
                      No tech stack items added yet
                    </p>
                  ) : (
                    filteredStacks.map((stack) => (
                      <Card
                        key={stack.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{stack.item}</h3>
                              <p className="text-sm text-gray-500">
                                {stack.category} / {stack.subcategory}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(stack.id)}
                              disabled={isDeleting === stack.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
