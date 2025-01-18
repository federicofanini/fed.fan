"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUserEducationAction } from "@/actions/education/fetch";
import { updateEducationAction } from "@/actions/education/update";
import { deleteEducationAction } from "@/actions/education/delete";
import { toast } from "sonner";
import { Trash2, CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Education {
  id: string;
  school: string;
  degree: string;
  field_of_study: string;
  start_date: Date;
  end_date: Date;
}

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [newEducation, setNewEducation] = useState<Partial<Education>>({
    school: "",
    degree: "",
    field_of_study: "",
    start_date: new Date(),
    end_date: new Date(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  async function fetchEducation() {
    const result = await fetchUserEducationAction({});
    if (result?.data?.success && result?.data?.data) {
      setEducation(result.data.data as Education[]);
    } else {
      toast.error(result?.data?.error || "Failed to fetch education");
    }
  }

  function handleNewEducationChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setNewEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleDateChange(
    date: Date | undefined,
    field: "start_date" | "end_date"
  ) {
    if (date) {
      setNewEducation((prev) => ({
        ...prev,
        [field]: date,
      }));
    }
  }

  async function handleDelete(educationId: string) {
    setIsDeleting(educationId);
    try {
      const result = await deleteEducationAction({ id: educationId });
      if (result?.data?.success) {
        toast.success("Education entry deleted successfully!");
        await fetchEducation();
      } else {
        toast.error(result?.data?.error || "Failed to delete education entry");
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
      const result = await updateEducationAction({
        school: newEducation.school || "",
        degree: newEducation.degree || "",
        field_of_study: newEducation.field_of_study || "",
        start_date: newEducation.start_date?.toISOString() || "",
        end_date: newEducation.end_date?.toISOString() || "",
      });

      if (result?.data?.success) {
        toast.success("Education added successfully!");
        setNewEducation({
          school: "",
          degree: "",
          field_of_study: "",
          start_date: new Date(),
          end_date: new Date(),
        });
        await fetchEducation();
      } else {
        toast.error(result?.data?.error || "Failed to add education");
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
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Education Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add new education</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="school">School</Label>
                    <Input
                      id="school"
                      name="school"
                      value={newEducation.school}
                      onChange={handleNewEducationChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="degree">Degree</Label>
                    <Input
                      id="degree"
                      name="degree"
                      value={newEducation.degree}
                      onChange={handleNewEducationChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="field_of_study">Field of Study</Label>
                    <Input
                      id="field_of_study"
                      name="field_of_study"
                      value={newEducation.field_of_study}
                      onChange={handleNewEducationChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newEducation.start_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newEducation.start_date ? (
                            format(newEducation.start_date, "PPP")
                          ) : (
                            <span>Pick a start date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newEducation.start_date}
                          onSelect={(date) =>
                            handleDateChange(date, "start_date")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newEducation.end_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newEducation.end_date ? (
                            format(newEducation.end_date, "PPP")
                          ) : (
                            <span>Pick an end date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newEducation.end_date}
                          onSelect={(date) =>
                            handleDateChange(date, "end_date")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Adding..." : "Add Education"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Education List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {education.length === 0 ? (
                    <p className="text-center text-gray-500">
                      No education entries added yet
                    </p>
                  ) : (
                    education.map((edu) => (
                      <Card
                        key={edu.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{edu.school}</h3>
                              <p className="text-sm text-gray-600">
                                {edu.degree}
                              </p>
                              <p className="text-sm text-gray-600">
                                {edu.field_of_study}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(edu.start_date).toLocaleDateString()}{" "}
                                - {new Date(edu.end_date).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(edu.id)}
                              disabled={isDeleting === edu.id}
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
