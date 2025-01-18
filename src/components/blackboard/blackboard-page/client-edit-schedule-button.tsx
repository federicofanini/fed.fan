"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "lucide-react";
import { setWorkoutFrequency } from "@/actions/workout/workout-frequency";
import { toast } from "sonner";

interface Day {
  value: string;
  label: string;
}

interface ClientEditScheduleButtonProps {
  days: Day[];
  initialFrequency: string;
}

export function ClientEditScheduleButton({
  days,
  initialFrequency,
}: ClientEditScheduleButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    initialFrequency.split(",")
  );

  async function handleSave() {
    const frequency = selectedDays.sort().join(",");
    const response = await setWorkoutFrequency({ frequency });

    if (response?.data?.success) {
      toast.success("Workout schedule updated");
      setOpen(false);
    } else {
      toast.error("Failed to update workout schedule");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 h-8">
          <Calendar className="h-4 w-4" />
          Edit Schedule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Workout Schedule</DialogTitle>
          <DialogDescription>
            Select the days you want to work out. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <ToggleGroup
          type="multiple"
          value={selectedDays}
          onValueChange={setSelectedDays}
          className="justify-start"
        >
          {days.map((day) => (
            <ToggleGroupItem
              key={day.value}
              value={day.value}
              aria-label={day.label}
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {day.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
