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
import { Trash2, Star } from "lucide-react";

interface Skill {
  id: string;
  skill: string;
  level: number;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    skill: "",
    level: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    const result = await fetchUserSkillsAction({});
    if (result?.data?.success && result?.data?.data) {
      setSkills(result.data.data as Skill[]);
    } else {
      toast.error(result?.data?.error || "Failed to fetch skills");
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

  async function handleDelete(skillId: string) {
    setIsDeleting(skillId);
    try {
      const result = await deleteSkillAction({ id: skillId });
      if (result?.data?.success) {
        toast.success("Skill deleted successfully!");
        await fetchSkills();
      } else {
        toast.error(result?.data?.error || "Failed to delete skill");
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
      const result = await updateSkillAction({
        skill: newSkill.skill || "",
        level: newSkill.level || 1,
      });

      if (result?.data?.success) {
        toast.success("Skill added successfully!");
        setNewSkill({
          skill: "",
          level: 1,
        });
        await fetchSkills();
      } else {
        toast.error(result?.data?.error || "Failed to add skill");
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
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Skill Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add new skill</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="skill">Skill Name</Label>
                    <Input
                      id="skill"
                      name="skill"
                      value={newSkill.skill}
                      onChange={handleNewSkillChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="level">Proficiency Level (1-5)</Label>
                    <Input
                      id="level"
                      name="level"
                      type="number"
                      min="1"
                      max="5"
                      value={newSkill.level}
                      onChange={handleNewSkillChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Adding..." : "Add Skill"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Skills List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills.length === 0 ? (
                    <p className="text-center text-gray-500">
                      No skills added yet
                    </p>
                  ) : (
                    skills.map((skill) => (
                      <Card
                        key={skill.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{skill.skill}</h3>
                              <div className="flex gap-1 mt-1">
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <Star
                                    key={index}
                                    className={`h-4 w-4 ${
                                      index < skill.level
                                        ? "text-yellow-400 fill-yellow-400"
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
