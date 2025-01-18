"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUserProjectsAction } from "@/actions/projects/fetch";
import { updateProjectAction } from "@/actions/projects/update";
import { deleteProjectAction } from "@/actions/projects/delete";
import { toast } from "sonner";
import { Link2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  image_url: string;
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
      toast.error(result?.data?.error || "Failed to fetch projects");
    }
  }

  function handleNewProjectChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  }

  async function handleDelete(projectId: string) {
    setIsDeleting(projectId);
    try {
      const result = await deleteProjectAction({ id: projectId });
      if (result?.data?.success) {
        toast.success("Project deleted successfully!");
        await fetchProjects();
      } else {
        toast.error(result?.data?.error || "Failed to delete project");
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
      const result = await updateProjectAction({
        name: newProject.name || "",
        description: newProject.description || "",
        url: newProject.url || "",
        image_url: newProject.image_url || "",
      });

      if (result?.data?.success) {
        toast.success("Project added successfully!");
        // Reset form
        setNewProject({
          name: "",
          description: "",
          url: "",
          image_url: "",
        });
        // Refresh projects list
        await fetchProjects();
      } else {
        toast.error(result?.data?.error || "Failed to add project");
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
                            <div>
                              <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-4 h-4">
                                    <AvatarImage
                                      src={`https://www.google.com/s2/favicons?domain=${project.url}&sz=32`}
                                      alt={`${project.name} favicon`}
                                    />
                                    <AvatarFallback>
                                      <Link2 className="h-3 w-3" />
                                    </AvatarFallback>
                                  </Avatar>
                                  {project.name}
                                </div>
                                <Link href={project.url} target="_blank">
                                  <Link2 className="h-4 w-4" />
                                </Link>
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {project.description}
                              </p>
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
