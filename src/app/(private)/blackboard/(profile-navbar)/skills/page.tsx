"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUserSkillsAction } from "@/actions/skills/fetch";
import { updateSkillAction } from "@/actions/skills/update";
import { deleteSkillAction } from "@/actions/skills/delete";
import { toast } from "sonner";
import { Trash2, Star, Hexagon } from "lucide-react";
import { skillsMap } from "@/components/website/skills_stack_map";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Skill {
  id: string;
  skill_id: string;
  category: string;
  level: number;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    skill_id: "",
    category: "",
    level: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedSkillCategory, setSelectedSkillCategory] =
    useState<string>("");

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    const result = await fetchUserSkillsAction({});
    if (result?.data?.success && result?.data?.data) {
      setSkills(result.data.data as Skill[]);
    } else {
      toast.error(result?.data?.error || "failed to fetch skills");
    }
  }

  function handleNewSkillChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setNewSkill((prev) => ({
      ...prev,
      [name]: name === "level" ? parseInt(value) : value,
    }));
  }

  function handleCategoryChange(value: string) {
    setSelectedSkillCategory(value);
    setNewSkill((prev) => ({
      ...prev,
      category: value,
      skill_id: "", // reset skill when category changes
    }));
  }

  function handleSkillChange(value: string) {
    setNewSkill((prev) => ({
      ...prev,
      skill_id: value,
    }));
  }

  function handleLevelChange(value: string) {
    setNewSkill((prev) => ({
      ...prev,
      level: parseInt(value),
    }));
  }

  async function handleDelete(skillId: string) {
    setIsDeleting(skillId);
    try {
      const result = await deleteSkillAction({ id: skillId });
      if (result?.data?.success) {
        toast.success("skill deleted successfully!");
        await fetchSkills();
      } else {
        toast.error(result?.data?.error || "failed to delete skill");
      }
    } catch (error) {
      toast.error("an unexpected error occurred");
    } finally {
      setIsDeleting(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateSkillAction({
        skill_id: newSkill.skill_id || "",
        category: newSkill.category || "",
        level: newSkill.level || 1,
      });

      if (result?.data?.success) {
        toast.success("skill added successfully!");
        setNewSkill({
          skill_id: "",
          category: selectedSkillCategory,
          level: 1,
        });
        await fetchSkills();
      } else {
        toast.error(result?.data?.error || "failed to add skill");
      }
    } catch (error) {
      toast.error("an unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredSkills = selectedCategory
    ? skills.filter((skill) => skill.category === selectedCategory)
    : skills;

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* add skill form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>add new skill</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="category">category</Label>
                    <Select
                      value={selectedSkillCategory}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {skillsMap.categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="skill">skill</Label>
                    <Select
                      value={newSkill.skill_id}
                      onValueChange={handleSkillChange}
                      disabled={!selectedSkillCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="select a skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedSkillCategory &&
                          skillsMap.categories
                            .find((c) => c.id === selectedSkillCategory)
                            ?.skills.map((skill) => (
                              <SelectItem key={skill.id} value={skill.id}>
                                {skill.name}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>proficiency level</Label>
                    <ToggleGroup
                      type="single"
                      value={newSkill.level?.toString()}
                      onValueChange={handleLevelChange}
                      className="justify-start mt-2"
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <ToggleGroupItem
                          key={level}
                          value={level.toString()}
                          aria-label={`level ${level}`}
                          className="size-6 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        >
                          {level}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !newSkill.skill_id}
                    className="w-full"
                  >
                    {isSubmitting ? "adding..." : "add skill"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* skills list */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>your skills</CardTitle>
                  <Select
                    value={selectedCategory || "all"}
                    onValueChange={(value) =>
                      setSelectedCategory(value === "all" ? null : value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">all categories</SelectItem>
                      {skillsMap.categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSkills.length === 0 ? (
                    <p className="text-center text-gray-500">
                      no skills added yet
                    </p>
                  ) : (
                    filteredSkills.map((skill) => (
                      <Card
                        key={skill.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">
                                {skillsMap.categories
                                  .find((c) => c.id === skill.category)
                                  ?.skills.find((s) => s.id === skill.skill_id)
                                  ?.name || skill.skill_id}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {skillsMap.categories.find(
                                  (c) => c.id === skill.category
                                )?.name || skill.category}
                              </p>
                              <div className="flex gap-1 mt-1">
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <Hexagon
                                    key={index}
                                    className={`h-4 w-4 ${
                                      index < skill.level
                                        ? "text-blue-400 fill-blue-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(skill.id)}
                              disabled={isDeleting === skill.id}
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
