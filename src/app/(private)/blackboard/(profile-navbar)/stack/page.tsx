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

interface Stack {
  id: string;
  stack: string;
}

export default function StackPage() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [newStack, setNewStack] = useState("");
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
        stack: newStack,
      });

      if (result?.data?.success) {
        toast.success("Tech stack item added successfully!");
        setNewStack("");
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
                    <Label htmlFor="stack">Technology Name</Label>
                    <Input
                      id="stack"
                      value={newStack}
                      onChange={(e) => setNewStack(e.target.value)}
                      required
                      placeholder="e.g., React, Node.js, TypeScript"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
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
                <CardTitle>Your Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stacks.length === 0 ? (
                    <p className="text-center text-gray-500">
                      No tech stack items added yet
                    </p>
                  ) : (
                    stacks.map((stack) => (
                      <Card
                        key={stack.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold">{stack.stack}</h3>
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
