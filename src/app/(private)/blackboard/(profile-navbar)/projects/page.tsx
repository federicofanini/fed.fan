"use client";

import { createElement, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUserProjectsAction } from "@/actions/projects/fetch";
import { updateProjectAction } from "@/actions/projects/update";
import { deleteProjectAction } from "@/actions/projects/delete";
import { toast } from "sonner";
import { ArrowUpRight, Link2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ProjectCategory,
  projectCategories,
} from "@/components/blackboard/projects/category_map";
import {
  ProjectStatus,
  projectStatuses,
} from "@/components/blackboard/projects/status_map";
import { projectTags } from "@/components/blackboard/projects/tags_map";
import {
  techStackCategories,
  techStackIcons,
} from "@/components/blackboard/projects/techStack_map";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  image_url: string;
  category: ProjectCategory;
  status: ProjectStatus;
  tech_stack: string;
  tags: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: "",
    description: "",
    url: "",
    image_url: "",
    category: "web",
    status: "active",
    tech_stack: "",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const result = await fetchUserProjectsAction({});
    if (result?.data?.success && result?.data?.data) {
      setProjects(result.data.data as Project[]);
    } else {
      console.error("Failed to fetch projects:", result?.data?.error);
      toast.error(result?.data?.error || "Failed to fetch projects");
    }
  }

  function handleNewProjectChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(name: string, value: string) {
    setNewProject((prev) => ({ ...prev, [name]: value }));
  }

  function handleTagSelect(value: string) {
    setNewProject((prev) => ({
      ...prev,
      tags: value,
    }));
  }

  async function handleDelete(projectId: string) {
    setIsDeleting(projectId);
    try {
      const result = await deleteProjectAction({ id: projectId });
      if (result?.data?.success) {
        toast.success("Project deleted successfully!");
        await fetchProjects();
      } else {
        console.error("Failed to delete project:", result?.data?.error);
        toast.error(result?.data?.error || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateProjectAction({
        input: {
          name: newProject.name || "",
          description: newProject.description || "",
          url: newProject.url || "",
          image_url: newProject.image_url || "",
          category: newProject.category || "web",
          status: newProject.status || "active",
          tech_stack: newProject.tech_stack || "",
          tags: newProject.tags || "",
        },
      });

      if (result?.data?.success) {
        toast.success("Project added successfully!");
        setNewProject({
          name: "",
          description: "",
          url: "",
          image_url: "",
          category: "web",
          status: "active",
          tech_stack: "",
          tags: "",
        });
        await fetchProjects();
      } else {
        console.error("Failed to add project:", result?.data?.error);
        toast.error(result?.data?.error || "Failed to add project");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Project Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add new project</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newProject.name}
                      onChange={handleNewProjectChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newProject.description}
                      onChange={handleNewProjectChange}
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="url">Website URL</Label>
                    <Input
                      id="url"
                      name="url"
                      value={newProject.url}
                      onChange={handleNewProjectChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newProject.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newProject.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tag</Label>
                    <Select
                      value={newProject.tags}
                      onValueChange={handleTagSelect}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {newProject.tags && (
                      <div className="mt-2">
                        <Badge variant="secondary">{newProject.tags}</Badge>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="tech_stack">Tech Stack</Label>
                    <Select
                      value={newProject.tech_stack}
                      onValueChange={(value) =>
                        handleSelectChange("tech_stack", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tech stack" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(techStackCategories).map(
                          ([category, items]) => (
                            <SelectGroup key={category}>
                              <SelectLabel>{category}</SelectLabel>
                              {items.map((item) => (
                                <SelectItem key={item} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Adding..." : "Add Project"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Projects List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <p className="text-center text-gray-500">
                      No projects added yet
                    </p>
                  ) : (
                    projects.map((project) => (
                      <Card
                        key={project.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2 w-full">
                              <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-4 h-4">
                                    <AvatarImage
                                      src={`https://www.google.com/s2/favicons?domain=${project.url}&sz=64`}
                                      alt={`${project.name} favicon`}
                                      className="bg-white"
                                    />
                                    <AvatarFallback>
                                      <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                                    </AvatarFallback>
                                  </Avatar>
                                  {project.name}
                                </div>
                                <Link href={project.url} target="_blank">
                                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-2 items-center">
                                {project.tech_stack &&
                                  techStackIcons[
                                    project.tech_stack as keyof typeof techStackIcons
                                  ] && (
                                    <div className="flex items-center gap-1">
                                      {createElement(
                                        techStackIcons[
                                          project.tech_stack as keyof typeof techStackIcons
                                        ],
                                        {
                                          className: "w-4 h-4",
                                        }
                                      )}
                                    </div>
                                  )}
                                {project.tags && (
                                  <Badge
                                    variant="secondary"
                                    className="py-1 rounded-full"
                                  >
                                    {project.tags}
                                  </Badge>
                                )}
                                <Badge variant="outline" className="py-1">
                                  {project.category}
                                </Badge>
                                <Badge variant="outline" className="py-1">
                                  {project.status}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(project.id)}
                              disabled={isDeleting === project.id}
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
